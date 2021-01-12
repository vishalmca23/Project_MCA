export function up(queryInterface, Sequelize) {
  return queryInterface.changeColumn('DoctorAppointments', 'date', {
    type: Sequelize.DATEONLY
  })
    .then(() => {
      queryInterface.changeColumn('DoctorAppointments', 'time', {
        type: Sequelize.TEXT
      })
    });
};
