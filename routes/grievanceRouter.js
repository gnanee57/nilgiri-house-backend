const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const grievanceRouter = express.Router();

const spreadsheetId = "1s7S_-JEzHykt37Jcd8TnHAJ4fSA26n7vKctFCGw8aFs";

grievanceRouter.use(bodyParser.json());

grievanceRouter.route('/')
    .options((req, res) => {
        res.sendStatus(200);
    })

    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        next();
    })

    .get(async (req, res, next) => {
        res.end('Thank You')
    })

    .post(async (req, res, next) => {

        const { studentName, studentId, type, grievance, anyAssistance, date } = req.body;

        try {

            const auth = new google.auth.GoogleAuth({
                keyFile: "credentials.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets",
            });

            // Create client instance for auth
            const client = await auth.getClient();

            // Instance of Google Sheets API
            const sheets = google.sheets({version: "v4", auth: client});


            await sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: "grievance!A:F",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [[studentName, studentId, type, grievance, anyAssistance, date]],
                },
            });

            res.send(JSON.stringify('Submission Successful! You will soon receive a redressal for your Grievance. Have a Nice Day.'));
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })




module.exports = grievanceRouter;