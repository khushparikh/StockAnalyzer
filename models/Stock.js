const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stock = sequelize.define('Stock', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
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
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  averagePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true
});

// Define the relationship with User model
Stock.associate = (models) => {
  Stock.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Stock;
