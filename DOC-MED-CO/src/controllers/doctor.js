import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { DoctorService, PatientService, AppointmentService } = services;

export default class Doctor {
  /**
   * Redirect to dashboard page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static redirectDashboard(req, res) {
    const details = {
      name: req.user.username,
      status: req.user.status
    };
    return renderPageWithMessage(req, res, 200, templatePaths.doctor.dashboard, null, details);
  }

  /**
   * Redirect to doctor details page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async redirectDetails(req, res) {
    try {
      const doctor = await DoctorService.findById(req.user.id);
      const details = doctor;
      if (doctor.specialization) {
        details.specialization = doctor.specialization.name;
      }
      return renderPageWithMessage(req, res, 200, templatePaths.doctor.details, null, details);
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Add additional information of doctor to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async addCredentials(req, res) {
    const doctor = req.body;
    doctor.email = req.user.username;
    doctor.experienceFrom = new Date(req.body.experienceFrom).getTime();
    try {
      await DoctorService.addDetails(doctor);
      await DoctorService.addSpecialization(
        req.user.id,
        req.body.specialization
      );
      req.user.status = 'pending';
      return res.redirect('/doctor/details');
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.doctor.details,
        err.message
      );
    }
  }

  /**
   * Send list of pending appointment requests to doctor
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendAppointmentRequestList(req, res) {
    try {
      const appointments = await AppointmentService.findByDoctor(req.user.id, 'pending');

      if (appointments.length) {
        return renderPageWithMessage(
          req,
          res,
          200,
          templatePaths.doctor.appointmentRequest,
          null,
          appointments
        );
      }
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.doctor.appointmentRequest,
        'No Appointments yet'
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Approve or reject appointment based on doctor decision
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async configureAppointmentRequest(req, res) {
    const appointmentOperation = {
      approved: AppointmentService.changeStatus,
      rejected: AppointmentService.delete
    };

    try {
      if (appointmentOperation[req.body.status]) {
        await appointmentOperation[req.body.status](
          req.body.appointmentId,
          'pending',
          'confirmed'
        );
      }
      return res.redirect('/doctor/appointment-request');
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Send list of confirmed appointments to doctor
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendAppointmentList(req, res) {
    try {
      const appointments = await AppointmentService.findByDoctor(
        req.user.id,
        'confirmed'
      );

      if (appointments.length) {
        return renderPageWithMessage(
          req,
          res,
          200,
          templatePaths.doctor.appointment,
          null,
          appointments
        );
      }
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.doctor.appointment,
        'No Appointments yet'
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Send information of patient to doctor
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendPatientInformation(req, res) {
    try {
      const patient = await PatientService.findById(req.params.patientId);
      const patientInformation = await AppointmentService.findWithPatientHistory(
        req.params.patientId
      );

      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.doctor.patientInformation,
        null,
        {
          patient,
          patientInformation
        }
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.doctor.patientInformation,
        err.message
      );
    }
  }

  /**
   * Send details of doctor
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendDoctorInformation(req, res) {
    try {
      const doctor = await DoctorService.findById(req.params.doctorId);
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.doctor.doctorInformation,
        null,
        doctor
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Save report of patient to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async saveReport(req, res) {
    try {
      await PatientService.saveReport(req.body);
      return res.redirect('/doctor/appointment');
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        500,
        templatePaths.doctor.appointment,
        err.message
      );
    }
  }
}
