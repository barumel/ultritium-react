const axios = require('axios');

class PutHandler {
  constructor(url) {
    this.url = url;
  }

  async execute(params, options) {
    const { _id } = params;
    const url = `${this.url}/${_id}`;
    let result = {};

    try {
      const response = await axios.put(url, params);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
}

module.exports = PutHandler;
