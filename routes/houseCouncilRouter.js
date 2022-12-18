const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const houseCouncilRouter = express.Router();

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


houseCouncilRouter.use(bodyParser.json());

houseCouncilRouter.route('/')
    .options((req, res) => { res.sendStatus(200); })

    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(async (req, res, next) => {

        try {
            const { sheets } = await authentication();
            const readData = await  sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: "houseCouncil",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {

                let id = parseInt(readData.data.values[i][0]);
                let groupId =parseInt(readData.data.values[i][1]);
                let studentId = readData.data.values[i][2].substring(0,10);
                let studentName = readData.data.values[i][3];
                let role = readData.data.values[i][5];
                let downloadUrl = readData.data.values[i][7];

                response.push({id, groupId, studentId, studentName, role, downloadUrl})
            }

            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })




module.exports = houseCouncilRouter;