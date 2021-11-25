// IMPORTS USER MODEL FROM THE MODELS FOLDER
const User = require('./User');
const Ticket = require('./Ticket');
const Tech = require('./Tech');
const Note = require('./Note');



// Create a relationship that instructs Users that it has many Tickets
User.hasMany(Ticket, {
     foreignKey: 'user_id'
    });


// Create a relationship that instructs Tickets to belong to Users
Ticket.belongsTo(User, {
     foreignKey: 'user_id',
    });




// Associations for TECH associating to many TICKETS
Tech.belongsTo(User, {
    foreignKey: 'user_id'
   });

Tech.belongsTo(Ticket, {
    foreignKey: 'ticket_id',
   });

User.hasMany(Tech, {
    foreignKey: 'user_id'
   });

Ticket.hasMany(Tech, {
    foreignKey: 'ticket_id'
   });

Ticket.belongsToMany(User, {
    through: Tech,
    as: 'assignedTickets',
    foreignKey: 'ticket_id'
})

User.belongsToMany(Ticket, {
    through: Tech,
    as: 'assignedTickets',
    foreignKey: 'user_id'
})


// Associations for NOTES associating to TECH and TICKET
Ticket.hasMany(Note, {
    foreignKey: 'ticket_id'
});
      
Note.belongsTo(User, {
        foreignKey: 'user_id',
    });
      
Note.belongsTo(Ticket, {
        foreignKey: 'ticket_id',
    });





module.exports = { User, Ticket, Tech, Note };