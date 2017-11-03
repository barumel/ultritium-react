const _ = require('lodash');
const RestActions = require('./actions/RestActions');

class Actions {
  constructor() {
    this.actions = {};
  }

  /**
   * Register default rest actions fot the given namespace/uri
   *
   * @param  {String} namespace Namespace
   * @param  {String} uri       Uri
   * @param  {Object} options   Options object
   *
   * @return {Actions} this This instance
   */
  register(namespace, uri, options) {
    const actions = new RestActions(namespace, uri, options);
    this.actions[namespace] = actions;
    actions.init();

    return this;
  }

  /**
   * Unregister actions for the given namespace
   *
   * @param  {String} namespace Namespace
   *
   * @return {Actions} this This instance
   */
  unregister(namespace) {
    delete this.actions[namespace];

    return this;
  }

  /**
   * Check whether actions are registered for the given namespace or not
   *
   * @return {Boolean}
   */
  has() {
    return !_.isUndefined(this.actions[namespace]);
  }

  /**
   * Get rest actions for the given namespace
   *
   * @param  {String} namespace Namespace
   *
   * @return {RestActions} actions RestActions instance
   */
  get(namespace) {
    namespace = namespace.toUpperCase();

    return this.actions[namespace];
  }
}

module.exports = new Actions();
