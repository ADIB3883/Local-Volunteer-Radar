const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        eventName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: ["education", "environment", "health", "community", "distribution", "other"],
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        startdate: {
            type: String,
            required: true,
        },

        enddate: {
            type: String,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        volunteersNeeded: {
            type: Number,
            required: true,
            min: 1,
        },

        volunteersRegistered: {
            type: Number,
            default: 0,
        },

        requirements: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "active", "completed", "cancelled"],
            default: "pending",
        },

        completedAt: {
            type: Date,
        },

        cancelledAt: {
            type: Date,
        },

        isApproved: {
            type: Boolean,
            default: false,
        },

        isCompleted: {
            type: Boolean,
            default: false,
        },

        //Volunteer Registrations
        registrations: [
            {
                volunteer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },

                status: {
                    type: String,
                    enum: ["pending", "approved", "rejected"],
                    default: "pending",
                },

                registeredAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        //Announcements
        announcements: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },

                message: {
                    type: String,
                    required: true,
                    trim: true,
                },

                sentAt: {
                    type: Date,
                    default: Date.now,
                },

                sentBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Event", EventSchema, 'Events');