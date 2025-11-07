// import the 'knex' library
const knex = require("knex");
const knexconfig = require("../knexfile.js");

// get the current environment --> default to 'development' if not found
const environment = process.env.NODE_ENV || "development";

// initialise knex with our 'knexfile.js' configuratin file
const db = knex(knexconfig[environment]);

// export the connection ( to be used in other files )
module.exports = db;
