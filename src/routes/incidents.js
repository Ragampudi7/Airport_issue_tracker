'use strict';

const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { authenticate, requireRole } = require('../middleware/auth');

// Create incident
router.post('/', authenticate, async (req, res) => {
  try {
    const payload = Object.assign({}, req.body);
    if (req.user) {
      payload.reporterName = payload.reporterName || req.user.name;
      payload.reporterContact = payload.reporterContact || req.user.email;
      payload.reporterId = req.user.sub;
      payload.status = 'red'; // All new incidents start as red
    }
    
    // Handle SOS portal incidents
    if (payload.sector === 'sos_portal') {
      payload.priority = 'sos';
      payload.isEmergency = true;
    }
    
    const incident = await Incident.create(payload);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create incident', error: err.message });
  }
});

// List incidents with simple filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, sector, subCategory, q, assignedStaffId } = req.query;
    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'passenger') {
      // Passengers can only see red and green status incidents
      filter.status = { $in: ['red', 'green'] };
      // Filter by passenger sectors only
      filter.sector = { $in: ['passenger_boarding', 'passenger_arrivals', 'sos_portal'] };
    } else if (req.user.role === 'staff') {
      // Staff can see all statuses but filter by their access
      if (status) filter.status = status;
      if (req.user.department) {
        // Staff can see incidents for their department
        filter.$or = [
          { sector: req.user.department },
          { assignedStaffId: req.user.staffId },
          { status: 'red' } // Can see all red incidents
        ];
      }
    }
    
    if (priority) filter.priority = priority;
    if (sector) filter.sector = sector;
    if (subCategory) filter.subCategory = subCategory;
    if (assignedStaffId) filter.assignedStaffId = assignedStaffId;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }
    
    const incidents = await Incident.find(filter).sort({ 
      priority: -1, // SOS first, then by priority
      isEmergency: -1,
      createdAt: -1 
    }).limit(200);
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch incidents', error: err.message });
  }
});

// Get incident by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id', error: err.message });
  }
});

// Update incident
router.put('/:id', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update', error: err.message });
  }
});

// Staff claim incident (move from red to yellow)
router.post('/:id/claim', authenticate, requireRole('staff'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    if (incident.assignedStaffId && incident.assignedStaffId !== req.user.staffId) {
      return res.status(409).json({ message: 'Already claimed by another staff' });
    }
    incident.assignedStaffId = req.user.staffId || 'UNKNOWN';
    incident.assignedStaffName = req.user.name;
    incident.assignedDepartment = req.user.department;
    incident.status = 'yellow'; // Move from red to yellow
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Failed to claim', error: err.message });
  }
});

// Staff resolve incident (move from yellow to green)
router.post('/:id/resolve', authenticate, requireRole('staff'), async (req, res) => {
  try {
    const { resolutionNotes } = req.body;
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    if (incident.assignedStaffId !== req.user.staffId) {
      return res.status(403).json({ message: 'You can only resolve incidents assigned to you' });
    }
    incident.status = 'green'; // Move from yellow to green
    incident.resolutionNotes = resolutionNotes;
    incident.actualResolutionTime = new Date();
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Failed to resolve', error: err.message });
  }
});

// Delete incident
router.delete('/:id', authenticate, requireRole('staff'), async (req, res) => {
  try {
    const result = await Incident.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Incident not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete', error: err.message });
  }
});

// Get available sectors and categories
router.get('/meta/categories', authenticate, (req, res) => {
  const categories = {
    cabin_crew: [
      'Last-minute checks and issue reporting',
      'Passenger misconduct',
      'Pantry availability',
      'Other cabin crew issues'
    ],
    sanitation: [
      'Restroom availability',
      'Cleaning personnel shortage',
      'Hygiene concerns',
      'Other sanitation issues'
    ],
    security: [
      'Boarding-related issues',
      'CCTV system defects',
      'Security equipment issues',
      'Other security concerns'
    ],
    passenger_boarding: [
      'Boarding pass issues',
      'Lack of clear guidance',
      'Regulation misunderstandings',
      'Restroom availability',
      'Food and beverage concerns'
    ],
    passenger_arrivals: [
      'Luggage misplacement',
      'Luggage damage',
      'Excessive checkout wait times',
      'Other arrival issues'
    ],
    sos_portal: [
      'Emergency - First aid needed',
      'Emergency - Medical assistance',
      'Harassment incident',
      'Fraud investigation',
      'Missing items',
      'Other emergency'
    ]
  };
  
  res.json(categories);
});

module.exports = router;


