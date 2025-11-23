module.exports = (sequelize, DataTypes) => {
  const EmployeeTeam = sequelize.define('EmployeeTeam', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    team_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'employee_teams',
    timestamps: false,
    underscored: true
  });

  return EmployeeTeam;
};
