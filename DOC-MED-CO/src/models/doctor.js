export default (sequelize, DataTypes) => {
  const doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    gender: {
      type: DataTypes.ENUM({
        values: ['male', 'female', 'other']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    degree: {
      type: DataTypes.ENUM({
        values: ['MBBS', 'MD', 'BDS', 'BAMS', 'BHMS', 'BYNS']
      })
    },
    startTime: {
      type: DataTypes.TIME
    },
    endTime: {
      type: DataTypes.TIME
    },
    experienceFrom: {
      type: DataTypes.DATE
    },
    appointmentFee: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM({
        values: ['registered', 'pending', 'approved']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  doctor.associate = models => {
    const { DoctorAppointment, Specialization } = models;

    doctor.hasMany(DoctorAppointment, {
      foreignKey: 'doctorId',
      sourceKey: 'id'
    });

    doctor.hasMany(Specialization, {
      foreignKey: 'doctorId',
      sourceKey: 'id'
    });
  };
  return doctor;
};
