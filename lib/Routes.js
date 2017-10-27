class Routes {
  constructor() {
    this.containers = [];
  }

  add(path, target, options) {
    const { containers } = this;
    const container = {
      path,
      target,
      options
    }

    containers.push(container);

    return this;
  }

  remove() {

  }

  get() {
    return this.containers;
  }
}

module.exports = new Routes();
