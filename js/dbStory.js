
window.onload = function() {
    checkLogin();
    printSessionStorage();

    console.log("loaded");

    let nextScene = sessionStorage.getItem("nextScene");
    if (nextScene) {
        fetchSceneDescription(nextScene);
        sessionStorage.removeItem("nextScene");
    }

    if (sessionStorage.getItem("startNewGame") === "true") {
        console.log("starting new game");
        sessionStorage.removeItem("startNewGame");
        startGame();
    } if (sessionStorage.getItem("loadOldGame") === "true") {
        console.log("loading old game");
        sessionStorage.removeItem("loadOldGame");
        loadGame();
    }
};


async function startGame() {
    let playerID = sessionStorage.getItem("PlayerID");
    console.log("Player ID: ", playerID);

    let startScene = 100;   // Change to first scene 100

    let sqlQuery = `
        INSERT INTO GAMEPLAY (PlayerID, TimeStarted, SceneID)
        VALUES (${playerID}, NOW(), ${startScene});
    `;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database after INSERT:", result);

        if (result.success) {
            console.log("Game starts");

            await new Promise(r => setTimeout(r, 100));

            let gameID = await getGameID(playerID);
            if (gameID) {
                sessionStorage.setItem("GameID", gameID);
                sessionStorage.setItem("SceneID", startScene);
                printSessionStorage();
                fetchSceneDescription(startScene);
            } else {
                console.error("Failed to get gameID");
            }

        } else {
            console.log("Game didn't start", result);
        }
    } catch (error) {
        console.log("Game failed to start", error);
    }
}




async function getGameID(playerID) {
    let sqlQuery = `SELECT MAX(GameID) AS GameID FROM GAMEPLAY WHERE PlayerID = '${playerID}'`;

    dbConfig.set('query', sqlQuery);
    console.log("Sending SQL query to get GameID: ", sqlQuery);

    try {
        let gameResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let gameResult = await gameResponse.json();
        console.log("Full game result from SELECT query:", gameResult);

        if (gameResult.success && gameResult.data && gameResult.data.length > 0) {
            let gameID = gameResult.data[0].GameID;

            if (!gameID) {
                console.error("GameID is undefined or null:", gameResult);
                return null;
            }

            console.log("Retrieved GameID:", gameID);
            return gameID;
        } else {
            console.error("No GameID found in the result from SELECT query", gameResult);
            return null;
        }
    } catch (error) {
        console.error("Error fetching GameID:", error);
        return null;
    }
}






async function loadGame() {
    let playerID = sessionStorage.getItem("PlayerID");

    if (!playerID) {
        console.log("No player id");
        return;
    }

    let gameID = await getGameID(playerID);
    if (gameID) {
        sessionStorage.setItem("GameID", gameID);
        printSessionStorage();
    } else {
        console.error("Failed to get gameID");
        return;
    }
    let sqlQuery = `SELECT SceneID FROM GAMEPLAY WHERE GameID = '${gameID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database:", result);
        console.log("Result Data:", result.data);

        if (result.success && result.data && result.data.length > 0) {
            let lastScene = result.data[0].SceneID;

            console.log("Resuming from scene:", lastScene);
            sessionStorage.setItem("SceneID", lastScene);
            loadInventory(gameID);
            fetchSceneDescription(lastScene);
        } else {
            printSessionStorage();
            console.log("No saved game found.");
            startGame();
        }
    } catch (error) {
        console.error("Game failed to load", error);
    }
}




async function loadInventory(gameID) {

    let sqlQuery = `SELECT ItemID FROM INVENTORY WHERE GameID = '${gameID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database:", result);

        if (result.success && result.data && result.data.length > 0) {
            result.data.forEach(item => {
                let itemID = item.ItemID;
                console.log("Loaded ItemID:", itemID);
                
                loadInvItems(itemID);
            });
        } else {
            console.log("No Items found");
        }
    } catch (error) {
        console.error("Error fetching inventory", error);
    }
}


