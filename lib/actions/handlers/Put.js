const axios = require('axios');

class PutHandler {
  constructor(uri) {
    this.uri = uri;
  }

  execute(params, options) {
    const { _id } = params;
    const uri = `${this.uri}/${_id}`;

    return axios.put(uri, params);
  }

  /*
  Same here with async/await in node modules -> see comment in RestAction

  async execute(params, options) {
    const { _id } = params;
    const uri = `${this.uri}/${_id}`;
    let result = {};

    try {
      const response = await axios.put(uri, params);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
  */
}

module.exports = PutHandler;
