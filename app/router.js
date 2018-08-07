import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('registration');
  this.route('login');
  this.route('authenticated', function() {
    this.route('inbox');
    this.route('sent');
    this.route('new');
  });
});

export default Router;
