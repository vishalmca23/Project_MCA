import { hashSync, compareSync } from 'bcryptjs';
import { v4 } from 'uuid';
import db from '../models';

const { Supplier, PatientOrder } = db;

export default class SupplierService {
  /**
   * create new user in database
   * @param {Object} supplier - containing username, email and password
   */
  static add(supplier) {
    return Supplier.create({
      id: v4(),
      name: supplier.username,
      mobileNumber: supplier.mobileNumber,
      email: supplier.email,
      password: hashSync(supplier.password, 10),
      status: 'registered'
    })
      .catch(err => {
        throw new Error(
          `Unable to register supplier due to ${err.message} Email is already in use`
        );
      });
  }

  /**
   * Find supplier with given emailId in database
   * @param {String} email
   */
  static find(email) {
    return Supplier.findAll({
      where: { email }
    })
      .then(supplier => supplier[0].dataValues)
      .catch(() => {
        throw new Error('User not exist');
      });
  }

  /**
    * Find supplier with given id in database
    * @param {String} id
    */
  static findById(id) {
    return Supplier.findAll({
      where: { id }
    })
      .then(supplier => {
        supplier[0].dataValues.password = 'Hidden';
        return supplier[0].dataValues
      })
      .catch(() => {
        throw new Error('Supplier not exist');
      });
  }
  /**
   * Checks supplier with given emailId and password is valid or not
   * @param {String} email
   * @param {String} password
   */
  static verify(email, password) {
    return this.find(email)
      .then(supplier => {
        if (supplier) {
          return compareSync(password, supplier.password);
        }
        throw new Error('Incorrect password');
      });
  }

  /**
   * Add additional details of supplier to database
   * @param {Object} supplier
   */
  static addDetails(supplier) {
    const { companyName, companyAddress } = supplier;
    const status = 'pending';
    return Supplier.update({
      companyName,
      companyAddress,
      status
    },
      {
        where: {
          email: supplier.email
        }
      })
      .catch(err => {
        throw new Error(`Can't add details of ${supplier.email} due to ${err.message}`);
      });
  }

  /**
   * Find supplier with given status
   * @param {String} email
   */
  static findByStatus(status) {
    return Supplier.findAll({
      where: { status }
    })
      .then(suppliers => {
        const result = [];
        suppliers.forEach(supplier => {
          supplier.dataValues.password = 'Hidden';
          result.push(supplier.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error(`No supplier found with status: ${status}`);
      });
  }

  /**
   * Change status from pending to approved for supplier
   * @param {String} email
   */
  static approve(email) {
    return Supplier.update({
      status: 'approved'
    },
      {
        where: { email }
      })
      .catch(err => {
        throw new Error(`Can't update supplier status due to ${err.message}`);
      });
  }

  /**
   * Delete supplier from database
   * @param {String} email
   */
  static delete(email) {
    return Supplier.destroy({
      where: { email }
    })
      .catch(err => {
        throw new Error(`Can't delete supplier due to ${err.message}`);
      });
  }

  /**
   * Get list of suppliers
   */
  static getList() {
    return Supplier.findAll({
      where: {
        status: 'approved'
      }
    })
      .then(suppliers => {
        const result = [];
        suppliers.forEach(supplier => {
          supplier.dataValues.password = 'Hidden';
          result.push(supplier.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error('No supplier available wait for some time and Try again');
      });
  }

  /**
   * Find orders from database of supplier
   * @param {Object} supplierId
   */
  static findOrders(supplierId) {
    return PatientOrder.findAll({
      where: {
        supplierId,
        status: 'confirmed'
      }
    })
      .then(orders => {
        const result = [];
        orders.forEach(order => {
          result.push(order.dataValues);
        });
        return result;
      })
      .catch(() => {
        throw new Error('No orders yet');
      });
  }

  /**
   * Change order status to given status
   * @param {Object} orderId
   * @param {String} status
   */
  static changeOrderStatus(orderId, status) {
    return PatientOrder.update({ status },
      {
        where: {
          id: orderId
        }
      })
      .catch(err => {
        throw new Error(`Can't update order status due to ${err.message}`);
      });
  }
}
