'use strict';

// Test setup:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

let { expect } = chai;
chai.use(sinonChai);

// Under test:
import mercurial from './mercurial';

describe('mercurial:', () => {
    describe('mercurial.clone:', () => {
        it('should clean up the given URL', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;

            let directory = { name: 'directory' };
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(child_process, 'spawn').returns(hg);

            let clone = mercurial.clone('hg+https://source/', directory)
            .then(() => {
                expect(child_process.spawn).to.have.been.calledWith('hg', ['clone', 'https://source', 'directory']);

                child_process.spawn.restore();
            });

            hg.emit('exit', '');

            return clone;
        });

        it('should clone to a given directory', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;
            const tmp = require('tmp');

            let directory = { name: 'directory' };
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(tmp, 'dirSync');
            sinon.stub(child_process, 'spawn').returns(hg);

            let clone = mercurial.clone('http://source', directory)
            .then((directory) => {
                expect(tmp.dirSync).to.not.have.been.called;
                expect(child_process.spawn).to.have.been.calledWith('hg', ['clone', 'http://source', 'directory']);
                expect(directory.name).to.equal('directory');

                tmp.dirSync.restore();
                child_process.spawn.restore();
            });

            hg.emit('exit', '');

            return clone;
        });

        it('should create a temporary directory if one doesn\'t exist', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;
            const tmp = require('tmp');

            let directory = { name: 'directory' };
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(tmp, 'dirSync').returns(directory);
            sinon.stub(child_process, 'spawn').returns(hg);

            let clone = mercurial.clone('http://source')
            .then((directory) => {
                expect(tmp.dirSync).to.have.been.called;
                expect(child_process.spawn).to.have.been.calledWith('hg', ['clone', 'http://source', 'directory']);
                expect(directory.name).to.equal('directory');

                tmp.dirSync.restore();
                child_process.spawn.restore();
            });

            hg.emit('exit', '');

            return clone;
        });
    });

    describe('mercurial.branches:', () => {
        it('should return the branches of the repo in a given directory', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;

            let directory = 'directory';
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(child_process, 'spawn').returns(hg);

            let branches = mercurial.branches(directory)
            .then((branches) => {
                expect(child_process.spawn).to.have.been.calledWith('hg', ['branches'], { cwd: 'directory' });
                expect(branches).to.equal('branches');

                child_process.spawn.restore();
            });

            hg.stdout.emit('data', 'branches');
            hg.emit('exit', '');

            return branches;
        });
    });

    describe('mercurial.tags:', () => {
        it('should return the tags of the repo in a given directory', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;

            let directory = 'directory';
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(child_process, 'spawn').returns(hg);

            let tags = mercurial.tags(directory)
            .then((tags) => {
                expect(child_process.spawn).to.have.been.calledWith('hg', ['tags'], { cwd: 'directory' });
                expect(tags).to.equal('tags');

                child_process.spawn.restore();
            });

            hg.stdout.emit('data', 'tags');
            hg.emit('exit', '');

            return tags;
        });
    });

    describe('mercurial.update:', () => {
        it('should update the repo to a given target', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;

            let endpoint = { target: 'target' };
            let directory = 'directory';
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(child_process, 'spawn').returns(hg);

            let tags = mercurial.update(endpoint, directory)
            .then(() => {
                expect(child_process.spawn).to.have.been.calledWith('hg', ['up', 'target'], { cwd: 'directory' });

                child_process.spawn.restore();
            });

            hg.emit('exit', '');

            return tags;
        });

        it('should specify the -r flag for a revision', () => {
            const child_process = require('child_process');
            const EventEmitter = require('events').EventEmitter;

            let endpoint = { target: '1234567890ab' };
            let directory = 'directory';
            let hg = new EventEmitter();
            let stdout = new EventEmitter();
            let stderr = new EventEmitter();
            hg.stdout = stdout;
            hg.stderr = stderr;

            sinon.stub(child_process, 'spawn').returns(hg);

            let tags = mercurial.update(endpoint, directory)
            .then(() => {
                expect(child_process.spawn).to.have.been.calledWith('hg', ['up', '-r', '1234567890ab'], { cwd: 'directory' });

                child_process.spawn.restore();
            });

            hg.emit('exit', '');

            return tags;
        });
    });
});
