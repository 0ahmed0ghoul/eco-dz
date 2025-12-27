const router = require("express").Router();
const c = require("../controllers/transport.controller");

router.get("/", c.getAll);
module.exports = router;
