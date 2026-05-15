const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'FERNANDO2008', 
  database: 'fastech_db'
});

db.connect((err) => {
  if (err) console.log("Error de conexión a BD:", err);
  else console.log("Conectado a MySQL");
});

// OBTENER PRODUCTOS
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// INSERTAR PRODUCTO
app.post('/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
  [nombre, precio, stock], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, ...req.body });
  });
});

// ELIMINAR PRODUCTO (ID ESPECÍFICO)
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Eliminado correctamente');
  });
});

app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));