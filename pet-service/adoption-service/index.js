const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const PET_SERVICE_URL = process.env.PET_SERVICE_URL || 'http://pet-service:8081';

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'adoptions',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'mysecretpassword',
});

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS adoptions (
            id SERIAL PRIMARY KEY,
            pet_id INTEGER NOT NULL,
            pet_name VARCHAR(100),
            adopter_name VARCHAR(100) NOT NULL,
            adopter_email VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Database initialized');
}

app.get('/api/adoptions', async (req, res) => {
    const result = await pool.query('SELECT * FROM adoptions ORDER BY created_at DESC');
    res.json(result.rows);
});

app.post('/api/adoptions', async (req, res) => {
    try {
        const { petId, adopterName, adopterEmail } = req.body;

        const petResponse = await axios.get(`${PET_SERVICE_URL}/api/pets/${petId}`);
        const pet = petResponse.data;

        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        if (!pet.available) return res.status(400).json({ error: 'Pet already adopted' });

        await axios.put(`${PET_SERVICE_URL}/api/pets/${petId}/adopt`);

        const result = await pool.query(
            'INSERT INTO adoptions (pet_id, pet_name, adopter_name, adopter_email) VALUES ($1, $2, $3, $4) RETURNING *',
            [petId, pet.name, adopterName, adopterEmail]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Adoption error:', error.message);
        res.status(500).json({ error: 'Adoption failed' });
    }
});

initDB().then(() => {
    app.listen(3000, () => console.log('Adoption service running on port 3000'));
});