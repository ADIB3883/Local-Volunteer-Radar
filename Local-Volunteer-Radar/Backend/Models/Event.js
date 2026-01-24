const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
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

  startDateTime: {
    type: Date,
    required: true,
  },

  endDateTime: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },

  volunteersNeeded: {
    type: Number,
    required: true,
    min: 1,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  requirements: {
    type: String,
    default: "",
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isApproved: {
    type: Boolean,
    default: false
  }
});

//ensure endDateTime is after startDateTime
EventSchema.pre("save", function (next) {
  if (this.endDateTime <= this.startDateTime) {
    return next(new Error("endDateTime must be after startDateTime"));
  }
  next();
});

module.exports = mongoose.model("Event", EventSchema, "Events");