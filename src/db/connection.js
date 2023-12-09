const env = pprocess.env.NODE_ENV || "development";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);


module.exports = knex