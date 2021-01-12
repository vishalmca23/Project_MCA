import { Router } from 'express';
import user from './user';
import admin from './admin';
import doctor from './doctor';
import patient from './patient';
import supplier from './supplier';
import middlewares from '../middlewares';

const { LoggedIn } = middlewares;
const router = Router();

// Routes for admin
router.use('/admin', LoggedIn.admin, admin);

// Routes for doctors
router.use('/doctor', LoggedIn.doctor, doctor);

// Routes for patients
router.use('/patient', LoggedIn.patient, patient);

// Routes for suppliers
router.use('/supplier', LoggedIn.supplier, supplier);

// Routes for general users
router.use('/', user);

export default router;
