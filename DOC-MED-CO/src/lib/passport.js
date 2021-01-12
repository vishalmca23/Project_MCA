import passport from 'passport';
import patient from '../strategies/patient';
import doctor from '../strategies/doctor';
import supplier from '../strategies/supplier';
import admin from '../strategies/admin';
import getUserDetails from '../services/user';

export const passportSetup = app => {
  // passport middleware setup
  app.use(passport.initialize());
  app.use(passport.session());

  // Used to serialize the user for session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to deserialize the user
  passport.deserializeUser(async (user, done) => {
    const userInfo = await getUserDetails(user.username);
    user.id = userInfo.id;
    user.name = userInfo.name;
    user.type = userInfo.type;
    user.status = userInfo.status;
    done(null, user);
  });

  // Middleware for local strategy Authentication for Patient
  passport.use('patient-authentication', patient);

  // Middleware for local strategy Authentication for Doctor
  passport.use('doctor-authentication', doctor);

  // Middleware for local strategy Authentication for Supplier
  passport.use('supplier-authentication', supplier);

  // Middleware for local strategy Authentication for Admin
  passport.use('admin-authentication', admin);
};

export default passport;
