USE database_radar;

DROP EVENT IF EXISTS evt_atualizar_metricas_fluxo;
DROP PROCEDURE IF EXISTS SP_ATUALIZAR_METRICAS;
DROP PROCEDURE IF EXISTS SP_PRIMEIRA_PROCEDURE;
DROP TABLE IF EXISTS tb_metricas_dashboard;

DROP EVENT IF EXISTS evt_rel_fluxo_diario;
DROP EVENT IF EXISTS evt_rel_fluxo_placa;
DROP PROCEDURE IF EXISTS rotina_fluxo_relatorio_diario;
DROP PROCEDURE IF EXISTS rotina_fluxo_relatorio_placa;
DROP PROCEDURE IF EXISTS SP_VEICULO_MAIS_INCIDENTES;
DROP PROCEDURE IF EXISTS SP_EQUIPAMENTO_MAIS_ANALISOU_VEICULO;
DROP PROCEDURE IF EXISTS aux_criar_indice;
DROP PROCEDURE IF EXISTS aux_remover_indice;

CREATE TABLE IF NOT EXISTS RotinaConfig (
    tipo ENUM('rotina_fluxo_relatorio_diario', 'rotina_fluxo_relatorio_placa') NOT NULL,
    param JSON NOT NULL,
    executando TINYINT NOT NULL DEFAULT 0,
    inicio DATETIME NULL,
    fim DATETIME NULL,
    PRIMARY KEY (tipo)
);

CREATE TABLE IF NOT EXISTS RotinaLog (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    inicio DATETIME NULL,
    fim DATETIME NULL,
    param JSON NULL,
    sucesso TINYINT NOT NULL,
    PRIMARY KEY (id),
    KEY idx_rotinalog_tipo_inicio (tipo, inicio)
);

CREATE TABLE IF NOT EXISTS RelatorioFluxoDiario (
    equipamentoId INT NOT NULL,
    data DATE NOT NULL,
    total INT NOT NULL DEFAULT 0,
    PRIMARY KEY (equipamentoId, data),
    KEY idx_relatoriofluxodiario_data (data)
);

CREATE TABLE IF NOT EXISTS RelatorioFluxoPlaca (
    placa VARCHAR(7) NOT NULL,
    equipamentoId INT NOT NULL,
    total INT NOT NULL DEFAULT 0,
    primeiraPassagem DATETIME NULL,
    ultimaPassagem DATETIME NULL,
    PRIMARY KEY (placa, equipamentoId),
    KEY idx_relatoriofluxoplaca_total (total)
);

INSERT IGNORE INTO RotinaConfig (tipo, param, executando) VALUES
    ('rotina_fluxo_relatorio_diario', JSON_OBJECT('idFinal', 0, 'tamanhoMaximo', 1000000), 0),
    ('rotina_fluxo_relatorio_placa', JSON_OBJECT('idFinal', 0, 'tamanhoMaximo', 1000000), 0);

DELIMITER $$

CREATE PROCEDURE aux_criar_indice(IN pTabela VARCHAR(64), IN pIndice VARCHAR(64), IN pColunas VARCHAR(255))
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = pTabela
          AND INDEX_NAME = pIndice
    ) THEN
        SET @sqlIndice = CONCAT('CREATE INDEX ', pIndice, ' ON ', pTabela, ' (', pColunas, ')');
        PREPARE stmtIndice FROM @sqlIndice;
        EXECUTE stmtIndice;
        DEALLOCATE PREPARE stmtIndice;
    END IF;
END$$

CREATE PROCEDURE aux_remover_indice(IN pTabela VARCHAR(64), IN pIndice VARCHAR(64))
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = pTabela
          AND INDEX_NAME = pIndice
    ) THEN
        SET @sqlIndice = CONCAT('DROP INDEX ', pIndice, ' ON ', pTabela);
        PREPARE stmtIndice FROM @sqlIndice;
        EXECUTE stmtIndice;
        DEALLOCATE PREPARE stmtIndice;
    END IF;
END$$

