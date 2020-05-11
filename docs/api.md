## Classes

<dl>
<dt><a href="#EnhancedEventEmitter">EnhancedEventEmitter</a></dt>
<dd></dd>
<dt><a href="#EventEmitterEnhancer">EventEmitterEnhancer</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#EventEmitterEnhancer">EventEmitterEnhancer</a> : <code>object</code></dt>
<dd><p>Extends the Node.js events.EventEmitter with extra capabilities.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FilterCallback">FilterCallback</a> ⇒ <code>Boolean</code></dt>
<dd><p>&#39;filter&#39; callback.</p>
</dd>
<dt><a href="#ElseCallback">ElseCallback</a> : <code>function</code></dt>
<dd><p>&#39;else&#39; callback.</p>
</dd>
<dt><a href="#AsyncEmitCallback">AsyncEmitCallback</a> : <code>function</code></dt>
<dd><p>&#39;async-emit&#39; callback.</p>
</dd>
</dl>

<a name="EnhancedEventEmitter"></a>

## EnhancedEventEmitter
**Kind**: global class  
**Access**: public  
**Author**: Sagie Gur-Ari  

* [EnhancedEventEmitter](#EnhancedEventEmitter)
    * [new EnhancedEventEmitter()](#new_EnhancedEventEmitter_new)
    * [.suspended](#EnhancedEventEmitter.suspended) : <code>Boolean</code>
    * [.subscriptionSeparator](#EnhancedEventEmitter.subscriptionSeparator) : <code>String</code>
    * [#on(event, listener)](#EnhancedEventEmitter+on) ⇒ <code>function</code>
    * [#on(options)](#EnhancedEventEmitter+on) ⇒ <code>function</code>
    * [#once(event, listener)](#EnhancedEventEmitter+once) ⇒ <code>function</code>
    * [#removeAllListeners([event])](#EnhancedEventEmitter+removeAllListeners)
    * [#suspend(event)](#EnhancedEventEmitter+suspend)
    * [#unsuspend(event)](#EnhancedEventEmitter+unsuspend)
    * [#else(listener)](#EnhancedEventEmitter+else)
    * [#removeElseListener(listener)](#EnhancedEventEmitter+removeElseListener)
    * [#unelse(listener)](#EnhancedEventEmitter+unelse)
    * [#removeAllElseListeners()](#EnhancedEventEmitter+removeAllElseListeners)
    * [#elseError(event)](#EnhancedEventEmitter+elseError)
    * [#removeElseError(event)](#EnhancedEventEmitter+removeElseError)
    * [#unelseError(event)](#EnhancedEventEmitter+unelseError)
    * [#emit(event, [params])](#EnhancedEventEmitter+emit) ⇒ <code>Boolean</code>
    * [#emitAsync(event, [params], [callback])](#EnhancedEventEmitter+emitAsync)
    * [#onAsync(event, listener)](#EnhancedEventEmitter+onAsync) ⇒ <code>function</code>
    * [#onAny(events, listener)](#EnhancedEventEmitter+onAny) ⇒ <code>function</code>
    * [#addFilter([event], filter)](#EnhancedEventEmitter+addFilter) ⇒ <code>function</code>
    * [#addEventFilter(event, filter)](#EnhancedEventEmitter+addEventFilter) ⇒ <code>function</code>
    * [#addGlobalFilter(filter)](#EnhancedEventEmitter+addGlobalFilter) ⇒ <code>function</code>
    * [#filter([event], filter)](#EnhancedEventEmitter+filter) ⇒ <code>function</code>
    * [#proxyEvents(emitters, events)](#EnhancedEventEmitter+proxyEvents) ⇒ <code>function</code>
    * [#addNoop(event)](#EnhancedEventEmitter+addNoop) ⇒ <code>function</code>
    * [#ignoreError()](#EnhancedEventEmitter+ignoreError)

<a name="new_EnhancedEventEmitter_new"></a>

### new EnhancedEventEmitter()
This class holds all the extended capabilities added to any emitter.

<a name="EnhancedEventEmitter.suspended"></a>

### EnhancedEventEmitter.suspended : <code>Boolean</code>
If true, all events will not trigger any listener (or 'else' listener).<br>
The emit function will simply do nothing.

**Access**: public  
<a name="EnhancedEventEmitter.subscriptionSeparator"></a>

### EnhancedEventEmitter.subscriptionSeparator : <code>String</code>
If defined, events will be splitted by this separator and emitted as partials.<br>
For example, if the separator is ':' an event event1:event2:event3 will be emitted as 3 events: event1, event1:event2, event1:event2:event3.

**Access**: public  
<a name="EnhancedEventEmitter+on"></a>

### EnhancedEventEmitter#on(event, listener) ⇒ <code>function</code>
See node.js events.EventEmitter.on.<br>
This function also returns a removeListener function to easily remove the provided listener.

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The name of the event |
| listener | <code>function</code> | The callback function |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

const remove = emitter.on('error', function (error) {
   console.error(error);
});

//remove listener (no longer need to keep a reference to the listener function)
remove();
```
<a name="EnhancedEventEmitter+on"></a>

### EnhancedEventEmitter#on(options) ⇒ <code>function</code>
Enables more complex on capabilities including providing multiple listeners/event names, timeout the listener and more.<br>
To remove the listener/s, the returned function must be called instead of doing emitter.removeListener(...)

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | All options needed to setup the listeners |
| options.event | <code>Array.&lt;String&gt;</code> \| <code>String</code> |  | The event name or an array of event names |
| options.listener | <code>Array.&lt;function()&gt;</code> \| <code>function</code> |  | The callback function or an array of callback functions |
| [options.async] | <code>Boolean</code> | <code>false</code> | If true, the callback functions will be called after next tick |
| [options.timeout] | <code>Number</code> |  | If provided, the returned remove listener function will be called after the provided timeout value in millies (unless called manually before the timeout was triggered) |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

const removeListener = emitter.on({
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
<a name="EnhancedEventEmitter+once"></a>

### EnhancedEventEmitter#once(event, listener) ⇒ <code>function</code>
See node.js events.EventEmitter.once.<br>
This function also returns a removeListener function to easily remove the provided listener.

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The name of the event |
| listener | <code>function</code> | The callback function |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

const remove = emitter.once('error', function (error) {
   console.error(error);
});

//remove listener (no longer need to keep a reference to the listener function)
remove();
```
<a name="EnhancedEventEmitter+removeAllListeners"></a>

### EnhancedEventEmitter#removeAllListeners([event])
See node.js events.EventEmitter.removeAllListeners.<br>
This function is modified to also accept an array of event names.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>String</code> \| <code>Array</code> | The name/s of the event |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//same as the basic removeAllListeners
emitter.removeAllListeners('my-event');

//also supports array of event names
emitter.removeAllListeners(['my-event', 'another-event']);
```
<a name="EnhancedEventEmitter+suspend"></a>

### EnhancedEventEmitter#suspend(event)
Suspends all emit calls for the provided event name (including 'else' listeners).<br>
For suspended events, the emit function will simply do nothing ('else' listeners won't be invoked either).

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to suspend |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();
emitter.on('test', function () {
  //will never be called
});

emitter.suspended = true;  //suspend ALL events (to unsuspend use emitter.suspended = false;)
//or
emitter.suspend('test');   //suspend only 'test' event (to unsuspend use emitter.unsuspend('test');)

emitter.emit('test');
```
<a name="EnhancedEventEmitter+unsuspend"></a>

### EnhancedEventEmitter#unsuspend(event)
Unsuspends the emit calls for the provided event name.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to unsuspend |

<a name="EnhancedEventEmitter+else"></a>

### EnhancedEventEmitter#else(listener)
Adds an 'else' listener which will be triggered by all events that do not have a listener currently for them (apart of the special 'error' event).

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| listener | [<code>ElseCallback</code>](#ElseCallback) | The listener that will catch all 'else' events |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();
emitter.else(function onUnhandledEvent(event, arg1, arg2) {
 //logic here....

 //to remove 'else' listeners, simply use the unelse function
 emitter.unelse(this);
});

emitter.emit('test', 1, 2);
```
<a name="EnhancedEventEmitter+removeElseListener"></a>

### EnhancedEventEmitter#removeElseListener(listener)
Removes the provided 'else' listener.<br>
Same as 'unelse' function.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| listener | [<code>ElseCallback</code>](#ElseCallback) | The listener to remove |

<a name="EnhancedEventEmitter+unelse"></a>

### EnhancedEventEmitter#unelse(listener)
See 'removeElseListener' documentation.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| listener | [<code>ElseCallback</code>](#ElseCallback) | The listener to remove |

<a name="EnhancedEventEmitter+removeAllElseListeners"></a>

### EnhancedEventEmitter#removeAllElseListeners()
Removes all 'else' listeners.

**Access**: public  
<a name="EnhancedEventEmitter+elseError"></a>

### EnhancedEventEmitter#elseError(event)
In case an event with the provided name is emitted but no listener is attached to it, an error event will emitted by this emitter instance instead.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();
emitter.on('error', function (error) {
  //logic here...

  //To remove elseError
  emitter.unelseError('test');
});

emitter.elseError('test');

emitter.emit('test');
```
<a name="EnhancedEventEmitter+removeElseError"></a>

### EnhancedEventEmitter#removeElseError(event)
Removes the else-error handler for the provided event.<br>
Same as 'unelseError' function.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |

<a name="EnhancedEventEmitter+unelseError"></a>

### EnhancedEventEmitter#unelseError(event)
See 'removeElseError' documentation.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |

<a name="EnhancedEventEmitter+emit"></a>

### EnhancedEventEmitter#emit(event, [params]) ⇒ <code>Boolean</code>
See Node.js events.EventEmitter documentation.

**Returns**: <code>Boolean</code> - True if a listener or an 'else' listener handled the event  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |
| [params] | <code>\*</code> | The event parameters |

<a name="EnhancedEventEmitter+emitAsync"></a>

### EnhancedEventEmitter#emitAsync(event, [params], [callback])
Invokes the emit after a timeout to enable calling flow to continue and not block due to event listeners.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |
| [params] | <code>\*</code> | The event parameters (if last param is a function, it is considered as the callback of the emitAsync) |
| [callback] | [<code>AsyncEmitCallback</code>](#AsyncEmitCallback) | The async callback |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();
emitter.on('test', function onTestEvent(num1, num2) {
   //event logic here
});

emitter.emitAsync('test', 1, 2, function onEmitDone(event, num1, num2, emitted) {
   //emit callback logic
});
```
<a name="EnhancedEventEmitter+onAsync"></a>

### EnhancedEventEmitter#onAsync(event, listener) ⇒ <code>function</code>
Adds a listener that will be triggered after a timeout during an emit.<br>
This ensures that the provided listener is invoked after all other listeners and that it will not block the emit caller flow.<br>
To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name |
| listener | <code>function</code> | The listener function |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();
emitter.on('test', function onEventSync() {
  //sync handle function logic
});
const removeListener = emitter.onAsync('test', function onEventAsync() {
  //async handle function logic
});

emitter.emit('test', 1, 2);

//remove the async listener
removeListener();
```
<a name="EnhancedEventEmitter+onAny"></a>

### EnhancedEventEmitter#onAny(events, listener) ⇒ <code>function</code>
Adds a listener to all provided event names.<br>
To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>String</code> \| <code>Array</code> | The event name/s |
| listener | <code>function</code> | The listener function |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//add same listener to multiple events
const remove = emitter.onAny(['test1', 'test2', 'test3'], function (arg1, arg2, arg3) {
   console.log(arg1, arg2, arg3);
});

//remove listener from all events
remove();
```
<a name="EnhancedEventEmitter+addFilter"></a>

### EnhancedEventEmitter#addFilter([event], filter) ⇒ <code>function</code>
Adds a filter that will be triggered before every emit for the provided event type (if no event is provided, than the filter is invoked for all events).<br>
The filter enables to prevent events from reaching the listeners in case some criteria is met.

**Returns**: <code>function</code> - The remove filter function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>String</code> | The event name. If not provided, the filter is relevant for all events. |
| filter | [<code>FilterCallback</code>](#FilterCallback) | The filter function |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//add filters for test event only
const removeTestEventFilter = emitter.filter('test', function (event, arg1, arg2) {
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
const removeGlobalArg2Filter = emitter.filter(function (event, arg1, arg2) {
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
<a name="EnhancedEventEmitter+addEventFilter"></a>

### EnhancedEventEmitter#addEventFilter(event, filter) ⇒ <code>function</code>
Adds an event filter (See addFilter)

**Returns**: <code>function</code> - The remove filter function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event name. |
| filter | [<code>FilterCallback</code>](#FilterCallback) | The filter function |

<a name="EnhancedEventEmitter+addGlobalFilter"></a>

### EnhancedEventEmitter#addGlobalFilter(filter) ⇒ <code>function</code>
Adds a global filter (See addFilter)

**Returns**: <code>function</code> - The remove filter function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filter | [<code>FilterCallback</code>](#FilterCallback) | The filter function |

<a name="EnhancedEventEmitter+filter"></a>

### EnhancedEventEmitter#filter([event], filter) ⇒ <code>function</code>
See 'addFilter' documentation.

**Returns**: <code>function</code> - The remove filter function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>String</code> | The event name. If not provided, the filter is relevant for all events. |
| filter | [<code>FilterCallback</code>](#FilterCallback) | The filter function |

<a name="EnhancedEventEmitter+proxyEvents"></a>

### EnhancedEventEmitter#proxyEvents(emitters, events) ⇒ <code>function</code>
Will setup an event proxy so if any of the requested event/s are fired from the provided emitter/s, they will be triggered by this emitter.

**Returns**: <code>function</code> - Once invoked, will stop proxying of events  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| emitters | <code>Array.&lt;Object&gt;</code> \| <code>Object</code> | An event emitter or array of event emitters to proxy the events from |
| events | <code>Array.&lt;String&gt;</code> \| <code>String</code> | A single event name or an array of event names to proxy from the provided emitter/s |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//proxy the 'data' and 'end' events from all sockets
const stop = emitter.proxyEvents(sockets, ['data', 'end']);

//listen to events via emitter
emitter.on('data', onData);

//stop events proxy
stop();
```
<a name="EnhancedEventEmitter+addNoop"></a>

### EnhancedEventEmitter#addNoop(event) ⇒ <code>function</code>
Adds empty event handler.

**Returns**: <code>function</code> - The remove listener function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The name of the event |

**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//add noop even handler for the 'error' event
const remove = emitter.addNoop('error');

//remove listener
remove();
```
<a name="EnhancedEventEmitter+ignoreError"></a>

### EnhancedEventEmitter#ignoreError()
Adds empty error event handler to prevent node.js from crashing in case of an error which we do not want/need to handle.<br>
This function will only add a new empty handler in case no other handler is defined for the error event.

**Access**: public  
**Example**  
```js
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);
const emitter = new EnhancedEventEmitter();

//adds empty error handler
emitter.ignoreError();

//emit error will not crash the node.js process
emitter.emit('error', new Error('test'));
```
<a name="EventEmitterEnhancer"></a>

## EventEmitterEnhancer
**Kind**: global class  
**Access**: public  
**Author**: Sagie Gur-Ari  

* [EventEmitterEnhancer](#EventEmitterEnhancer)
    * [new EventEmitterEnhancer()](#new_EventEmitterEnhancer_new)
    * [.EnhancedEventEmitter](#EventEmitterEnhancer.EnhancedEventEmitter) : <code>EventEmitter</code>
    * [#extend(EmitterType)](#EventEmitterEnhancer+extend) ⇒ <code>Object</code>
    * [#modify(EmitterType)](#EventEmitterEnhancer+modify)
    * [#modifyInstance(emitterInstance)](#EventEmitterEnhancer+modifyInstance)

<a name="new_EventEmitterEnhancer_new"></a>

### new EventEmitterEnhancer()
This class enables to enhance event emitter prototypes and instances with extra capabilities.

<a name="EventEmitterEnhancer.EnhancedEventEmitter"></a>

### EventEmitterEnhancer.EnhancedEventEmitter : <code>EventEmitter</code>
The node.js event emitter prototype extended with the extra capabilities.

**Access**: public  
<a name="EventEmitterEnhancer+extend"></a>

### EventEmitterEnhancer#extend(EmitterType) ⇒ <code>Object</code>
Extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Returns**: <code>Object</code> - The modified object type  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>Object</code> | The object type |

**Example**  
```js
//extend events.EventEmitter class (or any class that has the same interface)
//now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
const emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
```
<a name="EventEmitterEnhancer+modify"></a>

### EventEmitterEnhancer#modify(EmitterType)
Modified the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>Object</code> | The object type |

**Example**  
```js
//modify the proto of an events.EventEmitter class (or any class that has the same interface)
//now all existing and future instances of the original class are modified to include the new extended capabilities.
EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
const emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
```
<a name="EventEmitterEnhancer+modifyInstance"></a>

### EventEmitterEnhancer#modifyInstance(emitterInstance)
Modified the specific object instance with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| emitterInstance | <code>Object</code> | The emitter instance |

**Example**  
```js
//modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
const emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
```
<a name="EventEmitterEnhancer"></a>

## EventEmitterEnhancer : <code>object</code>
Extends the Node.js events.EventEmitter with extra capabilities.

**Kind**: global namespace  
**Author**: Sagie Gur-Ari  

* [EventEmitterEnhancer](#EventEmitterEnhancer) : <code>object</code>
    * [new EventEmitterEnhancer()](#new_EventEmitterEnhancer_new)
    * [.EnhancedEventEmitter](#EventEmitterEnhancer.EnhancedEventEmitter) : <code>EventEmitter</code>
    * [#extend(EmitterType)](#EventEmitterEnhancer+extend) ⇒ <code>Object</code>
    * [#modify(EmitterType)](#EventEmitterEnhancer+modify)
    * [#modifyInstance(emitterInstance)](#EventEmitterEnhancer+modifyInstance)

<a name="new_EventEmitterEnhancer_new"></a>

### new EventEmitterEnhancer()
This class enables to enhance event emitter prototypes and instances with extra capabilities.

<a name="EventEmitterEnhancer.EnhancedEventEmitter"></a>

### EventEmitterEnhancer.EnhancedEventEmitter : <code>EventEmitter</code>
The node.js event emitter prototype extended with the extra capabilities.

**Access**: public  
<a name="EventEmitterEnhancer+extend"></a>

### EventEmitterEnhancer#extend(EmitterType) ⇒ <code>Object</code>
Extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Returns**: <code>Object</code> - The modified object type  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>Object</code> | The object type |

**Example**  
```js
//extend events.EventEmitter class (or any class that has the same interface)
//now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
const emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
```
<a name="EventEmitterEnhancer+modify"></a>

### EventEmitterEnhancer#modify(EmitterType)
Modified the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>Object</code> | The object type |

**Example**  
```js
//modify the proto of an events.EventEmitter class (or any class that has the same interface)
//now all existing and future instances of the original class are modified to include the new extended capabilities.
EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
const emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
```
<a name="EventEmitterEnhancer+modifyInstance"></a>

### EventEmitterEnhancer#modifyInstance(emitterInstance)
Modified the specific object instance with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| emitterInstance | <code>Object</code> | The emitter instance |

**Example**  
```js
//modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
const emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
```
<a name="FilterCallback"></a>

## FilterCallback ⇒ <code>Boolean</code>
'filter' callback.

**Kind**: global typedef  
**Returns**: <code>Boolean</code> - True to continue with the emit, false to prevent emit  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The event type |
| [params] | <code>\*</code> | The event parameters |

<a name="ElseCallback"></a>

## ElseCallback : <code>function</code>
'else' callback.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The event type |
| [params] | <code>\*</code> | The event parameters |

<a name="AsyncEmitCallback"></a>

## AsyncEmitCallback : <code>function</code>
'async-emit' callback.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The event type |
| [params] | <code>\*</code> | The event parameters |
| emitted | <code>Boolean</code> | True if emitted, else false |

