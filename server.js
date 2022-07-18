const express = require("express");

const mongoose = require("mongoose");

const cron = require("node-cron");

const app = express();

const product = require("./model/products_model");

const axios = require("axios").default;

const https = require("https");

//configure
require("dotenv").config();

app.use(express.json());

//routes
const productsRoutes = require("./routes/products_routes");

//api link
app.use("/", productsRoutes);

//connect to database
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("successfully connect")
);

//cron-jobs
// let count = 0;
// cron.schedule("*/10 * * * * *", async () => {
//   count++;
//   const findOrderStatus = await product.find({
//     "payload.order_status": "open",
//   });
//   console.log(findOrderStatus);

//   for (ele of findOrderStatus) {
//     console.log("element" + ele);
//     try {
//       await axios
//         .post(
//           "https://prototype.sbulltech.com/api/order/status-for-ids",
//           { order_ids: [ele.payload.identifier] },
//           {
//             headers: {
//               "x-auth-token": "qXPC9ezHVkHTnmO8LFG76V4t4ref3lkNRet3b0W5jZ8",
//             },
//           }
//         )
//         .then(async (responseData) => {
//           console.log("response" + responseData);
//           // let aa = JSON.stringify(responseData.data);
//           // console.log("data" + aa);
//           if (responseData.data.success) {
//             console.log("payload" + responseData.data);
//             let payload = responseData.data.payload[0];
//             let updateOrder = await product.updateOne(
//               { "payload.identifier": payload.order_id },

//               {
//                 "payload.order_status": payload.status,
//                 "payload.filled_quantity": payload.filled_quantity,
//               },

//               {
//                 new: true,
//               }
//             );

//             console.log("update" + JSON.stringify(updateOrder));
//           }
//         });
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
// });

// let count = 0;
// cron.schedule("*/10 * * * * *", async () => {
//   count++;
//   const findOrderStatus = await product.find({
//     "payload.order_status": "open",
//   });
//   console.log(findOrderStatus);

//   for (ele of findOrderStatus) {
//     const data = JSON.stringify({
//       order_ids: [ele.payload.identifier],
//     });

//     console.log("element" + ele);
//     try {
//       const options = {
//         hostname: "prototype.sbulltech.com",
//         path: "/api/order/status-for-ids",
//         method: "POST",
//         headers: {
//           "x-auth-token": "qXPC9ezHVkHTnmO8LFG76V4t4ref3lkNRet3b0W5jZ8",
//         },
//       };
//       const request = https.request(options, (res) => {
//         res.on("data", async (responseData) => {
//           process.stdout.write("data:" + responseData);
//           // console.log("***********:" + JSON.stringify(responseData));
//           // let payloads = new Buffer.from(responseData).toString();
//           // payloads = JSON.parse(payloads);
//           // console.log(">>>>>>>>>>>>>" + payloads);

//           if (responseData.success) {
//             let updateOrder = await product.updateOne(
//               { "payload.identifier": responseData.payload[0].order_id },

//               {
//                 "payload.order_status": responseData.payload[0].status,
//                 "payload.filled_quantity":
//                   responseData.payload[0].filled_quantity,
//               },

//               {
//                 new: true,
//               }
//             );

//             console.log(JSON.stringify(updateOrder));
//           }
//         });
//       });
//       request.on("error", (error) => {
//         console.error(error.message);
//       });

//       request.write(data);
//       request.end();
//     } catch (error) {
//       response.send(error.message);
//     }
//   }
// });

//server
app.get("", (req, res) => {
  res.send("Hello! Database");
});
app.listen(19093, () => {
  console.log("connect...");
});
