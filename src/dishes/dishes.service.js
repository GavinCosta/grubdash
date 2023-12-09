const knex = require('../db/connection');

function list() {
    return knex("dishes").select("*");
}

module.exports = {
    list,
}