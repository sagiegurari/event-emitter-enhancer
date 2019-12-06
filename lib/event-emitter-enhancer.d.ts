import EventEmitter from 'events'

/**
 * A unique event name, defined by a string or a symbol.
 */
type Event = string | symbol

/**
 * An optional callback attached to asynchronously emitted events, fired after
 * the event has been dispatched.
 */
interface AsyncEmitCallback extends Function {
  (event: Event, emitted: boolean): void,
  (event: Event, arg0: any, emitted: boolean): void,
  (event: Event, arg0: any, arg1: any, emitted: boolean): void,
  (event: Event, arg0: any, arg1: any, arg2: any, emitted: boolean): void,
  (event: Event, arg0: any, arg1: any, arg2: any, arg3: any, emitted: boolean): void,
  (event: Event, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, emitted: boolean): void,
  (event: Event, ...args: Array<any | boolean>): void,
}

/**
 * The filter function responsible for pre-processing events.
 */
interface FilterCallback extends Function {
  (event: Event, ...args: any[]): boolean,
}

/**
 * A basic event handler that receives the event name as its first parameter
 * along with any arguments passed to the dispatcher.
 */
interface ListenerFunction extends Function {
  (event: Event, ...args: any[]): void,
}

/**
 * Options for the more complex version of the "on" method, which supports
 * multiple events, multiple listeners, asynchronous events, and a timeout.
 */
interface OnOptions {
  /**
   * Whether the event handler should be called asynchronously.
   */
  async?: boolean,

  /**
   * The event or events to handle.
   */
  event: Event | Event[],

  /**
   * The handler or handlers to call when events are triggered.
   */
  listener: ListenerFunction | ListenerFunction[],

  /**
   * Optionally disable the listener after a certain number of milliseconds.
   */
  timeout?: number,
}

interface RemoveFunction extends Function {
  (): void,
}

/**
 * Extends the Node.js EventEmitter with additional capabilities.
 */
export class EnhancedEventEmitter {
  /**
   * If true, listeners (including "else" listeners) will not be triggered
   * on emit.
   */
  suspended: boolean

  /**
   * If defined, events will be splitted by this separator and emitted as partials.<br>
   * For example, if the separator is ':' an event event1:event2:event3 will be emitted as 3 events: event1, event1:event2, event1:event2:event3.
   */
  subscriptionSeparator: string

  /**
   * Adds a filter function that will be triggered before every emit of a
   * specific event. The filter should return "true" to permit dispatch, or
   * "false" to block dispatch.
   */
  addEventFilter(event: Event, filter: FilterCallback): RemoveFunction

  /**
   * Adds a filter function that will be triggered before every emit (if no
   * event name is provided) or before every emit of a specific event (if an
   * event name is passed as the first parameter). The filter should return
   * "true" to permit dispatch, or "false" to block dispatch.
   */
  addFilter(filter: FilterCallback): RemoveFunction

  /**
   * Adds a filter function that will be triggered before every emit (if no
   * event name is provided) or before every emit of a specific event (if an
   * event name is passed as the first parameter). The filter should return
   * "true" to permit dispatch, or "false" to block dispatch.
   */
  addFilter(event: Event, filter: FilterCallback): RemoveFunction

  /**
   * Adds a filter function that will be triggered before every emit. The
   * filter should return "true" to permit dispatch, or "false" to block
   * dispatch.
   */
  addGlobalFilter(filter: FilterCallback): RemoveFunction

  /**
   * The base Node.js "addListener" function, accepting an event name and
   * a listener function and returning the instance for chaining.
   */
  addListener(event: Event, listener: ListenerFunction): this

  /**
   * Creates an empty listener for a given event.
   */
  addNoop(event: Event): RemoveFunction

  /**
   * Adds a listener which will be triggered by all events that do not have
   * a matching listener.
   */
  else(listener: ListenerFunction): void

  /**
   * If an event with the provided name is emitted, but no listeners are
   * listening for it, the EnhancedEventEmitter will emit an error.
   */
  elseError(event: Event): void

