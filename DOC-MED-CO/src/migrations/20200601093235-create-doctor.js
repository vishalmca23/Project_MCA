'use strict';

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Doctors', {
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
    dateOfBirth: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    gender: {
      type: Sequelize.ENUM({
        values: ['male', 'female', 'other']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    degree: {
      type: Sequelize.ENUM({
        values: ['MBBS', 'MD']
      })
    },
    startTime: {
      type: Sequelize.INTEGER
    },
    endTime: {
      type: Sequelize.INTEGER
    },
    experienceFrom: {
      type: Sequelize.DATE
    },
    appointmentFee: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.ENUM({
        values: ['registered', 'pending', 'approved']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    mobileNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: Sequelize.STRING,
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
  return queryInterface.dropTable('Doctors');
}
