/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const orders = require("../../data/orders-data")

exports.seed = async function(knex) {
  // Deletes ALL existing entries
 return knex
      .raw("TRUNCATE TABLE orders RESTART IDENTITY CASCADE")
        .then(function() {
          return knex("orders").insert(orders);
        });
};
