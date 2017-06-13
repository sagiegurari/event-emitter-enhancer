'use strict';

var funcs = require('funcs-js');
var later = require('node-later');
var defer = later();

/**
 * Extends the Node.js events.EventEmitter with extra capabilities.
 *
 * @author Sagie Gur-Ari
 * @namespace EventEmitterEnhancer
 */

/**
 * 'filter' callback.
 *
 * @callback FilterCallback
 * @param {String} type - The event type
 * @param {*} [params] - The event parameters
 * @returns {Boolean} True to continue with the emit, false to prevent emit
 */

/**
 * 'else' callback.
 *
 * @callback ElseCallback
 * @param {String} type - The event type
 * @param {*} [params] - The event parameters
 */

/**
 * 'async-emit' callback.
 *
 * @callback AsyncEmitCallback
 * @param {String} type - The event type
 * @param {*} [params] - The event parameters
 * @param {Boolean} emitted - True if emitted, else false
 */

/*jslint debug: true */
/*istanbul ignore next*/
/**
 * This class holds all the extended capabilities added to any emitter.
 *
 * @author Sagie Gur-Ari
 * @class EnhancedEventEmitter
 * @public
 */
function EnhancedEventEmitter() {
    //should not be called
}
/*jslint debug: false */

/**
 * Marker attribute to prevent multiple wrapping of emitter.
 *
 * @member {Boolean}
 * @alias EnhancedEventEmitter.enhancedEmitterType
 * @memberof! EnhancedEventEmitter
 * @private
 */
EnhancedEventEmitter.prototype.enhancedEmitterType = true;

/**
 * If true, all events will not trigger any listener (or 'else' listener).<br>
 * The emit function will simply do nothing.
 *
 * @member {Boolean}
 * @alias EnhancedEventEmitter.suspended
 * @memberof! EnhancedEventEmitter
 * @public
 */
EnhancedEventEmitter.prototype.suspended = false;

/*eslint-disable valid-jsdoc*/
//jscs:disable jsDoc
/**
 * See node.js events.EventEmitter.on.<br>
 * This function also returns a removeListener function to easily remove the provided listener.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The name of the event
 * @param {function} listener - The callback function
 * @returns {function} The remove listener function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * var remove = emitter.on('error', function (error) {
 *    console.error(error);
 * });
 *
 * //remove listener (no longer need to keep a reference to the listener function)
 * remove();
 * ```
 *
 * @also
 *
 * Enables more complex on capabilities including providing multiple listeners/event names, timeout the listener and more.<br>
 * To remove the listener/s, the returned function must be called instead of doing emitter.removeListener(...)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {Object} options - All options needed to setup the listeners
 * @param {String[]|String} options.event - The event name or an array of event names
 * @param {function[]|function} options.listener - The callback function or an array of callback functions
 * @param {Boolean} [options.async=false] - If true, the callback functions will be called after next tick
 * @param {Number} [options.timeout] - If provided, the returned remove listener function will be called after the provided timeout value in millies (unless called manually before the timeout was triggered)
 * @returns {function} The remove listener function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * var removeListener = emitter.on({
 *   event: ['error', 'connection-error', 'write-error', 'read-error'], //The event names (can be string for a single event)
 *   listener: [ //The listener callback functions (can be a function instead of an array for a single listener callback)
 *     function firstListener(arg1, arg2) {
 *       //do something
 *     },
 *     function secondListener(arg1, arg2) {
 *       //do something
 *     }
 *   ],
 *   async: true, //The callback functions will be called after next tick
 *   timeout: 1500 //All listeners will be removed after the provided timeout (if not provided, listeners can only be removed manually via returned function)
 * });
 *
 * //emit any event
 * emitter.emit('write-error', 1, 2, 3);
 *
 * //once done, remove all listeners from all events
 * removeListener();
 * ```
 */
