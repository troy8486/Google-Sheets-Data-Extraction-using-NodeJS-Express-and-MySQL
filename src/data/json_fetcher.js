import { assert } from "console";
import { google } from "googleapis";
import getAllJSON from "../repositories/json_repository.js";
const config = getAllJSON('src/data/config.json')

const service = google.sheets("v4");
const { client_email, private_key } = getAllJSON('src/data/credentials.json')

// Configure auth client
const authClient = new google.auth.JWT(
    client_email,
    null,
    private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

const jsonFetcher = async function () {
    try {

        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);

        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: config.google_sheet_id,
            //range: "'Sheet1'!A:D",
            range: "'" + config.sheetname + "'!" + config.range,
        });

        // All of the details
        const details = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our data array
        if (rows.length) {

            // Remove the headers
            rows.shift()
            const dbColumns = config.columns.map((column) => column.db_column_name);
            //console.log(dbColumns)
            for (let row of rows) {
                assert(dbColumns.length == row.length)
                const detail = {}
                for (let j in row){
                    detail[dbColumns[j]] = row[j] 
                }
                details.push(detail)
            }

        } else {
            console.log("No details found");  
        }
        //console.log(details)

        // Saved the details
        return details

    } catch (error) {
        // Log the error
        console.error(error);

        // Exit the process with error
        return {};
    }
};

export default jsonFetcher;