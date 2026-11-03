USE database_radar;

-- DROP PROCEDURE IF EXISTS SP_PRIMEIRA_PROCEDURE;
DROP PROCEDURE IF EXISTS SP_VEICULO_MAIS_INCIDENTES;
DROP PROCEDURE IF EXISTS SP_EQUIPAMENTO_MAIS_ANALISOU_VEICULO;

DELIMITER $$

-- CREATE PROCEDURE SP_PRIMEIRA_PROCEDURE()
-- BEGIN
--     SELECT * FROM fluxo;
-- END$$

CREATE PROCEDURE SP_VEICULO_MAIS_INCIDENTES(IN p_limite INT)
BEGIN
    DECLARE v_limite INT DEFAULT 1;

    IF p_limite IS NOT NULL AND p_limite > 0 THEN
        SET v_limite = p_limite;
    END IF;

    SELECT
        f.placa,
        COUNT(*) AS totalPassagens,
        MIN(f.data) AS primeiraPassagem,
        MAX(f.data) AS ultimaPassagem
    FROM fluxo f
    WHERE f.placa IS NOT NULL
      AND f.placa <> ''
    GROUP BY f.placa
    ORDER BY totalPassagens DESC, f.placa ASC
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
        f.placa,
        COUNT(*) AS totalPassagens,
        MIN(f.data) AS primeiraPassagem,
        MAX(f.data) AS ultimaPassagem
    FROM fluxo f
    INNER JOIN equipamentos e ON e.id = f.equipamentoId
    WHERE f.placa = p_placa
    GROUP BY e.id, e.codigo, e.faixa, e.local, f.placa
    ORDER BY totalPassagens DESC, e.id ASC
    LIMIT v_limite;
END$$

DELIMITER ;
