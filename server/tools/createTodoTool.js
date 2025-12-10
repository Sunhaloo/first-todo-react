const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const todoService = require("../services/todoService");

// import the 'categories' list
const { TODO_CATEGORIES } = require("../config/categories");

// define the schema ( using 'zod' ) ==> for AI to understand that parameters it can use
const createTodoSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(75, "Description too long")
    .describe("The todo item description - what needs to be done"),

  category: z
    .enum(TODO_CATEGORIES)
    .describe("The category/type of the todo item"),
});

// create the langchain tool
const createTodoTool = tool(
  async ({ description, category }, config) => {
    try {
      // get the 'userID' from the configuration from 'chatController'
      const userId = config.configurable.userId;

      // use the asynchronous function provided by todo service
      const newTodo = await todoService.createTodo(userId, {
        description,
        category,
      });

      console.log("[TOOL](Create) TODO successfully created");

      // return a friendly message to the AI
      return `Successfully created todo: "${newTodo.description}" in category [${newTodo.category}] with ID ${newTodo.id}`;
    } catch (error) {
      console.log("[TOOL](Create) TODO creation error!");

      return `Error creating todo: ${error.message}`;
    }
  },
  {
    name: "createTodo",
    description:
      "Creates a new todo item for the user. Use this whenever the user wants to add a task or add something to their todo list.",
    schema: createTodoSchema,
  },
);

module.exports = createTodoTool;
