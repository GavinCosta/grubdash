const knex = require("../db/connection");

//post suppliers endpoint
//creates supplier column in suppliers table
function create(supplier) {
  return knex("suppliers")
    .insert(supplier)
    .returning("*")
    //return only the one inserted record
    .then((createdRecords) => createdRecords[0]);
}

function read(supplier_id) {
  return knex("suppliers").select("*").where({ supplier_id }).first();
}

function update(updatedSupplier) {
  return knex("suppliers")
    .select("*")
    .where({ supplier_id: updatedSupplier.supplier_id })
    .update(updatedSupplier, "*");
}

function destroy(supplier_id) {
  return knex("suppliers").where({ supplier_id }).del();
}

module.exports = {
  create,
  read,
  update,
  delete: [destroy],
};