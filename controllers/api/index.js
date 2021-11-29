//Import Modules
const router = require("express").Router();
const userRoutes = require("./user-routes");
const ticketRoutes = require("./ticket-routes");

router.use("/users", userRoutes);
router.use("/tickets", ticketRoutes);

module.exports = router;