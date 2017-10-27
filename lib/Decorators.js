const Routes = require('./Routes');

/**
 * Route class decorator. This adds the given container to the routes array
 *
 * @param  {String} route   Route (path)
 * @param  {Object} options Options
 *
 * @return void
 */
module.exports.route = (path, options={}) => {
  console.log(`Register route ${path} with options `, options);
  return (target) => {

    Routes.register(path, target, options);
    console.log(`Do this for target `, target);
    console.log('ROUTES', Routes);
  }
}
