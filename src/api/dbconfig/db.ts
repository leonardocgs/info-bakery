import * as mysql2 from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as any as number
});
console.log(process.env);
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    console.log(err);
  }
  if (connection) {
    connection.query('DESCRIBE baker', (err, response) => {
      console.log(response);
    });
  }
});