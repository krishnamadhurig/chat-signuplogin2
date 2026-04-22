const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

// models
db.User = require("./user.model");
db.Message = require("./message")(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;