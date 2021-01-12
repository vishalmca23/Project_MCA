export default (sequelize, DataTypes) => {
  const doctorAppointment = sequelize.define('DoctorAppointment', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM({
        values: ['pending', 'confirmed', 'completed']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  doctorAppointment.associate = models => {
    const { PatientHistory } = models;

    doctorAppointment.hasOne(PatientHistory, {
      foreignKey: 'appointmentId',
      sourceKey: 'id'
    });
  };
  return doctorAppointment;
};
