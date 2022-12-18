const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const {google} = require("googleapis");

const studentDetailsRouter = express.Router();

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


studentDetailsRouter.use(bodyParser.json());

studentDetailsRouter.route('/:studentId')
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
                range: "houseDetails",
            });
            let response = [];

            console.log(req.params.studentId)

            for (let i = 1; i < readData.data.values.length; i++) {
                if((req.params.studentId).toLowerCase() + '@student.onlinedegree.iitm.ac.in' === readData.data.values[i][0]) {
                    let studentId = readData.data.values[i][0].substring(0,10);
                    let groupId = parseInt(readData.data.values[i][1]);
                    let house = readData.data.values[i][2];
                    let termAdded = moment(readData.data.values[i][3]).format("DD-MM-YYYY");
                    response.push({studentId, groupId, house, termAdded})
                    break;
                }
            }
            console.log(response);
            res.send(response);
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    })





module.exports = studentDetailsRouter;