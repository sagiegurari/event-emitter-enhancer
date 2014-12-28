'use strict';

/**
 * Extends the Node.js events.EventEmitter with extra capabilities.
 *
 * @author Sagie Gur-Ari
 * @namespace EventEmitterEnhancer
 */

/**
 * 'else' callback.
 *
 * @callback ElseCallback
 * @param {string} type - The event type
 * @param {*} [params] - The event parameters
 */

//load dependencies
var events = require('events');
var EventEmitter = events.EventEmitter;

//keep original emit before replacing it with enhanced version
var baseEmit = EventEmitter.prototype.emit;

/**
 * If true, all events will not trigger any listener (or 'else' listener).<br>
 * The emit function will simply do nothing.
 *
 * @member {boolean}
 * @memberof! EventEmitterEnhancer
 * @public
 */
EventEmitter.prototype.suspended = false;

/**
 * Suspends all emit calls for the provided event name (including 'else' listeners).<br>
 * The emit function will simply do nothing for the specific event.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event to suspend
 */
EventEmitter.prototype.suspend = function (event) {
    if (event) {
        this.suspendedEvents = this.suspendedEvents || {};
        this.suspendedEvents[event] = true;
    }
};

/**
 * Unsuspends the emit calls for the provided event name.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event to unsuspend
 */
EventEmitter.prototype.unsuspend = function (event) {
    if (event && this.suspendedEvents) {
        delete this.suspendedEvents[event];
    }
};

/**
 * Adds an 'else' listener which will be triggered by all events that do not have a
 * listener currently for them (apart of the special 'error' event).
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {ElseCallback} listener - The listener that will catch all 'else' events
 */
EventEmitter.prototype.else = function (listener) {
    this.elseListeners = this.elseListeners || [];
    this.elseListeners.push(listener);
};

/**
 * Removes the provided 'else' listener.<br>
 * Same as 'unelse' function.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {ElseCallback} listener - The listener to remove
 */
EventEmitter.prototype.removeElseListener = function (listener) {
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
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {ElseCallback} listener - The listener to remove
 */
EventEmitter.prototype.unelse = EventEmitter.prototype.removeElseListener;  //shorter function name

/**
 * Removes all 'else' listeners.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 */
EventEmitter.prototype.removeAllElseListeners = function () {
    if (this.elseListeners && this.elseListeners.length) {
        this.elseListeners.splice(0, this.elseListeners.length);
    }
};

/**
 * In case an event with the provided name is emitted but no listener is attached to it,
 * an error event will emitted by this emitter instance instead.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event name
 */
EventEmitter.prototype.elseError = function (event) {
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
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event name
 */
EventEmitter.prototype.removeElseError = function (event) {
    if (event && this.elseErrorEvents) {
        delete this.elseErrorEvents[event];
    }
};

/**
 * Removes the else-error handler for the provided event.<br>
 * Same as 'removeElseError' function.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event name
 */
EventEmitter.prototype.unelseError = EventEmitter.prototype.removeElseError;  //shorter function name

/**
 * See Node.js events.EventEmitter documentation.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {string} event - The event name
 * @param {*} [params] - The event parameters
 * @returns {boolean} True if a listener or an 'else' listener handled the event
 */
EventEmitter.prototype.emit = function (event) {
    var emitted = false;
    if ((!this.suspended) && ((!this.suspendedEvents) || (!this.suspendedEvents[event]))) {
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

    return emitted;
};
