/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// creation of 'user' table
exports.up = function (knex) {
  // use the `createTable` function to define - create table in database
  return knex.schema.createTable("user", (table) => {
    // our fields
    table.increments("id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password").notNullable();
    // add time stamps of when created / updated
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// deletion of user table
exports.down = function (knex) {
  // use the `dropTable` to delete the table
  return knex.schema.dropTable("user");
};
