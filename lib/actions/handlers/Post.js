const axios = require('axios');

class PostHandler {
  constructor(uri) {
    this.uri = uri;
  }

  execute(data, options) {
    const uri = `${this.uri}`;

    return axios.post(uri, data);
  }

  /*
  Same here with async/await in node modules -> see comment in RestAction

  async execute(data, options) {
    const uri = `${this.uri}`;
    let result = {};

    try {
      const response = await axios.post(uri, data);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
  */
}

module.exports = PostHandler;
