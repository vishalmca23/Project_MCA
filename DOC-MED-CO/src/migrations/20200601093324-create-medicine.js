'use strict';

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Medicines', {
    id: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    manufacturingDate: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    pricePerTablet: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Medicines');
}
