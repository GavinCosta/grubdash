/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const dishes = require("../../data/dishes-data")

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex
      .raw("TRUNCATE TABLE dishes RESTART IDENTITY CASCADE")
      .then(function () {
        return knex("dishes").insert(dishes);
      });
};
