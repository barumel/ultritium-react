const axios = require('axios');

class FindHandler {
  constructor(uri) {
    this.uri = uri;
  }

  execute(query, options) {
    query = JSON.stringify(query);
    const uri = `${this.uri}?query=${query}`;

    return axios.get(uri);
  }

  /*
  Same here with async/await in node modules -> see comment in RestAction

  async execute(query, options) {
    query = JSON.stringify(query);
    const uri = `${this.uri}?query=${query}`;
    let result = [];

    try {
      const response = await axios.get(uri);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
  */
}

module.exports = FindHandler;
