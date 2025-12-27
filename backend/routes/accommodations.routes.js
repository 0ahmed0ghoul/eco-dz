const router = require("express").Router();
const c = require("../controllers/accommodations.controller");

router.get("/", c.getAll);
module.exports = router;
