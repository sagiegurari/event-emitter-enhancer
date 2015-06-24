## Classes
<dl>
<dt><a href="#EnhancedEventEmitter">EnhancedEventEmitter</a></dt>
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
<dt><a href="#FilterCallback">FilterCallback</a> ⇒ <code>boolean</code></dt>
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
**Access:** public  
**Author:** Sagie Gur-Ari  

* [EnhancedEventEmitter](#EnhancedEventEmitter)
  * [new EnhancedEventEmitter()](#new_EnhancedEventEmitter_new)
  * [.enhancedEmitterType](#EnhancedEventEmitter.enhancedEmitterType) : <code>boolean</code> ℗
  * [.suspended](#EnhancedEventEmitter.suspended) : <code>boolean</code>
  * [#suspend(event)](#EnhancedEventEmitter+suspend)
  * [#unsuspend(event)](#EnhancedEventEmitter+unsuspend)
  * [#else(listener)](#EnhancedEventEmitter+else)
  * [#removeElseListener(listener)](#EnhancedEventEmitter+removeElseListener)
  * [#unelse(listener)](#EnhancedEventEmitter+unelse)
  * [#removeAllElseListeners()](#EnhancedEventEmitter+removeAllElseListeners)
  * [#elseError(event)](#EnhancedEventEmitter+elseError)
  * [#removeElseError(event)](#EnhancedEventEmitter+removeElseError)
  * [#unelseError(event)](#EnhancedEventEmitter+unelseError)
  * [#emit(event, [params])](#EnhancedEventEmitter+emit) ⇒ <code>boolean</code>
  * [#handleNoEmit(event, eventArguments)](#EnhancedEventEmitter+handleNoEmit) ⇒ <code>boolean</code> ℗
  * [#invokeElseListener(eventArguments)](#EnhancedEventEmitter+invokeElseListener) ℗
  * [#emitAsync(event, [params], callback)](#EnhancedEventEmitter+emitAsync)
  * [#onAsync(event, listener)](#EnhancedEventEmitter+onAsync) ⇒ <code>function</code>
  * [#addFilter([event], filter)](#EnhancedEventEmitter+addFilter) ⇒ <code>function</code>
  * [#addEventFilter(event, filter)](#EnhancedEventEmitter+addEventFilter) ⇒ <code>function</code>
  * [#addGlobalFilter(filter)](#EnhancedEventEmitter+addGlobalFilter) ⇒ <code>function</code>
  * [#filter([event], filter)](#EnhancedEventEmitter+filter) ⇒ <code>function</code>
  * [#runFilterChain(emitArguments)](#EnhancedEventEmitter+runFilterChain) ⇒ <code>boolean</code> ℗
  * [#markEvent(event, [events])](#EnhancedEventEmitter+markEvent) ⇒ <code>object</code> ℗

<a name="new_EnhancedEventEmitter_new"></a>
### new EnhancedEventEmitter()
This class holds all the extended capabilities added to any emitter.

<a name="EnhancedEventEmitter.enhancedEmitterType"></a>
### EnhancedEventEmitter.enhancedEmitterType : <code>boolean</code> ℗
Marker attribute to prevent multiple wrapping of emitter.

**Access:** private  
<a name="EnhancedEventEmitter.suspended"></a>
### EnhancedEventEmitter.suspended : <code>boolean</code>
If true, all events will not trigger any listener (or 'else' listener).<br>
The emit function will simply do nothing.

**Access:** public  
<a name="EnhancedEventEmitter+suspend"></a>
### EnhancedEventEmitter#suspend(event)
Suspends all emit calls for the provided event name (including 'else' listeners).<br>
The emit function will simply do nothing for the specific event.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event to suspend |

<a name="EnhancedEventEmitter+unsuspend"></a>
### EnhancedEventEmitter#unsuspend(event)
Unsuspends the emit calls for the provided event name.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event to unsuspend |

<a name="EnhancedEventEmitter+else"></a>
### EnhancedEventEmitter#else(listener)
Adds an 'else' listener which will be triggered by all events that do not have a
listener currently for them (apart of the special 'error' event).

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>[ElseCallback](#ElseCallback)</code> | The listener that will catch all 'else' events |

**Example**  
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
<a name="EnhancedEventEmitter+removeElseListener"></a>
### EnhancedEventEmitter#removeElseListener(listener)
Removes the provided 'else' listener.<br>
Same as 'unelse' function.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>[ElseCallback](#ElseCallback)</code> | The listener to remove |

<a name="EnhancedEventEmitter+unelse"></a>
### EnhancedEventEmitter#unelse(listener)
See 'removeElseListener' documentation.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>[ElseCallback](#ElseCallback)</code> | The listener to remove |

<a name="EnhancedEventEmitter+removeAllElseListeners"></a>
### EnhancedEventEmitter#removeAllElseListeners()
Removes all 'else' listeners.

**Access:** public  
<a name="EnhancedEventEmitter+elseError"></a>
### EnhancedEventEmitter#elseError(event)
In case an event with the provided name is emitted but no listener is attached to it,
an error event will emitted by this emitter instance instead.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |

<a name="EnhancedEventEmitter+removeElseError"></a>
### EnhancedEventEmitter#removeElseError(event)
Removes the else-error handler for the provided event.<br>
Same as 'unelseError' function.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |

<a name="EnhancedEventEmitter+unelseError"></a>
### EnhancedEventEmitter#unelseError(event)
See 'removeElseError' documentation.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |

<a name="EnhancedEventEmitter+emit"></a>
### EnhancedEventEmitter#emit(event, [params]) ⇒ <code>boolean</code>
See Node.js events.EventEmitter documentation.

**Returns**: <code>boolean</code> - True if a listener or an 'else' listener handled the event  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |
| [params] | <code>\*</code> | The event parameters |

<a name="EnhancedEventEmitter+handleNoEmit"></a>
### EnhancedEventEmitter#handleNoEmit(event, eventArguments) ⇒ <code>boolean</code> ℗
Handles events which had no listeners.

**Returns**: <code>boolean</code> - True if a listener or an 'else' listener handled the event  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |
| eventArguments | <code>array</code> | All the arguments to send the else callbacks |

<a name="EnhancedEventEmitter+invokeElseListener"></a>
### EnhancedEventEmitter#invokeElseListener(eventArguments) ℗
Invokes all of the 'else' listeners.

**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| eventArguments | <code>array</code> | All the arguments to send the else callbacks |

<a name="EnhancedEventEmitter+emitAsync"></a>
### EnhancedEventEmitter#emitAsync(event, [params], callback)
Invokes the emit after a timeout to enable calling flow to continue and not
block due to event listeners.

**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |
| [params] | <code>\*</code> | The event parameters |
| callback | <code>[AsyncEmitCallback](#AsyncEmitCallback)</code> | The async callback |

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
<a name="EnhancedEventEmitter+onAsync"></a>
### EnhancedEventEmitter#onAsync(event, listener) ⇒ <code>function</code>
Adds a listener that will be triggered after a timeout during an emit.<br>
This ensures that the provided listener is invoked after all other listeners and that
it will not block the emit caller flow.<br>
To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Returns**: <code>function</code> - The remove listener function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name |
| listener | <code>function</code> | The listener function |

<a name="EnhancedEventEmitter+addFilter"></a>
### EnhancedEventEmitter#addFilter([event], filter) ⇒ <code>function</code>
Adds a filter that will be triggered before every emit for the provided event type (if
no event is provided, than the filter is invoked for all events).<br>
The filter enables to prevent events from reaching the listeners in case some criteria is met.

**Returns**: <code>function</code> - The remove filter function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>string</code> | The event name. If not provided, the filter is relevant for all events. |
| filter | <code>[FilterCallback](#FilterCallback)</code> | The filter function |

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
<a name="EnhancedEventEmitter+addEventFilter"></a>
### EnhancedEventEmitter#addEventFilter(event, filter) ⇒ <code>function</code>
Adds an event filter (See addFilter)

**Returns**: <code>function</code> - The remove filter function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name. |
| filter | <code>[FilterCallback](#FilterCallback)</code> | The filter function |

<a name="EnhancedEventEmitter+addGlobalFilter"></a>
### EnhancedEventEmitter#addGlobalFilter(filter) ⇒ <code>function</code>
Adds a global filter (See addFilter)

**Returns**: <code>function</code> - The remove filter function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>[FilterCallback](#FilterCallback)</code> | The filter function |

<a name="EnhancedEventEmitter+filter"></a>
### EnhancedEventEmitter#filter([event], filter) ⇒ <code>function</code>
See 'addFilter' documentation.

**Returns**: <code>function</code> - The remove filter function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>string</code> | The event name. If not provided, the filter is relevant for all events. |
| filter | <code>[FilterCallback](#FilterCallback)</code> | The filter function |

<a name="EnhancedEventEmitter+runFilterChain"></a>
### EnhancedEventEmitter#runFilterChain(emitArguments) ⇒ <code>boolean</code> ℗
Returns true if to allow to emit the event based on the currently setup filters.

**Returns**: <code>boolean</code> - True to continue with the emit, false to prevent it  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| emitArguments | <code>array</code> | All emit function arguments array |

<a name="EnhancedEventEmitter+markEvent"></a>
### EnhancedEventEmitter#markEvent(event, [events]) ⇒ <code>object</code> ℗
Marks the given event in the events map.

**Returns**: <code>object</code> - The updated events map  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name to mark |
| [events] | <code>object</code> | The events map |

<a name="EventEmitterEnhancer"></a>
## EventEmitterEnhancer : <code>object</code>
Extends the Node.js events.EventEmitter with extra capabilities.

**Kind**: global namespace  
**Author:** Sagie Gur-Ari  

* [EventEmitterEnhancer](#EventEmitterEnhancer) : <code>object</code>
  * [.EnhancedEventEmitter](#EventEmitterEnhancer.EnhancedEventEmitter) : <code>EventEmitter</code>
  * _static_
    * [.validateDoubleEnhancement(type)](#EventEmitterEnhancer.validateDoubleEnhancement) ℗
    * [.enhance(EmitterType, modifyType)](#EventEmitterEnhancer.enhance) ⇒ <code>object</code> ℗
    * [.extend(EmitterType)](#EventEmitterEnhancer.extend) ⇒ <code>object</code>
    * [.modify(EmitterType)](#EventEmitterEnhancer.modify)
    * [.modifyInstance(emitterInstance)](#EventEmitterEnhancer.modifyInstance)

<a name="EventEmitterEnhancer.EnhancedEventEmitter"></a>
### EventEmitterEnhancer.EnhancedEventEmitter : <code>EventEmitter</code>
The node.js event emitter prototype extended with the extra capabilities.

**Access:** public  
<a name="EventEmitterEnhancer.validateDoubleEnhancement"></a>
### EventEmitterEnhancer.validateDoubleEnhancement(type) ℗
Throws the already enhanced error in case provided input
has already been enhanced.

**Kind**: static method of <code>[EventEmitterEnhancer](#EventEmitterEnhancer)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>object</code> | The type to validate |

<a name="EventEmitterEnhancer.enhance"></a>
### EventEmitterEnhancer.enhance(EmitterType, modifyType) ⇒ <code>object</code> ℗
Modified/extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Kind**: static method of <code>[EventEmitterEnhancer](#EventEmitterEnhancer)</code>  
**Returns**: <code>object</code> - The modified object type  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>object</code> | The object type |
| modifyType | <code>number</code> | 0 to extend the prototype of the provided object, 1 to modify the prototype of the provided object, 2 to modify the provided instance |

<a name="EventEmitterEnhancer.extend"></a>
### EventEmitterEnhancer.extend(EmitterType) ⇒ <code>object</code>
Extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Kind**: static method of <code>[EventEmitterEnhancer](#EventEmitterEnhancer)</code>  
**Returns**: <code>object</code> - The modified object type  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>object</code> | The object type |

**Example**  
```js
//extend events.EventEmitter class (or any class that has the same interface)
//now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
var emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
```
<a name="EventEmitterEnhancer.modify"></a>
### EventEmitterEnhancer.modify(EmitterType)
Modified the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Kind**: static method of <code>[EventEmitterEnhancer](#EventEmitterEnhancer)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| EmitterType | <code>object</code> | The object type |

**Example**  
```js
//modify the proto of an events.EventEmitter class (or any class that has the same interface)
//now all existing and future instances of the original class are modified to include the new extended capabilities.
EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
var emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
```
<a name="EventEmitterEnhancer.modifyInstance"></a>
### EventEmitterEnhancer.modifyInstance(emitterInstance)
Modified the specific object instance with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Kind**: static method of <code>[EventEmitterEnhancer](#EventEmitterEnhancer)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| emitterInstance | <code>object</code> | The emitter instance |

**Example**  
```js
//modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
var emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
```
<a name="FilterCallback"></a>
## FilterCallback ⇒ <code>boolean</code>
'filter' callback.

**Kind**: global typedef  
**Returns**: <code>boolean</code> - True to continue with the emit, false to prevent emit  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type |
| [params] | <code>\*</code> | The event parameters |

<a name="ElseCallback"></a>
## ElseCallback : <code>function</code>
'else' callback.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type |
| [params] | <code>\*</code> | The event parameters |

<a name="AsyncEmitCallback"></a>
## AsyncEmitCallback : <code>function</code>
'async-emit' callback.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type |
| [params] | <code>\*</code> | The event parameters |
| emitted | <code>boolean</code> | True if emitted, else false |

