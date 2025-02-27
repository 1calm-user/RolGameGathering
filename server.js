const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('.'));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Database connection
const db = new sqlite3.Database('./database/rol_game_db.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
    
    // Initialize database schema
    const fs = require('fs');
    const schema = fs.readFileSync('./database/schema.sqlite', 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
            return;
        }
        console.log('Database schema initialized');
    });

});

// GET all characters
app.get('/api/characters', (req, res) => {
    db.all('SELECT * FROM characters', [], (err, results) => {
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
    db.get('SELECT * FROM characters WHERE char_id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener el personaje' });
            return;
        }
        if (!result) {
            res.status(404).json({ error: 'Personaje no encontrado' });
            return;
        }
        res.json(result);
    });
});

// CREATE character
app.post('/api/characters', (req, res) => {
    const character = req.body;
    const { race, char_name, char_weight, objects, abilities, dexterity } = character;
    db.run('INSERT INTO characters (race, char_name, char_weight, objects, abilities, dexterity) VALUES (?, ?, ?, ?, ?, ?)',
        [race, char_name, char_weight, objects, abilities, dexterity],
        function(err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al crear el personaje' });
                return;
            }
            res.json({ id: this.lastID, ...character });
    });
});

// UPDATE character
app.put('/api/characters/:id', (req, res) => {
    const id = req.params.id;
    const character = req.body;
    const { race, char_name, char_weight, objects, abilities, dexterity } = character;
    db.run('UPDATE characters SET race = ?, char_name = ?, char_weight = ?, objects = ?, abilities = ?, dexterity = ? WHERE char_id = ?',
        [race, char_name, char_weight, objects, abilities, dexterity, id],
        function(err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al actualizar el personaje' });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Personaje no encontrado' });
                return;
            }
            res.json({ id, ...character });
    });
});

// DELETE character
app.delete('/api/characters/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM characters WHERE char_id = ?', [id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el personaje' });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Personaje no encontrado' });
            return;
        }
        res.json({ message: 'Personaje eliminado exitosamente' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});