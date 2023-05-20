
  // host: 'localhost',
  // user: 'root',
  // password: 'password',
  // database: 'student_app',

  const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'student_app',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET request to the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for getting all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// API endpoint for creating a new student
app.post('/students', (req, res) => {
  const student = req.body;
  const sql = 'INSERT INTO students SET ?';

  db.query(sql, student, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('New student created:', result.insertId);
    res.sendStatus(201);
  });
});

// API endpoint for updating a student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const student = req.body;
  const sql = 'UPDATE students SET ? WHERE id = ?';

  db.query(sql, [student, id], (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Student updated:', id);
    res.sendStatus(200);
  });
});

// API endpoint for deleting a student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';

  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Student deleted:', id);
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

