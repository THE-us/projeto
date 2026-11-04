-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: webgct-db-fluxoder.chgn33r6nsyr.sa-east-1.rds.amazonaws.com    Database: gctweb_der_mg_fluxo
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `RotinaConfig`
--

DROP TABLE IF EXISTS `RotinaConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RotinaConfig` (
  `tipo` enum('rotina_delete_log_integracao','rotina_delete_fila_integracao','rotina_fluxo_relatorio_volumetrico','rotina_fluxo_relatorio_percentil','rotina_equipamentos_online_fluxo') NOT NULL,
  `param` json NOT NULL,
  `executando` tinyint NOT NULL,
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  PRIMARY KEY (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RelatorioEquipamentosOnline`
--

DROP TABLE IF EXISTS `RelatorioEquipamentosOnline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RelatorioEquipamentosOnline` (
  `equipId` int NOT NULL,
  `dataHoraUltimaPassagem` datetime DEFAULT NULL,
  `idUltimaPassagem` bigint DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`equipId`),
  KEY `idx_dataHoraUltimaPassagem` (`dataHoraUltimaPassagem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'gctweb_der_mg_fluxo'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `evt_delete_integracoes` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'UTC' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`admin_fluxoder`@`%`*/ /*!50106 EVENT `evt_delete_integracoes` ON SCHEDULE EVERY 1 DAY STARTS '2026-03-27 01:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
	CALL rotina_delete_log_integracao();
    CALL rotina_delete_fila_integracao();
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `evt_rel_percentil` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'UTC' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`admin_fluxoder`@`%`*/ /*!50106 EVENT `evt_rel_percentil` ON SCHEDULE EVERY 1 HOUR STARTS '2025-05-15 20:35:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
	CALL rotina_fluxo_relatorio_percentil();
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `evt_rel_volumetrico` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'UTC' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`admin_fluxoder`@`%`*/ /*!50106 EVENT `evt_rel_volumetrico` ON SCHEDULE EVERY 1 HOUR STARTS '2026-04-15 01:25:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
	CALL rotina_fluxo_relatorio_volumetrico();
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'gctweb_der_mg_fluxo'
--
/*!50003 DROP PROCEDURE IF EXISTS `rotina_delete_fila_integracao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_fluxoder`@`%` PROCEDURE `rotina_delete_fila_integracao`()
proc: BEGIN
	DECLARE vDias, vDiasDer, vDiasSef INT;
    DECLARE vExecutando TINYINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_delete_fila_integracao';
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
        -- Get the most recent error details
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
        INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
			VALUES (
				vTipo, 
				vInicio, 
                vFim, 
                JSON_OBJECT(
                    'errorCode', vErrorCode,
					'sqlState', vSqlState,
					'message', vErrorMessage), 
				0);
	END;
    
    SET vInicio = NOW();

    START TRANSACTION;
    SELECT param->'$.dias', param->'$.diasDer', param->'$.diasSef', executando INTO vDias, vDiasDer, vDiasSef, vExecutando
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
    
	-- REMOVER FLUXOS DA FILA COM ERRO INCLUÍDOS DE DOIS DIAS PARA TRÁS
	DELETE FROM QFluxoPrf WHERE erro IS NOT NULL AND createdAt < DATE_SUB(CURDATE(), INTERVAL vDias DAY);
    DELETE FROM QFluxoPm WHERE erro IS NOT NULL AND createdAt < DATE_SUB(CURDATE(), INTERVAL vDias DAY);
    DELETE FROM QFluxoPlacaMonitoradaPm WHERE erro IS NOT NULL AND createdAt < DATE_SUB(CURDATE(), INTERVAL vDias DAY);
	DELETE FROM QFluxoSef WHERE erro IS NOT NULL AND createdAt < DATE_SUB(CURDATE(), INTERVAL vDiasSef DAY);
	DELETE FROM QFluxoDer WHERE erro IS NOT NULL AND createdAt < DATE_SUB(CURDATE(), INTERVAL vDiasDer DAY);

    SET vFim = NOW();
    
	START TRANSACTION;
    UPDATE RotinaConfig 
		SET executando = 0, 
			fim = vFim 
		WHERE tipo = vTipo;
    COMMIT;
    
    INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
		VALUES (vTipo, vInicio, vFim, null, 1);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `rotina_delete_log_integracao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_fluxoder`@`%` PROCEDURE `rotina_delete_log_integracao`()
proc: BEGIN
	DECLARE vDias INT;
    DECLARE vExecutando TINYINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_delete_log_integracao';
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);
    DECLARE vDataCorte DATE;
    DECLARE vMaxIdDer BIGINT;
    DECLARE vMaxIdPm BIGINT;
    DECLARE vMaxIdPrf BIGINT;
    DECLARE vMaxIdSef BIGINT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
        -- Get the most recent error details
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
        INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
			VALUES (
				vTipo, 
				vInicio, 
                vFim, 
                JSON_OBJECT(
                    'errorCode', vErrorCode,
					'sqlState', vSqlState,
					'message', vErrorMessage), 
				0);
	END;
    
    SET vInicio = NOW();

    START TRANSACTION;
    SELECT param->'$.dias', executando INTO vDias, vExecutando
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
    
    SET vDataCorte = DATE_SUB(CURDATE(), INTERVAL vDias DAY);
    
	-- REMOVER TODOS OS LOGS DE 10 DIAS PARA TRÁS
    SELECT max(id) INTO vMaxIdDer FROM LogFluxoDer WHERE createdAt < vDataCorte;
    SELECT max(id) INTO vMaxIdPm FROM LogFluxoPm WHERE createdAt < vDataCorte;
    SELECT max(id) INTO vMaxIdPrf FROM LogFluxoPrf WHERE createdAt < vDataCorte;
    SELECT max(id) INTO vMaxIdSef FROM LogFluxoSef WHERE createdAt < vDataCorte;
    
	IF vMaxIdDer IS NOT NULL THEN
		DELETE FROM LogFluxoDer WHERE id <= vMaxIdDer;
    END IF;
    IF vMaxIdPm IS NOT NULL THEN
		 DELETE FROM LogFluxoPm WHERE id <= vMaxIdPm;
    END IF;
    IF vMaxIdPrf IS NOT NULL THEN
		DELETE FROM LogFluxoPrf WHERE id <= vMaxIdPrf;
    END IF;
	IF vMaxIdSef IS NOT NULL THEN
		 DELETE FROM LogFluxoSef WHERE id <= vMaxIdSef;
    END IF;
	
    
    SET vFim = NOW();
    
	START TRANSACTION;
    UPDATE RotinaConfig 
		SET executando = 0, 
			fim = vFim
		WHERE tipo = vTipo;
    COMMIT;
    
    INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
		VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idDer', vMaxIdDer, 'idPm', vMaxIdPm, 'idPrf', vMaxIdPrf, 'idSef', vMaxIdSef), 1);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `rotina_fluxo_relatorio_percentil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_fluxoder`@`%` PROCEDURE `rotina_fluxo_relatorio_percentil`()
proc: BEGIN
	DECLARE vFluxoIdFinalProcAnterior BIGINT;
    DECLARE vFluxoIdInicial BIGINT;
    DECLARE vFluxoIdFinal BIGINT;
    DECLARE vTamanhoMaximo BIGINT;
    DECLARE vExecutando TINYINT;
	DECLARE vRelPercCatVel INT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_fluxo_relatorio_percentil';
    DECLARE vCont INT;
	DECLARE cId BIGINT;
	DECLARE cData DATE;
    DECLARE cVelMed SMALLINT;
    DECLARE cEquipId INT;
	DECLARE cDone INT DEFAULT FALSE;
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);
    
	DECLARE cCursor CURSOR FOR
		SELECT id, data, velMed, equipId
		FROM Fluxo
		WHERE id > vFluxoIdFinalProcAnterior
		ORDER BY id ASC
		LIMIT vTamanhoMaximo;

	
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET cDone = TRUE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
        -- Get the most recent error details
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
        INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
			VALUES (
				vTipo, 
				vInicio, 
                vFim, 
                JSON_OBJECT(
					'idInicial', vFluxoIdInicial, 
                    'idFinal', vFluxoIdFinal, 
                    'total', null, 
                    'errorCode', vErrorCode,
					'sqlState', vSqlState,
					'message', vErrorMessage), 
				0);
	END;
    
    SET vInicio = NOW();
    SET vCont = 0;


    START TRANSACTION;
    SELECT param->'$.idFinal', executando, param->'$.tamanhoMaximo' INTO vFluxoIdFinalProcAnterior, vExecutando, vTamanhoMaximo
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
    
	START TRANSACTION;
	OPEN cCursor;
	loop_fluxo: LOOP
		FETCH cCursor INTO cId, cData, cVelMed, cEquipId;
		
        IF cDone THEN
		  LEAVE loop_fluxo;
		END IF;
        
        IF vCont = 0 THEN
			SET vFluxoIdInicial = cId;
        END IF;
		
        #Relatorio Percentil
		IF cEquipId IS NOT NULL AND cEquipId > 0 AND cVelMed IS NOT NULL AND cVelMed <> 0 THEN 
			IF cVelMed < 20 THEN
				SET vRelPercCatVel = 0;
			ELSEIF cVelMed < 30 THEN
				SET vRelPercCatVel = 1;
			ELSEIF cVelMed < 40 THEN
				SET vRelPercCatVel = 2;
			ELSEIF cVelMed < 50 THEN
				SET vRelPercCatVel = 3;
			ELSEIF cVelMed < 60 THEN
				SET vRelPercCatVel = 4;
			ELSEIF cVelMed < 70 THEN
				SET vRelPercCatVel = 5;
			ELSEIF cVelMed < 80 THEN
				SET vRelPercCatVel = 6;
			ELSEIF cVelMed < 90 THEN
				SET vRelPercCatVel = 7;
			ELSEIF cVelMed < 100 THEN
				SET vRelPercCatVel = 8;
			ELSEIF cVelMed < 110 THEN
				SET vRelPercCatVel = 9;
			ELSEIF cVelMed < 120 THEN
				SET vRelPercCatVel = 10;
			ELSEIF cVelMed < 130 THEN
				SET vRelPercCatVel = 11;
			ELSEIF cVelMed < 140 THEN
				SET vRelPercCatVel = 12;
			ELSE
				SET vRelPercCatVel = 13;
			END IF;
			
            INSERT INTO RelatorioPercentil(equipId, data, catVel, total) 
			VALUES (cEquipId, cData, vRelPercCatVel, 1)
			ON DUPLICATE KEY UPDATE total=total+1;
            
		END IF;

		SET vCont = vCont + 1;
		SET vFluxoIdFinal = cId;
	END LOOP;
	CLOSE cCursor;
    COMMIT;
    
    SET vFim = NOW();
    
	START TRANSACTION;
    UPDATE RotinaConfig 
		SET executando = 0, 
			fim = vFim 
		WHERE tipo = vTipo;
    IF vFluxoIdFinal IS NOT NULL THEN
		UPDATE RotinaConfig 
			SET param = JSON_SET(param, '$.idFinal', vFluxoIdFinal)
			WHERE tipo = vTipo;
    END IF;
    COMMIT;
    
    INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
		VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idInicial', vFluxoIdInicial, 'idFinal', vFluxoIdFinal, 'total', vCont), 1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `rotina_fluxo_relatorio_volumetrico` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_fluxoder`@`%` PROCEDURE `rotina_fluxo_relatorio_volumetrico`()
proc: BEGIN
	DECLARE vFluxoIdFinalProcAnterior BIGINT;
    DECLARE vFluxoIdInicial BIGINT;
    DECLARE vFluxoIdFinal BIGINT;
    DECLARE vTamanhoMaximo BIGINT;
    DECLARE vExecutando TINYINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_fluxo_relatorio_volumetrico';
    DECLARE vCont INT;
	DECLARE vNHora, vNqHora, vNPlaca, vNPm, vNPrf, vNSef, vNDer, vNMjsp INT;
	DECLARE cId BIGINT;
	DECLARE cData DATE;
	DECLARE cHora TIME;
    DECLARE cClassVeic SMALLINT;
    DECLARE cEquipId INT;
	DECLARE cPlaca VARCHAR(7);
    DECLARE cStPm TINYINT;
    DECLARE cStPrf TINYINT;
    DECLARE cStSef TINYINT;
    DECLARE cStDer TINYINT;
    DECLARE cStMjsp TINYINT;
	DECLARE cDone INT DEFAULT FALSE;
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);
    
	DECLARE cCursor CURSOR FOR
		SELECT id, data, hora, classVeic, equipId, placa, stPm, stPrf, stSef, stDer, stMjsp
		FROM Fluxo
		WHERE id > vFluxoIdFinalProcAnterior
		ORDER BY id ASC
		LIMIT vTamanhoMaximo;
	
	
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET cDone = TRUE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
        -- Get the most recent error details
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
        INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
			VALUES (
				vTipo, 
				vInicio, 
                vFim, 
                JSON_OBJECT(
					'idInicial', vFluxoIdInicial, 
                    'idFinal', vFluxoIdFinal, 
                    'total', null, 
                    'errorCode', vErrorCode,
					'sqlState', vSqlState,
					'message', vErrorMessage), 
				0);
	END;
    
    SET vInicio = NOW();
    SET vCont = 0;


    START TRANSACTION;
    SELECT param->'$.idFinal', executando, param->'$.tamanhoMaximo' INTO vFluxoIdFinalProcAnterior, vExecutando, vTamanhoMaximo
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
    
	START TRANSACTION;
	OPEN cCursor;
	loop_fluxo: LOOP
		FETCH cCursor INTO cId, cData, cHora, cClassVeic, cEquipId, cPlaca, cStPm, cStPrf, cStSef, cStDer, cStMjsp;
		
        IF cDone THEN
		  LEAVE loop_fluxo;
		END IF;
        
        IF vCont = 0 THEN
			SET vFluxoIdInicial = cId;
        END IF;
		
        #Relatorio Volumetrico - só contabiliza se existir o equipamento
		IF cEquipId IS NOT NULL AND cEquipId > 0 THEN
			SET vNHora = HOUR(cHora);
			SET vNqHora = floor( time_to_sec(cHora)/900 );
			IF (cPlaca IS NOT NULL) AND (TRIM(cPlaca) <> '') THEN 
				SET vNPlaca = 1;
			ELSE
				SET vNPlaca = 0;
			END IF;
            IF cStPm = 1 THEN
				SET vNPm = 1;
			ELSE
				SET vNPm = 0;
			END IF;
            IF cStPrf = 1 THEN
				SET vNPrf = 1;
			ELSE
				SET vNPrf = 0;
			END IF;
            IF cStSef = 1 THEN
				SET vNSef = 1;
			ELSE
				SET vNSef = 0;
			END IF;
            IF cStDer = 1 THEN
				SET vNDer = 1;
			ELSE
				SET vNDer = 0;
			END IF;
            IF cStMjsp = 1 THEN
				SET vNMjsp = 1;
			ELSE
				SET vNMjsp = 0;
			END IF;
			
			INSERT INTO RelatorioVolumetrico(equipId, data, nHora, nqHora, classVeic, total, totalPm, totalPrf, totalSef, totalDer, totalMjsp, totalPlaca) 
			VALUES (cEquipId, cData, vNHora, vNqHora, cClassVeic, 1, vNPm, vNPrf, vNSef, vNDer, vNMjsp, vNPlaca)
			ON DUPLICATE KEY UPDATE total=total+1, totalPm=totalPm+vNPm, totalPrf=totalPrf+vNPrf, totalSef=totalSef+vNSef, totalDer=totalDer+vNDer, totalMjsp=totalMjsp+vNMjsp, totalPlaca=totalPlaca+vNPlaca;
		END IF;
		
		SET vCont = vCont + 1;
		SET vFluxoIdFinal = cId;
	END LOOP;
	CLOSE cCursor;
    COMMIT;
    
    SET vFim = NOW();
    
	START TRANSACTION;
    UPDATE RotinaConfig 
		SET executando = 0, 
			fim = vFim 
		WHERE tipo = vTipo;
    IF vFluxoIdFinal IS NOT NULL THEN
		UPDATE RotinaConfig 
			SET param = JSON_SET(param, '$.idFinal', vFluxoIdFinal)
			WHERE tipo = vTipo;
    END IF;
    COMMIT;
    
    INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
		VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idInicial', vFluxoIdInicial, 'idFinal', vFluxoIdFinal, 'total', vCont), 1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `rotina_equipamentos_online_fluxo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_fluxoder`@`%` PROCEDURE `rotina_equipamentos_online_fluxo`()
proc: BEGIN
	DECLARE vIdFinalProcAnterior BIGINT;
    DECLARE vIdInicial BIGINT;
    DECLARE vIdFinal BIGINT;
    DECLARE vTamanhoMaximo BIGINT;
    DECLARE vExecutando TINYINT;
    DECLARE vDataHoraUltimaPassagem, vDataHora DATETIME;
	DECLARE vIdUltimaPassagem BIGINT;
    DECLARE vInicio, vFim DATETIME;
    DECLARE vTipo VARCHAR(50) DEFAULT 'rotina_equipamentos_online_fluxo';
    DECLARE vCont INT;
	DECLARE cId BIGINT;
	DECLARE cData DATE;
    DECLARE cHora TIME;
    DECLARE cEquipId INT;
	DECLARE cDone INT DEFAULT FALSE;
    DECLARE vErrorCode INT;
    DECLARE vErrorMessage TEXT;
    DECLARE vSqlState VARCHAR(5);
    
	DECLARE cCursor CURSOR FOR 
		SELECT F.id, F.data, F.hora, F.equipId
        FROM Fluxo F
		WHERE F.id > vIdFinalProcAnterior
          AND F.equipId IS NOT NULL
          AND F.equipId > 0
        ORDER BY F.id ASC
        LIMIT vTamanhoMaximo;

	
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET cDone = TRUE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SHOW ERRORS;
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
        INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
			VALUES (
                vTipo,
                vInicio,
                vFim,
                JSON_OBJECT(
                    'idInicial', vIdInicial,
                    'idFinal', vIdFinal,
                    'total', null,
                    'errorCode', vErrorCode,
                    'sqlState', vSqlState,
                    'message', vErrorMessage
                ),
                0
            );
	END;
    
    SET vInicio = NOW();
    SET vCont = 0;


    START TRANSACTION;
    SELECT param->'$.idFinal', executando, param->'$.tamanhoMaximo' INTO vIdFinalProcAnterior, vExecutando, vTamanhoMaximo
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
    
	START TRANSACTION;
	OPEN cCursor;
	loop_fluxo: LOOP
		FETCH cCursor INTO cId, cData, cHora, cEquipId;
		
        IF cDone THEN
		  LEAVE loop_fluxo;
		END IF;
        
        IF vCont = 0 THEN
			SET vIdInicial = cId;
        END IF;
		
        SET vDataHora = CONCAT(cData, ' ', cHora);
		SELECT dataHoraUltimaPassagem, idUltimaPassagem
			INTO vDataHoraUltimaPassagem, vIdUltimaPassagem
			FROM RelatorioEquipamentosOnline
			WHERE equipId = cEquipId;
	
        IF vDataHoraUltimaPassagem IS NULL OR vDataHora > vDataHoraUltimaPassagem THEN
			SET vDataHoraUltimaPassagem = vDataHora;
			SET vIdUltimaPassagem = cId;
	    END IF;

        INSERT INTO RelatorioEquipamentosOnline(equipId, dataHoraUltimaPassagem, idUltimaPassagem, updatedAt)
        VALUES (cEquipId, vDataHoraUltimaPassagem, vIdUltimaPassagem, NOW())
        ON DUPLICATE KEY UPDATE
            dataHoraUltimaPassagem = VALUES(dataHoraUltimaPassagem),
            idUltimaPassagem = VALUES(idUltimaPassagem),
            updatedAt = NOW();
		
        SET vIdFinal = cId;
        SET vCont = vCont + 1;
	END LOOP;
	CLOSE cCursor;
    COMMIT;
    
    SET vFim = NOW();
    
	START TRANSACTION;
    UPDATE RotinaConfig 
		SET executando = 0, 
			fim = vFim 
		WHERE tipo = vTipo;
    IF vIdFinal IS NOT NULL THEN
		UPDATE RotinaConfig 
			SET param = JSON_SET(param, '$.idFinal', vIdFinal)
			WHERE tipo = vTipo;
    END IF;
    COMMIT;
    
    INSERT RotinaLog(tipo, inicio, fim, param, sucesso)
		VALUES (vTipo, vInicio, vFim, JSON_OBJECT('idInicial', vIdInicial, 'idFinal', vIdFinal, 'total', vCont), 1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 11:17:34
