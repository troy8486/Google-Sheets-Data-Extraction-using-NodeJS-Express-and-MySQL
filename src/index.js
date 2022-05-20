import { insertData } from './repositories/sql_repository.js';
import jsonFetcher from './data/json_fetcher.js';
import express from 'express';
const port = 8000;

const app = express()

const data = await jsonFetcher()
for (const d of data) {
    insertData(d);
}

app.get('/', function(req, res){
    
})

app.listen(port,
    console.log("Server running at port:", port)
)