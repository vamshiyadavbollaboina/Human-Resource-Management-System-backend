// backend/src/controllers/teamController.js
const db = require('../db');
const { Employee, Team} = db;

const { createLog } = require('../services/LogService');

/** LIST Teams (R) */
exports.listTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
    //   where: { organisation_id: req.user.orgId },
      include: [{
        model: Employee,
        attributes: ['id', 'first_name', 'last_name'] // Include members for team list
      }],
      order: [['name', 'ASC']]
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error('List teams error:', error);
    res.status(500).json({ message: 'Server error fetching teams' });
  }
};

/** CREATE Team (C) */
exports.createTeam = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Team name is required' });
  }

  try {
    const team = await Team.create({
      name,
      description,
      organisation_id: req.user.orgId,
    });
    
    // Log creation
    await createLog(req.user.orgId, req.user.userId, 'team_created', { teamId: team.id, name: team.name });

    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error creating team' });
  }
};

/** GET Team (R) */
/*
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: { 
        id: req.params.id, 
        organisation_id: req.user.orgId 
      },
      include: [{
        model: Employee,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error fetching team details' });
  }
};*/

exports.getTeam = async (req, res) => {
  console.log('req.user:', req.user);
  console.log('req.params.id:', req.params.id);

  try {
    const team = await Team.findOne({
      where: { 
        id: req.params.id, 
        organisation_id: req.user.orgId 
      },
      include: [{
        model: Employee,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error fetching team details' });
  }
};


/** UPDATE Team (U) */
exports.updateTeam = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const [updatedRows] = await Team.update(
      { name, description },
      { 
        where: { id: req.params.id, organisation_id: req.user.orgId },
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    const updatedTeam = await Team.findByPk(req.params.id);

    // Log update
    await createLog(req.user.orgId, req.user.userId, 'team_updated', { teamId: req.params.id, updates: req.body });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error updating team' });
  }
};

/** DELETE Team (D) */
exports.deleteTeam = async (req, res) => {
  try {
    const deletedCount = await Team.destroy({
      where: { id: req.params.id, organisation_id: req.user.orgId }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }
    
    // Log deletion
    await createLog(req.user.orgId, req.user.userId, 'team_deleted', { teamId: req.params.id });

    // The CASCADE delete in the migration handles the `employee_teams` entries.
    res.status(204).send(); 
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error deleting team' });
  }
};

/** ASSIGN Employees (M:M Relationship Management) */
exports.assignEmployees = async (req, res) => {
  const teamId = req.params.id;
  const { employeeIds } = req.body; // Expects an array of employee IDs to be assigned

  if (!Array.isArray(employeeIds)) {
    return res.status(400).json({ message: 'employeeIds must be an array' });
  }

  try {
    const team = await Team.findOne({
      where: { id: teamId, organisation_id: req.user.orgId }
    });
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    // 1. Get all employees for this organisation
    const availableEmployees = await Employee.findAll({
        where: { organisation_id: req.user.orgId, id: employeeIds }
    });
    
    // Extract valid IDs
    const validEmployeeIds = availableEmployees.map(e => e.id);

    // 2. Set the employees for the team (Sequelize manages the join table)
    await team.setEmployees(validEmployeeIds); 

    // 3. Log assignment change
    await createLog(req.user.orgId, req.user.userId, 'team_employee_assignment_changed', { teamId, employeeIds: validEmployeeIds });

    // 4. Return the updated team with its members
    const updatedTeam = await Team.findByPk(teamId, {
      include: [{ model: Employee, attributes: ['id', 'first_name', 'last_name'] }]
    });

    res.status(200).json(updatedTeam);

  } catch (error) {
    console.error('Assign employees error:', error);
    res.status(500).json({ message: 'Server error managing employee assignments' });
  }
};