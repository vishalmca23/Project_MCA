import AdminService from './admin';
import DoctorService from './doctor';
import SupplierService from './supplier';
import PatientService from './patient';

const getUserDetails = email => AdminService.find(email)
  .then(admin => {
    admin.type = 'admin';
    return admin;
  })
  .catch(() => DoctorService.find(email)
    .then(doctor => {
      doctor.type = 'doctor';
      return doctor;
    })
    .catch(() => SupplierService.find(email)
      .then(supplier => {
        supplier.type = 'supplier';
        return supplier;
      })
      .catch(() => PatientService.find(email)
        .then(patient => {
          patient.type = 'patient';
          return patient;
        })
      )
    )
  );


export default getUserDetails;
