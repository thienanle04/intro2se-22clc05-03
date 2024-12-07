const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController.js');

// [GET] /api/v1/orders: get all orders, only admin can access
router
  .route('')
  .get(orderController.getAllOrders);

// [PUT] /api/v1/orders/{orderId}/update: update order status by orderId, only admin can access
router
  .route('/:orderId/update')
  .put(orderController.updateOrderStatus);

// [DELETE] /api/v1/orders/{orderId}/delete: delete order by orderId, only admin can access
router
  .route('/:orderId/delete')
  .delete(orderController.deleteOrder);

// [GET] /api/v1/orders/{orderId}: get order by orderId, only admin can access
router
  .route('/:orderId')
  .get(orderController.getOrderById);

module.exports = router;