CREATE PROCEDURE rotina_fluxo_relatorio_diario()
proc: BEGIN
    DECLARE vIdFinalProcAnterior BIGINT;
    DECLARE vIdInicial BIGINT;
    DECLARE vIdFinal BIGINT;
    DECLARE vTamanhoMaximo BIGINT;
    DECLARE vExecutando TINYINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_fluxo_relatorio_diario';
    DECLARE vCont INT DEFAULT 0;
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            vSqlState = RETURNED_SQLSTATE,
            vErrorCode = MYSQL_ERRNO,
            vErrorMessage = MESSAGE_TEXT;
        ROLLBACK;
        SET vFim = NOW();
        UPDATE RotinaConfig
            SET executando = 0,
                fim = vFim
            WHERE tipo = vTipo;
        INSERT INTO RotinaLog (tipo, inicio, fim, param, sucesso)
            VALUES (
                vTipo,
                vInicio,
                vFim,
                JSON_OBJECT(
                    'idInicial', vIdInicial,
                    'idFinal', vIdFinal,
                    'total', NULL,
                    'errorCode', vErrorCode,
                    'sqlState', vSqlState,
                    'message', vErrorMessage),
                0);
    END;

    SET vInicio = NOW();

    START TRANSACTION;
    SELECT param->>'$.idFinal', param->>'$.tamanhoMaximo', executando
        INTO vIdFinalProcAnterior, vTamanhoMaximo, vExecutando
        FROM RotinaConfig
        WHERE tipo = vTipo
        FOR UPDATE;
    IF vExecutando = 1 THEN
        COMMIT;
        LEAVE proc;
    ELSE
        UPDATE RotinaConfig
            SET executando = 1,
                inicio = vInicio
            WHERE tipo = vTipo;
        COMMIT;
    END IF;

    SELECT MIN(lote.id), MAX(lote.id), COUNT(*)
        INTO vIdInicial, vIdFinal, vCont
        FROM (
            SELECT id
            FROM fluxo
            WHERE id > vIdFinalProcAnterior
            ORDER BY id ASC
            LIMIT vTamanhoMaximo
        ) AS lote;

    START TRANSACTION;

    IF vCont > 0 THEN
        INSERT INTO RelatorioFluxoDiario (equipamentoId, data, total)
        SELECT * FROM (
            SELECT
                f.equipamentoId AS equipamentoId,
                DATE(f.data) AS data,
                COUNT(*) AS quantidade
            FROM fluxo f
            WHERE f.id BETWEEN vIdInicial AND vIdFinal
              AND f.equipamentoId IS NOT NULL
              AND f.equipamentoId > 0
              AND f.data IS NOT NULL
            GROUP BY f.equipamentoId, DATE(f.data)
        ) AS novos
        ON DUPLICATE KEY UPDATE
            total = RelatorioFluxoDiario.total + novos.quantidade;

        UPDATE RotinaConfig
            SET param = JSON_SET(param, '$.idFinal', vIdFinal)
            WHERE tipo = vTipo;
    END IF;

    SET vFim = NOW();

    UPDATE RotinaConfig
        SET executando = 0,
            fim = vFim
        WHERE tipo = vTipo;

    COMMIT;

    INSERT INTO RotinaLog (tipo, inicio, fim, param, sucesso)
        VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idInicial', vIdInicial, 'idFinal', vIdFinal, 'total', vCont), 1);
END$$

CREATE PROCEDURE rotina_fluxo_relatorio_placa()
proc: BEGIN
    DECLARE vIdFinalProcAnterior BIGINT;
    DECLARE vIdInicial BIGINT;
    DECLARE vIdFinal BIGINT;
    DECLARE vTamanhoMaximo BIGINT;
    DECLARE vExecutando TINYINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_fluxo_relatorio_placa';
    DECLARE vCont INT DEFAULT 0;
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            vSqlState = RETURNED_SQLSTATE,
            vErrorCode = MYSQL_ERRNO,
            vErrorMessage = MESSAGE_TEXT;
        ROLLBACK;
        SET vFim = NOW();
        UPDATE RotinaConfig
            SET executando = 0,
                fim = vFim
            WHERE tipo = vTipo;
        INSERT INTO RotinaLog (tipo, inicio, fim, param, sucesso)
            VALUES (
                vTipo,
                vInicio,
                vFim,
                JSON_OBJECT(
                    'idInicial', vIdInicial,
                    'idFinal', vIdFinal,
                    'total', NULL,
                    'errorCode', vErrorCode,
                    'sqlState', vSqlState,
                    'message', vErrorMessage),
                0);
    END;

    SET vInicio = NOW();

    START TRANSACTION;
    SELECT param->>'$.idFinal', param->>'$.tamanhoMaximo', executando
        INTO vIdFinalProcAnterior, vTamanhoMaximo, vExecutando
        FROM RotinaConfig
        WHERE tipo = vTipo
        FOR UPDATE;
    IF vExecutando = 1 THEN
        COMMIT;
        LEAVE proc;
    ELSE
        UPDATE RotinaConfig
            SET executando = 1,
                inicio = vInicio
            WHERE tipo = vTipo;
        COMMIT;
    END IF;

    SELECT MIN(lote.id), MAX(lote.id), COUNT(*)
        INTO vIdInicial, vIdFinal, vCont
        FROM (
            SELECT id
            FROM fluxo
            WHERE id > vIdFinalProcAnterior
            ORDER BY id ASC
            LIMIT vTamanhoMaximo
        ) AS lote;

    START TRANSACTION;

    IF vCont > 0 THEN
        INSERT INTO RelatorioFluxoPlaca (placa, equipamentoId, total, primeiraPassagem, ultimaPassagem)
        SELECT * FROM (
            SELECT
                f.placa AS placa,
                f.equipamentoId AS equipamentoId,
                COUNT(*) AS quantidade,
                MIN(TIMESTAMP(f.data, f.hora)) AS primeira,
                MAX(TIMESTAMP(f.data, f.hora)) AS ultima
            FROM fluxo f
            WHERE f.id BETWEEN vIdInicial AND vIdFinal
              AND f.placa IS NOT NULL
              AND TRIM(f.placa) <> ''
              AND f.equipamentoId IS NOT NULL
              AND f.equipamentoId > 0
            GROUP BY f.placa, f.equipamentoId
        ) AS novos
        ON DUPLICATE KEY UPDATE
            total = RelatorioFluxoPlaca.total + novos.quantidade,
            primeiraPassagem = LEAST(
                COALESCE(RelatorioFluxoPlaca.primeiraPassagem, novos.primeira),
                COALESCE(novos.primeira, RelatorioFluxoPlaca.primeiraPassagem)),
            ultimaPassagem = GREATEST(
                COALESCE(RelatorioFluxoPlaca.ultimaPassagem, novos.ultima),
                COALESCE(novos.ultima, RelatorioFluxoPlaca.ultimaPassagem));

        UPDATE RotinaConfig
            SET param = JSON_SET(param, '$.idFinal', vIdFinal)
            WHERE tipo = vTipo;
    END IF;

    SET vFim = NOW();

    UPDATE RotinaConfig
        SET executando = 0,
            fim = vFim
        WHERE tipo = vTipo;

    COMMIT;

    INSERT INTO RotinaLog (tipo, inicio, fim, param, sucesso)
        VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idInicial', vIdInicial, 'idFinal', vIdFinal, 'total', vCont), 1);
