'use strict';

/**
*
* This file will actually handle receiving commands,
* and will delegate them to your functions. We can
* just focus on the specific fvs methods!
*
**/

const fvs = require('./fvs-your-work-here');

module.exports = function () {
  try {
    switch (process.argv.slice(2)[0]) {
      case 'init':
        fvs.init();
        break;
      case 'add':
        fvs.add();
        break;
      case 'commit':
        fvs.commit();
        break;
      default:
        fvs.handleDefault();
    }
  } catch (err) {
    console.log(err);
  }
};
