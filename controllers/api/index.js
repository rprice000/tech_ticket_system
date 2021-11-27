const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const ticketRoutes = require('./ticket-routes.js');
const noteRoutes = require('./note-routes.js');

router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/notes', noteRoutes);

module.exports = router;