const axios = require('axios');

class AllHandler {
  constructor(url) {
    this.url = url;
  }

  async execute(options) {
    const url = `${this.url}`;
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


module.exports = AllHandler;
