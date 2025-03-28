const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database/etuservices.db');  // Change the path to your SQLite DB file

// Create the users table if it does not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT,
      lastname TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Insert mock data into the users table
  const stmt = db.prepare("INSERT INTO utilisateurs (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");

  // Add some mock users
  stmt.run('John', 'Doe', 'john.doe@example.com', 'password123');
  stmt.run('Jane', 'Doe', 'jane.doe@example.com', 'password123');
  stmt.run('Mark', 'Smith', 'mark.smith@example.com', 'password123');
  stmt.run('Emma', 'Johnson', 'emma.johnson@example.com', 'password123');
  stmt.run('Liam', 'Brown', 'liam.brown@example.com', 'password123');

  stmt.finalize();

  console.log('Mock data inserted into the database');
});

// Close the database connection
db.close();
