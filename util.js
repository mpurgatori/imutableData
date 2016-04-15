'use strict';

/**
*
* Hey - don't check here until you're done with ListNode ;)
*
**/

const crypto = require('crypto');

module.exports = {
  getSha1 (data) {
    return crypto
      .createHash('sha1')
      .update(data)
      .digest('hex');
  }
}
