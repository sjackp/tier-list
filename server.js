import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// Connection string must be provided via environment variable in production.
const connectionString = process.env.NEON_DB_URL;
if (!connectionString) {
  console.error('NEON_DB_URL environment variable is not set. The server cannot connect to the database.');
}
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

app.get('/years', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT year FROM tracks ORDER BY year DESC');
    const years = result.rows.map(r => r.year);
    res.json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error fetching years' });
  }
});

app.get('/tracks', async (req, res) => {
  const year = req.query.year;
  try {
    const query = year ? 'SELECT id::text, track_name as content, link, notes, year FROM tracks WHERE year = $1 ORDER BY id' : 'SELECT id::text, track_name as content, link, notes, year FROM tracks ORDER BY id';
    const params = year ? [year] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error fetching tracks' });
  }
});

const port = process.env.PORT || 5174;
app.listen(port, () => console.log(`API server listening on ${port}`));
