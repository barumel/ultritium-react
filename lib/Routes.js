const React = require('react');
const Router = require('react-router');
const { Route, IndexRoute } = Router;

class Routes {
  /**
   * Constructor
   * This class handles the registration of routes
   *
   * @return void
   */
  constructor() {
    this.containers = [];
  }

  /**
   * Register a new route for the given container (target)
   *
   * @param  {String}    path    Path
   * @param  {Container} target  Target (container) -> React.Component
   * @param  {Options}   options Options object
   *
   * @return {Routes} this This instance
   */
  register(path, target, options) {
    const { containers } = this;
    // Do not add routes twice
    if (containers.find(container => container.path === path)) return this;

    const container = {
      path,
      target,
      options
    }

    containers.push(container);

    return this;
  }

  /**
   * Unregister the given route
   *
   * @param  {String} path Path
   *
   * @return {Routes} this This instance
   */
  unregister(path) {
    const { containers } = this;
    const index = containers.findIndex(container => container.path === path);

    if (index > -1) delete containers[index];

    return this;
  }

  /**
   * Get all registered routes
   *
   * @return {Array} routes Routes array
   */
  render() {
    const { containers } = this;
    const routes = containers.map((container) => {
      const { target, path } = container;
      return React.createElement(Route, { path, component: target  }, null);
    });

    return routes;
  }
}

module.exports = new Routes();
