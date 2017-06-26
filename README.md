# event-emitter-enhancer

[![NPM Version](http://img.shields.io/npm/v/event-emitter-enhancer.svg?style=flat)](https://www.npmjs.org/package/event-emitter-enhancer) [![Build Status](https://travis-ci.org/sagiegurari/event-emitter-enhancer.svg)](http://travis-ci.org/sagiegurari/event-emitter-enhancer) [![Coverage Status](https://coveralls.io/repos/sagiegurari/event-emitter-enhancer/badge.svg)](https://coveralls.io/r/sagiegurari/event-emitter-enhancer) [![bitHound Code](https://www.bithound.io/github/sagiegurari/event-emitter-enhancer/badges/code.svg)](https://www.bithound.io/github/sagiegurari/event-emitter-enhancer) [![Inline docs](http://inch-ci.org/github/sagiegurari/event-emitter-enhancer.svg?branch=master)](http://inch-ci.org/github/sagiegurari/event-emitter-enhancer)<br>
[![License](https://img.shields.io/npm/l/event-emitter-enhancer.svg?style=flat)](https://github.com/sagiegurari/event-emitter-enhancer/blob/master/LICENSE) [![Total Downloads](https://img.shields.io/npm/dt/event-emitter-enhancer.svg?style=flat)](https://www.npmjs.org/package/event-emitter-enhancer) [![Dependency Status](https://david-dm.org/sagiegurari/event-emitter-enhancer.svg)](https://david-dm.org/sagiegurari/event-emitter-enhancer) [![devDependency Status](https://david-dm.org/sagiegurari/event-emitter-enhancer/dev-status.svg)](https://david-dm.org/sagiegurari/event-emitter-enhancer?type=dev)<br>
[![Known Vulnerabilities](https://snyk.io/test/github/sagiegurari/event-emitter-enhancer/badge.svg)](https://snyk.io/test/github/sagiegurari/event-emitter-enhancer) [![Retire Status](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/sagiegurari/event-emitter-enhancer/master/package.json)](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/sagiegurari/event-emitter-enhancer/master/package.json)

> Extends the Node.js events.EventEmitter to provide additional functionality.

* [Overview](#overview)
* [Usage](#usage)
  * [on(event, listener)](#usage-on1)
  * [on(options)](#usage-on2)
  * [once(event, listener)](#usage-once)
  * [else](#usage-else)
  * [suspend](#usage-suspend)
  * [elseError](#usage-else-error)
  * [emitAsync](#usage-emit-async)
  * [onAsync](#usage-on-async)
  * [onAny](#usage-on-any)
  * [filter](#usage-filter)
  * [proxyEvents](#usage-proxyEvents)
* [Installation](#installation)
* [API Documentation](docs/api.md)
* [Contributing](.github/CONTRIBUTING.md)
* [Release History](#history)
* [License](#license)

<a name="overview"></a>
## Overview
This library extends the Node.js events.EventEmitter to provide additional functionality.

<a name="usage"></a>
## Usage
First you must require this library as follows:

```js
var EventEmitterEnhancer = require('event-emitter-enhancer');
```

Next you can either modify the proto of an EventEmiter type class, or extend it to get a new custom type or modify a specific emitter instance.

```js
var EventEmitter = require('events').EventEmitter;

//Get predefined extended version of the events.EventEmitter class (original EventEmitter is not impacted)
var emitter = new EventEmitterEnhancer.EnhancedEventEmitter();   //create a new instance using the new extended class type.

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

<a name="usage-on1"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.on(event, listener) ⇒ function'
See node.js events.EventEmitter.on.<br>
This function also returns a removeListener function to easily remove the provided listener.

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

var remove = emitter.on('error', function (error) {
   console.error(error);
});

//remove listener (no longer need to keep a reference to the listener function)
remove();
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-on2"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.on(options) ⇒ function'
Enables more complex on capabilities including providing multiple listeners/event names, timeout the listener and more.<br>
To remove the listener/s, the returned function must be called instead of doing emitter.removeListener(...)

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

var removeListener = emitter.on({
  event: ['error', 'connection-error', 'write-error', 'read-error'], //The event names (can be string for a single event)
  listener: [ //The listener callback functions (can be a function instead of an array for a single listener callback)
    function firstListener(arg1, arg2) {
      //do something
    },
    function secondListener(arg1, arg2) {
      //do something
    }
  ],
  async: true, //The callback functions will be called after next tick
  timeout: 1500 //All listeners will be removed after the provided timeout (if not provided, listeners can only be removed manually via returned function)
});

//emit any event
emitter.emit('write-error', 1, 2, 3);

//once done, remove all listeners from all events
removeListener();
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-once"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.once(event, listener) ⇒ function'
See node.js events.EventEmitter.once.<br>
This function also returns a removeListener function to easily remove the provided listener.

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

var remove = emitter.once('error', function (error) {
   console.error(error);
});

//remove listener (no longer need to keep a reference to the listener function)
remove();
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-else"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.else(listener)'
Adds an 'else' listener which will be triggered by all events that do not have a listener currently for them (apart of the special 'error' event).

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();
emitter.else(function onUnhandledEvent(event, arg1, arg2) {
 //logic here....

 //to remove 'else' listeners, simply use the unelse function
 emitter.unelse(this);
});

emitter.emit('test', 1, 2);
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-suspend"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.suspend(event)'
Suspends all emit calls for the provided event name (including 'else' listeners).<br>
For suspended events, the emit function will simply do nothing ('else' listeners won't be invoked either).

**Example**  
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
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-else-error"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.elseError(event)'
In case an event with the provided name is emitted but no listener is attached to it, an error event will emitted by this emitter instance instead.

**Example**  
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
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-emit-async"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.emitAsync(event, [...params], [callback])'
Invokes the emit after a timeout to enable calling flow to continue and not block due to event listeners.

**Example**  
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
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-on-async"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.onAsync(event, listener) ⇒ function'
Adds a listener that will be triggered after a timeout during an emit.<br>
This ensures that the provided listener is invoked after all other listeners and that it will not block the emit caller flow.<br>
To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Example**  
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
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-on-any"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.onAny(events, listener) ⇒ function'
Adds a listener to all provided event names.<br>
To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

//add same listener to multiple events
var remove = emitter.onAny(['test1', 'test2', 'test3'], function (arg1, arg2, arg3) {
   console.log(arg1, arg2, arg3);
});

//remove listener from all events
remove();
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-filter"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.filter([event], filter) ⇒ function'
Adds a filter that will be triggered before every emit for the provided event type (if no event is provided, than the filter is invoked for all events).<br>
The filter enables to prevent events from reaching the listeners in case some criteria is met.

**Example**  
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
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="usage-proxyEvents"></a>
<!-- markdownlint-disable MD009 MD031 MD036 -->
### 'emitter.proxyEvents(emitters, events) ⇒ function'
Will setup an event proxy so if any of the requested event/s are fired from the provided emitter/s, they will be triggered by this emitter.

**Example**  
```js
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
var emitter = new EnhancedEventEmitter();

//proxy the 'data' and 'end' events from all sockets
var stop = emitter.proxyEvents(sockets, ['data', 'end']);

//listen to events via emitter
emitter.on('data', onData);

//stop events proxy
stop();
```
<!-- markdownlint-enable MD009 MD031 MD036 -->

<a name="installation"></a>
## Installation
In order to use this library, just run the following npm install command:

```sh
npm install --save event-emitter-enhancer
```

## API Documentation
See full docs at: [API Docs](docs/api.md)

## Contributing
See [contributing guide](.github/CONTRIBUTING.md)

<a name="history"></a>
## Release History

| Date        | Version | Description |
| ----------- | ------- | ----------- |
| 2017-06-26  | v1.0.47 | Maintenance |
| 2017-01-16  | v1.0.27 | New extended 'once' function |
| 2017-01-13  | v1.0.26 | Maintenance |
| 2017-01-07  | v1.0.25 | New 'proxyEvents' function |
| 2017-01-06  | v1.0.24 | New extended 'on' function |
| 2016-12-31  | v1.0.23 | Maintenance |
| 2016-11-11  | v1.0.15 | 'emitAsync' callback is now optional |
| 2016-11-05  | v1.0.14 | Maintenance |
| 2015-09-23  | v0.0.44 | Added 'onAny' |
| 2015-09-08  | v0.0.43 | Maintenance |
| 2015-04-22  | v0.0.31 | Prevent from multiple enhance of same prototype/instance |
| 2015-04-05  | v0.0.30 | Maintenance |
| 2015-02-09  | v0.0.19 | Doc fix. |
| 2015-02-09  | v0.0.18 | Grunt cleanups |
| 2015-02-06  | v0.0.14 | Internal quality changes. |
| 2014-12-31  | v0.0.11 | Doc fix. |
| 2014-12-31  | v0.0.10 | EventEmitter is no longer automatically modified,<br>instead there are 2 ways to extend/modify prototype/modify instance<br>functions exposed by this library. |
| 2014-12-30  | v0.0.9  | Added ability to enhance compatible EventEmitter types |
| 2014-12-30  | v0.0.8  | Doc changes |
| 2014-12-29  | v0.0.7  | Added additional tests |
| 2014-12-29  | v0.0.6  | Added 'filter' |
| 2014-12-28  | v0.0.5  | Added 'onAsync' |
| 2014-12-28  | v0.0.4  | Added 'emitAsync' |
| 2014-12-28  | v0.0.2  | Initial release. |

<a name="license"></a>
## License
Developed by Sagie Gur-Ari and licensed under the Apache 2 open source license.
