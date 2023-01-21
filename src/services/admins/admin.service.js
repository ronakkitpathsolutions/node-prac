const statusCode = require("../../helpers/statuscode");
const order = require("../../models/order");
const user = require("../../models/user");

const sortCustomerData = (userData) => {
  let newarray = userData.map((item) => {
    let data = {
      userId: item._id,
      name: item.name,
      phoneNo: item.phoneNo,
    };
    return data;
  });
  return newarray;
};

const sortOrderData = async (orderData) => {
  let pendingOrder = 0;
  let orderHistroy = await orderData.map((item) => {
    const { orderId, orderStatus, medImage, medicines, createdAt } = item;
    let values = {
      orderId,
      orderStatus,
      medImage,
      medicines,
      createdAt,
    };
    orderStatus == "Pending" && pendingOrder++;

    return values;
  });

  return { orderHistroy, pendingOrder, totalOrder: orderData.length };
};

exports.getUserList = async (req) => {
  const result = await user.find({ isAdmin: false });

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: "User Data Fetch Failure",
    };

  let data = await sortCustomerData(result);
  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "List of Users",
    data,
  };
};

exports.getCustomerDetail = async (req) => {
  debugger;
  const { userId } = req.body;
  // let _id = userId;
  const customerDetail = await user.findById(userId);
  debugger;
  if (!customerDetail) {
    return {
      statusCode: statusCode.NOTFOUND,
      success: 0,
      message: "Error in User Fetch",
    };
  }
  const { name, address, phoneNo } = customerDetail;

  const OrderData = await order.find({ userId });

  if (!OrderData) {
    return {
      statusCode: statusCode.NOTFOUND,
      success: 0,
      message: "Error in Order Fetch",
    };
  }
  const orderDetail = await sortOrderData(OrderData);
  const { orderHistroy, pendingOrder, totalOrder } = orderDetail;
  const data = {
    name,
    address,
    phoneNo,
    pendingOrder,
    totalOrder,
    orderHistroy,
  };

  debugger;
  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "Customer Detail",
    data,
  };
};
