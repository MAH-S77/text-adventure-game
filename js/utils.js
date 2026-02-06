const dbConnectorUrl = "https://smcloughlin19.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let dbConfig = new URLSearchParams({
    hostname: 'localhost',
    username: 'smcloughlin19',
    password: 'YRj32hZn0ZSYlBqX',
    database: 'CSC1034_CW_77',
});


function printSessionStorage() {
    console.log("Session Storage Items:");
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        let value = sessionStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
}




function checkLogin() {
    if (!sessionStorage.getItem('PlayerID')) {
        window.location.href = 'startScreen.html';
        return;
    }
}
