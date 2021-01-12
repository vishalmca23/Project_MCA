/**
 * Check credentials of doctor
 * @param {httpRequest} req
 * @param {httpResopnse} res
 * @param {Function} next
 */
const checkCredentials = (req, res, next) => {
  const doctor = req.body;
  if (typeof doctor.degree == 'string'
    && !isNaN(doctor.appointmentFee)
    && doctor.experienceFrom
    && Number(doctor.startTime) < Number(doctor.endTime)) {
    return next();
  }
  return res.redirect('/doctor/dashboard');
};

export default checkCredentials;
