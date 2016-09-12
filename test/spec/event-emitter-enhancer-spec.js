'use strict';
/*global describe: false, it: false*/

var chai = require('chai');
var assert = chai.assert;
var EventEmitter = require('events').EventEmitter;
var EventEmitterEnhancer = require('../../lib/event-emitter-enhancer');

function createEventEmitter() {
    var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);

    return new EnhancedEventEmitter();
}

function emptyFunction() {
    return undefined;
}

function removeValidation(removed, done) {
    if (removed) {
        done();
    } else {
        assert.fail();
    }
}

describe('event-emitter-enhancer Tests', function () {
    this.timeout(100);

    describe('extend Tests', function () {
        it('predefined extended events.EventEmitter test', function () {
            var EnhancedEventEmitter = EventEmitterEnhancer.EnhancedEventEmitter;
            var emitter = new EnhancedEventEmitter();

            assert.isFunction(emitter.onAsync);
            assert.isFunction(emitter.elseError);
            assert.isFunction(emitter.else);
            assert.isFunction(emitter.filter);

            emitter = new EventEmitter();

            assert.isUndefined(emitter.onAsync);
            assert.isUndefined(emitter.elseError);
            assert.isUndefined(emitter.else);
            assert.isUndefined(emitter.filter);
        });

        it('extend events.EventEmitter test', function () {
            var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
            var emitter = new EnhancedEventEmitter();

            assert.isFunction(emitter.onAsync);
            assert.isFunction(emitter.elseError);
            assert.isFunction(emitter.else);
            assert.isFunction(emitter.filter);

            emitter = new EventEmitter();

            assert.isUndefined(emitter.onAsync);
            assert.isUndefined(emitter.elseError);
            assert.isUndefined(emitter.else);
            assert.isUndefined(emitter.filter);
        });

        it('extend events.EventEmitter multi prevent test', function () {
            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);

            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            assert.isTrue(EnhancedEventEmitter.prototype.enhancedEmitterType);
            var emitter = new EnhancedEventEmitter();
            assert.isTrue(emitter.enhancedEmitterType);

            try {
                EventEmitterEnhancer.extend(EnhancedEventEmitter);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('modify custom events.EventEmitter test', function () {
            var CustomEventEmitter = function () {
                EventEmitter.call(this);
            };
            CustomEventEmitter.prototype = Object.create(EventEmitter.prototype);

            EventEmitterEnhancer.modify(CustomEventEmitter);
            var emitter = new CustomEventEmitter();

            assert.isFunction(emitter.onAsync);
            assert.isFunction(emitter.elseError);
            assert.isFunction(emitter.else);
            assert.isFunction(emitter.filter);

            emitter = new EventEmitter();

            assert.isUndefined(emitter.onAsync);
            assert.isUndefined(emitter.elseError);
            assert.isUndefined(emitter.else);
            assert.isUndefined(emitter.filter);
        });

        it('modify custom events.EventEmitter multi prevent test', function () {
            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            var CustomMultiEventEmitter = function () {
                EventEmitter.call(this);
            };
            CustomMultiEventEmitter.prototype = Object.create(EventEmitter.prototype);

            EventEmitterEnhancer.modify(CustomMultiEventEmitter);

            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            assert.isTrue(CustomMultiEventEmitter.prototype.enhancedEmitterType);
            var emitter = new CustomMultiEventEmitter();
            assert.isTrue(emitter.enhancedEmitterType);

            try {
                EventEmitterEnhancer.modify(CustomMultiEventEmitter);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('modifyInstance custom events.EventEmitter test', function () {
            var emitter = new EventEmitter();
            EventEmitterEnhancer.modifyInstance(emitter);

            assert.isFunction(emitter.onAsync);
            assert.isFunction(emitter.elseError);
            assert.isFunction(emitter.else);
            assert.isFunction(emitter.filter);

            emitter = new EventEmitter();

            assert.isUndefined(emitter.onAsync);
            assert.isUndefined(emitter.elseError);
            assert.isUndefined(emitter.else);
            assert.isUndefined(emitter.filter);
        });

        it('modifyInstance custom events.EventEmitter multi prevent test', function () {
            var emitter = new EventEmitter();
            EventEmitterEnhancer.modifyInstance(emitter);

            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            assert.isTrue(emitter.enhancedEmitterType);

            try {
                EventEmitterEnhancer.modifyInstance(emitter);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });
    });

    describe('suspend Tests', function () {
        it('suspend all test', function (done) {
            var emitter1 = createEventEmitter();
            emitter1.on('test', function () {
                done();
            });
            var emitter2 = createEventEmitter();
            emitter2.suspended = true;
            emitter2.on('test', function () {
                assert.fail();
            });

            assert.isFalse(emitter1.suspended);

            emitter2.emit('test');
            emitter1.emit('test');
        });

        it('suspend specific test', function (done) {
            var emitter1 = createEventEmitter();
            emitter1.on('test', function () {
                done();
            });
            var emitter2 = createEventEmitter();
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
            var emitter1 = createEventEmitter();
            var emitter2 = createEventEmitter();

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
            var emitter = createEventEmitter();
            emitter.on('test', function () {
                done();
            });

            emitter.emit('test');
        });

        it('single else test', function (done) {
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
            emitter.on('test', function () {
                done();
            });
            emitter.removeAllElseListeners();

            emitter.emit('test');
        });

        it('remove single else test', function (done) {
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
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
            var emitter = createEventEmitter();
            emitter.else(function () {
                assert.fail();
            });
            emitter.on('error', function (error) {
                assert.isDefined(error);

                done();
            });
            emitter.elseError('test');

            emitter.emit('test');
        });

        it('remove event else error test', function (done) {
            var emitter = createEventEmitter();
            var removed = false;
            emitter.else(function () {
                removeValidation(removed, done);
            });
            emitter.on('error', function (error) {
                assert.isDefined(error);

                emitter.removeElseError('test');
                removed = true;

                emitter.emit('test');
            });
            emitter.elseError('test');

            emitter.emit('test');
        });

        it('remove event unelse error test', function (done) {
            var emitter = createEventEmitter();
            var removed = false;
            emitter.else(function () {
                removeValidation(removed, done);
            });
            emitter.on('error', function (error) {
                assert.isDefined(error);

                emitter.unelseError('test');
                removed = true;

                emitter.emit('test');
            });
            emitter.elseError('test');

            emitter.emit('test');
        });
    });

    describe('async emit Tests', function () {
        it('async emit test', function (done) {
            var eventDone = false;
            var emitter = createEventEmitter();
            emitter.on('testAsync', function (arg1, arg2) {
                eventDone = true;

                assert.equal(arg1, 'test arg 1');
                assert.equal(arg2, 2);
            });

            emitter.emitAsync('testAsync', 'test arg 1', 2, function onEmitDone(event, arg1, arg2, emitted) {
                assert.equal(event, 'testAsync');
                assert.equal(arg1, 'test arg 1');
                assert.equal(arg2, 2);
                assert.isTrue(emitted);

                done();
            });

            if (eventDone) {
                assert.fail();
            }
        });

        it('async emit noemit test', function (done) {
            var emitter = createEventEmitter();
            emitter.emitAsync('testNoEmit', 1, 2, function onEmitDone(event, arg1, arg2, emitted) {
                assert.equal(event, 'testNoEmit');
                assert.equal(arg1, 1);
                assert.equal(arg2, 2);
                assert.isFalse(emitted);

                done();
            });
        });

        it('async emit missing callback with args test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.emitAsync('test', 1, 2);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('async emit missing callback without args test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.emitAsync('test');
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });
    });

    describe('async on Tests', function () {
        it('async on test', function (done) {
            var eventDone = false;
            var eventDoneValidation = function () {
                if (eventDone) {
                    assert.fail();
                }
            };
            var emitter = createEventEmitter();
            emitter.on('test', eventDoneValidation);
            emitter.onAsync('test', function (arg1, arg2) {
                eventDone = true;

                assert.equal(arg1, 1);
                assert.equal(arg2, 2);

                done();
            });
            emitter.on('test', eventDoneValidation);

            assert.equal(3, emitter.listeners('test').length);

            emitter.emit('test', 1, 2);

            if (eventDone) {
                assert.fail();
            }
        });

        it('async on missing callback test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.onAsync('test');
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('async on not a callback test', function () {
            var emitter = createEventEmitter();
            try {
                var notFunction = 'something';
                emitter.onAsync('test', notFunction);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('async on remove callback test', function () {
            var emitter = createEventEmitter();
            var remove = emitter.onAsync('test', emptyFunction);
            emitter.on('test', emptyFunction);

            assert.equal(2, emitter.listeners('test').length);

            remove();

            assert.equal(1, emitter.listeners('test').length);
        });
    });

    describe('onAny Tests', function () {
        it('onAny null events test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.onAny(null, function () {
                    assert.fail();
                });

                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('onAny undefined events test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.onAny(undefined, function () {
                    assert.fail();
                });

                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('onAny missing callback test', function () {
            var emitter = createEventEmitter();
            try {
                emitter.onAny(['test']);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('onAny single event', function () {
            var emitter = createEventEmitter();

            var triggerCount = 0;
            var remove = emitter.onAny('test-single', function (arg1, arg2, arg3) {
                assert.equal(arg1, 1);
                assert.equal(arg2, 'a');
                assert.deepEqual(arg3, {
                    something: [1, 2, 3]
                });

                triggerCount++;
            });

            emitter.emit('fake1', 'wrong');
            assert.equal(triggerCount, 0);

            emitter.emit('test-single', 1, 'a', {
                something: [1, 2, 3]
            });
            assert.equal(triggerCount, 1);

            remove();

            emitter.emit('test-single', 1, 'a', {
                something: [1, 2, 3]
            });
            assert.equal(triggerCount, 1);
        });

        it('onAny single array event', function () {
            var emitter = createEventEmitter();

            var triggerCount = 0;
            var remove = emitter.onAny(['test-array'], function (arg1, arg2, arg3) {
                assert.equal(arg1, 1);
                assert.equal(arg2, 'a');
                assert.deepEqual(arg3, {
                    something: [1, 2, 3]
                });

                triggerCount++;
            });

            emitter.emit('fake1', 'wrong');
            assert.equal(triggerCount, 0);

            emitter.emit('test-array', 1, 'a', {
                something: [1, 2, 3]
            });
            assert.equal(triggerCount, 1);

            emitter.emit('fake1', 'wrong');
            assert.equal(triggerCount, 1);

            remove();

            emitter.emit('test-array', 1, 'a', {
                something: [1, 2, 3]
            });
            assert.equal(triggerCount, 1);
        });

        it('onAny multiple array event', function () {
            var emitter = createEventEmitter();

            var triggerCount = 0;
            var events = ['test-array-1', 'test-array-2', 'test-array-3'];
            var remove = emitter.onAny(events, function (arg1, arg2, arg3) {
                assert.equal(arg1, 1);
                assert.equal(arg2, 'a');
                assert.deepEqual(arg3, {
                    something: [1, 2, 3]
                });

                triggerCount++;
            });

            emitter.emit('fake1', 'wrong');
            assert.equal(triggerCount, 0);

            events.forEach(function (eventName) {
                emitter.emit(eventName, 1, 'a', {
                    something: [1, 2, 3]
                });
            });
            assert.equal(triggerCount, 3);

            emitter.emit('fake1', 'wrong');
            assert.equal(triggerCount, 3);

            remove();

            events.forEach(function (eventName) {
                emitter.emit(eventName, 1, 'a', {
                    something: [1, 2, 3]
                });
            });
            assert.equal(triggerCount, 3);
        });
    });

    describe('filter Tests', function () {
        it('no filter + event test', function noFilterOrEventTest() {
            var emitter = createEventEmitter();
            try {
                emitter.filter();
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('no filter test', function noFilterFuncTest() {
            var emitter = createEventEmitter();
            try {
                emitter.filter('test');
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('too many args test', function tooManyArgsTest() {
            var emitter = createEventEmitter();
            try {
                emitter.filter('test', 'test', emptyFunction);
                assert.fail();
            } catch (error) {
                assert.isDefined(error);
            }
        });

        it('single global filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    emitter.filter(function (event, arg1, arg2) {
                        assert.equal(event, 'test');
                        assert.equal(arg1, 101);
                        assert.equal(arg2, 201);

                        return false;
                    });
                    filterAdded = true;

                    emitter.emit('test', 101, 201);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('single specific filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    emitter.filter('test', function (event, arg1, arg2) {
                        assert.equal(event, 'test');
                        assert.equal(arg1, 210);
                        assert.equal(arg2, 220);

                        return false;
                    });
                    filterAdded = true;

                    emitter.emit('test', 210, 220);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('single specific different event filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    done();
                } else {
                    emitter.filter('test2', function () {
                        assert.fail();
                    });
                    filterAdded = true;

                    emitter.emit('test', 10, 20);
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('multiple global filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    var filtersCalled = 0;
                    var i;
                    var onEvent = function (event, arg1, arg2) {
                        filtersCalled++;
                        assert.equal(event, 'test');
                        assert.equal(arg1, 'abc');
                        assert.equal(arg2, 'DEF');

                        return true;
                    };
                    for (i = 0; i < 15; i++) {
                        emitter.filter(onEvent);
                    }
                    emitter.filter(function () {
                        filtersCalled++;
                        assert.equal(filtersCalled, 16);

                        return false;
                    });
                    emitter.filter(function () {
                        assert.fail();
                    });
                    filterAdded = true;

                    emitter.emit('test', 'abc', 'DEF');

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('multiple specific filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    var filtersCalled = 0;
                    var i;
                    var onEvent = function (event, arg1, arg2, arg3) {
                        filtersCalled++;
                        assert.equal(event, 'test');
                        assert.equal(arg1, 'a');
                        assert.equal(arg2, 1);
                        assert.isTrue(arg3);

                        return true;
                    };
                    for (i = 0; i < 25; i++) {
                        emitter.filter('test', onEvent);
                    }
                    emitter.filter('test', function () {
                        filtersCalled++;

                        assert.equal(filtersCalled, 26);

                        return false;
                    });
                    emitter.filter('test', function () {
                        assert.fail();
                    });
                    filterAdded = true;

                    emitter.emit('test', 'a', 1, true);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('remove global filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    var filtersCalled = 0;
                    var i;
                    /*jslint unparam: true */
                    var onEvent = function (event, arg1) {
                        filtersCalled++;
                        assert.isFalse(arg1);

                        return true;
                    };
                    /*jslint unparam: false */

                    for (i = 0; i < 5; i++) {
                        emitter.filter(onEvent);
                    }
                    var remove1 = emitter.filter(function () {
                        filtersCalled++;
                        assert.equal(filtersCalled, 6);

                        return false;
                    });
                    var remove2 = emitter.filter(function () {
                        assert.fail();
                    });
                    filterAdded = true;

                    emitter.emit('test', false);

                    remove1();
                    remove2();

                    emitter.filter(function () {
                        filtersCalled++;
                        assert.equal(filtersCalled, 12);

                        return true;
                    });

                    emitter.emit('test2', false);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('remove specific filter test', function (done) {
            var emitter = createEventEmitter();
            var filterAdded = false;
            emitter.on('test', function () {
                if (filterAdded) {
                    assert.fail();
                } else {
                    var filtersCalled = 0;
                    var i;
                    var onEvent = function (event, arg1, arg2) {
                        filtersCalled++;
                        assert.equal(event, 'test');
                        assert.equal(arg1, 10);
                        assert.equal(arg2, 20);

                        return true;
                    };
                    for (i = 0; i < 3; i++) {
                        emitter.filter('test', onEvent);
                    }
                    var remove1 = emitter.filter('test', function () {
                        filtersCalled++;

                        assert.equal(filtersCalled, 4);

                        return false;
                    });
                    var remove2 = emitter.filter('test', function () {
                        assert.fail();
                    });
                    filterAdded = true;

                    emitter.emit('test', 10, 20);

                    remove1();
                    remove2();

                    emitter.filter('test2', function (event, arg1, arg2) {
                        filtersCalled++;
                        assert.equal(event, 'test2');
                        assert.equal(arg1, 101);
                        assert.equal(arg2, 210);

                        assert.equal(filtersCalled, 5);

                        return true;
                    });

                    emitter.emit('test2', 101, 210);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });
    });

    describe('enhance Tests', function () {
        it('enhance EventEmitter2 test', function (done) {
            var EventEmitter2 = require('eventemitter2').EventEmitter2;
            var EnhancedEventEmitter2 = EventEmitterEnhancer.extend(EventEmitter2);

            var emitter = new EnhancedEventEmitter2({
                wildcard: false,
                newListener: false,
                maxListeners: 20
            });

            emitter.else(function (type, eventArg1, eventArg2) {
                assert.equal(type, 'test');
                assert.equal(eventArg1, 1);
                assert.equal(eventArg2, 2);
                assert.equal(arguments.length, 3);

                emitter.unelse(this);

                var eventDone = false;
                emitter.on('test', function (arg1, arg2) {
                    eventDone = true;

                    assert.equal(arg1, 1);
                    assert.equal(arg2, 2);
                });

                emitter.emitAsync('test', 1, 2, function onEmitDone(event, arg1, arg2, emitted) {
                    assert.equal(event, 'test');
                    assert.equal(arg1, 1);
                    assert.equal(arg2, 2);
                    assert.isTrue(emitted);

                    done();
                });

                if (eventDone) {
                    assert.fail();
                }
            });

            emitter.emit('test', 1, 2);
        });
    });
});
