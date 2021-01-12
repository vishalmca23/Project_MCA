import { Router } from 'express';
import middlewares from '../middlewares';
import controllers from '../controllers';
import invalidRoutes from './invalidRoutes';

const { UserMiddleware } = middlewares;
const { Admin } = controllers;
const router = Router();

// Dashborad route to access dashboard after login
router.get('/dashboard', UserMiddleware.resetLoginFailure, Admin.redirectDashboard);

// Route to see doctor requests
router.get('/doctor-request', Admin.redirectDoctorRequest);

// Route to handle admin decision on doctor requests
router.post('/doctor-request', Admin.configureDoctor);

// Route to see supplier requests
router.get('/supplier-request', Admin.redirectSupplierRequest);

// Route to handle admin decision on supplier requests
router.post('/supplier-request', Admin.configureSupplier);

// Route for admin to give medicine information to store in database
router.get('/medicine', Admin.sendAddMedicinesPage);

// Rout for admin to add medicines
router.post('/medicine', Admin.addMedicine);

// Invalid routes or methods
router.all('/', invalidRoutes);

export default router;
