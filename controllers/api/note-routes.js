const router = require('express').Router();
const { Note, User, Ticket, Tech } = require('../../models');
const assignTicket = require('../../utils/mail');

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
          res.json(formattedTicket);
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