const router = require("express").Router();
const c = require("../controllers/lastMinute.controller");

router.get("/", c.getAll);
module.exports = router;
