import { Router } from 'express';
import { authController } from './auth.controller.js';

const authRouter = Router();

authRouter.post('/auth', authController.registerUserFirstStep);
authRouter.post('/authSecond', authController.registerUserSecondStep);
authRouter.post('/login', authController.loginUserFirstStep);
authRouter.post('/loginSecond', authController.loginUserSecondStep);
authRouter.post('/checkAuth', authController.refreshSecret);

export default authRouter;
