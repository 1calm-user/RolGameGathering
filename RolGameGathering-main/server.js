const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rol_game_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// GET all characters
app.get('/api/characters', (req, res) => {
    db.query('SELECT * FROM characters', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener personajes' });
            return;
        }
        res.json(results);
    });
});

// GET single character
app.get('/api/characters/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM characters WHERE char_id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener el personaje' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Personaje no encontrado' });
            return;
        }
        res.json(results[0]);
    });
});

// CREATE character
app.post('/api/characters', (req, res) => {
    const character = req.body;
    db.query('INSERT INTO characters SET ?', character, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear el personaje' });
            return;
        }
        res.json({ id: result.insertId, ...character });
    });
});

// UPDATE character
app.put('/api/characters/:id', (req, res) => {
    const id = req.params.id;
    const character = req.body;
    db.query('UPDATE characters SET ? WHERE char_id = ?', [character, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al actualizar el personaje' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Personaje no encontrado' });
            return;
        }
        res.json({ id, ...character });
    });
});

// DELETE character
app.delete('/api/characters/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM characters WHERE char_id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el personaje' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Personaje no encontrado' });
            return;
        }
        res.json({ message: 'Personaje eliminado exitosamente' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});