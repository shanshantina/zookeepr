const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
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

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// set the server port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});