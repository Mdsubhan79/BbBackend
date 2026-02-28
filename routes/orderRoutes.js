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
        global.broadcastUpdate({
            type: 'NEW_ORDER',
            order
        });

        res.status(201).json(order);
    } catch (error) {
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
        
        if (new Date() < order.cancellationDeadline) {
            order.orderStatus = 'cancelled';
            await order.save();

            global.broadcastUpdate({
                type: 'ORDER_CANCELLED',
                orderId: order._id
            });

            res.json({ message: 'Order cancelled successfully' });
        } else {
            res.status(400).json({ error: 'Cancellation time expired' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Update order status
router.put('/admin/update/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        const { status, paymentStatus, deliveryEstimate, adminNotes, action } = req.body;

        if (action === 'delete') {
            order.orderStatus = 'cancelled';
            order.adminNotes = adminNotes || 'Order cancelled by admin';
            await order.save();

            global.broadcastUpdate({
                type: 'ORDER_DELETED',
                orderId: order._id,
                reason: adminNotes
            });
        } else {
            // Update order status and progress steps
            if (status) {
                order.orderStatus = status;
                const stepMap = {
                    'confirmed': 'confirmed',
                    'preparing': 'preparing',
                    'out-for-delivery': 'outForDelivery',
                    'delivered': 'delivered'
                };
                
                if (stepMap[status]) {
                    order.progressSteps[stepMap[status]] = {
                        status: true,
                        time: new Date()
                    };
                }
            }
            
            if (paymentStatus) order.paymentStatus = paymentStatus;
            if (deliveryEstimate) order.deliveryEstimate = deliveryEstimate;
            if (adminNotes) order.adminNotes = adminNotes;

            await order.save();

            global.broadcastUpdate({
                type: 'ORDER_UPDATED',
                order
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all orders with filters
router.get('/admin/all', async (req, res) => {
    try {
        const { status, date } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        if (date === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.orderTime = { $gte: today };
        }

        const orders = await Order.find(query).sort({ orderTime: -1 });
        
        // Get delivered orders count
        const deliveredCount = await Order.countDocuments({
            orderStatus: 'delivered',
            orderTime: { $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            orders,
            stats: {
                deliveredLast10Days: deliveredCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ALL ORDERS (For Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;