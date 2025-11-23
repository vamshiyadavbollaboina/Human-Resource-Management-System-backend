// module.exports = (sequelize, DataTypes) => {
//   const Team = sequelize.define('Team', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     organisation_id: { type: DataTypes.INTEGER, allowNull: false },
//     name: { type: DataTypes.STRING, allowNull: false },
//     description: DataTypes.TEXT
//   }, {
//     tableName: 'teams',
//     timestamps: true,
//     underscored: true
//   });
//   Team.associate = function(models) {
//     Team.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
//     // Many-to-Many relationship with Employee
//     Team.belongsToMany(models.Employee, {
//       through: 'employee_teams',
//       foreignKey: 'team_id',
//       otherKey: 'employee_id'
//     });
//   };
//   return Team;
// };

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT
  }, {
    tableName: 'teams',
    timestamps: true,
    underscored: true
  });

  Team.associate = function(models) {
    Team.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
    Team.belongsToMany(models.Employee, {
      through: models.EmployeeTeam,
      foreignKey: 'team_id',
      otherKey: 'employee_id',
      timestamps: false   // <-- fix
    });
  };

  return Team;
};

