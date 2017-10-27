const routes = require('./Routes');

/**
 * Route class decorator. This adds the given container to the routes array
 *
 * @param  {String} route   Route (path)
 * @param  {Object} options Options
 *
 * @return void
 */
module.exports.route = (route, options={}) => {
  console.log(`Register route ${route} with options `, options);
  return (target) => {

    routes.add(route, target, options);
    console.log(`Do this for target `, target);
    console.log('ROUTES', routes);
  }
}
