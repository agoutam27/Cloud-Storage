import routes from './routes.js';

const initRoutes = (app) => {
  // Set up authentication middleware here, but there might be some apis not requiring authentication
  app.use(`/v1`, routes);
};

export default initRoutes;
