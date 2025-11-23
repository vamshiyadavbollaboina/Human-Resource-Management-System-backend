// backend/src/controllers/employeeController.js
const db = require('../db');
const { Employee, Team } = db;
const { createLog } = require('../services/LogService');

/** LIST Employees (R) */
exports.listEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
    //   where: { organisation_id: req.user.orgId },
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
          through: { attributes: [], timestamps: false } // avoid created_at/updated_at
        }
      ],
      order: [['last_name', 'ASC']]
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error('List employees error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

/** CREATE Employee (C) */
exports.createEmployee = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }

  try {
    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      phone,
      organisation_id: req.user.orgId
    });

    await createLog(req.user.orgId, req.user.userId, 'employee_created', {
      employeeId: employee.id,
      name: `${first_name} ${last_name}`
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error creating employee' });
  }
};

/** GET Employee (R) */
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
    //   where: { id: req.params.id, organisation_id: req.user.orgId },
      include: [
        {
          model: Team,
          attributes: ['id', 'name', 'description'],
          through: { attributes: [], timestamps: false }
        }
      ]
    });

    if (!employee) return res.status(404).json({ message: 'Employee not found or unauthorized' });

    res.status(200).json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error fetching employee details' });
  }
};

/** UPDATE Employee (U) */
exports.updateEmployee = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    const [updatedRows] = await Employee.update(
      { first_name, last_name, email, phone },
      { where: { id: req.params.id, organisation_id: req.user.orgId } }
    );

    if (updatedRows === 0) return res.status(404).json({ message: 'Employee not found or unauthorized' });

    const updatedEmployee = await Employee.findByPk(req.params.id, {
      include: [{ model: Team, attributes: ['id', 'name'], through: { attributes: [], timestamps: false } }]
    });

    await createLog(req.user.orgId, req.user.userId, 'employee_updated', {
      employeeId: req.params.id,
      updates: req.body
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error updating employee' });
  }
};

/** DELETE Employee (D) */
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedCount = await Employee.destroy({
      where: { id: req.params.id, organisation_id: req.user.orgId }
    });

    if (deletedCount === 0) return res.status(404).json({ message: 'Employee not found or unauthorized' });

    await createLog(req.user.orgId, req.user.userId, 'employee_deleted', { employeeId: req.params.id });

    res.status(204).send();
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};

/** ASSIGN TEAMS — Many-to-Many */
exports.assignTeams = async (req, res) => {
  const employeeId = req.params.id;
  const { teamIds } = req.body;

  if (!Array.isArray(teamIds)) return res.status(400).json({ message: 'teamIds must be an array' });

  try {
    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: req.user.orgId }
    });

    if (!employee) return res.status(404).json({ message: 'Employee not found or unauthorized' });

    const availableTeams = await Team.findAll({
      where: { organisation_id: req.user.orgId, id: teamIds }
    });

    const validTeamIds = availableTeams.map(t => t.id);

    await employee.setTeams(validTeamIds); // Sequelize handles join table

    await createLog(req.user.orgId, req.user.userId, 'employee_team_assignment_changed', {
      employeeId,
      teamIds: validTeamIds
    });

    const updatedEmployee = await Employee.findByPk(employeeId, {
      include: [{ model: Team, attributes: ['id', 'name'], through: { attributes: [], timestamps: false } }]
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Assign teams error:', error);
    res.status(500).json({ message: 'Server error managing team assignments' });
  }
};
