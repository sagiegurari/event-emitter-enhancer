# event-emitter-enhancer

[![NPM Version](http://img.shields.io/npm/v/event-emitter-enhancer.svg?style=flat)](https://www.npmjs.org/package/event-emitter-enhancer) [![Build Status](https://img.shields.io/travis/sagiegurari/event-emitter-enhancer.svg?style=flat)](http://travis-ci.org/sagiegurari/event-emitter-enhancer) [![Coverage Status](https://img.shields.io/coveralls/sagiegurari/event-emitter-enhancer.svg?style=flat)](https://coveralls.io/r/sagiegurari/event-emitter-enhancer) [![bitHound Score](https://www.bithound.io/sagiegurari/event-emitter-enhancer/badges/score.svg)](https://www.bithound.io/sagiegurari/event-emitter-enhancer) [![License](https://img.shields.io/npm/l/event-emitter-enhancer.svg?style=flat)](https://github.com/sagiegurari/event-emitter-enhancer/blob/master/LICENSE)<br>
[![DevDependencies](http://img.shields.io/david/dev/sagiegurari/event-emitter-enhancer.svg?style=flat)](https://david-dm.org/sagiegurari/event-emitter-enhancer#info=devDependencies)

> Extends the Node.js events.EventEmitter to provide additional functionality.

## Overview
This library extends the Node.js events.EventEmitter to provide additional functionality.

## Usage
First you must require this library as follows:

```js
var EventEmitterEnhancer = require('event-emitter-enhancer');
```

Next you can either modify the proto of an EventEmiter type class, or extend it to get a new custom type or modify a specific emitter instance.

```js
var EventEmitter = require('events').EventEmitter;

//extend events.EventEmitter class (or any class that has the same interface)
//now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
var emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.

//modify the proto of an events.EventEmitter class (or any class that has the same interface)
//now all existing and future instances of the original class are modified to include the new extended capabilities.
EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
var emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.

//modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
var emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
```

## 'emitter.else(listener)'
'else' enables you to attach listeners to all events that do not have any active listeners (apart of the special 'error' event).

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

## 'emitter.suspend(event)'
'suspend' enables you to suspend specific or all events until unsuspend is called.

For suspended events, the emit function will simply do nothing ('else' listeners won't be invoked either).

```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();
emitter.on('test', function () {
    //will never be called
});

emitter.suspended = true;  //suspend ALL events (to unsuspend use emitter.suspended = false;)
//or
emitter.suspend('test');   //suspend only 'test' event (to unsuspend use emitter.unsuspend('test');)

emitter.emit('test');
```

## 'emitter.elseError(event)'
In case an event with the provided name is emitted but no listener is attached to it, an error event will emitted by this emitter instance instead.

```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();
emitter.on('error', function (error) {
    //logic here...
    
    //To remove elseError
    emitter.unelseError('test');
});

emitter.elseError('test');

emitter.emit('test');
```

## 'emitter.emitAsync(event, [...params], callback)'
Invokes the emit after a timeout to enable calling flow to continue and not block due to event listeners.

```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();
emitter.on('test', function onTestEvent(num1, num2) {
    //event logic here
});

emitter.emitAsync('test', 1, 2, function onEmitDone(event, num1, num2, emitted) {
    //emit callback logic
});
```

## 'emitter.onAsync(event, listener)'
Adds a listener that will be triggered after a timeout during an emit.

This ensures that the provided listener is invoked after all other listeners and that it will not block the emit caller flow.

To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();
emitter.on('test', function onEventSync() {
    //sync handle function logic
});
var removeListener = emitter.onAsync('test', function onEventAsync() {
    //async handle function logic
});

emitter.emit('test', 1, 2);

//remove the async listener
removeListener();
```

## 'emitter.filter([event], callback)'
Adds a filter that will be triggered before every emit for the provided event type (if no event is provided, than the filter is invoked for all events).

The filter enables to prevent events from reaching the listeners in case some criteria is met.

```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

//add filters for test event only
var removeTestEventFilter = emitter.filter('test', function (event, arg1, arg2) {
    if (arg1 && (arg1 > 3)) {
        return true;    //continue with emit
    }

    return false;   //prevent emit
});
emitter.filter('test', function (event, arg1, arg2) {
    if (arg2 && (arg2 < 20)) {
        return true;    //continue with emit
    }

    return false;   //prevent emit
});

//add global filter for all events
emitter.filter(function (event, arg1, arg2) {
    if (arg1 && (arg1 > 5)) {
        return true;    //continue with emit
    }

    return false;   //prevent emit
});
var removeGlobalArg2Filter = emitter.filter(function (event, arg1, arg2) {
    if (arg2 && (arg2 < 18)) {
        return true;    //continue with emit
    }

    return false;   //prevent emit
});

emitter.on('test', function onTestEvent(arg1, arg2) {
    //event logic here...
});

emitter.emit('test', 10, 15);

//remove some filters
removeTestEventFilter();
removeGlobalArg2Filter();
```

## API Documentation
See full docs at: [API Docs](docs/api.md)

## Release History

| Date        | Version | Description |
| ----------- | ------- | ----------- |
| 2015-02-23  | v0.0.21  | Maintenance |
| 2015-02-09  | v0.0.19  | Doc fix. |
| 2015-02-09  | v0.0.18  | Grunt cleanups |
| 2015-02-06  | v0.0.14  | Internal quality changes. |
| 2014-12-31  | v0.0.11  | Doc fix. |
| 2014-12-31  | v0.0.10  | EventEmitter is no longer automatically modified,<br>instead there are 2 ways to extend/modify prototype/modify instance<br>functions exposed by this library. |
| 2014-12-30  | v0.0.9   | Added ability to enhance compatible EventEmitter types |
| 2014-12-30  | v0.0.8   | Doc changes |
| 2014-12-29  | v0.0.7   | Added additional tests |
| 2014-12-29  | v0.0.6   | Added 'filter' |
| 2014-12-28  | v0.0.5   | Added 'onAsync' |
| 2014-12-28  | v0.0.4   | Added 'emitAsync' |
| 2014-12-28  | v0.0.2   | Initial release. |

## License
Developed by Sagie Gur-Ari and licensed under the Apache 2 open source license.
