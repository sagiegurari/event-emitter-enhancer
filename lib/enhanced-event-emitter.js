'use strict';

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

/*jslint debug: true */
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
 * If true, all events will not trigger any listener (or 'else' listener).<br>
 * The emit function will simply do nothing.
 *
 * @member {boolean} suspended
 * @memberof! EnhancedEventEmitter
 * @public
 */
EnhancedEventEmitter.prototype.suspended = false;

/**
 * Suspends all emit calls for the provided event name (including 'else' listeners).<br>
 * The emit function will simply do nothing for the specific event.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {string} event - The event to suspend
 */
EnhancedEventEmitter.prototype.suspend = function (event) {
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
EnhancedEventEmitter.prototype.unsuspend = function (event) {
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
 * @example
 ```js
 var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 var emitter = new EnhancedEventEmitter();
 emitter.else(function onNonHandledEvent(event, arg1, arg2) {
  //logic here....

  //to remove 'else' listeners, simply use the unelse function
  emitter.unelse(this);
 });

 emitter.emit('test', 1, 2);
 ```
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
EnhancedEventEmitter.prototype.unelse = EnhancedEventEmitter.prototype.removeElseListener;  //shorter function name

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
 * In case an event with the provided name is emitted but no listener is attached to it,
 * an error event will emitted by this emitter instance instead.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {string} event - The event name
 */
EnhancedEventEmitter.prototype.elseError = function (event) {
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
 * @param {string} event - The event name
 */
EnhancedEventEmitter.prototype.unelseError = EnhancedEventEmitter.prototype.removeElseError;  //shorter function name

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
EnhancedEventEmitter.prototype.emit = function (event) {
    var emitted = false;
    if ((!this.suspended) && ((!this.suspendedEvents) || (!this.suspendedEvents[event]))) {
        var emitArguments = Array.prototype.slice.apply(arguments, [0]);

        if (this.runFilterChain(emitArguments)) {
            emitted = this.baseEmit.apply(this, arguments);
            if (!emitted) {
                emitted = this.handleNoEmit(event, arguments);
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
 * @param {string} event - The event name
 * @param {array} eventArguments - All the arguments to send the else callbacks
 * @returns {boolean} True if a listener or an 'else' listener handled the event
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
 * @param {array} eventArguments - All the arguments to send the else callbacks
 */
EnhancedEventEmitter.prototype.invokeElseListener = function (eventArguments) {
    var index;
    for (index = 0; index < this.elseListeners.length; index++) {
        this.elseListeners[index].apply(this.elseListeners[index], eventArguments);
    }
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
 * @example
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 * emitter.on('test', function onTestEvent(num1, num2) {
     *  //event logic here
     * });
 *
 * emitter.emitAsync('test', 1, 2, function onEmitDone(event, num1, num2, emitted) {
     *  //emit callback logic
     * });
 */
EnhancedEventEmitter.prototype.emitAsync = function () {
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
EnhancedEventEmitter.prototype.onAsync = function (event, listener) {
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
 * @example
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
 * var emitter = new EnhancedEventEmitter();
 *
 * //add filters for test event only
 * var removeTestEventFilter = emitter.filter('test', function (event, arg1, arg2) {
     *  if (arg1 && (arg1 > 3)) {
     *      return true;    //continue with emit
     *  }
     *
     *  return false;   //prevent emit
     * });
 * emitter.filter('test', function (event, arg1, arg2) {
     *  if (arg2 && (arg2 < 20)) {
     *      return true;    //continue with emit
     *  }
     *
     *  return false;   //prevent emit
     * });
 *
 * //add global filter for all events
 * emitter.filter(function (event, arg1, arg2) {
     *  if (arg1 && (arg1 > 5)) {
     *      return true;    //continue with emit
     *  }
     *
     *  return false;   //prevent emit
     * });
 * var removeGlobalArg2Filter = emitter.filter(function (event, arg1, arg2) {
     *  if (arg2 && (arg2 < 18)) {
     *      return true;    //continue with emit
     *  }
     *
     *  return false;   //prevent emit
     * });
 *
 * emitter.on('test', function onTestEvent(arg1, arg2) {
     *  //event logic here...
     * });
 *
 * emitter.emit('test', 10, 15);
 *
 * //remove some filters
 * removeTestEventFilter();
 * removeGlobalArg2Filter();
 */
EnhancedEventEmitter.prototype.addFilter = function () {
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
            if (event) {
                removeFunction = self.addEventFilter(event, filter);
            } else {
                removeFunction = self.addGlobalFilter(filter);
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
 * Adds an event filter (See addFilter)
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {string} event - The event name.
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 */
EnhancedEventEmitter.prototype.addEventFilter = function (event, filter) {
    var self = this;

    self.filters.event = self.filters.event || {};
    self.filters.event[event] = self.filters.event[event] || [];
    self.filters.event[event].push(filter);

    var removeCalled = false;
    return function removeGlobalFilter() {
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

    var removeCalled = false;
    return function removeGlobalFilter() {
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
};

/**
 * See 'addFilter' documentation.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @public
 * @param {string} [event] - The event name. If not provided, the filter is relevant for all events.
 * @param {FilterCallback} filter - The filter function
 * @returns {function} The remove filter function
 */
EnhancedEventEmitter.prototype.filter = EnhancedEventEmitter.prototype.addFilter;  //shorter function name

/**
 * Returns true if to allow to emit the event based on the currently setup filters.
 *
 * @function
 * @memberof! EnhancedEventEmitter
 * @private
 * @param {array} emitArguments - All emit function arguments array
 * @returns {boolean} True to continue with the emit, false to prevent it
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

module.exports = EnhancedEventEmitter;