EnhancedEventEmitter.prototype.on = function (eventOrOptions, listener) {
    var self = this;
    var removeListener;

    if (eventOrOptions && (!listener) && (typeof eventOrOptions === 'object') && eventOrOptions.listener && eventOrOptions.event) {
        var listeners = eventOrOptions.listener;
        if (typeof listeners === 'function') {
            listeners = [
                listeners
            ];
        }

        var events = eventOrOptions.event;

        var asyncOn = eventOrOptions.async;

        var timeout = eventOrOptions.timeout || 0;
        var timeoutID;

        var getListener = function (eventListener) {
            var onEvent = eventListener;

            if (asyncOn) {
                onEvent = self.asAsyncListener(eventListener);
            }

            return onEvent;
        };

        var removeFunction;
        var removeFunctions = [];
        var index;
        for (index = 0; index < listeners.length; index++) {
            listener = listeners[index];

            listener = getListener(listener);

            removeFunction = self.onAny(events, listener);

            removeFunctions.push(removeFunction);
        }

        removeListener = function () {
            var funcIndex;
            for (funcIndex = 0; funcIndex < removeFunctions.length; funcIndex++) {
                removeFunctions[funcIndex]();
            }

            if (timeoutID) {
                clearTimeout(timeoutID);
                timeoutID = null;
            }
        };

        if (timeout && (timeout > 0)) {
            timeoutID = setTimeout(removeListener, timeout);
        }
    } else {
        this.baseOn(eventOrOptions, listener);

        removeListener = function () {
            self.removeListener(eventOrOptions, listener);
        };
    }

    removeListener = funcs.once(removeListener);

    return removeListener;
};
//jscs:enable jsDoc
/*eslint-enable valid-jsdoc*/

/**
 * See node.js events.EventEmitter.once.<br>
 * This function also returns a removeListener function to easily remove the provided listener.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The name of the event
 * @param {function} listener - The callback function
 * @returns {function} The remove listener function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * var remove = emitter.once('error', function (error) {
 *    console.error(error);
 * });
 *
 * //remove listener (no longer need to keep a reference to the listener function)
 * remove();
 * ```
 */
EnhancedEventEmitter.prototype.once = function (event, listener) {
    var self = this;

    this.baseOnce(event, listener);

    return funcs.once(function removeListener() {
        self.removeListener(event, listener);
    });
};

/**
 * Suspends all emit calls for the provided event name (including 'else' listeners).<br>
 * For suspended events, the emit function will simply do nothing ('else' listeners won't be invoked either).
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event to suspend
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.on('test', function () {
 *   //will never be called
 * });
 *
 * emitter.suspended = true;  //suspend ALL events (to unsuspend use emitter.suspended = false;)
 * //or
 * emitter.suspend('test');   //suspend only 'test' event (to unsuspend use emitter.unsuspend('test');)
 *
 * emitter.emit('test');
 * ```
 */
EnhancedEventEmitter.prototype.suspend = function (event) {
    this.suspendedEvents = this.markEvent(event, this.suspendedEvents);
};

/**
 * Unsuspends the emit calls for the provided event name.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event to unsuspend
 */
EnhancedEventEmitter.prototype.unsuspend = function (event) {
    if (event && this.suspendedEvents) {
        delete this.suspendedEvents[event];
    }
};

/**
 * Adds an 'else' listener which will be triggered by all events that do not have a listener currently for them (apart of the special 'error' event).
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {ElseCallback} listener - The listener that will catch all 'else' events
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.else(function onUnhandledEvent(event, arg1, arg2) {
 *  //logic here....
 *
 *  //to remove 'else' listeners, simply use the unelse function
 *  emitter.unelse(this);
 * });
 *
 * emitter.emit('test', 1, 2);
 * ```
 */
