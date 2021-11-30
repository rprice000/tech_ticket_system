const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// const bcrypt = require('bcrypt');


// create our User model
class User extends Model {
    // ***MAY NEED CODE IN HERE***
    // SOMETHING WITH AUTHENTICATION
    // checkPassword(loginPw) {
    //     return bcrypt.compareSync(loginPw, this.password);
    // }
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
        first_name:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3]
            }
        },
        last_name:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3]
            }
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
        }
    },
    // ***Hooks for authentication***
    // {
    //     hooks: {
    //         // set up beforeCreate lifecycle "hook" functionality
    //         async beforeCreate(newUserData) {
    //             newUserData.password = await bcrypt.hash(newUserData.password, 10);
    //             return newUserData;
    //         },
    //     }
    // },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;