'use strict';
/*global describe: false, it: false */

var chai = require('chai');
var assert = chai.assert;
var EventEmitter = require('events').EventEmitter;
require('../../lib/event-emitter-enhancer');

describe('event-emitter-enhancer Tests', function () {
    this.timeout(100);

    describe('suspend Tests', function () {
        it('suspend all test', function (done) {
            var emitter1 = new EventEmitter();
            emitter1.on('test', function () {
                done();
            });
            var emitter2 = new EventEmitter();
            emitter2.suspended = true;
            emitter2.on('test', function () {
                assert.fail();
            });

            assert.isFalse(emitter1.suspended);

            emitter2.emit('test');
            emitter1.emit('test');
        });

        it('suspend specific test', function (done) {
            var emitter1 = new EventEmitter();
            emitter1.on('test', function () {
                done();
            });
            var emitter2 = new EventEmitter();
            emitter2.suspend('test');
            emitter2.on('test', function () {
                assert.fail();
            });

            assert.isFalse(emitter1.suspended);
            assert.isFalse(emitter2.suspended);

            emitter2.emit('test');
            emitter1.emit('test');
        });

        it('unsuspend specific test', function (done) {
            var emitter1 = new EventEmitter();
            var emitter2 = new EventEmitter();

            var unsuspendCalled = false;
            emitter1.on('test', function () {
                emitter2.unsuspend('test');
                unsuspendCalled = true;

                emitter2.emit('test');
            });
            emitter2.suspend('test');
            emitter2.on('test', function () {
                if (unsuspendCalled) {
                    done();
                } else {
                    assert.fail();
                }
            });

            assert.isFalse(emitter1.suspended);
            assert.isFalse(emitter2.suspended);

            emitter2.emit('test');
            emitter1.emit('test');
        });
    });

    describe('else Tests', function () {
        it('no else test', function (done) {
            var emitter = new EventEmitter();
            emitter.on('test', function () {
                done();
            });

            emitter.emit('test');
        });

        it('single else test', function (done) {
            var emitter = new EventEmitter();
            emitter.else(function (type, arg1, arg2) {
                assert.equal(type, 'test');
                assert.equal(arg1, 1);
                assert.equal(arg2, 2);
                assert.equal(arguments.length, 3);

                done();
            });

            emitter.emit('test', 1, 2);
        });

        it('multi else test', function (done) {
            var emitter = new EventEmitter();
            var elseCalled = 0;
            emitter.else(function () {
                elseCalled++;
            });
            emitter.else(function (type, arg1, arg2) {
                elseCalled++;

                assert.equal(type, 'test');
                assert.equal(arg1, 1);
                assert.equal(arg2, 2);
                assert.equal(arguments.length, 3);

                assert.equal(elseCalled, 2);

                done();
            });

            emitter.emit('test', 1, 2);
        });

        it('no else call test', function (done) {
            var emitter = new EventEmitter();
            emitter.else(function () {
                assert.fail();
            });
            emitter.on('test', function () {
                done();
            });

            emitter.emit('test');
        });
    });

    describe('remove else Tests', function () {
        it('no else test', function (done) {
            var emitter = new EventEmitter();
            emitter.on('test', function () {
                done();
            });
            emitter.removeAllElseListeners();

            emitter.emit('test');
        });

        it('remove single else test', function (done) {
            var emitter = new EventEmitter();
            var removed = false;
            emitter.else(function (type, arg1, arg2) {
                if (removed) {
                    assert.fail();
                } else {
                    assert.equal(type, 'test');
                    assert.equal(arg1, 1);
                    assert.equal(arg2, 2);
                    assert.equal(arguments.length, 3);

                    emitter.removeElseListener(this);
                    removed = true;

                    emitter.emit('test', 1, 2);

                    done();
                }
            });

            emitter.emit('test', 1, 2);
        });

        it('multi else remove test', function (done) {
            var emitter = new EventEmitter();
            var elseCalled = 0;
            var removed = false;
            emitter.else(function () {
                elseCalled++;

                if (elseCalled === 3) {
                    assert.isTrue(removed);
                    done();
                }
            });
            emitter.else(function (type, arg1, arg2) {
                if (removed) {
                    assert.fail();
                } else {
                    elseCalled++;

                    assert.equal(type, 'test');
                    assert.equal(arg1, 1);
                    assert.equal(arg2, 2);
                    assert.equal(arguments.length, 3);

                    assert.equal(elseCalled, 2);

                    emitter.removeElseListener(this);
                    removed = true;

                    emitter.emit('test');
                }
            });

            emitter.emit('test', 1, 2);
        });

        it('remove all else call test', function (done) {
            var emitter = new EventEmitter();
            var elseCalled = 0;
            var removed = false;
            emitter.else(function () {
                if (removed) {
                    assert.fail();
                } else {
                    elseCalled++;
                }
            });
            emitter.else(function () {
                if (removed) {
                    assert.fail();
                } else {
                    elseCalled++;

                    assert.equal(elseCalled, 2);

                    emitter.removeAllElseListeners();
                    removed = true;

                    emitter.emit('test');

                    done();
                }
            });

            emitter.emit('test');
        });

        it('remove with unelse test', function (done) {
            var emitter = new EventEmitter();
            var removed = false;
            emitter.else(function (type, arg1, arg2) {
                if (removed) {
                    assert.fail();
                } else {
                    assert.equal(type, 'test');
                    assert.equal(arg1, 1);
                    assert.equal(arg2, 2);
                    assert.equal(arguments.length, 3);

                    emitter.unelse(this);
                    removed = true;

                    emitter.emit('test', 1, 2);

                    done();
                }
            });

            emitter.emit('test', 1, 2);
        });
    });

    describe('else error Tests', function () {
        it('single event else error test', function (done) {
            var emitter = new EventEmitter();
            emitter.else(function () {
                assert.fail();
            });
            emitter.on('error', function (error) {
                assert.isObject(error);

                done();
            });
            emitter.elseError('test');

            emitter.emit('test');
        });

        it('remove event else error test', function (done) {
            var emitter = new EventEmitter();
            var removed = false;
            emitter.else(function () {
                if (removed) {
                    done();
                } else {
                    assert.fail();
                }
            });
            emitter.on('error', function (error) {
                assert.isObject(error);

                emitter.removeElseError('test');
                removed = true;

                emitter.emit('test');
            });
            emitter.elseError('test');

            emitter.emit('test');
        });

        it('remove event unelse error test', function (done) {
            var emitter = new EventEmitter();
            var removed = false;
            emitter.else(function () {
                if (removed) {
                    done();
                } else {
                    assert.fail();
                }
            });
            emitter.on('error', function (error) {
                assert.isObject(error);

                emitter.unelseError('test');
                removed = true;

                emitter.emit('test');
            });
            emitter.elseError('test');

            emitter.emit('test');
        });
    });
});
