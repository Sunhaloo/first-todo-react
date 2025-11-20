// import the "database connection"
const db = require("../db/knex");

// import the `TODO_CATEGORIES` list
const { TODO_CATEGORIES } = require("../config/categories");

// function to be able to create a new 'TODO' item
const createTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;

    // get the 'description' and 'category' from the body of the request
    const { description, category } = req.body;

    // if user did not add any description for the TODO item
    // NOTE: status code = '400' ==> cannot / will not process client request due to client-side error
    if (!description) {
      return res.status(400).json({
        error: "Description is required",
      });
    }

    // INFO: no need to validate the 'category' / 'completed' as it's going to be defaulted to 'Miscellaneous'!

    // insert the new TODO item into the database
    const [todoId] = await db("todo").insert({
      user_id: userId,
      description,
      category: category || "Miscellaneous",
      completed: false,
    });

    // get the `id` of the newly created TODO item
    // INFO: the `.first` function / method is going to only get the "first" data
    const newTodo = await db("todo").where({ id: todoId }).first();

    // if user has been able to successfully create / 'POST' TODO item on server
    // NOTE: status code = '201' ==> creation of a new resource on server
    res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo,
    });

    // if the TODO item could not be inserted
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({
      error: "Server error while creating todo",
    });
  }
};

// function to get all the TODO items for the logged-in user
const getTodos = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;

    // get all of the TODO items from the database for that user in descending order of creation date
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc");

    // get the data to the user with / using 'JSON'
    res.json({
      message: "Todos retrieved successfully",
      count: todos.length,
      todos,
    });

    // if the TODO item could not be fetched
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({
      error: "Server error while fetching todos",
    });
  }
};

// edit / update a TODO item
const updateTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;
    // get the TODO item's id from the parameters
    const todoId = req.params.id;
    // get the 'description', 'category' and 'completed' from the body of the request
    const { description, category, completed } = req.body;

    // check if the TODO item exists and also belongs to that user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    // if the TODO item has not been found ==> "Invoke" the famous famous '404' status code
    if (!todo) {
      return res.status(404).json({
        error: "Todo not found or does not belong to you",
      });
    }

    // update the required data for a TODO item ( to be updated )
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    // update the TODO item in the database
    await db("todo").where({ id: todoId }).update(updateData);

    // get the `id` of the updated TODO item
    const updatedTodo = await db("todo").where({ id: todoId }).first();

    // simply return a little success message
    res.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({
      error: "Server error while updating todo",
    });
  }
};

// function to be able to delete a TODO item
const deleteTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;
    // get the TODO item's id from the parameters
    const todoId = req.params.id;

    // check if the TODO item exists and also belongs to that user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    // if the TODO item has not been found ==> "Invoke" the famous famous '404' status code
    if (!todo) {
      return res.status(404).json({
        error: "Todo not found or does not belong to you",
      });
    }

    // delete the TODO item from the database
    await db("todo").where({ id: todoId }).delete();

    // simply return a little success message
    res.json({
      message: "Todo deleted successfully",
      deletedTodo: todo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({
      error: "Server error while deleting todo",
    });
  }
};

// function to get available categories
const getCategories = async (req, res) => {
  try {
    // return the list of possible categories that match the ENUM in the database
    // this matches the categories defined in the migration file
    const categories = TODO_CATEGORIES;

    res.json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      error: "Server error while fetching categories",
    });
  }
};

// export the functions that are going to be create to the 'CRUD' operations of TODOs
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getCategories,
};
