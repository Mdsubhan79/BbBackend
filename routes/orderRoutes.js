
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/create', async (req, res) => {
    try {
        const cancellationDeadline = new Date(Date.now() + 5 * 60000); // 5 minutes
        
        const orderData = {
            ...req.body,
            cancellationDeadline,
            progressSteps: {
                orderPlaced: { status: true, time: new Date() },
                confirmed: { status: false, time: null },
                preparing: { status: false, time: null },
                outForDelivery: { status: false, time: null },
                delivered: { status: false, time: null }
            }
        };

        const order = new Order(orderData);
        await order.save();

        // Broadcast new order to admin dashboard
        if (global.broadcastUpdate) {
            global.broadcastUpdate({
                type: 'NEW_ORDER',
                order
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's active order
router.get('/active/:userId', async (req, res) => {
    try {
        const order = await Order.findOne({
            userId: req.params.userId,
            orderStatus: { $nin: ['delivered', 'cancelled'] }
        }).sort({ orderTime: -1 });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel order (within 5 minutes)
router.post('/cancel/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if within cancellation window (5 minutes)
        const now = new Date();
        const orderTime = new Date(order.orderTime || order.createdAt);
        const timeDiff = (now - orderTime) / (1000 * 60); // in minutes
        
        console.log(`Cancel attempt - Order time: ${orderTime}, Now: ${now}, Diff: ${timeDiff} minutes`);

        if (timeDiff <= 5) {
            order.orderStatus = 'cancelled';
            await order.save();

            // Broadcast cancellation
            if (global.broadcastUpdate) {
                global.broadcastUpdate({
                    type: 'ORDER_CANCELLED',
                    orderId: order._id
                });
            }

            res.json({ 
                success: true, 
                message: 'Order cancelled successfully' 
            });
        } else {
            res.status(400).json({ 
                error: 'Cancellation time expired. Orders can only be cancelled within 5 minutes of placing.' 
            });
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;