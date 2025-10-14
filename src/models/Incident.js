'use strict';

const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Restroom', 'Elevator', 'Escalator', 'Seating', 'Cleaning', 'Electrical', 'Other'],
      default: 'Other'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    reporterName: { type: String, trim: true },
    reporterContact: { type: String, trim: true },
    assignedTeam: { type: String, trim: true },
    assignedStaffId: { type: String, trim: true },
    slaDueAt: { type: Date },
    resolutionNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', IncidentSchema);


