import { hashSync, compareSync } from 'bcryptjs';
import { v4 } from 'uuid';
import db from '../models';

const { Doctor, Specialization } = db;

export default class DoctorService {
  /**
   * create new user in database
   * @param {Object} doctor - containing username, email and password
   */
  static add(doctor) {
    return Doctor.create({
      id: v4(),
      name: doctor.username,
      dateOfBirth: doctor.dateOfBirth,
      gender: doctor.gender,
      status: 'pending',
      address: doctor.address,
      mobileNumber: doctor.mobileNumber,
      email: doctor.email,
      password: hashSync(doctor.password, 10),
      registrationNumber: doctor.registrationNumber,
      yearOfRegistration: doctor.yearOfRegistration,
      stateMedicalCouncil: doctor.stateMedicalCouncil,
      startTime: doctor.startTime,
      endTime: doctor.endTime,
      degree: doctor.degree,
      appointmentFee: doctor.appointmentFee,
      experienceFrom: doctor.experienceFrom
    })
      .catch(err => {
        throw new Error(
          `Unable to register doctor due to ${err.message}, Email is already in use`
        );
      });
  }

  /**
   * Find doctor with given emailId in database
   * @param {String} email
   */
  static find(email) {
    return Doctor.findAll({
      where: {
        email
      },
      include: [{
        model: Specialization
      }]
    })
      .then(doctor => doctor[0].dataValues)
      .catch(() => {
        throw new Error('User not exist');
      });
  }

  /**
   * Checks doctor with given emailId and password is valid or not
   * @param {String} email
   * @param {String} password
   */
  static verify(email, password) {
    return this.find(email)
      .then(doctor => {
        if (doctor) {
          return compareSync(password, doctor.password);
        }
        throw new Error('Incorrect password');
      });
  }

  /**
   * Add additional information of doctor to database
   * @param {Object} doctor
   */
  static addDetails(doctor) {
    const { degree, startTime, endTime, experienceFrom, appointmentFee } = doctor;
    const status = 'pending';
    return Doctor.update({
      degree,
      startTime,
      endTime,
      experienceFrom,
      appointmentFee,
      status
    },
      {
        where: {
          email: doctor.email
        }
      })
      .catch(err => {
        throw new Error(`Can't add details of ${doctor.email} due to ${err.message}`);
      });
  }

  /**
   * Find doctor with given status
   * @param {String} email
   */
  static findByStatus(status) {
    return Doctor.findAll({
      where: { status },
      include: [{
        model: Specialization
      }]
    })
      .then(doctors => {
        const result = [];
        doctors.forEach(doctor => {
          doctor.dataValues.password = 'Hidden';
          result.push(doctor.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error(`No doctor found with status: ${status}`);
      });
  }

  /**
   * Change status from pending to approved for doctor
   * @param {String} email
   */
  static approve(email) {
    return Doctor.update({
      status: 'approved'
    },
      {
        where: { email }
      })
      .catch(err => {
        throw new Error(`Can't update doctor status due to ${err.message}`);
      });
  }

  /**
   * Delete doctor from database
   * @param {String} email
   */
  static delete(email) {
    return Doctor.destroy({
      where: { email }
    })
      .catch(err => {
        throw new Error(`Can't delete doctor due to ${err.message}`);
      });
  }

  /**
   * Find doctor with given id in database
   * @param {UUID} id
   */
  static findById(id) {
    return Doctor.findAll({
      where: { id },
      include: [{
        model: Specialization
      }]
    })
      .then(doctor => {
        doctor[0].dataValues.password = 'Hidden';
        if (doctor[0].Specializations.length) {
          doctor[0].dataValues.specialization = doctor[0].Specializations[0].dataValues;
        }
        return doctor[0].dataValues;
      })
      .catch(() => {
        throw new Error('Doctor not found');
      });
  }

  /**
   * Add doctor's specialization
   * @param {UUID} doctorId
   * @param {STrin} specialization
   */
  static addSpecialization(doctorId, specialization) {
    return Specialization.create({
      id: v4(),
      doctorId,
      name: specialization
    })
      .catch(err => {
        throw new Error(`Can't add doctor's specialization due to ${err.message}`);
      });
  }
}
