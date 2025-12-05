// import - get the required tools created
const createTodoTool = require("./createTodoTool");
const getTodosTool = require("./getTodosTool");
const updateTodoTool = require("./updateTodoTool");
const deleteTodoTool = require("./deleteTodoTool");

// export the tools to be used by others
module.exports = {
  createTodoTool,
  getTodosTool,
  updateTodoTool,
  deleteTodoTool,
};
