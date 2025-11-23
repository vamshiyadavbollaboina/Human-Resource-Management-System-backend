// backend/src/services/LogService.js
const db = require('../db');
const { User, Employee, Team, Organisation, Log } = db;


/**
 * Utility function to create a log entry for any backend operation.
 * @param {number} organisation_id - The ID of the organization.
 * @param {number|null} user_id - The ID of the user performing the action.
 * @param {string} action - A short code describing the action (e.g., 'employee_created').
 * @param {object} meta - JSON metadata about the action (e.g., IDs, names).
 */
async function createLog(organisation_id, user_id, action, meta = {}) {
  try {
    await Log.create({
      organisation_id,
      user_id,
      action,
      meta,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error creating log entry:", error);
    // Note: Do not throw an error here; logging should not crash a core operation
  }
}

module.exports = { createLog };