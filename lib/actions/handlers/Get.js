const axios = require('axios');

class GetHandler {
  constructor(url) {
    this.url = url;
  }

  async execute(id, options) {
    const url = `${this.url}/${id}`;
    let result = {};

    try {
      const response = await axios.get(url);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
}

module.exports = GetHandler;
