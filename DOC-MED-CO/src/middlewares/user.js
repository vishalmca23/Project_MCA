import { templatePaths } from 'config';
import authentication from './authentication';
import controllers from '../controllers';
import regEx from '../helpers/regEx';
import renderPageWithMessage from '../helpers/responseRenderer';

const { User, Register } = controllers;

export default class UserMiddleware {
  /**
   * Register new user to database
   * @param {httpRequest} req
   * @param {httResponse} res
   */
  static registerUser(req, res) {
    if (Register[req.body.profession]) {
      return Register[req.body.profession](req, res);
    }
    return renderPageWithMessage(
      req,
      res,
      403,
      templatePaths.user.register,
      'Please select profession'
    );
  }

  /**
   * Destroy the session of user
   * @param {httpRequest} req
   * @param {httpResponse} res
   * @param {callback function} next
   */
  static destroySession(req, res, next) {
    req.session.destroy();
    return next();
  }

  /**
   * Update loginFailure local variable
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static setLoginFailure(req, res) {
    req.app.locals.loginFailure = true;
    res.redirect('/login');
  }

  /**
   * Reset loginFailure local variable
   * @param {httpRequest} req
   * @param {httpResponse} res
   */
  static resetLoginFailure(req, res, next) {
    req.app.locals.loginFailure = false;
    return next();
  }

  /**
   * Check user credentials on registration
   * @param {httpRequest} req
   * @param {httpResopnse} res
   * @param {Function} next
   */
  static checkUserCredentials(req, res, next) {
    if (regEx.email.test(req.body.email)
      && regEx.password.test(req.body.password)
      && regEx.phone.test(req.body.mobileNumber)) {
      return next();
    }
    return User.registerFailure(req, res);
  }

  /**
   * Set appropriate authentication strategy based on user profile
   * @param {httpRequest} req
   * @param {httpResopnse} res
   * @param {Function} next
   */
  static redirectUserToProfessionLogin(req, res) {
    req.app.locals.userType = req.body.profession;
    try {
      if (authentication[req.body.profession]) {
        return authentication[req.body.profession](req, res);
      }
      return UserMiddleware.setLoginFailure(req, res);
    }
    catch (err) {
      res.status(500);
      return res.send(err.message);
    }
  }
}
