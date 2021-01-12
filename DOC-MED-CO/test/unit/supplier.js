import { expect } from 'chai';
import faker from 'faker';
import { deleteOrder } from '../helpers/patient';
import PatientService from '../../src/services/patient';
import getUserDetails from '../../src/services/user';
import SupplierService from '../../src/services/supplier';

describe('Supplier functionalities', () => {
  const supplier = {
    username: faker.name.findName(),
    companyName: faker.company.companyName(),
    companyAddress: faker.address.streetAddress(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password(8)
  };

  const order = {
    patientId: faker.random.uuid(),
    medicineName: 'Pain Killer',
    quantity: faker.random.number(100),
    date: faker.date.recent(),
    status: 'confirmed'
  };

  it('Should create supplier entry in database', async () => {
    const result = await SupplierService.add(supplier);
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
    expect(result.dataValues)
      .to.be.a('Object')
      .to.include({ email: supplier.email });
    supplier.id = result.dataValues.id;
    order.supplierId = supplier.id;
  });

  it('Should add additional information of supplier in database', async () => {
    const result = await SupplierService.addDetails(supplier);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
  });

  it('Should return supplier type', async () => {
    const result = await getUserDetails(supplier.email);
    expect(result).to.be.a('Object')
      .to.include({ type: 'supplier' });
  });

  it('Should return supplier details if supplier email is correct', async () => {
    const result = await SupplierService.find(supplier.email);
    expect(result).to.be.a('Object')
      .to.include({ id: supplier.id })
      .to.have.property('email');
  });

  it('Should return error if supplier email is not correct', async () => {
    let result;
    try {
      result = await SupplierService.find(faker.internet.email());
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return list of all suppliers with status ', async () => {
    const result = await SupplierService.findByStatus('pending');
    expect(result).to.be.a('Array');
    expect(result[0]).to.be.a('Object')
      .to.include({ id: supplier.id })
      .to.have.property('email');
  });

  it('Should return empty array if no suppliers available with given status', async () => {
    const result = await SupplierService.findByStatus('approved');
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should change supplier status to approved', async () => {
    const result = await SupplierService.approve(supplier.email);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
  });

  it('Should return true if supplier login credentials are correct', async () => {
    const result = await SupplierService.verify(supplier.email, supplier.password);
    expect(result).to.be.equal(true);
  });

  it('Should return false if supplier password is not correct', async () => {
    const result = await SupplierService.verify(supplier.email, faker.internet.password(8));
    expect(result).to.be.equal(false);
  });

  it('Should return error if supplier email is not correct', async () => {
    let result;
    try {
      result = await SupplierService.verify(faker.internet.email(), supplier.password);
    }
    catch (err) {
      result = err;
    }
    expect(result).to.be.a('Error');
  });

  it('Should return list of all suppliers with status ', async () => {
    const result = await SupplierService.getList();
    expect(result).to.be.a('Array');
    expect(result[0]).to.be.a('Object')
      .to.include({ id: supplier.id })
      .to.have.property('email');
  });

  it('Should create order entry in database', async () => {
    const result = await PatientService.addOrder(order);
    expect(result).to.be.a('Object')
      .to.have.property('dataValues');
    expect(result.dataValues).to.be.a('Object');
    order.id = result.dataValues.id;
  });

  it('Should change order status to delivered', async () => {
    const result = await SupplierService.changeOrderStatus(order.id, 'confirmed');
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
  });

  it('Should return list of orders for supplier', async () => {
    const result = await SupplierService.findOrders(supplier.id);
    expect(result).to.be.a('Array')
      .to.be.lengthOf(1);
    expect(result[0])
      .to.be.a('Object')
      .to.include({ medicineName: order.medicineName });
  });

  it('Should return empty list if supplier has no orders', async () => {
    const result = await SupplierService.findOrders(faker.random.uuid());
    expect(result).to.be.a('Array')
      .to.be.lengthOf(0);
  });

  it('Should delete order added while testing', async () => {
    const result = await deleteOrder(order.patientId);
    expect(result).to.be.equal(1);
  });

  after('Should delete supplier and return 1', async () => {
    const result = await SupplierService.delete(supplier.email);
    expect(result).to.be.equal(1);
  });
});
