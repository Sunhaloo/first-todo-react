const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const todoService = require("../services/todoService");

// define the schema ( using 'zod' ) ==> for AI to understand that parameters it can use
const updateTodoSchema = z.object({
  id: z.number().describe("The ID of the todo to update"),

  description: z
    .string()
    .min(1)
    .max(75)
    .optional()
    .describe("New description for the todo (optional)"),

  category: z
    .enum([
      "Code Review",
      "Coding",
      "Debugging",
      "Deployment",
      "Documentation",
      "Learning",
      "Meeting",
      "Miscellaneous",
      "Planning",
      "Refactoring",
      "Testing",
    ])
    .optional()
    .describe("New category for the todo (optional)"),

  completed: z
    .boolean()
    .optional()
    .describe("Mark todo as completed (true) or incomplete (false)"),
});

const updateTodoTool = tool(
  async ({ id, description, category, completed }, config) => {
    try {
      const userId = config.configurable.userId;

      // convert id to string if your database uses string IDs
      const todoId = String(id);

      // create the update object ==> include only details provided
      const updates = {};
      if (description !== undefined) updates.description = description;
      if (category !== undefined) updates.category = category;
      if (completed !== undefined) updates.completed = completed;

      // use the asynchronous function provided by todo service
      const updatedTodo = await todoService.updateTodo(userId, todoId, updates);

      // Build a nice response message
      const changes = [];
      if (description !== undefined)
        changes.push(`description to "${description}"`);
      if (category !== undefined) changes.push(`category to [${category}]`);
      if (completed !== undefined)
        changes.push(
          `status to ${completed ? "Completed  " : "Incomplete "}`,
        );

      console.log("[TOOL](Update) TODO successfully updated");

      return `Successfully updated todo #${id}: Changed ${changes.join(", ")}`;
    } catch (error) {
      console.log("[TOOL](Update) TODO update error");

      return `Error updating todo: ${error.message}`;
    }
  },
  {
    name: "updateTodo",
    description:
      "Updates an existing todo item. Use this when the user wants to edit a todo, mark it as complete/incomplete, change its description, or change its category. You can update one or more fields at once.",
    schema: updateTodoSchema,
  },
);

module.exports = updateTodoTool;
