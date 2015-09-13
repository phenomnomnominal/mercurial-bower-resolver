'use strict';

// Dependencies:
import Resolver from './Resolver';

export default function resolver (bower) {
    return new Resolver(bower);
}
