const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
// app.use are the middleware to our server
// those two function below is always needed when we create a server that's accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());
// request to use css and js from front-end code always needed when we link the server to front-end code
/* The way it works is that we provide a file path to a location in our application (in this case, the public folder) 
and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed 
without having a specific server endpoint created for it!*/ 
app.use(express.static('public'));
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

// create animal function
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // actual add the input file to origin array
    /* we're using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't require a callback function. 
    If we were writing to a much larger data set, the asynchronous version would be better. 
    But because this isn't a large file, it will work for our needs. We want to write to our animals.json file in the data subdirectory, 
    so we use the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, 
    with the path to the animals.json file.
    we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. 
    The other two arguments used in the method, null and 2, are means of keeping our data formatted. 
    The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. 
    The 2 indicates we want to create white space between our values to make it more readable. If we were to leave those two arguments out, 
    the entire animals.json file would work, but it would be really hard to read.*/
    fs.writeFileSync(path.join(__dirname, './data/animals.json'), JSON.stringify({ animals: animalsArray }, null, 2));

    // return finished code to post route for response
    return animal;
};

// validate the input animal information
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
}

// add the GET route and send the information from server to the webpage
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

// add route to get the html file
// '/' brings us to the root route of the server! This is the route used to create a homepage for a server.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// add route to get animals.html work
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// add route to get zookeeper.html work
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// create post route,  represent the action of a client requesting the server to accept data
app.post('/api/animals', (req, res) => {
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


// set the server port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});