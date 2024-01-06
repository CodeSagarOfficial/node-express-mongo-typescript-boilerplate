import * as authMiddleware from './../middleware/auth.middleware'
import express, { Router } from 'express'
import validate from '../middleware/validate.middleware'
import * as userController from '../api/users'
import * as userValidation from '../validators/user'

const router: Router = express.Router()

router
  .route('/')
  .post(
    validate(userValidation.createUser),
    authMiddleware.validateToken,
    userController.create,
  )
router
  .route('/:id')
  .put(
    validate(userValidation.createUser),
    authMiddleware.validateToken,
    userController.update,
  )
router
  .route('/:id')
  .get(
    validate(userValidation.getUser),
    authMiddleware.validateToken,
    userController.get,
  )
router
  .route('/:id')
  .delete(
    validate(userValidation.deleteUser),
    authMiddleware.validateToken,
    userController.remove,
  )

router
  .route('/')
  .get(
    validate(userValidation.getUsers),
    authMiddleware.validateToken,
    userController.search,
  )

export default router
