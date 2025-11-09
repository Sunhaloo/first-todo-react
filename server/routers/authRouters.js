// import the 'express' library and the endpoint's function for 'register' and 'login'
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 'POST' route ==> /api/auth/register
router.post("/register", authController.register);

// 'POST' route ==> /api/auth/login
router.post("/login", authController.login);

// export the acutal routes ( `/register` and `/login` )
module.exports = router;
