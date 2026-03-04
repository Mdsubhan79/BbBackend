const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Submit feedback for delivered order
router.post('/:orderId/feedback', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        order.feedback = {
            text: req.body.feedback,
            rating: req.body.rating,
            timestamp: req.body.timestamp || new Date()
        };
        
        await order.save();
        
        res.json({ success: true, message: 'Feedback saved' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;