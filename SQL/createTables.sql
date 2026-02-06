CREATE TABLE `GAMEPLAY` 
(  `GameID` int(11) NOT NULL AUTO_INCREMENT,  
`PlayerID` int(11) NOT NULL,  `TimeStarted` time NOT NULL,  
`SceneID` int(11) NOT NULL,  `endTime` time DEFAULT NULL, 
PRIMARY KEY (`GameID`),  
KEY `FK_GAMEPLAY_PLAYER` (`PlayerID`), 
KEY `FK_GAMEPLAY_SCENE` (`SceneID`),  
CONSTRAINT `FK_GAMEPLAY_PLAYER` FOREIGN KEY (`PlayerID`) 
REFERENCES `PLAYER` (`PlayerID`),  
CONSTRAINT `FK_GAMEPLAY_SCENE` FOREIGN KEY (`SceneID`)
REFERENCES `SCENE` (`SceneID`) ON DELETE CASCADE );




CREATE TABLE `INVENTORY` 
(  `InventoryID` int(11) NOT NULL AUTO_INCREMENT,  
`ItemID` int(11) NOT NULL,  `GameID` int(11) NOT NULL,  
PRIMARY KEY (`InventoryID`),  
KEY `FK_INVENTORY_ITEM` (`ItemID`),  
CONSTRAINT `FK_INVENTORY_ITEM` FOREIGN KEY (`ItemID`) 
REFERENCES `ITEM` (`ItemID`) ON DELETE CASCADE );




CREATE TABLE `ITEM`
 (  `ItemID` int(11) NOT NULL AUTO_INCREMENT,  
`ItemDescription` varchar(20) NOT NULL,  
`image` varchar(255) DEFAULT NULL,  PRIMARY KEY (`ItemID`) );



CREATE TABLE `PLAYER` 
(  `PlayerID` int(11) NOT NULL AUTO_INCREMENT,  
`username` varchar(15) NOT NULL,  
`user_password` varchar(50) NOT NULL,  
PRIMARY KEY (`PlayerID`) );



CREATE TABLE `ROOM` 
(  `RoomID` int(11) NOT NULL AUTO_INCREMENT,  
`RoomName` varchar(100) NOT NULL,  
PRIMARY KEY (`RoomID`) );



CREATE TABLE `SCENE` 
(  `SceneID` int(11) NOT NULL AUTO_INCREMENT,  
`SceneDescription` longtext NOT NULL,  
`RoomID` int(11) NOT NULL,  
PRIMARY KEY (`SceneID`), 
 KEY `FK_SCENE_ROOM` (`RoomID`),  
CONSTRAINT `FK_SCENE_ROOM` FOREIGN KEY (`RoomID`) 
REFERENCES `ROOM` (`RoomID`) ON DELETE CASCADE );




CREATE TABLE `SCENEACTIONS` 
(  `ActionID` int(11) NOT NULL AUTO_INCREMENT,  
`SceneID` int(11) NOT NULL,  
`ActionDescription` mediumtext DEFAULT NULL,  
`ItemID` int(11) DEFAULT NULL,  
`StepToScene` int(11) NOT NULL,  
`ItemInteraction` int(11) DEFAULT NULL,  
PRIMARY KEY (`ActionID`),  
KEY `FK_SceneActions_Scene` (`SceneID`),  
KEY `FK_SceneActions_Item` (`ItemID`),  
CONSTRAINT `FK_SceneActions_Item` FOREIGN KEY (`ItemID`)
REFERENCES `ITEM` (`ItemID`) ON DELETE CASCADE,  
CONSTRAINT `FK_SceneActions_Scene` FOREIGN KEY (`SceneID`) 
REFERENCES `SCENE` (`SceneID`) ON DELETE CASCADE );



CREATE TABLE `SETTINGS` 
(  `SettingsID` int(11) NOT NULL AUTO_INCREMENT,  
`PlayerID` int(11) NOT NULL,  
`Volume` tinyint(4) NOT NULL DEFAULT 50,  
`HighContrastMode` tinyint(1) NOT NULL DEFAULT 0,  
`TextToSpeech` tinyint(1) NOT NULL DEFAULT 0,  
`FontSize` enum('small','medium','large') NOT NULL DEFAULT 'medium',  
PRIMARY KEY (`SettingsID`), 
UNIQUE KEY `PlayerID` (`PlayerID`),  
CONSTRAINT `FK_SETTINGS_PLAYER` 
FOREIGN KEY (`PlayerID`) REFERENCES `PLAYER` (`PlayerID`) ON DELETE CASCADE );
