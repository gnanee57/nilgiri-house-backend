const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const reviewsRouter = express.Router();

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


reviewsRouter.use(bodyParser.json());

reviewsRouter.route('/')
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
                range: "reviews",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {
                let id = readData.data.values[i][0];
                let courseId = readData.data.values[i][1];
                let rating = readData.data.values[i][2];
                let author = readData.data.values[i][3];
                let review = readData.data.values[i][4];
                let date = readData.data.values[i][5];

                response.push({id, courseId, rating, author, review, date});
            }
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

    .post(async (req, res, next) => {

        const { id, courseId, rating, author, review, date } = req.body;

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
                range: "reviews",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [[id, courseId, rating, author, review, date]],
                },
            });

            res.send(JSON.stringify('Submission Successful! You will soon receive a confirmation mail. Have a Nice Day.'));
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })

module.exports = reviewsRouter;