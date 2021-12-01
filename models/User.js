const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    checkPassword(inputPW) {
        return bcrypt.compareSync(inputPW,this.password);
    }
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
            len: [1]
            }
        },
    last_name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1]
            }
        }
  },
// ***Hooks for authentication***
  {
    hooks: {
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;