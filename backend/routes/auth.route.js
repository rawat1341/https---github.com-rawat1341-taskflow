import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { userAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, signupSchema } from '../utils/validator.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;
