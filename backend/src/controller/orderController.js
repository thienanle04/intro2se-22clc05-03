const Order = require('../models/Order');

class OrderController {
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find();
            res.status(200).json({
                data: {
                    orders,
                },
                message: 'Get all orders successfully',
                code: 1
            });
        } catch (error) {
            res.status(500).json({
                data: null,
                message: 'Get all orders failed',
                code: 0
            });
        }
    }

    async updateOrderStatus(req, res){
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const order = await Order.findById(orderId);
            if (!order) {
                res.status(404).json({
                    data: null,
                    message: 'Order not found',
                    code: 0
                });
            }
            order.status = status;
            await order.save();
            res.status(200).json({
                data: {
                    order,
                },
                message: 'Update order status successfully',
                code: 1
            });
        } catch (error) {
            res.status(500).json({
                data: null,
                message: 'Update order status failed',
                code: 0
            });
        }
    }

    async deleteOrder(req, res){
        try {
            const { orderId } = req.params;
            const order = await Order.findById({_id: orderId})
            if (!order) {
                res.status(404).json({
                    data: null,
                    message: 'Order not found',
                    code: 0
                });
            }
            await Order.findByIdAndDelete(orderId);
            res.status(200).json({
                data: null,
                message: 'Delete order successfully',
                code: 1
            });
          }
          catch (error) {
            res.status(500).json({
                data: null,
                message: 'Delete order failed',
                code: 0
            });
          }
    }

    async getOrderById(req, res){
      try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
          res.status(404).json({
            data: null,
            message: 'Order not found',
            code: 0
          });
        }
        res.status(200).json({
          data: {
            order,
          },
          message: 'Get order by orderId successfully',
          code: 1
        });
        
      } catch (error) {
        
      }
    }
}

module.exports = new OrderController();