const express = require('express');
const router = express.Router();
const Organizer = require('../Models/Organizer');
const User = require('../Models/User');

// GET organizer by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const organizer = await Organizer.findById(id);
        
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found'
            });
        }

        res.json({
            success: true,
            user: organizer
        });
    } catch (error) {
        console.error('Error fetching organizer:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET organizer by email
router.get('/email/:email', async (req, res) => {
    try {
        const organizer = await Organizer.findOne({ email: req.params.email });

        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        res.json(organizer);
    } catch (error) {
        console.error('Error fetching organizer by email:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE organizer by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const organizer = await Organizer.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found'
            });
        }

        res.json({
            success: true,
            message: 'Organizer updated successfully',
            user: organizer
        });
    } catch (error) {
        console.error('Organizer update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during organizer update'
        });
    }
});

// DELETE organizer by ID (for admin use)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Attempting to delete organizer with ID:', id);
        
        // Try to find and delete the organizer by ID
        const organizer = await Organizer.findById(id);
        
        if (!organizer) {
            console.log('Organizer not found with ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Organizer not found'
            });
        }

        // Delete the organizer record
        await Organizer.findByIdAndDelete(id);
        
        // Also delete the associated User record
        await User.deleteOne({ email: organizer.email });

        console.log('✅ Organizer deleted successfully:', organizer.name);

        res.json({
            success: true,
            message: 'Organizer deleted successfully'
        });
    } catch (error) {
        console.error('❌ Organizer deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during organizer deletion'
        });
    }
});

module.exports = router;