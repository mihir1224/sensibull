const router = require("express").Router();
const productsController = require("../controller/products_controller");
const auth = require("../auth");

router.post("/order-service", auth.auth, productsController.placeOrder);
router.put("/order-service", auth.auth, productsController.modifyOrder);
router.delete("/order-service", auth.auth, productsController.cancelOrder);
router.post("/order-service/status", auth.auth, productsController.orderStatus);

module.exports = router;
