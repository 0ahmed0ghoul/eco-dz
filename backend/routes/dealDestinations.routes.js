const router = require("express").Router();
const c = require("../controllers/dealDestinations.controller");

router.get("/", c.getAll);
module.exports = router;
