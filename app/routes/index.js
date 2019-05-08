import routes from './routes.js';

const initRoutes = (app) => {
  app.use(`/v1`, routes);
};

export default initRoutes;
