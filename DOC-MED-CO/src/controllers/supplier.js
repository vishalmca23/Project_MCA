import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { PatientService, SupplierService } = services;

export default class Supplier {
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
    return renderPageWithMessage(req, res, 200, templatePaths.supplier.dashboard, null, details);
  }

  /**
   * Redirect to doctor details page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async redirectDetails(req, res) {
    try {
      const supplier = await SupplierService.find(req.user.username);
      return renderPageWithMessage(req, res, 200, templatePaths.supplier.details, null, supplier);
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Add additional information of supplier to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async addCredentials(req, res) {
    const supplier = req.body;
    supplier.email = req.user.username;
    try {
      await SupplierService.addDetails(supplier);
      req.user.status = 'pending';
      res.redirect('/supplier/details');
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.supplier.details,
        err.message
      );
    }
  }

  /**
   * Render order details to supplier
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendOrders(req, res) {
    try {
      const orders = await SupplierService.findOrders(req.user.id);
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.supplier.orders,
        null,
        orders
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.supplier.orders,
        err.message
      );
    }
  }

  /**
   * Change order status to delivered
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async orderDelivered(req, res) {
    try {
      await SupplierService.changeOrderStatus(req.params.orderId, 'delivered');
      return res.redirect('/supplier/orders');
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Send information of patient to supplier
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async sendPatientInformation(req, res) {
    try {
      const patient = await PatientService.findById(req.params.patientId);
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.supplier.patientInformation,
        null,
        patient
      );
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }
}
