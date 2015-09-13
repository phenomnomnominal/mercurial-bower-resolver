'use strict';

// Test setup:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

let { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import Promise from 'bluebird';
import mercurial from './mercurial';
import parser from './parser';

// Under test:
import Resolver from './Resolver';

describe('Resolver:', () => {
    describe('Resolver.match:', () => {
        it('should match any URLs with the "hg+" prefix', () => {
            let URLS = [
                'hg+ssh://some.repo',
                'hg+http://some.repo',
                'hg+https://some.repo'
            ];

            let resolver = new Resolver();

            URLS.forEach((url) => {
                expect(resolver.match(url)).to.equal.true;
            });
        });

        it('should not match anything without the "hg+" prefix', () => {
            let URLS = [
                'ssh://some.repo',
                'svn+http://some.repo'
            ];

            let resolver = new Resolver();

            URLS.forEach((url) => {
                expect(resolver.match(url)).to.equal.false;
            });
        });
    });

    describe('Resolver.releases:', () => {
        it('should get the available releases from the repo and set the clone directory', () => {
            let directory = { name: directory };
            let versions = [];

            sinon.stub(mercurial, 'clone').returns(Promise.resolve(directory));
            sinon.stub(mercurial, 'branches').returns(Promise.resolve(''));
            sinon.stub(mercurial, 'tags').returns(Promise.resolve(''));
            sinon.stub(parser, 'versions').returns(versions);

            let resolver = new Resolver();

            return resolver.releases()
            .then((releases) => {
                expect(resolver.directory).to.equal(directory);
                expect(mercurial.clone).to.have.been.called;
                expect(mercurial.branches).to.have.been.called;
                expect(mercurial.tags).to.have.been.called;
                expect(parser.versions).to.have.been.called;
                expect(releases).to.equal(versions);

                mercurial.clone.restore();
                mercurial.branches.restore();
                mercurial.tags.restore();
                parser.versions.restore();
            });
        });
    });

    describe('Resolver.fetch:', () => {
        it('should fetch the repository at the given target and set the clone directory', () => {
            let directory = { name: directory };
            let endpoint = { source: 'source' };

            sinon.stub(mercurial, 'clone').returns(Promise.resolve(directory));
            sinon.stub(mercurial, 'update').returns(Promise.resolve());

            let resolver = new Resolver();

            return resolver.fetch(endpoint)
            .then(() => {
                expect(resolver.directory).to.equal(directory);
                expect(mercurial.clone).to.have.been.called;
                expect(mercurial.update).to.have.been.called;

                mercurial.clone.restore();
                mercurial.update.restore();
            });
        });

        it('should return `undefined` if a cached version is available', () => {
            let cached = { version: '1.0.0' };
            let endpoint = { source: 'source' };

            let resolver = new Resolver();

            expect(resolver.fetch(endpoint, cached)).to.equal(undefined);
        });
    });

    describe('Resolver.error:', () => {
        it('should pass the error through to the bower error logger', () => {
            let logger = { error: () => { } };
            let bower = { logger };
            const ERROR_TYPE = 'ERROR';

            sinon.stub(logger, 'error');

            let resolver = new Resolver(bower);

            resolver.error(ERROR_TYPE)('error');

            expect(bower.logger.error).to.have.been.calledWith(ERROR_TYPE, 'error');
        });
    });
});
