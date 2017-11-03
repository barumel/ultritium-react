const axios = require('axios');

class DeleteHandler {
  constructor(uri) {
    this.uri = uri;
  }

  execute(id, options) {
    const uri = `${this.uri}/${id}`;

    return axios.delete(uri);
  }

  /*
  Same here with async/await in node modules -> see comment in RestAction

  async execute(id, options) {
    const uri = `${this.uri}/${id}`;
    let result = {};

    try {
      const response = await axios.delete(uri);
      result = response.data;
    } catch(err) {
      throw err;
    }

    return result;
  }
  */
}

module.exports = DeleteHandler;
