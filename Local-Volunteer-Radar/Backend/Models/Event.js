const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  date: {
    type: String, // example: "2026-01-26"
    required: true,
    trim: true,
  },

  time: {
    type: String, // example: "10:30 AM"
    required: true,
    trim: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },

  distance: {
    type: Number,
    default: 0,
    min: 0,
  },

  requirements: {
    type: String,
    default: "",
    trim: true,
  },

  onRegister: {
    type: Boolean,
    default: true,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },

  isRejected: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Event", EventSchema, "Events");