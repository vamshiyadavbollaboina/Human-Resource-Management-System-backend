module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false },
    meta: { type: DataTypes.JSONB }
  }, {
    tableName: 'logs',
    timestamps: false, // Use the 'timestamp' column defined in migration
    underscored: true
  });
  Log.associate = function(models) {
    Log.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
    Log.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Log;
};