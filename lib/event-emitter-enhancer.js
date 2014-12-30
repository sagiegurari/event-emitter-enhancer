'use strict';

/**
 * Extends the Node.js events.EventEmitter with extra capabilities.
 *
 * @author Sagie Gur-Ari
 * @namespace EventEmitterEnhancer
 */

/**
 * Extended version of the Node.js events.EventEmitter with extra capabilities.
 *
 * @author Sagie Gur-Ari
 * @class EnhancedEventEmitter
 */

/**
 * 'filter' callback.
 *
 * @callback FilterCallback
 * @param {string} type - The event type
 * @param {*} [params] - The event parameters
 * @returns {boolean} True to continue with the emit, false to prevent emit
 */

/**
 * 'else' callback.
 *
 * @callback ElseCallback
 * @param {string} type - The event type
 * @param {*} [params] - The event parameters
 */

/**
 * 'async-emit' callback.
 *
 * @callback AsyncEmitCallback
 * @param {string} type - The event type
 * @param {*} [params] - The event parameters
 * @param {boolean} emitted - True if emitted, else false
 */

/**
 * Modified the provided object prototype with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {object} EmitterType - The object type
 */
function enhance(EmitterType) {
    //keep original emit before replacing it with enhanced version
    var baseEmit = EmitterType.prototype.emit;

    /**
     * If true, all events will not trigger any listener (or 'else' listener).<br>
     * The emit function will simply do nothing.
     *
     * @member {boolean}
     * @memberof! EnhancedEventEmitter
     * @public
     */
    EmitterType.prototype.suspended = false;

    /**
     * Suspends all emit calls for the provided event name (including 'else' listeners).<br>
     * The emit function will simply do nothing for the specific event.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event to suspend
     */
    EmitterType.prototype.suspend = function (event) {
        if (event) {
            this.suspendedEvents = this.suspendedEvents || {};
            this.suspendedEvents[event] = true;
        }
    };

    /**
     * Unsuspends the emit calls for the provided event name.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event to unsuspend
     */
    EmitterType.prototype.unsuspend = function (event) {
        if (event && this.suspendedEvents) {
            delete this.suspendedEvents[event];
        }
    };

    /**
     * Adds an 'else' listener which will be triggered by all events that do not have a
     * listener currently for them (apart of the special 'error' event).
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {ElseCallback} listener - The listener that will catch all 'else' events
     */
    EmitterType.prototype.else = function (listener) {
        this.elseListeners = this.elseListeners || [];
        this.elseListeners.push(listener);
    };

    /**
     * Removes the provided 'else' listener.<br>
     * Same as 'unelse' function.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {ElseCallback} listener - The listener to remove
     */
    EmitterType.prototype.removeElseListener = function (listener) {
        if (listener && this.elseListeners && this.elseListeners.length) {
            var index;
            do {
                index = this.elseListeners.indexOf(listener);
                if (index !== -1) {
                    this.elseListeners.splice(index, 1);
                }
            } while (index !== -1);
        }
    };

    /**
     * Removes the provided 'else' listener.<br>
     * Same as 'removeElseListener' function.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {ElseCallback} listener - The listener to remove
     */
    EmitterType.prototype.unelse = EmitterType.prototype.removeElseListener;  //shorter function name

    /**
     * Removes all 'else' listeners.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     */
    EmitterType.prototype.removeAllElseListeners = function () {
        if (this.elseListeners && this.elseListeners.length) {
            this.elseListeners.splice(0, this.elseListeners.length);
        }
    };

    /**
     * In case an event with the provided name is emitted but no listener is attached to it,
     * an error event will emitted by this emitter instance instead.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     */
    EmitterType.prototype.elseError = function (event) {
        if (event) {
            this.elseErrorEvents = this.elseErrorEvents || {};
            this.elseErrorEvents[event] = true;
        }
    };

    /**
     * Removes the else-error handler for the provided event.<br>
     * Same as 'unelseError' function.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     */
    EmitterType.prototype.removeElseError = function (event) {
        if (event && this.elseErrorEvents) {
            delete this.elseErrorEvents[event];
        }
    };

    /**
     * Removes the else-error handler for the provided event.<br>
     * Same as 'removeElseError' function.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     */
    EmitterType.prototype.unelseError = EmitterType.prototype.removeElseError;  //shorter function name

    /**
     * See Node.js events.EventEmitter documentation.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     * @param {*} [params] - The event parameters
     * @returns {boolean} True if a listener or an 'else' listener handled the event
     */
    EmitterType.prototype.emit = function (event) {
        var emitted = false;
        if ((!this.suspended) && ((!this.suspendedEvents) || (!this.suspendedEvents[event]))) {
            var emitArguments = Array.prototype.slice.apply(arguments, [0]);

            if (this.runFilterChain(emitArguments)) {
                emitted = baseEmit.apply(this, arguments);
                if (!emitted) {
                    var elseErrorDefined = (this.elseErrorEvents && this.elseErrorEvents[event]);
                    if ((this.elseListeners && this.elseListeners.length) || elseErrorDefined) {
                        if (elseErrorDefined) {
                            this.emit('error', new Error('No listener attached for event: ' + event));
                        } else {
                            var index;
                            for (index = 0; index < this.elseListeners.length; index++) {
                                this.elseListeners[index].apply(this.elseListeners[index], arguments);
                            }

                            emitted = true;
                        }
                    }
                }
            }
        }

        return emitted;
    };

    /**
     * Invokes the emit after a timeout to enable calling flow to continue and not
     * block due to event listeners.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     * @param {*} [params] - The event parameters
     * @param {AsyncEmitCallback} callback - The async callback
     */
    EmitterType.prototype.emitAsync = function () {
        if (arguments.length >= 2) {
            var self = this;
            var argumentsArray = Array.prototype.splice.apply(arguments, [0]);
            var callback = argumentsArray.pop();

            if (typeof callback === 'function') {
                process.nextTick(function invokeEmit() {
                    var emitted = self.emit.apply(self, argumentsArray);
                    argumentsArray.push(emitted);

                    callback.apply(callback, argumentsArray);
                });
            } else {
                throw new Error('Missing callback');
            }
        } else {
            throw new Error('Missing mandatory parameters');
        }
    };

    /**
     * Adds a listener that will be triggered after a timeout during an emit.<br>
     * This ensures that the provided listener is invoked after all other listeners and that
     * it will not block the emit caller flow.<br>
     * To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} event - The event name
     * @param {function} listener - The listener function
     * @returns {function} The remove listener function
     */
    EmitterType.prototype.onAsync = function (event, listener) {
        var removeFunction = null;
        if (event && listener && (typeof listener === 'function')) {
            var onEvent = function () {
                var argumentsArray = Array.prototype.splice.apply(arguments, [0]);

                process.nextTick(function invokeListener() {
                    listener.apply(listener, argumentsArray);
                });
            };

            var self = this;
            self.on(event, onEvent);

            var removeCalled = false;
            removeFunction = function removeAsyncListener() {
                if (!removeCalled) {
                    self.removeListener(event, onEvent);
                    removeCalled = true;
                }
            };
        } else {
            throw new Error('Missing mandatory parameters');
        }

        return removeFunction;
    };

    /**
     * Adds a filter that will be triggered before every emit for the provided event type (if
     * no event is provided, than the filter is invoked for all events).<br>
     * The filter enables to prevent events from reaching the listeners in case some criteria is met.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} [event] - The event name. If not provided, the filter is relevant for all events.
     * @param {FilterCallback} filter - The filter function
     * @returns {function} The remove filter function
     */
    EmitterType.prototype.addFilter = function () {
        var self = this;
        var removeFunction = null;

        var argumentsArray = Array.prototype.splice.apply(arguments, [0]);
        if (argumentsArray.length) {
            //get filter function
            var filter = argumentsArray.pop();
            if (filter && (typeof filter === 'function')) {
                var event = null;
                if (argumentsArray.length === 1) {
                    event = argumentsArray[0];
                } else if (argumentsArray.length > 1) {
                    throw new Error('Invalid arguments count provided.');
                }

                self.filters = self.filters || {};
                var removeCalled = false;
                if (event) {
                    self.filters.event = self.filters.event || {};
                    self.filters.event[event] = self.filters.event[event] || [];
                    self.filters.event[event].push(filter);

                    removeFunction = function removeGlobalFilter() {
                        if (!removeCalled) {
                            if (self.filters && self.filters.event && self.filters.event[event] && self.filters.event[event].length) {
                                var index = self.filters.event[event].indexOf(filter);
                                if (index !== -1) {
                                    self.filters.event[event].splice(index, 1);
                                }
                            }
                            removeCalled = true;
                        }
                    };
                } else {
                    self.filters.global = self.filters.global || [];
                    self.filters.global.push(filter);

                    removeFunction = function removeGlobalFilter() {
                        if (!removeCalled) {
                            if (self.filters && self.filters.global && self.filters.global.length) {
                                var index = self.filters.global.indexOf(filter);
                                if (index !== -1) {
                                    self.filters.global.splice(index, 1);
                                }
                            }
                            removeCalled = true;
                        }
                    };
                }
            } else {
                throw new Error('Missing mandatory filter function.');
            }
        } else {
            throw new Error('Missing mandatory parameters');
        }

        return removeFunction;
    };

    /**
     * Adds a filter that will be triggered before every emit for the provided event type (if
     * no event is provided, than the filter is invoked for all events).<br>
     * The filter enables to prevent events from reaching the listeners in case some criteria is met.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @public
     * @param {string} [event] - The event name. If not provided, the filter is relevant for all events.
     * @param {FilterCallback} filter - The filter function
     * @returns {function} The remove filter function
     */
    EmitterType.prototype.filter = EmitterType.prototype.addFilter;  //shorter function name

    /**
     * Returns true if to allow to emit the event based on the currently setup filters.
     *
     * @function
     * @memberof! EnhancedEventEmitter
     * @private
     * @param {array} emitArguments - All emit function arguments array
     * @returns {boolean} True to continue with the emit, false to prevent it
     */
    EmitterType.prototype.runFilterChain = function (emitArguments) {
        if (this.filters) {
            //first check global filters
            var index;
            var filter;
            if (this.filters.global && this.filters.global.length) {
                for (index = 0; index < this.filters.global.length; index++) {
                    filter = this.filters.global[index];
                    if (!filter.apply(filter, emitArguments)) {
                        return false;
                    }
                }
            }

            //get event
            var event = emitArguments[0];

            //check event specific filters
            if (this.filters.event && this.filters.event[event] && this.filters.event[event].length) {
                for (index = 0; index < this.filters.event[event].length; index++) {
                    filter = this.filters.event[event][index];
                    if (!filter.apply(filter, emitArguments)) {
                        return false;
                    }
                }
            }
        }

        return true;
    };
}

var EventEmitterEnhancer = {
    enhance: enhance
};

//load dependencies
var events = require('events');
var EventEmitter = events.EventEmitter;

//modify the Node.js events.EventEmitter prototype
EventEmitterEnhancer.enhance(EventEmitter);

module.exports = EventEmitterEnhancer;
