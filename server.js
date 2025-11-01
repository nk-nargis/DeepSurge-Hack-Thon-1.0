const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'csv_visualizer',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create table endpoint
app.post('/api/create-table', async (req, res) => {
    try {
        const { columns } = req.body;
        
        let createTableSQL = 'CREATE TABLE IF NOT EXISTS csv_data (id INT AUTO_INCREMENT PRIMARY KEY, ';
        columns.forEach(column => {
            createTableSQL += `\`${column}\` VARCHAR(255), `;
        });
        createTableSQL = createTableSQL.slice(0, -2) + ')';

        await pool.promise().query(createTableSQL);
        res.json({ success: true, message: 'Table created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save data endpoint
app.post('/api/save-data', async (req, res) => {
    try {
        const data = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid data format');
        }

        const columns = Object.keys(data[0]);
        const values = data.map(row => Object.values(row));
        
        const insertSQL = `INSERT INTO csv_data (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ?`;
        
        await pool.promise().query(insertSQL, [values]);
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get data endpoint
app.get('/api/get-data', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM csv_data');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});