  /**
   * Causes the emitter to trigger all listeners attached to the provided
   * event. Returns "true" if the event was handled, "false" if it was not.
   */
  emit(event: Event, ...args: any[]): boolean

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, arg0: any, callback?: AsyncEmitCallback): void

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, arg0: any, arg1: any, callback?: AsyncEmitCallback): void

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, arg0: any, arg1: any, arg2: any, callback?: AsyncEmitCallback): void

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, arg0: any, arg1: any, arg2: any, arg3: any, callback?: AsyncEmitCallback): void

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, callback?: AsyncEmitCallback): void

  /**
   * Emits the event asynchronously, ensuring flow is not blocked by
   * listeners.
   */
  emitAsync(event: Event, ...args: Array<any | AsyncEmitCallback>): void

  /**
   * Returns all configured event names with listeners attached.
   */
  eventNames(): Event[]

  /**
   * Adds a filter function that will be triggered before every emit (if no
   * event name is provided) or before every emit of a specific event (if an
   * event name is passed as the first parameter). The filter should return
   * "true" to permit dispatch, or "false" to block dispatch.
   */
  filter(filter: FilterCallback): RemoveFunction

  /**
   * Adds a filter function that will be triggered before every emit (if no
   * event name is provided) or before every emit of a specific event (if an
   * event name is passed as the first parameter). The filter should return
   * "true" to permit dispatch, or "false" to block dispatch.
   */
  filter(event: Event, filter: FilterCallback): RemoveFunction

  /**
   * Get the maximum configured number of listeners per event name this
   * instance will allow.
   */
  getMaxListeners(): number

  /**
   * Creates a dummy empty error handler to prevent unhandled errors from
   * crashing the process.
   */
  ignoreError(): void

  /**
   * Returns the total number of listeners attached to the given event name.
   */
  listenerCount(event: Event): number

  /**
   * Returns all listeners for a given event name.
   */
  listeners(event: Event): ListenerFunction[]

  /**
   * Disables a previously configured event listener with the given name
   * and listener function and returns the instance for chaining.
   */
  off(event: Event, listener: ListenerFunction): this

  /**
   * The Node.js EventEmitter "on" function. Returns a function that removes
   * the listener when called.
   */
  on(event: Event, listener: ListenerFunction): RemoveFunction

  /**
   * Extends "on" with more complex capabilities, including providing
   * multiple listeners and event names, timing out the listener, and
   * more. To remove the listeners, the returned function must be
   * called instead of "removeEventListener."
   */
  on(options: OnOptions): RemoveFunction

  /**
   * Adds a listener for all provided event names. To remove the listener,
   * the returned function must be called instead of "removeEventListener."
   */
  onAny(events: Event[], listener: ListenerFunction): RemoveFunction

  /**
   * Adds a listener which will be triggered asynchronously, ensuring that
   * the listener is invoked after all other listeners without blocking flow.
   * To remove the listener, the returned function must be called instead of
   * "removeEventListener."
   */
  onAsync(event: Event, listener: ListenerFunction): RemoveFunction

  /**
   * The Node.js EventEmitter "once" function. Returns a function that
   * removes the listener when called.
   */
  once(event: Event, listener: ListenerFunction): RemoveFunction

  /**
   * Inserts a new event listener at the beginning of the listener queue,
   * returning the instance for chaining.
   */
  prependListener(event: Event, listener: ListenerFunction): this

  /**
   * Inserts a new event listener which will be called only once at the
   * beginning of the listener queue, returning the instance for chaining.
   */
  prependOnceListener(event: Event, listener: ListenerFunction): this

  /**
   * Proxies events emitted by another emitter through this emitter, so that
   * it emits them itself.
   */
  proxyEvents(emitter: EventEmitter | EnhancedEventEmitter, event: Event): RemoveFunction

  /**
   * Proxies events emitted by another emitter through this emitter, so that
   * it emits them itself.
   */
  proxyEvents(emitter: EventEmitter | EnhancedEventEmitter, events: Event[]): RemoveFunction

  /**
   * Proxies events emitted by another emitter through this emitter, so that
   * it emits them itself.
   */
  proxyEvents(emitters: Array<EventEmitter | EnhancedEventEmitter>, event: Event): RemoveFunction

  /**
   * Proxies events emitted by another emitter through this emitter, so that
   * it emits them itself.
   */
  proxyEvents(emitters: Array<EventEmitter | EnhancedEventEmitter>, events: Event[]): RemoveFunction

  /**
   * The Node.js EventEmitter "removeAllListeners" function.
   */
  removeAllListeners(event: Event): void

  /**
   * The Node.js EventEmitter "removeAllListeners" function, modified to
   * accept an array of event names.
   */
  removeAllListeners(events: Event[]): this

  /**
   * Removes all "else" listeners.
   */
  removeAllElseListeners(): void

  /**
   * Removes the "elseError" handler for the provided event.
   */
  removeElseError(event: Event): void

  /**
   * Removes the "else" listener that calls the provided function.
   */
  removeElseListener(listener: ListenerFunction): void

  /**
   * Disables a previously configured event listener with the given name
   * and listener function and returns the instance for chaining.
   */
  removeListener(event: Event, listener: ListenerFunction): this

  /**
   * Set the maximum number of listeners per event name this instance
   * will allow.
   */
  setMaxListeners(count: number): this

  /**
   * Suspends all listeners for the provided event name, including "else"
   * listeners.
   */
  suspend(event: Event): void

  /**
   * Removes the "else" listener that calls the provided function.
   */
  unelse(listener: ListenerFunction): void

  /**
   * Removes the "elseError" handler for the provided event.
   */
  unelseError(event: Event): void

  /**
   * Resumes all listeners for the provided event name.
   */
  unsuspend(event: Event): void
}

/**
 * An interface for extending EventEmitter prototypes with additional
 * capabilities.
 */
export class EventEmitterEnhancer {
  /**
   * A version of the EventEmitter already extended.
   */
  static readonly EnhancedEventEmitter: typeof EnhancedEventEmitter

  /**
   * Extends the provided object prototype with the capabilities of the
   * EnhancedEventEmitter, returning a new EnhancedEventEmitter constructor.
   */
  static extend(emitter: typeof EventEmitter): typeof EnhancedEventEmitter

  /**
   * Modifies the provided object prototype, replacing it with an extended
   * EnhancedEventEmitter with additional capabilities.
   */
  static modify(emitter: typeof EventEmitter): void

  /**
   * Extends a single EventEmitter object with additional capabilities.
   */
  static modifyInstance(emitter: EventEmitter): EnhancedEventEmitter
}

export default EventEmitterEnhancer
