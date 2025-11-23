// backend/src/controllers/logController.js
const db = require('../db');
const { User, Employee, Team, Organisation, Log } = db;


/** LIST Logs */
exports.listLogs = async (req, res) => {
  // Simple pagination setup
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const logs = await Log.findAndCountAll({
      where: { organisation_id: req.user.orgId },
      include: [{
        model: User,
        attributes: ['email', 'name'] // Include user details for context
      }],
      order: [['timestamp', 'DESC']],
      limit,
      offset
    });
    
    res.status(200).json({
      total: logs.count,
      limit,
      offset,
      data: logs.rows
    });
  } catch (error) {
    console.error('List logs error:', error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
};