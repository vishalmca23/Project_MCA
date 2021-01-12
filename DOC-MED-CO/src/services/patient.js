import { hashSync, compareSync } from 'bcryptjs';
import { v4 } from 'uuid';
import db from '../models';

const { Patient, PatientHistory, Medicine, PatientOrder } = db;

export default class PatientService {
  /**
   * create new user in database
   * @param {Object} patient - containing username, email and password
   */
  static add(patient) {
    return Patient.create({
      id: v4(),
      name: patient.username,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      mobileNumber: patient.mobileNumber,
      email: patient.email,
      password: hashSync(patient.password, 10)
    })
      .catch(err => {
        throw new Error(`Unable to register patient due to ${err.message}`);
      });
  }

  /**
   * Find patient with given emailId in database
   * @param {String} email
   */
  static find(email) {
    return Patient.findAll({
      where: { email }
    })
      .then(patient => patient[0].dataValues)
      .catch(() => {
        throw new Error('User not exist');
      });
  }

  /**
   * Checks patient with given emailId and password is valid or not
   * @param {String} email
   * @param {String} password
   */
  static verify(email, password) {
    return this.find(email)
      .then(patient => {
        if (patient) {
          return compareSync(password, patient.password);
        }
        throw new Error('Incorrect password');
      });
  }

  /**
   * Find patient with given id in database
   * @param {UUID} id
   */
  static findById(id) {
    return Patient.findAll({
      where: { id }
    })
      .then(patient => patient[0].dataValues)
      .catch(() => {
        throw new Error('User not found');
      });
  }

  /**
   * Save patient report to patientHistory table
   * @param {Object} report
   */
  static saveReport(report) {
    report.id = v4();
    return PatientHistory.create(report)
      .catch(err => {
        throw new Error(`Can't save patient report due to ${err.message}`);
      });
  }

  /**
   * Find medicine from database
   * @param {Object} medicine
   */
  static findMedicine(name) {
    return Medicine.findAll({
      where: {
        name
      }
    })
      .catch(() => {
        throw new Error('Not available at store');
      });
  }

  /**
   * Add new order to database
   * @param {Object} order
   */
  static addOrder(order) {
    order.id = v4();
    return PatientOrder.create(order)
      .catch(err => {
        throw new Error(`Order is not created due to ${err.message}`);
      });
  }

  /**
   * Find orders from database of patient
   * @param {Object} medicine
   */
  static findOrders(patientId) {
    return PatientOrder.findAll({
      where: { patientId }
    })
      .catch(() => {
        throw new Error('No orders');
      });
  }
}
