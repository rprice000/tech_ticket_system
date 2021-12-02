//Import modules
const router = require('express').Router();
const { User, Ticket, Note, Tech } = require('../models');
const withAuth = require('../utils/auth');

//
router.get('/', withAuth, (req, res) => {
    Ticket.findAll({
        include: [
            {
                model: User,
                attributes: ['first_name','last_name']
            }
        ]
    })
    .then(dbTicketData => {
        const formattedTickets = dbTicketData.map(dbTicket => dbTicket.get({ plain: true }));
        console.log(formattedTickets);
        //Filter tickets into active and closed statuses
        const activeTickets = formattedTickets.filter(ticket => ticket.ticket_status);
        const closedTickets = formattedTickets.filter(ticket => !ticket.ticket_status);
        const loggedIn = req.session.user_id ? true : false;
        const ticketData = { activeTickets, closedTickets, loggedIn };
        res.render('tickets', ticketData);
    })
    .catch(err => {
        console.log(err);
        res.status(err).json(err);
    });
});

//Look at one ticket by id
router.get('/:id', withAuth, (req, res) => {
    Ticket.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Tech,
                include: [
                    {
                        model: User,
                        attributes: ['id','first_name','last_name']
                    }
                ]
            },
            {
                model: Note,
                attributes: ['tech_note', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['first_name','last_name']
                    }
                ]
            }
        ]
    })
    .then(dbTicketData => {
        if(!dbTicketData) {
            res.status(404).json({ message: 'There was no ticket found with this id.'});
            return;
        }
        
        const convertedTicket = dbTicketData.get({ plain: true });
        const techIds = convertedTicket.teches.map(tech => tech.user_id);
        console.log(convertedTicket);
        console.log(techIds);
        //console.log(techIds);
        //Determine if the user canEdit and/or canNote and if ticket isOpen
        const isOpen = convertedTicket.ticket_status;
        const canEdit = req.session.user_id === convertedTicket.user_id;
        let canNote = canEdit;
        console.log(req.session.user_id);
        if(!canNote) {
            for(let i = 0; i < techIds.length; i++) {
                if(req.session.user_id === techIds[i]) {
                    canNote = true;
                    break;
                }
            }
        }
        const ticketInfo = { isOpen, canEdit, canNote, loggedIn: true, ticketData: convertedTicket, viewer_id: req.session.user_id };
        //Need to get all users for purposes of tech-Buttons
        User.findAll({
            attributes: ['id','first_name','last_name']
        })
        .then(returnedUserData => {
            let formattedUserData = returnedUserData.map(userInfo => userInfo.get({ plain: true }));
            //The ticket creator cannot be added as a tech
            formattedUserData = formattedUserData.filter(userInfo => {
                return !(userInfo.id === ticketInfo.ticketData.user_id);
            });
            //Determine which users are already techs
            formattedUserData = formattedUserData.map(userInfo => {
                let isTech = false;
                for(let i = 0; i < techIds.length; i++) {
                    if(userInfo.id === techIds[i]) {
                        isTech = true;
                        break;
                    }
                }

                userInfo.buttonClass = isTech ? "isTech" : "notTech";
                userInfo.isTech = isTech;
                return userInfo;
            });
            ticketInfo.availableTechs = formattedUserData;
            res.render('ticket-view', ticketInfo);
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
});

module.exports = router;