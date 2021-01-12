import faker from 'faker';
import { expect } from 'chai';
import AppointmentService from '../../src/services/appointment';

describe('Appointment functionality', () => {
  const appointment = {
    patientId: faker.random.uuid(),
    doctorId: faker.random.uuid(),
    subject: faker.random.word(),
    description: faker.random.words(),
    date: faker.date.recent(),
    status: 'pending',
    time: faker.random.number({ min: 11, max: 22 })
  };

  it('Should create appointment and return sequelize appointment object', async () => {
    const result = await AppointmentService.create(appointment);
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
    expect(result.dataValues)
      .to.be.a('Object')
      .to.include({ patientId: appointment.patientId });
    appointment.id = result.dataValues.id;
  });

  it('Should return error if patientId is not given', async () => {
    const appointmentData = { appointment };
    appointmentData.patientId = null;
    let result;
    try {
      result = await AppointmentService.create(appointmentData);
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should change appointment status to confirmed', async () => {
    const result = await AppointmentService.changeStatus(appointment.id, 'pending', 'confirmed');
    expect(result).to.be.a('Array');
  });

  it('Should return empty array if previous status is not valid', async () => {
    const result = await AppointmentService.changeStatus(appointment.id, 'pending', 'confirmed');
    expect(result).to.be.a('Array');
  });

  it('Should return error if status is not valid or not in enum', async () => {
    const appointmentData = { appointment };
    appointmentData.patientId = null;
    let result;
    try {
      result = await AppointmentService.changeStatus(appointment.id, 'confirmed', 'done');
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return appointment object if time is correct', async () => {
    const result = await AppointmentService.findByTime(
      appointment.doctorId,
      appointment.date,
      appointment.time
    );

    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
    expect(result[0]).to.be.a('Object')
      .to.include({ id: appointment.id });
  });

  it('Should return empty Array if no appointment at that time', async () => {
    const result = await AppointmentService.findByTime(appointment.doctorId, appointment.date, 9);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should return error if patientId is not given', async () => {
    let result;
    try {
      result = await AppointmentService.findByTime();
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return list of appointments of patient', async () => {
    const result = await AppointmentService.findByPatient(appointment.patientId);
    expect(result).to.be.a('Array');
    expect(result[0]).to.include({ id: appointment.id });
  });

  it('Should return empty array if patient has no appointments', async () => {
    const result = await AppointmentService.findByPatient(faker.random.uuid());
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should return error if patientId is not given', async () => {
    const appointmentData = { appointment };
    appointmentData.patientId = null;
    let result;
    try {
      result = await AppointmentService.findByPatient(appointmentData);
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return empty array if patient has no history is not given', async () => {
    const result = await AppointmentService.findWithPatientHistory(appointment.patientId);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should return list of appointments of doctor', async () => {
    const result = await AppointmentService.findByDoctor(appointment.doctorId, 'confirmed');
    expect(result).to.be.a('Array');
    expect(result[0]).to.include({ id: appointment.id });
  });

  it('Should return error if doctor has no appointments', async () => {
    let result;
    try {
      result = await AppointmentService.findByDoctor(faker.random.uuid(), 'approved');
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should delete appointment and return 1', async () => {
    const result = await AppointmentService.delete(appointment.id);
    expect(result).to.be.equal(1);
  });

  it('Should delete appointment and return 1', async () => {
    let result;
    try {
      result = await AppointmentService.delete();
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });
});
