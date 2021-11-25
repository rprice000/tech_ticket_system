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
        roomNumber: 
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        problemTitle:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        problemSummary:
            {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [1]
                  }
            },
        ticketStatus:
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
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'ticket'
      }
    );
    

    module.exports = Ticket;