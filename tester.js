const db = require('better-sqlite3')('./data.db');
momen="moo"
db.exec(`INSERT INTO urls VALUES ('${momen}')`)
const row = db.prepare(`SELECT * FROM urls WHERE url = ?`).get("moooo");
console.log(typeof row)