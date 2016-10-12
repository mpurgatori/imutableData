'use strict';

const crypto = require('crypto');

module.exports = {
  getSha1 (data) {
    return crypto
      .createHash('sha1')
      .update(data)
      .digest('hex');
  }
};
