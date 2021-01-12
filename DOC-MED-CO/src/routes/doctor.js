import { Router } from 'express';
import checkCredentials from '../middlewares/doctor';
import middlewares from '../middlewares';
import controllers from '../controllers';
import invalidRoutes from './invalidRoutes';

const { UserMiddleware, Appointment } = middlewares;
const { Doctor } = controllers;
const router = Router();

// Dashborad route to access dashboard after login
router.get('/dashboard', UserMiddleware.resetLoginFailure, Doctor.redirectDashboard);

// Route to get personal details
router.get('/details', Doctor.redirectDetails);

// Route to add additional informations of doctors
router.post('/details', checkCredentials, Doctor.addCredentials);

// Route to get appointment requests
router.get('/appointment-request', Doctor.sendAppointmentRequestList);

// Route to handle decision of approve or reject appointment
router.post('/appointment-request', Doctor.configureAppointmentRequest);

// Route to get confirmed appointments
router.get('/appointment', Doctor.sendAppointmentList);

// Route to add patient report
router.post('/appointment/patient-report', Appointment.completed, Doctor.saveReport);

// Route to get information of patients
router.get('/appointment/patient-information/:patientId', Doctor.sendPatientInformation);

// Route to get information of doctors
router.get('/information/:doctorId', Doctor.sendDoctorInformation);

// Invalid routes or methods
router.all('/', invalidRoutes);

export default router;