EnhancedEventEmitter.prototype.else = function (listener) {
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
EnhancedEventEmitter.prototype.removeElseListener = function (listener) {
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
 * See 'removeElseListener' documentation.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {ElseCallback} listener - The listener to remove
 */
EnhancedEventEmitter.prototype.unelse = EnhancedEventEmitter.prototype.removeElseListener; //shorter function name

/**
 * Removes all 'else' listeners.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 */
EnhancedEventEmitter.prototype.removeAllElseListeners = function () {
    if (this.elseListeners && this.elseListeners.length) {
        this.elseListeners.splice(0, this.elseListeners.length);
    }
};

/**
 * In case an event with the provided name is emitted but no listener is attached to it, an error event will emitted by this emitter instance instead.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.on('error', function (error) {
 *   //logic here...
 *
 *   //To remove elseError
 *   emitter.unelseError('test');
 * });
 *
 * emitter.elseError('test');
 *
 * emitter.emit('test');
 * ```
 */
EnhancedEventEmitter.prototype.elseError = function (event) {
    this.elseErrorEvents = this.markEvent(event, this.elseErrorEvents);
};

/**
 * Removes the else-error handler for the provided event.<br>
 * Same as 'unelseError' function.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 */
EnhancedEventEmitter.prototype.removeElseError = function (event) {
    if (event && this.elseErrorEvents) {
        delete this.elseErrorEvents[event];
    }
};

/**
 * See 'removeElseError' documentation.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 */
EnhancedEventEmitter.prototype.unelseError = EnhancedEventEmitter.prototype.removeElseError; //shorter function name

/**
 * See Node.js events.EventEmitter documentation.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 * @param {*} [params] - The event parameters
 * @returns {Boolean} True if a listener or an 'else' listener handled the event
 */
EnhancedEventEmitter.prototype.emit = function (event) {
    var emitted = false;
    if ((!this.suspended) && ((!this.suspendedEvents) || (!this.suspendedEvents[event]))) {
        var emitArguments = arguments;

        if (this.runFilterChain(emitArguments)) {
            emitted = this.baseEmit.apply(this, emitArguments);
            if (!emitted) {
                emitted = this.handleNoEmit(event, emitArguments);
            }
        }
    }

    return emitted;
};

/**
 * Handles events which had no listeners.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {String} event - The event name
 * @param {Array} eventArguments - All the arguments to send the else callbacks
 * @returns {Boolean} True if a listener or an 'else' listener handled the event
 */
EnhancedEventEmitter.prototype.handleNoEmit = function (event, eventArguments) {
    var emitted = false;
    var elseErrorDefined = (this.elseErrorEvents && this.elseErrorEvents[event]);
    if ((this.elseListeners && this.elseListeners.length) || elseErrorDefined) {
        if (elseErrorDefined) {
            this.emit('error', new Error('No listener attached for event: ' + event));
        } else {
            this.invokeElseListener(eventArguments);
            emitted = true;
        }
    }

    return emitted;
};

/**
 * Invokes all of the 'else' listeners.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {Array} eventArguments - All the arguments to send the else callbacks
 */
EnhancedEventEmitter.prototype.invokeElseListener = function (eventArguments) {
    var index;
    for (index = 0; index < this.elseListeners.length; index++) {
        this.elseListeners[index].apply(this.elseListeners[index], eventArguments);
    }
};

/**
 * Invokes the emit after a timeout to enable calling flow to continue and not block due to event listeners.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 * @param {*} [params] - The event parameters (if last param is a function, it is considered as the callback of the emitAsync)
 * @param {AsyncEmitCallback} [callback] - The async callback
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.on('test', function onTestEvent(num1, num2) {
 *    //event logic here
 * });
 *
 * emitter.emitAsync('test', 1, 2, function onEmitDone(event, num1, num2, emitted) {
 *    //emit callback logic
 * });
 * ```
 */
EnhancedEventEmitter.prototype.emitAsync = function (event) {
    if ((!event) || (typeof event !== 'string')) {
        throw new Error('Event not provided.');
    }

    var self = this;

    var callback;
    var argumentsArray = Array.prototype.splice.call(arguments, 0);
    if ((argumentsArray.length > 1) && (typeof argumentsArray[argumentsArray.length - 1] === 'function')) {
        callback = argumentsArray.pop();
    }

    defer(function invokeEmit() {
        var emitted = self.emit.apply(self, argumentsArray);

        if (callback) {
            argumentsArray.push(emitted);
            callback.apply(callback, argumentsArray);
        }
    });
};

/**
 * Adds a listener that will be triggered after a timeout during an emit.<br>
 * This ensures that the provided listener is invoked after all other listeners and that it will not block the emit caller flow.<br>
 * To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name
 * @param {function} listener - The listener function
 * @returns {function} The remove listener function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.on('test', function onEventSync() {
 *   //sync handle function logic
 * });
 * var removeListener = emitter.onAsync('test', function onEventAsync() {
 *   //async handle function logic
 * });
 *
 * emitter.emit('test', 1, 2);
 *
 * //remove the async listener
 * removeListener();
 * ```
 */
EnhancedEventEmitter.prototype.onAsync = function (event, listener) {
    var removeAsyncListener = null;
    if (event && listener && (typeof listener === 'function')) {
        var self = this;

        var onEvent = self.asAsyncListener(listener);

        self.on(event, onEvent);

        removeAsyncListener = funcs.once(function removeListener() {
            self.removeListener(event, onEvent);
        });
    } else {
        throw new Error('Missing mandatory parameters');
    }

    return removeAsyncListener;
};

/**
 * Adds a listener to all provided event names.<br>
 * To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String|Array} events - The event name/s
 * @param {function} listener - The listener function
 * @returns {function} The remove listener function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * //add same listener to multiple events
 * var remove = emitter.onAny(['test1', 'test2', 'test3'], function (arg1, arg2, arg3) {
 *    console.log(arg1, arg2, arg3);
 * });
 *
 * //remove listener from all events
 * remove();
 * ```
 */
EnhancedEventEmitter.prototype.onAny = function (events, listener) {
    var self = this;

    var removeListener = null;
    if (events && listener && (typeof listener === 'function')) {
        if (Array.isArray(events)) {
            var index;
            for (index = 0; index < events.length; index++) {
                self.on(events[index], listener);
            }

            removeListener = function () {
                for (index = 0; index < events.length; index++) {
                    self.removeListener(events[index], listener);
                }
            };
        } else {
            self.on(events, listener);

            removeListener = function () {
                self.removeListener(events, listener);
            };
        }
    } else {
        throw new Error('Missing mandatory parameters');
    }

    removeListener = funcs.once(removeListener);

    return removeListener;
};

/**
 * Adds a filter that will be triggered before every emit for the provided event type (if no event is provided, than the filter is invoked for all events).<br>
 * The filter enables to prevent events from reaching the listeners in case some criteria is met.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} [event] - The event name. If not provided, the filter is relevant for all events.
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * //add filters for test event only
 * var removeTestEventFilter = emitter.filter('test', function (event, arg1, arg2) {
 *    if (arg1 && (arg1 > 3)) {
 *        return true;    //continue with emit
 *    }
 *
 *    return false;   //prevent emit
 * });
 * emitter.filter('test', function (event, arg1, arg2) {
 *    if (arg2 && (arg2 < 20)) {
 *        return true;    //continue with emit
 *    }
 *
 *    return false;   //prevent emit
 * });
 *
 * //add global filter for all events
 * emitter.filter(function (event, arg1, arg2) {
 *    if (arg1 && (arg1 > 5)) {
 *        return true;    //continue with emit
 *    }
 *
 *    return false;   //prevent emit
 * });
 * var removeGlobalArg2Filter = emitter.filter(function (event, arg1, arg2) {
 *    if (arg2 && (arg2 < 18)) {
 *        return true;    //continue with emit
 *    }
 *
 *    return false;   //prevent emit
 * });
 *
 * emitter.on('test', function onTestEvent(arg1, arg2) {
 *    //event logic here...
 * });
 *
 * emitter.emit('test', 10, 15);
 *
 * //remove some filters
 * removeTestEventFilter();
 * removeGlobalArg2Filter();
 * ```
 */
EnhancedEventEmitter.prototype.addFilter = function (event, filter) {
    var self = this;
    var removeFunction = null;

    if ((!filter) && event && (typeof event === 'function')) {
        filter = event;
        event = null;
    }

    if (!filter) {
        throw new Error('Filter not provided.');
    }

    if (typeof filter !== 'function') {
        throw new Error('Filter is not a function.');
    }

    self.filters = self.filters || {};
    if (event) {
        removeFunction = self.addEventFilter(event, filter);
    } else {
        removeFunction = self.addGlobalFilter(filter);
    }

    return removeFunction;
};

/**
 * Adds an event filter (See addFilter)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} event - The event name.
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 */
EnhancedEventEmitter.prototype.addEventFilter = function (event, filter) {
    var self = this;

    self.filters.event = self.filters.event || {};
    self.filters.event[event] = self.filters.event[event] || [];
    self.filters.event[event].push(filter);

    return funcs.once(function removeEventFilter() {
        if (self.filters && self.filters.event && self.filters.event[event] && self.filters.event[event].length) {
            var index = self.filters.event[event].indexOf(filter);

            if (index !== -1) {
                self.filters.event[event].splice(index, 1);
            }
        }
    });
};

/**
 * Adds a global filter (See addFilter)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 */
EnhancedEventEmitter.prototype.addGlobalFilter = function (filter) {
    var self = this;

    self.filters.global = self.filters.global || [];
    self.filters.global.push(filter);

    return funcs.once(function removeGlobalFilter() {
        if (self.filters && self.filters.global && self.filters.global.length) {
            var index = self.filters.global.indexOf(filter);

            if (index !== -1) {
                self.filters.global.splice(index, 1);
            }
        }
    });
};

/**
 * See 'addFilter' documentation.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {String} [event] - The event name. If not provided, the filter is relevant for all events.
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 */
EnhancedEventEmitter.prototype.filter = EnhancedEventEmitter.prototype.addFilter; //shorter function name

/**
 * Will setup an event proxy so if any of the requested event/s are fired from the provided emitter/s, they will be triggered by this emitter.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {Object[]|Object} emitters - An event emitter or array of event emitters to proxy the events from
 * @param {String[]|String} events - A single event name or an array of event names to proxy from the provided emitter/s
 * @returns {function} Once invoked, will stop proxying of events
 * @example
 * ```js
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * //proxy the 'data' and 'end' events from all sockets
 * var stop = emitter.proxyEvents(sockets, ['data', 'end']);
 *
 * //listen to events via emitter
 * emitter.on('data', onData);
 *
 * //stop events proxy
 * stop();
 * ```
 */
EnhancedEventEmitter.prototype.proxyEvents = function (emitters, events) {
    if (!emitters) {
        throw new Error('Event Emitter/s not provided.');
    }

    if (!events) {
        throw new Error('Event/s not provided.');
    }

    var self = this;

    if (!Array.isArray(emitters)) {
        emitters = [
            emitters
        ];
    }

    if (typeof events === 'string') {
        events = [
            events
        ];
    }

    var releaseFuncs = [];
    events.forEach(function createProxy(event) {
        emitters.forEach(function onClientEvent(emitter) {
            var onEvent = function onEvent() {
                //get event arguments
                var argumentsArray = Array.prototype.slice.call(arguments, 0);

                //add event name to list
                argumentsArray.unshift(event);

                //emit event
                self.emit.apply(self, argumentsArray);
            };

            emitter.on(event, onEvent);

            releaseFuncs.push(function stop() {
                emitter.removeListener(event, onEvent);
            });
        });
    });

    return function stopProxy() {
        if (releaseFuncs && releaseFuncs.length) {
            releaseFuncs.forEach(function invokeStop(release) {
                release();
            });

            releaseFuncs = null;
        }
    };
};

/**
 * Converts the provided listener function to be async.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {function} listener - The listener function
 * @returns {function} The async listener
 * @example
 * ```js
 * var asyncListner = emitter.asAsyncListener(listner);
 * emitter.on('my_event', asyncListner);
 * ```
 */
EnhancedEventEmitter.prototype.asAsyncListener = function (listener) {
    var onEvent;
    if (listener && (typeof listener === 'function')) {
        onEvent = function () {
            var argumentsArray = arguments;

            defer(function invokeListener() {
                listener.apply(listener, argumentsArray);
            });
        };
    } else {
        throw new Error('Missing mandatory parameters');
    }

    return onEvent;
};

/**
 * Returns true if to allow to emit the event based on the currently setup filters.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {Array} emitArguments - All emit function arguments array
 * @returns {Boolean} True to continue with the emit, false to prevent it
 */
EnhancedEventEmitter.prototype.runFilterChain = function (emitArguments) {
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

/**
 * Marks the given event in the events map.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {String} event - The event name to mark
 * @param {Object} [events] - The events map
 * @returns {Object} The updated events map
 */
EnhancedEventEmitter.prototype.markEvent = function (event, events) {
    if (event) {
        events = events || {};
        events[event] = true;
    }

    return events;
};

module.exports = EnhancedEventEmitter;
