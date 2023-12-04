import 'dotenv/config';
import * as poems from './poems_model.mjs';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT;

const app = express();

app.use(cors());

/**
* @param {string} str
* Return true if the string is greater than length 0
*/
function isNotEmpty(str) {
    if (str.length > 0){
        return true
    }
    else{
        return false
    }
}

/**
* @param {object} req_body
* Return true if the request body input is valid
*/
function isValid(req_body){
    if (isNotEmpty(req_body.name) 
    && isNotEmpty(req_body.poem)){
        return true;
    } else {
        return false;
    };
}

app.use(express.json());

/**
 * Create a new poem with the name and poem(body) provided in the body
 */
app.post('/poems', (req, res) => {
    if (isValid(req.body) === true){
        poems.createPoem(req.body.name, req.body.poem)
            .then(poem => {
                res.status(201).json(poem);
            })
            .catch(error => {
                console.error(error);
                res.status(400).json({ Error: "Invalid request" });
            });
    } else {
        console.error(`number validity, name: ${isNotEmpty(req.body.name)}, poem(body): ${isNotEmpty(req.body.poem)} `);
        res.status(400).json({ Error: "Invalid request" });
    }
});


/**
 * Retrive the poem corresponding to the ID provided in the URL.
 */
app.get('/poems/:_id', (req, res) => {
    const poemId = req.params._id;
    poems.findPoembyId(poemId)
        .then(poem => { 
            if (poem !== null) {
                res.status(200).json(poem);
            } else {
                res.status(404).json({ Error: "Not found" });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: "Request failed" });
        });
});

/**
 * Retrieve poems. 
 * If the query parameters include a name, then only the poems for that name are returned.
 * Otherwise, all poems are returned.
 */
app.get('/poems', (req, res) => {
    let filter = {};

    
    if(req.query.name !== undefined){
        filter = { name: req.query.name };
    }
    if(req.query.poem !== undefined){
        filter = { poem: req.query.poem };
    }
    
    poems.findPoems(filter, '', 0)
        .then(poems => {
            res.status(200).send(poems);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: "Request failed" });
        });});

/**
 * Update the poems whose id is provided in the path parameter and set
 * its name, and poem(body) to the values provided in the body.
 */
app.put('/poems/:_id', (req, res) => {
    if (isValid(req.body) === true){
        poems.updatePoems({_id: req.params._id}, {name: req.body.name, poem: req.body.poem } )
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.status(200).json({ _id: req.params._id, name: req.body.name, poem: req.body.poem })
            } else {
                res.status(404).json({ Error: "Not found" });
            }
        })
            .catch(error => {
                console.error(error);
                res.status(400).json({ Error: "Request failed" });
        });
    }else{
        console.error(`number validity, name: ${isNotEmpty(req.body.name)}, poem(body): ${isNotEmpty(req.body.poem)} `);
        res.status(400).json({ Error: "Invalid request" });
    };
        
    } );

/**
 * Delete the poem whose id is provided in the query parameters
 */
app.delete('/poems/:_id', (req, res) => {
    poems.deletePoemById(req.params._id)
    .then(deletedCount => {
        if (deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: "Not found" });
        }
    })
    .catch(error => {
        console.error(error);
        res.send({ error: "Request failed" });
    });});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});