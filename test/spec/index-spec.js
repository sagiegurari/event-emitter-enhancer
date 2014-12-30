'use strict';
/*global describe: false, it: false */

var chai = require('chai');
var assert = chai.assert;
var EventEmitterEnhancer = require('../../');

describe('Index Tests', function () {
    it('EventEmitter setup', function () {
        var EventEmitter = require('events').EventEmitter;
        var emitter = new EventEmitter();
        assert.isFunction(emitter.else);
        assert.isFunction(EventEmitterEnhancer.enhance);
    });
});
