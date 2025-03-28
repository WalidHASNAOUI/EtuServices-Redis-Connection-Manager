import express from 'express';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3'; 
const { Database } = sqlite3;  

const router = express.Router();

// SQLite database connection
const db = new Database('./src/database/etuservices.db');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in SQLite database
  const sql = 'SELECT * FROM utilisateurs WHERE email = ? AND password = ? LIMIT 1';
  db.get(sql, [email, password], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal Error' });
    }
    if (!row) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // User found
    const user = row;
    const userId = user.id;

    // Check usage limit via Python microservice
    try {
      const pythonRes = await fetch('http://localhost:5001/can_user_connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId.toString() })
      });
      const data = await pythonRes.json();

      if (data.allowed) {
        // Allowed
        return res.status(200).json({ msg: 'Login successful', user: user });
      } else {
        // Not allowed
        return res.status(429).json({ msg: 'Too many requests. Try again later.' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error communicating with Python service' });
    }
  });
});

export default router;
