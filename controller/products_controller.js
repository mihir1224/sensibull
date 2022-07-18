const { json } = require("express");
const { error } = require("firebase-functions/logger");
const { save } = require("node-cron/src/storage");
const products = require("../model/products_model");
const axios = require("axios").default;
const https = require("https");

//Place Order
// exports.placeOrder = async (req, res) => {
//   try {
//     const saveProduct = await axios
//       .post(
//         "https://prototype.sbulltech.com/api/order/place",
//         {
//           symbol: req.body.symbol,
//           quantity: req.body.quantity,
//           order_tag: req.body.order_tag,
//         },
//         {
//           headers: {
//             "x-auth-token": req.headers["x-auth-token"],
//           },
//         }
//       )
//       .then(async function (responseData) {
//         console.log(JSON.stringify(responseData.data));
//         const data = responseData.data;
//         const product = new products({
//           success: data.success,
//           payload: {
//             identifier: data.payload.order.order_id,
//             symbol: data.payload.order.symbol,
//             quantity: data.payload.order.request_quantity,
//             filled_quantity: data.payload.order.filled_quantity,
//             order_status: data.payload.order.status,
//           },
//         });
//         let savedProduct = await product.save();
//         savedProduct = JSON.parse(JSON.stringify(savedProduct));
//         delete savedProduct._id;
//         return savedProduct;
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//     console.log(saveProduct);
//     res.send(saveProduct);
//   } catch (error) {
//     res.send(error.message);
//   }
// };

exports.placeOrder = async (req, response) => {
  try {
    const data = JSON.stringify({
      symbol: req.body.symbol,
      quantity: req.body.quantity,
      order_tag: req.body.order_tag,
    });
    const options = {
      hostname: "prototype.sbulltech.com",
      path: "/api/order/place",
      method: "POST",
      headers: {
        "x-auth-token": req.headers["x-auth-token"],
      },
    };

    const request = https.request(options, (res) => {
      res.on("data", async (responseData) => {
        process.stdout.write("data:" + responseData);
        console.log("***********:" + JSON.stringify(responseData));
        let payloads = new Buffer.from(responseData).toString();
        payloads = JSON.parse(payloads);
        console.log(">>>>>>>>>>>>>" + payloads);

        const order = new products({
          success: payloads.success,
          payload: {
            identifier: payloads.payload.order.order_id,
            symbol: payloads.payload.order.symbol,
            quantity: payloads.payload.order.request_quantity,
            filled_quantity: payloads.payload.order.filled_quantity,
            order_status: payloads.payload.order.status,
          },
        });
        console.log(order);
        let savedProduct = await order.save();
        console.log(savedProduct);

        savedProduct = JSON.parse(JSON.stringify(savedProduct));
        delete savedProduct._id;
        response.send(savedProduct);
      });
    });
    request.on("error", (error) => {
      console.error(error);
    });

    request.write(data);
    request.end();
  } catch (error) {
    response.send(error.message);
  }
};

//Modify Order
// exports.modifyOrder = async (req, res) => {
//   try {
// let product = await req.body;
// const findProduct = await products.findOne({
//   "payload.order_status": "open",
//   "payload.identifier": product.identifier,
// });
// console.log(findProduct);
//     if (findProduct) {
//       axios
//         .put(
//           `https://prototype.sbulltech.com/api/order/place/${product.identifier}`,
//           {
//             quantity: product.new_quantity,
//           },
//           {
//             headers: {
//               "x-auth-token": req.headers["x-auth-token"],
//             },
//           }
//         )
//         .then(async function (responseData) {
//           console.log(responseData.data);

//           if (responseData.data.success) {
//             const updateProduct = await products.findByIdAndUpdate(
//               findProduct._id,
//               {
//                 "payload.quantity":
//                   responseData.data.payload.order.request_quantity,
//                 "payload.filled_quantity":
//                   responseData.data.payload.order.filled_quantity,
//               },
//               { new: true }
//             );
//             let saveProduct = JSON.parse(JSON.stringify(updateProduct));
//             delete saveProduct._id;
//             res.send(saveProduct);
//           } else {
//             res.send(responseData.data);
//           }
//         })
//         .catch(function (error) {
//           res.send(error);
//           console.log(error);
//         });
//     } else {
//       res.send(error.message);
//     }
//   } catch (error) {
//     response.send(error.message);
//   }
// };

