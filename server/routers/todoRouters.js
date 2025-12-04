// import the 'express' library and function for TODOs at each endpoint
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// get available categories ( 'GET method on `/api/todos/categories`' )
router.get("/categories", authenticateToken, todoController.getCategories);

// get all TODO items for logged-in and authenticated user ( 'GET method on `/api/todos`' )
router.get("/", authenticateToken, todoController.getTodos);

// create new TODO item for logged-in and authenticated user ( 'POST method on `/api/todos`' )
router.post("/", authenticateToken, todoController.createTodo);

// update TODO item for logged-in and authenticated user ( 'PUT method on `/api/todos`' )
router.put("/:id", authenticateToken, todoController.updateTodo);

// delete TODO item for logged-in and authenticated user ( 'DELETE method on `/api/todos`' )
router.delete("/:id", authenticateToken, todoController.deleteTodo);

// export the actual routes ( `/api/todos/{functionName}` )
module.exports = router;
