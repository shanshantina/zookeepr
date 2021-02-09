const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

// add the GET route and send the information from server to the webpage
router.get('/animals', (req, res) => {
    // request the info from different queries
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // response back to the website
    res.json(results);
});

// add another GET route to search the animal by ID
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
    
});

// create post route,  represent the action of a client requesting the server to accept data
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // add animal to json file and animals array in this function
   // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // response method to relay a message to the client making the request
        // we send them an HTTP status code and a message to explain what went wrong.
       res.status(400).send('The animal is not properly formatted.');
   } else {
       const animal = createNewAnimal(req.body, animals);
       res.json(animal);
   }  
});

module.exports  = router;