// module.exports = (sequelize, DataTypes) => {
//   const Employee = sequelize.define('Employee', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     organisation_id: { type: DataTypes.INTEGER, allowNull: false },
//     first_name: DataTypes.STRING(100),
//     last_name: DataTypes.STRING(100),
//     email: DataTypes.STRING(255),
//     phone: DataTypes.STRING(50)
//   }, {
//     tableName: 'employees',
//     timestamps: true,
//     underscored: true
//   });
//   Employee.associate = function(models) {
//     Employee.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
//     // Many-to-Many relationship with Team
//     Employee.belongsToMany(models.Team, {
//       through: 'employee_teams',
//       foreignKey: 'employee_id',
//       otherKey: 'team_id'
//     });
//   };
//   return Employee;
// };

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    email: DataTypes.STRING(255),
    phone: DataTypes.STRING(50)
  }, {
    tableName: 'employees',
    // timestamps: true,
    underscored: true,
     timestamps: false,
  });

  Employee.associate = function(models) {
    Employee.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
    Employee.belongsToMany(models.Team, {
      through: 'employee_teams',
      foreignKey: 'employee_id',
      otherKey: 'team_id',
      timestamps: false   // <-- fix
    });
  };

  return Employee;
};
