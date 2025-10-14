'use strict';

const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { authenticate, requireRole } = require('../middleware/auth');

// Create incident
router.post('/', authenticate, async (req, res) => {
  try {
    const payload = Object.assign({}, req.body);
    if (req.user && req.user.role === 'customer') {
      payload.reporterName = payload.reporterName || req.user.name;
      payload.reporterContact = payload.reporterContact || req.user.email;
      payload.status = 'Open';
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
    const { status, priority, category, q, assignedStaffId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedStaffId) filter.assignedStaffId = assignedStaffId;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }
    const incidents = await Incident.find(filter).sort({ createdAt: -1 }).limit(200);
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

// Staff claim incident
router.post('/:id/claim', authenticate, requireRole('staff'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    if (incident.assignedStaffId && incident.assignedStaffId !== req.user.staffId) {
      return res.status(409).json({ message: 'Already claimed by another staff' });
    }
    incident.assignedStaffId = req.user.staffId || 'UNKNOWN';
    if (incident.status === 'Open') incident.status = 'In Progress';
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(400).json({ message: 'Failed to claim', error: err.message });
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

module.exports = router;


