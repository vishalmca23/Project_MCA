import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/app';
import { createAdmin, deleteAdmin } from '../helpers/admin';

const { expect } = chai;
chai.use(chaiHttp);

describe('Admin Authentication', () => {
  const admin = {
    name: faker.name.findName(),
    gender: 'male',
    address: faker.address.streetAddress(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password(8)
  };

  before('Create Admin to database', async () => {
    const result = await createAdmin(admin);
    expect(result).to.be.a('Object');
  });

  after('Delete Admin from database', async () => {
    const result = await deleteAdmin(admin.email);
    expect(result).to.be.equal(1);
  });

  describe('Admin functionality', () => {
    it('Redirect to dashboard with status 200 if login successfully', done => {
      chai.request(app)
        .post('/login')
        .send({ username: admin.email, password: admin.password, profession: 'admin' })
        .end((err, res) => {
          expect(res).to.redirectTo(/\/admin\/dashboard$/);
          done();
        });
    });

    it('Redirect to login with status 403 if not login successfully', done => {
      chai.request(app)
        .post('/login')
        .send({ username: faker.internet.email(), password: faker.internet.password(), profession: 'admin' })
        .end((err, res) => {
          expect(res).to.have.status(403)
            .to.redirectTo(/\/login$/);
          expect(res.text).to.include('Invalid Login credentials');
          done();
        });
    });

    it('Should get doctor request page with message No pending requests', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: admin.email, password: admin.password, profession: 'admin' })
        .end((err, res) => {
          agent
            .get('/admin/doctor-request')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('No pending requests');
              agent.close();
              done();
            });
        });
    });

    it('Should get supplier request page with message No pending requests', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: admin.email, password: admin.password, profession: 'admin' })
        .end((err, res) => {
          agent
            .get('/admin/supplier-request')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('No pending requests');
              agent.close();
              done();
            });
        });
    });

    it('Should get doctor request page with message No pending requests', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: admin.email, password: admin.password, profession: 'admin' })
        .end((err, res) => {
          agent
            .get('/admin/medicine')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('Add Medicine');
              agent.close();
              done();
            });
        });
    });

    it('Should redirect to homepage with status 204 if logout successfully', done => {
      chai.request(app)
        .get('/logout')
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });
});
