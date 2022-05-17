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
    let queryString = 'SELECT * FROM inventory;';
    pool.query(queryString)
    .then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

// POST
koalaRouter.post('/', (req, res) => {
    console.log('POST /inventory');
    const queryString = 'INSERT INTO inventory (name, gender, age, ready_to_transfer, notes) VALUES ($1, $2, $3, $4, $5);';
    let values = [req.body.name, req.body.gender, req.body.age, req.body.readyForTransfer, req.body.notes];
    pool.query(queryString, values)
    .then(result => {
        res.sendStatus(201);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
}) 

// PUT
koalaRouter.put('/', (req, res) => {
    console.log('PUT /inventory');
    returnReadyForTransfer(req.body.id)
    .then(result => {
        console.log(result)
        if (result === 'N') {
            const queryString = `UPDATE inventory SET ready_to_transfer = 'Y' WHERE id = ${req.body.id};`;
            pool.query(queryString)
            .then(result => {
                res.sendStatus(201);
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })
        } else {
            const queryString = `UPDATE inventory SET ready_to_transfer = 'N' WHERE id = ${req.body.id};`;
            pool.query(queryString)
            .then(result => {
                res.sendStatus(201);
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })
        }
    })
})

// DELETE
koalaRouter.delete('/', (req, res) => {
    console.log('DELETE /inventory');
    const queryString = `DELETE FROM inventory WHERE id = ${req.body.id};`;
    pool.query(queryString)
    .then(result => {
        res.sendStatus(201);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

function returnReadyForTransfer(id) {
    const queryString = `SELECT ready_to_transfer FROM inventory WHERE id = ${id};`;
    return pool.query(queryString)
    .then(result => {
        let letter = result.rows[0].ready_to_transfer
        return letter
    })
}

module.exports = koalaRouter;