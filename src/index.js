const express = require( "express" );
const app = express();
const port = 4000; // default port to listen
const radarJson = require('./temp/radarsList.json')

// define a route handler for the default home page
app.get( "/crawler-radar-data", ( req, res ) => {
    res.send(radarJson);
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );