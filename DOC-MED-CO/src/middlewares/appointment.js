import moment from 'moment';
import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { DoctorService, AppointmentService } = services;

export default class Appointment {
  /**
   * Check types of data
   * @param {httpRequest} req
   * @param {httpResopnse} res
   * @param {Function} next
   */
  static async checkData(req, res, next) {
    try {
      if (req.body.doctorId && req.body.subject && !isNaN(req.body.time)) {
        const doctor = await DoctorService.findById(req.body.doctorId);
        if (Number(req.body.time) >= Number(doctor.startTime)
          && Number(req.body.time) <= Number(doctor.endTime)) {
          return next();
        }
        return renderPageWithMessage(
          req,
          res,
          403,
          templatePaths.patient.appointmentRequest,
          'Select appropriate time'
        );
      }
      return renderPageWithMessage(
        req,
        res,
        403,
        templatePaths.patient.appointmentRequest,
        'Request credentials are not correct'
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        403,
        templatePaths.patient.appointmentRequest,
        err.message
      );
    }
  }

  /**
   * Check appointment of doctor for given time
   * @param {httpRequest} req
   * @param {httpResopnse} res
   * @param {Function} next
   */
  static async checkDoctorAvailability(req, res, next) {
    try {
      const doctor = await DoctorService.findById(req.body.doctorId);

      if (doctor) {
        const appointment = await AppointmentService.findByTime(
          req.body.doctorId,
          moment().format('l'),
          req.body.time
        );

        if (appointment.length) {
          return renderPageWithMessage(
            req,
            res,
            400,
            templatePaths.patient.appointmentRequest,
            'Doctor already has fixed appointment at given time. Please select another timing'
          );
        }
        return next();
      }
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.patient.appointmentRequest,
        'Please select valid doctor'
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Change status of Appointment to completed
   * @param {httpRequest} req
   * @param {httpResopnse} res
   * @param {Function} next
   */
  static async completed(req, res, next) {
    try {
      await AppointmentService.changeStatus(req.body.appointmentId, 'confirmed', 'completed');
      return next();
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        403,
        templatePaths.doctor.appointment,
        err.message
      );
    }
  }
}
