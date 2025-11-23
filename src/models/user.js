module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });
  User.associate = function(models) {
    User.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
    User.hasMany(models.Log, { foreignKey: 'user_id' });
  };
  return User;
};