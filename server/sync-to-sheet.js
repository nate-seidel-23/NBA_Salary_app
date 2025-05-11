const { GoogleSpreadsheet } = require('google-spreadsheet');
const mysql = require('mysql2/promise');
require('dotenv').config();

const creds = require('./credentials.json'); // Path to your Google service account credentials

async function syncSheetToMySQL() {
  // 1. Connect to Google Sheet
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0]; // Adjust index or use doc.sheetsByTitle['Sheet1']
  const rows = await sheet.getRows();

  // 2. Connect to MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // 3. Optional: clear table before inserting
  await connection.execute('DELETE FROM your_table');

  // 4. Insert rows
  for (const row of rows) {
    await connection.execute(
      'INSERT INTO your_table (col1, col2, col3) VALUES (?, ?, ?)',
      [row.col1, row.col2, row.col3] // Adjust based on sheet column names
    );
  }

  console.log('Data synced successfully!');
  await connection.end();
}

syncSheetToMySQL().catch(console.error);
