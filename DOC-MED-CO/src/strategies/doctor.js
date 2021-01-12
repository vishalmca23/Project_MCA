import { Strategy } from 'passport-local';
import DoctorService from '../services/doctor';

// Authentication strategy for Doctor
export default new Strategy(
  async (username, password, done) => {
    try {
      const result = await DoctorService.verify(username, password);
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
