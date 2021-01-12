export default (sequelize, DataTypes) => {
  const patientHistory = sequelize.define('PatientHistory', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    appointmentId: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    disease: {
      type: DataTypes.STRING
    },
    remark: {
      type: DataTypes.STRING
    },
    patientReport: {
      type: DataTypes.STRING
    }
  });

  return patientHistory;
};
