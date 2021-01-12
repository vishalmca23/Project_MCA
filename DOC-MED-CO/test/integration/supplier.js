import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/app';
import SupplierService from '../../src/services/supplier';

const { expect } = chai;
chai.use(chaiHttp);

describe('Supplier Authentication', () => {
  const supplier = {
    username: faker.name.findName(),
    companyName: faker.company.companyName(),
    companyAddress: faker.address.streetAddress(),
    mobileNumber: faker.random.number({ min: 6000000000, max: 9999999999 }),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    profession: 'supplier'
  };

  after('Delete newly created doctor in testing', () => {
    SupplierService.delete(supplier.email)
      .then(result => {
        expect(result).to.be.equal(1);
      });
  });

  /**
   * Check Registration functionality
   */
  describe('Supplier functionality', () => {
    it('Should return message registered successfully with status 201 if supplier register with new credentials', done => {
      chai.request(app)
        .post('/register')
        .send(supplier)
        .end((err, res) => {
          expect(res.text).to.includes('registered successfully');
          done();
        });
    });

    it('Should return message user name or email already in use with status 400 if existing supplier try to register', done => {
      chai.request(app)
        .post('/register')
        .send(supplier)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('Email is already in use');
          done();
        });
    });

    it('Should return message Invalid credentials with status 400 if supplier register with invalid credentials', done => {
      chai.request(app)
        .post('/register')
        .send({
          username: faker.internet.email(),
          password: faker.internet.password(),
          profession: 'supplier',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.includes('Invalid Credentials');
          done();
        });
    });

    it('Redirect to dashboard with status 200 if login successfully', done => {
      chai.request(app)
        .post('/login')
        .send({ username: supplier.email, password: supplier.password, profession: 'supplier' })
        .end((err, res) => {
          expect(res).to.redirectTo(/\/supplier\/dashboard$/);
          done();
        });
    });

    it('Redirect to login with status 403 if not login successfully', done => {
      chai.request(app)
        .post('/login')
        .send({ username: faker.internet.email(), password: faker.internet.password(), profession: 'supplier' })
        .end((err, res) => {
          expect(res).to.have.status(403)
            .to.redirectTo(/\/login$/);
          expect(res.text).to.include('Invalid Login credentials');
          done();
        });
    });

    it('Should send supplier personal details', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: supplier.email, password: supplier.password, profession: 'supplier' })
        .end((err, res) => {
          agent
            .get('/supplier/details')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(supplier.email);
              agent.close();
              done();
            });
        });
    });

    it('Should send supplier dashboard page', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: supplier.email, password: supplier.password, profession: 'supplier' })
        .end((err, res) => {
          agent
            .get('/supplier/dashboard')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(`Welcome`);
              agent.close();
              done();
            });
        });
    });

    it('Should send list of orders', done => {
      const agent = chai.request.agent(app);
      agent
        .post('/login')
        .send({ username: supplier.email, password: supplier.password, profession: 'supplier' })
        .end((err, res) => {
          agent
            .get('/supplier/orders')
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
