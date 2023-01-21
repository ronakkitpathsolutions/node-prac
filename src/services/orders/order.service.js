const Order = require("../../models/order");
const Notification = require("../../models/notification");
const statusCode = require("../../helpers/statuscode");
const sendNotification = require("../../helpers/notification");
const { responseMessage } = require("../../helpers/response");
const User = require("../../models/user");

const sortData = (orderData) => {
  let newarray = orderData.map((item) => {
    let data = {
      orderId: item.orderId,
      orderStatus: item.orderStatus,
      medImage: item.medImage,
      medicines: item.medicines,
      createdAt: item.createdAt,
    };
    return data;
  });
  return newarray;
};

const sendAdminNotification = async (orderId) => {
  let adminUserID = await User.find({ isAdmin: true }, "_id");

  let deviceToken = await Notification.find({ userId: { $in: adminUserID } });

  let fcm_token = deviceToken.map((data) => data.fcmToken);
  console.log(fcm_token);

  sendNotification.sendPushNotification({
    fcm_token,
    data: { orderId },
  });
};

const fetchDateTime = (createdAt) => {
  let DateValue = new Date(createdAt)
    .toLocaleString(undefined, { timeZone: "Asia/Kolkata" })
    .split(",");

  return { date: DateValue[0], time: DateValue[1] };
};

exports.addOrder = async (req) => {
  let prevData = await Order.find().sort({ _id: -1 }).limit(1);
  let orderId = prevData[0]?.orderId ? prevData[0]?.orderId + 1 : 1001;

  let { orderStatus, medicines,images } = req.body;

  if (!orderStatus || !(images || medicines))
    return {
      statusCode: statusCode.BADREQUEST,
      success: 0,
      message: responseMessage.INVALID_INPUT,
    };

  let medImage = [];

  let data = {
    userId: req.user._id,
    orderStatus: orderStatus,
    orderId,
  };
  //check this

  data.medicines = medicines ? JSON.parse(medicines) : [];
  data.images= images

  const order = new Order(data);
  let result = await order.save();

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.ORDER_FAILURE,
    };

  // Sending Notification to Admin
  await sendAdminNotification(result.orderId);
  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_PLACED,
    data: result,
  };
};

exports.getOrderData = async (req) => {
  let { isAdmin, _id } = req.user;

  if (isAdmin) {
    const result = await Order.find();
    console.log(result, "result");

    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };
    let orderData = await sortData(result);
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: orderData,
    };
  } else {
    const result = await Order.find({ userId: _id });
    console.log(result, "result");

    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };

    let orderData = await sortData(result);
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: orderData,
    };
  }
};

exports.getOrderDetail = async (req) => {
  let { orderId } = req.body;

  const result = await Order.find({ orderId });

  if (!result || !result.length)
    return {
      statusCode: statusCode.NOTFOUND,
      success: 0,
      message: responseMessage.ORDER_NOT_FOUND,
    };
  let { date, time } = fetchDateTime(result[0].createdAt);

  let data = {
    orderId: result[0].orderId,
    orderStatus: result[0].orderStatus,
    medImage: result[0].medImage,
    medicines: result[0].medicines,
    date,
    time,
  };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_PLACED,
    data,
  };
};

exports.orderUpdate = async (req) => {
  let { orderId, orderStatus } = req.body;

  const result = await Order.findOneAndUpdate({ orderId }, { orderStatus });

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.ORDER_FAILURE,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.UPDATE_ORDER,
    data: result,
  };
};