exports.modifyOrder = async (req, response) => {
  try {
    let order = await req.body;
    const findOrder = await products.findOne({
      "payload.order_status": "open",
      "payload.identifier": order.identifier,
    });
    console.log("findOrder:" + findOrder);
    if (findOrder) {
      const data = JSON.stringify({
        quantity: order.new_quantity,
      });

      const options = {
        hostname: "prototype.sbulltech.com",
        path: `/api/order/place/${order.identifier}`,
        method: "PUT",
        headers: {
          "x-auth-token": req.headers["x-auth-token"],
        },
      };
      const request = https.request(options, (res) => {
        res.on("data", async (responseData) => {
          process.stdout.write("data:" + responseData);
          // console.log("***********:" + JSON.stringify(responseData));
          let payloads = new Buffer.from(responseData).toString();
          payloads = JSON.parse(payloads);
          // console.log(">>>>>>>>>>>>>" + payloads);

          if (payloads.success) {
            const updateProduct = await products.findByIdAndUpdate(
              findOrder._id,
              {
                "payload.quantity": payloads.payload.order.request_quantity,
                "payload.filled_quantity":
                  payloads.payload.order.filled_quantity,
              },
              { new: true }
            );
            console.log("UpdateProduct:" + updateProduct);

            savedProduct = JSON.parse(JSON.stringify(updateProduct));
            delete savedProduct._id;
            response.send(savedProduct);
          } else {
            response.send(responseData.data);
          }
        });
      });
      request.on("error", (error) => {
        console.error(error.message);
      });

      request.write(data);
      request.end();
    } else {
      response.send(error.message);
    }
  } catch (error) {
    response.send(error.message);
  }
};

//Cancel Order
// exports.cancelOrder = async (req, res) => {
//   try {
//     const product = {
//       identifier: req.body.identifier,
//     };
//     const findProduct = await products.findOne({
//       "payload.identifier": product.identifier,
//     });
//     console.log(findProduct);
//     if (findProduct) {
//       const saveProduct = await axios
//         .delete(
//           `https://prototype.sbulltech.com/api/order/place/${product.identifier}`,
//           {
//             headers: {
//               "x-auth-token": req.headers["x-auth-token"],
//             },
//           }
//         )
//         .then(async function (responseData) {
//           console.log(responseData.data);

//           if (responseData.data.success) {
//             const deleteOrder = await products.findByIdAndUpdate(
//               findProduct._id,
//               {
//                 "payload.order_status": responseData.data.payload.order.status,
//               },
//               { new: true }
//             );
//             let orderDelete = JSON.parse(JSON.stringify(deleteOrder));
//             delete orderDelete._id;
//             res.send(orderDelete);
//           } else {
//             res.send(responseData.data);
//           }
//         })
//         .catch(function (error) {
//           res.send(error.message);
//           console.log(error);
//         });
//     } else {
//       res.send(error.message);
//     }
//   } catch (error) {
//     response.send(error.message);
//   }
// };

exports.cancelOrder = async (req, response) => {
  try {
    const product = {
      identifier: req.body.identifier,
    };
    const findProduct = await products.findOne({
      "payload.identifier": product.identifier,
    });
    console.log(findProduct);
    if (findProduct) {
      const options = {
        hostname: "prototype.sbulltech.com",
        path: `/api/order/place/${product.identifier}`,
        method: "DELETE",
        headers: {
          "x-auth-token": req.headers["x-auth-token"],
        },
      };
      const request = https.request(options, (res) => {
        res.on("data", async (responseData) => {
          process.stdout.write("data:" + responseData);
          // console.log("***********:" + JSON.stringify(responseData));
          let payloads = new Buffer.from(responseData).toString();
          payloads = JSON.parse(payloads);
          // console.log(">>>>>>>>>>>>>" + payloads);

          if (payloads.success) {
            const updateProduct = await products.findByIdAndUpdate(
              findProduct._id,
              {
                "payload.order_status": payloads.payload.order.status,
              },
              { new: true }
            );
            console.log("UpdateProduct:" + updateProduct);

            savedProduct = JSON.parse(JSON.stringify(updateProduct));
            delete savedProduct._id;
            response.send(savedProduct);
          } else {
            response.send(payloads);
          }
        });
      });
      request.on("error", (error) => {
        console.error(error.message);
      });
      request.end();
    } else {
      response.send(error.message);
    }
  } catch (error) {
    response.send(error.message);
  }
};

//order status
exports.orderStatus = async (req, res) => {
  try {
    let oderProduct = {
      identifier: req.body.identifier,
    };
    const showOrderStatus = await products.findOne({
      "payload.identifier": oderProduct.identifier,
    });
    const saveOrder = JSON.parse(JSON.stringify(showOrderStatus));
    delete saveOrder._id;
    res.send(saveOrder);
  } catch (error) {
    res.send(error.message);
  }
};
