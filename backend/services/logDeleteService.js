// backend/services/logDeleteService.js

import express from 'express';
// If your Node version <18, uncomment and install node-fetch:
// import fetch from 'node-fetch';

const router = express.Router();

const SHEET_LOG_URL =
  'https://script.google.com/macros/s/AKfycbx6A7aVBByr-s16PwajO008N6VX9yOxNsYvhWpOsbxRzoWzffKJ6iboM4ARUmsnGgRhrg/exec';

/**
 * Proxy endpoint: logs card-delete reasons into Google Sheets.
 * Expects JSON body: { userId, company, position, reason }
 */
router.post('/api/log-delete-card-reason', async (req, res) => {
  try {
    // sanity check
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ status: 'error', message: 'Missing JSON body' });
    }

    // forward to Apps Script
    const sheetResp = await fetch(SHEET_LOG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    // Apps Script always returns { status: "success" } or error JSON
    const payload = await sheetResp.json();
    return res.json(payload);

  } catch (err) {
    console.error('Failed to log delete reason:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Logging to Sheet failed'
    });
  }
});

export default router;
