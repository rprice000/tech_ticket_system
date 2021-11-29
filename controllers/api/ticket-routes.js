//Import modules
const router = require("express").Router();
const { User, Ticket, Tech } = require("../../models");
const assignTicket = require("../../utlis/mail");
const Op = require("sequelize").Op;

//Get all tickets
router.get("/", (req, res) => {
    Ticket.findAll()
    .then(ticketData => res.json(ticketData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get one ticket
router.get("/:id", (req, res) => {
    Ticket.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                attributes: ["first_name","last_name"]
            },
            {
                model: Tech,
                include: [
                    {
                        model: User,
                        attributes: ["first_name","last_name"]
                    }
                ]
            }
        ]
    })
    .then(ticketData => {
        res.json(ticketData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Post a ticket
router.post("/", (req, res) => {
    Ticket.create({
        building: req.body.building,
        room_number: req.body.room_number,
        problem_title: req.body.problem_title,
        problem_summary: req.body.problem_summary,
        ticket_status: true,
        user_id: req.body.user_id
    })
    .then(ticketData => {
        res.json(ticketData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Update ticket - including assigning people to it
router.put("/:id", (req, res) => {
    //This assignerId will likely have to be a hidden input added to the form field
    const assignerId = req.body.assignerId;
    //This assignedArr will likely have to be constructed within the callback function of the attached javascript file
    const assignedArr = req.body.assignedArr ? req.body.assignedArr : [];
    Ticket.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(updatedTicket => {
        console.log(updatedTicket);
        if(assignedArr.length > 0) {
            //Update Tech table
            //Destroy existing Techs with this ticket_id first
            Tech.destroy({
                where: {
                    ticket_id: req.params.id
                }
            })
            .then(resultArr => {
                //res.json(resultArr);
                //Create new Techs
                const newTechArr = assignedArr.map(userId => {
                    return { user_id: userId, ticket_id: req.params.id };
                });

                Tech.bulkCreate(newTechArr)
                .then(() => {
                    res.json(newTechArr);
                    //Handle emailing
                    if(!assignerId) {
                        return;
                    }
                    User.findOne(
                        {
                            where: {
                                id: assignerId
                            },
                            attributes: ["first_name","last_name"]
                        }
                    )
                    .then(userInfo => {
                        console.log(userInfo);
                        const senderInfo = userInfo.get({plain: true});
                        //Get the email addresses of the assigned users
                        User.findAll({
                            where: {
                                id: {
                                    [Op.in]: assignedArr
                                }
                            },
                            attributes: ["username"]
                        })
                        .then(emailAddresses => {
                            console.log(emailAddresses);
                            const convertedEmails = emailAddresses.map(userOb => {
                                const uOb = userOb.get({ plain: true });
                                return uOb.username;
                            });
                            console.log(convertedEmails);
                            //Grab the updated ticket information
                            Ticket.findOne({
                                where: {
                                    id: req.params.id
                                }
                            })
                            .then(ticketData => {
                                const plainTicket = ticketData.get({ plain: true });
                                console.log(plainTicket);
                                const notify_message = `${plainTicket.problem_summary} (${plainTicket.building} - Room ${plainTicket.room_number})`;
                                assignTicket(senderInfo,convertedEmails,plainTicket.problem_title,notify_message).catch(err => console.log(err));
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

module.exports = router;