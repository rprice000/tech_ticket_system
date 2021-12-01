const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const ticketRoutes = require('./ticketRoutes');
const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/tickets', ticketRoutes);
router.use('/api', apiRoutes);

module.exports = router;