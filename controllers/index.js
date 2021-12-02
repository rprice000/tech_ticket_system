const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const ticketRoutes = require('./ticketRoutes');
const apiRoutes = require('./api');
const noteRoutes = require('./api/note-routes');

router.use('/', homeRoutes);
router.use('/tickets', ticketRoutes);
router.use('/api', apiRoutes);
router.use('/api/notes', noteRoutes)

module.exports = router;