// import the 'express' library and function for chat at each endpoint
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// create new AI chat for logged-in and authenticated user
router.post("/", authenticateToken, chatController.chat);

// create new AI greeting message for logged-in and authenticated user
router.post("/greeting", authenticateToken, chatController.greetingMessage);

// export the actual routes ( `/api/todos/{functionName}` )
module.exports = router;
