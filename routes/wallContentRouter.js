const express = require('express');
const bodyParser = require('body-parser');
const {google} = require("googleapis");

const wallContentRouter = express.Router();

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


wallContentRouter.use(bodyParser.json());

wallContentRouter.route('/')
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
                range: "wallContent!1:61",
            });
            let response = [];

            for (let i = 1; i < readData.data.values.length; i++) {

                let id = parseInt(readData.data.values[i][0]);
                let tabId = parseInt(readData.data.values[i][1]);
                let authorId = parseInt(readData.data.values[i][2]);
                let author = readData.data.values[i][3];
                let groupId =parseInt(readData.data.values[i][4]);
                let featured = readData.data.values[i][5];
                let contentType = readData.data.values[i][6];
                let shareUrl = readData.data.values[i][7];
                let link = readData.data.values[i][8];

                response.push({id,tabId,authorId,author,groupId,featured,contentType,shareUrl,link})
            }

            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })


wallContentRouter.route('/:Id')

    .get((req,res,next) => {
        res.end('Will send details of the dish: ' + req.params.Id +' to you!');
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'+ req.params.dishId);
    })

    .put((req, res, next) => {
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);
    })

    .delete((req, res, next) => {
        res.end('Deleting dish: ' + req.params.dishId);
    })



module.exports = wallContentRouter;