module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define('Organisation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'organisations',
    timestamps: true,
    underscored: true
  });
  Organisation.associate = function(models) {
    Organisation.hasMany(models.User, { foreignKey: 'organisation_id' });
    Organisation.hasMany(models.Employee, { foreignKey: 'organisation_id' });
    Organisation.hasMany(models.Team, { foreignKey: 'organisation_id' });
    Organisation.hasMany(models.Log, { foreignKey: 'organisation_id' });
  };
  return Organisation;
};