import passport from '../lib/passport';

// Middleware for local Authentication for patient
const patientLocalAuthentication = passport.authenticate('patient-authentication', {
  failureRedirect: '/login/failure',
  successRedirect: '/patient/dashboard',
  session: true
});

// Middleware for local Authentication for doctor
const doctorLocalAuthentication = passport.authenticate('doctor-authentication', {
  failureRedirect: '/login/failure',
  successRedirect: '/doctor/dashboard',
  session: true
});

// Middleware for local Authentication for supplier
const supplierLocalAuthentication = passport.authenticate('supplier-authentication', {
  failureRedirect: '/login/failure',
  successRedirect: '/supplier/dashboard',
  session: true
});

// Middleware for local Authentication for admin
const adminLocalAuthentication = passport.authenticate('admin-authentication', {
  failureRedirect: '/login/failure',
  successRedirect: '/admin/dashboard',
  session: true
});

export default {
  admin: adminLocalAuthentication,
  patient: patientLocalAuthentication,
  doctor: doctorLocalAuthentication,
  supplier: supplierLocalAuthentication
};
