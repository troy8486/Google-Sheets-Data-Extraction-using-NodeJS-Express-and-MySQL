import { readFileSync } from 'fs';

/*
 * Returns a database object as an asynchronous promise.
 * database to be used. Defaults to the default defined path usersDBPath.
*/

const getAllJSON = (dbPath) => JSON.parse(readFileSync(dbPath, 'utf-8'));

export default getAllJSON