END$$

CREATE PROCEDURE SP_VEICULO_MAIS_INCIDENTES(IN p_limite INT)
BEGIN
    DECLARE v_limite INT DEFAULT 1;

    IF p_limite IS NOT NULL AND p_limite > 0 THEN
        SET v_limite = p_limite;
    END IF;

    SELECT
        r.placa,
        CAST(SUM(r.total) AS UNSIGNED) AS totalPassagens,
        COUNT(*) AS totalEquipamentos,
        DATE_FORMAT(MIN(r.primeiraPassagem), '%Y-%m-%d %H:%i:%s') AS primeiraPassagem,
        DATE_FORMAT(MAX(r.ultimaPassagem), '%Y-%m-%d %H:%i:%s') AS ultimaPassagem
    FROM RelatorioFluxoPlaca r
    GROUP BY r.placa
    ORDER BY totalPassagens DESC, r.placa ASC
    LIMIT v_limite;
END$$

CREATE PROCEDURE SP_EQUIPAMENTO_MAIS_ANALISOU_VEICULO(IN p_placa VARCHAR(7), IN p_limite INT)
BEGIN
    DECLARE v_limite INT DEFAULT 1;

    IF p_limite IS NOT NULL AND p_limite > 0 THEN
        SET v_limite = p_limite;
    END IF;

    SELECT
        e.id AS equipamentoId,
        e.codigo,
        e.faixa,
        e.local,
        r.placa,
        r.total AS totalPassagens,
        DATE_FORMAT(r.primeiraPassagem, '%Y-%m-%d %H:%i:%s') AS primeiraPassagem,
        DATE_FORMAT(r.ultimaPassagem, '%Y-%m-%d %H:%i:%s') AS ultimaPassagem
    FROM RelatorioFluxoPlaca r
    INNER JOIN equipamentos e ON e.id = r.equipamentoId
    WHERE r.placa = p_placa
    ORDER BY r.total DESC, e.id ASC
    LIMIT v_limite;
END$$

CREATE EVENT evt_rel_fluxo_diario
ON SCHEDULE EVERY 10 MINUTE
ON COMPLETION PRESERVE
ENABLE
DO
BEGIN
    CALL rotina_fluxo_relatorio_diario();
END$$

CREATE EVENT evt_rel_fluxo_placa
ON SCHEDULE EVERY 10 MINUTE
ON COMPLETION PRESERVE
ENABLE
DO
BEGIN
    CALL rotina_fluxo_relatorio_placa();
END$$

DELIMITER ;

CALL aux_remover_indice('fluxo', 'idx_fluxo_equipamento_data');
CALL aux_criar_indice('fluxo', 'idx_fluxo_data_hora', 'data, hora');
CALL aux_criar_indice('fluxo', 'idx_fluxo_hora', 'hora');
CALL aux_criar_indice('fluxo', 'idx_fluxo_placa', 'placa');
CALL aux_criar_indice('fluxo', 'idx_fluxo_equipamento_data_hora', 'equipamentoId, data, hora');
DROP PROCEDURE IF EXISTS aux_criar_indice;
DROP PROCEDURE IF EXISTS aux_remover_indice;

CALL rotina_fluxo_relatorio_diario();
CALL rotina_fluxo_relatorio_placa();
