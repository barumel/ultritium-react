const Routes = require('./Routes');
const Actions = require('./Actions');
const Reducers = require('./Reducers');

/**
 * Route class decorator. This adds the given container to the routes array
 *
 * @param  {String} route   Route (path)
 * @param  {Object} options Options
 *
 * @return {Function} func Decorator function
 */
module.exports.route = (path, options={}) => {
  console.log(`Register route ${path} with options `, options);
  return (target) => {

    Routes.register(path, target, options);
    console.log(`Do this for target `, target);
    console.log('ROUTES', Routes);
  }
}

/**
 * Add default rest actions for a container
 *
 * @param  {String} namespace Namespace
 * @param  {String} uri       Backend uri
 * @param  {Object} options   Options object
 *
 * @return {Function} func Decorator function
 */
module.exports.restActions = (namespace, uri, options) => {
  console.log(`Register actions for namespace ${namespace} with uri ${uri}`);

  return () => {
    Actions.register(namespace, uri, options);
    console.log(`Action registered`, Actions);
  }
}

/**
 * Add default rest reducers for a container
 *
 * @param  {String} namespace Namespace
 *
 * @return {Function} func Decorator function
 */
module.exports.restReducers = (namespace) => {
  console.log(`Register reducers for namespace ${namespace}`);

  return () => {
    Reducers.register(namespace);
    console.log(`Reducers registered!`, Reducers);
  }
}
