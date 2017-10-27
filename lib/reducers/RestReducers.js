const _ require('lodash');

class RestReducers {
  constructor(namespace) {
    this.namespace = namespace;
    this.handlers = {};
    this.defaults = {};
  }

  reduce() {

  }

  /**
   * Check if there is a handler registered for this name
   *
   * @param  {String} name Handler name
   *
   * @return {Boolean}
   */
  hasHandler(name) {
    const { handlers } = this;
    return !_.isUndefined(handlers[name]);
  }

  /**
   * Get the handler for the given name
   *
   * @param  {String} name Handler name
   *
   * @return {Handler} handler Handler instance or undefined
   */
  getHandler(name) {
    const { handlers } = this;
    return handlers[name];
  }

  /**
   * Register a new handler
   *
   * @param {String}  name    Name
   * @param {Handler} handler Handler for this action
   *
   * @return {RestReducers} this This instance
   */
  registerHandler(name, handler) {
    const { handlers, defaults } = this;

    // Only add the handler if no handler for the given aciton is registered.
    // If one wants to replace a handler, use unregister/register or replace
    if (!handlers[name]) handlers[name] = handler;
    defaults[name] = handler.getDefaults();

    return this;
  }

  /**
   * Unregister the handler for the given name
   *
   * @param  {String} name Handler name
   *
   * @return {RestReducers} this This instance
   */
  unregisterHandler(name) {
    const { handlers } = this;
    if (handlers[name]) delete handlers[name];

    return this;
  }

  /**
   * Replace an existing handler with the given one
   *
   * @param {String}  name    Name
   * @param {Handler} handler Handler for this action
   *
   * @return {RestReducers} this This instance
   */
  replaceHandler(name, handler) {
    this.unregisterHandler(name);
    this.registerHandler(name, handler);

    return this;
  }
}

module.exports = RestReducers;
