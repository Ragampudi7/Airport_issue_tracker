'use strict';

const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    sector: { 
      type: String, 
      enum: ['cabin_crew', 'sanitation', 'security', 'passenger_boarding', 'passenger_arrivals', 'sos_portal'], 
      required: true 
    },
    subCategory: { 
      type: String, 
      required: true, 
      trim: true 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical', 'sos'], 
      default: 'medium' 
    },
    status: { 
      type: String, 
      enum: ['red', 'yellow', 'green'], 
      default: 'red' 
    },
    reporterName: { type: String, trim: true },
    reporterContact: { type: String, trim: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedStaffId: { type: String, trim: true },
    assignedStaffName: { type: String, trim: true },
    assignedDepartment: { type: String, trim: true },
    resolutionNotes: { type: String, trim: true },
    isEmergency: { type: Boolean, default: false },
    estimatedResolutionTime: { type: Date },
    actualResolutionTime: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', IncidentSchema);


