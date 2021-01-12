import faker from 'faker';
import { expect } from 'chai';
import getUserDetails from '../../src/services/user';
import DoctorService from '../../src/services/doctor';

describe('Doctor functionalities', () => {
  const doctor = {
    username: faker.name.findName(),
    dateOfBirth: faker.date.past(30),
    gender: 'male',
    address: faker.address.streetAddress(),
    startTime: faker.random.number({ min: 8, max: 11 }),
    endTime: faker.random.number({ min: 12, max: 22 }),
    experienceFrom: faker.date.past(5),
    degree: 'MBBS',
    appointmentFee: faker.random.number(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password(8)
  };

  it('Should create doctor entry in database', async () => {
    const result = await DoctorService.add(doctor);
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
    expect(result.dataValues)
      .to.be.a('Object')
      .to.include({ email: doctor.email });
    doctor.id = result.dataValues.id;
  });

  it('Should add additional information of doctor in database', async () => {
    const result = await DoctorService.addDetails(doctor);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
  });

  it('Should return doctor type', async () => {
    const result = await getUserDetails(doctor.email);
    expect(result).to.be.a('Object')
      .to.include({ type: 'doctor' });
  });

  it('Should add specialization entry of doctor in database', async () => {
    const result = await DoctorService.addSpecialization(doctor.id, 'Heart Specialist');
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
    expect(result.dataValues)
      .to.be.a('Object')
      .to.include({ name: 'Heart Specialist' });
  });

  it('Should return doctor details if doctor email is correct', async () => {
    const result = await DoctorService.find(doctor.email);
    expect(result).to.be.a('Object')
      .to.include({ id: doctor.id })
      .to.have.property('email');
  });

  it('Should return error if doctor email is not correct', async () => {
    let result;
    try {
      result = await DoctorService.find(faker.internet.email());
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return list of all doctors with status ', async () => {
    const result = await DoctorService.findByStatus('pending');
    expect(result).to.be.a('Array');
    expect(result[0]).to.be.a('Object')
      .to.include({ id: doctor.id })
      .to.have.property('email');
  });

  it('Should return empty array if no doctors available with given status', async () => {
    const result = await DoctorService.findByStatus('approved');
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should return error if status is not given', async () => {
    let result;
    try {
      result = await DoctorService.findByStatus();
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return doctor with given doctor id ', async () => {
    const result = await DoctorService.findById(doctor.id);
    expect(result).to.be.a('Object')
      .to.include({ id: doctor.id })
      .to.have.property('email');
  });


  it('Should change doctor status to approved', async () => {
    const result = await DoctorService.approve(doctor.email);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
  });

  it('Should return true if doctor login credentials are correct', async () => {
    const result = await DoctorService.verify(doctor.email, doctor.password);
    expect(result).to.be.equal(true);
  });

  it('Should return false if doctor password is not correct', async () => {
    const result = await DoctorService.verify(doctor.email, faker.internet.password());
    expect(result).to.be.equal(false);
  });

  it('Should return error if doctor email is not correct', async () => {
    let result;
    try {
      result = await DoctorService.verify(faker.internet.email(), doctor.password);
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should delete doctor and return 1', async () => {
    const result = await DoctorService.delete(doctor.email);
    expect(result).to.be.equal(1);
  });
});
