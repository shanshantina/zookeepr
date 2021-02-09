const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require('./data/animals');

function filterByQuery(query, animalsArray) {
    let personalityTraitsAarry = [];
    // note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsAarry = [query.personalityTraits];
        } else {
            personalityTraitsAarry = query.personalityTraits;
        }
        // loop through each trait in the personalityTraits array
        personalityTraitsAarry.forEach(trait => {
            // check the trait against each animal in the filtered Results array
            // remember, it is initially a copy of the animalsArray
            // but here we're updating it for each trait in the .forEach() loop
            // for each trait being targeted by the filter, the filteredResults
            // array will then contian only the entries that contian the trait
            // so at the end we'ss have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);          
        });        
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
};

// add function for search by id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// add the route and send the information to server
app.get('/api/animals', (req, res) => {
    // request the info from different queries
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // response back to the website
    res.json(results);
});

// add another GET route to search the animal by ID
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
    
});

// set the server port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});