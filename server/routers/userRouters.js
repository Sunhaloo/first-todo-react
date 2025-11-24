// import the 'express' library and function for user at endpoint
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// get the user profile details
router.get("/", authenticateToken, userController.getUserProfile);

// delete the user from the database
router.delete("/", authenticateToken, userController.deleteAccount);

// export the actual routes ( `/api/user/{functionName}` )
module.exports = router;
