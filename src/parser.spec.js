'use strict';

// Test setup:
import chai from 'chai';

let { expect } = chai;

// Under test:
import parser from './parser';

describe('parser:', () => {
    describe('parser.versions:', () => {
        it('should extract semver compliant branches and tags', () => {
            let branches = `
                default                     1234:1234567890ab
                v1.2.3                       123:abcdef123456 (inactive)
            `;
            let tags = `
                tip                             1234:1234567890ab
                1.0.0                            100:d6354a0a4982
            `;

            let versions = parser.versions(branches, tags);
            let [v123, v100] = versions;

            expect(v123.version).to.equal('v1.2.3');
            expect(v123.target).to.equal('123');
            expect(v100.version).to.equal('1.0.0');
            expect(v100.target).to.equal('100');
        });

        it('should fall back to "default" if it can\'t find a valid version', () => {
            let branches = ``;
            let tags = ``;

            let versions = parser.versions(branches, tags);
            let [def] = versions;

            expect(def.version).to.equal('0.0.0');
            expect(def.target).to.equal('default');
        });
    });
});
