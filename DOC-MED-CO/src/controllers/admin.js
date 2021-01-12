import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { AdminService, DoctorService, SupplierService } = services;

export default class Admin {
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
      templatePaths.admin.dashboard
    );
  }

  /**
   * Redirect to doctors details page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async redirectDoctorRequest(req, res) {
    try {
      const doctors = await DoctorService.findByStatus('pending');
      console.log('========\nyes');
      return renderPageWithMessage(req, res, 200, templatePaths.admin.doctorRequest, null, doctors);
    }
    catch (err) {
      console.log('========\nno');
      return renderPageWithMessage(req, res, 404, templatePaths.admin.doctorRequest, err.message);
    }
  }

  /**
   * Approve or reject doctor based on admin decision
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async configureDoctor(req, res) {
    const doctorOperation = {
      approved: DoctorService.approve,
      rejected: DoctorService.delete
    };

    try {
      if (doctorOperation[req.body.status]) {
        await doctorOperation[req.body.status](req.body.doctorEmail);
      }
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
    return res.redirect('/admin/doctor-request');
  }

  /**
   * Redirect to supplier details page
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static async redirectSupplierRequest(req, res) {
    try {
      const suppliers = await SupplierService.findByStatus('pending');
      return renderPageWithMessage(
        req,
        res,
        200,
        templatePaths.admin.supplierRequest,
        null,
        suppliers
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        404,
        templatePaths.admin.supplierRequest,
        err.message
      );
    }
  }

  /**
   * Approve or reject supplier based on admin decision
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async configureSupplier(req, res) {
    const supplierOperation = {
      approved: SupplierService.approve,
      rejected: SupplierService.delete
    };

    try {
      if (supplierOperation[req.body.status]) {
        await supplierOperation[req.body.status](req.body.supplierEmail);
      }
      return res.redirect('/admin/supplier-request');
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }

  /**
   * Render add medicine page
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static sendAddMedicinesPage(req, res) {
    return renderPageWithMessage(
      req,
      res,
      200,
      templatePaths.admin.addMedicine
    );
  }

  /**
   * Add medicine to database
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static async addMedicine(req, res) {
    const medicine = req.body;
    medicine.name = req.body.medicineName;

    try {
      await AdminService.addNewMedicine(medicine);
      return renderPageWithMessage(
        req,
        res,
        201,
        templatePaths.admin.addMedicine,
        'Added successfully'
      );
    }
    catch (err) {
      return renderPageWithMessage(
        req,
        res,
        400,
        templatePaths.admin.addMedicine,
        'Medicine already available at store'
      );
    }
  }
}
