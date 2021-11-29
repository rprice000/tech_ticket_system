//Import modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Ticket extends Model {}

Ticket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        building: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        room_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        problem_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_summary: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        ticket_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "ticket"
    }
);

module.exports = Ticket;