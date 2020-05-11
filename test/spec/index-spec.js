'use strict';

const chai = require('chai');
const assert = chai.assert;
const EventEmitterEnhancer = require('../../');

describe('Index Tests', function () {
    it('EventEmitter setup', function () {
        assert.isFunction(EventEmitterEnhancer.extend);
        assert.isFunction(EventEmitterEnhancer.modify);

        const EventEmitter = require('events').EventEmitter;
        const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
        const emitter = new EnhancedEventEmitter();

        assert.isFunction(emitter.else);
        assert.isFunction(EventEmitterEnhancer.modify);
        assert.isFunction(EventEmitterEnhancer.extend);
    });
});
