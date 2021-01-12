import db from '../../src/models';

const { Patient, Medicine, PatientOrder, sequelize } = db;

const deleteMedicine = medicineName => sequelize.authenticate()
  .then(() => Medicine.sync({ force: false })
    .then(() => Medicine.destroy({
      where: {
        name: medicineName
      }
    })))
  .catch(console.error);

const deletePatient = patientEmail => sequelize.authenticate()
  .then(() => Patient.sync({ force: false })
    .then(() => Patient.destroy({
      where: {
        email: patientEmail
      }
    })))
  .catch(err => {
    console.error(err);
    return false;
  });

const deleteOrder = patientId => sequelize.authenticate()
  .then(() => PatientOrder.sync({ force: false })
    .then(() => PatientOrder.destroy({
      where: {
        patientId: patientId
      }
    })))
  .catch(err => {
    console.error(err);
    return false;
  });

export {
  deleteMedicine,
  deleteOrder,
  deletePatient
};
