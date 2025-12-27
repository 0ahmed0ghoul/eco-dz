const router = require("express").Router();
const controller = require("../controllers/monuments.controller");

router.get("/", controller.getAllMonuments);

module.exports = router;
