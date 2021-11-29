const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ticket extends Model {}


Ticket.init(
      {
        id: 
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
        building: 
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        room_number: 
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        problem_title:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        problem_summary:
            {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [1]
                  }
            },
        ticket_status:
            {   
            //*** NEED TO LOOK AT ***
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
                /// Have it to where it is either 'active' or 'closed'
                /// true = active  false = closed
            },
        user_id: 
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'user',
                  key: 'id'
                }
            }
      },
      {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'ticket'
      }
    );
    

    module.exports = Ticket;