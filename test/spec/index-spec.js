'use strict';

/*global describe: false, it: false*/

var chai = require('chai');
var assert = chai.assert;
var EventEmitterEnhancer = require('../../');

describe('Index Tests', function () {
    it('EventEmitter setup', function () {
        assert.isFunction(EventEmitterEnhancer.extend);
        assert.isFunction(EventEmitterEnhancer.modify);

        var EventEmitter = require('events').EventEmitter;
        var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
        var emitter = new EnhancedEventEmitter();

        assert.isFunction(emitter.else);
        assert.isFunction(EventEmitterEnhancer.modify);
        assert.isFunction(EventEmitterEnhancer.extend);
    });
});
