const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');



class Tech extends Model {}

  Tech.init(
    {

      id: 
          {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
      user_id: 
          {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                 model: 'user',
                  key: 'id'
                }
          },
      ticket_id:
          {
             type: DataTypes.INTEGER,
             allowNull: false,
             references: {
                model: 'ticket',
                 key: 'id'
               }
          }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'tech'
    }
  );








module.exports = Tech;