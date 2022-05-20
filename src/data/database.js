import { createConnection } from "mysql";
import getAllJSON from '../repositories/json_repository.js';

const config = getAllJSON('src/data/config.json')

var connection = createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
});

export default connection;