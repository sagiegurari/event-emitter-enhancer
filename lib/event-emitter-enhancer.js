'use strict';

//load dependencies
var events = require('events');
var EventEmitter = events.EventEmitter;
var EnhancedEventEmitter = require('./enhanced-event-emitter');

/**
 * This class enables to enhance event emitter prototypes and instances with extra capabilities.
 *
 * @author Sagie Gur-Ari
 * @class EventEmitterEnhancer
 * @public
 */
function EventEmitterEnhancer() {
    this.EnhancedEventEmitter = this.extend(EventEmitter);
}

/**
 * Throws the already enhanced error in case provided input
 * has already been enhanced.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @private
 * @param {Object} type - The type to validate
 */
EventEmitterEnhancer.prototype.validateDoubleEnhancement = function (type) {
    if (type.enhancedEmitterType) {
        throw new Error('Provided input has already been enhanced.');
    }
};

/**
 * Modified/extends the provided object prototype with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @private
 * @param {Object} EmitterType - The object type
 * @param {Number} modifyType - 0 to extend the prototype of the provided object, 1 to modify the prototype of the provided object, 2 to modify the provided instance
 * @returns {Object} The modified object type
 */
EventEmitterEnhancer.prototype.enhance = function (EmitterType, modifyType) {
    var self = this;

    var Emitter;
    var EnhancedEventEmitterType = null;
    switch (modifyType) {
    case 0: //extend prototype
        self.validateDoubleEnhancement(EmitterType.prototype);

        Emitter = function () {
            EmitterType.call(self);
        };

        //extend the provided type
        Emitter.prototype = Object.create(EmitterType.prototype);
        Emitter.prototype.constructor = Emitter;

        EnhancedEventEmitterType = Emitter;
        Emitter = Emitter.prototype;

        break;
    case 1: //modify prototype
        self.validateDoubleEnhancement(EmitterType.prototype);

        Emitter = EmitterType;

        EnhancedEventEmitterType = Emitter;
        Emitter = Emitter.prototype;

        break;
    case 2: //modify instance
        self.validateDoubleEnhancement(EmitterType);

        Emitter = EmitterType;

        break;
    }

    //keep original needed functions before replacing it with enhanced version
    Emitter.baseEmit = Emitter.emit;
    Emitter.baseOn = Emitter.on;
    Emitter.baseOnce = Emitter.once;

    var functions = Object.keys(EnhancedEventEmitter.prototype);
    functions.forEach(function addProperty(property) {
        Emitter[property] = EnhancedEventEmitter.prototype[property];
    });

    return EnhancedEventEmitterType;
};

/**
 * Extends the provided object prototype with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {Object} EmitterType - The object type
 * @returns {Object} The modified object type
 * @example
 * ```js
 * //extend events.EventEmitter class (or any class that has the same interface)
 * //now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
 * var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
 * var emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
 * ```
 */
EventEmitterEnhancer.prototype.extend = function (EmitterType) {
    return this.enhance(EmitterType, 0);
};

/**
 * Modified the provided object prototype with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {Object} EmitterType - The object type
 * @example
 * ```js
 * //modify the proto of an events.EventEmitter class (or any class that has the same interface)
 * //now all existing and future instances of the original class are modified to include the new extended capabilities.
 * EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
 * var emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
 * ```
 */
EventEmitterEnhancer.prototype.modify = function (EmitterType) {
    this.enhance(EmitterType, 1);
};

/**
 * Modified the specific object instance with the extended emitter capabilities.<br>
 * The provided object type must have an Node.js events.EventEmitter compatible interface.
 *
 * @function
 * @memberof! EventEmitterEnhancer
 * @public
 * @param {Object} emitterInstance - The emitter instance
 * @example
 * ```js
 * //modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
 * var emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
 * EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
 * ```
 */
EventEmitterEnhancer.prototype.modifyInstance = function (emitterInstance) {
    this.enhance(emitterInstance, 2);
};

/**
 * The node.js event emitter prototype extended with the extra capabilities.
 *
 * @member {EventEmitter}
 * @alias EventEmitterEnhancer.EnhancedEventEmitter
 * @memberof! EventEmitterEnhancer
 * @public
 */

module.exports = new EventEmitterEnhancer();
