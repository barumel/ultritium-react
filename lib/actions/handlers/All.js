const axios = require('axios');

class AllHandler {
  constructor(uri) {
    this.uri = uri;
  }

  execute(options) {
    const uri = `${this.uri}`;

    return axios.get(uri);
  }

  /*
  Same here with async/await in node modules -> see comment in RestAction

  async execute(options) {
    const uri = `${this.uri}`;
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


module.exports = AllHandler;