async function loadInvItems(itemID) {
    let image = await fetchImage(itemID);
    
    let emptySlot = inventorySlots[inventoryList.length];
    inventoryList.push(
        {
            slot: emptySlot, 
            itemID: itemID, 
            image: image
        }
    );

    let itemSlot = document.getElementById(emptySlot);
    if (itemSlot) {
        itemSlot.innerHTML = "";
        itemSlot.style.backgroundImage = `url('${image}')`;
        itemSlot.style.backgroundSize = "cover";
        itemSlot.style.backgroundPosition = "center";

        itemSlot.addEventListener("dblclick", function(){
            removeInvItem(emptySlot);
        });

        itemSlot.addEventListener("click", function () {
            itemInteraction(itemID);
        });
    }
}





async function fetchSceneDescription(sceneID) {
    let sqlQuery = `SELECT SceneDescription FROM SCENE WHERE SceneID = '${sceneID}'`;
    dbConfig.set('query', sqlQuery);
   
    console.log("Sending SQL query...");

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        console.log("Response received:", response);

        let data = await response.json();
        console.log("Server response data:", data);


        if (data.success && data.data.length > 0) {
            updateSceneID(sceneID);
            typeText(data.data[0].SceneDescription, function() {
                console.log("okie here");
                if (sceneID == 69) {
                    endGame();
                    return;
                }
                fetchSceneOption(sceneID);
                
            });
        } else {
            console.error("Scene not found.");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}






async function updateSceneID(sceneID){
    let playerID = sessionStorage.getItem("PlayerID");
    let gameID = sessionStorage.getItem("GameID");

    let sqlQuery = `UPDATE GAMEPLAY SET SceneID = ${sceneID} WHERE PlayerID = ${playerID} AND GameID = ${gameID}
    `;
    dbConfig.set('query', sqlQuery);
   
    console.log("Sending SQL query...");

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        console.log("Response received:", response);

        let result = await response.json();
        console.log("Server response data:", result);


        if (result.success) {
            sessionStorage.setItem("SceneID", sceneID);
            printSessionStorage();
            console.log("Update successfull");
        } else {
            console.log("Failed to update");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



function transitionToScene(nextSceneID) {
    console.log("Transition to:", nextSceneID);
    removeOptions();
    fetchSceneDescription(nextSceneID);
}



async function fetchSceneOption(sceneID) {

    let sqlQuery = `SELECT ActionID, ActionDescription, StepToScene, ItemID FROM SCENEACTIONS WHERE SceneID = '${sceneID}'`;
    dbConfig.set('query', sqlQuery);

    console.log("actions...");

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        console.log("Update Response:", result);

        if (result.success && result.data && result.data.length > 0) {
            let optionsFound = false;

            for (let i = 0; i < result.data.length && i < 4; i++) {
                let action = result.data[i];
                let optionBox = document.getElementById(`option${i + 1}`);
                
                optionBox.innerHTML = action.ActionDescription;

                if (action.ActionDescription) {
                    optionsFound = true;
                    optionBox.innerHTML = action.ActionDescription;

                    if (action.ItemID) {
                        console.log("There is an item");
                        optionBox.onclick = function () {
                            addItemToInventory(action.ItemID);
                            transitionToScene(action.StepToScene);
                        };
                    } else {
                        console.log("There is no item");
                        optionBox.onclick = function () {
                            if (action.ActionID == 339 || action.ActionID == 336 ||action.ActionID == 329 ||action.ActionID == 325 ) {
                                console.log("Showing Mini Game....")
                                showMiniGame();
                            } else {
                                transitionToScene(action.StepToScene);
                            }
                        };
                        
                    }
                }
            }
            if (!optionsFound) {
                console.log("No actions found, Returning to scenne 11");
                setTimeout(() => fetchSceneDescription(11), 5000);
            }
        } else {
            console.log("No actions found for this scene");
            setTimeout(() => fetchSceneDescription(11), 5000);
        }
    } catch (error) {
        console.error("Error getting options:", error);
    }
}














//INVENTORY STUFF//
let maxItems = 5;
let inventorySlots = ["item1", "item2", "item3", "item4", "item5"];
let inventoryList = [];

async function addItemToInventory(itemID) {
    if (inventoryList.length >= maxItems) {
        console.log("Inventory full")
        return;
    }

    let gameID = sessionStorage.getItem("GameID");

    let image = await fetchImage(itemID);

    let sqlQuery = `INSERT INTO INVENTORY (GameID, ItemID) VALUES('${gameID}', '${itemID}');`;
    
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        
        if (result.success) {
            console.log("Item added to inventory");

            let emptySlot = inventorySlots[inventoryList.length];
            inventoryList.push(
                {
                    slot: emptySlot, 
                    itemID: itemID, 
                    image: image
                }
            );

            let itemSlot = document.getElementById(emptySlot);
            if (itemSlot) {
                itemSlot.innerHTML = "";
                itemSlot.style.backgroundImage = `url('${image}')`;
                itemSlot.style.backgroundSize = "cover";
                itemSlot.style.backgroundPosition = "center";

                itemSlot.addEventListener("dblclick", function(){
                    removeInvItem(emptySlot);
                });

                itemSlot.addEventListener("click", function () {
                    itemInteraction(itemID);
                });
            }
        } else {
            console.error("Failed to add item:", result);
        }
    } catch (error) {
        console.error("Error adding item:", error);
    }
}



async function fetchImage(itemID) {

    let sqlQuery = `SELECT image FROM ITEM WHERE ItemID = '${itemID}'`;
   
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        
        if (result.success && result.data.length > 0) {
            return result.data[0].image;
        } else {
            console.error("image not found:", result);
        }
    } catch (error) {
        console.error("Error finding image:", error);
    }
}


