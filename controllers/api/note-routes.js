const router = require('express').Router();
const { Note, User, Ticket, Tech } = require('../../models');
const assignTicket = require('../../utils/mail');
const Op = require('sequelize').Op;

router.get('/', (req, res) => {
  Note.findAll({
    include: [
      {
        model: Ticket,
        attributes: [
          'id',
          'building',
          'room_number',
          'problem_title',
          'problem_summary',
          'ticket_status',
          'user_id'
        ],
      },
      {
        model: User,
        attributes: ['username']
      },
    ]
  })
    .then(noteData => res.json(noteData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Note.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Ticket,
        attributes: [
          'id',
          'building',
          'room_number',
          'problem_title',
          'problem_summary',
          'ticket_status',
          'user_id'
        ],
      },
      {
        model: User,
        attributes: ['username']
      },
    ]
  })
    .then(noteData => {
      if (!noteData) {
        res.status(404).json({ message: 'No Note With That Id.' });
        return;
      }
      res.json(noteData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// Create Note
router.post('/', (req, res) => {
  //The added user_id and ticket_id properties can be included as <input type='hidden' name='user_id' value='{{user_id}}' /> in the form of the handlebars page
  Note.create({
    user_id: req.body.user_id,
    ticket_id: req.body.ticket_id,
    tech_note: req.body.tech_note
  })
    .then(noteData => {

      res.json(noteData)
      //Retrieve ticket linked to this note
      Ticket.findOne({
        where: {
          id: req.body.ticket_id
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password']
            }
          },
          {
            model: Note,
            include: [
              {
                model: User,
                attributes: {
                  exclude: ['password']
                }
              }
            ]
          },
          {
            model: Tech,
            include: [
              {
                model: User,
                attributes: ['username']
              }
            ]
          }
        ]
      })
        .then(ticketData => {
          const formattedTicket = ticketData.get({ plain: true });
          console.log(formattedTicket);
          //res.json(formattedTicket);
          //Querying database to see whether threshhold has been reached to send update email
          const senderInfo = { first_name: formattedTicket.user.first_name, last_name: formattedTicket.user.last_name };
          const techEmails = formattedTicket.teches.map(tech => tech.user.username );
          //console.log(techEmails);
          techEmails.push(formattedTicket.user.username);
          const emailMessage = `${formattedTicket.problem_summary} (${formattedTicket.building} - Room ${formattedTicket.room_number})`;
          //See how many notes are attached to this ticket
          Note.findAll({
            where: {
              ticket_id: formattedTicket.id
            },
            include: [
              {
                model: User,
                attributes: ['first_name','last_name']
              }
            ]
          })
          .then(retrievedNotes => {
            let formattedNotes = retrievedNotes.map(note => note.get({ plain: true }));
            if(formattedNotes.length%3 === 0) {
              //Only send out an update email after every third note added
              formattedNotes = formattedNotes.map(note => {
                return `${note.tech_note} - added by ${note.user.first_name} ${note.user.last_name}`
              });
              //assignTicket(senderInfo,techEmails,formattedTicket.ticket_title,emailMessage,formattedNotes).catch(err => console.log(err));
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        })
    });
  });


  // Update Note
  router.put('/:id', (req, res) => {
    Note.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(noteData => res.json(noteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


  module.exports = router;