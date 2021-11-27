const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


// create our User model
class User extends Model {
  // ***MAY NEED CODE IN HERE***
  // SOMETHING WITH AUTHENTICATION
}


User.init(
  {
    id: 
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
    username: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: 
                {
                    isEmail: true
                }
        },
    password: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [4]
            }
        },
    first_name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [4]
            }
        },
    last_name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [4]
            }
        }
  },
// ***Hooks for authentication***
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;