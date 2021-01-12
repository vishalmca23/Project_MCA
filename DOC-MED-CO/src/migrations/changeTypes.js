export function up(queryInterface, Sequelize) {
  return queryInterface.changeColumn('Doctors', 'startTime', {
    type: Sequelize.TEXT
  })
    .then(() => {
      queryInterface.changeColumn('Doctors', 'endTime', {
        type: Sequelize.TEXT
      })
    });
};
