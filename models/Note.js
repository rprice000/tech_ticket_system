const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');



class Note extends Model {}



  Note.init(
    {
      id: 
          {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
      techNote:
          {
              type: DataTypes.TEXT,
              allowNull: false,
              validate: {
                len: [1]
              }
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
      modelName: 'note'
    }
  );









module.exports = Note;