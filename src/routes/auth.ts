import express, { Router } from 'express'
import validate from '../middleware/validate.middleware'
import * as authController from '../api/auths'
import * as userValidation from '../validators/user'
import * as authValidation from '../validators/auth'
import * as authMiddleware from '../middleware/auth.middleware'
const router: Router = express.Router()

router
  .route('/signup')
  .post(validate(authValidation.createUser), authController.signup)

router
  .route('/login')
  .post(validate(userValidation.login), authController.login)

router
  .route('/verify')
  .post(validate(userValidation.verify), authController.verify)

router
  .route('/forgot')
  .post(validate(userValidation.forgot), authController.forgot)

router
  .route('/resend/otp/:id')
  .get(validate(userValidation.resendOtp), authController.resendOtp)

router
  .route('/reset/:id')
  .put(validate(userValidation.reset), authController.reset)

router
  .route('/update/password/:id')
  .put(validate(userValidation.updatePassword), authController.updatePassword)

router
  .route('/social/login')
  .post(validate(userValidation.socialLogin), authController.socialLogin)

router
  .route('/logout/:id')
  .get(
    validate(userValidation.getUser),
    authMiddleware.validateToken,
    authController.logout,
  )
export default router
