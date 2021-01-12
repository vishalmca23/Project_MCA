import { Strategy } from 'passport-local';
import AdminService from '../services/admin';

// Authentication strategy for Admin
export default new Strategy(
  async (username, password, done) => {
    try {
      const result = await AdminService.verify(username, password);
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
