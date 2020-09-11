const { DataTypes } = require("sequelize/types")

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("user", {
        email: {
            type: DataTypes.CITEXT,
            allowNull: false,
            unique: true,

        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};
