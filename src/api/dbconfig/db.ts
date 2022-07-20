import * as dotenv from "dotenv";
import * as mysql2 from "mysql2";

dotenv.config();
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as unknown as number,
});
export default pool;
