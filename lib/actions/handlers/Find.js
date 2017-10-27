const axios = require('axios');

class FindHandler {
  constructor(url) {
    this.url = url;
  }

  async execute(query, options) {
    query = JSON.stringify(query);
    const url = `${this.url}?query=${query}`;
    let result = [];

    try {
      const response = await axios.get(url);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
}

module.exports = FindHandler;
