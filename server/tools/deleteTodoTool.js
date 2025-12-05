const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const todoService = require("../services/todoService");

// define the schema ( using 'zod' ) ==> for AI to understand that parameters it can use
const deleteTodoSchema = z.object({
  id: z.number().describe("The ID of the todo to delete"),
});

const deleteTodoTool = tool(
  async ({ id }, config) => {
    try {
      const userId = config.configurable.userId;

      // use the asynchronous function provided by todo service
      const deletedTodo = await todoService.deleteTodo(userId, id);

      console.log("[TOOL](Delete) TODO successfully deleted");

      return `Successfully deleted todo #${id}: "${deletedTodo.description}" from category [${deletedTodo.category}]`;
    } catch (error) {
      console.log("[TOOL](Delete) TODO deletion error!");

      return `Error deleting todo: ${error.message}`;
    }
  },
  {
    name: "deleteTodo",
    description:
      "Deletes a todo item permanently. Use this when the user wants to remove a todo, delete a task, or get rid of something from their list.",
    schema: deleteTodoSchema,
  },
);

module.exports = deleteTodoTool;
