/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("dishes_categories", (table) => {
    table.integer("dish_id").unsigned().notNullable();
    table
        .foreign("dish_id")
        .references("dish_id")
        .inTable("dishes")
        .onDelete("CASCADE");
    table.integer("category_id").unsigned().notNullable();
    table    
        .foreign("category_id")
        .references("category_id")
        .inTable("categories")
        .onDelete("CASCADE");

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("dishes_categories")
};