async function removeInvItem(slot) {
    let gameID = sessionStorage.getItem("GameID");
    
    console.log("Current Inventory List:", inventoryList); 

    let index = -1;
    for (let i = 0; i < inventoryList.length; i++) {
        console.log(`Checking slot ${inventoryList[i].slot} against ${slot}`);
        if (inventoryList[i].slot === slot) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        console.log("Item not found in inventory list.");
        return;
    }

    let itemID = inventoryList[index].itemID;
    console.log("Found itemID:", itemID); 

    let sqlQuery = `DELETE FROM INVENTORY WHERE GameID = '${gameID}' AND ItemID = '${itemID}' LIMIT 1`;
   
    dbConfig.set('query', sqlQuery);

    console.log("actions...");

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        console.log("Update Response:", result);

        if (result.success) {
            console.log("ITEM REMOVED FROM DB");

            let index = -1;
            for (let i = 0; i< inventoryList.length; i++) {
                if (inventoryList[i].itemID === itemID) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                let slot = inventoryList[index].slot;
                let item = document.getElementById(slot);
                if (item) {
                    item.innerHTML = "+";
                    item.style.backgroundImage = "none"; 
                }

                inventoryList.splice(index, 1);
                updateInventoryImages();
            }
        } else {
            console.log("failed to remove item");
        }
    } catch (error) {
        console.error("Error removing item:", error);
    }
}



function updateInventoryImages() {
    inventorySlots.forEach(slotId => {
        let slot = document.getElementById(slotId);
        if (slot) {
            slot.innerHTML = "+";
            slot.style.backgroundImage = "none";

            let newSlot = slot.cloneNode(true);
            slot.parentNode.replaceChild(newSlot, slot);
        }
    });

    inventoryList.forEach((item, index) => {
        let newSlotId = inventorySlots[index];
        let newSlot = document.getElementById(newSlotId);

        if (newSlot) {
            newSlot.innerHTML = "";
            newSlot.style.backgroundImage = `url('${item.image}')`;
            newSlot.style.backgroundSize = "cover";
            newSlot.style.backgroundPosition = "center";

            newSlot.replaceWith(newSlot.cloneNode(true));
            newSlot = document.getElementById(newSlotId);

            newSlot.addEventListener("dblclick", function () {
                removeInvItem(newSlotId);
            });

            newSlot.addEventListener("click", function () {
                itemInteraction(item.itemID);
            });

            item.slot = newSlotId;
        }
    });
}



