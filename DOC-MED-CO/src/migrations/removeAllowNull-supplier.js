export function up(queryInterface, Sequelize) {
  return queryInterface.changeColumn('Suppliers', 'companyName', {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {
      notEmpty: true
    }
  })
    .then(() => {
      queryInterface.changeColumn('Suppliers', 'companyAddress', {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      });
    });
};
