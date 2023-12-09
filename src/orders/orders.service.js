const knex = require("../db/connection");


function list() {
    return knex("orders").select("*");
}
//creates a knex query selecting all columns where order_id matches
//first method return first row in table as an object
function read(orderId) {
    return knex('orders').select("*").where({order_id: orderId}).first()
}

module.exports = {
    list,
    read,
}