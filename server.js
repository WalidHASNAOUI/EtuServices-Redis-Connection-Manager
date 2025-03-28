import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars'; 

const app = express();
const port = 3000;

// Get the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({
  defaultLayout: null  // Disable the default layout
}));
app.set('view engine', 'handlebars');

// SQLite database connection
const db = new sqlite3.Database('./src/database/etuservices.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get user statistics
app.get('/accueil', async (req, res) => {
    // Query SQLite to get all users
    const sql = 'SELECT id, firstname, lastname, email FROM utilisateurs';
    
    db.all(sql, [], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      // For each user, get their connection count from Redis
      const userStats = [];
  
      for (const user of rows) {
        try {
          // Get the number of connections from Redis
          const redisRes = await axios.post('http://localhost:5001/can_user_connect', {
            user_id: user.id.toString()
          });
  
          // Get connection count if allowed or 0 if not allowed
          const connectionCount = redisRes.data.allowed ? 1 : 0;
          
          // Add to the user stats
          userStats.push({ ...user, connections: connectionCount });
        } catch (error) {
          console.error(`Error fetching data for user ${user.id}:`, error);
        }
      }

      console.log(userStats);
      // Render the accueil page and pass the user statistics to it
      res.render('accueil', { users: userStats });
    });
  });

// Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM utilisateurs WHERE email = ? AND password = ? LIMIT 1';
  db.get(sql, [email, password], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal Error' });
    }
    if (!row) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const user = row;
    const userId = user.id;

    try {
      const pythonRes = await fetch('http://localhost:5001/can_user_connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId.toString() })
      });
      const data = await pythonRes.json();

      if (data.allowed) {
        return res.status(200).json({ msg: 'Login successful', user: user });
      } else {
        return res.status(429).json({ msg: 'Too many requests. Try again later.' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error communicating with Python service' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
