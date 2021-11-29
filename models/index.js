//Import models
const User = require("./User");
const Ticket = require("./Ticket");
const Tech = require("./Tech");

User.hasMany(Ticket, {
    foreignKey: "user_id"
});

Ticket.belongsTo(User, {
    foreignKey: "user_id"
});

Tech.belongsTo(User, {
    foreignKey: "user_id"
});

Tech.belongsTo(Ticket, {
    foreignKey: "ticket_id"
});

User.hasMany(Tech, {
    foreignKey: "user_id"
});

Ticket.hasMany(Tech, {
    foreignKey: "ticket_id"
});

module.exports = { User, Ticket, Tech };