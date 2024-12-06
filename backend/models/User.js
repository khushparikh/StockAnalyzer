const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jwt_token : {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define the relationship with Stock model
User.associate = (models) => {
  User.hasMany(models.Stock, {
    foreignKey: 'userId',
    as: 'portfolio'
  });
};

module.exports = User;
