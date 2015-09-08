'use strict';

// Dependencies:
var HgResolver = require('./lib/HgResolver');

module.exports = function resolver (bower) {
    return new HgResolver(bower);
};
