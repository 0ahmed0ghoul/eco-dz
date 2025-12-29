const router = require("express").Router();
const c = require("../controllers/ecoTours.controller");

router.get("/", c.getAll);
module.exports = router;
