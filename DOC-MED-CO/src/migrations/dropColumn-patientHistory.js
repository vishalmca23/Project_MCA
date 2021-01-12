export function up(queryInterface, Sequelize) {
  return queryInterface.removeColumn('PatientHistories', 'appotmentId');
}
