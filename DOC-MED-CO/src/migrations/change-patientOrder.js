export function up(queryInterface, Sequelize) {
  return queryInterface.changeColumn('PatientOrders', 'medicineId', {
    type: Sequelize.UUID,
    allowNull: true,
    validate: {
      notEmpty: true
    }
  })
    .then(() => {
      queryInterface.changeColumn('PatientOrders', 'supplierId', {
        type: Sequelize.UUID,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      });
    })
    .then(() => {
      queryInterface.changeColumn('PatientOrders', 'amount', {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      });
    })
    .then(() => {
      queryInterface.addColumn('PatientOrders', 'medicineName', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    });
}
