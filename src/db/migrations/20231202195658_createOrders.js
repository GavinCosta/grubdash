/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) { //update function
  return knex.schema.createTable("orders", (table) => {
    table.increments("order_id").primary(); //sets order id as primary key
    table.string("order_name"); //sets name of person ordering
    table.string("order_address");
    table.string("order_city");
    table.string("order_state");
    table.string("order_zip");
    table.string("order_phone");
    table.string("order_email");
    table.text("order_notes");
    table.string("order_status");
    table.integer("dish_id").unsigned().notNullable(); //prevents negative values and ensures not null
    table.timestamps(true, true); //Adds created at and updated at, first true sets columns to be a timestamp type, second true sets those columns to be non-null
    table
        .foreign("dish_id")
        .references("dish_id")
        .inTable("dishes")
        .onDelete("cascade"); //if dishes is deleted then related data will be deleted from this db as well
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) { //rollback function
  return knex.schema.dropTable("orders");
};
