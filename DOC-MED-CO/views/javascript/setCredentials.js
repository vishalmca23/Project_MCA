const setDoctor = (id, name) => {
  document.getElementById('doctorId').value = id;
  document.getElementById('doctorName').value = name;
};

const setAppointment = id => {
  document.getElementById('appointmentId').value = id;
  document.getElementById('appointment').innerHTML = 'Selected';
};

const setSupplier = (id, name) => {
  document.getElementById('supplierId').value = id;
  document.getElementById('supplierName').value = name;
};

module.exports = {
  setAppointment,
  setDoctor,
  setSupplier
};
