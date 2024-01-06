import express, { Router } from 'express'
// import docsRoute from './swagger.route';
import userRoute from '../routes/user'
// import config from '../../config/config';
import authRoute from '../routes/auth'
const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auths',
    route: authRoute,
  },
]

// const devIRoute: IRoute[] = [
//   // IRoute available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultIRoute.forEach(route => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
// if (config.env === 'development') {
//   devIRoute.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router
