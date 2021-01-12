import { Router } from 'express';
import controllers from '../controllers';

const { User } = controllers;
const router = Router();

// Invalid method operation
router.all('/', User.methodNotAllowedError);

// Invalid URL operation
router.all(/ */, User.resourceNotFoundError);

export default router;
