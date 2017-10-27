const _ = require('lodash');

class RestAction {
  /**
   * Constructor
   *
   * @param  {String} namespace Action namespace (e.g. users, accounts...)
   * @param  {String} uri       Base uri of endpoint (e.g. https://mysuperapi.com/api/user)
   *
   * @return {RestActions} this This instance
   */
  constructor(namespace, uri) {
    this.namespace = namespace;
    this.url = url;
    this.handlers = {};
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

    handlers[name] = action;

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
   * Get the handler for the given name and execute it
   *
   * @param  {String} name   Handler name (e.g. GET, PUT, POST...)
   * @param  {Object} params Handler params
   *
   * @return {Function} Async function that executes the handler
   */
  handle(name, params) {
    name = name.toUpperCase();
    const { namespace, handlers } = this;
    const handler = handlers[name];

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
  }
}
