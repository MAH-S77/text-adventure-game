console.log("JavaScript function is running...");
checkLogin();
printSessionStorage();

var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var maxLevel = 6; 


gameID = sessionStorage.getItem("GameID");
console.log("gameID", gameID);
lockPickCheck(gameID);

document.addEventListener('keydown', function () {
    if (!started) {
        document.querySelector("h1").innerText = "Level " + level;
        nextSequence();
        started = true;
    }
});


async function lockPickCheck(gameID) {

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
            // Check if ItemID 18 is in the inventory
            let foundItem = result.data.find(item => item.ItemID == 18); // Look for ItemID of 18

            if (foundItem) {
                console.log("ItemID 18 found in inventory:", foundItem);
                loadInvItems(foundItem.ItemID); // Perform the necessary action

                // Set maxLevel to 6 if ItemID 18 is found
                maxLevel = 6;
                console.log("Max level set to 6.");
            } else {
                console.log("ItemID 18 not found in inventory.");

                // Set maxLevel to 8 if ItemID 18 is not found
                maxLevel = 8;
                console.log("Max level set to 8.");
            }
        } else {
            console.log("No items found in inventory.");

            // Set maxLevel to 8 if no items are found
            maxLevel = 8;
            console.log("Max level set to 8.");
        }
    } catch (error) {
        console.error("Error fetching inventory", error);
    }
}

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener('click', function () {
        var userChosenColour = this.id;
        userClickedPattern.push(userChosenColour);
        playSound(userChosenColour);
        animatePress(userChosenColour);
        checkAnswer(userClickedPattern.length - 1);
    });
});

function nextSequence() {
    userClickedPattern = [];
    level++;
    document.querySelector("h1").innerText = "Level " + level;

    if (level > maxLevel) {
        winGame();
        return;
    }

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    setTimeout(() => {
        highlightButton(randomChosenColor);
    }, 500);
}

function highlightButton(color) {
    var element = document.querySelector("#" + color);
    element.style.opacity = "0.5"; // Dim the button to indicate selection

    setTimeout(() => {
        element.style.opacity = "1"; // Restore normal brightness
    }, 500);
    
    playSound(color);
}

function playSound(color) {
    var audio = new Audio("sounds/" + color + ".mp3");
    audio.play();
}

function animatePress(color) {
    var element = document.querySelector("#" + color);
    element.classList.add("pressed");
    setTimeout(() => {
        element.classList.remove("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(() => {
                nextSequence();
            }, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    playSound("wrong");
    document.querySelector("body").classList.add("game-over");
    setTimeout(() => {
        document.querySelector("body").classList.remove("game-over");
    }, 200);
    document.querySelector("h1").innerText = "Game over! Press Any Key To Restart";
    startOver();
}

function winGame() {
    
    document.querySelector("h1").innerText = "🎉 YOU WIN! Press Any Key to Restart 🎉";
    playSound("win"); // Add a win sound if you have one
    started = false;
    
    sessionStorage.setItem("nextScene", 11);
    window.location.href = "mainScreen.html";
}

function startOver() {
    level = 0; 
    gamePattern = [];
    started = false;
}



