const express = require('express');
const router = express.Router();
const User = require('../models/User');

// PUT /api/admin/users/approve/:userId
router.put('/approve/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.status === 'Active' || (user.isPending === false && user.isApproved === true)) {
            return res.status(400).json({
                success: false,
                message: 'User is already approved'
            });
        }

        user.status = 'Active';
        user.isPending = false;
        user.isApproved = true;
        user.approvedAt = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User approved successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Error approving user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PUT /api/admin/users/reject/:userId
router.put('/reject/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is already rejected
        if (user.status === 'Rejected' || (user.isPending === false && user.isApproved === false)) {
            return res.status(400).json({
                success: false,
                message: 'User is already rejected'
            });
        }

        // Update user status
        user.status = 'Rejected';
        user.isPending = true;
        user.isApproved = false;
        user.rejectedAt = new Date();
        if (reason) {
            user.rejectionReason = reason;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User rejected successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Error rejecting user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;