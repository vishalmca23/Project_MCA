import { Router } from 'express';
import middlewares from '../middlewares';
import controllers from '../controllers';
import invalidRoutes from './invalidRoutes';

const { UserMiddleware, Appointment, checkMedicineAvailabilty } = middlewares;
const { Patient } = controllers;
const router = Router();

// Dashborad route to access dashboard after login
router.get('/dashboard', UserMiddleware.resetLoginFailure, Patient.redirectDashboard);

// Route to get personal details
router.get('/details', Patient.sendPersonalDetail);

// Route for getting confirmed doctors list and make appointments
router.get('/appointment-request', Patient.sendDoctorList);

// Route for making appointment requests to doctors
router.post('/appointment-request',
  Appointment.checkData,
  Appointment.checkDoctorAvailability,
  Patient.makeAppointmentRequest);

// Route to get all appointments
router.get('/appointment', Patient.sendAppointmentList);

// Route for getting order information
router.get('/order-medicine', Patient.sendMakeOrderPage);

// Route for creating order
router.post('/order-medicine', checkMedicineAvailabilty, Patient.createOrder);

// Route to get order details
router.get('/orders', Patient.sendOrderDetails);

// Route to get information of doctors
router.get('/doctor-information/:doctorId', Patient.sendDoctorInformation);

// Route to get information of suppliers
router.get('/supplier-information/:supplierId', Patient.sendSupplierInformation);

// Invalid routes or methods
router.all('/', invalidRoutes);

export default router;
