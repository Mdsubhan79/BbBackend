const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// CREATE ORDER
router.post('/create', async (req, res) => {
    try {
        const cancellationDeadline = new Date(Date.now() + 5 * 60000);

        const order = new Order({
            ...req.body,
            cancellationDeadline
        });

        await order.save();

        if (global.broadcastUpdate) {
            global.broadcastUpdate({
                type: 'NEW_ORDER',
                order
            });
        }

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ACTIVE ORDER
router.get('/active/:userId', async (req, res) => {
    try {
        const order = await Order.findOne({
            userId: req.params.userId,
            orderStatus: { $nin: ['delivered','cancelled'] }
        }).sort({ orderTime: -1 });

        res.json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CANCEL ORDER
router.post('/cancel/:orderId', async (req, res) => {
    try {

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (new Date() < new Date(order.cancellationDeadline)) {

            order.orderStatus = "cancelled";
            await order.save();

            if (global.broadcastUpdate) {
                global.broadcastUpdate({
                    type: 'ORDER_CANCELLED',
                    orderId: order._id
                });
            }

            res.json({ message: "Order cancelled successfully" });

        } else {

            res.status(400).json({
                error: "Cancellation time expired"
            });

        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;