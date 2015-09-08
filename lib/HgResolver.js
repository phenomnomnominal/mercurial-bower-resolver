'use strict';

// Dependenices:
var Promise = require('bluebird');
var child_process = Promise.promisifyAll(require('child_process'));
var tmp = Promise.promisifyAll(require('tmp'));

module.exports = (function () {
    function HgResolver (bower) {
        this.bower = bower;
    };

    HgResolver.prototype.match = function match (source) {
        return /^hg\+(ssh|https?):\/\//i.test(source);
    };

    HgResolver.prototype.locate = function locate (source) {
        return source;
    };

    HgResolver.prototype.releases = function releases (source) {
        source = clearSource(source);
        return cloneRepo.call(this, {
            source: source
        });
    };

    HgResolver.prototype.fetch = function fetch (endpoint, cached) {
        // If cached version of package exists, re-use it
        if (cached && cached.version) {
            return;
        }

        return {

        };
    };

    return HgResolver;
})();

function clearSource (source) {
    return source
    // Change hg+ssh or hg+http or hg+https to ssh, http(s) respectively:
    .replace(/^hg\+(ssh|https?):\/\//i, '$1://')
    // Remove trailing slashes:
    .replace(/\/+$/, '');
}

function cloneRepo (options) {
    if (this.temp) {
        return Promise.resolve();
    } else {
        return tmp.dirAsync()
        .then(function (temp) {
            this.temp = temp;
        }.bind(this))
        .then(function () {
            options.command = 'clone';
            options.args = [options.source, this.temp];
            return runHG.call(this, options);
        }.bind(this));
    }
}

function runHG (options) {
    var args = [options.command].concat(options.args || []);
    return child_process.spawnAsync('hg', args, { env: process.env });
}
