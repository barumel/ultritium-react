const _ = require('lodash');
const RestReducers = require('./reducers/RestReducers');

class Reducers {
  constructor() {
    this.reducers = {};
  }

  register(namespace) {
    const reducers = new RestReducers(namespace);
    this.reducers[namespace] = reducers;

    return this;
  }

  unregister(namespace) {
    delete this.reducers[namespace];
  }

  has(namespace) {
    return !_.isUndefined(this.reducers[namespace]);
  }

  get(namespace) {
    return this.reducers[namespace];
  }

  getCombined() {
    const { reducers } = this;
    const combined = {};

    _.forEach(reducers, (reducer, namespace) => {
      combined[namespace] = () => reducer.reduce();
    });

    return combined;
  }
}

module.exports = new Reducers();
