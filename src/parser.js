'use strict';

// Constants:
const DEFAULT_TARGET = 'default';
const DEFAULT_VERSION = '0.0.0';
const NEW_LINE_REGEX = /[\r\n]+/;
const TAG_REGEX = /([^\s]+)\s+(\d+):([0-9a-f]+)/i;

// Dependencies:
import semver from 'semver';

export default {
    versions
};

function versions (branches, tags) {
    let versions = parse(branches).concat(parse(tags));
    versions = versions.filter(Boolean);
    return versions.length ? versions : [{
        version: DEFAULT_VERSION,
        target: DEFAULT_TARGET
    }];
}

function parse (output) {
    let lines = output.trim().split(NEW_LINE_REGEX);
    return lines.map((line) => {
        let parsed = line.match(TAG_REGEX);
        if (parsed) {
            let [match, version, target] = parsed;
            if (semver.parse(version)) {
                return { version, target };
            }
        }
    });
}
