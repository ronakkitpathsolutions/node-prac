const statusCode = require("../../helpers/statuscode");
const { responseData, responseMessage } = require("../../helpers/response");
const Service = require("../../services");

exports.getUserList = async (req, res) => {
  try {
    const result = await Service.AdminService.getUserList(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: "Error in Fetching User List",
      });

    return responseData({ res, ...result });
  } catch (error) {
    return responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};
exports.getCustomerDetail = async (req, res) => {
  try {
    const result = await Service.AdminService.getCustomerDetail(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: "Error in getting Customer Detail",
      });

    return responseData({ res, ...result });
  } catch (error) {
    return responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};
