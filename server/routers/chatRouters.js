// import the 'express' library and the endpoint's function for 'register' and 'login'
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// 'POST' route ==> /api/chat/message
router.post("/message", chatController.sendMessage);

// export the actual routes
module.exports = router;
