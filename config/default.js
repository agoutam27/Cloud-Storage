import packageJSON from '../package.json';

module.exports = {
  app: {
    version: packageJSON.version,
    title: 'Cloud Storage',
    description: packageJSON.description
  },

  dir_structure: {
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*Routes.js',
    controllers: 'app/conrollers/**/*Controller.js'
  }
};
