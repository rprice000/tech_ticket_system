const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Ticket, User, Note } = require('../../models');
//Authentication part
// const withAuth = require('../../utils/auth');

// WASNT SURE ABOUT THE SEQULIZE STATEMENTS

// GET /api/tickets/active
router.get('/active', (req, res) => {
    Ticket.findAll({
      where: {
        ticketStatus: true
      },
        attributes: [
            'id',
            'building',
            'room_number',
            'problem_title',
            'problem_summary',
          ],
          include: [
            {
                model: User,
                attributes: ['username']
            },
            {
              model: Note,
              attributes: ['id', 'tech_note'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
          ]
        })
          .then(ticketData => res.json(ticketData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
});

// GET /api/tickets/closed
router.get('/closed', (req, res) => {
    Ticket.findAll({
      where: {
        ticketStatus: false
      },
        attributes: [
            'id',
            'building',
            'room_number',
            'problem_title',
            'problem_summary',
          ],
          include: [
            {
                model: User,
                attributes: ['username']
            },
            {
              model: Note,
              attributes: ['id', 'tech_note'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
          ]
        })
          .then(ticketData => res.json(ticketData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
});




// GET /api/:id
router.get('/:id', (req, res) => {
     Ticket.findOne({
        where: {
            id: req.params.id
          },
          attributes: [
            'id',
            'building',
            'room_number',
            'problem_title',
            'problem_summary',
            'ticket_status'
          ],
          include: [
            {
                model: User,
                attributes: ['username']
            },
            {
              model: Note,
              attributes: ['id', 'tech_note'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
          ]
     })

    .then(ticketData => {
        if (!ticketData) {
          res.status(404).json({ message: 'No ticket found with this id' });
          return;
        }
        res.json(ticketData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});



//router.post('/', withAuth, (req, res) => {
// POST /api/tickets  CREATES A Ticket
router.post('/', (req, res) => {
    Ticket.create({
        created_by: req.body.created_by,
        building: req.body.building,
        room_number: req.body.room_number,
        problem_title: req.body.problem_title,
        problem_summary: req.body.problem_summary,
        ticket_status: true
       })
        .then(ticketData => res.json(ticketData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});


// UPDATES TICKET
// PUT /api/tickets/1
router.put('/:id', (req, res) => {
    Ticket.update({
          created_by: req.body.created_by,
          building: req.body.building,
          room_number: req.body.room_number,
          problem_title: req.body.problem_title,
          problem_summary: req.body.problem_summary,
          ticket_status: req.body.ticketStatus,
        },
        {
          where: {
            id: req.params.id
          }
        }
      )
        .then(ticketData => {
          if (!ticketData[0]) {
            res.status(404).json({ message: 'No ticket found with this id' });
            return;
          }
          res.json(ticketData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });

});


// Do we need the delete
// DELETE /api/tickets/1
router.delete('/:id', (req, res) => {
// Ticket.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(ticketData => {
//       if (!ticketData) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(ticketData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });

});

module.exports = router;