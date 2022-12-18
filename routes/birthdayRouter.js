const express = require('express');
const bodyParser = require('body-parser');
const moment = require("moment");
const app = require("../app");
const {google} = require("googleapis");

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

const birthdayRouter = express.Router();

birthdayRouter.use(bodyParser.json());

birthdayRouter.route('/')
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
                range: "birthdays",
            });

            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {
                if(moment(readData.data.values[i][3]).isSame(moment(), 'day')) {
                    let name = readData.data.values[i][1];
                    let linkUrl = readData.data.values[i][5];
                    response.push({name,linkUrl})
                    break;
                }
            }

            console.log(response)
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })


module.exports = birthdayRouter;