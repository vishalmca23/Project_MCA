import { v4 } from 'uuid';
import db from '../models';

const { DoctorAppointment, PatientHistory } = db;

export default class AppointmentService {
  /**
   * create new appointment in database
   * @param {Object} appointment
   */
  static create(appointment) {
    appointment.id = v4();
    appointment.status = appointment.status || null;
    return DoctorAppointment.create(appointment)
      .catch(err => {
        throw new Error(`Appointment not created due to ${err.message}`);
      });
  }

  /**
   * Find appointment of doctor with time
   * @param {UUID} doctorId
   * @param {Date} date
   * @param {Number} time
   */
  static findByTime(doctorId, date, time) {
    return DoctorAppointment.findAll({
      where: {
        doctorId,
        date,
        time,
        status: 'confirmed'
      }
    })
      .catch(() => {
        throw new Error('No confirmed Appointment');
      });
  }

  /**
   * Find appointment with given patientId in database
   * @param {UUID} patientId
   */
  static findByPatient(patientId) {
    return DoctorAppointment.findAll({
      where: { patientId }
    })
      .then(appointments => {
        const result = [];
        appointments.forEach(appointment => {
          result.push(appointment.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error('No Appointments');
      });
  }

  /**
   * Find appointment with given doctorId and status in database
   * @param {UUID} doctorId
   * @param {String} status
   */
  static findByDoctor(doctorId, status) {
    return DoctorAppointment.findAll({
      where: {
        doctorId,
        status
      }
    })
      .then(appointments => {
        const result = [];
        appointments.forEach(appointment => {
          result.push(appointment.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error('No Appointments');
      });
  }

  /**
   * Change appointment status in database
   * @param {UUID} id
   * @param {String} statusFrom
   * @param {String} statusTo
   */
  static changeStatus(id, statusFrom, statusTo) {
    return DoctorAppointment.update({
      status: statusTo
    },
      {
        where: {
          id,
          status: statusFrom
        }
      })
      .catch(err => {
        throw new Error(`Can't change Appointment status due to ${err.message}`);
      });
  }

  /**
   * Delete appointment from database
   * @param {UUID} id
   */
  static delete(id) {
    return DoctorAppointment.destroy({
      where: { id }
    })
      .catch(err => {
        throw new Error(`Can't delete Appointment due to ${err.message}`);
      });
  }

  /**
   * Find appointment with patient history
   * @param {UUID} patientId
   */
  static findWithPatientHistory(patientId) {
    return DoctorAppointment.findAll({
      where: {
        patientId,
        status: 'completed'
      },
      include: [{
        model: PatientHistory
      }]
    })
      .then(appointments => {
        const result = [];
        appointments.forEach(appointment => {
          result.push(appointment.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error('Patient has no history');
      });
  }
}
