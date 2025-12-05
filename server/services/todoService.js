const db = require("../db/knex");

// global TODO service file that is going to be used by langchain
const todoService = {
  // asynchronous function to create TODO item
  async createTodo(userId, todoData) {
    const { description, category } = todoData;

    if (!description) {
      console.log("[TODO SERVICE](Create) Description is required!");

      throw new Error("Description is required");
    }

    const [newTodo] = await db("todo")
      .insert({
        user_id: userId,
        description,
        category: category || "Miscellaneous",
        completed: false,
      })
      .returning("*");

    console.log("[TODO SERVICE](Create) TODO successfully created!");

    return newTodo;
  },

  // asynchronous function to get all TODO item(s)
  async getTodos(userId) {
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc");

    console.log("[TODO SERVICE](Create) TODO successfully fetched!");

    return todos;
  },

  // asynchronous function to update a TODO item
  async updateTodo(userId, todoId, updates) {
    const { description, category, completed } = updates;

    // check if TODO item belongs to that specific user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    if (!todo) {
      console.log(
        "[TODO SERVICE](Create) TODO not found or does not belong to you!",
      );

      throw new Error("Todo not found or does not belong to you");
    }

    // create the update object - data
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    const [updatedTodo] = await db("todo")
      .where({ id: todoId })
      .update(updateData)
      .returning("*");

    console.log("[TODO SERVICE](Create) TODO successfully updated");

    return updatedTodo;
  },

  // asynchronous function to delete a TODO item
  async deleteTodo(userId, todoId) {
    // check if TODO item belongs to that specific user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    if (!todo) {
      console.log(
        "[TODO SERVICE](Create) TODO not found or does not belong to you!",
      );

      throw new Error("Todo not found or does not belong to you");
    }

    await db("todo").where({ id: todoId }).delete();

    console.log("[TODO SERVICE](Create) TODO successfully deleted");

    return todo;
  },

  // function to get all categories for a TODO item
  getCategories() {
    const { TODO_CATEGORIES } = require("../config/categories");
    return TODO_CATEGORIES;
  },
};

// export all functions
module.exports = todoService;
