'use strict';

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('PatientOrders', {
    id: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    patientId: {
      type: Sequelize.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    medicineId: {
      type: Sequelize.UUID
    },
    supplierId: {
      type: Sequelize.UUID
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: Sequelize.FLOAT
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    medicineName: {
      type: Sequelize.TEXT
    },
    status: {
      type: Sequelize.ENUM({
        values: ['pending', 'confirmed', 'delivered']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('PatientOrders');
}
