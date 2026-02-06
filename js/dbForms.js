sessionStorage.clear();

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    let sqlQuery = `SELECT PlayerID, username FROM PLAYER WHERE username = '${username}' AND user_password = '${password}'`;
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let result = await response.json();

        console.log("Login Response:", result);

        if (result.success && result.data.length > 0) {
            let user = result.data[0];
            sessionStorage.setItem("PlayerID", user.PlayerID);
            sessionStorage.setItem("username", user.username);
            console.log("User logged in:", user);
            showMainMenu();
        } else {
            console.warn("Login failed. Server response:", result);
            alert("Invalid username or password.");
        }
    } catch (error) {
        console.error("Error completing login:", error);
    }
    printSessionStorage();
});




document.getElementById("signUpForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("regUsername").value;
    let password = document.getElementById("regPassword").value;
    let confirmPassword = document.getElementById("confirmRegPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let selectQuery = `SELECT PlayerID FROM PLAYER WHERE username = '${username}'`;
    dbConfig.set('query', selectQuery);

    try {
        let checkResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let checkResult = await checkResponse.json();

        if (checkResult.success && checkResult.data.length > 0) {
            alert("Username already exists.");
            return;
        }
    } catch (error) {
        console.error("Error checking for existing accounts:", error);
    }

    let insertQuery = `
        INSERT INTO PLAYER (username, user_password) VALUES ('${username}', '${password}')
    `;
    dbConfig.set('query', insertQuery);

    try {
        let insertResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });
        let insertResult = await insertResponse.json();
        console.log("Insert Result:", insertResult);

        if (insertResult.success) {
            let getPlayerIDQuery = `SELECT PlayerID FROM PLAYER WHERE username = '${username}'`;
            dbConfig.set('query', getPlayerIDQuery);

            let idResponse = await fetch(dbConnectorUrl, { 
                method: "POST", 
                body: dbConfig 
            });
            let idResult = await idResponse.json();

            if (idResult.success && idResult.data.length > 0) {
                let playerID = idResult.data[0].PlayerID;

                let insertSettingsQuery = `INSERT INTO SETTINGS (PlayerID) VALUES (${playerID})`;
                dbConfig.set('query', insertSettingsQuery);

                await fetch(dbConnectorUrl, { method: "POST", body: dbConfig });

                showLogin();
            } else {
                alert("Error fetching PlayerID.");
            }
        } else {
            alert("Error registering user.");
        }
    } catch (error) {
        console.error("Error registering user:", error);
    }
});





document.getElementById("editDetailsForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    printSessionStorage();

    let username = document.getElementById("updateUsername").value;
    let password = document.getElementById("updatePassword").value;
    let confirmPassword = document.getElementById("confirmUpdatePassword").value;

    let playerID =sessionStorage.getItem("PlayerID");

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }


    let sqlQuery = `UPDATE PLAYER SET username = '${username}', user_password = '${password}'
        WHERE PlayerID = ${playerID}`;
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        console.log("Update Response:", result);

        if (result.success) {
            alert("Account Updated Successfully")
            sessionStorage.setItem("username", username);
            showMainMenu();
        } else {
            console.warn("Update failed. Server response:", result);
            alert("Update Failed");
        }
    } catch (error) {
        console.error("Error updating account:", error);
    }
});


//settings
document.getElementById("settingsForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    printSessionStorage();

    let volume = document.getElementById("volumeSlider").value;
    let contrast = document.querySelector('input[name="contrast"]:checked').value;
    let tts = document.querySelector('input[name="screenReader"]:checked').value;
    let fontSize = document.querySelector('input[name="textSize"]:checked').value;

    let playerID =sessionStorage.getItem("PlayerID");


    let sqlQuery = `
    UPDATE SETTINGS SET 
            Volume = '${volume}', 
            HighContrastMode = '${contrast}',
            TextToSpeech = '${tts}', 
            FontSize = '${fontSize}'
        WHERE PlayerID = ${playerID}`;
    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        console.log("Update Response:", result);

        if (result.success) {
            alert("Settings Updated Successfully")
            showMainMenu();
        } else {
            console.warn("Update failed. Server response:", result);
            alert("Update Failed");
        }
    } catch (error) {
        console.error("Error updating account:", error);
    }
});







//leaderboard//
async function executeDatabaseQuery() {
    let sqlQuery = `SELECT a.username, TIMEDIFF(b.endTime, b.TimeStarted) AS FinishingTime 
                FROM PLAYER a
                INNER JOIN GAMEPLAY b ON a.PlayerID = b.PlayerID
                WHERE b.SceneID = 69
                ORDER BY FinishingTime ASC;`;

    dbConfig.set('query', sqlQuery);
    try {
        let response = await fetch(dbConnectorUrl, {
            method: 'POST',
            body: dbConfig
        });

        let result = await response.json();
        let resultsDiv = document.getElementById('text');
        resultsDiv.innerHTML = '';

        if (result.error) {
            console.error(result.error.toString());
            resultsDiv.innerHTML = `<p style="color:red;">${result.error}</p>`;
        } else if (result.data) {
            resultsDiv.innerHTML = createTableFromData(result.data);
        } else {
            resultsDiv.innerHTML = `<p>${result.success ? 'Query executed successfully' : 'No data returned'}</p>`;
            if (result.affected_rows !== undefined) {
                resultsDiv.innerHTML += `<p>Affected Rows: ${result.affected_rows}</p>`;
            }
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
        document.getElementById('text').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}



async function executeDatabaseQueryItem() {
    let sqlQuery = `SELECT a.ItemDescription AS Item, COUNT(b.ItemID) AS Amount FROM ITEM a 
                INNER JOIN INVENTORY b ON a.ItemID = b.ItemID
                GROUP BY b.ItemID
                order by Amount DESC;`


    dbConfig.set('query', sqlQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: 'POST',
            body: dbConfig
        });

        let result = await response.json();
        let resultsDiv = document.getElementById('textItem');
        resultsDiv.innerHTML = '';

        if (result.error) {
            console.error(result.error.toString());
            resultsDiv.innerHTML = `<p style="color:red;">${result.error}</p>`;
        } else if (result.data) {
            resultsDiv.innerHTML = createTableFromData(result.data);
        } else {
            resultsDiv.innerHTML = `<p>${result.success ? 'Query executed successfully' : 'No data returned'}</p>`;
            if (result.affected_rows !== undefined) {
                resultsDiv.innerHTML += `<p>Affected Rows: ${result.affected_rows}</p>`;
            }
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
        document.getElementById('textItem').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}



function createTableFromData(data) {
    if (!data.length) {
        return `<p>No data available</p>`;
    }

    let headers = Object.keys(data[0]);
    let tableHTML = `
        <div style="display: flex; justify-content: center;">
            <table border='0' style="border-collapse: collapse; width: 60%; text-align: center;">
                <tr style="background-color: #8DAA91; font-size: 20px; color: white;">
                    
    `;

    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });

    tableHTML += "</tr>";

    data.forEach(row => {
        tableHTML += "<tr>";
        headers.forEach(header => {
            tableHTML += `<td>${row[header]}</td>`;
        });
        tableHTML += "</tr>";
    });

    tableHTML += "</table>";
    return tableHTML;
}

executeDatabaseQuery();
executeDatabaseQueryItem();


