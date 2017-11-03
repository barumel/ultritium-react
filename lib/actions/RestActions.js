const _ = require('lodash');
const AllHandler = require('./handlers/All');
const GetHandler = require('./handlers/Get');
const PutHandler = require('./handlers/Put');
const PostHandler = require('./handlers/Post');
const DeleteHandler = require('./handlers/Delete');

class RestActions {
  /**
   * Constructor
   *
   * @param  {String} namespace Action namespace (e.g. users, accounts...)
   * @param  {String} uri       Base uri of endpoint (e.g. https://mysuperapi.com/api/user)
   *
   * @return {RestActions} this This instance
   */
  constructor(namespace, uri, options={allowed: {}}) {
    this.namespace = namespace.toUpperCase();
    this.uri = uri;
    this.options = options;
    this.handlers = {};
    this.constructors = {
      ALL: AllHandler,
      GET: GetHandler,
      PUT: PutHandler,
      POST: PostHandler,
      DELETE: DeleteHandler
    }
  }

  /**
   * Init default handlers
   *
   * @return {RestActions} this This instance
   */
  init() {
    const { uri, constructors } = this;
    _.forEach(constructors, (func, name) => this.registerHandler(name, new func(uri)));

    return this;
  }

  /**
   * Is there a handler for the given name
   *
   * @param  {String} name Name (e.g. GET, PUT, POST...)
   *
   * @return {Boolean}
   */
  hasHandler(name) {
    const { handlers } = this;
    name = name.toUpperCase();

    return !_.isUndefined(handlers[name]);
  }

  /**
   * Get the handler for the given name
   *
   * @param  {String} name Name (e.g. GET, PUT, POST...)
   *
   * @return {[type]}      [description]
   */
  getHandler(name) {
    const { handlers } = this;
    name = name.toUpperCase();

    return handlers[name];
  }

  /**
   * Register a handler for the given name
   *
   * @param  {String}  name    Name (e.g. GET, PUT, POST...)
   * @param  {Handler} handler Handler instance
   *
   * @return {RestActions} this This instance
   */
  registerHandler(name, handler) {
    const { handlers } = this;
    name = name.toUpperCase();

    // Do not replace handler if already registered -> use replaceHandler instead
    if (handlers[name]) return this;

    handlers[name] = handler;

    return this;
  }

  /**
   * Unregister the handler for the given name
   *
   * @param  {String} name Name (e.g. GET, PUT, POST...)
   *
   * @return {RestActions} this This instance
   */
  unregisterHandler(name) {
    const { handlers } = this;
    name = name.toUpperCase();
    if (handlers[name]) delete handlers[name];

    return this;
  }

  /**
   * Replace the handler for the given name
   *
   * @param  {String}  name    Name (e.g. GET, PUT, POST...)
   * @param  {Handler} handler Handler instance
   *
   * @return {RestActions} this This instance
   */
  replaceHandler(name, handler) {
    name = name.toUpperCase();
    this.unregisterHandler(name);
    this.registerHandler(name, handler);

    return this;
  }

  /**
   * Add a default handler
   *
   * @param {String}    name    Handler name
   * @param {Function}  handler Handler constructor (class)
   *
   * @return {RestActions} this This instance
   */
  registerDefaultHandler(name, handler) {
    const { constructors } = this;
    // Do not add the handler if there is already a default handler -> use remove/replace instead
    if (_.isUndefined(constructors[name])) constructors[name] = handler;

    return this;
  }

  /**
   * Remove a default handler
   *
   * @param {String} name Handler name
   *
   * @return {RestActions} this This instance
   */
  unregisterDefaultHandler(name) {
    const { constructors } = this;
    delete constructors[name];

    return this;
  }

  /**
   * Replace a default handler
   *
   * @param {String}    name    Handler name
   * @param {Function}  handler Handler constructor (class)
   *
   * @return {RestActions} this This instance
   */
  replaceDefaultHandler(name, handler) {
    this.unregisterDefaultHandler(name);
    this.regiserDefaultHandler(name, handler);

    return this;
  }

  /**
   * Check whether the given handler is active/allowed.
   *
   * @param  {String} name Handler name
   *
   * @return {Boolean}
   */
  isAllowed(name) {
    const { allowed } = this.options;
    let isAllowed = allowed[name] || false;

    // It's also possible to set a function to allowed object instead of a boolen.
    // Execute the function in this case...
    if (_.isFunction(isAllowed)) isAllowed = isAllowed();

    return isAllowed;
  }

  /**
   * Get the handler for the given name and execute it
   *
   * @param  {String} name   Handler name (e.g. GET, PUT, POST...)
   * @param  {Object} params Handler params
   *
   * @return {Function} Async function that executes the handler
   */
  execute(name, params) {
    name = name.toUpperCase();
    const { namespace, handlers } = this;
    const handler = handlers[name];

    return (dispatch) => {
      // Dispatch start event
      dispatch({
        type: `${namespace}_${name}_START`,
        payload: params
      });

      // Reject if no handler is registered
      if (_.isUndefined(handler)) {
        const err = new Error(`No handler with name ${name} on namespace ${namespace} registered!`);
        return dispatch({
          type: `${namespace}_${name}_REJECTED`,
          payload: err
        });
      }

      // Reject if not allwed
      if (!this.isAllowed(name)) {
        const err = new Error(`Handler with name ${name} on namespace ${namespace} must not be executed!`);
        return dispatch({
          type: `${namespace}_${name}_REJECTED`,
          payload: err
        });
      }

      // Execute the handler with the given params
      handler.execute(params)
      .then((result) => {
        // Dispatch fulfilled on success
        dispatch({
          type: `${namespace}_${name}_FULFILLED`,
          payload: result
        });
      })
      .catch((err) => {
        // Dispatch rejected on error
        dispatch({
          type: `${namespace}_${name}_REJECTED`,
          payload: err
        });
      });
    }

    /*
    Can't figure out how to use async/await in node_modules with webpack/babel
    Always get "You may need an appropriate loader to handle this file type" error even "transform-async-to-generator" is installed and works...
    Must read a bit more about webpack/babel, there should be a solution for this... till then, use good old promise syntax

    return async function(dispatch) {
      dispatch({
        type: `${namespace}_${name}_START`,
        payload: params
      });

      // Reject if no handler is registered
      if (_.isUndefined(handler)) {
        const err = new Error(`No handler with name ${name} on namespace ${namespace} registered!`);
        return dispatch({
          type: `${namespace}_${name}_REJECTED`,
          payload: err
        });
      }

      // Try to execute the handler. Reject on error
      try {
        const result = await handler.execute(params);
        dispatch({
          type: `${namespace}_${name}_FULFILLED`,
          payload: result
        });
      } catch(err) {
        dispatch({
          type: `${namespace}_${name}_REJECTED`,
          payload: err
        });
      }
    }
*/
  }
}

module.exports = RestActions;
