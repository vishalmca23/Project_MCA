import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { DoctorService, PatientService, SupplierService } = services;

export default class Register {
  /**
   * Register new doctor to database
   * @param {httpRequest} req
   * @param {httResponse} res
  */
  static async doctor(req, res) {
    const doctor = req.body;
    doctor.dateOfBirth = new Date(req.body.dateOfBirth).getTime();
    try {
      await DoctorService.add(doctor);
      return renderPageWithMessage(
        req,
        res,
        201,
        templatePaths.user.homepage,
        `${doctor.username} registered successfully. Login to continue`
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.user.register,
        err.message
      );
    }
  }

  /**
   * Register new user to database
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async patient(req, res) {
    const patient = req.body;
    patient.dateOfBirth = new Date(req.body.dateOfBirth).getTime();
    try {
      await PatientService.add(patient);
      return renderPageWithMessage(
        req,
        res,
        201,
        templatePaths.user.homepage,
        `${patient.username} registered successfully. Login to continue`
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.user.register,
        'Username or email is already in use'
      );
    }
  }

  /**
   * Register new user to database
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async supplier(req, res) {
    const supplier = req.body;
    try {
      await SupplierService.add(supplier);
      return renderPageWithMessage(
        req,
        res,
        201,
        templatePaths.user.homepage,
        `${supplier.username} registered successfully. Login to continue`
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.user.register,
        err.message
      );
    }
  }
}
