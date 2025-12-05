const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const todoService = require("../services/todoService");

// simply get all the TODO items ==> no need to pass any parameters
const getTodosSchema = z.object({});

const getTodosTool = tool(
  async (_, config) => {
    try {
      const userId = config.configurable.userId;

      // use the asynchronous function provided by todo service
      const todos = await todoService.getTodos(userId);

      console.log("[TOOL](Get) TODO successfully fetched");

      if (todos.length === 0) {
        return "You have no todos yet. Your todo list is empty!";
      }

      // format todo items for the AI
      const completedCount = todos.filter((t) => t.completed).length;
      const pendingCount = todos.length - completedCount;

      const todoList = todos
        .map((todo, index) => {
          const status = todo.completed ? " " : "";
          const date = new Date(todo.created_at).toLocaleDateString();
          return `${index + 1}. ${status} [${todo.category}] ${todo.description} (ID: ${todo.id}, Created: ${date})`;
        })
        .join("\n");

      console.log("[TOOL](Get) TODO successfully created");

      return `You have ${todos.length} todos (${pendingCount} pending, ${completedCount} completed):\n\n${todoList}`;
    } catch (error) {
      console.log("[TOOL](Get) TODO fetching error!");

      return `Error fetching todos: ${error.message}`;
    }
  },
  {
    name: "getTodos",
    description:
      "Retrieves all todo items for the user. Use this when the user asks to see their todos, list their tasks, check what they need to do, or asks 'what's on my list'.",
    schema: getTodosSchema,
  },
);

module.exports = getTodosTool;
