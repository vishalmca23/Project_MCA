import { Strategy } from 'passport-local';
import PatientService from '../services/patient';

// Authentication strategy for Patient
export default new Strategy(
  async (username, password, done) => {
    try {
      const result = await PatientService.verify(username, password);
      if (result) {
        return done(null, { username });
      }
      return done(null, false);
    }
    catch (err) {
      return done(null, false);
    }
  }
);
