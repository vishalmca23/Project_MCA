export default class LoggedIn {
  /**
   * Checks admin is logged in or not
   * @param {httpRequest} req
   * @param {httpResponse} res
   * @param {callback function} next
  */
  static admin(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'admin') {
      return next();
    }
    res.status(401);
    return res.redirect('/login');
  }

  /**
   * Checks doctor is logged in or not
   * @param {httpRequest} req
   * @param {httpResponse} res
   * @param {callback function} next
   */
  static doctor(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'doctor') {
      return next();
    }
    res.status(401);
    return res.redirect('/login');
  }

  /**
   * Checks patient is logged in or not
   * @param {httpRequest} req
   * @param {httpResponse} res
   * @param {callback function} next
   */
  static patient(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'patient') {
      return next();
    }
    res.status(401);
    return res.redirect('/login');
  }

  /**
   * Checks supplier is logged in or not
   * @param {httpRequest} req
   * @param {httpResponse} res
   * @param {callback function} next
   */
  static supplier(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'supplier') {
      return next();
    }
    res.status(401);
    return res.redirect('/login');
  }
}
