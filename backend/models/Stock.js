const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Stock = sequelize.define('Stock', {
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    set(value) {
      this.setDataValue('symbol', value.toUpperCase());
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  purchasePrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  }
}, {
  timestamps: true
});

// Associate Stock with User
Stock.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Stock, { foreignKey: 'userId' });

module.exports = Stock;