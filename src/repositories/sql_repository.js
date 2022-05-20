import connection from '../data/database.js';
import getAllJSON from './json_repository.js';

const config = getAllJSON('src/data/config.json')

const tableName = config.table;
/**
 * @type {string[]}
 */
const dbColumns = config.columns.map((column) => column.db_column_name);
const dbColTypes = config.columns.map((column) => column.db_data_type);
const dbUnique = config.columns.map((column) => column.part_of_uniqueness);

connection.on('error', (err) => console.log("[mysql error]",err));

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

export const insertData = (dao) => {
  const fields = dbColumns.join(", ");
  const setSection = [];
  const whereSection = [];
  for (const i in dbColumns){
    const query = (dbColTypes[i] === 'string') ? 
          `${dbColumns[i]} = '${dao[dbColumns[i]]}'` : `${dbColumns[i]} = ${dao[dbColumns[i]]}`;
    if (dbUnique[i] == true) {
      whereSection.push(query);
    } else {
      setSection.push(query);
    }
  }

  const values = [];
  for (const i in dbColumns) {
    if (dbColTypes[i] === 'string') {
      values.push(`'${dao[dbColumns[i]]}'`);
    } else {
      values.push(dao[dbColumns[i]]);
    }
  }

  // console.log(`fields: ${fields}`);
  // console.log(`values: ${values}`);
  const sql = `INSERT INTO ${tableName} (${fields}) VALUES (${values})`;
  connection.query(sql, function (insertError, insertResult) {
    if (insertError) {
      if (insertError.code === 'ER_DUP_ENTRY') {
        const updateSQL = `UPDATE ${tableName} SET ${setSection.join(", ")} WHERE ${whereSection.join(" AND ")}`;
        connection.query(updateSQL, function (updateError, updateResult) {
          if (!updateError) console.log("1 record updated");
          else throw updateError;
        });
      } else {
        throw insertError;
      }
    } else {
      console.log("1 record inserted");
    } 
  });
};

export const getAllData = () => connection.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) console.error(err);
    return res;
});