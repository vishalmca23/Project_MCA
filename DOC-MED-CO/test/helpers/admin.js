import { v4 } from 'uuid';
import { hashSync } from 'bcryptjs';
import db from '../../src/models';

const { Admin, sequelize } = db;

const createAdmin = admin => sequelize.authenticate()
  .then(() => Admin.sync({ force: false })
    .then(() => Admin.create({
      id: v4(),
      name: admin.name,
      gender: admin.gender,
      address: admin.address,
      mobileNumber: admin.mobileNumber,
      email: admin.email,
      password: hashSync(admin.password, 10)
    })))
  .catch(err => {
    console.error(err);
    return false;
  });

const deleteAdmin = adminEmail => sequelize.authenticate()
  .then(() => Admin.sync({ force: false })
    .then(() => Admin.destroy({
      where: {
        email: adminEmail
      }
    })))
  .catch(err => {
    console.error(err);
    return false;
  });

export {
  createAdmin,
  deleteAdmin
};
