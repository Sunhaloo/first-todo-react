/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// creation of 'todos' table
exports.up = function (knex) {
  // use the `createTable` function to define - create table in database
  return knex.schema.createTable("todo", (table) => {
    // our fields
    table.increments("id").primary();
    table.text("description").notNullable();
    table
      .enu("category", [
        "Code Review",
        "Coding",
        "Debugging",
        "Deployment",
        "Documentation",
        "Learning",
        "Meeting",
        "Miscellaneous",
        "Planning",
        "Refactorig",
        "Testing",
      ])
      .defaultTo("Miscellaneous");
    table.boolean("completed").defaultTo(false);

    // add time stamps of when created / updated
    table.timestamps(true, true);

    // create the field for the foreign key here
    table.integer("user_id").unsigned().notNullable();
    // make the actual link using 'references'
    table.foreign("user_id").references("user.id").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// deletion of user table
exports.down = function (knex) {
  // use the `dropTable` to delete the table
  return knex.schema.dropTable("todo");
};
