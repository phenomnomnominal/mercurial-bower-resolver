'use strict';

// Test setup:
import chai from 'chai';

let { expect } = chai;

// Dependencies:
import Resolver from './Resolver';

// Under test:
import init from './init';

describe('init', () => {
    it('should return a new Resolver', () => {
        let resolver = init();

        expect(resolver instanceof Resolver).to.be.true;
    });
});
