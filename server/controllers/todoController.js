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
      console.log("[TODO API](Create) Description is required!");

      return res.status(400).json({
        error: "[TODO API](Create) Description is required",
      });
    }

    // INFO: no need to validate the 'category' / 'completed' as it's going to be defaulted to 'Miscellaneous'!

    // insert the new TODO item into the database
    const [newTodo] = await db("todo")
      .insert({
        user_id: userId,
        description,
        category: category || "Miscellaneous",
        completed: false,
      })
      .returning("*");

    console.log("[TODO API](Create) TODO created successfully.");

    // NOTE: status code = '201' ==> creation of a new resource on server
    res.status(201).json({
      message: "[TODO API](Create) TODO created successfully.",
      todo: newTodo,
    });

    // if the TODO item could not be inserted
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("[TODO API](Create) Create TODO server error:", error);

    res.status(500).json({
      error: "[TODO API](Create) Server error while creating TODO",
    });
  }
};

// function to get all the TODO items for the logged-in user ==> based on what's shown
const getTodos = async (req, res) => {
  try {
    // get the `userId` from the token
    const userId = req.user.userId;

    // for pagination --> how much to fetch on scroll wheel
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // get the TODO item based on the "pagination" - front-end scroll
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc")
      .limit(limit)
      .offset(offset);

    // get the total count of TODOs for the heading count
    const totalCount = await db("todo")
      .where({ user_id: userId })
      .count("* as count")
      .first();

    console.log("[TODO API](Get) TODO retrieved successfully");

    res.json({
      message: "Todos retrieved successfully",
      todos,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount.count),
        hasMore: offset + todos.length < parseInt(totalCount.count),
      },
    });
  } catch (error) {
    console.error("[TODO API](Get) Get TODOs server error:", error);

    res
      .status(500)
      .json({ error: "[TODO API](Get) Server error while fetching todos" });
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
      console.log(
        "[TODO API](Update) TODO not found / does not belong to you!",
      );

      return res.status(404).json({
        error: "[TODO API](Update) TODO not found / does not belong to you",
      });
    }

    // update the required data for a TODO item ( to be updated )
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    // update the TODO item in the database
    await db("todo").where({ id: todoId }).update(updateData);

    // get the update and return query in one object
    const [updatedTodo] = await db("todo")
      .where({ id: todoId })
      .update(updateData)
      .returning("*");

    console.log("[TODO API](Update) TODO updated successfully");

    res.json({
      message: "[TODO API](Update) TODO updated successfully",
      todo: updatedTodo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("[TODO API](Update) Update TODO server error:", error);

    res.status(500).json({
      error: "[TODO API](Update) Server error while updating todo",
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
      console.log(
        "[TODO API](Delete) TODO not found / does not belong to you!",
      );

      return res.status(404).json({
        error: "[TODO API](Delete) TODO not found / does not belong to you",
      });
    }

    // delete the TODO item from the database
    await db("todo").where({ id: todoId }).delete();

    console.log("[TODO API](Delete) TODO deleted successfully");

    res.json({
      message: "[TODO API](Delete) TODO deleted successfully",
      deletedTodo: todo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("[TODO API](Delete) Delete TODO server error:", error);

    res.status(500).json({
      error: "[TODO API](Delete) Server error while deleting TODO",
    });
  }
};

// function to get available categories
const getCategories = async (req, res) => {
  try {
    // return the list of possible categories that match the ENUM in the database
    // this matches the categories defined in the migration file
    const categories = TODO_CATEGORIES;

    console.log("[TODO API](Get Categories) Categories retrieved successfully");

    res.json({
      message: "[TODO API](Get Categories) Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.error(
      "[TODO API](Get Categories) Get categories server error:",
      error,
    );

    res.status(500).json({
      error:
        "[TODO API](Get Categories) Server error while fetching categories",
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
