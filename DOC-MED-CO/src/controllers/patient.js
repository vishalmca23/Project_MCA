import moment from 'moment';
import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { DoctorService, PatientService, AppointmentService, SupplierService } = services;

export default class Patient {
  /**
   * Redirect to dashboard page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static redirectDashboard(req, res) {
    return renderPageWithMessage(
      req,
      res,
      200,
      templatePaths.patient.dashboard
    );
  }

  /**
   * Send list of doctors approved by admin
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendDoctorList(req, res) {
    try {
      const doctors = await DoctorService.findByStatus('approved');

      if (doctors.length > 0) {
        return renderPageWithMessage(
          req,
          res,
          200,
          templatePaths.patient.appointmentRequest,
          null,
          doctors
        );
      }
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.patient.appointmentRequest,
        'No doctor registered successfully yet'
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Create appointment and save to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async makeAppointmentRequest(req, res) {
    const appointment = req.body;
    appointment.patientId = req.user.id;
    appointment.date = moment().format('l');
    appointment.status = 'pending';

    try {
      await AppointmentService.create(appointment);
      return res.redirect('/patient/appointment');
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        500,
        templatePaths.patient.appointmentRequest,
        'Some error occurs please try again'
      );
    }
  }

  /**
   * Redirect to patient details page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async sendPersonalDetail(req, res) {
    try {
      const patient = await PatientService.findById(req.user.id);
      return renderPageWithMessage(req, res, 200, templatePaths.patient.details, null, patient);
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Send list of appointment requests of patient
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendAppointmentList(req, res) {
    try {
      const appointments = await AppointmentService.findByPatient(req.user.id);
      if (appointments.length) {
        return renderPageWithMessage(
          req,
          res,
          200,
          templatePaths.patient.appointment,
          null,
          appointments
        );
      }
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.patient.appointment,
        'No Appointments yet'
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Render make orders page
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static sendMakeOrderPage(req, res) {
    return renderPageWithMessage(
      req,
      res,
      200,
      templatePaths.patient.makeOrder,
      null,
      {
        message: null
      }
    );
  }

  /**
   * Add new order to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async createOrder(req, res) {
    const order = req.body;
    order.patientId = req.user.id;
    order.status = 'confirmed';
    order.date = moment().format('l');

    try {
      if (!req.body.supplierId) {
        const medicines = await PatientService.findMedicine(req.body.medicineName);
        const medicine = medicines[0].dataValues;
        order.medicineId = medicine.id;
        order.amount = Number(order.quantity) * medicine.pricePerTablet;
      }

      const result = await PatientService.addOrder(order);
      if (result) {
        res.status = 201;
        return res.redirect('/patient/orders');
      }
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.patient.makeOrder,
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
        templatePaths.patient.doctorInformation,
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
   * Send details of supplier
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendSupplierInformation(req, res) {
    try {
      const supplier = await SupplierService.findById(req.params.supplierId);
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.patient.supplierInformation,
        null,
        supplier
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Render order details to patient
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendOrderDetails(req, res) {
    try {
      const orders = await PatientService.findOrders(req.user.id);
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.patient.orders,
        null,
        orders
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.patient.orders,
        err.message
      );
    }
  }
}
