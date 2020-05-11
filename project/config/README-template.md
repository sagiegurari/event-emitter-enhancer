# {"gitdown": "gitinfo", "name": "name"}

[![NPM Version](http://img.shields.io/npm/v/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://www.npmjs.org/package/{"gitdown": "gitinfo", "name": "name"}) [![CI](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/workflows/CI/badge.svg?branch=master)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/actions) [![Coverage Status](https://coveralls.io/repos/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badge.svg)](https://coveralls.io/r/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Known Vulnerabilities](https://snyk.io/test/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badge.svg)](https://snyk.io/test/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Inline docs](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}.svg?branch=master)](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![License](https://img.shields.io/npm/l/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/blob/master/LICENSE) [![Total Downloads](https://img.shields.io/npm/dt/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://www.npmjs.org/package/{"gitdown": "gitinfo", "name": "name"})

> Extends the Node.js events.EventEmitter to provide additional functionality.

* [Overview](#overview)
* [Usage](#usage)
  * [on(event, listener)](#usage-on1)
  * [on(options)](#usage-on2)
  * [once(event, listener)](#usage-once)
  * [removeAllListeners](#usage-removeAllListeners)
  * [else](#usage-else)
  * [suspend](#usage-suspend)
  * [elseError](#usage-else-error)
  * [emitAsync](#usage-emit-async)
  * [onAsync](#usage-on-async)
  * [onAny](#usage-on-any)
  * [filter](#usage-filter)
  * [proxyEvents](#usage-proxyEvents)
  * [addNoop](#usage-addNoop)
  * [ignoreError](#usage-ignoreError)
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

<a name="usage-on2"></a>

<a name="usage-once"></a>

<a name="usage-removeAllListeners"></a>

<a name="usage-else"></a>

<a name="usage-suspend"></a>

<a name="usage-else-error"></a>

<a name="usage-emit-async"></a>

<a name="usage-on-async"></a>

<a name="usage-on-any"></a>

<a name="usage-filter"></a>

<a name="usage-proxyEvents"></a>

<a name="usage-addNoop"></a>

<a name="usage-ignoreError"></a>

<a name="installation"></a>
## Installation
In order to use this library, just run the following npm install command:

```sh
npm install --save {"gitdown": "gitinfo", "name": "name"}
```

{"gitdown": "include", "file": "./README-footer-template.md"}
