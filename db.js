import mysql from 'mysql2/promise';
import 'dotenv/config';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Basic sanity checks to provide a helpful error message instead of the
// generic "Access denied" when the developer forgot to set env vars.
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error('\nMissing required database environment variables.');
  console.error('Please check your `.env` file and set DB_HOST, DB_USER, and DB_NAME.\n');
  process.exit(1);
}

if (!DB_PASSWORD || DB_PASSWORD === 'your_mysql_password_goes_here') {
  console.error('\nDatabase password looks unset or still uses the placeholder.');
  console.error('Update `DB_PASSWORD` in your `.env` with your MySQL password (or set DB_USER/DB_PASSWORD to a valid user).\n');
  process.exit(1);
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(' Database connection successful!');
    connection.release();
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    process.exit(1);
  }
};

export default pool;
