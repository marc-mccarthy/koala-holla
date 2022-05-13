const express = require('express');
const koalaRouter = express.Router();
const pg = require('pg');

// DB CONNECTION
const pool = new pg.Pool({
    database: 'koala-holla',
    host: 'localhost',
    port: 5432,
    max: 12,
    idleTimeoutMillis: 30000 
});

// GET
koalaRouter.get('/', (req, res) => {
    console.log('GET /inventory');
    pool.query(`SELECT * FROM inventory`)
    .then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

// POST
koalaRouter.get('/', (req, res) => {
    console.log('POST /inventory');
    pool.query()
})

// PUT


// DELETE

module.exports = koalaRouter;