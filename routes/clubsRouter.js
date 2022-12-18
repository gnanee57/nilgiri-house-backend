const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const clubsRouter = express.Router();

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


clubsRouter.use(bodyParser.json());

clubsRouter.route('/')
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
                range: "clubs",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {
                let clubId = readData.data.values[i][1];
                let clubName = readData.data.values[i][2];
                let clubDescription = readData.data.values[i][3];
                let clubLeader = readData.data.values[i][4];
                let contactId = readData.data.values[i][5];
                let clubWhatsAppLink = readData.data.values[i][6];
                let clubPic = readData.data.values[i][7];

                response.push({clubId, clubName, clubDescription, clubLeader, contactId, clubWhatsAppLink, clubPic});
            }
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

module.exports = clubsRouter;