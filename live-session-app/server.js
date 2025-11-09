// server.js
require('dotenv').config();
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASSWORD:", process.env.DB_PASSWORD);
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static
app.use('/public', express.static(path.join(__dirname, 'public')));

// DB pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'live_sessions_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Admin page (Start Session UI)
app.get('/', (req, res) => {
  res.render('admin', { baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT||3000}` });
});

// API: Create session
app.post('/api/sessions', async (req, res) => {
  try {
    const type = 'admin';
    const unique_id = uuidv4();
    const userurl = `${(process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`)}/join/${unique_id}`;

    const sql = `INSERT INTO live_sessions (type, unique_id, userurl) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [type, unique_id, userurl]);

    res.json({
      success: true,
      session: {
        id: result.insertId,
        type,
        unique_id,
        userurl
      }
    });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// Serve student join page (when userurl is opened)
app.get('/join/:unique_id', async (req, res) => {
  const unique_id = req.params.unique_id;
  try {
    const [rows] = await pool.execute('SELECT * FROM live_sessions WHERE unique_id = ?', [unique_id]);
    if (rows.length === 0) {
      return res.status(404).send('Session not found');
    }
    const session = rows[0];
    // Render student page; we inject the unique_id and session info
    res.render('student', { session, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// API: session details (optional)
app.get('/api/sessions/:unique_id', async (req, res) => {
  try {
    const unique_id = req.params.unique_id;
    const [rows] = await pool.execute('SELECT * FROM live_sessions WHERE unique_id = ?', [unique_id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, session: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