async function itemInteraction(itemID) {
    printSessionStorage();
    let currentSceneID = sessionStorage.getItem("SceneID");
    
    if (itemID == 17) {
        console.log("Map used!");
        fullMap();
        return; 
    }

    console.log("CURRENT SCENE: ", currentSceneID, "   ITEM ID:", itemID);

    let sqlQuery = `SELECT StepToScene, ItemID FROM SCENEACTIONS WHERE SceneID = '${currentSceneID}' AND ItemInteraction = '${itemID}'`;

    console.log("SQL Query:", sqlQuery);
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        console.log("Full Response:", result);
        console.log("Full row data:", result.data);


        if (result.success && result.data && result.data.length > 0) {
            let nextScene = result.data[0].StepToScene;
            console.log("Item used successfully");

            if (result.data[0].ItemID) {
                console.log("Item got: ", result.data[0].ItemID);
                addItemToInventory(result.data[0].ItemID);
            } else {
                console.log("No item here:",result.data[0].ItemID)
            }

            fetchSceneDescription(nextScene);
        } else {
            console.error("no scene for item currently: ", itemID);
            console.error("Unexpected response structure:", result);
        }
    } catch (error) {
        console.error("Error with item interaction:", error);
    }

}







async function endGame() {
    console.log("end gaem");
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("endGame").style.display = "block";

    let gameID = sessionStorage.getItem("GameID");
    let sqlQuery = `UPDATE GAMEPLAY SET endTime = NOW() WHERE GameID = '${gameID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database after INSERT:", result);

        if (result.success) {
            await gameSummary(gameID);
            setTimeout(function() {
                window.location.href = "startScreen.html";
                showMainMenu();
            }, 10000);
        } else {
            console.error("Time didnt set", result);
        }
    } catch (error) {
        console.error("error setting end time", error);
    }
}





//Summary//
async function gameSummary(gameID){
    console.log("game summary 1")
    let sqlQuery = `SELECT TIMEDIFF(endTime, TimeStarted) AS FinishingTime FROM GAMEPLAY WHERE GameID = '${gameID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database after INSERT:", result);

        if (result.success && result.data.length > 0) {
            document.getElementById('time').innerHTML = result.data[0].FinishingTime;
            await gameSummary2(gameID);
        } else {
            console.log("Time didnt set", result);
        }
    } catch (error) {
        console.log("error setting end time", error);
    }
}

async function gameSummary2(gameID) {
    console.log("game summary 2")

    let sqlQuery = `SELECT i.ItemID, it.ItemDescription FROM INVENTORY i 
                    JOIN ITEM it ON i.ItemID = it.ItemID
                    WHERE i.GameID = '${gameID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database ", result);

        if (result.success && result.data.length > 0) {
            let itemsList = "";
            result.data.forEach(item => {
                itemsList += item.ItemDescription + "<br>";
            });
            document.getElementById('items').innerHTML = itemsList;
            await gameSummary3();
        } else {
            console.log("Time didnt set", result);
        }
    } catch (error) {
        console.log("error setting end time", error);
    }
}

async function gameSummary3() {
    console.log("game summary 3")
    let playerID = sessionStorage.getItem("PlayerID");

    let sqlQuery = `SELECT COUNT(GameID) AS totalGames FROM GAMEPLAY WHERE PlayerID = '${playerID}'`;

    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();
        console.log("Full response from database ", result);

        if (result.success && result.data.length > 0) {
            let totalGames = result.data[0].totalGames;
            document.getElementById('num').innerHTML = totalGames;
        } else {
            console.log("Time didnt set", result);
        }
    } catch (error) {
        console.log("error setting end time", error);
    }
}





function typeText(text, callback) {
    let i = 0;
    let speed = 0; //60
    let container = document.getElementById('story-text');
    container.innerHTML = "";

    let typeInterval = setInterval(function() {
        if (i < text.length) {
            container.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, speed)
}