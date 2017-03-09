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

describe('event-emitter-enhancer', function () {
    describe('extend', function () {
        it('predefined extended events.EventEmitter', function () {
            var EnhancedEventEmitter = EventEmitterEnhancer.EnhancedEventEmitter;
            var emitter = new EnhancedEventEmitter();

            assert.isFunction(emitter.baseOn);
            assert.isFunction(emitter.baseOnce);
            assert.isFunction(emitter.baseEmit);

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

        it('extend events.EventEmitter', function () {
            var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
            var emitter = new EnhancedEventEmitter();

            assert.isFunction(emitter.baseOn);
            assert.isFunction(emitter.baseOnce);
            assert.isFunction(emitter.baseEmit);

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

        it('extend events.EventEmitter multi prevent', function () {
            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);

            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            assert.isTrue(EnhancedEventEmitter.prototype.enhancedEmitterType);
            var emitter = new EnhancedEventEmitter();
            assert.isTrue(emitter.enhancedEmitterType);

            var errorFound = false;
            try {
                EventEmitterEnhancer.extend(EnhancedEventEmitter);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('modify custom events.EventEmitter', function () {
            var CustomEventEmitter = function () {
                EventEmitter.call(this);
            };
            CustomEventEmitter.prototype = Object.create(EventEmitter.prototype);

            EventEmitterEnhancer.modify(CustomEventEmitter);
            var emitter = new CustomEventEmitter();

            assert.isFunction(emitter.baseOn);
            assert.isFunction(emitter.baseOnce);
            assert.isFunction(emitter.baseEmit);

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

        it('modify custom events.EventEmitter multi prevent', function () {
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

            var errorFound = false;
            try {
                EventEmitterEnhancer.modify(CustomMultiEventEmitter);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('modifyInstance custom events.EventEmitter', function () {
            var emitter = new EventEmitter();
            EventEmitterEnhancer.modifyInstance(emitter);

            assert.isFunction(emitter.baseOn);
            assert.isFunction(emitter.baseOnce);
            assert.isFunction(emitter.baseEmit);

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

        it('modifyInstance custom events.EventEmitter multi prevent', function () {
            var emitter = new EventEmitter();
            EventEmitterEnhancer.modifyInstance(emitter);

            assert.isFunction(emitter.baseOn);
            assert.isFunction(emitter.baseOnce);
            assert.isFunction(emitter.baseEmit);

            assert.isUndefined(EventEmitter.prototype.enhancedEmitterType);
            assert.isTrue(emitter.enhancedEmitterType);

            var errorFound = false;
            try {
                EventEmitterEnhancer.modifyInstance(emitter);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });
    });

    describe('once', function () {
        it('nodejs with remove, called', function () {
            var emitter = createEventEmitter();

            var invoked = false;
            var remove = emitter.once('test', function (arg1, arg2, arg3) {
                if (invoked) {
                    assert.fail();
                }

                assert.strictEqual(arg1, 1);
                assert.strictEqual(arg2, 2);
                assert.strictEqual(arg3, 3);

                invoked = true;
            });

            emitter.emit('test', 1, 2, 3);

            remove();

            emitter.emit('test', 'bad');

            remove();

            emitter.emit('test', 'bad');
        });

        it('nodejs with remove, removed', function () {
            var emitter = createEventEmitter();

            var remove = emitter.once('test', function () {
                assert.fail();
            });

            remove();

            emitter.emit('test', 'bad');
        });
    });

    describe('on', function () {
        it('nodejs with remove', function () {
            var emitter = createEventEmitter();

            var invoked = false;
            var remove = emitter.on('test', function (arg1, arg2, arg3) {
                if (invoked) {
                    assert.fail();
                }

                assert.strictEqual(arg1, 1);
                assert.strictEqual(arg2, 2);
                assert.strictEqual(arg3, 3);

                invoked = true;
            });

            emitter.emit('test', 1, 2, 3);

            remove();

            emitter.emit('test', 'bad');

            remove();

            emitter.emit('test', 'bad');
        });

        it('multiple listeners, single event', function () {
            var emitter = createEventEmitter();

            var invoked1 = false;
            var invoked2 = false;

            emitter.on({
                event: 'test-event',
                listener: [
                    function (arg1, arg2) {
                        assert.strictEqual(arg1, 'test');
                        assert.strictEqual(arg2, 2);

                        invoked1 = true;
                    },
                    function (arg1, arg2) {
                        assert.strictEqual(arg1, 'test');
                        assert.strictEqual(arg2, 2);

                        invoked2 = true;
                    }
                ]
            });

            emitter.emit('test-event1', 'abc', 123);
            assert.isFalse(invoked1);
            assert.isFalse(invoked2);

            emitter.emit('test-event', 'test', 2);
            assert.isTrue(invoked1);
            assert.isTrue(invoked2);
        });

        it('single listener, multiple events', function () {
            var emitter = createEventEmitter();

            var invoked1 = false;
            var invoked2 = false;

            emitter.on({
                event: [
                    'test-event1',
                    'test-event2'
                ],
                listener: function (arg1, arg2) {
                    if (invoked1 && invoked2) {
                        assert.fail();
                    } else if (invoked1) {
                        assert.strictEqual(arg1, 'test');
                        assert.strictEqual(arg2, 2);

                        invoked2 = true;
                    } else {
                        assert.strictEqual(arg1, 'abc');
                        assert.strictEqual(arg2, 123);

                        invoked1 = true;
                    }
                }
            });

            emitter.emit('test-event3', 'bad');
            assert.isFalse(invoked1);
            assert.isFalse(invoked2);

            emitter.emit('test-event1', 'abc', 123);
            assert.isTrue(invoked1);
            assert.isFalse(invoked2);

            emitter.emit('test-event2', 'test', 2);
            assert.isTrue(invoked1);
            assert.isTrue(invoked2);
        });

        it('multiple listeners, multiple event', function () {
            var emitter = createEventEmitter();

            var invoked1a = false;
            var invoked1b = false;
            var invoked2a = false;
            var invoked2b = false;

            var remove = emitter.on({
                event: [
                    'test-event1',
                    'test-event2'
                ],
                listener: [
                    function (arg1, arg2) {
                        if (invoked1a && invoked1b) {
                            assert.fail();
                        } else if (invoked1a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked1b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked1a = true;
                        }
                    },
                    function (arg1, arg2) {
                        if (invoked2a && invoked2b) {
                            assert.fail();
                        } else if (invoked2a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked2b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked2a = true;
                        }
                    }
                ]
            });

            emitter.emit('test-event3', 'bad');
            assert.isFalse(invoked1a);
            assert.isFalse(invoked1b);
            assert.isFalse(invoked2a);
            assert.isFalse(invoked2b);

            emitter.emit('test-event1', 'abc', 123);
            assert.isTrue(invoked1a);
            assert.isFalse(invoked1b);
            assert.isTrue(invoked2a);
            assert.isFalse(invoked2b);

            emitter.emit('test-event2', 'test', 2);
            assert.isTrue(invoked1a);
            assert.isTrue(invoked1b);
            assert.isTrue(invoked2a);
            assert.isTrue(invoked2b);

            remove();

            emitter.emit('test-event1', 'abc', 123);
            emitter.emit('test-event2', 'test', 2);

            remove();

            emitter.emit('test-event1', 'abc', 123);
            emitter.emit('test-event2', 'test', 2);
        });

        it('async and multiple listeners, multiple event', function (done) {
            var emitter = createEventEmitter();

            var invoked1a = false;
            var invoked1b = false;
            var invoked2a = false;
            var invoked2b = false;
            emitter.on({
                event: [
                    'test-event1',
                    'test-event2'
                ],
                listener: [
                    function (arg1, arg2) {
                        if (invoked1a && invoked1b) {
                            assert.fail();
                        } else if (invoked1a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked1b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked1a = true;
                        }
                    },
                    function (arg1, arg2) {
                        if (invoked2a && invoked2b) {
                            assert.fail();
                        } else if (invoked2a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked2b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked2a = true;
                        }
                    }
                ],
                async: true
            });

            emitter.emit('test-event3', 'bad');

            setTimeout(function () {
                assert.isFalse(invoked1a);
                assert.isFalse(invoked1b);
                assert.isFalse(invoked2a);
                assert.isFalse(invoked2b);

                emitter.emit('test-event1', 'abc', 123);
                setTimeout(function () {
                    assert.isTrue(invoked1a);
                    assert.isFalse(invoked1b);
                    assert.isTrue(invoked2a);
                    assert.isFalse(invoked2b);

                    emitter.emit('test-event2', 'test', 2);
                    setTimeout(function () {
                        assert.isTrue(invoked1a);
                        assert.isTrue(invoked1b);
                        assert.isTrue(invoked2a);
                        assert.isTrue(invoked2b);

                        done();
                    }, 1);
                }, 1);
            }, 1);
        });

        it('timeout and multiple listeners, multiple event', function (done) {
            var emitter = createEventEmitter();

            var invoked1a = false;
            var invoked1b = false;
            var invoked2a = false;
            var invoked2b = false;

            emitter.on({
                event: [
                    'test-event1',
                    'test-event2'
                ],
                listener: [
                    function (arg1, arg2) {
                        if (invoked1a && invoked1b) {
                            assert.fail();
                        } else if (invoked1a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked1b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked1a = true;
                        }
                    },
                    function (arg1, arg2) {
                        if (invoked2a && invoked2b) {
                            assert.fail();
                        } else if (invoked2a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked2b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked2a = true;
                        }
                    }
                ],
                timeout: 500
            });

            setTimeout(function () {
                emitter.emit('test-event3', 'bad');
                assert.isFalse(invoked1a);
                assert.isFalse(invoked1b);
                assert.isFalse(invoked2a);
                assert.isFalse(invoked2b);

                emitter.emit('test-event1', 'abc', 123);
                assert.isTrue(invoked1a);
                assert.isFalse(invoked1b);
                assert.isTrue(invoked2a);
                assert.isFalse(invoked2b);

                emitter.emit('test-event2', 'test', 2);
                assert.isTrue(invoked1a);
                assert.isTrue(invoked1b);
                assert.isTrue(invoked2a);
                assert.isTrue(invoked2b);

                setTimeout(function () {
                    emitter.emit('test-event3', 'bad');
                    emitter.emit('test-event1', 'abc', 123);
                    emitter.emit('test-event2', 'test', 2);

                    done();
                }, 500);
            }, 100);
        });

        it('timeout and async and multiple listeners, multiple event', function (done) {
            var emitter = createEventEmitter();

            var invoked1a = false;
            var invoked1b = false;
            var invoked2a = false;
            var invoked2b = false;
            emitter.on({
                event: [
                    'test-event1',
                    'test-event2'
                ],
                listener: [
                    function (arg1, arg2) {
                        if (invoked1a && invoked1b) {
                            assert.fail();
                        } else if (invoked1a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked1b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked1a = true;
                        }
                    },
                    function (arg1, arg2) {
                        if (invoked2a && invoked2b) {
                            assert.fail();
                        } else if (invoked2a) {
                            assert.strictEqual(arg1, 'test');
                            assert.strictEqual(arg2, 2);

                            invoked2b = true;
                        } else {
                            assert.strictEqual(arg1, 'abc');
                            assert.strictEqual(arg2, 123);

                            invoked2a = true;
                        }
                    }
                ],
                async: true,
                timeout: 500
            });

            emitter.emit('test-event3', 'bad');

            setTimeout(function () {
                assert.isFalse(invoked1a);
                assert.isFalse(invoked1b);
                assert.isFalse(invoked2a);
                assert.isFalse(invoked2b);

                emitter.emit('test-event1', 'abc', 123);
                setTimeout(function () {
                    assert.isTrue(invoked1a);
                    assert.isFalse(invoked1b);
                    assert.isTrue(invoked2a);
                    assert.isFalse(invoked2b);

                    emitter.emit('test-event2', 'test', 2);
                    setTimeout(function () {
                        assert.isTrue(invoked1a);
                        assert.isTrue(invoked1b);
                        assert.isTrue(invoked2a);
                        assert.isTrue(invoked2b);

                        setTimeout(function () {
                            emitter.emit('test-event1', 'bad');

                            setTimeout(done, 100);
                        }, 600);
                    }, 1);
                }, 1);
            }, 1);
        });
    });

    describe('suspend', function () {
        it('suspend all', function (done) {
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

        it('suspend specific', function (done) {
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

        it('unsuspend specific', function (done) {
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

        it('unsuspend no input', function (done) {
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

            emitter2.unsuspend();

            emitter2.emit('test');
            emitter1.emit('test');
        });
    });

    describe('else', function () {
        it('no else', function (done) {
            var emitter = createEventEmitter();
            emitter.on('test', function () {
                done();
            });

            emitter.emit('test');
        });

        it('single else', function (done) {
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

        it('multi else', function (done) {
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

        it('no else call', function (done) {
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

    describe('remove else', function () {
        it('no else', function (done) {
            var emitter = createEventEmitter();
            emitter.on('test', function () {
                done();
            });
            emitter.removeAllElseListeners();

            emitter.emit('test');
        });

        it('no input', function () {
            var emitter = createEventEmitter();
            emitter.removeElseListener();
        });

        it('remove single else', function (done) {
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

        it('multi else remove', function (done) {
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

        it('remove all else call', function (done) {
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

        it('remove with unelse', function (done) {
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

    describe('elseError', function () {
        it('remove no input', function () {
            var emitter = createEventEmitter();
            emitter.removeElseError();
        });

        it('single event else error', function (done) {
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

        it('remove event else error', function (done) {
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

        it('remove event unelse error', function (done) {
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

    describe('emitAsync', function () {
        it('async emit', function (done) {
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

        it('async emit noemit', function (done) {
            var emitter = createEventEmitter();
            emitter.emitAsync('testNoEmit', 1, 2, function onEmitDone(event, arg1, arg2, emitted) {
                assert.equal(event, 'testNoEmit');
                assert.equal(arg1, 1);
                assert.equal(arg2, 2);
                assert.isFalse(emitted);

                done();
            });
        });

        it('async emit missing event with args', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.emitAsync(1, 2, function () {
                    return undefined;
                });
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('async emit no args', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.emitAsync();
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('async emit missing callback with args', function (done) {
            var emitter = createEventEmitter();

            emitter.on('test', function (value1, value2) {
                assert.strictEqual(value1, 1);
                assert.strictEqual(value2, 2);

                done();
            });

            emitter.emitAsync('test', 1, 2);
        });

        it('async emit missing callback without args', function (done) {
            var emitter = createEventEmitter();

            emitter.on('test', function () {
                assert.strictEqual(0, arguments.length);

                done();
            });

            emitter.emitAsync('test');
        });
    });

    describe('onAsync', function () {
        it('async on', function (done) {
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

        it('async on missing callback', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.onAsync('test');
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('async on not a callback', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                var notFunction = 'something';
                emitter.onAsync('test', notFunction);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('async on remove callback', function () {
            var emitter = createEventEmitter();
            var remove = emitter.onAsync('test', emptyFunction);
            emitter.on('test', emptyFunction);

            assert.equal(2, emitter.listeners('test').length);

            remove();

            assert.equal(1, emitter.listeners('test').length);

            remove();

            assert.equal(1, emitter.listeners('test').length);
        });
    });

    describe('onAny', function () {
        it('onAny null events', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.onAny(null, function () {
                    assert.fail();
                });
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('onAny undefined events', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.onAny(undefined, function () {
                    assert.fail();
                });
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('onAny missing callback', function () {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.onAny(['test']);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('onAny single', function () {
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

            remove();

            events.forEach(function (eventName) {
                emitter.emit(eventName, 1, 'a', {
                    something: [1, 2, 3]
                });
            });
            assert.equal(triggerCount, 3);
        });
    });

    describe('filter', function () {
        it('no filter + event', function noFilterOrEventTest() {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.filter();
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('no filter', function noFilterFuncTest() {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.filter('test');
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('too many args', function tooManyArgsTest() {
            var emitter = createEventEmitter();

            var errorFound = false;
            try {
                emitter.filter('test', 'test', emptyFunction);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('single global filter', function (done) {
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

        it('single specific filter', function (done) {
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

        it('single specific different event filter', function (done) {
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

        it('multiple global filter', function (done) {
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

        it('multiple specific filter', function (done) {
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

        it('remove global filter', function (done) {
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

                    var remove3 = emitter.filter(function () {
                        filtersCalled++;
                        assert.equal(filtersCalled, 12);

                        return true;
                    });

                    emitter.emit('test2', false);

                    remove1();
                    remove2();
                    remove3();

                    emitter.filter(function () {
                        filtersCalled++;
                        assert.equal(filtersCalled, 18);

                        return true;
                    });

                    emitter.emit('test2', false);

                    done();
                }
            });
            emitter.emit('test', 1, 2);
        });

        it('remove specific filter', function (done) {
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

        it('remove specific multiple times', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter('test', function () {
                assert.fail();
            });

            remove();
            remove();

            emitter.emit('test', 10, 20);
        });

        it('remove specific missing event', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter('test', function () {
                assert.fail();
            });

            emitter.filters.event = {};

            remove();

            emitter.emit('test', 10, 20);
        });

        it('remove specific missing listener', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter('test', function () {
                assert.fail();
            });

            emitter.filters.event.test = [
                function fake() {
                    return true;
                }
            ];

            remove();

            emitter.emit('test', 10, 20);
        });

        it('remove global multiple times', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter(function () {
                assert.fail();
            });

            remove();
            remove();

            emitter.emit('test', 10, 20);
        });

        it('remove global empty', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter(function () {
                assert.fail();
            });

            emitter.filters.global = [];

            remove();

            emitter.emit('test', 10, 20);
        });

        it('remove global missing listener', function () {
            var emitter = createEventEmitter();

            var remove = emitter.filter(function () {
                assert.fail();
            });

            emitter.filters.global = [
                function fake() {
                    return true;
                }
            ];

            remove();

            emitter.emit('test', 10, 20);
        });
    });

    describe('asAsyncListener', function () {
        it('undefined', function () {
            var emitter = createEventEmitter();

            var errorFound = false;

            try {
                emitter.asAsyncListener();
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('null', function () {
            var emitter = createEventEmitter();

            var errorFound = false;

            try {
                emitter.asAsyncListener(null);
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('not a function', function () {
            var emitter = createEventEmitter();

            var errorFound = false;

            try {
                emitter.asAsyncListener('test');
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('valid', function (done) {
            var emitter = createEventEmitter();

            var asyncDone = emitter.asAsyncListener(done);

            assert.isFunction(asyncDone);
            assert.isFalse(asyncDone === done);

            asyncDone();
        });
    });

    describe('proxyEvents', function () {
        it('missing emitters', function () {
            var emitter = createEventEmitter();

            var errorFound = false;

            try {
                emitter.proxyEvents(undefined, 'test');
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('missing events', function () {
            var emitter = createEventEmitter();

            var errorFound = false;

            try {
                emitter.proxyEvents(new EventEmitter());
            } catch (error) {
                assert.isDefined(error);
                errorFound = true;
            }

            assert.isTrue(errorFound);
        });

        it('single emitter, single event', function () {
            var emitter = createEventEmitter();

            var source = new EventEmitter();

            var counter = 0;
            emitter.on('test', function (arg1, arg2) {
                counter++;

                assert.strictEqual(arg1, counter);
                assert.strictEqual(arg2, 'b');
            });

            emitter.on('bad', function () {
                assert.fail();
            });

            emitter.proxyEvents(source, 'test');

            source.emit('bad');

            var index;
            var loops = 5;
            for (index = 0; index < loops; index++) {
                source.emit('test', index + 1, 'b');
            }

            assert.strictEqual(counter, 5);
        });

        it('multiple emitters, single event', function () {
            var emitter = createEventEmitter();

            var source1 = new EventEmitter();
            var source2 = new EventEmitter();

            var counter = 0;
            emitter.on('test', function (arg1) {
                if (counter % 2) {
                    assert.strictEqual(arg1, 'source2');
                } else {
                    assert.strictEqual(arg1, 'source1');
                }

                counter++;
            });

            emitter.onAny([
                'bad1',
                'bad2'
            ], function () {
                assert.fail();
            });

            emitter.proxyEvents([
                source1,
                source2
            ], 'test');

            source1.emit('bad1');
            source2.emit('bad2');

            var index;
            var loops = 5;
            for (index = 0; index < loops; index++) {
                source1.emit('test', 'source1');
                source2.emit('test', 'source2');
            }

            assert.strictEqual(counter, 10);
        });

        it('single emitter, multiple events', function () {
            var emitter = createEventEmitter();

            var source = new EventEmitter();

            var counter = 0;
            emitter.onAny([
                'test1',
                'test2'
            ], function (arg1) {
                if (counter % 2) {
                    assert.strictEqual(arg1, 'second');
                } else {
                    assert.strictEqual(arg1, 'first');
                }

                counter++;
            });

            emitter.on('bad', function () {
                assert.fail();
            });

            emitter.proxyEvents(source, [
                'test1',
                'test2'
            ]);

            source.emit('bad');

            var index;
            var loops = 5;
            for (index = 0; index < loops; index++) {
                source.emit('test1', 'first');
                source.emit('test2', 'second');
            }

            assert.strictEqual(counter, 10);
        });

        it('multiple emitter, multiple events', function () {
            var emitter = createEventEmitter();

            var source1 = new EventEmitter();
            var source2 = new EventEmitter();

            var counter = 0;
            var test1Counter = 0;
            var test2Counter = 0;
            emitter.on('test1', function () {
                test1Counter++;
            });
            emitter.on('test2', function () {
                test2Counter++;
            });
            emitter.onAny([
                'test1',
                'test2'
            ], function (arg1) {
                switch (counter % 4) {
                case 0:
                    assert.strictEqual(arg1, '1a');
                    break;
                case 1:
                    assert.strictEqual(arg1, '1b');
                    break;
                case 2:
                    assert.strictEqual(arg1, '2a');
                    break;
                case 3:
                    assert.strictEqual(arg1, '2b');
                    break;
                }

                counter++;
            });

            emitter.onAny([
                'bad1',
                'bad2'
            ], function () {
                assert.fail();
            });

            var stop = emitter.proxyEvents([
                source1,
                source2
            ], [
                'test1',
                'test2'
            ]);

            source1.emit('bad1');
            source2.emit('bad2');

            var index;
            var loops = 5;
            for (index = 0; index < loops; index++) {
                source1.emit('test1', '1a');
                source1.emit('test2', '1b');
                source2.emit('test1', '2a');
                source2.emit('test2', '2b');
            }

            assert.strictEqual(test1Counter, 10);
            assert.strictEqual(test2Counter, 10);
            assert.strictEqual(counter, 20);

            emitter.onAny([
                'test1',
                'test2'
            ], function () {
                assert.fail();
            });

            stop();

            source1.emit('test1', 'bad');
            source1.emit('test2', 'bad');
            source2.emit('test1', 'bad');
            source2.emit('test2', 'bad');

            stop(); //check if invoked again, nothing should change

            source1.emit('test1', 'bad');
            source1.emit('test2', 'bad');
            source2.emit('test1', 'bad');
            source2.emit('test2', 'bad');
        });
    });

    describe('markEvent', function () {
        it('no input', function () {
            var emitter = createEventEmitter();

            emitter.markEvent();
        });
    });

    describe('enhance', function () {
        it('enhance EventEmitter2', function (done) {
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
