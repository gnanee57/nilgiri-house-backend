const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const courseMenuRouter = express.Router();

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


courseMenuRouter.use(bodyParser.json());

courseMenuRouter.route('/')
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
                range: "courses",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {
                let id = readData.data.values[i][0];
                let name = readData.data.values[i][1];
                let preRequisites = readData.data.values[i][2];
                let level = readData.data.values[i][3];
                let description = readData.data.values[i][4];
                let instructors = readData.data.values[i][5];
                let image = readData.data.values[i][6];
                let whatsApp = readData.data.values[i][7];
                let playlist = readData.data.values[i][7];

                response.push({id, name, preRequisites, level, description, instructors, image,whatsApp,playlist});
            }
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

module.exports = courseMenuRouter;