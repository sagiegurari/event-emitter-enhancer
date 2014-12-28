# event-emitter-enhancer

[![NPM Version](http://img.shields.io/npm/v/event-emitter-enhancer.svg?style=flat)](https://www.npmjs.org/package/event-emitter-enhancer) [![Build Status](https://img.shields.io/travis/sagiegurari/event-emitter-enhancer.svg?style=flat)](http://travis-ci.org/sagiegurari/event-emitter-enhancer) [![Coverage Status](https://img.shields.io/coveralls/sagiegurari/event-emitter-enhancer.svg?style=flat)](https://coveralls.io/r/sagiegurari/event-emitter-enhancer)

> Extends the Node.js events.EventEmitter to provide additional functionality.

## Overview
This library extends the Node.js events.EventEmitter to provide additional functionality.

## Usage
First you must require this library for the EventEmitter class to be modified as follows:

```js
require('event-emitter-enhancer');
```

Now you can use the extended capabilities in all EventEmitter instances.

## 'else'
'else' enables you to attach listeners to all events that do not have any active listeners (apart of the special 'error' event).

```js
var emitter = new EventEmitter();
emitter.else(function onNonHandledEvent(event, arg1, arg2) {
    //logic here....
    
    //to remove 'else' listeners, simply use the unelse function
    emitter.unelse(this);
});

emitter.emit('test', 1, 2);
```

## 'suspend'
'suspend' enables you to suspend specific or all events until unsuspend is called.

For suspended events, the emit function will simply do nothing ('else' listeners won't be invoked either).

```js
var emitter11 = new EventEmitter();
emitter.on('test', function () {
    //will never be called
});

emitter.suspended = true;  //suspend ALL events (to unsuspend use emitter.suspended = false;)
//or
emitter.suspend('test');   //suspend only 'test' event (to unsuspend use emitter.unsuspend('test');)

emitter.emit('test');
```

## 'elseError'
In case an event with the provided name is emitted but no listener is attached to it, an error event will emitted by this emitter instance instead.

```js
var emitter = new EventEmitter();
emitter.on('error', function (error) {
    //logic here...
    
    //To remove elseError
    emitter.unelseError('test');
});

emitter.elseError('test');

emitter.emit('test');
```

## 'emitAsync'
Invokes the emit after a timeout to enable calling flow to continue and not block due to event listeners.

```js
var emitter = new EventEmitter();
emitter.on('test', function onTestEvent(num1, num2) {
    //event logic here
});

emitter.emitAsync('test', 1, 2, function onEmitDone(event, num1, num2, emitted) {
    //emit callback logic
});
```

## 'onAsync'
Adds a listener that will be triggered after a timeout during an emit.

This ensures that the provided listener is invoked after all other listeners and that it will not block the emit caller flow.

To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

```js
var emitter = new EventEmitter();
emitter.on('test', function onEventSync() {
    //sync handle function logic
});
emitter.onAsync('test', function onEventAsync() {
    //async handle function logic
});

emitter.emit('test', 1, 2);
```

## Release History

 * 2014-12-28   v0.0.5   Added 'onAsync'
 * 2014-12-28   v0.0.4   Added 'emitAsync'
 * 2014-12-28   v0.0.2   Initial release.

## License
Developed by Sagie Gur-Ari and licensed under the Apache 2 open source license.
