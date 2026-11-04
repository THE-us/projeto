USE database_radar;

CREATE TABLE IF NOT EXISTS tb_metricas_dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa_frequente VARCHAR(7),
    total_passagens_veiculo INT,
    equipamento_id INT,
    total_passagens_equipamento INT,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO tb_metricas_dashboard (id) VALUES (1);

DROP PROCEDURE IF EXISTS SP_ATUALIZAR_METRICAS;
DROP EVENT IF EXISTS evt_atualizar_metricas_fluxo;

DELIMITER $$

CREATE PROCEDURE SP_ATUALIZAR_METRICAS()
BEGIN
    DECLARE v_placa VARCHAR(7);
    DECLARE v_total_placa INT;
    DECLARE v_equipamento_id INT;
    DECLARE v_total_equipamento INT;

    SELECT placa, COUNT(*) 
    INTO v_placa, v_total_placa
    FROM fluxo
    WHERE placa IS NOT NULL AND placa <> ''
    GROUP BY placa
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    IF v_placa IS NOT NULL THEN
        SELECT e.id, COUNT(*) 
        INTO v_equipamento_id, v_total_equipamento
        FROM fluxo f
        INNER JOIN equipamentos e ON e.id = f.equipamentoId
        WHERE f.placa = v_placa
        GROUP BY e.id
        ORDER BY COUNT(*) DESC
        LIMIT 1;

        UPDATE tb_metricas_dashboard 
        SET 
            placa_frequente = v_placa,
            total_passagens_veiculo = v_total_placa,
            equipamento_id = v_equipamento_id,
            total_passagens_equipamento = v_total_equipamento,
            atualizado_em = NOW()
        WHERE id = 1;
    END IF;

END$$

DELIMITER ;

DELIMITER //

CREATE EVENT evt_atualizar_metricas_fluxo
ON SCHEDULE EVERY 10 MINUTE
DO
BEGIN
    CALL SP_ATUALIZAR_METRICAS();
END //

DELIMITER ;