const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const eventsRouter = express.Router();

const spreadsheetId = "1s7S_-JEzHykt37Jcd8TnHAJ4fSA26n7vKctFCGw8aFs";

const authentication = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const sheets = google.sheets({version: "v4", auth: client});

    return { sheets }
}


eventsRouter.use(bodyParser.json());

eventsRouter.route('/')
    .options((req, res) => { res.sendStatus(200); })

    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(async (req, res, ) => {

        try {
            const { sheets } = await authentication();
            const readData = await  sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: "events",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {
                let eventId = readData.data.values[i][0];
                let type = readData.data.values[i][1];
                let eventName = readData.data.values[i][2];
                let eventDescription = readData.data.values[i][3];
                let eventDownloadLink = readData.data.values[i][5];
                let venue = readData.data.values[i][6];
                let eventStartDate = readData.data.values[i][7];
                let eventEndDate = readData.data.values[i][8];
                let eventStartTime = readData.data.values[i][9];
                let eventEndTime = readData.data.values[i][10];
                let registerLink = readData.data.values[i][11];
                let meetLink = readData.data.values[i][12];
                let winnersTag = readData.data.values[i][13];
                let prizeWinners1 = readData.data.values[i][14];
                let prizeWinners2 = readData.data.values[i][15];
                let prizeWinners3 = readData.data.values[i][16];

                response.push({eventId, type, eventName, eventDescription, eventDownloadLink, venue,
                eventStartDate,eventEndDate,eventStartTime,eventEndTime,registerLink,meetLink,
                winnersTag, prizeWinners1,prizeWinners2,prizeWinners3});
            }
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

module.exports = eventsRouter;