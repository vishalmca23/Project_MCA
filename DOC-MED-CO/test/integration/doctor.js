import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/app';
import DoctorService from '../../src/services/doctor';

const { expect } = chai;
chai.use(chaiHttp);

/**
 * Check server is started or not
 */
describe('Check Server Connectivity', () => {
  it('Should send homepage ', done => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('<center><i>Doctor Medical Collaboration</i></center>');
        done();
      });
  });

  it('Should send registration page ', done => {
    chai.request(app)
      .get('/register')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('Registration');
        done();
      });
  });
});

describe('Doctor Authentication', () => {
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
    password: faker.internet.password(8),
    profession: 'doctor'
  };

  after('Delete newly created doctor in testing', () => {
    DoctorService.delete(doctor.email)
      .then(result => {
        expect(result).to.be.equal(1);
      });
  });

  /**
   * Check Registration functionality
   */
  describe('Adding a new doctor', () => {
    it('Should return message registered successfully with status 201 if doctor register with new credentials', done => {
      chai.request(app)
        .post('/register')
        .send(doctor)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.text).to.includes('registered successfully');
          done();
        });
    });

    it('Should return message Email already in use with status 400 if existing doctor try to register', done => {
      chai.request(app)
        .post('/register')
        .send(doctor)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('Email is already in use');
          done();
        });
    });

    it('Should return message Invalid credentials with status 400 if doctor register with invalid credentials', done => {
      chai.request(app)
        .post('/register')
        .send({
          username: faker.internet.email(),
          password: faker.internet.password(),
          profession: 'doctor',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('Invalid Credentials');
          done();
        });
    });

    /**
     * Check Login functionality
     */
    describe('Verify Doctor', () => {
      it('Redirect to dashboard with status 200 if login successfully', done => {
        chai.request(app)
          .post('/login')
          .send({ username: doctor.email, password: doctor.password, profession: 'doctor' })
          .end((err, res) => {
            expect(res).to.have.status(200)
              .to.redirectTo(/\/doctor\/dashboard$/);
            done();
          });
      });

      it('Redirect to login with status 403 if not login successfully', done => {
        chai.request(app)
          .post('/login')
          .send({ username: faker.internet.email(), password: faker.internet.password(), profession: 'doctor' })
          .end((err, res) => {
            expect(res).to.have.status(403)
              .to.redirectTo(/\/login$/);
            expect(res.text).to.include('Invalid Login credentials');
            done();
          });
      });
    });

    it('Should get empty list of appointment request with message No Appoinments', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: doctor.email, password: doctor.password, profession: 'doctor' })
        .end((err, res) => {
          agent
            .get('/doctor/appointment-request')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('No Appointments');
              agent.close();
              done();
            });
        });
    });

    it('Should get empty list of appointment if doctor has no appointment', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: doctor.email, password: doctor.password, profession: 'doctor' })
        .end((err, res) => {
          agent
            .get('/doctor/appointment')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include('No Appointments');
              agent.close();
              done();
            });
        });
    });

    it('Should get personal details of doctor', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: doctor.email, password: doctor.password, profession: 'doctor' })
        .end((err, res) => {
          agent
            .get('/doctor/details')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(doctor.email);
              agent.close();
              done();
            });
        });
    });
  });

  /**
   * Check Logout functionality
   */
  describe('Logout doctor', () => {
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

/**
 * Checking error status
 */
describe('Check Error status', () => {
  it('Should send 404 error if url is invalid', () => {
    chai.request(app)
      .get('/singup')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.be.equal('Resource not found');
      });
  });

  it('Should send 405 error if method is invalid', () => {
    chai.request(app)
      .put('/')
      .end((err, res) => {
        expect(res).to.have.status(405);
        expect(res.text).to.be.equal('Method not allowed');
      });
  });
});
