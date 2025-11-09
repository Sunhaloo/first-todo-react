// add the 'express', 'cors' and 'dotenv' libraries
const express = require("express");
const cors = require("cors");

// simply import the data found in our `.env` file
require("dotenv").config();

// create the actual 'express' application / server
const app = express();
// define the port ( default to environment variable or '5000' )
const PORT = process.env.PORT || 5000;

// define the middleware with 'cors'
// NOTE: the function that is going to allow front-end to talk with back-end
app.use(cors());

// convert front-end data into JS object
app.use(express.json());

// Routings

// test the main "landing" route
app.get("/", (req, res) => {
  res.json({
    message: "TODO API Running!",
    status: "success",
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running on 'http://localhost:${PORT}'`);
});
