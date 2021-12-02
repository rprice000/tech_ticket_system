const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Ticket, User, Note, Tech } = require('../../models');
const Op = require('sequelize').Op;
const assignTicket = require('../../utils/mail');
//Authentication part
const withAuth = require('../../utils/auth');

// WASNT SURE ABOUT THE SEQULIZE STATEMENTS

// GET /api/tickets/active
router.get('/active', (req, res) => {
    Ticket.findAll({
      where: {
        ticket_status: true
      },
        attributes: [
            'id',
            'building',
            'room_number',
            'problem_title',
            'problem_summary',
            'created_at'
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
        ticket_status: false
      },
        attributes: [
            'id',
            'building',
            'room_number',
            'problem_title',
            'problem_summary',
            'created_at'
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
router.post('/', withAuth, (req, res) => {
    Ticket.create({
        user_id: req.body.user_id,
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
router.put('/:id', withAuth, (req, res) => {
    //If req.body includes techs, bulkCreate those techs and destroy other techs from this ticket - must remove the techs property from req.body?
    const addTechs = req.body.assignTechs ? true : false;
    const obKeys = Object.keys(req.body);
    const updateOb = {};
    for(let i = 0; i < obKeys.length; i++) {
        if(obKeys[i] !== 'assignTechs') {
            updateOb[obKeys[i]] = req.body[obKeys[i]];
        }
    }
    console.log(updateOb);
    //console.log(req.params.id);
    Ticket.update(updateOb,
        {
          where: {
            id: req.params.id
          }
        }
      )
        .then(ticketData => {
          //if (!ticketData[0]) {
            //res.status(404).json({ message: 'No ticket found with this id' });
            //return;
          //}
          //Destroy techs associated with ticket and recreate new ones if techs exist in body
          if(addTechs) {
              Tech.destroy({
                  where: {
                      ticket_id: req.params.id
                  }
              })
              .then(() => {
                  const newTechs = req.body.assignTechs.map(techId => {
                      return { user_id: techId, ticket_id: req.params.id };
                  });
                  //BulkCreate new Techs
                  Tech.bulkCreate(newTechs)
                  .then(() => {
                        //Get the email addresses of the included techs
                        User.findAll(
                            {
                                where: {
                                    id: {
                                        [Op.in]: req.body.assignTechs
                                    }
                                },
                                attributes: ['username']
                            }
                        )
                        .then(emailData => {
                            //Prepare the updated information for email to interested parties
                            let formattedEmails = emailData.map(emailOb => {
                                return emailOb.get({ plain: true });
                            });
                            formattedEmails = formattedEmails.map(emailOb => emailOb.username);
                            let senderInfo = {};
                            if(req.session.username) {
                                formattedEmails.push(req.session.username);
                                senderInfo.first_name = req.session.first_name;
                                senderInfo.last_name = req.session.last_name;
                            } else {
                                senderInfo.first_name = "Jack";
                                senderInfo.last_name = "Skellington";
                            }
                            let email_message;
                            //if not everything was updated
                            if(!req.body.problem_summary || !req.body.building || !req.body.room_number || !req.body.problem_title) {
                              Ticket.findOne(
                                {
                                  where: {
                                    id: req.params.id
                                  }
                                }
                              )
                              .then(existingInfo => {
                                const formattedExisting = existingInfo.get({ plain: true });
                                email_message = `${formattedExisting.problem_summary} (${formattedExisting.building} - Room ${formattedExisting.room_number})`;
                                Note.findAll({
                                  where: {
                                      ticket_id: req.params.id
                                  },
                                  include: [
                                      {
                                          model: User,
                                          attributes: ['first_name', 'last_name']
                                      }
                                  ]
                                })
                                .then(retrievedNotes => {
                                    let formattedNotes = retrievedNotes.map(note => note.get({ plain: true }));
                                    if(formattedNotes.length > 0) {
                                        formattedNotes = formattedNotes.map(note => {
                                            return `${note.tech_note} - added by ${note.user.first_name} ${note.user.last_name}`;
                                        });
                                    }
                                    //Send only the latest 3 notes
                                    const sentNotes = formattedNotes.length > 3 ? [formattedNotes[formattedNotes.length - 3],formattedNotes[formattedNotes.length - 2], formattedNotes[formattedNotes.length - 1]] : formattedNotes;
                                    assignTicket(senderInfo,formattedEmails,formattedExisting.problem_title,email_message,sentNotes).catch(err => console.log(err));
                                    res.json(existingInfo);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json(err);
                                });
                              })
                              .catch(err => {
                                console.log(err);
                                res.status(500).json(err);
                              });
                            } else {
                              email_message = `${req.body.problem_summary} (${req.body.building} - Room ${req.body.room_number})`;
                              Note.findAll({
                                where: {
                                    ticket_id: req.params.id
                                },
                                include: [
                                    {
                                        model: User,
                                        attributes: ['first_name', 'last_name']
                                    }
                                ]
                              })
                              .then(retrievedNotes => {
                                  let formattedNotes = retrievedNotes.map(note => note.get({ plain: true }));
                                  if(formattedNotes.length > 0) {
                                      formattedNotes = formattedNotes.map(note => {
                                          return `${note.tech_note} - added by ${note.user.first_name} ${note.user.last_name}`;
                                      });
                                  }
                                  //Send only the latest 3 notes
                                  const sentNotes = formattedNotes.length > 3 ? [formattedNotes[formattedNotes.length - 3],formattedNotes[formattedNotes.length - 2], formattedNotes[formattedNotes.length - 1]] : formattedNotes;
                                  assignTicket(senderInfo,formattedEmails,req.body.ticket_title,email_message,sentNotes).catch(err => console.log(err));
                              })
                              .catch(err => {
                                  console.log(err);
                                  res.status(500).json(err);
                              });
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
                  });
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).json(err);
              });
          } else {
            //Get the email addresses of the included techs
            Tech.findAll(
              {
                  where: {
                      ticket_id: req.params.id
                  },
                  include: [
                    {
                      model: User,
                      attributes: ['username']
                    }
                  ]
              }
            )
            .then(emailData => {
                //Prepare the updated information for email to interested parties
                let formattedEmails = emailData.map(emailOb => {
                    return emailOb.get({ plain: true });
                });
                formattedEmails = formattedEmails.map(techOb => techOb.user.username);
                let senderInfo = {};
                if(req.session.username) {
                    formattedEmails.push(req.session.username);
                    senderInfo.first_name = req.session.first_name;
                    senderInfo.last_name = req.session.last_name;
                } else {
                    senderInfo.first_name = "Jack";
                    senderInfo.last_name = "Skellington";
                }
                let email_message;
                Ticket.findOne(
                  {
                    where: {
                      id: req.params.id
                    }
                  }
                )
                .then(existingInfo => {
                  const formattedExisting = existingInfo.get({ plain: true });
                  email_message = `${formattedExisting.problem_summary} (${formattedExisting.building} - Room ${formattedExisting.room_number})`;
                  const ticketTitle = formattedExisting.problem_title || "Unknown Ticket Title";
                  Note.findAll({
                    where: {
                        ticket_id: req.params.id
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['first_name', 'last_name']
                        }
                    ]
                  })
                  .then(retrievedNotes => {
                      let formattedNotes = retrievedNotes.map(note => note.get({ plain: true }));
                      if(formattedNotes.length > 0) {
                          formattedNotes = formattedNotes.map(note => {
                              return `${note.tech_note} - added by ${note.user.first_name} ${note.user.last_name}`;
                          });
                      }
                      //Send only the latest 3 notes
                      const sentNotes = formattedNotes.length > 3 ? [formattedNotes[formattedNotes.length - 3],formattedNotes[formattedNotes.length - 2], formattedNotes[formattedNotes.length - 1]] : formattedNotes;
                      assignTicket(senderInfo,formattedEmails,ticketTitle,email_message,sentNotes).catch(err => console.log(err));
                      res.json(existingInfo);
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(500).json(err);
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json(err);
                });                  
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
          }
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