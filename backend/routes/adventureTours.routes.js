const router = require("express").Router();
const c = require("../controllers/adventureTours.controller");

router.get("/", c.getAll);
module.exports = router;
