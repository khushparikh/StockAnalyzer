const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

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
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('quantity', encrypt(value.toString()));
    },
    get() {
      const value = this.getDataValue('quantity');
      return value ? parseInt(decrypt(value)) : 0;
    }
  },
  averagePrice: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('averagePrice', encrypt(value.toString()));
    },
    get() {
      const value = this.getDataValue('averagePrice');
      return value ? parseFloat(decrypt(value)) : 0;
    }
  },
  currentPrice: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      if (value !== null) {
        this.setDataValue('currentPrice', encrypt(value.toString()));
      }
    },
    get() {
      const value = this.getDataValue('currentPrice');
      return value ? parseFloat(decrypt(value)) : null;
    }
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define the relationship with User model
Stock.associate = function(models) {
  Stock.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Stock;
