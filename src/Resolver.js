'use strict';

// Constants:
const SOURCE_MATCH_REGEX = /^hg\+(ssh|https?):\/\//i

// Dependencies:
import mercurial from './mercurial';
import parser from './parser';
import Promise from 'bluebird';

// Errors:
const BRANCHES_ERROR = 'EHGBRANCHES';
const CLONE_ERROR = 'EHGCLONE';
const TAGS_ERROR = 'EHGTAGS';
const UPDATE_ERROR = 'EHGUPDATE';

export default class Resolver {
    constructor (bower) {
        this.bower = bower;
    }

    match (source) {
        return SOURCE_MATCH_REGEX.test(source);
    }

    releases (source) {
        return mercurial.clone(source, this.directory)
        .catch(this.error(CLONE_ERROR))
        .then((directory) => {
            this.directory = directory;

            let branches = mercurial.branches(directory.name)
            .catch(this.error(BRANCHES_ERROR));

            let tags = mercurial.tags(directory.name)
            .catch(this.error(TAGS_ERROR));

            return Promise.all([branches, tags]);
        })
        .spread(parser.versions);
    }

    fetch (endpoint) {
        return mercurial.clone(endpoint.source, this.directory)
        .catch(this.error(CLONE_ERROR))
        .then((directory) => {
            this.directory = directory;

            return mercurial.update(endpoint, this.directory.name);
        })
        .catch(this.error(UPDATE_ERROR))
        .then(() => {
            return {
                tempPath: this.directory.name
            };
        });
    }

    error (type) {
        return (e) => this.bower.logger.error(type, e.toString());
    }
}
