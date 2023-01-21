const express = require("express");
const router = express.Router();
const users = require("./users");
const orders = require("./orders");
const admin = require("./admins");
const statusCode = require("../helpers/statuscode");
const { responseData } = require("../helpers/response");

router.get("/check", async (req, res) => {
  return await responseData({
    res,
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "API CALLING",
  });
  // res.send("API CALLING");
});

router.use(users);
router.use(orders);
router.use(admin);

module.exports = router;
