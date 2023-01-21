const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const verifyToken = require("../middleware/auth");

router.get("/getCustomerList", verifyToken, Controller.AdminController.getUserList);
router.post("/getCustomerDetail", verifyToken, Controller.AdminController.getCustomerDetail);

module.exports = router;
