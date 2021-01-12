import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/app';
import { deletePatient } from '../helpers/patient';

const { expect } = chai;
chai.use(chaiHttp);

describe('Patient Authentication', () => {
  const patient = {
    username: faker.name.findName(),
    dateOfBirth: faker.date.past(30),
    gender: 'male',
    address: faker.address.streetAddress(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    profession: 'patient'
  };

  describe('Patient functionality', () => {
    after('Should delete patient and return 1', async () => {
      const result = await deletePatient(patient.email);
      expect(result).to.be.equal(1);
    });

    it('Should return message registered successfully with status 201 if patient register with new credentials', done => {
      chai.request(app)
        .post('/register')
        .send(patient)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.text).to.includes('registered successfully');
          done();
        });
    });

    it('Should return message Email already in use with status 400 if existing patient try to register', done => {
      chai.request(app)
        .post('/register')
        .send(patient)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('email is already in use');
          done();
        });
    });

    it('Should return message Invalid credentials with status 400 if patient register with invalid credentials', done => {
      chai.request(app)
        .post('/register')
        .send({
          username: faker.internet.email(),
          password: faker.internet.password(),
          profession: 'patient',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('Invalid Credentials');
          done();
        });
    });

    it('Redirect to login with status 403 if not login successfully', done => {
      chai.request(app)
        .post('/login')
        .send({ username: faker.internet.email(), password: faker.internet.password(), profession: 'patient' })
        .end((err, res) => {
          expect(res).to.have.status(403)
            .to.redirectTo(/\/login$/);
          expect(res.text).to.include('Invalid Login credentials');
          done();
        });
    });

    it('Should send patient personal details', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/details')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(patient.email);
              agent.close();
              done();
            });
        });
    });

    it('Should send patient dashboard page', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/dashboard')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(`Welcome ${patient.username}`);
              agent.close();
              done();
            });
        });
    });

    it('Should send patient, doctor details and appointment request page', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/appointment-request')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('Appointment Request');
              agent.close();
              done();
            });
        });
    });

    it('Should send patient appointment list', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/appointment')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('No Appointments yet');
              agent.close();
              done();
            });
        });
    });

    it('Should send page for order medicine', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/order-medicine')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('Create Order');
              agent.close();
              done();
            });
        });
    });

    it('Should send list of orders', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: patient.email, password: patient.password, profession: 'patient' })
        .end((err, res) => {
          agent
            .get('/patient/orders')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('View Orders');
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
