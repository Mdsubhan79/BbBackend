const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders with filters
router.get('/', async (req, res) => {
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
        
        // Get delivered orders count for last 10 days
        const deliveredCount = await Order.countDocuments({
            orderStatus: 'delivered',
            orderTime: { $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            orders,
            stats: {
                deliveredLast10Days: deliveredCount,
                totalOrders: await Order.countDocuments(),
                todayOrders: await Order.countDocuments({
                    orderTime: { $gte: new Date().setHours(0, 0, 0, 0) }
                })
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.put('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        const { status, paymentStatus, deliveryEstimate, adminNotes, action } = req.body;

        if (action === 'delete') {
            order.orderStatus = 'cancelled';
            order.adminNotes = adminNotes || 'Order cancelled by admin';
            await order.save();

            if (global.broadcastUpdate) {
                global.broadcastUpdate({
                    type: 'ORDER_DELETED',
                    orderId: order._id,
                    reason: adminNotes
                });
            }
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

            if (global.broadcastUpdate) {
                global.broadcastUpdate({
                    type: 'ORDER_UPDATED',
                    order
                });
            }
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order statistics
router.get('/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const stats = {
            today: await Order.countDocuments({ orderTime: { $gte: today } }),
            pending: await Order.countDocuments({ orderStatus: 'pending' }),
            confirmed: await Order.countDocuments({ orderStatus: 'confirmed' }),
            preparing: await Order.countDocuments({ orderStatus: 'preparing' }),
            outForDelivery: await Order.countDocuments({ orderStatus: 'out-for-delivery' }),
            delivered: await Order.countDocuments({ orderStatus: 'delivered' }),
            cancelled: await Order.countDocuments({ orderStatus: 'cancelled' }),
            revenue: await Order.aggregate([
                { $match: { paymentStatus: 'paid', orderStatus: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;