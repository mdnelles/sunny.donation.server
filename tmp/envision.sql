-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: donation.cjbbw0sqw11v.ca-central-1.rds.amazonaws.com    Database: envision
-- ------------------------------------------------------
-- Server version	5.7.26-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
-- Table structure for table `donor_cats`
--

DROP TABLE IF EXISTS `donor_cats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donor_cats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `donorKey` varchar(64) NOT NULL,
  `donorCategoryTitle` varchar(256) NOT NULL,
  `author` varchar(256) NOT NULL,
  `date` varchar(64) NOT NULL,
  `count` int(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_cats`
--

LOCK TABLES `donor_cats` WRITE;
/*!40000 ALTER TABLE `donor_cats` DISABLE KEYS */;
INSERT INTO `donor_cats` VALUES (23,'lifetime100000','$100,000-$249,999','Envision Admin','2019-09-24 23:30:13',463),(24,'lifetime1000000','$1,000,000-$2,499,999','Envision Admin','2019-10-04 20:12:39',100),(25,'lifetime10000000','$10,000,000-$19,999,999','Michael Nelles','2019-10-29 16:31:05',10),(26,'lifetime20000000','$20,000,000','Envision Admin','2019-09-24 23:22:22',3),(27,'lifetime25000','$25,000-$50,000','Envision Admin','2019-09-24 23:34:01',823),(28,'lifetime250000','$250,000 - $499,999','Envision Admin','2019-07-14 22:48:01',214),(29,'lifetime2500000','$2,500,000 - $4,999,999','Envision Admin','2019-09-16 10:14:45',39),(30,'lifetime50000','$50,000 - $99,999','Envision Admin','2019-07-16 14:44:13',506),(31,'lifetime500000','$500,000 - $999,999','Envision Admin','2019-07-14 21:46:51',93),(32,'lifetime5000000','$5,000,000 to $9,999,999','Envision Admin','2019-07-14 21:13:14',14);
/*!40000 ALTER TABLE `donor_cats` ENABLE KEYS */;
UNLOCK TABLES;
