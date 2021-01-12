import { Router } from 'express';
import middlewares from '../middlewares';
import controllers from '../controllers';
import invalidRoutes from './invalidRoutes';

const { UserMiddleware } = middlewares;
const { User } = controllers;
const router = Router();

// Routing for base URL
router.get('/', UserMiddleware.resetLoginFailure, User.redirectHome);

// Route for registering user
router.post('/register', UserMiddleware.checkUserCredentials, UserMiddleware.registerUser);

// Routing for registration page
router.get('/register', User.redirectRegister);

// Login route to authenticate user using local strategy
router.post('/login', UserMiddleware.redirectUserToProfessionLogin);

// Routing for login page
router.get('/login', User.redirectLogin);

// Routing for login failure
router.get('/login/failure', UserMiddleware.setLoginFailure);

// Routing for logout
router.get('/logout', UserMiddleware.destroySession, User.logoutUser);

// Invalid routes or methods
router.all(/ */, invalidRoutes);

export default router;
