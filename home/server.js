const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Replace the following with your actual database connection details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tcuser',
  password: 'tcpassword',
  database: 'travelcompanionhub',
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.post('/api/bookings', (req, res) => {
  const { pickupLocation, destinationLocation } = req.body;

  const query = 'INSERT INTO bookings (pickup_location, destination_location) VALUES (?, ?)';
  const values = [pickupLocation, destinationLocation];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting into bookings: ' + error.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const insertedBookingId = results.insertId;
    res.status(201).json({
      id: insertedBookingId,
      pickupLocation,
      destinationLocation,
    });
  });
});

app.get('/api/bookings', (req, res) => {
  const query = 'SELECT * FROM bookings';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving bookings: ' + error.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.get('/', (req, res) => {
  // Your HTML and frontend JavaScript code goes here
  
  res.sendFile(path.join(__dirname,  'index1.html'));
  app.use(express.static(path.join(__dirname)));

 
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
