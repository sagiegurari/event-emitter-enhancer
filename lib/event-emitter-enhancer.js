'use strict';

//load emitter
var EnhancedEventEmitter = require('./enhanced-event-emitter');

/**
 * Modified/extends the provided object prototype with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @private
 * @param {object} EmitterType - The object type
 * @param {number} modifyType - 0 to extend the prototype of the provided object, 1 to modify the prototype of the provided object, 2 to modify the provided instance
 * @returns {object} The modified object type
 */
function enhance(EmitterType, modifyType) {
    var Emitter;
    var EnhancedEventEmitterType = null;
    switch (modifyType) {
    case 0:
        Emitter = function () {
            EmitterType.call(this);
        };

        //extend the provided type
        Emitter.prototype = Object.create(EmitterType.prototype);
        Emitter.prototype.constructor = Emitter;

        EnhancedEventEmitterType = Emitter;
        Emitter = Emitter.prototype;

        break;
    case 1:
        Emitter = EmitterType;

        EnhancedEventEmitterType = Emitter;
        Emitter = Emitter.prototype;

        break;
    case 2:
        Emitter = EmitterType;

        break;
    }

    //keep original emit before replacing it with enhanced version
    Emitter.baseEmit = Emitter.emit;

    var functions = Object.keys(EnhancedEventEmitter.prototype);
    functions.forEach(function addProperty(property) {
        Emitter[property] = EnhancedEventEmitter.prototype[property];
    });

    return EnhancedEventEmitterType;
}

var EventEmitterEnhancer = {
    /**
     * Extends the provided object prototype with the extended emitter capabilities.<br>
     * The provided object type must have an Node.js events.EventEmitter compatible interface.
     *
     * @function
     * @memberof! EventEmitterEnhancer
     * @public
     * @param {object} EmitterType - The object type
     * @returns {object} The modified object type
     * @example
     ```js
     //extend events.EventEmitter class (or any class that has the same interface)
     //now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
     var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
     var emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
     ```
     */
    extend: function extend(EmitterType) {
        return enhance(EmitterType, 0);
    },
    /**
     * Modified the provided object prototype with the extended emitter capabilities.<br>
     * The provided object type must have an Node.js events.EventEmitter compatible interface.
     *
     * @function
     * @memberof! EventEmitterEnhancer
     * @public
     * @param {object} EmitterType - The object type
     * @example
     ```js
     //modify the proto of an events.EventEmitter class (or any class that has the same interface)
     //now all existing and future instances of the original class are modified to include the new extended capabilities.
     EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
     var emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
     ```
     */
    modify: function modify(EmitterType) {
        enhance(EmitterType, 1);
    },
    /**
     * Modified the specific object instance with the extended emitter capabilities.<br>
     * The provided object type must have an Node.js events.EventEmitter compatible interface.
     *
     * @function
     * @memberof! EventEmitterEnhancer
     * @public
     * @param {object} emitterInstance - The emitter instance
     * @example
     ```js
     //modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
     var emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
     EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
     ```
     */
    modifyInstance: function modify(emitterInstance) {
        enhance(emitterInstance, 2);
    }
};

//load dependencies
var events = require('events');
var EventEmitter = events.EventEmitter;

/**
 * The node.js event emitter prototype extended with the extra capabilities.
 *
 * @member {EventEmitter} EnhancedEventEmitter
 * @memberof! EventEmitterEnhancer
 * @public
 */
EventEmitterEnhancer.EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);

module.exports = EventEmitterEnhancer;
