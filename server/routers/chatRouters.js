// import the 'express' library and the endpoint's function for 'register' and 'login'
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// 'POST' route ==> /api/chat/message
router.post("/message", authenticateToken, chatController.sendMessage);

// export the actual routes
module.exports = router;
