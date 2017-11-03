const _ = require('lodash');
const AllHandler = require('./handlers/All');
const GetHandler = require('./handlers/Get');
const PutHandler = require('./handlers/Put');
const PostHandler = require('./handlers/Post');
const DeleteHandler = require('./handlers/Delete');

class RestReducers {
  constructor(namespace) {
    this.namespace = namespace.toUpperCase();
    this.handlers = {};
    this.defaults = {
      errors: {}
    };
    this.constructors = {
      ALL: AllHandler,
      GET: GetHandler,
      PUT: PutHandler,
      POST: PostHandler,
      DELETE: DeleteHandler
    }
  }

  /**
   * Initialize default handlers
   *
   * @return {RestReducers} this This instance
   */
  init() {
    const { namespace, constructors } = this;
    _.forEach(constructors, (func, name) => this.registerHandler(name, new func()));

    return this;
  }

  /**
   * Check if there is a handler that handles this action/type.
   * Return result from handler or state
   *
   * @param {Object} state  Current state from store
   * @param {Object} action Action object
   *
   * @return {Promise}
   */
  reduce(state=this.defaults, action) {
    const { namespace, handlers, defaults } = this;

    const { type } = action;
    let result = state;

    if (this.hasHandler(type)) {
      const handler = this.getHandler(type);
      result = handler.handle(state);
    }

    return result;
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
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

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
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

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
    const { namespace, handlers, defaults } = this;
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

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
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

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

  /**
   * Is there an error handler for this name
   *
   * @param  {String} name Name
   *
   * @return {Boolean}
   */
  hasErrorHander(name) {
    const { handlers } = this;
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

    return !_.isUndefined(handlers[name]);
  }

  /**
   * Get the handler for the given name
   *
   * @param  {String} name Name
   *
   * @return {Handler} handler Handler instance or undefined
   */
  getErrorHandler(name) {
    const { handlers } = this;
    name = `${namespace}_${name.toUpperCase()}_FULFILLED`;

    return handlers[name];
  }

  /**
   * Register an error handler for the given name
   *
   * @param  {String}  name    Handler name
   * @param  {handler} handler Handler instance
   *
   * @return {RestReducers} this This instance
   */
  registerErrorHandler(name, handler) {
    const { handlers, defaults } = this;
    name = `${namespace}_${name.toUpperCase()}_REJECTED`;

    // Do not replace existing error handlers. Use unregister/register or replace
    if (!handlers[name]) handlers[name] = handler;
    defaults.errors[name] = handler.getDefaults();

    return this;
  }

  /**
   * Unregister the error handler for the given name
   *
   * @param  {String} name Handler name
   *
   * @return {RestReducers} this This instance
   */
  unregisterErrorHandler(name) {
    const { handlers } = this;
    name = `${namespace}_${name.toUpperCase()}_REJECTED`;
    if (handlers[name]) delete handlers[name];

    return this;
  }

  /**
   * Replace an existing error handler with a new one
   *
   * @param  {String}  name    Handler name
   * @param  {Handler} handler Handler instance
   *
   * @return {RestReducers} this This instance
   */
  replaceErrorHandler(name, handler) {
    this.unregisterErrorHandler(name);
    this.registerErrorHandler(name, handler);

    return this;
  }

  /**
   * Register a default handler (constructor)
   *
   * @param  {String}   name    Name
   * @param  {Function} handler Constructor function (class)
   *
   * @return {RestReducers} this This instance
   */
  registerDefaultHandler(name, handler) {
    const { constructors } = this;
    // Do not replace existing constructors. Use unregister/register or replace instead
    if (_.isUndefined(constructors[name])) constructors[name] = handler;

    return this;
  }

  /**
   * Unregister the default handler (constructor) for the given name
   *
   * @param  {String} name Name
   *
   * @return {RestReducers} this This instance
   */
  unregisterDefaultHandler(name) {
    delete this.constructors[name];

    return this;
  }

  /**
   * Replace the default handler (constructor) for the given name
   *
   * @param  {String} name    Name
   * @param  {Function} handler Constructor (class)
   *
   * @return {RestReducers} this This instance
   */
  replaceDefaultHandler(name, handler) {
    this.unregisterDefaultHandler(name);
    this.registerDefaultHandler(name, handler);

    return this;
  }
}

module.exports = RestReducers;
