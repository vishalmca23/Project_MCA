import { templatePaths } from 'config';
import services from '../services';
import renderPageWithMessage from '../helpers/responseRenderer';

const { PatientService, SupplierService } = services;

/**
 * Checks medicine availability at store
 * @param {httpRequest} req
 * @param {httpResponse} res
 * @param {callback function} next
 */
const checkMedicineAvailabilty = async (req, res, next) => {
  try {
    const medicine = await PatientService.findMedicine(req.body.medicineName, req.body.quantity);

    if (medicine.length || req.body.supplierId) {
      return next();
    }
    const suppliers = await SupplierService.getList();
    return renderPageWithMessage(
      req,
      res,
      200,
      templatePaths.patient.makeOrder,
      'Not available at store',
      {
        medicine: req.body,
        suppliers
      }
    );
  }
  catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export default checkMedicineAvailabilty;
