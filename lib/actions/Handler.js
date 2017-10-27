class Handler {
  /**
   * Constructor
   *
   * @param {String} name     Name of this handler. The received data will be stored under this name
   * @param {Mixed}  defaults Default values for this handler
   *
   * @return void
   */
  constructor(name=false, defaults=false) {
    if (!name) throw new Error('You must pass a name for this handler!');
    this.name = name;
    this.defaults = defaults;
  }

  getName() {
    return this.name;
  }

  getDefaults() {
    return this.defaults;
  }

  handle(state, action) {
    const { name, defaults } = this;
    const result = {...state, [name]: action.payload || defaults };

    return result;
  }
}

module.exports = Handler;
