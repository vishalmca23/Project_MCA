export default (sequelize, DataTypes) => {
  const patientOrder = sequelize.define('PatientOrder', {
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
    medicineId: {
      type: DataTypes.UUID
    },
    supplierId: {
      type: DataTypes.UUID
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.FLOAT
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    medicineName: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM({
        values: ['pending', 'confirmed', 'delivered']
      }),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  patientOrder.associate = models => {
    const { Patient, Medicine, Supplier } = models;

    patientOrder.belongsTo(Patient, {
      foreignKey: 'patientId',
      targetKey: 'id'
    });

    patientOrder.belongsTo(Medicine, {
      foreignKey: 'medicineId',
      targetKey: 'id'
    });

    patientOrder.belongsTo(Supplier, {
      foreignKey: 'supplierId',
      targetKey: 'id'
    });
  };
  return patientOrder;
};
