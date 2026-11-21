const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tienda.db');
db.all('SELECT id, nombre, tipo, imagen FROM productos LIMIT 5', (err, rows) => {
  console.log(JSON.stringify(rows, null, 2));
  db.close();
});