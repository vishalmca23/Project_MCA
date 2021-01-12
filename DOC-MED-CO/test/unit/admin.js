import faker from 'faker';
import { expect } from 'chai';
import AdminService from '../../src/services/admin';
import { createAdmin, deleteAdmin } from '../helpers/admin';
import getUserDetails from '../../src/services/user';

describe('Admin Credentials', () => {
  const admin = {
    name: faker.name.findName(),
    gender: 'male',
    address: faker.address.streetAddress(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  before('Create Admin to database', async () => {
    const result = await createAdmin(admin);
    expect(result).to.be.a('Object');
  });

  after('Delete Admin from database', async () => {
    const result = await deleteAdmin(admin.email);
    expect(result).to.be.equal(1);
  });

  it('Should return admin details if admin email is correct', async () => {
    const result = await AdminService.find(admin.email);
    expect(result).to.be.a('Object')
      .to.include({ email: admin.email })
      .to.have.property('id');
    expect(Object.keys(result)).with.lengthOf(9);
  });

  it('Should return error if admin email is not correct', async () => {
    let result;
    try {
      result = await AdminService.find(faker.internet.email());
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return admin type', async () => {
    const result = await getUserDetails(admin.email);
    expect(result).to.be.a('Object')
      .to.include({ type: 'admin' });
  });

  it('Should return true if admin login credentials are correct', async () => {
    const result = await AdminService.verify(admin.email, admin.password);
    expect(result).to.be.equal(true);
  });

  it('Should return false if admin login credentials are not correct', async () => {
    const result = await AdminService.verify(admin.email, faker.internet.password());
    expect(result).to.be.equal(false);
  });
});

describe('Add medicines to store', () => {
  const medicine = {
    name: 'Pain Killer',
    manufacturingDate: faker.date.past(5),
    expiryDate: faker.date.future(5),
    pricePerTablet: faker.random.number({ min: 1, max: 50 }),
    quantity: faker.random.number({ min: 100, max: 1000 })
  };

  it('Should return Medicine Object if medicine added successfully', async () => {
    const result = await AdminService.addNewMedicine(medicine);
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
  });

  it('Should return error if medicine already exist', async () => {
    let result;
    try {
      result = await AdminService.addNewMedicine(medicine);
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });
});
