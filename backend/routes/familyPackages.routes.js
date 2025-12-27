const router = require("express").Router();
const c = require("../controllers/familyPackages.controller");

router.get("/", c.getAll);
module.exports = router;
