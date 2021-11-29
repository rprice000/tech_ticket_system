//Import Modules
const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const dashRoutes = require("./dashboard");

router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/dashboard", dashRoutes);

module.exports = router;