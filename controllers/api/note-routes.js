const router = require('express').Router();
const { Note, User, Ticket} = require('../../models');

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
            'user_id',
            'ticket_id'
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
            'user_id',
            'ticket_id'
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
          res.status(404).json({ message: 'No Note With That Id.'});
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
    Note.create({
        techNote: req.body.techNote
    })
      .then(noteData => res.json(noteData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
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