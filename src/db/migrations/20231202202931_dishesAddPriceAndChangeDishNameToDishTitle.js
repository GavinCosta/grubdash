/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//as this files name suggests, it was made to update dishes table

exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.renameColumn("dish_name", "dish_title");
    table.decimal("dish_price");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("dishes")
};
