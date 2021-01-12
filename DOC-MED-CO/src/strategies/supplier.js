import { Strategy } from 'passport-local';
import SupplierService from '../services/supplier';

// Authentication strategy for Supplier
export default new Strategy(
  async (username, password, done) => {
    try {
      const result = await SupplierService.verify(username, password);
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
