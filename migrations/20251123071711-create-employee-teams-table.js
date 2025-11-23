// ...-create-employee-teams-table.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assigned_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
    // Add unique constraint on the pair to prevent duplicate assignments
    await queryInterface.addConstraint('employee_teams', {
      fields: ['employee_id', 'team_id'],
      type: 'unique',
      name: 'unique_employee_team_assignment'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employee_teams');
  }
};