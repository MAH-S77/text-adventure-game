//START SCREEN//signUpForm
function showSignUp() {
    document.getElementById("headerTitle").style.display = "none";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("signUp").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
function showLogin() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
function showMainMenu() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("MainMenu").style.display = "block";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
function goBack() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "block";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
function showSettings() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "block";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
function showAccEdit() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "block";
    document.getElementById("leaderboard").style.display = "none";
}
function showLeaderboard() {
    document.getElementById("headerTitle").style.display = "block";
    document.getElementById("accessMenu").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("MainMenu").style.display = "none";
    document.getElementById("Settings").style.display = "none";
    document.getElementById("editDetails").style.display = "none";
    document.getElementById("leaderboard").style.display = "block";
}

//MAIN SCREEN//

//for access to pause menu
document.addEventListener("keydown", function(event) {
    if (event.key === "k" || event.key === "K") {
        document.getElementById("startMenu").style.display = "none";
        document.getElementById("pause").style.display = "block";
        document.getElementById("endGame").style.display = "none";

    }
});


function resume() {
    document.getElementById("startMenu").style.display = "block";
    document.getElementById("pause").style.display = "none";
    document.getElementById("endGame").style.display = "none";
}

function exit() {
    let confirmExit = confirm("Are you sure you want to quit?");
    if (confirmExit) {
        window.location.href = 'startScreen.html';
    }
}




document.getElementById("startNew").addEventListener("click", function() {
    sessionStorage.setItem("startNewGame", "true");
    window.location.href = "mainScreen.html";
});
document.getElementById("loadOld").addEventListener("click", function() {
    sessionStorage.setItem("loadOldGame", "true");
    window.location.href = "mainScreen.html";
});








function removeOptions() {
    let o1 = document.getElementById('option1');
    let o2 = document.getElementById('option2');
    let o3 = document.getElementById('option3');
    let o4 = document.getElementById('option4');

    
    var o1Clone = o1.cloneNode(true);
    var o2Clone = o2.cloneNode(true);
    var o3Clone = o3.cloneNode(true);
    var o4Clone = o4.cloneNode(true);

    o1.parentNode.replaceChild(o1Clone, o1);
    o2.parentNode.replaceChild(o2Clone, o2);
    o3.parentNode.replaceChild(o3Clone, o3);
    o4.parentNode.replaceChild(o4Clone, o4);

    o1 = o1Clone;
    o2 = o2Clone;
    o3 = o3Clone;
    o4 = o4Clone;

    o1.innerHTML = "";
    o2.innerHTML = "";
    o3.innerHTML = "";
    o4.innerHTML = "";

}




function fullMap() {

    let container = document.getElementById('story-text');

    if (container.contains(document.getElementById("mapImage"))) {
        document.getElementById("mapImage").remove();

    } else {
        const img = document.createElement("img");
        img.src = './images/fullMap.png';
        img.alt = "Map";
        img.id = "mapImage";

        img.style.position = "absolute";
        img.style.top = "25%";
        img.style.left = "50%"; 
        img.style.transform = "translateX(-50%)";

        img.style.width = "20vw"; 
        img.style.height = "auto";
        img.style.maxWidth = "90%"; 
        img.style.maxHeight = "80vh";

        container.appendChild(img);

    }
}



function showMiniGame() {
    window.location.href = "miniGame.html";
}
