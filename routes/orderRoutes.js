// DELETE order (permanent delete from database)
router.delete('/:orderId', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Broadcast deletion to tracker
        if (global.broadcastUpdate) {
            global.broadcastUpdate({
                type: 'ORDER_DELETED',
                orderId: order._id,
                reason: 'Order deleted by admin'
            });
        }

        res.json({ 
            success: true, 
            message: 'Order deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: error.message });
    }
});