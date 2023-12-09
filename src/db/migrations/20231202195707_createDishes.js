/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTable("dishes", (table) => {
        table.increments("dish_id").primary();
        table.string("dish_name");
        table.text("dish_description");
        table.string("image_url");
        table.timestamps(true,true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("dishes");
};
