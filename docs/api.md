#Index

**Classes**

* [class: EnhancedEventEmitter](#EnhancedEventEmitter)
  * [new EnhancedEventEmitter()](#new_EnhancedEventEmitter)
  * [EnhancedEventEmitter..suspended](#EnhancedEventEmitter.suspended)
  * [EnhancedEventEmitter#suspend(event)](#EnhancedEventEmitter#suspend)
  * [EnhancedEventEmitter#unsuspend(event)](#EnhancedEventEmitter#unsuspend)
  * [EnhancedEventEmitter#else(listener)](#EnhancedEventEmitter#else)
  * [EnhancedEventEmitter#removeElseListener(listener)](#EnhancedEventEmitter#removeElseListener)
  * [EnhancedEventEmitter#unelse(listener)](#EnhancedEventEmitter#unelse)
  * [EnhancedEventEmitter#removeAllElseListeners()](#EnhancedEventEmitter#removeAllElseListeners)
  * [EnhancedEventEmitter#elseError(event)](#EnhancedEventEmitter#elseError)
  * [EnhancedEventEmitter#removeElseError(event)](#EnhancedEventEmitter#removeElseError)
  * [EnhancedEventEmitter#unelseError(event)](#EnhancedEventEmitter#unelseError)
  * [EnhancedEventEmitter#emit(event, [params])](#EnhancedEventEmitter#emit)
  * [EnhancedEventEmitter#handleNoEmit(event, eventArguments)](#EnhancedEventEmitter#handleNoEmit)
  * [EnhancedEventEmitter#invokeElseListener(eventArguments)](#EnhancedEventEmitter#invokeElseListener)
  * [EnhancedEventEmitter#emitAsync(event, [params], callback)](#EnhancedEventEmitter#emitAsync)
  * [EnhancedEventEmitter#onAsync(event, listener)](#EnhancedEventEmitter#onAsync)
  * [EnhancedEventEmitter#addFilter([event], filter)](#EnhancedEventEmitter#addFilter)
  * [EnhancedEventEmitter#addEventFilter(event, filter)](#EnhancedEventEmitter#addEventFilter)
  * [EnhancedEventEmitter#addGlobalFilter(filter)](#EnhancedEventEmitter#addGlobalFilter)
  * [EnhancedEventEmitter#filter([event], filter)](#EnhancedEventEmitter#filter)
  * [EnhancedEventEmitter#runFilterChain(emitArguments)](#EnhancedEventEmitter#runFilterChain)

**Namespaces**

* [EventEmitterEnhancer](#EventEmitterEnhancer)
  * [EventEmitterEnhancer..EnhancedEventEmitter](#EventEmitterEnhancer.EnhancedEventEmitter)
  * [EventEmitterEnhancer.enhance(EmitterType, modifyType)](#EventEmitterEnhancer.enhance)
  * [EventEmitterEnhancer.extend(EmitterType)](#EventEmitterEnhancer.extend)
  * [EventEmitterEnhancer.modify(EmitterType)](#EventEmitterEnhancer.modify)
  * [EventEmitterEnhancer.modifyInstance(emitterInstance)](#EventEmitterEnhancer.modifyInstance)

**Typedefs**

* [callback: FilterCallback](#FilterCallback)
* [callback: ElseCallback](#ElseCallback)
* [callback: AsyncEmitCallback](#AsyncEmitCallback)
 
<a name="EnhancedEventEmitter"></a>
#class: EnhancedEventEmitter
**Members**

* [class: EnhancedEventEmitter](#EnhancedEventEmitter)
  * [new EnhancedEventEmitter()](#new_EnhancedEventEmitter)
  * [EnhancedEventEmitter..suspended](#EnhancedEventEmitter.suspended)
  * [EnhancedEventEmitter#suspend(event)](#EnhancedEventEmitter#suspend)
  * [EnhancedEventEmitter#unsuspend(event)](#EnhancedEventEmitter#unsuspend)
  * [EnhancedEventEmitter#else(listener)](#EnhancedEventEmitter#else)
  * [EnhancedEventEmitter#removeElseListener(listener)](#EnhancedEventEmitter#removeElseListener)
  * [EnhancedEventEmitter#unelse(listener)](#EnhancedEventEmitter#unelse)
  * [EnhancedEventEmitter#removeAllElseListeners()](#EnhancedEventEmitter#removeAllElseListeners)
  * [EnhancedEventEmitter#elseError(event)](#EnhancedEventEmitter#elseError)
  * [EnhancedEventEmitter#removeElseError(event)](#EnhancedEventEmitter#removeElseError)
  * [EnhancedEventEmitter#unelseError(event)](#EnhancedEventEmitter#unelseError)
  * [EnhancedEventEmitter#emit(event, [params])](#EnhancedEventEmitter#emit)
  * [EnhancedEventEmitter#handleNoEmit(event, eventArguments)](#EnhancedEventEmitter#handleNoEmit)
  * [EnhancedEventEmitter#invokeElseListener(eventArguments)](#EnhancedEventEmitter#invokeElseListener)
  * [EnhancedEventEmitter#emitAsync(event, [params], callback)](#EnhancedEventEmitter#emitAsync)
  * [EnhancedEventEmitter#onAsync(event, listener)](#EnhancedEventEmitter#onAsync)
  * [EnhancedEventEmitter#addFilter([event], filter)](#EnhancedEventEmitter#addFilter)
  * [EnhancedEventEmitter#addEventFilter(event, filter)](#EnhancedEventEmitter#addEventFilter)
  * [EnhancedEventEmitter#addGlobalFilter(filter)](#EnhancedEventEmitter#addGlobalFilter)
  * [EnhancedEventEmitter#filter([event], filter)](#EnhancedEventEmitter#filter)
  * [EnhancedEventEmitter#runFilterChain(emitArguments)](#EnhancedEventEmitter#runFilterChain)

<a name="new_EnhancedEventEmitter"></a>
##new EnhancedEventEmitter()
This class holds all the extended capabilities added to any emitter.

**Author**: Sagie Gur-Ari  
<a name="EnhancedEventEmitter.suspended"></a>
##EnhancedEventEmitter..suspended
If true, all events will not trigger any listener (or 'else' listener).<br>The emit function will simply do nothing.

**Type**: `boolean`  
<a name="EnhancedEventEmitter#suspend"></a>
##EnhancedEventEmitter#suspend(event)
Suspends all emit calls for the provided event name (including 'else' listeners).<br>The emit function will simply do nothing for the specific event.

**Params**

- event `string` - The event to suspend  

<a name="EnhancedEventEmitter#unsuspend"></a>
##EnhancedEventEmitter#unsuspend(event)
Unsuspends the emit calls for the provided event name.

**Params**

- event `string` - The event to unsuspend  

<a name="EnhancedEventEmitter#else"></a>
##EnhancedEventEmitter#else(listener)
Adds an 'else' listener which will be triggered by all events that do not have alistener currently for them (apart of the special 'error' event).

**Params**

- listener <code>[ElseCallback](#ElseCallback)</code> - The listener that will catch all 'else' events  

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

<a name="EnhancedEventEmitter#removeElseListener"></a>
##EnhancedEventEmitter#removeElseListener(listener)
Removes the provided 'else' listener.<br>Same as 'unelse' function.

**Params**

- listener <code>[ElseCallback](#ElseCallback)</code> - The listener to remove  

<a name="EnhancedEventEmitter#unelse"></a>
##EnhancedEventEmitter#unelse(listener)
See 'removeElseListener' documentation.

**Params**

- listener <code>[ElseCallback](#ElseCallback)</code> - The listener to remove  

<a name="EnhancedEventEmitter#removeAllElseListeners"></a>
##EnhancedEventEmitter#removeAllElseListeners()
Removes all 'else' listeners.

<a name="EnhancedEventEmitter#elseError"></a>
##EnhancedEventEmitter#elseError(event)
In case an event with the provided name is emitted but no listener is attached to it,an error event will emitted by this emitter instance instead.

**Params**

- event `string` - The event name  

<a name="EnhancedEventEmitter#removeElseError"></a>
##EnhancedEventEmitter#removeElseError(event)
Removes the else-error handler for the provided event.<br>Same as 'unelseError' function.

**Params**

- event `string` - The event name  

<a name="EnhancedEventEmitter#unelseError"></a>
##EnhancedEventEmitter#unelseError(event)
See 'removeElseError' documentation.

**Params**

- event `string` - The event name  

<a name="EnhancedEventEmitter#emit"></a>
##EnhancedEventEmitter#emit(event, [params])
See Node.js events.EventEmitter documentation.

**Params**

- event `string` - The event name  
- \[params\] `*` - The event parameters  

**Returns**: `boolean` - True if a listener or an 'else' listener handled the event  
<a name="EnhancedEventEmitter#handleNoEmit"></a>
##EnhancedEventEmitter#handleNoEmit(event, eventArguments)
Handles events which had no listeners.

**Params**

- event `string` - The event name  
- eventArguments `array` - All the arguments to send the else callbacks  

**Returns**: `boolean` - True if a listener or an 'else' listener handled the event  
**Access**: private  
<a name="EnhancedEventEmitter#invokeElseListener"></a>
##EnhancedEventEmitter#invokeElseListener(eventArguments)
Invokes all of the 'else' listeners.

**Params**

- eventArguments `array` - All the arguments to send the else callbacks  

**Access**: private  
<a name="EnhancedEventEmitter#emitAsync"></a>
##EnhancedEventEmitter#emitAsync(event, [params], callback)
Invokes the emit after a timeout to enable calling flow to continue and notblock due to event listeners.

**Params**

- event `string` - The event name  
- \[params\] `*` - The event parameters  
- callback <code>[AsyncEmitCallback](#AsyncEmitCallback)</code> - The async callback  

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

<a name="EnhancedEventEmitter#onAsync"></a>
##EnhancedEventEmitter#onAsync(event, listener)
Adds a listener that will be triggered after a timeout during an emit.<br>This ensures that the provided listener is invoked after all other listeners and thatit will not block the emit caller flow.<br>To remove the listener, the returned function must be called instead of doing emitter.removeListener(...)

**Params**

- event `string` - The event name  
- listener `function` - The listener function  

**Returns**: `function` - The remove listener function  
<a name="EnhancedEventEmitter#addFilter"></a>
##EnhancedEventEmitter#addFilter([event], filter)
Adds a filter that will be triggered before every emit for the provided event type (ifno event is provided, than the filter is invoked for all events).<br>The filter enables to prevent events from reaching the listeners in case some criteria is met.

**Params**

- \[event\] `string` - The event name. If not provided, the filter is relevant for all events.  
- filter <code>[FilterCallback](#FilterCallback)</code> - The filter function  

**Returns**: `function` - The remove filter function  
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

<a name="EnhancedEventEmitter#addEventFilter"></a>
##EnhancedEventEmitter#addEventFilter(event, filter)
Adds an event filter (See addFilter)

**Params**

- event `string` - The event name.  
- filter <code>[FilterCallback](#FilterCallback)</code> - The filter function  

**Returns**: `function` - The remove filter function  
<a name="EnhancedEventEmitter#addGlobalFilter"></a>
##EnhancedEventEmitter#addGlobalFilter(filter)
Adds a global filter (See addFilter)

**Params**

- filter <code>[FilterCallback](#FilterCallback)</code> - The filter function  

**Returns**: `function` - The remove filter function  
<a name="EnhancedEventEmitter#filter"></a>
##EnhancedEventEmitter#filter([event], filter)
See 'addFilter' documentation.

**Params**

- \[event\] `string` - The event name. If not provided, the filter is relevant for all events.  
- filter <code>[FilterCallback](#FilterCallback)</code> - The filter function  

**Returns**: `function` - The remove filter function  
<a name="EnhancedEventEmitter#runFilterChain"></a>
##EnhancedEventEmitter#runFilterChain(emitArguments)
Returns true if to allow to emit the event based on the currently setup filters.

**Params**

- emitArguments `array` - All emit function arguments array  

**Returns**: `boolean` - True to continue with the emit, false to prevent it  
**Access**: private  
<a name="EventEmitterEnhancer"></a>
#EventEmitterEnhancer
Extends the Node.js events.EventEmitter with extra capabilities.

**Author**: Sagie Gur-Ari  
**Members**

* [EventEmitterEnhancer](#EventEmitterEnhancer)
  * [EventEmitterEnhancer..EnhancedEventEmitter](#EventEmitterEnhancer.EnhancedEventEmitter)
  * [EventEmitterEnhancer.enhance(EmitterType, modifyType)](#EventEmitterEnhancer.enhance)
  * [EventEmitterEnhancer.extend(EmitterType)](#EventEmitterEnhancer.extend)
  * [EventEmitterEnhancer.modify(EmitterType)](#EventEmitterEnhancer.modify)
  * [EventEmitterEnhancer.modifyInstance(emitterInstance)](#EventEmitterEnhancer.modifyInstance)

<a name="EventEmitterEnhancer.EnhancedEventEmitter"></a>
##EventEmitterEnhancer..EnhancedEventEmitter
The node.js event emitter prototype extended with the extra capabilities.

**Type**: `EventEmitter`  
<a name="EventEmitterEnhancer.enhance"></a>
##EventEmitterEnhancer.enhance(EmitterType, modifyType)
Modified/extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Params**

- EmitterType `object` - The object type  
- modifyType `number` - 0 to extend the prototype of the provided object, 1 to modify the prototype of the provided object, 2 to modify the provided instance  

**Returns**: `object` - The modified object type  
**Access**: private  
<a name="EventEmitterEnhancer.extend"></a>
##EventEmitterEnhancer.extend(EmitterType)
Extends the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Params**

- EmitterType `object` - The object type  

**Returns**: `object` - The modified object type  
**Example**  
```js
//extend events.EventEmitter class (or any class that has the same interface)
//now you can create instances of the new EnhancedEventEmitter type while events.EventEmitter is not modified/impacted in any way
var EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter);   //extend the event emitter class (can be Node.js of some custom event emitter). original base class is not affected.
var emitter = new EnhancedEventEmitter();   //create a new instance using the new extended class type.
```

<a name="EventEmitterEnhancer.modify"></a>
##EventEmitterEnhancer.modify(EmitterType)
Modified the provided object prototype with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Params**

- EmitterType `object` - The object type  

**Example**  
```js
//modify the proto of an events.EventEmitter class (or any class that has the same interface)
//now all existing and future instances of the original class are modified to include the new extended capabilities.
EventEmitterEnhancer.modify(EventEmitter); //modify the event emitter class prototype (can be Node.js of some custom event emitter). existing instances are impacted.
var emitter = new EventEmitter();   //create an instance of the original class and automatically get the new extended capabilities.
```

<a name="EventEmitterEnhancer.modifyInstance"></a>
##EventEmitterEnhancer.modifyInstance(emitterInstance)
Modified the specific object instance with the extended emitter capabilities.<br>
The provided object type must have an Node.js events.EventEmitter compatible interface.

**Params**

- emitterInstance `object` - The emitter instance  

**Example**  
```js
//modify specific instance to include the extended capabilities (other existing/future instances of that class type are not modified/impacted in any way).
var emitter = new EventEmitter();   //create an instance of an event emitter (can be Node.js of some custom event emitter)
EventEmitterEnhancer.modifyInstance(emitter);   //modify the specific instance and add the extended capabilities. the original prototype is not affected.
```

<a name="FilterCallback"></a>
#callback: FilterCallback
'filter' callback.

**Params**

- type `string` - The event type  
- \[params\] `*` - The event parameters  

**Type**: `function`  
**Returns**: `boolean` - True to continue with the emit, false to prevent emit  
<a name="ElseCallback"></a>
#callback: ElseCallback
'else' callback.

**Params**

- type `string` - The event type  
- \[params\] `*` - The event parameters  

**Type**: `function`  
<a name="AsyncEmitCallback"></a>
#callback: AsyncEmitCallback
'async-emit' callback.

**Params**

- type `string` - The event type  
- \[params\] `*` - The event parameters  
- emitted `boolean` - True if emitted, else false  

**Type**: `function`  
