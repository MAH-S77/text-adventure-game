INSERT INTO `GAMEPLAY` (`PlayerID`, `TimeStarted`, `SceneID`, `endTime`) VALUES 
(1, '14:30:00', 11, '15:05:00'),
(2, '16:45:00', 7, NULL),
(3, '09:15:00', 3, '09:50:00');



INSERT INTO `INVENTORY` (`ItemID`, `GameID`) VALUES 
(5, 1),
(2, 2),
(8, 3);



INSERT INTO `ITEM` (`ItemDescription`, `image`) VALUES
("Torch", "./images/torch.jpg"),
("Batton", "./images/batton.jpg"),
("Map", "./map/torch.jpg");



INSERT INTO `PLAYER` (`username`, `user_password`) VALUES 
('tester', '1234'),
('zz', 'test'),
('cv', 'qwerty');



INSERT INTO `ROOM` (`RoomName`) VALUES 
('Prison Cell'),
('Warden Office'),
('Prison Yard');



INSERT INTO `SCENE` (`SceneDescription`, `RoomID`) VALUES 
11("The night has fallen over thrv of you, ...", '4'),
12("You crouch low and slip behind a stack of crates. ...", '4'),
13("Hey there, you. I could use a little help. ...", '4'),
14("You notice that the flashing lights in the ...", '4'),
15("You lean casually against the wall, pretending not to pay attention,...", "4"),
16("There are gaurds on the other side of the crates. You listen carefully, ...", "4"),
17("You kneel down and inspect the crates. They are old and worn, with faded markings ...", "4"),
18("You move slowly to the far right of the crate and see gaurd standing alone a keychane on his wasteband.", "4"),
19("You inch forward, straining to hear the guards more clearly. ...", "4");



INSERT INTO `SCENEACTIONS` (`SceneID`, `ActionDescription`, `ItemID`, `StepToScene`) VALUES 
("11", "Sneak behind a stack of crates", NULL, "12"),
("11", "Talk to a prisoner near the fence", NULL, "13"),
("11", "Climb the fence while the lights are away", NULL, "14"),
("11", "Wait and observe the guards", NULL, "15"),
("12", "Examine creates", NULL, "17"),
("12", "Listen to guard conversation", NULL, "16"),
("12", "Peek out from behind crates", NULL, "18"),
("12", "Go back to yard door", NULL, "11");

INSERT INTO `SCENEACTIONS` (`SceneID`, `ItemID`, `StepToScene`, `ItemInteraction`) VALUES 
("17", "15", "25", "13"),
("24", "15", "25", "13"),
("26", NULL, "28", "14"),
("46", NULL, "47", "15"),
("13", NULL, "30", "16");



INSERT INTO `SETTINGS` (`PlayerID`, `Volume`, `HighContrastMode`, `TextToSpeech`, `FontSize`) VALUES 
(1, 75, 1, 0, 'large'),
(2, 30, 0, 1, 'medium'),
(3, 50, 0, 0, 'small');
