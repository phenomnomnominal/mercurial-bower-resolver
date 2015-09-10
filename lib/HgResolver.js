'use strict';

// Dependenices:
var Promise = require('bluebird');
var child_process = require('child_process');
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
        })
        .then(function () {
            return tags.call(this);
        }.bind(this))
        .then(function (tags) {
            return parseTagsToVersions(tags)
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
            this.cloneToPath = temp[0];
            this.destroyClone = temp[1];
        }.bind(this))
        .then(function () {
            options.command = 'clone';
            options.args = [options.source, this.cloneToPath];
            return runHG.call(this, options);
        }.bind(this))
        .catch(function (e) {
            this.bower.logger.error('EHGCLONE', e.toString());
        }.bind(this));
    }
}

function tags () {
    var options = {
        command: 'tags',
        cwd: this.cloneToPath
    }
    return runHG(options)
    .catch(function (e) {
        this.bower.logger.error('EHGTAG', e.toString());
    }.bind(this));
}

function runHG (options) {
    var command = options.command;
    var args = options.args || [];

    return new Promise(function(resolve, reject) {
        var hg = child_process.spawn('hg', [command].concat(args), {
            env: process.env,
            cwd: options.cwd || process.cwd()
        });

        var stdout = '';
        var stderr = '';
        hg.stdout.on('data', function (data) { stdout += data.toString(); });
        hg.stderr.on('data', function (data) { stderr += data.toString(); });
        hg.on('exit', function () { resolve(stdout); })
        hg.on('error', function () { reject(stderr); })
    });
}

function parseTagsToVersions (tags) {
    var versions = [];
    var lines = tags.trim().split(/[\r\n]+/);

    // For each line in the refs, match only the branches
    lines.forEach(function (line) {
        var match = line.match(/([^\s]+)\s+(\d+):([0-9a-f]+)/i);
        if (match) {
            var version = match[1];
            var target = match[2];
            if (version === 'tip') {
                version = '*'
            }
            versions.push({
                version: version,
                target: target
            });
        }
    });

    return versions;
}
