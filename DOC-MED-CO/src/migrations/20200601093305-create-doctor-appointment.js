'use strict';

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('DoctorAppointments', {
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
    doctorId: {
      type: Sequelize.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    time: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: Sequelize.ENUM({
        values: ['pending', 'confirmed', 'completed']
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
  return queryInterface.dropTable('DoctorAppointments');
}
