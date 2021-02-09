const fs = require("fs");
const path = require("path");

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
    fs.writeFileSync(path.join(__dirname, '../data/animals.json'), JSON.stringify({ animals: animalsArray }, null, 2));

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
};

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};