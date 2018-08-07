(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) :
	(factory((global.GOVUKFrontend = {})));
}(this, (function (exports) { 'use strict';

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
function generateUniqueID () {
  var d = new Date().getTime();
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
var detect = ('Window' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
	(function (global) {
		if (global.constructor) {
			global.Window = global.constructor;
		} else {
			(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
		}
	}(this));
}

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
var detect = ("Document" in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

	if (this.HTMLDocument) { // IE8

		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
		this.Document = this.HTMLDocument;

	} else {

		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
		this.Document.prototype = document;
	}
}


})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
var detect = ('Element' in this && 'HTMLElement' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
(function () {

	// IE8
	if (window.Element && !window.HTMLElement) {
		window.HTMLElement = window.Element;
		return;
	}

	// create Element constructor
	window.Element = window.HTMLElement = new Function('return function Element() {}')();

	// generate sandboxed iframe
	var vbody = document.appendChild(document.createElement('body'));
	var frame = vbody.appendChild(document.createElement('iframe'));

	// use sandboxed iframe to replicate Element functionality
	var frameDocument = frame.contentWindow.document;
	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	var cache = {};

	// polyfill Element.prototype on an element
	var shiv = function (element, deep) {
		var
		childNodes = element.childNodes || [],
		index = -1,
		key, value, childNode;

		if (element.nodeType === 1 && element.constructor !== Element) {
			element.constructor = Element;

			for (key in cache) {
				value = cache[key];
				element[key] = value;
			}
		}

		while (childNode = deep && childNodes[++index]) {
			shiv(childNode, deep);
		}

		return element;
	};

	var elements = document.getElementsByTagName('*');
	var nativeCreateElement = document.createElement;
	var interval;
	var loopLimit = 100;

	prototype.attachEvent('onpropertychange', function (event) {
		var
		propertyName = event.propertyName,
		nonValue = !cache.hasOwnProperty(propertyName),
		newValue = prototype[propertyName],
		oldValue = cache[propertyName],
		index = -1,
		element;

		while (element = elements[++index]) {
			if (element.nodeType === 1) {
				if (nonValue || element[propertyName] === oldValue) {
					element[propertyName] = newValue;
				}
			}
		}

		cache[propertyName] = newValue;
	});

	prototype.constructor = Element;

	if (!prototype.hasAttribute) {
		// <Element>.hasAttribute
		prototype.hasAttribute = function hasAttribute(name) {
			return this.getAttribute(name) !== null;
		};
	}

	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
	function bodyCheck() {
		if (!(loopLimit--)) clearTimeout(interval);
		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
			shiv(document, true);
			if (interval && document.body.prototype) clearTimeout(interval);
			return (!!document.body.prototype);
		}
		return false;
	}
	if (!bodyCheck()) {
		document.onreadystatechange = bodyCheck;
		interval = setInterval(bodyCheck, 25);
	}

	// Apply to any new elements created after load
	document.createElement = function createElement(nodeName) {
		var element = nativeCreateElement(String(nodeName).toLowerCase());
		return shiv(element);
	};

	// remove sandboxed iframe
	document.removeChild(vbody);
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
var detect = (
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && (function() {
  	try {
  		var a = {};
  		Object.defineProperty(a, 'test', {value:42});
  		return true;
  	} catch(e) {
  		return false
  	}
  }())
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
(function (nativeDefineProperty) {

	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	Object.defineProperty = function defineProperty(object, property, descriptor) {

		// Where native support exists, assume it
		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
			return nativeDefineProperty(object, property, descriptor);
		}

		if (object === null || !(object instanceof Object || typeof object === 'object')) {
			throw new TypeError('Object.defineProperty called on non-object');
		}

		if (!(descriptor instanceof Object)) {
			throw new TypeError('Property description must be an object');
		}

		var propertyString = String(property);
		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
		var getterType = 'get' in descriptor && typeof descriptor.get;
		var setterType = 'set' in descriptor && typeof descriptor.set;

		// handle descriptor.get
		if (getterType) {
			if (getterType !== 'function') {
				throw new TypeError('Getter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineGetter__.call(object, propertyString, descriptor.get);
		} else {
			object[propertyString] = descriptor.value;
		}

		// handle descriptor.set
		if (setterType) {
			if (setterType !== 'function') {
				throw new TypeError('Setter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineSetter__.call(object, propertyString, descriptor.set);
		}

		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
		if ('value' in descriptor) {
			object[propertyString] = descriptor.value;
		}

		return object;
	};
}(Object.defineProperty));
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
var detect = (
  (function(global) {

  	if (!('Event' in global)) return false;
  	if (typeof global.Event === 'function') return true;

  	try {

  		// In IE 9-11, the Event object exists but cannot be instantiated
  		new Event('click');
  		return true;
  	} catch(e) {
  		return false;
  	}
  }(this))
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	// This polyfill depends on availability of `document` so will not run in a worker
	// However, we asssume there are no browsers with worker support that lack proper
	// support for `Event` within the worker
	if (typeof document === 'undefined' || typeof window === 'undefined') return;

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		var event;
		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

/**
 * JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
 *
 * Created since some Assistive Technologies (for example some Screenreaders)
 * will tell a user to press space on a 'button', so this functionality needs to be shimmed
 * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
 *
 * Usage instructions:
 * the 'shim' will be automatically initialised
 */

var KEY_SPACE = 32;

function Button ($module) {
  this.$module = $module;
}

/**
* Add event handler for KeyDown
* if the event target element has a role='button' and the event is key space pressed
* then it prevents the default event and triggers a click event
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target;
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
    event.preventDefault();
    // trigger the target's click event
    target.click();
  }
};

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  this.$module.addEventListener('keydown', this.handleKeyDown);
};

(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = 'bind' in Function.prototype;

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
      value: function bind(that) { // .length is 1
          // add necessary es5-shim utilities
          var $Array = Array;
          var $Object = Object;
          var ObjectPrototype = $Object.prototype;
          var ArrayPrototype = $Array.prototype;
          var Empty = function Empty() {};
          var to_string = ObjectPrototype.toString;
          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
          var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
          var array_slice = ArrayPrototype.slice;
          var array_concat = ArrayPrototype.concat;
          var array_push = ArrayPrototype.push;
          var max = Math.max;
          // /add necessary es5-shim utilities

          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isCallable(target)) {
              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var bound;
          var binder = function () {

              if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.

                  var result = target.apply(
                      this,
                      array_concat.call(args, array_slice.call(arguments))
                  );
                  if ($Object(result) === result) {
                      return result;
                  }
                  return this;

              } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.

                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(
                      that,
                      array_concat.call(args, array_slice.call(arguments))
                  );

              }

          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
              array_push.call(boundArgs, '$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              // Clean up dangling references.
              Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
      }
  });
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 *
 * Usage instructions:
 * the 'polyfill' will be automatically initialised
 */

var KEY_ENTER = 13;
var KEY_SPACE$1 = 32;

// Create a flag to know if the browser supports navtive details
var NATIVE_DETAILS = typeof document.createElement('details').open === 'boolean';

function Details ($module) {
  this.$module = $module;
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.handleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target;
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault();
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event);
        }
      }
    }
  });

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target;
    if (event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault();
      }
    }
  });

  node.addEventListener('click', callback);
};

Details.prototype.init = function () {
  var $module = this.$module;

  if (!$module) {
    return
  }

  // Save shortcuts to the inner summary and content elements
  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
  var $content = this.$content = $module.getElementsByTagName('div').item(0);

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$summary || !$content) {
    return
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$content.id) {
    $content.id = 'details-content-' + generateUniqueID();
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group');

  // Add role=button to summary
  $summary.setAttribute('role', 'button');

  // Add aria-controls
  $summary.setAttribute('aria-controls', $content.id);

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  // http://www.saliences.com/browserBugs/tabIndex.html
  if (!NATIVE_DETAILS) {
    $summary.tabIndex = 0;
  }

  // Detect initial open state
  var openAttr = $module.getAttribute('open') !== null;
  if (openAttr === true) {
    $summary.setAttribute('aria-expanded', 'true');
    $content.setAttribute('aria-hidden', 'false');
  } else {
    $summary.setAttribute('aria-expanded', 'false');
    $content.setAttribute('aria-hidden', 'true');
    if (!NATIVE_DETAILS) {
      $content.style.display = 'none';
    }
  }

  // Bind an event to handle summary elements
  this.handleInputs($summary, this.setAttributes.bind(this));
};

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.setAttributes = function () {
  var $module = this.$module;
  var $summary = this.$summary;
  var $content = this.$content;

  var expanded = $summary.getAttribute('aria-expanded') === 'true';
  var hidden = $content.getAttribute('aria-hidden') === 'true';

  $summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'));
  $content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'));

  if (!NATIVE_DETAILS) {
    $content.style.display = (expanded ? 'none' : '');

    var hasOpenAttr = $module.getAttribute('open') !== null;
    if (!hasOpenAttr) {
      $module.setAttribute('open', 'open');
    } else {
      $module.removeAttribute('open');
    }
  }
  return true
};

/**
* Remove the click event from the node element
* @param {object} node element
*/
Details.prototype.destroy = function (node) {
  node.removeEventListener('keypress');
  node.removeEventListener('keyup');
  node.removeEventListener('click');
};

function Checkboxes ($module) {
  this.$module = $module;
  this.$inputs = $module.querySelectorAll('input[type="checkbox"]');
}

Checkboxes.prototype.init = function () {
  var $module = this.$module;
  var $inputs = this.$inputs;

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls');

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls);
    $input.removeAttribute('data-aria-controls');
    this.setAttributes($input);
  }.bind(this));

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked;
  $input.setAttribute('aria-expanded', inputIsChecked);

  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'));
  $content.setAttribute('aria-hidden', !inputIsChecked);
};

Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target;

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox';
  var hasAriaControls = $target.getAttribute('aria-controls');
  if (isCheckbox && hasAriaControls) {
    this.setAttributes($target);
  }
};

function ErrorSummary ($module) {
  this.$module = $module;
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module;
  if (!$module) {
    return
  }
  window.addEventListener('load', function () {
    $module.focus();
  });
};

function Header ($module) {
  this.$module = $module;
}

Header.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return
  }

  // Check for button
  var $toggleButton = $module.querySelector('.js-header-toggle');
  if (!$toggleButton) {
    return
  }

  // Handle $toggleButton click events
  $toggleButton.addEventListener('click', this.handleClick.bind(this));
};

/**
* Toggle class
* @param {object} node element
* @param {string} className to toggle
*/
Header.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '');
  } else {
    node.className += ' ' + className;
  }
};

/**
* An event handler for click event on $toggleButton
* @param {object} event event
*/
Header.prototype.handleClick = function (event) {
  var $module = this.$module;
  var $toggleButton = event.target || event.srcElement;
  var $target = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls'));

  // If a button with aria-controls, handle click
  if ($toggleButton && $target) {
    this.toggleClass($target, 'govuk-header__navigation--open');
    this.toggleClass($toggleButton, 'govuk-header__menu-button--open');

    $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true');
    $target.setAttribute('aria-hidden', $target.getAttribute('aria-hidden') === 'false');
  }
};

function Radios ($module) {
  this.$module = $module;
  this.$inputs = $module.querySelectorAll('input[type="radio"]');
}

Radios.prototype.init = function () {
  var $module = this.$module;
  var $inputs = this.$inputs;

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls');

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls);
    $input.removeAttribute('data-aria-controls');
    this.setAttributes($input);
  }.bind(this));

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

Radios.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked;
  $input.setAttribute('aria-expanded', inputIsChecked);

  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'));
  $content.setAttribute('aria-hidden', !inputIsChecked);
};

Radios.prototype.handleClick = function (event) {
  nodeListForEach(this.$inputs, function ($input) {
    // If a radio with aria-controls, handle click
    var isRadio = $input.getAttribute('type') === 'radio';
    var hasAriaControls = $input.getAttribute('aria-controls');
    if (isRadio && hasAriaControls) {
      this.setAttributes($input);
    }
  }.bind(this));
};

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
    var detect = (
      'DOMTokenList' in this && (function (x) {
        return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
      })(document.createElement('x'))
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
    (function (global) {
      var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

      if (
          !nativeImpl ||
          (
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
            !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
          )
        ) {
        global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
          var dpSupport = true;
          var defineGetter = function (object, name, fn, configurable) {
            if (Object.defineProperty)
              Object.defineProperty(object, name, {
                configurable: false === dpSupport ? true : !!configurable,
                get: fn
              });

            else object.__defineGetter__(name, fn);
          };

          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
          try {
            defineGetter({}, "support");
          }
          catch (e) {
            dpSupport = false;
          }


          var _DOMTokenList = function (el, prop) {
            var that = this;
            var tokens = [];
            var tokenMap = {};
            var length = 0;
            var maxLength = 0;
            var addIndexGetter = function (i) {
              defineGetter(that, i, function () {
                preop();
                return tokens[i];
              }, false);

            };
            var reindex = function () {

              /** Define getter functions for array-like access to the tokenList's contents. */
              if (length >= maxLength)
                for (; maxLength < length; ++maxLength) {
                  addIndexGetter(maxLength);
                }
            };

            /** Helper function called at the start of each class method. Internal use only. */
            var preop = function () {
              var error;
              var i;
              var args = arguments;
              var rSpace = /\s+/;

              /** Validate the token/s passed to an instance method, if any. */
              if (args.length)
                for (i = 0; i < args.length; ++i)
                  if (rSpace.test(args[i])) {
                    error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                    error.code = 5;
                    error.name = "InvalidCharacterError";
                    throw error;
                  }


              /** Split the new value apart by whitespace*/
              if (typeof el[prop] === "object") {
                tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
              } else {
                tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
              }

              /** Avoid treating blank strings as single-item token lists */
              if ("" === tokens[0]) tokens = [];

              /** Repopulate the internal token lists */
              tokenMap = {};
              for (i = 0; i < tokens.length; ++i)
                tokenMap[tokens[i]] = true;
              length = tokens.length;
              reindex();
            };

            /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
            preop();

            /** Return the number of tokens in the underlying string. Read-only. */
            defineGetter(that, "length", function () {
              preop();
              return length;
            });

            /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
            that.toLocaleString =
              that.toString = function () {
                preop();
                return tokens.join(" ");
              };

            that.item = function (idx) {
              preop();
              return tokens[idx];
            };

            that.contains = function (token) {
              preop();
              return !!tokenMap[token];
            };

            that.add = function () {
              preop.apply(that, args = arguments);

              for (var args, token, i = 0, l = args.length; i < l; ++i) {
                token = args[i];
                if (!tokenMap[token]) {
                  tokens.push(token);
                  tokenMap[token] = true;
                }
              }

              /** Update the targeted attribute of the attached element if the token list's changed. */
              if (length !== tokens.length) {
                length = tokens.length >>> 0;
                if (typeof el[prop] === "object") {
                  el[prop].baseVal = tokens.join(" ");
                } else {
                  el[prop] = tokens.join(" ");
                }
                reindex();
              }
            };

            that.remove = function () {
              preop.apply(that, args = arguments);

              /** Build a hash of token names to compare against when recollecting our token list. */
              for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                ignore[args[i]] = true;
                delete tokenMap[args[i]];
              }

              /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
              for (i = 0; i < tokens.length; ++i)
                if (!ignore[tokens[i]]) t.push(tokens[i]);

              tokens = t;
              length = t.length >>> 0;

              /** Update the targeted attribute of the attached element. */
              if (typeof el[prop] === "object") {
                el[prop].baseVal = tokens.join(" ");
              } else {
                el[prop] = tokens.join(" ");
              }
              reindex();
            };

            that.toggle = function (token, force) {
              preop.apply(that, [token]);

              /** Token state's being forced. */
              if (undefined !== force) {
                if (force) {
                  that.add(token);
                  return true;
                } else {
                  that.remove(token);
                  return false;
                }
              }

              /** Token already exists in tokenList. Remove it, and return FALSE. */
              if (tokenMap[token]) {
                that.remove(token);
                return false;
              }

              /** Otherwise, add the token and return TRUE. */
              that.add(token);
              return true;
            };

            return that;
          };

          return _DOMTokenList;
        }());
      }

      // Add second argument to native DOMTokenList.toggle() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.toggle('x', false);
        if (!e.classList.contains('x')) return;
        e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
          var force = arguments[1];
          if (force === undefined) {
            var add = !this.contains(token);
            this[add ? 'add' : 'remove'](token);
            return add;
          }
          force = !!force;
          this[force ? 'add' : 'remove'](token);
          return force;
        };
      }());

      // Add multiple arguments to native DOMTokenList.add() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a', 'b');
        if (e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.add;
        e.classList.constructor.prototype.add = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

      // Add multiple arguments to native DOMTokenList.remove() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a');
        e.classList.add('b');
        e.classList.remove('a', 'b');
        if (!e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.remove;
        e.classList.constructor.prototype.remove = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
    var detect = (
      'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
        var e = document.createElement('span');
        e.classList.add('a', 'b');
        return e.classList.contains('b');
      }())
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/polyfill.js
    (function (global) {
      var dpSupport = true;
      var defineGetter = function (object, name, fn, configurable) {
        if (Object.defineProperty)
          Object.defineProperty(object, name, {
            configurable: false === dpSupport ? true : !!configurable,
            get: fn
          });

        else object.__defineGetter__(name, fn);
      };
      /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
      try {
        defineGetter({}, "support");
      }
      catch (e) {
        dpSupport = false;
      }
      /** Polyfills a property with a DOMTokenList */
      var addProp = function (o, name, attr) {

        defineGetter(o.prototype, name, function () {
          var tokenList;

          var THIS = this,

          /** Prevent this from firing twice for some reason. What the hell, IE. */
          gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
          if(THIS[gibberishProperty]) return tokenList;
          THIS[gibberishProperty] = true;

          /**
           * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
           *
           * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
           * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
           * element instead, this would conflict with element types which use indexed properties (such as forms and
           * select lists).
           */
          if (false === dpSupport) {

            var visage;
            var mirror = addProp.mirror || document.createElement("div");
            var reflections = mirror.childNodes;
            var l = reflections.length;

            for (var i = 0; i < l; ++i)
              if (reflections[i]._R === THIS) {
                visage = reflections[i];
                break;
              }

            /** Couldn't find an element's reflection inside the mirror. Materialise one. */
            visage || (visage = mirror.appendChild(document.createElement("div")));

            tokenList = DOMTokenList.call(visage, THIS, attr);
          } else tokenList = new DOMTokenList(THIS, attr);

          defineGetter(THIS, name, function () {
            return tokenList;
          });
          delete THIS[gibberishProperty];

          return tokenList;
        }, true);
      };

      addProp(global.Element, "classList", "className");
      addProp(global.HTMLElement, "classList", "className");
      addProp(global.HTMLLinkElement, "relList", "rel");
      addProp(global.HTMLAnchorElement, "relList", "rel");
      addProp(global.HTMLAreaElement, "relList", "rel");
    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function Tabs ($module) {
  this.$module = $module;
  this.$tabs = $module.querySelectorAll('.govuk-tabs__tab');

  this.keys = { left: 37, right: 39, up: 38, down: 40 };
  this.jsHiddenClass = 'js-hidden';
}

Tabs.prototype.init = function () {
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setup();
  }
};

Tabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: 40.0625em)');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup();
  } else {
    this.teardown();
  }
};

Tabs.prototype.setup = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist');

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab);

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this);
    $tab.boundTabKeydown = this.onTabKeydown.bind(this);

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true);
    $tab.addEventListener('keydown', $tab.boundTabKeydown, true);

    // Remove old active panels
    this.hideTab($tab);
  }.bind(this));

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
  this.showTab($activeTab);

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this);
  window.addEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.teardown = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role');

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true);
    $tab.removeEventListener('keydown', $tab.boundTabKeydown, true);

    // Unset HTML attributes
    this.unsetAttributes($tab);
  }.bind(this));

  // Remove hashchange event handler
  window.removeEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.onHashChange = function (e) {
  var hash = window.location.hash;
  if (!this.hasTab(hash)) {
    return
  }
  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false;
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab();
  var $activeTab = this.getTab(hash) || this.$tabs[0];

  this.hideTab($previousTab);
  this.showTab($activeTab);
  $activeTab.focus();
};

Tabs.prototype.hasTab = function (hash) {
  return this.$module.querySelector(hash)
};

Tabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab);
  this.hidePanel($tab);
};

Tabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab);
  this.showPanel($tab);
};

Tabs.prototype.getTab = function (hash) {
  return this.$module.querySelector('a[role="tab"][href="' + hash + '"]')
};

Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1);
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', panelId);
  $tab.setAttribute('tabindex', '-1');

  // set panel attributes
  var $panel = this.getPanel($tab);
  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('tabindex');

  // unset panel attributes
  var $panel = this.getPanel($tab);
  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.onTabClick = function (e) {
  e.preventDefault();
  var $newTab = e.target;
  var $currentTab = this.getCurrentTab();
  this.hideTab($currentTab);
  this.showTab($newTab);
  this.createHistoryEntry($newTab);
};

Tabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab);

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var id = $panel.id;
  $panel.id = '';
  this.changingHash = true;
  window.location.hash = this.getHref($tab).slice(1);
  $panel.id = id;
};

Tabs.prototype.onTabKeydown = function (e) {
  switch (e.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab();
      e.preventDefault();
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab();
      e.preventDefault();
      break
  }
};

Tabs.prototype.activateNextTab = function () {
  var currentTab = this.getCurrentTab();
  var nextTabListItem = currentTab.parentNode.nextElementSibling;
  if (nextTabListItem) {
    var nextTab = nextTabListItem.firstElementChild;
  }
  if (nextTab) {
    this.hideTab(currentTab);
    this.showTab(nextTab);
    nextTab.focus();
    this.createHistoryEntry(nextTab);
  }
};

Tabs.prototype.activatePreviousTab = function () {
  var currentTab = this.getCurrentTab();
  var previousTabListItem = currentTab.parentNode.previousElementSibling;
  if (previousTabListItem) {
    var previousTab = previousTabListItem.firstElementChild;
  }
  if (previousTab) {
    this.hideTab(currentTab);
    this.showTab(previousTab);
    previousTab.focus();
    this.createHistoryEntry(previousTab);
  }
};

Tabs.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab));
  return $panel
};

Tabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab);
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.hidePanel = function (tab) {
  var $panel = this.getPanel(tab);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false');
  $tab.setAttribute('tabindex', '-1');
};

Tabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true');
  $tab.setAttribute('tabindex', '0');
};

Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('[role=tab][aria-selected=true]')
};

// this is because IE doesn't always return the actual value but a relative full path
// should be a utility function most prob
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
Tabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href');
  var hash = href.slice(href.indexOf('#'), href.length);
  return hash
};

function initAll () {
  // Find all buttons with [role=button] on the document to enhance.
  new Button(document).init();

  // Find all global details elements to enhance.
  var $details = document.querySelectorAll('details');
  nodeListForEach($details, function ($detail) {
    new Details($detail).init();
  });

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]');
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init();
  });

  // Find first error summary module to enhance.
  var $errorSummary = document.querySelector('[data-module="error-summary"]');
  new ErrorSummary($errorSummary).init();

  // Find first header module to enhance.
  var $toggleButton = document.querySelector('[data-module="header"]');
  new Header($toggleButton).init();

  var $radios = document.querySelectorAll('[data-module="radios"]');
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init();
  });

  var $tabs = document.querySelectorAll('[data-module="tabs"]');
  nodeListForEach($tabs, function ($tabs) {
    new Tabs($tabs).init();
  });
}

exports.initAll = initAll;
exports.Button = Button;
exports.Details = Details;
exports.Checkboxes = Checkboxes;
exports.ErrorSummary = ErrorSummary;
exports.Header = Header;
exports.Radios = Radios;
exports.Tabs = Tabs;

})));

/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */ ! function (a, b) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
        if (!a.document) throw new Error("jQuery requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function (a, b) {
    "use strict";
    var c = [],
        d = a.document,
        e = Object.getPrototypeOf,
        f = c.slice,
        g = c.concat,
        h = c.push,
        i = c.indexOf,
        j = {},
        k = j.toString,
        l = j.hasOwnProperty,
        m = l.toString,
        n = m.call(Object),
        o = {};

    function p(a, b) {
        b = b || d;
        var c = b.createElement("script");
        c.text = a, b.head.appendChild(c).parentNode.removeChild(c)
    }
    var q = "3.2.1",
        r = function (a, b) {
            return new r.fn.init(a, b)
        },
        s = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        t = /^-ms-/,
        u = /-([a-z])/g,
        v = function (a, b) {
            return b.toUpperCase()
        };
    r.fn = r.prototype = {
        jquery: q,
        constructor: r,
        length: 0,
        toArray: function () {
            return f.call(this)
        },
        get: function (a) {
            return null == a ? f.call(this) : a < 0 ? this[a + this.length] : this[a]
        },
        pushStack: function (a) {
            var b = r.merge(this.constructor(), a);
            return b.prevObject = this, b
        },
        each: function (a) {
            return r.each(this, a)
        },
        map: function (a) {
            return this.pushStack(r.map(this, function (b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function () {
            return this.pushStack(f.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (a) {
            var b = this.length,
                c = +a + (a < 0 ? b : 0);
            return this.pushStack(c >= 0 && c < b ? [this[c]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor()
        },
        push: h,
        sort: c.sort,
        splice: c.splice
    }, r.extend = r.fn.extend = function () {
        var a, b, c, d, e, f, g = arguments[0] || {},
            h = 1,
            i = arguments.length,
            j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || r.isFunction(g) || (g = {}), h === i && (g = this, h--); h < i; h++)
            if (null != (a = arguments[h]))
                for (b in a) c = g[b], d = a[b], g !== d && (j && d && (r.isPlainObject(d) || (e = Array.isArray(d))) ? (e ? (e = !1, f = c && Array.isArray(c) ? c : []) : f = c && r.isPlainObject(c) ? c : {}, g[b] = r.extend(j, f, d)) : void 0 !== d && (g[b] = d));
        return g
    }, r.extend({
        expando: "jQuery" + (q + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (a) {
            throw new Error(a)
        },
        noop: function () {},
        isFunction: function (a) {
            return "function" === r.type(a)
        },
        isWindow: function (a) {
            return null != a && a === a.window
        },
        isNumeric: function (a) {
            var b = r.type(a);
            return ("number" === b || "string" === b) && !isNaN(a - parseFloat(a))
        },
        isPlainObject: function (a) {
            var b, c;
            return !(!a || "[object Object]" !== k.call(a)) && (!(b = e(a)) || (c = l.call(b, "constructor") && b.constructor, "function" == typeof c && m.call(c) === n))
        },
        isEmptyObject: function (a) {
            var b;
            for (b in a) return !1;
            return !0
        },
        type: function (a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? j[k.call(a)] || "object" : typeof a
        },
        globalEval: function (a) {
            p(a)
        },
        camelCase: function (a) {
            return a.replace(t, "ms-").replace(u, v)
        },
        each: function (a, b) {
            var c, d = 0;
            if (w(a)) {
                for (c = a.length; d < c; d++)
                    if (b.call(a[d], d, a[d]) === !1) break
            } else
                for (d in a)
                    if (b.call(a[d], d, a[d]) === !1) break;
            return a
        },
        trim: function (a) {
            return null == a ? "" : (a + "").replace(s, "")
        },
        makeArray: function (a, b) {
            var c = b || [];
            return null != a && (w(Object(a)) ? r.merge(c, "string" == typeof a ? [a] : a) : h.call(c, a)), c
        },
        inArray: function (a, b, c) {
            return null == b ? -1 : i.call(b, a, c)
        },
        merge: function (a, b) {
            for (var c = +b.length, d = 0, e = a.length; d < c; d++) a[e++] = b[d];
            return a.length = e, a
        },
        grep: function (a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
            return e
        },
        map: function (a, b, c) {
            var d, e, f = 0,
                h = [];
            if (w(a))
                for (d = a.length; f < d; f++) e = b(a[f], f, c), null != e && h.push(e);
            else
                for (f in a) e = b(a[f], f, c), null != e && h.push(e);
            return g.apply([], h)
        },
        guid: 1,
        proxy: function (a, b) {
            var c, d, e;
            if ("string" == typeof b && (c = a[b], b = a, a = c), r.isFunction(a)) return d = f.call(arguments, 2), e = function () {
                return a.apply(b || this, d.concat(f.call(arguments)))
            }, e.guid = a.guid = a.guid || r.guid++, e
        },
        now: Date.now,
        support: o
    }), "function" == typeof Symbol && (r.fn[Symbol.iterator] = c[Symbol.iterator]), r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (a, b) {
        j["[object " + b + "]"] = b.toLowerCase()
    });

    function w(a) {
        var b = !!a && "length" in a && a.length,
            c = r.type(a);
        return "function" !== c && !r.isWindow(a) && ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a)
    }
    var x = function (a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date,
            v = a.document,
            w = 0,
            x = 0,
            y = ha(),
            z = ha(),
            A = ha(),
            B = function (a, b) {
                return a === b && (l = !0), 0
            },
            C = {}.hasOwnProperty,
            D = [],
            E = D.pop,
            F = D.push,
            G = D.push,
            H = D.slice,
            I = function (a, b) {
                for (var c = 0, d = a.length; c < d; c++)
                    if (a[c] === b) return c;
                return -1
            },
            J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            K = "[\\x20\\t\\r\\n\\f]",
            L = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            M = "\\[" + K + "*(" + L + ")(?:" + K + "*([*^$|!~]?=)" + K + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + L + "))|)" + K + "*\\]",
            N = ":(" + L + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + M + ")*)|.*)\\)|)",
            O = new RegExp(K + "+", "g"),
            P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
            Q = new RegExp("^" + K + "*," + K + "*"),
            R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
            S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
            T = new RegExp(N),
            U = new RegExp("^" + L + "$"),
            V = {
                ID: new RegExp("^#(" + L + ")"),
                CLASS: new RegExp("^\\.(" + L + ")"),
                TAG: new RegExp("^(" + L + "|[*])"),
                ATTR: new RegExp("^" + M),
                PSEUDO: new RegExp("^" + N),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + J + ")$", "i"),
                needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
            },
            W = /^(?:input|select|textarea|button)$/i,
            X = /^h\d$/i,
            Y = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            $ = /[+~]/,
            _ = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
            aa = function (a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            },
            ba = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            ca = function (a, b) {
                return b ? "\0" === a ? "\ufffd" : a.slice(0, -1) + "\\" + a.charCodeAt(a.length - 1).toString(16) + " " : "\\" + a
            },
            da = function () {
                m()
            },
            ea = ta(function (a) {
                return a.disabled === !0 && ("form" in a || "label" in a)
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            G.apply(D = H.call(v.childNodes), v.childNodes), D[v.childNodes.length].nodeType
        } catch (fa) {
            G = {
                apply: D.length ? function (a, b) {
                    F.apply(a, H.call(b))
                } : function (a, b) {
                    var c = a.length,
                        d = 0;
                    while (a[c++] = b[d++]);
                    a.length = c - 1
                }
            }
        }

        function ga(a, b, d, e) {
            var f, h, j, k, l, o, r, s = b && b.ownerDocument,
                w = b ? b.nodeType : 9;
            if (d = d || [], "string" != typeof a || !a || 1 !== w && 9 !== w && 11 !== w) return d;
            if (!e && ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, p)) {
                if (11 !== w && (l = Z.exec(a)))
                    if (f = l[1]) {
                        if (9 === w) {
                            if (!(j = b.getElementById(f))) return d;
                            if (j.id === f) return d.push(j), d
                        } else if (s && (j = s.getElementById(f)) && t(b, j) && j.id === f) return d.push(j), d
                    } else {
                        if (l[2]) return G.apply(d, b.getElementsByTagName(a)), d;
                        if ((f = l[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(f)), d
                    }
                if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
                    if (1 !== w) s = b, r = a;
                    else if ("object" !== b.nodeName.toLowerCase()) {
                        (k = b.getAttribute("id")) ? k = k.replace(ba, ca): b.setAttribute("id", k = u), o = g(a), h = o.length;
                        while (h--) o[h] = "#" + k + " " + sa(o[h]);
                        r = o.join(","), s = $.test(a) && qa(b.parentNode) || b
                    }
                    if (r) try {
                        return G.apply(d, s.querySelectorAll(r)), d
                    } catch (x) {} finally {
                        k === u && b.removeAttribute("id")
                    }
                }
            }
            return i(a.replace(P, "$1"), b, d, e)
        }

        function ha() {
            var a = [];

            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
            }
            return b
        }

        function ia(a) {
            return a[u] = !0, a
        }

        function ja(a) {
            var b = n.createElement("fieldset");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }

        function ka(a, b) {
            var c = a.split("|"),
                e = c.length;
            while (e--) d.attrHandle[c[e]] = b
        }

        function la(a, b) {
            var c = b && a,
                d = c && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
            if (d) return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b) return -1;
            return a ? 1 : -1
        }

        function ma(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }

        function na(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function oa(a) {
            return function (b) {
                return "form" in b ? b.parentNode && b.disabled === !1 ? "label" in b ? "label" in b.parentNode ? b.parentNode.disabled === a : b.disabled === a : b.isDisabled === a || b.isDisabled !== !a && ea(b) === a : b.disabled === a : "label" in b && b.disabled === a
            }
        }

        function pa(a) {
            return ia(function (b) {
                return b = +b, ia(function (c, d) {
                    var e, f = a([], c.length, b),
                        g = f.length;
                    while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function qa(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        c = ga.support = {}, f = ga.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }, m = ga.setDocument = function (a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = n.documentElement, p = !f(n), v !== n && (e = n.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", da, !1) : e.attachEvent && e.attachEvent("onunload", da)), c.attributes = ja(function (a) {
                return a.className = "i", !a.getAttribute("className")
            }), c.getElementsByTagName = ja(function (a) {
                return a.appendChild(n.createComment("")), !a.getElementsByTagName("*").length
            }), c.getElementsByClassName = Y.test(n.getElementsByClassName), c.getById = ja(function (a) {
                return o.appendChild(a).id = u, !n.getElementsByName || !n.getElementsByName(u).length
            }), c.getById ? (d.filter.ID = function (a) {
                var b = a.replace(_, aa);
                return function (a) {
                    return a.getAttribute("id") === b
                }
            }, d.find.ID = function (a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c ? [c] : []
                }
            }) : (d.filter.ID = function (a) {
                var b = a.replace(_, aa);
                return function (a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }, d.find.ID = function (a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c, d, e, f = b.getElementById(a);
                    if (f) {
                        if (c = f.getAttributeNode("id"), c && c.value === a) return [f];
                        e = b.getElementsByName(a), d = 0;
                        while (f = e[d++])
                            if (c = f.getAttributeNode("id"), c && c.value === a) return [f]
                    }
                    return []
                }
            }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            } : function (a, b) {
                var c, d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++]) 1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
                if ("undefined" != typeof b.getElementsByClassName && p) return b.getElementsByClassName(a)
            }, r = [], q = [], (c.qsa = Y.test(n.querySelectorAll)) && (ja(function (a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\r\\' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + K + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + K + "*(?:value|" + J + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }), ja(function (a) {
                a.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var b = n.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + K + "*[*^$|!~]?="), 2 !== a.querySelectorAll(":enabled").length && q.push(":enabled", ":disabled"), o.appendChild(a).disabled = !0, 2 !== a.querySelectorAll(":disabled").length && q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
            })), (c.matchesSelector = Y.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ja(function (a) {
                c.disconnectedMatch = s.call(a, "*"), s.call(a, "[s!='']:x"), r.push("!=", N)
            }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = Y.test(o.compareDocumentPosition), t = b || Y.test(o.contains) ? function (a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a,
                    d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function (a, b) {
                if (b)
                    while (b = b.parentNode)
                        if (b === a) return !0;
                return !1
            }, B = b ? function (a, b) {
                if (a === b) return l = !0, 0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === n || a.ownerDocument === v && t(v, a) ? -1 : b === n || b.ownerDocument === v && t(v, b) ? 1 : k ? I(k, a) - I(k, b) : 0 : 4 & d ? -1 : 1)
            } : function (a, b) {
                if (a === b) return l = !0, 0;
                var c, d = 0,
                    e = a.parentNode,
                    f = b.parentNode,
                    g = [a],
                    h = [b];
                if (!e || !f) return a === n ? -1 : b === n ? 1 : e ? -1 : f ? 1 : k ? I(k, a) - I(k, b) : 0;
                if (e === f) return la(a, b);
                c = a;
                while (c = c.parentNode) g.unshift(c);
                c = b;
                while (c = c.parentNode) h.unshift(c);
                while (g[d] === h[d]) d++;
                return d ? la(g[d], h[d]) : g[d] === v ? -1 : h[d] === v ? 1 : 0
            }, n) : n
        }, ga.matches = function (a, b) {
            return ga(a, null, null, b)
        }, ga.matchesSelector = function (a, b) {
            if ((a.ownerDocument || a) !== n && m(a), b = b.replace(S, "='$1']"), c.matchesSelector && p && !A[b + " "] && (!r || !r.test(b)) && (!q || !q.test(b))) try {
                var d = s.call(a, b);
                if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
            } catch (e) {}
            return ga(b, n, null, [a]).length > 0
        }, ga.contains = function (a, b) {
            return (a.ownerDocument || a) !== n && m(a), t(a, b)
        }, ga.attr = function (a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()],
                f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }, ga.escape = function (a) {
            return (a + "").replace(ba, ca)
        }, ga.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, ga.uniqueSort = function (a) {
            var b, d = [],
                e = 0,
                f = 0;
            if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                while (b = a[f++]) b === a[f] && (e = d.push(f));
                while (e--) a.splice(d[e], 1)
            }
            return k = null, a
        }, e = ga.getText = function (a) {
            var b, c = "",
                d = 0,
                f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent) return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
                } else if (3 === f || 4 === f) return a.nodeValue
            } else
                while (b = a[d++]) c += e(b);
            return c
        }, d = ga.selectors = {
            cacheLength: 50,
            createPseudo: ia,
            match: V,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function (a) {
                    return a[1] = a[1].replace(_, aa), a[3] = (a[3] || a[4] || a[5] || "").replace(_, aa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },
                CHILD: function (a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || ga.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && ga.error(a[0]), a
                },
                PSEUDO: function (a) {
                    var b, c = !a[6] && a[2];
                    return V.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && T.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function (a) {
                    var b = a.replace(_, aa).toLowerCase();
                    return "*" === a ? function () {
                        return !0
                    } : function (a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function (a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && y(a, function (a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function (a, b, c) {
                    return function (d) {
                        var e = ga.attr(d, a);
                        return null == e ? "!=" === b : !b || (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(O, " ") + " ").indexOf(c) > -1 : "|=" === b && (e === c || e.slice(0, c.length + 1) === c + "-"))
                    }
                },
                CHILD: function (a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3),
                        g = "last" !== a.slice(-4),
                        h = "of-type" === b;
                    return 1 === d && 0 === e ? function (a) {
                        return !!a.parentNode
                    } : function (b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                            q = b.parentNode,
                            r = h && b.nodeName.toLowerCase(),
                            s = !i && !h,
                            t = !1;
                        if (q) {
                            if (f) {
                                while (p) {
                                    m = b;
                                    while (m = m[p])
                                        if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                m = q, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n && j[2], m = n && q.childNodes[n];
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if (1 === m.nodeType && ++t && m === b) {
                                        k[a] = [w, n, t];
                                        break
                                    }
                            } else if (s && (m = b, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n), t === !1)
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if ((h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) && ++t && (s && (l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), k[a] = [w, t]), m === b)) break;
                            return t -= e, t === d || t % d === 0 && t / d >= 0
                        }
                    }
                },
                PSEUDO: function (a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || ga.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ia(function (a, c) {
                        var d, f = e(a, b),
                            g = f.length;
                        while (g--) d = I(a, f[g]), a[d] = !(c[d] = f[g])
                    }) : function (a) {
                        return e(a, 0, c)
                    }) : e
                }
            },
            pseudos: {
                not: ia(function (a) {
                    var b = [],
                        c = [],
                        d = h(a.replace(P, "$1"));
                    return d[u] ? ia(function (a, b, c, e) {
                        var f, g = d(a, null, e, []),
                            h = a.length;
                        while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function (a, e, f) {
                        return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop()
                    }
                }),
                has: ia(function (a) {
                    return function (b) {
                        return ga(a, b).length > 0
                    }
                }),
                contains: ia(function (a) {
                    return a = a.replace(_, aa),
                        function (b) {
                            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                        }
                }),
                lang: ia(function (a) {
                    return U.test(a || "") || ga.error("unsupported lang: " + a), a = a.replace(_, aa).toLowerCase(),
                        function (b) {
                            var c;
                            do
                                if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                            return !1
                        }
                }),
                target: function (b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function (a) {
                    return a === o
                },
                focus: function (a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: oa(!1),
                disabled: oa(!0),
                checked: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function (a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },
                empty: function (a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6) return !1;
                    return !0
                },
                parent: function (a) {
                    return !d.pseudos.empty(a)
                },
                header: function (a) {
                    return X.test(a.nodeName)
                },
                input: function (a) {
                    return W.test(a.nodeName)
                },
                button: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function (a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: pa(function () {
                    return [0]
                }),
                last: pa(function (a, b) {
                    return [b - 1]
                }),
                eq: pa(function (a, b, c) {
                    return [c < 0 ? c + b : c]
                }),
                even: pa(function (a, b) {
                    for (var c = 0; c < b; c += 2) a.push(c);
                    return a
                }),
                odd: pa(function (a, b) {
                    for (var c = 1; c < b; c += 2) a.push(c);
                    return a
                }),
                lt: pa(function (a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0;) a.push(d);
                    return a
                }),
                gt: pa(function (a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b;) a.push(d);
                    return a
                })
            }
        }, d.pseudos.nth = d.pseudos.eq;
        for (b in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) d.pseudos[b] = ma(b);
        for (b in {
                submit: !0,
                reset: !0
            }) d.pseudos[b] = na(b);

        function ra() {}
        ra.prototype = d.filters = d.pseudos, d.setFilters = new ra, g = ga.tokenize = function (a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k) return b ? 0 : k.slice(0);
            h = a, i = [], j = d.preFilter;
            while (h) {
                c && !(e = Q.exec(h)) || (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({
                    value: c,
                    type: e[0].replace(P, " ")
                }), h = h.slice(c.length));
                for (g in d.filter) !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                    value: c,
                    type: g,
                    matches: e
                }), h = h.slice(c.length));
                if (!c) break
            }
            return b ? h.length : h ? ga.error(a) : z(a, i).slice(0)
        };

        function sa(a) {
            for (var b = 0, c = a.length, d = ""; b < c; b++) d += a[b].value;
            return d
        }

        function ta(a, b, c) {
            var d = b.dir,
                e = b.next,
                f = e || d,
                g = c && "parentNode" === f,
                h = x++;
            return b.first ? function (b, c, e) {
                while (b = b[d])
                    if (1 === b.nodeType || g) return a(b, c, e);
                return !1
            } : function (b, c, i) {
                var j, k, l, m = [w, h];
                if (i) {
                    while (b = b[d])
                        if ((1 === b.nodeType || g) && a(b, c, i)) return !0
                } else
                    while (b = b[d])
                        if (1 === b.nodeType || g)
                            if (l = b[u] || (b[u] = {}), k = l[b.uniqueID] || (l[b.uniqueID] = {}), e && e === b.nodeName.toLowerCase()) b = b[d] || b;
                            else {
                                if ((j = k[f]) && j[0] === w && j[1] === h) return m[2] = j[2];
                                if (k[f] = m, m[2] = a(b, c, i)) return !0
                            } return !1
            }
        }

        function ua(a) {
            return a.length > 1 ? function (b, c, d) {
                var e = a.length;
                while (e--)
                    if (!a[e](b, c, d)) return !1;
                return !0
            } : a[0]
        }

        function va(a, b, c) {
            for (var d = 0, e = b.length; d < e; d++) ga(a, b[d], c);
            return c
        }

        function wa(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)(f = a[h]) && (c && !c(f, d, e) || (g.push(f), j && b.push(h)));
            return g
        }

        function xa(a, b, c, d, e, f) {
            return d && !d[u] && (d = xa(d)), e && !e[u] && (e = xa(e, f)), ia(function (f, g, h, i) {
                var j, k, l, m = [],
                    n = [],
                    o = g.length,
                    p = f || va(b || "*", h.nodeType ? [h] : h, []),
                    q = !a || !f && b ? p : wa(p, m, a, h, i),
                    r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) {
                    j = wa(r, n), d(j, [], h, i), k = j.length;
                    while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [], k = r.length;
                            while (k--)(l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--)(l = r[k]) && (j = e ? I(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                    }
                } else r = wa(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r)
            })
        }

        function ya(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = ta(function (a) {
                    return a === b
                }, h, !0), l = ta(function (a) {
                    return I(b, a) > -1
                }, h, !0), m = [function (a, c, d) {
                    var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                    return b = null, e
                }]; i < f; i++)
                if (c = d.relative[a[i].type]) m = [ta(ua(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                        for (e = ++i; e < f; e++)
                            if (d.relative[a[e].type]) break;
                        return xa(i > 1 && ua(m), i > 1 && sa(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(P, "$1"), c, i < e && ya(a.slice(i, e)), e < f && ya(a = a.slice(e)), e < f && sa(a))
                    }
                    m.push(c)
                }
            return ua(m)
        }

        function za(a, b) {
            var c = b.length > 0,
                e = a.length > 0,
                f = function (f, g, h, i, k) {
                    var l, o, q, r = 0,
                        s = "0",
                        t = f && [],
                        u = [],
                        v = j,
                        x = f || e && d.find.TAG("*", k),
                        y = w += null == v ? 1 : Math.random() || .1,
                        z = x.length;
                    for (k && (j = g === n || g || k); s !== z && null != (l = x[s]); s++) {
                        if (e && l) {
                            o = 0, g || l.ownerDocument === n || (m(l), h = !p);
                            while (q = a[o++])
                                if (q(l, g || n, h)) {
                                    i.push(l);
                                    break
                                }
                            k && (w = y)
                        }
                        c && ((l = !q && l) && r--, f && t.push(l))
                    }
                    if (r += s, c && s !== r) {
                        o = 0;
                        while (q = b[o++]) q(t, u, g, h);
                        if (f) {
                            if (r > 0)
                                while (s--) t[s] || u[s] || (u[s] = E.call(i));
                            u = wa(u)
                        }
                        G.apply(i, u), k && !f && u.length > 0 && r + b.length > 1 && ga.uniqueSort(i)
                    }
                    return k && (w = y, j = v), t
                };
            return c ? ia(f) : f
        }
        return h = ga.compile = function (a, b) {
            var c, d = [],
                e = [],
                f = A[a + " "];
            if (!f) {
                b || (b = g(a)), c = b.length;
                while (c--) f = ya(b[c]), f[u] ? d.push(f) : e.push(f);
                f = A(a, za(e, d)), f.selector = a
            }
            return f
        }, i = ga.select = function (a, b, c, e) {
            var f, i, j, k, l, m = "function" == typeof a && a,
                n = !e && g(a = m.selector || a);
            if (c = c || [], 1 === n.length) {
                if (i = n[0] = n[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && 9 === b.nodeType && p && d.relative[i[1].type]) {
                    if (b = (d.find.ID(j.matches[0].replace(_, aa), b) || [])[0], !b) return c;
                    m && (b = b.parentNode), a = a.slice(i.shift().value.length)
                }
                f = V.needsContext.test(a) ? 0 : i.length;
                while (f--) {
                    if (j = i[f], d.relative[k = j.type]) break;
                    if ((l = d.find[k]) && (e = l(j.matches[0].replace(_, aa), $.test(i[0].type) && qa(b.parentNode) || b))) {
                        if (i.splice(f, 1), a = e.length && sa(i), !a) return G.apply(c, e), c;
                        break
                    }
                }
            }
            return (m || h(a, n))(e, b, !p, c, !b || $.test(a) && qa(b.parentNode) || b), c
        }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ja(function (a) {
            return 1 & a.compareDocumentPosition(n.createElement("fieldset"))
        }), ja(function (a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || ka("type|href|height|width", function (a, b, c) {
            if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), c.attributes && ja(function (a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || ka("value", function (a, b, c) {
            if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue
        }), ja(function (a) {
            return null == a.getAttribute("disabled")
        }) || ka(J, function (a, b, c) {
            var d;
            if (!c) return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), ga
    }(a);
    r.find = x, r.expr = x.selectors, r.expr[":"] = r.expr.pseudos, r.uniqueSort = r.unique = x.uniqueSort, r.text = x.getText, r.isXMLDoc = x.isXML, r.contains = x.contains, r.escapeSelector = x.escape;
    var y = function (a, b, c) {
            var d = [],
                e = void 0 !== c;
            while ((a = a[b]) && 9 !== a.nodeType)
                if (1 === a.nodeType) {
                    if (e && r(a).is(c)) break;
                    d.push(a)
                }
            return d
        },
        z = function (a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c
        },
        A = r.expr.match.needsContext;

    function B(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    }
    var C = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
        D = /^.[^:#\[\.,]*$/;

    function E(a, b, c) {
        return r.isFunction(b) ? r.grep(a, function (a, d) {
            return !!b.call(a, d, a) !== c
        }) : b.nodeType ? r.grep(a, function (a) {
            return a === b !== c
        }) : "string" != typeof b ? r.grep(a, function (a) {
            return i.call(b, a) > -1 !== c
        }) : D.test(b) ? r.filter(b, a, c) : (b = r.filter(b, a), r.grep(a, function (a) {
            return i.call(b, a) > -1 !== c && 1 === a.nodeType
        }))
    }
    r.filter = function (a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? r.find.matchesSelector(d, a) ? [d] : [] : r.find.matches(a, r.grep(b, function (a) {
            return 1 === a.nodeType
        }))
    }, r.fn.extend({
        find: function (a) {
            var b, c, d = this.length,
                e = this;
            if ("string" != typeof a) return this.pushStack(r(a).filter(function () {
                for (b = 0; b < d; b++)
                    if (r.contains(e[b], this)) return !0
            }));
            for (c = this.pushStack([]), b = 0; b < d; b++) r.find(a, e[b], c);
            return d > 1 ? r.uniqueSort(c) : c
        },
        filter: function (a) {
            return this.pushStack(E(this, a || [], !1))
        },
        not: function (a) {
            return this.pushStack(E(this, a || [], !0))
        },
        is: function (a) {
            return !!E(this, "string" == typeof a && A.test(a) ? r(a) : a || [], !1).length
        }
    });
    var F, G = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
        H = r.fn.init = function (a, b, c) {
            var e, f;
            if (!a) return this;
            if (c = c || F, "string" == typeof a) {
                if (e = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : G.exec(a), !e || !e[1] && b) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
                if (e[1]) {
                    if (b = b instanceof r ? b[0] : b, r.merge(this, r.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)), C.test(e[1]) && r.isPlainObject(b))
                        for (e in b) r.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
                    return this
                }
                return f = d.getElementById(e[2]), f && (this[0] = f, this.length = 1), this
            }
            return a.nodeType ? (this[0] = a, this.length = 1, this) : r.isFunction(a) ? void 0 !== c.ready ? c.ready(a) : a(r) : r.makeArray(a, this)
        };
    H.prototype = r.fn, F = r(d);
    var I = /^(?:parents|prev(?:Until|All))/,
        J = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    r.fn.extend({
        has: function (a) {
            var b = r(a, this),
                c = b.length;
            return this.filter(function () {
                for (var a = 0; a < c; a++)
                    if (r.contains(this, b[a])) return !0
            })
        },
        closest: function (a, b) {
            var c, d = 0,
                e = this.length,
                f = [],
                g = "string" != typeof a && r(a);
            if (!A.test(a))
                for (; d < e; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && r.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
            return this.pushStack(f.length > 1 ? r.uniqueSort(f) : f)
        },
        index: function (a) {
            return a ? "string" == typeof a ? i.call(r(a), this[0]) : i.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (a, b) {
            return this.pushStack(r.uniqueSort(r.merge(this.get(), r(a, b))))
        },
        addBack: function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });

    function K(a, b) {
        while ((a = a[b]) && 1 !== a.nodeType);
        return a
    }
    r.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function (a) {
            return y(a, "parentNode")
        },
        parentsUntil: function (a, b, c) {
            return y(a, "parentNode", c)
        },
        next: function (a) {
            return K(a, "nextSibling")
        },
        prev: function (a) {
            return K(a, "previousSibling")
        },
        nextAll: function (a) {
            return y(a, "nextSibling")
        },
        prevAll: function (a) {
            return y(a, "previousSibling")
        },
        nextUntil: function (a, b, c) {
            return y(a, "nextSibling", c)
        },
        prevUntil: function (a, b, c) {
            return y(a, "previousSibling", c)
        },
        siblings: function (a) {
            return z((a.parentNode || {}).firstChild, a)
        },
        children: function (a) {
            return z(a.firstChild)
        },
        contents: function (a) {
            return B(a, "iframe") ? a.contentDocument : (B(a, "template") && (a = a.content || a), r.merge([], a.childNodes))
        }
    }, function (a, b) {
        r.fn[a] = function (c, d) {
            var e = r.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = r.filter(d, e)), this.length > 1 && (J[a] || r.uniqueSort(e), I.test(a) && e.reverse()), this.pushStack(e)
        }
    });
    var L = /[^\x20\t\r\n\f]+/g;

    function M(a) {
        var b = {};
        return r.each(a.match(L) || [], function (a, c) {
            b[c] = !0
        }), b
    }
    r.Callbacks = function (a) {
        a = "string" == typeof a ? M(a) : r.extend({}, a);
        var b, c, d, e, f = [],
            g = [],
            h = -1,
            i = function () {
                for (e = e || a.once, d = b = !0; g.length; h = -1) {
                    c = g.shift();
                    while (++h < f.length) f[h].apply(c[0], c[1]) === !1 && a.stopOnFalse && (h = f.length, c = !1)
                }
                a.memory || (c = !1), b = !1, e && (f = c ? [] : "")
            },
            j = {
                add: function () {
                    return f && (c && !b && (h = f.length - 1, g.push(c)), function d(b) {
                        r.each(b, function (b, c) {
                            r.isFunction(c) ? a.unique && j.has(c) || f.push(c) : c && c.length && "string" !== r.type(c) && d(c)
                        })
                    }(arguments), c && !b && i()), this
                },
                remove: function () {
                    return r.each(arguments, function (a, b) {
                        var c;
                        while ((c = r.inArray(b, f, c)) > -1) f.splice(c, 1), c <= h && h--
                    }), this
                },
                has: function (a) {
                    return a ? r.inArray(a, f) > -1 : f.length > 0
                },
                empty: function () {
                    return f && (f = []), this
                },
                disable: function () {
                    return e = g = [], f = c = "", this
                },
                disabled: function () {
                    return !f
                },
                lock: function () {
                    return e = g = [], c || b || (f = c = ""), this
                },
                locked: function () {
                    return !!e
                },
                fireWith: function (a, c) {
                    return e || (c = c || [], c = [a, c.slice ? c.slice() : c], g.push(c), b || i()), this
                },
                fire: function () {
                    return j.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!d
                }
            };
        return j
    };

    function N(a) {
        return a
    }

    function O(a) {
        throw a
    }

    function P(a, b, c, d) {
        var e;
        try {
            a && r.isFunction(e = a.promise) ? e.call(a).done(b).fail(c) : a && r.isFunction(e = a.then) ? e.call(a, b, c) : b.apply(void 0, [a].slice(d))
        } catch (a) {
            c.apply(void 0, [a])
        }
    }
    r.extend({
        Deferred: function (b) {
            var c = [
                    ["notify", "progress", r.Callbacks("memory"), r.Callbacks("memory"), 2],
                    ["resolve", "done", r.Callbacks("once memory"), r.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", r.Callbacks("once memory"), r.Callbacks("once memory"), 1, "rejected"]
                ],
                d = "pending",
                e = {
                    state: function () {
                        return d
                    },
                    always: function () {
                        return f.done(arguments).fail(arguments), this
                    },
                    "catch": function (a) {
                        return e.then(null, a)
                    },
                    pipe: function () {
                        var a = arguments;
                        return r.Deferred(function (b) {
                            r.each(c, function (c, d) {
                                var e = r.isFunction(a[d[4]]) && a[d[4]];
                                f[d[1]](function () {
                                    var a = e && e.apply(this, arguments);
                                    a && r.isFunction(a.promise) ? a.promise().progress(b.notify).done(b.resolve).fail(b.reject) : b[d[0] + "With"](this, e ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    },
                    then: function (b, d, e) {
                        var f = 0;

                        function g(b, c, d, e) {
                            return function () {
                                var h = this,
                                    i = arguments,
                                    j = function () {
                                        var a, j;
                                        if (!(b < f)) {
                                            if (a = d.apply(h, i), a === c.promise()) throw new TypeError("Thenable self-resolution");
                                            j = a && ("object" == typeof a || "function" == typeof a) && a.then, r.isFunction(j) ? e ? j.call(a, g(f, c, N, e), g(f, c, O, e)) : (f++, j.call(a, g(f, c, N, e), g(f, c, O, e), g(f, c, N, c.notifyWith))) : (d !== N && (h = void 0, i = [a]), (e || c.resolveWith)(h, i))
                                        }
                                    },
                                    k = e ? j : function () {
                                        try {
                                            j()
                                        } catch (a) {
                                            r.Deferred.exceptionHook && r.Deferred.exceptionHook(a, k.stackTrace), b + 1 >= f && (d !== O && (h = void 0, i = [a]), c.rejectWith(h, i))
                                        }
                                    };
                                b ? k() : (r.Deferred.getStackHook && (k.stackTrace = r.Deferred.getStackHook()), a.setTimeout(k))
                            }
                        }
                        return r.Deferred(function (a) {
                            c[0][3].add(g(0, a, r.isFunction(e) ? e : N, a.notifyWith)), c[1][3].add(g(0, a, r.isFunction(b) ? b : N)), c[2][3].add(g(0, a, r.isFunction(d) ? d : O))
                        }).promise()
                    },
                    promise: function (a) {
                        return null != a ? r.extend(a, e) : e
                    }
                },
                f = {};
            return r.each(c, function (a, b) {
                var g = b[2],
                    h = b[5];
                e[b[1]] = g.add, h && g.add(function () {
                    d = h
                }, c[3 - a][2].disable, c[0][2].lock), g.add(b[3].fire), f[b[0]] = function () {
                    return f[b[0] + "With"](this === f ? void 0 : this, arguments), this
                }, f[b[0] + "With"] = g.fireWith
            }), e.promise(f), b && b.call(f, f), f
        },
        when: function (a) {
            var b = arguments.length,
                c = b,
                d = Array(c),
                e = f.call(arguments),
                g = r.Deferred(),
                h = function (a) {
                    return function (c) {
                        d[a] = this, e[a] = arguments.length > 1 ? f.call(arguments) : c, --b || g.resolveWith(d, e)
                    }
                };
            if (b <= 1 && (P(a, g.done(h(c)).resolve, g.reject, !b), "pending" === g.state() || r.isFunction(e[c] && e[c].then))) return g.then();
            while (c--) P(e[c], h(c), g.reject);
            return g.promise()
        }
    });
    var Q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    r.Deferred.exceptionHook = function (b, c) {
        a.console && a.console.warn && b && Q.test(b.name) && a.console.warn("jQuery.Deferred exception: " + b.message, b.stack, c)
    }, r.readyException = function (b) {
        a.setTimeout(function () {
            throw b
        })
    };
    var R = r.Deferred();
    r.fn.ready = function (a) {
        return R.then(a)["catch"](function (a) {
            r.readyException(a)
        }), this
    }, r.extend({
        isReady: !1,
        readyWait: 1,
        ready: function (a) {
            (a === !0 ? --r.readyWait : r.isReady) || (r.isReady = !0, a !== !0 && --r.readyWait > 0 || R.resolveWith(d, [r]))
        }
    }), r.ready.then = R.then;

    function S() {
        d.removeEventListener("DOMContentLoaded", S),
            a.removeEventListener("load", S), r.ready()
    }
    "complete" === d.readyState || "loading" !== d.readyState && !d.documentElement.doScroll ? a.setTimeout(r.ready) : (d.addEventListener("DOMContentLoaded", S), a.addEventListener("load", S));
    var T = function (a, b, c, d, e, f, g) {
            var h = 0,
                i = a.length,
                j = null == c;
            if ("object" === r.type(c)) {
                e = !0;
                for (h in c) T(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, r.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
                    return j.call(r(a), c)
                })), b))
                for (; h < i; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        },
        U = function (a) {
            return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
        };

    function V() {
        this.expando = r.expando + V.uid++
    }
    V.uid = 1, V.prototype = {
        cache: function (a) {
            var b = a[this.expando];
            return b || (b = {}, U(a) && (a.nodeType ? a[this.expando] = b : Object.defineProperty(a, this.expando, {
                value: b,
                configurable: !0
            }))), b
        },
        set: function (a, b, c) {
            var d, e = this.cache(a);
            if ("string" == typeof b) e[r.camelCase(b)] = c;
            else
                for (d in b) e[r.camelCase(d)] = b[d];
            return e
        },
        get: function (a, b) {
            return void 0 === b ? this.cache(a) : a[this.expando] && a[this.expando][r.camelCase(b)]
        },
        access: function (a, b, c) {
            return void 0 === b || b && "string" == typeof b && void 0 === c ? this.get(a, b) : (this.set(a, b, c), void 0 !== c ? c : b)
        },
        remove: function (a, b) {
            var c, d = a[this.expando];
            if (void 0 !== d) {
                if (void 0 !== b) {
                    Array.isArray(b) ? b = b.map(r.camelCase) : (b = r.camelCase(b), b = b in d ? [b] : b.match(L) || []), c = b.length;
                    while (c--) delete d[b[c]]
                }(void 0 === b || r.isEmptyObject(d)) && (a.nodeType ? a[this.expando] = void 0 : delete a[this.expando])
            }
        },
        hasData: function (a) {
            var b = a[this.expando];
            return void 0 !== b && !r.isEmptyObject(b)
        }
    };
    var W = new V,
        X = new V,
        Y = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Z = /[A-Z]/g;

    function $(a) {
        return "true" === a || "false" !== a && ("null" === a ? null : a === +a + "" ? +a : Y.test(a) ? JSON.parse(a) : a)
    }

    function _(a, b, c) {
        var d;
        if (void 0 === c && 1 === a.nodeType)
            if (d = "data-" + b.replace(Z, "-$&").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = $(c)
                } catch (e) {}
                X.set(a, b, c)
            } else c = void 0;
        return c
    }
    r.extend({
        hasData: function (a) {
            return X.hasData(a) || W.hasData(a)
        },
        data: function (a, b, c) {
            return X.access(a, b, c)
        },
        removeData: function (a, b) {
            X.remove(a, b)
        },
        _data: function (a, b, c) {
            return W.access(a, b, c)
        },
        _removeData: function (a, b) {
            W.remove(a, b)
        }
    }), r.fn.extend({
        data: function (a, b) {
            var c, d, e, f = this[0],
                g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = X.get(f), 1 === f.nodeType && !W.get(f, "hasDataAttrs"))) {
                    c = g.length;
                    while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = r.camelCase(d.slice(5)), _(f, d, e[d])));
                    W.set(f, "hasDataAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function () {
                X.set(this, a)
            }) : T(this, function (b) {
                var c;
                if (f && void 0 === b) {
                    if (c = X.get(f, a), void 0 !== c) return c;
                    if (c = _(f, a), void 0 !== c) return c
                } else this.each(function () {
                    X.set(this, a, b)
                })
            }, null, b, arguments.length > 1, null, !0)
        },
        removeData: function (a) {
            return this.each(function () {
                X.remove(this, a)
            })
        }
    }), r.extend({
        queue: function (a, b, c) {
            var d;
            if (a) return b = (b || "fx") + "queue", d = W.get(a, b), c && (!d || Array.isArray(c) ? d = W.access(a, b, r.makeArray(c)) : d.push(c)), d || []
        },
        dequeue: function (a, b) {
            b = b || "fx";
            var c = r.queue(a, b),
                d = c.length,
                e = c.shift(),
                f = r._queueHooks(a, b),
                g = function () {
                    r.dequeue(a, b)
                };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },
        _queueHooks: function (a, b) {
            var c = b + "queueHooks";
            return W.get(a, c) || W.access(a, c, {
                empty: r.Callbacks("once memory").add(function () {
                    W.remove(a, [b + "queue", c])
                })
            })
        }
    }), r.fn.extend({
        queue: function (a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? r.queue(this[0], a) : void 0 === b ? this : this.each(function () {
                var c = r.queue(this, a, b);
                r._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && r.dequeue(this, a)
            })
        },
        dequeue: function (a) {
            return this.each(function () {
                r.dequeue(this, a)
            })
        },
        clearQueue: function (a) {
            return this.queue(a || "fx", [])
        },
        promise: function (a, b) {
            var c, d = 1,
                e = r.Deferred(),
                f = this,
                g = this.length,
                h = function () {
                    --d || e.resolveWith(f, [f])
                };
            "string" != typeof a && (b = a, a = void 0), a = a || "fx";
            while (g--) c = W.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
            return h(), e.promise(b)
        }
    });
    var aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ba = new RegExp("^(?:([+-])=|)(" + aa + ")([a-z%]*)$", "i"),
        ca = ["Top", "Right", "Bottom", "Left"],
        da = function (a, b) {
            return a = b || a, "none" === a.style.display || "" === a.style.display && r.contains(a.ownerDocument, a) && "none" === r.css(a, "display")
        },
        ea = function (a, b, c, d) {
            var e, f, g = {};
            for (f in b) g[f] = a.style[f], a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b) a.style[f] = g[f];
            return e
        };

    function fa(a, b, c, d) {
        var e, f = 1,
            g = 20,
            h = d ? function () {
                return d.cur()
            } : function () {
                return r.css(a, b, "")
            },
            i = h(),
            j = c && c[3] || (r.cssNumber[b] ? "" : "px"),
            k = (r.cssNumber[b] || "px" !== j && +i) && ba.exec(r.css(a, b));
        if (k && k[3] !== j) {
            j = j || k[3], c = c || [], k = +i || 1;
            do f = f || ".5", k /= f, r.style(a, b, k + j); while (f !== (f = h() / i) && 1 !== f && --g)
        }
        return c && (k = +k || +i || 0, e = c[1] ? k + (c[1] + 1) * c[2] : +c[2], d && (d.unit = j, d.start = k, d.end = e)), e
    }
    var ga = {};

    function ha(a) {
        var b, c = a.ownerDocument,
            d = a.nodeName,
            e = ga[d];
        return e ? e : (b = c.body.appendChild(c.createElement(d)), e = r.css(b, "display"), b.parentNode.removeChild(b), "none" === e && (e = "block"), ga[d] = e, e)
    }

    function ia(a, b) {
        for (var c, d, e = [], f = 0, g = a.length; f < g; f++) d = a[f], d.style && (c = d.style.display, b ? ("none" === c && (e[f] = W.get(d, "display") || null, e[f] || (d.style.display = "")), "" === d.style.display && da(d) && (e[f] = ha(d))) : "none" !== c && (e[f] = "none", W.set(d, "display", c)));
        for (f = 0; f < g; f++) null != e[f] && (a[f].style.display = e[f]);
        return a
    }
    r.fn.extend({
        show: function () {
            return ia(this, !0)
        },
        hide: function () {
            return ia(this)
        },
        toggle: function (a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
                da(this) ? r(this).show() : r(this).hide()
            })
        }
    });
    var ja = /^(?:checkbox|radio)$/i,
        ka = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
        la = /^$|\/(?:java|ecma)script/i,
        ma = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    ma.optgroup = ma.option, ma.tbody = ma.tfoot = ma.colgroup = ma.caption = ma.thead, ma.th = ma.td;

    function na(a, b) {
        var c;
        return c = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : [], void 0 === b || b && B(a, b) ? r.merge([a], c) : c
    }

    function oa(a, b) {
        for (var c = 0, d = a.length; c < d; c++) W.set(a[c], "globalEval", !b || W.get(b[c], "globalEval"))
    }
    var pa = /<|&#?\w+;/;

    function qa(a, b, c, d, e) {
        for (var f, g, h, i, j, k, l = b.createDocumentFragment(), m = [], n = 0, o = a.length; n < o; n++)
            if (f = a[n], f || 0 === f)
                if ("object" === r.type(f)) r.merge(m, f.nodeType ? [f] : f);
                else if (pa.test(f)) {
            g = g || l.appendChild(b.createElement("div")), h = (ka.exec(f) || ["", ""])[1].toLowerCase(), i = ma[h] || ma._default, g.innerHTML = i[1] + r.htmlPrefilter(f) + i[2], k = i[0];
            while (k--) g = g.lastChild;
            r.merge(m, g.childNodes), g = l.firstChild, g.textContent = ""
        } else m.push(b.createTextNode(f));
        l.textContent = "", n = 0;
        while (f = m[n++])
            if (d && r.inArray(f, d) > -1) e && e.push(f);
            else if (j = r.contains(f.ownerDocument, f), g = na(l.appendChild(f), "script"), j && oa(g), c) {
            k = 0;
            while (f = g[k++]) la.test(f.type || "") && c.push(f)
        }
        return l
    }! function () {
        var a = d.createDocumentFragment(),
            b = a.appendChild(d.createElement("div")),
            c = d.createElement("input");
        c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), o.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", o.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
    }();
    var ra = d.documentElement,
        sa = /^key/,
        ta = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        ua = /^([^.]*)(?:\.(.+)|)/;

    function va() {
        return !0
    }

    function wa() {
        return !1
    }

    function xa() {
        try {
            return d.activeElement
        } catch (a) {}
    }

    function ya(a, b, c, d, e, f) {
        var g, h;
        if ("object" == typeof b) {
            "string" != typeof c && (d = d || c, c = void 0);
            for (h in b) ya(a, h, c, d, b[h], f);
            return a
        }
        if (null == d && null == e ? (e = c, d = c = void 0) : null == e && ("string" == typeof c ? (e = d, d = void 0) : (e = d, d = c, c = void 0)), e === !1) e = wa;
        else if (!e) return a;
        return 1 === f && (g = e, e = function (a) {
            return r().off(a), g.apply(this, arguments)
        }, e.guid = g.guid || (g.guid = r.guid++)), a.each(function () {
            r.event.add(this, b, e, d, c)
        })
    }
    r.event = {
        global: {},
        add: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = W.get(a);
            if (q) {
                c.handler && (f = c, c = f.handler, e = f.selector), e && r.find.matchesSelector(ra, e), c.guid || (c.guid = r.guid++), (i = q.events) || (i = q.events = {}), (g = q.handle) || (g = q.handle = function (b) {
                    return "undefined" != typeof r && r.event.triggered !== b.type ? r.event.dispatch.apply(a, arguments) : void 0
                }), b = (b || "").match(L) || [""], j = b.length;
                while (j--) h = ua.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n && (l = r.event.special[n] || {}, n = (e ? l.delegateType : l.bindType) || n, l = r.event.special[n] || {}, k = r.extend({
                    type: n,
                    origType: p,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && r.expr.match.needsContext.test(e),
                    namespace: o.join(".")
                }, f), (m = i[n]) || (m = i[n] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), r.event.global[n] = !0)
            }
        },
        remove: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = W.hasData(a) && W.get(a);
            if (q && (i = q.events)) {
                b = (b || "").match(L) || [""], j = b.length;
                while (j--)
                    if (h = ua.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        l = r.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;
                        while (f--) k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
                        g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || r.removeEvent(a, n, q.handle), delete i[n])
                    } else
                        for (n in i) r.event.remove(a, n + b[j], c, d, !0);
                r.isEmptyObject(i) && W.remove(a, "handle events")
            }
        },
        dispatch: function (a) {
            var b = r.event.fix(a),
                c, d, e, f, g, h, i = new Array(arguments.length),
                j = (W.get(this, "events") || {})[b.type] || [],
                k = r.event.special[b.type] || {};
            for (i[0] = b, c = 1; c < arguments.length; c++) i[c] = arguments[c];
            if (b.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, b) !== !1) {
                h = r.event.handlers.call(this, b, j), c = 0;
                while ((f = h[c++]) && !b.isPropagationStopped()) {
                    b.currentTarget = f.elem, d = 0;
                    while ((g = f.handlers[d++]) && !b.isImmediatePropagationStopped()) b.rnamespace && !b.rnamespace.test(g.namespace) || (b.handleObj = g, b.data = g.data, e = ((r.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (b.result = e) === !1 && (b.preventDefault(), b.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, b), b.result
            }
        },
        handlers: function (a, b) {
            var c, d, e, f, g, h = [],
                i = b.delegateCount,
                j = a.target;
            if (i && j.nodeType && !("click" === a.type && a.button >= 1))
                for (; j !== this; j = j.parentNode || this)
                    if (1 === j.nodeType && ("click" !== a.type || j.disabled !== !0)) {
                        for (f = [], g = {}, c = 0; c < i; c++) d = b[c], e = d.selector + " ", void 0 === g[e] && (g[e] = d.needsContext ? r(e, this).index(j) > -1 : r.find(e, this, null, [j]).length), g[e] && f.push(d);
                        f.length && h.push({
                            elem: j,
                            handlers: f
                        })
                    }
            return j = this, i < b.length && h.push({
                elem: j,
                handlers: b.slice(i)
            }), h
        },
        addProp: function (a, b) {
            Object.defineProperty(r.Event.prototype, a, {
                enumerable: !0,
                configurable: !0,
                get: r.isFunction(b) ? function () {
                    if (this.originalEvent) return b(this.originalEvent)
                } : function () {
                    if (this.originalEvent) return this.originalEvent[a]
                },
                set: function (b) {
                    Object.defineProperty(this, a, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: b
                    })
                }
            })
        },
        fix: function (a) {
            return a[r.expando] ? a : new r.Event(a)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    if (this !== xa() && this.focus) return this.focus(), !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === xa() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    if ("checkbox" === this.type && this.click && B(this, "input")) return this.click(), !1
                },
                _default: function (a) {
                    return B(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        }
    }, r.removeEvent = function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c)
    }, r.Event = function (a, b) {
        return this instanceof r.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? va : wa, this.target = a.target && 3 === a.target.nodeType ? a.target.parentNode : a.target, this.currentTarget = a.currentTarget, this.relatedTarget = a.relatedTarget) : this.type = a, b && r.extend(this, b), this.timeStamp = a && a.timeStamp || r.now(), void(this[r.expando] = !0)) : new r.Event(a, b)
    }, r.Event.prototype = {
        constructor: r.Event,
        isDefaultPrevented: wa,
        isPropagationStopped: wa,
        isImmediatePropagationStopped: wa,
        isSimulated: !1,
        preventDefault: function () {
            var a = this.originalEvent;
            this.isDefaultPrevented = va, a && !this.isSimulated && a.preventDefault()
        },
        stopPropagation: function () {
            var a = this.originalEvent;
            this.isPropagationStopped = va, a && !this.isSimulated && a.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = va, a && !this.isSimulated && a.stopImmediatePropagation(), this.stopPropagation()
        }
    }, r.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (a) {
            var b = a.button;
            return null == a.which && sa.test(a.type) ? null != a.charCode ? a.charCode : a.keyCode : !a.which && void 0 !== b && ta.test(a.type) ? 1 & b ? 1 : 2 & b ? 3 : 4 & b ? 2 : 0 : a.which
        }
    }, r.event.addProp), r.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (a, b) {
        r.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function (a) {
                var c, d = this,
                    e = a.relatedTarget,
                    f = a.handleObj;
                return e && (e === d || r.contains(d, e)) || (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), r.fn.extend({
        on: function (a, b, c, d) {
            return ya(this, a, b, c, d)
        },
        one: function (a, b, c, d) {
            return ya(this, a, b, c, d, 1)
        },
        off: function (a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) return d = a.handleObj, r(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
            if ("object" == typeof a) {
                for (e in a) this.off(e, b, a[e]);
                return this
            }
            return b !== !1 && "function" != typeof b || (c = b, b = void 0), c === !1 && (c = wa), this.each(function () {
                r.event.remove(this, a, c, b)
            })
        }
    });
    var za = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        Aa = /<script|<style|<link/i,
        Ba = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ca = /^true\/(.*)/,
        Da = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function Ea(a, b) {
        return B(a, "table") && B(11 !== b.nodeType ? b : b.firstChild, "tr") ? r(">tbody", a)[0] || a : a
    }

    function Fa(a) {
        return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a
    }

    function Ga(a) {
        var b = Ca.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function Ha(a, b) {
        var c, d, e, f, g, h, i, j;
        if (1 === b.nodeType) {
            if (W.hasData(a) && (f = W.access(a), g = W.set(b, f), j = f.events)) {
                delete g.handle, g.events = {};
                for (e in j)
                    for (c = 0, d = j[e].length; c < d; c++) r.event.add(b, e, j[e][c])
            }
            X.hasData(a) && (h = X.access(a), i = r.extend({}, h), X.set(b, i))
        }
    }

    function Ia(a, b) {
        var c = b.nodeName.toLowerCase();
        "input" === c && ja.test(a.type) ? b.checked = a.checked : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue)
    }

    function Ja(a, b, c, d) {
        b = g.apply([], b);
        var e, f, h, i, j, k, l = 0,
            m = a.length,
            n = m - 1,
            q = b[0],
            s = r.isFunction(q);
        if (s || m > 1 && "string" == typeof q && !o.checkClone && Ba.test(q)) return a.each(function (e) {
            var f = a.eq(e);
            s && (b[0] = q.call(this, e, f.html())), Ja(f, b, c, d)
        });
        if (m && (e = qa(b, a[0].ownerDocument, !1, a, d), f = e.firstChild, 1 === e.childNodes.length && (e = f), f || d)) {
            for (h = r.map(na(e, "script"), Fa), i = h.length; l < m; l++) j = e, l !== n && (j = r.clone(j, !0, !0), i && r.merge(h, na(j, "script"))), c.call(a[l], j, l);
            if (i)
                for (k = h[h.length - 1].ownerDocument, r.map(h, Ga), l = 0; l < i; l++) j = h[l], la.test(j.type || "") && !W.access(j, "globalEval") && r.contains(k, j) && (j.src ? r._evalUrl && r._evalUrl(j.src) : p(j.textContent.replace(Da, ""), k))
        }
        return a
    }

    function Ka(a, b, c) {
        for (var d, e = b ? r.filter(b, a) : a, f = 0; null != (d = e[f]); f++) c || 1 !== d.nodeType || r.cleanData(na(d)), d.parentNode && (c && r.contains(d.ownerDocument, d) && oa(na(d, "script")), d.parentNode.removeChild(d));
        return a
    }
    r.extend({
        htmlPrefilter: function (a) {
            return a.replace(za, "<$1></$2>")
        },
        clone: function (a, b, c) {
            var d, e, f, g, h = a.cloneNode(!0),
                i = r.contains(a.ownerDocument, a);
            if (!(o.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || r.isXMLDoc(a)))
                for (g = na(h), f = na(a), d = 0, e = f.length; d < e; d++) Ia(f[d], g[d]);
            if (b)
                if (c)
                    for (f = f || na(a), g = g || na(h), d = 0, e = f.length; d < e; d++) Ha(f[d], g[d]);
                else Ha(a, h);
            return g = na(h, "script"), g.length > 0 && oa(g, !i && na(a, "script")), h
        },
        cleanData: function (a) {
            for (var b, c, d, e = r.event.special, f = 0; void 0 !== (c = a[f]); f++)
                if (U(c)) {
                    if (b = c[W.expando]) {
                        if (b.events)
                            for (d in b.events) e[d] ? r.event.remove(c, d) : r.removeEvent(c, d, b.handle);
                        c[W.expando] = void 0
                    }
                    c[X.expando] && (c[X.expando] = void 0)
                }
        }
    }), r.fn.extend({
        detach: function (a) {
            return Ka(this, a, !0)
        },
        remove: function (a) {
            return Ka(this, a)
        },
        text: function (a) {
            return T(this, function (a) {
                return void 0 === a ? r.text(this) : this.empty().each(function () {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = a)
                })
            }, null, a, arguments.length)
        },
        append: function () {
            return Ja(this, arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Ea(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function () {
            return Ja(this, arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Ea(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function () {
            return Ja(this, arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function () {
            return Ja(this, arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        empty: function () {
            for (var a, b = 0; null != (a = this[b]); b++) 1 === a.nodeType && (r.cleanData(na(a, !1)), a.textContent = "");
            return this
        },
        clone: function (a, b) {
            return a = null != a && a, b = null == b ? a : b, this.map(function () {
                return r.clone(this, a, b)
            })
        },
        html: function (a) {
            return T(this, function (a) {
                var b = this[0] || {},
                    c = 0,
                    d = this.length;
                if (void 0 === a && 1 === b.nodeType) return b.innerHTML;
                if ("string" == typeof a && !Aa.test(a) && !ma[(ka.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = r.htmlPrefilter(a);
                    try {
                        for (; c < d; c++) b = this[c] || {}, 1 === b.nodeType && (r.cleanData(na(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (e) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function () {
            var a = [];
            return Ja(this, arguments, function (b) {
                var c = this.parentNode;
                r.inArray(this, a) < 0 && (r.cleanData(na(this)), c && c.replaceChild(b, this))
            }, a)
        }
    }), r.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        r.fn[a] = function (a) {
            for (var c, d = [], e = r(a), f = e.length - 1, g = 0; g <= f; g++) c = g === f ? this : this.clone(!0), r(e[g])[b](c), h.apply(d, c.get());
            return this.pushStack(d)
        }
    });
    var La = /^margin/,
        Ma = new RegExp("^(" + aa + ")(?!px)[a-z%]+$", "i"),
        Na = function (b) {
            var c = b.ownerDocument.defaultView;
            return c && c.opener || (c = a), c.getComputedStyle(b)
        };
    ! function () {
        function b() {
            if (i) {
                i.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", i.innerHTML = "", ra.appendChild(h);
                var b = a.getComputedStyle(i);
                c = "1%" !== b.top, g = "2px" === b.marginLeft, e = "4px" === b.width, i.style.marginRight = "50%", f = "4px" === b.marginRight, ra.removeChild(h), i = null
            }
        }
        var c, e, f, g, h = d.createElement("div"),
            i = d.createElement("div");
        i.style && (i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", o.clearCloneStyle = "content-box" === i.style.backgroundClip, h.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", h.appendChild(i), r.extend(o, {
            pixelPosition: function () {
                return b(), c
            },
            boxSizingReliable: function () {
                return b(), e
            },
            pixelMarginRight: function () {
                return b(), f
            },
            reliableMarginLeft: function () {
                return b(), g
            }
        }))
    }();

    function Oa(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Na(a), c && (g = c.getPropertyValue(b) || c[b], "" !== g || r.contains(a.ownerDocument, a) || (g = r.style(a, b)), !o.pixelMarginRight() && Ma.test(g) && La.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g
    }

    function Pa(a, b) {
        return {
            get: function () {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    var Qa = /^(none|table(?!-c[ea]).+)/,
        Ra = /^--/,
        Sa = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Ta = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Ua = ["Webkit", "Moz", "ms"],
        Va = d.createElement("div").style;

    function Wa(a) {
        if (a in Va) return a;
        var b = a[0].toUpperCase() + a.slice(1),
            c = Ua.length;
        while (c--)
            if (a = Ua[c] + b, a in Va) return a
    }

    function Xa(a) {
        var b = r.cssProps[a];
        return b || (b = r.cssProps[a] = Wa(a) || a), b
    }

    function Ya(a, b, c) {
        var d = ba.exec(b);
        return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b
    }

    function Za(a, b, c, d, e) {
        var f, g = 0;
        for (f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0; f < 4; f += 2) "margin" === c && (g += r.css(a, c + ca[f], !0, e)), d ? ("content" === c && (g -= r.css(a, "padding" + ca[f], !0, e)), "margin" !== c && (g -= r.css(a, "border" + ca[f] + "Width", !0, e))) : (g += r.css(a, "padding" + ca[f], !0, e), "padding" !== c && (g += r.css(a, "border" + ca[f] + "Width", !0, e)));
        return g
    }

    function $a(a, b, c) {
        var d, e = Na(a),
            f = Oa(a, b, e),
            g = "border-box" === r.css(a, "boxSizing", !1, e);
        return Ma.test(f) ? f : (d = g && (o.boxSizingReliable() || f === a.style[b]), "auto" === f && (f = a["offset" + b[0].toUpperCase() + b.slice(1)]), f = parseFloat(f) || 0, f + Za(a, b, c || (g ? "border" : "content"), d, e) + "px")
    }
    r.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = Oa(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function (a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = r.camelCase(b),
                    i = Ra.test(b),
                    j = a.style;
                return i || (b = Xa(h)), g = r.cssHooks[b] || r.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : j[b] : (f = typeof c, "string" === f && (e = ba.exec(c)) && e[1] && (c = fa(a, b, e), f = "number"), null != c && c === c && ("number" === f && (c += e && e[3] || (r.cssNumber[h] ? "" : "px")), o.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (j[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i ? j.setProperty(b, c) : j[b] = c)), void 0)
            }
        },
        css: function (a, b, c, d) {
            var e, f, g, h = r.camelCase(b),
                i = Ra.test(b);
            return i || (b = Xa(h)), g = r.cssHooks[b] || r.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = Oa(a, b, d)), "normal" === e && b in Ta && (e = Ta[b]), "" === c || c ? (f = parseFloat(e), c === !0 || isFinite(f) ? f || 0 : e) : e
        }
    }), r.each(["height", "width"], function (a, b) {
        r.cssHooks[b] = {
            get: function (a, c, d) {
                if (c) return !Qa.test(r.css(a, "display")) || a.getClientRects().length && a.getBoundingClientRect().width ? $a(a, b, d) : ea(a, Sa, function () {
                    return $a(a, b, d)
                })
            },
            set: function (a, c, d) {
                var e, f = d && Na(a),
                    g = d && Za(a, b, d, "border-box" === r.css(a, "boxSizing", !1, f), f);
                return g && (e = ba.exec(c)) && "px" !== (e[3] || "px") && (a.style[b] = c, c = r.css(a, b)), Ya(a, c, g)
            }
        }
    }), r.cssHooks.marginLeft = Pa(o.reliableMarginLeft, function (a, b) {
        if (b) return (parseFloat(Oa(a, "marginLeft")) || a.getBoundingClientRect().left - ea(a, {
            marginLeft: 0
        }, function () {
            return a.getBoundingClientRect().left
        })) + "px"
    }), r.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (a, b) {
        r.cssHooks[a + b] = {
            expand: function (c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++) e[a + ca[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        }, La.test(a) || (r.cssHooks[a + b].set = Ya)
    }), r.fn.extend({
        css: function (a, b) {
            return T(this, function (a, b, c) {
                var d, e, f = {},
                    g = 0;
                if (Array.isArray(b)) {
                    for (d = Na(a), e = b.length; g < e; g++) f[b[g]] = r.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? r.style(a, b, c) : r.css(a, b)
            }, a, b, arguments.length > 1)
        }
    });

    function _a(a, b, c, d, e) {
        return new _a.prototype.init(a, b, c, d, e)
    }
    r.Tween = _a, _a.prototype = {
        constructor: _a,
        init: function (a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || r.easing._default, this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (r.cssNumber[c] ? "" : "px")
        },
        cur: function () {
            var a = _a.propHooks[this.prop];
            return a && a.get ? a.get(this) : _a.propHooks._default.get(this)
        },
        run: function (a) {
            var b, c = _a.propHooks[this.prop];
            return this.options.duration ? this.pos = b = r.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : _a.propHooks._default.set(this), this
        }
    }, _a.prototype.init.prototype = _a.prototype, _a.propHooks = {
        _default: {
            get: function (a) {
                var b;
                return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = r.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0)
            },
            set: function (a) {
                r.fx.step[a.prop] ? r.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[r.cssProps[a.prop]] && !r.cssHooks[a.prop] ? a.elem[a.prop] = a.now : r.style(a.elem, a.prop, a.now + a.unit)
            }
        }
    }, _a.propHooks.scrollTop = _a.propHooks.scrollLeft = {
        set: function (a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, r.easing = {
        linear: function (a) {
            return a
        },
        swing: function (a) {
            return .5 - Math.cos(a * Math.PI) / 2
        },
        _default: "swing"
    }, r.fx = _a.prototype.init, r.fx.step = {};
    var ab, bb, cb = /^(?:toggle|show|hide)$/,
        db = /queueHooks$/;

    function eb() {
        bb && (d.hidden === !1 && a.requestAnimationFrame ? a.requestAnimationFrame(eb) : a.setTimeout(eb, r.fx.interval), r.fx.tick())
    }

    function fb() {
        return a.setTimeout(function () {
            ab = void 0
        }), ab = r.now()
    }

    function gb(a, b) {
        var c, d = 0,
            e = {
                height: a
            };
        for (b = b ? 1 : 0; d < 4; d += 2 - b) c = ca[d], e["margin" + c] = e["padding" + c] = a;
        return b && (e.opacity = e.width = a), e
    }

    function hb(a, b, c) {
        for (var d, e = (kb.tweeners[b] || []).concat(kb.tweeners["*"]), f = 0, g = e.length; f < g; f++)
            if (d = e[f].call(c, b, a)) return d
    }

    function ib(a, b, c) {
        var d, e, f, g, h, i, j, k, l = "width" in b || "height" in b,
            m = this,
            n = {},
            o = a.style,
            p = a.nodeType && da(a),
            q = W.get(a, "fxshow");
        c.queue || (g = r._queueHooks(a, "fx"), null == g.unqueued && (g.unqueued = 0, h = g.empty.fire, g.empty.fire = function () {
            g.unqueued || h()
        }), g.unqueued++, m.always(function () {
            m.always(function () {
                g.unqueued--, r.queue(a, "fx").length || g.empty.fire()
            })
        }));
        for (d in b)
            if (e = b[d], cb.test(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) {
                    if ("show" !== e || !q || void 0 === q[d]) continue;
                    p = !0
                }
                n[d] = q && q[d] || r.style(a, d)
            }
        if (i = !r.isEmptyObject(b), i || !r.isEmptyObject(n)) {
            l && 1 === a.nodeType && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = q && q.display, null == j && (j = W.get(a, "display")), k = r.css(a, "display"), "none" === k && (j ? k = j : (ia([a], !0), j = a.style.display || j, k = r.css(a, "display"), ia([a]))), ("inline" === k || "inline-block" === k && null != j) && "none" === r.css(a, "float") && (i || (m.done(function () {
                o.display = j
            }), null == j && (k = o.display, j = "none" === k ? "" : k)), o.display = "inline-block")), c.overflow && (o.overflow = "hidden", m.always(function () {
                o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2]
            })), i = !1;
            for (d in n) i || (q ? "hidden" in q && (p = q.hidden) : q = W.access(a, "fxshow", {
                display: j
            }), f && (q.hidden = !p), p && ia([a], !0), m.done(function () {
                p || ia([a]), W.remove(a, "fxshow");
                for (d in n) r.style(a, d, n[d])
            })), i = hb(p ? q[d] : 0, d, m), d in q || (q[d] = i.start, p && (i.end = i.start, i.start = 0))
        }
    }

    function jb(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = r.camelCase(c), e = b[d], f = a[c], Array.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = r.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
    }

    function kb(a, b, c) {
        var d, e, f = 0,
            g = kb.prefilters.length,
            h = r.Deferred().always(function () {
                delete i.elem
            }),
            i = function () {
                if (e) return !1;
                for (var b = ab || fb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; g < i; g++) j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), f < 1 && i ? c : (i || h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j]), !1)
            },
            j = h.promise({
                elem: a,
                props: r.extend({}, b),
                opts: r.extend(!0, {
                    specialEasing: {},
                    easing: r.easing._default
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: ab || fb(),
                duration: c.duration,
                tweens: [],
                createTween: function (b, c) {
                    var d = r.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function (b) {
                    var c = 0,
                        d = b ? j.tweens.length : 0;
                    if (e) return this;
                    for (e = !0; c < d; c++) j.tweens[c].run(1);
                    return b ? (h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]), this
                }
            }),
            k = j.props;
        for (jb(k, j.opts.specialEasing); f < g; f++)
            if (d = kb.prefilters[f].call(j, a, k, j.opts)) return r.isFunction(d.stop) && (r._queueHooks(j.elem, j.opts.queue).stop = r.proxy(d.stop, d)), d;
        return r.map(k, hb, j), r.isFunction(j.opts.start) && j.opts.start.call(a, j), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always), r.fx.timer(r.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j
    }
    r.Animation = r.extend(kb, {
            tweeners: {
                "*": [function (a, b) {
                    var c = this.createTween(a, b);
                    return fa(c.elem, a, ba.exec(b), c), c
                }]
            },
            tweener: function (a, b) {
                r.isFunction(a) ? (b = a, a = ["*"]) : a = a.match(L);
                for (var c, d = 0, e = a.length; d < e; d++) c = a[d], kb.tweeners[c] = kb.tweeners[c] || [], kb.tweeners[c].unshift(b)
            },
            prefilters: [ib],
            prefilter: function (a, b) {
                b ? kb.prefilters.unshift(a) : kb.prefilters.push(a)
            }
        }), r.speed = function (a, b, c) {
            var d = a && "object" == typeof a ? r.extend({}, a) : {
                complete: c || !c && b || r.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !r.isFunction(b) && b
            };
            return r.fx.off ? d.duration = 0 : "number" != typeof d.duration && (d.duration in r.fx.speeds ? d.duration = r.fx.speeds[d.duration] : d.duration = r.fx.speeds._default), null != d.queue && d.queue !== !0 || (d.queue = "fx"), d.old = d.complete, d.complete = function () {
                r.isFunction(d.old) && d.old.call(this), d.queue && r.dequeue(this, d.queue)
            }, d
        }, r.fn.extend({
            fadeTo: function (a, b, c, d) {
                return this.filter(da).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d)
            },
            animate: function (a, b, c, d) {
                var e = r.isEmptyObject(a),
                    f = r.speed(b, c, d),
                    g = function () {
                        var b = kb(this, r.extend({}, a), f);
                        (e || W.get(this, "finish")) && b.stop(!0)
                    };
                return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            },
            stop: function (a, b, c) {
                var d = function (a) {
                    var b = a.stop;
                    delete a.stop, b(c)
                };
                return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                    var b = !0,
                        e = null != a && a + "queueHooks",
                        f = r.timers,
                        g = W.get(this);
                    if (e) g[e] && g[e].stop && d(g[e]);
                    else
                        for (e in g) g[e] && g[e].stop && db.test(e) && d(g[e]);
                    for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                    !b && c || r.dequeue(this, a)
                })
            },
            finish: function (a) {
                return a !== !1 && (a = a || "fx"), this.each(function () {
                    var b, c = W.get(this),
                        d = c[a + "queue"],
                        e = c[a + "queueHooks"],
                        f = r.timers,
                        g = d ? d.length : 0;
                    for (c.finish = !0, r.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                    for (b = 0; b < g; b++) d[b] && d[b].finish && d[b].finish.call(this);
                    delete c.finish
                })
            }
        }), r.each(["toggle", "show", "hide"], function (a, b) {
            var c = r.fn[b];
            r.fn[b] = function (a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gb(b, !0), a, d, e)
            }
        }), r.each({
            slideDown: gb("show"),
            slideUp: gb("hide"),
            slideToggle: gb("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function (a, b) {
            r.fn[a] = function (a, c, d) {
                return this.animate(b, a, c, d)
            }
        }), r.timers = [], r.fx.tick = function () {
            var a, b = 0,
                c = r.timers;
            for (ab = r.now(); b < c.length; b++) a = c[b], a() || c[b] !== a || c.splice(b--, 1);
            c.length || r.fx.stop(), ab = void 0
        }, r.fx.timer = function (a) {
            r.timers.push(a), r.fx.start()
        }, r.fx.interval = 13, r.fx.start = function () {
            bb || (bb = !0, eb())
        }, r.fx.stop = function () {
            bb = null
        }, r.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, r.fn.delay = function (b, c) {
            return b = r.fx ? r.fx.speeds[b] || b : b, c = c || "fx", this.queue(c, function (c, d) {
                var e = a.setTimeout(c, b);
                d.stop = function () {
                    a.clearTimeout(e)
                }
            })
        },
        function () {
            var a = d.createElement("input"),
                b = d.createElement("select"),
                c = b.appendChild(d.createElement("option"));
            a.type = "checkbox", o.checkOn = "" !== a.value, o.optSelected = c.selected, a = d.createElement("input"), a.value = "t", a.type = "radio", o.radioValue = "t" === a.value
        }();
    var lb, mb = r.expr.attrHandle;
    r.fn.extend({
        attr: function (a, b) {
            return T(this, r.attr, a, b, arguments.length > 1)
        },
        removeAttr: function (a) {
            return this.each(function () {
                r.removeAttr(this, a)
            })
        }
    }), r.extend({
        attr: function (a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f) return "undefined" == typeof a.getAttribute ? r.prop(a, b, c) : (1 === f && r.isXMLDoc(a) || (e = r.attrHooks[b.toLowerCase()] || (r.expr.match.bool.test(b) ? lb : void 0)), void 0 !== c ? null === c ? void r.removeAttr(a, b) : e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), c) : e && "get" in e && null !== (d = e.get(a, b)) ? d : (d = r.find.attr(a, b),
                null == d ? void 0 : d))
        },
        attrHooks: {
            type: {
                set: function (a, b) {
                    if (!o.radioValue && "radio" === b && B(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        },
        removeAttr: function (a, b) {
            var c, d = 0,
                e = b && b.match(L);
            if (e && 1 === a.nodeType)
                while (c = e[d++]) a.removeAttribute(c)
        }
    }), lb = {
        set: function (a, b, c) {
            return b === !1 ? r.removeAttr(a, c) : a.setAttribute(c, c), c
        }
    }, r.each(r.expr.match.bool.source.match(/\w+/g), function (a, b) {
        var c = mb[b] || r.find.attr;
        mb[b] = function (a, b, d) {
            var e, f, g = b.toLowerCase();
            return d || (f = mb[g], mb[g] = e, e = null != c(a, b, d) ? g : null, mb[g] = f), e
        }
    });
    var nb = /^(?:input|select|textarea|button)$/i,
        ob = /^(?:a|area)$/i;
    r.fn.extend({
        prop: function (a, b) {
            return T(this, r.prop, a, b, arguments.length > 1)
        },
        removeProp: function (a) {
            return this.each(function () {
                delete this[r.propFix[a] || a]
            })
        }
    }), r.extend({
        prop: function (a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f) return 1 === f && r.isXMLDoc(a) || (b = r.propFix[b] || b, e = r.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function (a) {
                    var b = r.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : nb.test(a.nodeName) || ob.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), o.optSelected || (r.propHooks.selected = {
        get: function (a) {
            var b = a.parentNode;
            return b && b.parentNode && b.parentNode.selectedIndex, null
        },
        set: function (a) {
            var b = a.parentNode;
            b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex)
        }
    }), r.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        r.propFix[this.toLowerCase()] = this
    });

    function pb(a) {
        var b = a.match(L) || [];
        return b.join(" ")
    }

    function qb(a) {
        return a.getAttribute && a.getAttribute("class") || ""
    }
    r.fn.extend({
        addClass: function (a) {
            var b, c, d, e, f, g, h, i = 0;
            if (r.isFunction(a)) return this.each(function (b) {
                r(this).addClass(a.call(this, b, qb(this)))
            });
            if ("string" == typeof a && a) {
                b = a.match(L) || [];
                while (c = this[i++])
                    if (e = qb(c), d = 1 === c.nodeType && " " + pb(e) + " ") {
                        g = 0;
                        while (f = b[g++]) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                        h = pb(d), e !== h && c.setAttribute("class", h)
                    }
            }
            return this
        },
        removeClass: function (a) {
            var b, c, d, e, f, g, h, i = 0;
            if (r.isFunction(a)) return this.each(function (b) {
                r(this).removeClass(a.call(this, b, qb(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof a && a) {
                b = a.match(L) || [];
                while (c = this[i++])
                    if (e = qb(c), d = 1 === c.nodeType && " " + pb(e) + " ") {
                        g = 0;
                        while (f = b[g++])
                            while (d.indexOf(" " + f + " ") > -1) d = d.replace(" " + f + " ", " ");
                        h = pb(d), e !== h && c.setAttribute("class", h)
                    }
            }
            return this
        },
        toggleClass: function (a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : r.isFunction(a) ? this.each(function (c) {
                r(this).toggleClass(a.call(this, c, qb(this), b), b)
            }) : this.each(function () {
                var b, d, e, f;
                if ("string" === c) {
                    d = 0, e = r(this), f = a.match(L) || [];
                    while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                } else void 0 !== a && "boolean" !== c || (b = qb(this), b && W.set(this, "__className__", b), this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : W.get(this, "__className__") || ""))
            })
        },
        hasClass: function (a) {
            var b, c, d = 0;
            b = " " + a + " ";
            while (c = this[d++])
                if (1 === c.nodeType && (" " + pb(qb(c)) + " ").indexOf(b) > -1) return !0;
            return !1
        }
    });
    var rb = /\r/g;
    r.fn.extend({
        val: function (a) {
            var b, c, d, e = this[0]; {
                if (arguments.length) return d = r.isFunction(a), this.each(function (c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, r(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : Array.isArray(e) && (e = r.map(e, function (a) {
                        return null == a ? "" : a + ""
                    })), b = r.valHooks[this.type] || r.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                });
                if (e) return b = r.valHooks[e.type] || r.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(rb, "") : null == c ? "" : c)
            }
        }
    }), r.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = r.find.attr(a, "value");
                    return null != b ? b : pb(r.text(a))
                }
            },
            select: {
                get: function (a) {
                    var b, c, d, e = a.options,
                        f = a.selectedIndex,
                        g = "select-one" === a.type,
                        h = g ? null : [],
                        i = g ? f + 1 : e.length;
                    for (d = f < 0 ? i : g ? f : 0; d < i; d++)
                        if (c = e[d], (c.selected || d === f) && !c.disabled && (!c.parentNode.disabled || !B(c.parentNode, "optgroup"))) {
                            if (b = r(c).val(), g) return b;
                            h.push(b)
                        }
                    return h
                },
                set: function (a, b) {
                    var c, d, e = a.options,
                        f = r.makeArray(b),
                        g = e.length;
                    while (g--) d = e[g], (d.selected = r.inArray(r.valHooks.option.get(d), f) > -1) && (c = !0);
                    return c || (a.selectedIndex = -1), f
                }
            }
        }
    }), r.each(["radio", "checkbox"], function () {
        r.valHooks[this] = {
            set: function (a, b) {
                if (Array.isArray(b)) return a.checked = r.inArray(r(a).val(), b) > -1
            }
        }, o.checkOn || (r.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var sb = /^(?:focusinfocus|focusoutblur)$/;
    r.extend(r.event, {
        trigger: function (b, c, e, f) {
            var g, h, i, j, k, m, n, o = [e || d],
                p = l.call(b, "type") ? b.type : b,
                q = l.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = i = e = e || d, 3 !== e.nodeType && 8 !== e.nodeType && !sb.test(p + r.event.triggered) && (p.indexOf(".") > -1 && (q = p.split("."), p = q.shift(), q.sort()), k = p.indexOf(":") < 0 && "on" + p, b = b[r.expando] ? b : new r.Event(p, "object" == typeof b && b), b.isTrigger = f ? 2 : 3, b.namespace = q.join("."), b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = e), c = null == c ? [b] : r.makeArray(c, [b]), n = r.event.special[p] || {}, f || !n.trigger || n.trigger.apply(e, c) !== !1)) {
                if (!f && !n.noBubble && !r.isWindow(e)) {
                    for (j = n.delegateType || p, sb.test(j + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), i = h;
                    i === (e.ownerDocument || d) && o.push(i.defaultView || i.parentWindow || a)
                }
                g = 0;
                while ((h = o[g++]) && !b.isPropagationStopped()) b.type = g > 1 ? j : n.bindType || p, m = (W.get(h, "events") || {})[b.type] && W.get(h, "handle"), m && m.apply(h, c), m = k && h[k], m && m.apply && U(h) && (b.result = m.apply(h, c), b.result === !1 && b.preventDefault());
                return b.type = p, f || b.isDefaultPrevented() || n._default && n._default.apply(o.pop(), c) !== !1 || !U(e) || k && r.isFunction(e[p]) && !r.isWindow(e) && (i = e[k], i && (e[k] = null), r.event.triggered = p, e[p](), r.event.triggered = void 0, i && (e[k] = i)), b.result
            }
        },
        simulate: function (a, b, c) {
            var d = r.extend(new r.Event, c, {
                type: a,
                isSimulated: !0
            });
            r.event.trigger(d, null, b)
        }
    }), r.fn.extend({
        trigger: function (a, b) {
            return this.each(function () {
                r.event.trigger(a, b, this)
            })
        },
        triggerHandler: function (a, b) {
            var c = this[0];
            if (c) return r.event.trigger(a, b, c, !0)
        }
    }), r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (a, b) {
        r.fn[b] = function (a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), r.fn.extend({
        hover: function (a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    }), o.focusin = "onfocusin" in a, o.focusin || r.each({
        focus: "focusin",
        blur: "focusout"
    }, function (a, b) {
        var c = function (a) {
            r.event.simulate(b, a.target, r.event.fix(a))
        };
        r.event.special[b] = {
            setup: function () {
                var d = this.ownerDocument || this,
                    e = W.access(d, b);
                e || d.addEventListener(a, c, !0), W.access(d, b, (e || 0) + 1)
            },
            teardown: function () {
                var d = this.ownerDocument || this,
                    e = W.access(d, b) - 1;
                e ? W.access(d, b, e) : (d.removeEventListener(a, c, !0), W.remove(d, b))
            }
        }
    });
    var tb = a.location,
        ub = r.now(),
        vb = /\?/;
    r.parseXML = function (b) {
        var c;
        if (!b || "string" != typeof b) return null;
        try {
            c = (new a.DOMParser).parseFromString(b, "text/xml")
        } catch (d) {
            c = void 0
        }
        return c && !c.getElementsByTagName("parsererror").length || r.error("Invalid XML: " + b), c
    };
    var wb = /\[\]$/,
        xb = /\r?\n/g,
        yb = /^(?:submit|button|image|reset|file)$/i,
        zb = /^(?:input|select|textarea|keygen)/i;

    function Ab(a, b, c, d) {
        var e;
        if (Array.isArray(b)) r.each(b, function (b, e) {
            c || wb.test(a) ? d(a, e) : Ab(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d)
        });
        else if (c || "object" !== r.type(b)) d(a, b);
        else
            for (e in b) Ab(a + "[" + e + "]", b[e], c, d)
    }
    r.param = function (a, b) {
        var c, d = [],
            e = function (a, b) {
                var c = r.isFunction(b) ? b() : b;
                d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(null == c ? "" : c)
            };
        if (Array.isArray(a) || a.jquery && !r.isPlainObject(a)) r.each(a, function () {
            e(this.name, this.value)
        });
        else
            for (c in a) Ab(c, a[c], b, e);
        return d.join("&")
    }, r.fn.extend({
        serialize: function () {
            return r.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var a = r.prop(this, "elements");
                return a ? r.makeArray(a) : this
            }).filter(function () {
                var a = this.type;
                return this.name && !r(this).is(":disabled") && zb.test(this.nodeName) && !yb.test(a) && (this.checked || !ja.test(a))
            }).map(function (a, b) {
                var c = r(this).val();
                return null == c ? null : Array.isArray(c) ? r.map(c, function (a) {
                    return {
                        name: b.name,
                        value: a.replace(xb, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(xb, "\r\n")
                }
            }).get()
        }
    });
    var Bb = /%20/g,
        Cb = /#.*$/,
        Db = /([?&])_=[^&]*/,
        Eb = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Fb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Gb = /^(?:GET|HEAD)$/,
        Hb = /^\/\//,
        Ib = {},
        Jb = {},
        Kb = "*/".concat("*"),
        Lb = d.createElement("a");
    Lb.href = tb.href;

    function Mb(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0,
                f = b.toLowerCase().match(L) || [];
            if (r.isFunction(c))
                while (d = f[e++]) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }

    function Nb(a, b, c, d) {
        var e = {},
            f = a === Jb;

        function g(h) {
            var i;
            return e[h] = !0, r.each(a[h] || [], function (a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
            }), i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }

    function Ob(a, b) {
        var c, d, e = r.ajaxSettings.flatOptions || {};
        for (c in b) void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
        return d && r.extend(!0, a, d), a
    }

    function Pb(a, b, c) {
        var d, e, f, g, h = a.contents,
            i = a.dataTypes;
        while ("*" === i[0]) i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
        if (d)
            for (e in h)
                if (h[e] && h[e].test(d)) {
                    i.unshift(e);
                    break
                }
        if (i[0] in c) f = i[0];
        else {
            for (e in c) {
                if (!i[0] || a.converters[e + " " + i[0]]) {
                    f = e;
                    break
                }
                g || (g = e)
            }
            f = f || g
        }
        if (f) return f !== i[0] && i.unshift(f), c[f]
    }

    function Qb(a, b, c, d) {
        var e, f, g, h, i, j = {},
            k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                if ("*" === f) f = i;
                else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g)
                for (e in j)
                    if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                        g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                        break
                    }
            if (g !== !0)
                if (g && a["throws"]) b = g(b);
                else try {
                    b = g(b)
                } catch (l) {
                    return {
                        state: "parsererror",
                        error: g ? l : "No conversion from " + i + " to " + f
                    }
                }
        }
        return {
            state: "success",
            data: b
        }
    }
    r.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: tb.href,
            type: "GET",
            isLocal: Fb.test(tb.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Kb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": r.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (a, b) {
            return b ? Ob(Ob(a, r.ajaxSettings), b) : Ob(r.ajaxSettings, a)
        },
        ajaxPrefilter: Mb(Ib),
        ajaxTransport: Mb(Jb),
        ajax: function (b, c) {
            "object" == typeof b && (c = b, b = void 0), c = c || {};
            var e, f, g, h, i, j, k, l, m, n, o = r.ajaxSetup({}, c),
                p = o.context || o,
                q = o.context && (p.nodeType || p.jquery) ? r(p) : r.event,
                s = r.Deferred(),
                t = r.Callbacks("once memory"),
                u = o.statusCode || {},
                v = {},
                w = {},
                x = "canceled",
                y = {
                    readyState: 0,
                    getResponseHeader: function (a) {
                        var b;
                        if (k) {
                            if (!h) {
                                h = {};
                                while (b = Eb.exec(g)) h[b[1].toLowerCase()] = b[2]
                            }
                            b = h[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function () {
                        return k ? g : null
                    },
                    setRequestHeader: function (a, b) {
                        return null == k && (a = w[a.toLowerCase()] = w[a.toLowerCase()] || a, v[a] = b), this
                    },
                    overrideMimeType: function (a) {
                        return null == k && (o.mimeType = a), this
                    },
                    statusCode: function (a) {
                        var b;
                        if (a)
                            if (k) y.always(a[y.status]);
                            else
                                for (b in a) u[b] = [u[b], a[b]];
                        return this
                    },
                    abort: function (a) {
                        var b = a || x;
                        return e && e.abort(b), A(0, b), this
                    }
                };
            if (s.promise(y), o.url = ((b || o.url || tb.href) + "").replace(Hb, tb.protocol + "//"), o.type = c.method || c.type || o.method || o.type, o.dataTypes = (o.dataType || "*").toLowerCase().match(L) || [""], null == o.crossDomain) {
                j = d.createElement("a");
                try {
                    j.href = o.url, j.href = j.href, o.crossDomain = Lb.protocol + "//" + Lb.host != j.protocol + "//" + j.host
                } catch (z) {
                    o.crossDomain = !0
                }
            }
            if (o.data && o.processData && "string" != typeof o.data && (o.data = r.param(o.data, o.traditional)), Nb(Ib, o, c, y), k) return y;
            l = r.event && o.global, l && 0 === r.active++ && r.event.trigger("ajaxStart"), o.type = o.type.toUpperCase(), o.hasContent = !Gb.test(o.type), f = o.url.replace(Cb, ""), o.hasContent ? o.data && o.processData && 0 === (o.contentType || "").indexOf("application/x-www-form-urlencoded") && (o.data = o.data.replace(Bb, "+")) : (n = o.url.slice(f.length), o.data && (f += (vb.test(f) ? "&" : "?") + o.data, delete o.data), o.cache === !1 && (f = f.replace(Db, "$1"), n = (vb.test(f) ? "&" : "?") + "_=" + ub++ + n), o.url = f + n), o.ifModified && (r.lastModified[f] && y.setRequestHeader("If-Modified-Since", r.lastModified[f]), r.etag[f] && y.setRequestHeader("If-None-Match", r.etag[f])), (o.data && o.hasContent && o.contentType !== !1 || c.contentType) && y.setRequestHeader("Content-Type", o.contentType), y.setRequestHeader("Accept", o.dataTypes[0] && o.accepts[o.dataTypes[0]] ? o.accepts[o.dataTypes[0]] + ("*" !== o.dataTypes[0] ? ", " + Kb + "; q=0.01" : "") : o.accepts["*"]);
            for (m in o.headers) y.setRequestHeader(m, o.headers[m]);
            if (o.beforeSend && (o.beforeSend.call(p, y, o) === !1 || k)) return y.abort();
            if (x = "abort", t.add(o.complete), y.done(o.success), y.fail(o.error), e = Nb(Jb, o, c, y)) {
                if (y.readyState = 1, l && q.trigger("ajaxSend", [y, o]), k) return y;
                o.async && o.timeout > 0 && (i = a.setTimeout(function () {
                    y.abort("timeout")
                }, o.timeout));
                try {
                    k = !1, e.send(v, A)
                } catch (z) {
                    if (k) throw z;
                    A(-1, z)
                }
            } else A(-1, "No Transport");

            function A(b, c, d, h) {
                var j, m, n, v, w, x = c;
                k || (k = !0, i && a.clearTimeout(i), e = void 0, g = h || "", y.readyState = b > 0 ? 4 : 0, j = b >= 200 && b < 300 || 304 === b, d && (v = Pb(o, y, d)), v = Qb(o, v, y, j), j ? (o.ifModified && (w = y.getResponseHeader("Last-Modified"), w && (r.lastModified[f] = w), w = y.getResponseHeader("etag"), w && (r.etag[f] = w)), 204 === b || "HEAD" === o.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = v.state, m = v.data, n = v.error, j = !n)) : (n = x, !b && x || (x = "error", b < 0 && (b = 0))), y.status = b, y.statusText = (c || x) + "", j ? s.resolveWith(p, [m, x, y]) : s.rejectWith(p, [y, x, n]), y.statusCode(u), u = void 0, l && q.trigger(j ? "ajaxSuccess" : "ajaxError", [y, o, j ? m : n]), t.fireWith(p, [y, x]), l && (q.trigger("ajaxComplete", [y, o]), --r.active || r.event.trigger("ajaxStop")))
            }
            return y
        },
        getJSON: function (a, b, c) {
            return r.get(a, b, c, "json")
        },
        getScript: function (a, b) {
            return r.get(a, void 0, b, "script")
        }
    }), r.each(["get", "post"], function (a, b) {
        r[b] = function (a, c, d, e) {
            return r.isFunction(c) && (e = e || d, d = c, c = void 0), r.ajax(r.extend({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            }, r.isPlainObject(a) && a))
        }
    }), r._evalUrl = function (a) {
        return r.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }, r.fn.extend({
        wrapAll: function (a) {
            var b;
            return this[0] && (r.isFunction(a) && (a = a.call(this[0])), b = r(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                var a = this;
                while (a.firstElementChild) a = a.firstElementChild;
                return a
            }).append(this)), this
        },
        wrapInner: function (a) {
            return r.isFunction(a) ? this.each(function (b) {
                r(this).wrapInner(a.call(this, b))
            }) : this.each(function () {
                var b = r(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function (a) {
            var b = r.isFunction(a);
            return this.each(function (c) {
                r(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function (a) {
            return this.parent(a).not("body").each(function () {
                r(this).replaceWith(this.childNodes)
            }), this
        }
    }), r.expr.pseudos.hidden = function (a) {
        return !r.expr.pseudos.visible(a)
    }, r.expr.pseudos.visible = function (a) {
        return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
    }, r.ajaxSettings.xhr = function () {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    };
    var Rb = {
            0: 200,
            1223: 204
        },
        Sb = r.ajaxSettings.xhr();
    o.cors = !!Sb && "withCredentials" in Sb, o.ajax = Sb = !!Sb, r.ajaxTransport(function (b) {
        var c, d;
        if (o.cors || Sb && !b.crossDomain) return {
            send: function (e, f) {
                var g, h = b.xhr();
                if (h.open(b.type, b.url, b.async, b.username, b.password), b.xhrFields)
                    for (g in b.xhrFields) h[g] = b.xhrFields[g];
                b.mimeType && h.overrideMimeType && h.overrideMimeType(b.mimeType), b.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest");
                for (g in e) h.setRequestHeader(g, e[g]);
                c = function (a) {
                    return function () {
                        c && (c = d = h.onload = h.onerror = h.onabort = h.onreadystatechange = null, "abort" === a ? h.abort() : "error" === a ? "number" != typeof h.status ? f(0, "error") : f(h.status, h.statusText) : f(Rb[h.status] || h.status, h.statusText, "text" !== (h.responseType || "text") || "string" != typeof h.responseText ? {
                            binary: h.response
                        } : {
                            text: h.responseText
                        }, h.getAllResponseHeaders()))
                    }
                }, h.onload = c(), d = h.onerror = c("error"), void 0 !== h.onabort ? h.onabort = d : h.onreadystatechange = function () {
                    4 === h.readyState && a.setTimeout(function () {
                        c && d()
                    })
                }, c = c("abort");
                try {
                    h.send(b.hasContent && b.data || null)
                } catch (i) {
                    if (c) throw i
                }
            },
            abort: function () {
                c && c()
            }
        }
    }), r.ajaxPrefilter(function (a) {
        a.crossDomain && (a.contents.script = !1)
    }), r.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (a) {
                return r.globalEval(a), a
            }
        }
    }), r.ajaxPrefilter("script", function (a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET")
    }), r.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var b, c;
            return {
                send: function (e, f) {
                    b = r("<script>").prop({
                        charset: a.scriptCharset,
                        src: a.url
                    }).on("load error", c = function (a) {
                        b.remove(), c = null, a && f("error" === a.type ? 404 : 200, a.type)
                    }), d.head.appendChild(b[0])
                },
                abort: function () {
                    c && c()
                }
            }
        }
    });
    var Tb = [],
        Ub = /(=)\?(?=&|$)|\?\?/;
    r.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var a = Tb.pop() || r.expando + "_" + ub++;
            return this[a] = !0, a
        }
    }), r.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (Ub.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && Ub.test(b.data) && "data");
        if (h || "jsonp" === b.dataTypes[0]) return e = b.jsonpCallback = r.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Ub, "$1" + e) : b.jsonp !== !1 && (b.url += (vb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
            return g || r.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
            g = arguments
        }, d.always(function () {
            void 0 === f ? r(a).removeProp(e) : a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Tb.push(e)), g && r.isFunction(f) && f(g[0]), g = f = void 0
        }), "script"
    }), o.createHTMLDocument = function () {
        var a = d.implementation.createHTMLDocument("").body;
        return a.innerHTML = "<form></form><form></form>", 2 === a.childNodes.length
    }(), r.parseHTML = function (a, b, c) {
        if ("string" != typeof a) return [];
        "boolean" == typeof b && (c = b, b = !1);
        var e, f, g;
        return b || (o.createHTMLDocument ? (b = d.implementation.createHTMLDocument(""), e = b.createElement("base"), e.href = d.location.href, b.head.appendChild(e)) : b = d), f = C.exec(a), g = !c && [], f ? [b.createElement(f[1])] : (f = qa([a], b, g), g && g.length && r(g).remove(), r.merge([], f.childNodes))
    }, r.fn.load = function (a, b, c) {
        var d, e, f, g = this,
            h = a.indexOf(" ");
        return h > -1 && (d = pb(a.slice(h)), a = a.slice(0, h)), r.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && r.ajax({
            url: a,
            type: e || "GET",
            dataType: "html",
            data: b
        }).done(function (a) {
            f = arguments, g.html(d ? r("<div>").append(r.parseHTML(a)).find(d) : a)
        }).always(c && function (a, b) {
            g.each(function () {
                c.apply(this, f || [a.responseText, b, a])
            })
        }), this
    }, r.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
        r.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), r.expr.pseudos.animated = function (a) {
        return r.grep(r.timers, function (b) {
            return a === b.elem
        }).length
    }, r.offset = {
        setOffset: function (a, b, c) {
            var d, e, f, g, h, i, j, k = r.css(a, "position"),
                l = r(a),
                m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = r.css(a, "top"), i = r.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), r.isFunction(b) && (b = b.call(a, c, r.extend({}, h))), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }
    }, r.fn.extend({
        offset: function (a) {
            if (arguments.length) return void 0 === a ? this : this.each(function (b) {
                r.offset.setOffset(this, a, b)
            });
            var b, c, d, e, f = this[0];
            if (f) return f.getClientRects().length ? (d = f.getBoundingClientRect(), b = f.ownerDocument, c = b.documentElement, e = b.defaultView, {
                top: d.top + e.pageYOffset - c.clientTop,
                left: d.left + e.pageXOffset - c.clientLeft
            }) : {
                top: 0,
                left: 0
            }
        },
        position: function () {
            if (this[0]) {
                var a, b, c = this[0],
                    d = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === r.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), B(a[0], "html") || (d = a.offset()), d = {
                    top: d.top + r.css(a[0], "borderTopWidth", !0),
                    left: d.left + r.css(a[0], "borderLeftWidth", !0)
                }), {
                    top: b.top - d.top - r.css(c, "marginTop", !0),
                    left: b.left - d.left - r.css(c, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                var a = this.offsetParent;
                while (a && "static" === r.css(a, "position")) a = a.offsetParent;
                return a || ra
            })
        }
    }), r.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (a, b) {
        var c = "pageYOffset" === b;
        r.fn[a] = function (d) {
            return T(this, function (a, d, e) {
                var f;
                return r.isWindow(a) ? f = a : 9 === a.nodeType && (f = a.defaultView), void 0 === e ? f ? f[b] : a[d] : void(f ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset) : a[d] = e)
            }, a, d, arguments.length)
        }
    }), r.each(["top", "left"], function (a, b) {
        r.cssHooks[b] = Pa(o.pixelPosition, function (a, c) {
            if (c) return c = Oa(a, b), Ma.test(c) ? r(a).position()[b] + "px" : c
        })
    }), r.each({
        Height: "height",
        Width: "width"
    }, function (a, b) {
        r.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function (c, d) {
            r.fn[d] = function (e, f) {
                var g = arguments.length && (c || "boolean" != typeof e),
                    h = c || (e === !0 || f === !0 ? "margin" : "border");
                return T(this, function (b, c, e) {
                    var f;
                    return r.isWindow(b) ? 0 === d.indexOf("outer") ? b["inner" + a] : b.document.documentElement["client" + a] : 9 === b.nodeType ? (f = b.documentElement, Math.max(b.body["scroll" + a], f["scroll" + a], b.body["offset" + a], f["offset" + a], f["client" + a])) : void 0 === e ? r.css(b, c, h) : r.style(b, c, e, h)
                }, b, g ? e : void 0, g)
            }
        })
    }), r.fn.extend({
        bind: function (a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function (a, b) {
            return this.off(a, null, b)
        },
        delegate: function (a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function (a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    }), r.holdReady = function (a) {
        a ? r.readyWait++ : r.ready(!0)
    }, r.isArray = Array.isArray, r.parseJSON = JSON.parse, r.nodeName = B, "function" == typeof define && define.amd && define("jquery", [], function () {
        return r
    });
    var Vb = a.jQuery,
        Wb = a.$;
    return r.noConflict = function (b) {
        return a.$ === r && (a.$ = Wb), b && a.jQuery === r && (a.jQuery = Vb), r
    }, b || (a.jQuery = a.$ = r), r
});

// https://github.com/frankieroberto/accordion

function Accordion(element) {

  // First do feature detection for required API methods
  if (
    document.querySelectorAll &&
    window.NodeList &&
    'classList' in document.body
  ) {

    this.element = element
    this.sections = []
    this.setup()

  }

}

function AccordionSection(element, accordion) {
  this.element = element
  this.accordion = accordion
  this.setup()
}

Accordion.prototype.setup = function() {

  var accordion_sections = this.element.querySelectorAll('.accordion-section')

  var accordion = this

  for (var i = accordion_sections.length - 1; i >= 0; i--) {
     accordion.sections.push(new AccordionSection(accordion_sections[i], accordion))
  };

  var accordion_controls = document.createElement('div')
  accordion_controls.setAttribute('class', 'accordion-controls')

  var open_or_close_all_button = document.createElement('button')
  open_or_close_all_button.textContent = 'Open all'
  open_or_close_all_button.setAttribute('class', 'accordion-expand-all')
  open_or_close_all_button.setAttribute('aria-expanded', 'false')
  open_or_close_all_button.setAttribute('type', 'button')

  open_or_close_all_button.addEventListener('click', this.openOrCloseAll.bind(this))

  accordion_controls.appendChild(open_or_close_all_button)

  this.element.insertBefore(accordion_controls, this.element.firstChild)
  this.element.classList.add('with-js')
}

Accordion.prototype.openOrCloseAll = function(event) {

  var open_or_close_all_button = event.target
  var now_expanded = !(open_or_close_all_button.getAttribute('aria-expanded') == 'true')

  for (var i = this.sections.length - 1; i >= 0; i--) {
    this.sections[i].setExpanded(now_expanded)
  };

  this.setOpenCloseButtonExpanded(now_expanded)

}


Accordion.prototype.setOpenCloseButtonExpanded = function(expanded) {

  var open_or_close_all_button = this.element.querySelector('.accordion-expand-all')

  var new_button_text = expanded ? "Close all" : "Open all"
  open_or_close_all_button.setAttribute('aria-expanded', expanded)
  open_or_close_all_button.textContent = new_button_text

}

Accordion.prototype.updateOpenAll = function() {

  var sectionsCount = this.sections.length

  var openSectionsCount = 0

  for (var i = this.sections.length - 1; i >= 0; i--) {
    if (this.sections[i].expanded()) {
      openSectionsCount += 1
    }
  };

  if (sectionsCount == openSectionsCount) {
    this.setOpenCloseButtonExpanded(true)
  } else {
    this.setOpenCloseButtonExpanded(false)
  }

}

AccordionSection.prototype.setup = function() {

  var sectionExpanded = this.element.classList.contains('accordion-section--expanded')

  this.element.setAttribute('aria-expanded', sectionExpanded)

  var header = this.element.querySelector('.accordion-section-header')
  header.addEventListener('click', this.toggleExpanded.bind(this))
  header.addEventListener('keypress', this.keyPressed.bind(this))
  header.setAttribute('tabindex', '0')
  header.setAttribute('role', 'button')

  var icon = document.createElement('span')
  icon.setAttribute('class', 'icon')

  header.appendChild(icon)

  /* Remove this class now, as the `aria-expanded` attribute is being used
       to store expanded state instead. */
  if (sectionExpanded) {
    this.element.classList.remove('accordion-section--expanded');
  }

}

AccordionSection.prototype.toggleExpanded = function(){
  var expanded = (this.element.getAttribute('aria-expanded') == 'true')

  this.setExpanded(!expanded)
  this.accordion.updateOpenAll()
}

AccordionSection.prototype.keyPressed = function(event) {

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    this.toggleExpanded();
  }
}

AccordionSection.prototype.expanded = function() {
  return (this.element.getAttribute('aria-expanded') == 'true')
}

AccordionSection.prototype.setExpanded = function(expanded) {
  this.element.setAttribute('aria-expanded', expanded)

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.element.className = this.element.className

}

;(function () {
    'use strict'
    var root = this
    if (typeof root.GOVUK === 'undefined') {
        root.GOVUK = {}
    }

    /*
      Cookie methods
      ==============
      Usage:
        Setting a cookie:
        GOVUK.cookie('hobnob', 'tasty', { days: 30 });
        Reading a cookie:
        GOVUK.cookie('hobnob');
        Deleting a cookie:
        GOVUK.cookie('hobnob', null);
    */
    root.GOVUK.cookie = function (name, value, options) {
        if (typeof value !== 'undefined') {
            if (value === false || value === null) {
                return root.GOVUK.setCookie(name, '', {
                    days: -1
                })
            } else {
                return root.GOVUK.setCookie(name, value, options)
            }
        } else {
            return root.GOVUK.getCookie(name)
        }
    }
    root.GOVUK.setCookie = function (name, value, options) {
        if (typeof options === 'undefined') {
            options = {}
        }
        var cookieString = name + '=' + value + '; path=/'
        if (options.days) {
            var date = new Date()
            date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
            cookieString = cookieString + '; expires=' + date.toGMTString()
        }
        if (document.location.protocol === 'https:') {
            cookieString = cookieString + '; Secure'
        }
        document.cookie = cookieString
    }
    root.GOVUK.getCookie = function (name) {
        var nameEQ = name + '='
        var cookies = document.cookie.split(';')
        for (var i = 0, len = cookies.length; i < len; i++) {
            var cookie = cookies[i]
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length)
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length))
            }
        }
        return null
    }
    root.GOVUK.addCookieMessage = function () {
        var message = document.getElementsByClassName('js-cookie-banner')[0]
        var hasCookieMessage = (message && root.GOVUK.cookie('seen_cookie_message') === null)

        if (hasCookieMessage) {
            message.style.display = 'block'
            root.GOVUK.cookie('seen_cookie_message', 'yes', {
                days: 28
            })
        }
    }
    // add cookie message
    if (root.GOVUK && root.GOVUK.addCookieMessage) {
        root.GOVUK.addCookieMessage()
    }
}).call(this)

// Toggle element visibility
var toggle = function (elem) {
  elem.classList.toggle('is-visible');
};

// Listen for click events
document.addEventListener('click', function (event) {

  // Make sure clicked element is our toggle
  if (!event.target.classList.contains('js-toggle')) return;

  // Add is-toggled to anchor to change arrow direction
  event.target.classList.toggle('is-toggled');

  // Prevent default link behavior
  event.preventDefault();

  // Get the content
  var content = document.querySelector(event.target.dataset.target);
  if (!content) return;

  // Toggle the content
  toggle(content);

  // Set aira expanded on clicked element
  if (content.classList.contains('is-visible')) {
    event.target.setAttribute("aria-expanded", "true");
  } else {
    event.target.setAttribute("aria-expanded", "false");
  }
}, false);

/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define("typeahead.js", ["jquery"], function (a0) {
            return factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(this, function ($) {
    var _ = function () {
        "use strict";
        return {
            isMsie: function () {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function (str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function (str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function (obj) {
                return typeof obj === "string";
            },
            isNumber: function (obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function (obj) {
                return typeof obj === "undefined";
            },
            isElement: function (obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isJQuery: function (obj) {
                return obj instanceof $;
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function (collection, cb) {
                $.each(collection, reverseArgs);

                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function (obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function (key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function (obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function (key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            identity: function (x) {
                return x;
            },
            clone: function (obj) {
                return $.extend(true, {}, obj);
            },
            getIdGenerator: function () {
                var counter = 0;
                return function () {
                    return counter++;
                };
            },
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;

                function template() {
                    return String(obj);
                }
            },
            defer: function (fn) {
                setTimeout(fn, 0);
            },
            debounce: function (func, wait, immediate) {
                var timeout, result;
                return function () {
                    var context = this,
                        args = arguments,
                        later, callNow;
                    later = function () {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function (func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function () {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function () {
                    var now = new Date(),
                        remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            stringify: function (val) {
                return _.isString(val) ? val : JSON.stringify(val);
            },
            noop: function () {}
        };
    }();
    var WWW = function () {
        "use strict";
        var defaultClassNames = {
            wrapper: "twitter-typeahead",
            input: "tt-input",
            hint: "tt-hint",
            menu: "tt-menu",
            dataset: "tt-dataset",
            suggestion: "tt-suggestion",
            selectable: "tt-selectable",
            empty: "tt-empty",
            open: "tt-open",
            cursor: "tt-cursor",
            highlight: "tt-highlight"
        };
        return build;

        function build(o) {
            var www, classes;
            classes = _.mixin({}, defaultClassNames, o);
            www = {
                css: buildCss(),
                classes: classes,
                html: buildHtml(classes),
                selectors: buildSelectors(classes)
            };
            return {
                css: www.css,
                html: www.html,
                classes: www.classes,
                selectors: www.selectors,
                mixin: function (o) {
                    _.mixin(o, www);
                }
            };
        }

        function buildHtml(c) {
            return {
                wrapper: '<span class="' + c.wrapper + '"></span>',
                menu: '<div class="' + c.menu + '"></div>'
            };
        }

        function buildSelectors(classes) {
            var selectors = {};
            _.each(classes, function (v, k) {
                selectors[k] = "." + v;
            });
            return selectors;
        }

        function buildCss() {
            var css = {
                wrapper: {
                    position: "relative",
                    display: "inline-block"
                },
                hint: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    borderColor: "transparent",
                    boxShadow: "none",
                    opacity: "1"
                },
                input: {
                    position: "relative",
                    verticalAlign: "top",
                    backgroundColor: "transparent"
                },
                inputWithNoHint: {
                    position: "relative",
                    verticalAlign: "top"
                },
                menu: {
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    zIndex: "100",
                    display: "none"
                },
                ltr: {
                    left: "0",
                    right: "auto"
                },
                rtl: {
                    left: "auto",
                    right: " 0"
                }
            };
            if (_.isMsie()) {
                _.mixin(css.input, {
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                });
            }
            return css;
        }
    }();
    var EventBus = function () {
        "use strict";
        var namespace, deprecationMap;
        namespace = "typeahead:";
        deprecationMap = {
            render: "rendered",
            cursorchange: "cursorchanged",
            select: "selected",
            autocomplete: "autocompleted"
        };

        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            _trigger: function (type, args) {
                var $e;
                $e = $.Event(namespace + type);
                (args = args || []).unshift($e);
                this.$el.trigger.apply(this.$el, args);
                return $e;
            },
            before: function (type) {
                var args, $e;
                args = [].slice.call(arguments, 1);
                $e = this._trigger("before" + type, args);
                return $e.isDefaultPrevented();
            },
            trigger: function (type) {
                var deprecatedType;
                this._trigger(type, [].slice.call(arguments, 1));
                if (deprecatedType = deprecationMap[type]) {
                    this._trigger(deprecatedType, [].slice.call(arguments, 1));
                }
            }
        });
        return EventBus;
    }();
    var EventEmitter = function () {
        "use strict";
        var splitter = /\s+/,
            nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };

        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }

        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }

        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }

        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }

        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }

        function getFlush(callbacks, context, args) {
            return flush;

            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }

        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function () {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function () {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }

        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function () {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function (doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [o.pattern];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);

            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }

            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };

        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [],
                regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function () {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };

        function Input(o, www) {
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            www.mixin(this);
            this.$hint = $(o.hint);
            this.$input = $(o.input);
            this.query = this.$input.val();
            this.queryWhenFocused = this.hasFocus() ? this.query : null;
            this.$overflowHelper = buildOverflowHelper(this.$input);
            this._checkLanguageDirection();
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
        }
        Input.normalizeQuery = function (str) {
            return _.toStr(str).replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.queryWhenFocused = this.query;
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._setQuery(this.getInputValue());
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault;
                switch (keyName) {
                    case "up":
                    case "down":
                        preventDefault = !withModifier($e);
                        break;

                    default:
                        preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                    case "tab":
                        trigger = !withModifier($e);
                        break;

                    default:
                        trigger = true;
                }
                return trigger;
            },
            _checkLanguageDirection: function checkLanguageDirection() {
                var dir = (this.$input.css("direction") || "ltr").toLowerCase();
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.$hint.attr("dir", dir);
                    this.trigger("langDirChanged", dir);
                }
            },
            _setQuery: function setQuery(val, silent) {
                var areEquivalent, hasDifferentWhitespace;
                areEquivalent = areQueriesEquivalent(val, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== val.length : false;
                this.query = val;
                if (!silent && !areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (!silent && hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            bind: function () {
                var that = this,
                    onBlur, onFocus, onKeydown, onInput;
                onBlur = _.bind(this._onBlur, this);
                onFocus = _.bind(this._onFocus, this);
                onKeydown = _.bind(this._onKeydown, this);
                onInput = _.bind(this._onInput, this);
                this.$input.on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
                if (!_.isMsie() || _.isMsie() > 9) {
                    this.$input.on("input.tt", onInput);
                } else {
                    this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function ($e) {
                        if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                            return;
                        }
                        _.defer(_.bind(that._onInput, that, $e));
                    });
                }
                return this;
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getLangDir: function getLangDir() {
                return this.dir;
            },
            getQuery: function getQuery() {
                return this.query || "";
            },
            setQuery: function setQuery(val, silent) {
                this.setInputValue(val);
                this._setQuery(val, silent);
            },
            hasQueryChangedSinceLastFocus: function hasQueryChangedSinceLastFocus() {
                return this.query !== this.queryWhenFocused;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value) {
                this.$input.val(value);
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            hasFocus: function hasFocus() {
                return this.$input.is(":focus");
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function () {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$overflowHelper.remove();
                this.$hint = this.$input = this.$overflowHelper = $("<div>");
            }
        });
        return Input;

        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }

        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }

        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function () {
        "use strict";
        var keys, nameGenerator;
        keys = {
            val: "tt-selectable-display",
            obj: "tt-selectable-object"
        };
        nameGenerator = _.getIdGenerator();

        function Dataset(o, www) {
            o = o || {};
            o.templates = o.templates || {};
            o.templates.notFound = o.templates.notFound || o.templates.empty;
            if (!o.source) {
                $.error("missing source");
            }
            if (!o.node) {
                $.error("missing node");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            www.mixin(this);
            this.highlight = !!o.highlight;
            this.name = o.name || nameGenerator();
            this.limit = o.limit || 5;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.source = o.source.__ttAdapter ? o.source.__ttAdapter() : o.source;
            this.async = _.isUndefined(o.async) ? this.source.length > 2 : !!o.async;
            this._resetLastSuggestion();
            this.$el = $(o.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name);
        }
        Dataset.extractData = function extractData(el) {
            var $el = $(el);
            if ($el.data(keys.obj)) {
                return {
                    val: $el.data(keys.val) || "",
                    obj: $el.data(keys.obj) || null
                };
            }
            return null;
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _overwrite: function overwrite(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (this.async && this.templates.pending) {
                    this._renderPending(query);
                } else if (!this.async && this.templates.notFound) {
                    this._renderNotFound(query);
                } else {
                    this._empty();
                }
                this.trigger("rendered", this.name, suggestions, false);
            },
            _append: function append(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length && this.$lastSuggestion.length) {
                    this._appendSuggestions(query, suggestions);
                } else if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (!this.$lastSuggestion.length && this.templates.notFound) {
                    this._renderNotFound(query);
                }
                this.trigger("rendered", this.name, suggestions, true);
            },
            _renderSuggestions: function renderSuggestions(query, suggestions) {
                var $fragment;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                this.$lastSuggestion = $fragment.children().last();
                this.$el.html($fragment).prepend(this._getHeader(query, suggestions)).append(this._getFooter(query, suggestions));
            },
            _appendSuggestions: function appendSuggestions(query, suggestions) {
                var $fragment, $lastSuggestion;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                $lastSuggestion = $fragment.children().last();
                this.$lastSuggestion.after($fragment);
                this.$lastSuggestion = $lastSuggestion;
            },
            _renderPending: function renderPending(query) {
                var template = this.templates.pending;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _renderNotFound: function renderNotFound(query) {
                var template = this.templates.notFound;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _empty: function empty() {
                this.$el.empty();
                this._resetLastSuggestion();
            },
            _getSuggestionsFragment: function getSuggestionsFragment(query, suggestions) {
                var that = this,
                    fragment;
                fragment = document.createDocumentFragment();
                _.each(suggestions, function getSuggestionNode(suggestion) {
                    var $el, context;
                    context = that._injectQuery(query, suggestion);
                    $el = $(that.templates.suggestion(context)).data(keys.obj, suggestion).data(keys.val, that.displayFn(suggestion)).addClass(that.classes.suggestion + " " + that.classes.selectable);
                    fragment.appendChild($el[0]);
                });
                this.highlight && highlight({
                    className: this.classes.highlight,
                    node: fragment,
                    pattern: query
                });
                return $(fragment);
            },
            _getFooter: function getFooter(query, suggestions) {
                return this.templates.footer ? this.templates.footer({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _getHeader: function getHeader(query, suggestions) {
                return this.templates.header ? this.templates.header({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _resetLastSuggestion: function resetLastSuggestion() {
                this.$lastSuggestion = $();
            },
            _injectQuery: function injectQuery(query, obj) {
                return _.isObject(obj) ? _.mixin({
                    _query: query
                }, obj) : obj;
            },
            update: function update(query) {
                var that = this,
                    canceled = false,
                    syncCalled = false,
                    rendered = 0;
                this.cancel();
                this.cancel = function cancel() {
                    canceled = true;
                    that.cancel = $.noop;
                    that.async && that.trigger("asyncCanceled", query);
                };
                this.source(query, sync, async);
                !syncCalled && sync([]);

                function sync(suggestions) {
                    if (syncCalled) {
                        return;
                    }
                    syncCalled = true;
                    suggestions = (suggestions || []).slice(0, that.limit);
                    rendered = suggestions.length;
                    that._overwrite(query, suggestions);
                    if (rendered < that.limit && that.async) {
                        that.trigger("asyncRequested", query);
                    }
                }

                function async (suggestions) {
                    suggestions = suggestions || [];
                    if (!canceled && rendered < that.limit) {
                        that.cancel = $.noop;
                        rendered += suggestions.length;
                        that._append(query, suggestions.slice(0, that.limit - rendered));
                        that.async && that.trigger("asyncReceived", query);
                    }
                }
            },
            cancel: $.noop,
            clear: function clear() {
                this._empty();
                this.cancel();
                this.trigger("cleared");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = $("<div>");
            }
        });
        return Dataset;

        function getDisplayFn(display) {
            display = display || _.stringify;
            return _.isFunction(display) ? display : displayFn;

            function displayFn(obj) {
                return obj[display];
            }
        }

        function getTemplates(templates, displayFn) {
            return {
                notFound: templates.notFound && _.templatify(templates.notFound),
                pending: templates.pending && _.templatify(templates.pending),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };

            function suggestionTemplate(context) {
                return $("<div>").text(displayFn(context));
            }
        }

        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Menu = function () {
        "use strict";

        function Menu(o, www) {
            var that = this;
            o = o || {};
            if (!o.node) {
                $.error("node is required");
            }
            www.mixin(this);
            this.$node = $(o.node);
            this.query = null;
            this.datasets = _.map(o.datasets, initializeDataset);

            function initializeDataset(oDataset) {
                var node = that.$node.find(oDataset.node).first();
                oDataset.node = node.length ? node : $("<div>").appendTo(that.$node);
                return new Dataset(oDataset, www);
            }
        }
        _.mixin(Menu.prototype, EventEmitter, {
            _onSelectableClick: function onSelectableClick($e) {
                this.trigger("selectableClicked", $($e.currentTarget));
            },
            _onRendered: function onRendered(type, dataset, suggestions, async) {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetRendered", dataset, suggestions, async);
            },
            _onCleared: function onCleared() {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetCleared");
            },
            _propagate: function propagate() {
                this.trigger.apply(this, arguments);
            },
            _allDatasetsEmpty: function allDatasetsEmpty() {
                return _.every(this.datasets, isDatasetEmpty);

                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _getSelectables: function getSelectables() {
                return this.$node.find(this.selectors.selectable);
            },
            _removeCursor: function _removeCursor() {
                var $selectable = this.getActiveSelectable();
                $selectable && $selectable.removeClass(this.classes.cursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, nodeScrollTop, nodeHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                nodeScrollTop = this.$node.scrollTop();
                nodeHeight = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$node.scrollTop(nodeScrollTop + elTop);
                } else if (nodeHeight < elBottom) {
                    this.$node.scrollTop(nodeScrollTop + (elBottom - nodeHeight));
                }
            },
            bind: function () {
                var that = this,
                    onSelectableClick;
                onSelectableClick = _.bind(this._onSelectableClick, this);
                this.$node.on("click.tt", this.selectors.selectable, onSelectableClick);
                _.each(this.datasets, function (dataset) {
                    dataset.onSync("asyncRequested", that._propagate, that).onSync("asyncCanceled", that._propagate, that).onSync("asyncReceived", that._propagate, that).onSync("rendered", that._onRendered, that).onSync("cleared", that._onCleared, that);
                });
                return this;
            },
            isOpen: function isOpen() {
                return this.$node.hasClass(this.classes.open);
            },
            open: function open() {
                this.$node.addClass(this.classes.open);
            },
            close: function close() {
                this.$node.removeClass(this.classes.open);
                this._removeCursor();
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.attr("dir", dir);
            },
            selectableRelativeToCursor: function selectableRelativeToCursor(delta) {
                var $selectables, $oldCursor, oldIndex, newIndex;
                $oldCursor = this.getActiveSelectable();
                $selectables = this._getSelectables();
                oldIndex = $oldCursor ? $selectables.index($oldCursor) : -1;
                newIndex = oldIndex + delta;
                newIndex = (newIndex + 1) % ($selectables.length + 1) - 1;
                newIndex = newIndex < -1 ? $selectables.length - 1 : newIndex;
                return newIndex === -1 ? null : $selectables.eq(newIndex);
            },
            setCursor: function setCursor($selectable) {
                this._removeCursor();
                if ($selectable = $selectable && $selectable.first()) {
                    $selectable.addClass(this.classes.cursor);
                    this._ensureVisible($selectable);
                }
            },
            getSelectableData: function getSelectableData($el) {
                return $el && $el.length ? Dataset.extractData($el) : null;
            },
            getActiveSelectable: function getActiveSelectable() {
                var $selectable = this._getSelectables().filter(this.selectors.cursor).first();
                return $selectable.length ? $selectable : null;
            },
            getTopSelectable: function getTopSelectable() {
                var $selectable = this._getSelectables().first();
                return $selectable.length ? $selectable : null;
            },
            update: function update(query) {
                var isValidUpdate = query !== this.query;
                if (isValidUpdate) {
                    this.query = query;
                    _.each(this.datasets, updateDataset);
                }
                return isValidUpdate;

                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.query = null;
                this.$node.addClass(this.classes.empty);

                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            destroy: function destroy() {
                this.$node.off(".tt");
                this.$node = $("<div>");
                _.each(this.datasets, destroyDataset);

                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Menu;
    }();
    var DefaultMenu = function () {
        "use strict";
        var s = Menu.prototype;

        function DefaultMenu() {
            Menu.apply(this, [].slice.call(arguments, 0));
        }
        _.mixin(DefaultMenu.prototype, Menu.prototype, {
            open: function open() {
                !this._allDatasetsEmpty() && this._show();
                return s.open.apply(this, [].slice.call(arguments, 0));
            },
            close: function close() {
                this._hide();
                return s.close.apply(this, [].slice.call(arguments, 0));
            },
            _onRendered: function onRendered() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onRendered.apply(this, [].slice.call(arguments, 0));
            },
            _onCleared: function onCleared() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onCleared.apply(this, [].slice.call(arguments, 0));
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
                return s.setLanguageDirection.apply(this, [].slice.call(arguments, 0));
            },
            _hide: function hide() {
                this.$node.hide();
            },
            _show: function show() {
                this.$node.css("display", "block");
            }
        });
        return DefaultMenu;
    }();
    var Typeahead = function () {
        "use strict";

        function Typeahead(o, www) {
            var onFocused, onBlurred, onEnterKeyed, onTabKeyed, onEscKeyed, onUpKeyed, onDownKeyed, onLeftKeyed, onRightKeyed, onQueryChanged, onWhitespaceChanged;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            if (!o.menu) {
                $.error("missing menu");
            }
            if (!o.eventBus) {
                $.error("missing event bus");
            }
            www.mixin(this);
            this.eventBus = o.eventBus;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.input = o.input;
            this.menu = o.menu;
            this.enabled = true;
            this.active = false;
            this.input.hasFocus() && this.activate();
            this.dir = this.input.getLangDir();
            this._hacks();
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this);
            onFocused = c(this, "activate", "open", "_onFocused");
            onBlurred = c(this, "deactivate", "_onBlurred");
            onEnterKeyed = c(this, "isActive", "isOpen", "_onEnterKeyed");
            onTabKeyed = c(this, "isActive", "isOpen", "_onTabKeyed");
            onEscKeyed = c(this, "isActive", "_onEscKeyed");
            onUpKeyed = c(this, "isActive", "open", "_onUpKeyed");
            onDownKeyed = c(this, "isActive", "open", "_onDownKeyed");
            onLeftKeyed = c(this, "isActive", "isOpen", "_onLeftKeyed");
            onRightKeyed = c(this, "isActive", "isOpen", "_onRightKeyed");
            onQueryChanged = c(this, "_openIfActive", "_onQueryChanged");
            onWhitespaceChanged = c(this, "_openIfActive", "_onWhitespaceChanged");
            this.input.bind().onSync("focused", onFocused, this).onSync("blurred", onBlurred, this).onSync("enterKeyed", onEnterKeyed, this).onSync("tabKeyed", onTabKeyed, this).onSync("escKeyed", onEscKeyed, this).onSync("upKeyed", onUpKeyed, this).onSync("downKeyed", onDownKeyed, this).onSync("leftKeyed", onLeftKeyed, this).onSync("rightKeyed", onRightKeyed, this).onSync("queryChanged", onQueryChanged, this).onSync("whitespaceChanged", onWhitespaceChanged, this).onSync("langDirChanged", this._onLangDirChanged, this);
        }
        _.mixin(Typeahead.prototype, {
            _hacks: function hacks() {
                var $input, $menu;
                $input = this.input.$input || $("<div>");
                $menu = this.menu.$node || $("<div>");
                $input.on("blur.tt", function ($e) {
                    var active, isActive, hasActive;
                    active = document.activeElement;
                    isActive = $menu.is(active);
                    hasActive = $menu.has(active).length > 0;
                    if (_.isMsie() && (isActive || hasActive)) {
                        $e.preventDefault();
                        $e.stopImmediatePropagation();
                        _.defer(function () {
                            $input.focus();
                        });
                    }
                });
                $menu.on("mousedown.tt", function ($e) {
                    $e.preventDefault();
                });
            },
            _onSelectableClicked: function onSelectableClicked(type, $el) {
                this.select($el);
            },
            _onDatasetCleared: function onDatasetCleared() {
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered(type, dataset, suggestions, async) {
                this._updateHint();
                this.eventBus.trigger("render", suggestions, async, dataset);
            },
            _onAsyncRequested: function onAsyncRequested(type, dataset, query) {
                this.eventBus.trigger("asyncrequest", query, dataset);
            },
            _onAsyncCanceled: function onAsyncCanceled(type, dataset, query) {
                this.eventBus.trigger("asynccancel", query, dataset);
            },
            _onAsyncReceived: function onAsyncReceived(type, dataset, query) {
                this.eventBus.trigger("asyncreceive", query, dataset);
            },
            _onFocused: function onFocused() {
                this._minLengthMet() && this.menu.update(this.input.getQuery());
            },
            _onBlurred: function onBlurred() {
                if (this.input.hasQueryChangedSinceLastFocus()) {
                    this.eventBus.trigger("change", this.input.getQuery());
                }
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                } else if ($selectable = this.menu.getTopSelectable()) {
                    this.autocomplete($selectable) && $e.preventDefault();
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.close();
            },
            _onUpKeyed: function onUpKeyed() {
                this.moveCursor(-1);
            },
            _onDownKeyed: function onDownKeyed() {
                this.moveCursor(+1);
            },
            _onLeftKeyed: function onLeftKeyed() {
                if (this.dir === "rtl" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onRightKeyed: function onRightKeyed() {
                if (this.dir === "ltr" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this._minLengthMet(query) ? this.menu.update(query) : this.menu.empty();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
            },
            _onLangDirChanged: function onLangDirChanged(e, dir) {
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.menu.setLanguageDirection(dir);
                }
            },
            _openIfActive: function openIfActive() {
                this.isActive() && this.open();
            },
            _minLengthMet: function minLengthMet(query) {
                query = _.isString(query) ? query : this.input.getQuery() || "";
                return query.length >= this.minLength;
            },
            _updateHint: function updateHint() {
                var $selectable, data, val, query, escapedQuery, frontMatchRegEx, match;
                $selectable = this.menu.getTopSelectable();
                data = this.menu.getSelectableData($selectable);
                val = this.input.getInputValue();
                if (data && !_.isBlankString(val) && !this.input.hasOverflow()) {
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(data.val);
                    match && this.input.setHint(val + match[1]);
                } else {
                    this.input.clearHint();
                }
            },
            isEnabled: function isEnabled() {
                return this.enabled;
            },
            enable: function enable() {
                this.enabled = true;
            },
            disable: function disable() {
                this.enabled = false;
            },
            isActive: function isActive() {
                return this.active;
            },
            activate: function activate() {
                if (this.isActive()) {
                    return true;
                } else if (!this.isEnabled() || this.eventBus.before("active")) {
                    return false;
                } else {
                    this.active = true;
                    this.eventBus.trigger("active");
                    return true;
                }
            },
            deactivate: function deactivate() {
                if (!this.isActive()) {
                    return true;
                } else if (this.eventBus.before("idle")) {
                    return false;
                } else {
                    this.active = false;
                    this.close();
                    this.eventBus.trigger("idle");
                    return true;
                }
            },
            isOpen: function isOpen() {
                return this.menu.isOpen();
            },
            open: function open() {
                if (!this.isOpen() && !this.eventBus.before("open")) {
                    this.menu.open();
                    this._updateHint();
                    this.eventBus.trigger("open");
                }
                return this.isOpen();
            },
            close: function close() {
                if (this.isOpen() && !this.eventBus.before("close")) {
                    this.menu.close();
                    this.input.clearHint();
                    this.input.resetInputValue();
                    this.eventBus.trigger("close");
                }
                return !this.isOpen();
            },
            setVal: function setVal(val) {
                this.input.setQuery(_.toStr(val));
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            select: function select($selectable) {
                var data = this.menu.getSelectableData($selectable);
                if (data && !this.eventBus.before("select", data.obj)) {
                    this.input.setQuery(data.val, true);
                    this.eventBus.trigger("select", data.obj);
                    this.close();
                    return true;
                }
                return false;
            },
            autocomplete: function autocomplete($selectable) {
                var query, data, isValid;
                query = this.input.getQuery();
                data = this.menu.getSelectableData($selectable);
                isValid = data && query !== data.val;
                if (isValid && !this.eventBus.before("autocomplete", data.obj)) {
                    this.input.setQuery(data.val);
                    this.eventBus.trigger("autocomplete", data.obj);
                    return true;
                }
                return false;
            },
            moveCursor: function moveCursor(delta) {
                var query, $candidate, data, payload, cancelMove;
                query = this.input.getQuery();
                $candidate = this.menu.selectableRelativeToCursor(delta);
                data = this.menu.getSelectableData($candidate);
                payload = data ? data.obj : null;
                cancelMove = this._minLengthMet() && this.menu.update(query);
                if (!cancelMove && !this.eventBus.before("cursorchange", payload)) {
                    this.menu.setCursor($candidate);
                    if (data) {
                        this.input.setInputValue(data.val);
                    } else {
                        this.input.resetInputValue();
                        this._updateHint();
                    }
                    this.eventBus.trigger("cursorchange", payload);
                    return true;
                }
                return false;
            },
            destroy: function destroy() {
                this.input.destroy();
                this.menu.destroy();
            }
        });
        return Typeahead;

        function c(ctx) {
            var methods = [].slice.call(arguments, 1);
            return function () {
                var args = [].slice.call(arguments);
                _.each(methods, function (method) {
                    return ctx[method].apply(ctx, args);
                });
            };
        }
    }();
    (function () {
        "use strict";
        var old, keys, methods;
        old = $.fn.typeahead;
        keys = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        };
        methods = {
            initialize: function initialize(o, datasets) {
                var www;
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                www = WWW(o.classNames);
                return this.each(attach);

                function attach() {
                    var $input, $wrapper, $hint, $menu, defaultHint, defaultMenu, eventBus, input, menu, typeahead, MenuConstructor;
                    _.each(datasets, function (d) {
                        d.highlight = !!o.highlight;
                    });
                    $input = $(this);
                    $wrapper = $(www.html.wrapper);
                    $hint = $elOrNull(o.hint);
                    $menu = $elOrNull(o.menu);
                    defaultHint = o.hint !== false && !$hint;
                    defaultMenu = o.menu !== false && !$menu;
                    defaultHint && ($hint = buildHintFromInput($input, www));
                    defaultMenu && ($menu = $(www.html.menu).css(www.css.menu));
                    $hint && $hint.val("");
                    $input = prepInput($input, www);
                    if (defaultHint || defaultMenu) {
                        $wrapper.css(www.css.wrapper);
                        $input.css(defaultHint ? www.css.input : www.css.inputWithNoHint);
                        $input.wrap($wrapper).parent().prepend(defaultHint ? $hint : null).append(defaultMenu ? $menu : null);
                    }
                    MenuConstructor = defaultMenu ? DefaultMenu : Menu;
                    eventBus = new EventBus({
                        el: $input
                    });
                    input = new Input({
                        hint: $hint,
                        input: $input
                    }, www);
                    menu = new MenuConstructor({
                        node: $menu,
                        datasets: datasets
                    }, www);
                    typeahead = new Typeahead({
                        input: input,
                        menu: menu,
                        eventBus: eventBus,
                        minLength: o.minLength
                    }, www);
                    $input.data(keys.www, www);
                    $input.data(keys.typeahead, typeahead);
                }
            },
            isEnabled: function isEnabled() {
                var enabled;
                ttEach(this.first(), function (t) {
                    enabled = t.isEnabled();
                });
                return enabled;
            },
            enable: function enable() {
                ttEach(this, function (t) {
                    t.enable();
                });
                return this;
            },
            disable: function disable() {
                ttEach(this, function (t) {
                    t.disable();
                });
                return this;
            },
            isActive: function isActive() {
                var active;
                ttEach(this.first(), function (t) {
                    active = t.isActive();
                });
                return active;
            },
            activate: function activate() {
                ttEach(this, function (t) {
                    t.activate();
                });
                return this;
            },
            deactivate: function deactivate() {
                ttEach(this, function (t) {
                    t.deactivate();
                });
                return this;
            },
            isOpen: function isOpen() {
                var open;
                ttEach(this.first(), function (t) {
                    open = t.isOpen();
                });
                return open;
            },
            open: function open() {
                ttEach(this, function (t) {
                    t.open();
                });
                return this;
            },
            close: function close() {
                ttEach(this, function (t) {
                    t.close();
                });
                return this;
            },
            select: function select(el) {
                var success = false,
                    $el = $(el);
                ttEach(this.first(), function (t) {
                    success = t.select($el);
                });
                return success;
            },
            autocomplete: function autocomplete(el) {
                var success = false,
                    $el = $(el);
                ttEach(this.first(), function (t) {
                    success = t.autocomplete($el);
                });
                return success;
            },
            moveCursor: function moveCursoe(delta) {
                var success = false;
                ttEach(this.first(), function (t) {
                    success = t.moveCursor(delta);
                });
                return success;
            },
            val: function val(newVal) {
                var query;
                if (!arguments.length) {
                    ttEach(this.first(), function (t) {
                        query = t.getVal();
                    });
                    return query;
                } else {
                    ttEach(this, function (t) {
                        t.setVal(newVal);
                    });
                    return this;
                }
            },
            destroy: function destroy() {
                ttEach(this, function (typeahead, $input) {
                    revert($input);
                    typeahead.destroy();
                });
                return this;
            }
        };
        $.fn.typeahead = function (method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };

        function ttEach($els, fn) {
            $els.each(function () {
                var $input = $(this),
                    typeahead;
                (typeahead = $input.data(keys.typeahead)) && fn(typeahead, $input);
            });
        }

        function buildHintFromInput($input, www) {
            return $input.clone().addClass(www.classes.hint).removeData().css(www.css.hint).css(getBackgroundStyles($input)).prop("readonly", true).removeAttr("id name placeholder required").attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
        }

        function prepInput($input, www) {
            $input.data(keys.attrs, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass(www.classes.input).attr({
                autocomplete: "off",
                spellcheck: false
            });
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input;
        }

        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }

        function revert($input) {
            var www, $wrapper;
            www = $input.data(keys.www);
            $wrapper = $input.parent().filter(www.selectors.wrapper);
            _.each($input.data(keys.attrs), function (val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.removeData(keys.typeahead).removeData(keys.www).removeData(keys.attr).removeClass(www.classes.input);
            if ($wrapper.length) {
                $input.detach().insertAfter($wrapper);
                $wrapper.remove();
            }
        }

        function $elOrNull(obj) {
            var isValid, $el;
            isValid = _.isJQuery(obj) || _.isElement(obj);
            $el = isValid ? $(obj).first() : [];
            return $el.length ? $el : null;
        }
    })();
});

if (!!$) {
  $(document).ready(function () {
    // Turn off jQuery animation
    jQuery.fx.off = true

    $('.typeahead').each(function () {
      var $this = $(this);
      var url = $this.data("url");
      $this.typeahead({
        minLength: 3,
        highlight: true
      }, {
        name: url.replace(/\//g, "-"),
        source: function (query, cbSync, cbAsync) {
          $.get(url, {
            query: query
          }, function (res) {
              cbAsync(res);
          });
        },
        limit: 10
      });
    });
  })
}

if ('addEventListener' in document && document.querySelectorAll) {
  document.addEventListener('DOMContentLoaded', function () {
    var accordions = document.querySelectorAll('.accordion')
    for (var i = accordions.length - 1; i >= 0; i--) {
      new Accordion(accordions[i])
    };
  })
}

window.GOVUKFrontend.initAll()

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsbC5qcyIsImpxdWVyeS0zLjIuMS5taW4uanMiLCJhY2NvcmRpb24uanMiLCJjb29raWUtYmFyLmpzIiwidG9nZ2xlLmpzIiwidHlwZWFoZWFkLmpxdWVyeS5qcyIsImFwcGxpY2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMXJEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZSgnR09WVUtGcm9udGVuZCcsIFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuR09WVUtGcm9udGVuZCA9IHt9KSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRPRE86IElkZWFsbHkgdGhpcyB3b3VsZCBiZSBhIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoIHBvbHlmaWxsXG4gKiBUaGlzIHNlZW1zIHRvIGZhaWwgaW4gSUU4LCByZXF1aXJlcyBtb3JlIGludmVzdGlnYXRpb24uXG4gKiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pbWFnaXRhbWEvbm9kZWxpc3QtZm9yZWFjaC1wb2x5ZmlsbFxuICovXG5mdW5jdGlvbiBub2RlTGlzdEZvckVhY2ggKG5vZGVzLCBjYWxsYmFjaykge1xuICBpZiAod2luZG93Lk5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgcmV0dXJuIG5vZGVzLmZvckVhY2goY2FsbGJhY2spXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwod2luZG93LCBub2Rlc1tpXSwgaSwgbm9kZXMpO1xuICB9XG59XG5cbi8vIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgc3RyaW5nLCBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIHRoZSBjb21wb25lbnQgd2l0aG91dFxuLy8gVGhlbSBjb25mbGljdGluZyB3aXRoIGVhY2ggb3RoZXIuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3MlxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVJRCAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGlmICh0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGQgKz0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpOyAvLyB1c2UgaGlnaC1wcmVjaXNpb24gdGltZXIgaWYgYXZhaWxhYmxlXG4gIH1cbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpXG4gIH0pXG59XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL1dpbmRvdy9kZXRlY3QuanNcbnZhciBkZXRlY3QgPSAoJ1dpbmRvdycgaW4gdGhpcyk7XG5cbmlmIChkZXRlY3QpIHJldHVyblxuXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPVdpbmRvdyZmbGFncz1hbHdheXNcbmlmICgodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlID09PSBcInVuZGVmaW5lZFwiKSAmJiAodHlwZW9mIGltcG9ydFNjcmlwdHMgIT09IFwiZnVuY3Rpb25cIikpIHtcblx0KGZ1bmN0aW9uIChnbG9iYWwpIHtcblx0XHRpZiAoZ2xvYmFsLmNvbnN0cnVjdG9yKSB7XG5cdFx0XHRnbG9iYWwuV2luZG93ID0gZ2xvYmFsLmNvbnN0cnVjdG9yO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQoZ2xvYmFsLldpbmRvdyA9IGdsb2JhbC5jb25zdHJ1Y3RvciA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uIFdpbmRvdygpIHt9JykoKSkucHJvdG90eXBlID0gdGhpcztcblx0XHR9XG5cdH0odGhpcykpO1xufVxuXG59KVxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0RvY3VtZW50L2RldGVjdC5qc1xudmFyIGRldGVjdCA9IChcIkRvY3VtZW50XCIgaW4gdGhpcyk7XG5cbmlmIChkZXRlY3QpIHJldHVyblxuXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPURvY3VtZW50JmZsYWdzPWFsd2F5c1xuaWYgKCh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgPT09IFwidW5kZWZpbmVkXCIpICYmICh0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gXCJmdW5jdGlvblwiKSkge1xuXG5cdGlmICh0aGlzLkhUTUxEb2N1bWVudCkgeyAvLyBJRThcblxuXHRcdC8vIEhUTUxEb2N1bWVudCBpcyBhbiBleHRlbnNpb24gb2YgRG9jdW1lbnQuICBJZiB0aGUgYnJvd3NlciBoYXMgSFRNTERvY3VtZW50IGJ1dCBub3QgRG9jdW1lbnQsIHRoZSBmb3JtZXIgd2lsbCBzdWZmaWNlIGFzIGFuIGFsaWFzIGZvciB0aGUgbGF0dGVyLlxuXHRcdHRoaXMuRG9jdW1lbnQgPSB0aGlzLkhUTUxEb2N1bWVudDtcblxuXHR9IGVsc2Uge1xuXG5cdFx0Ly8gQ3JlYXRlIGFuIGVtcHR5IGZ1bmN0aW9uIHRvIGFjdCBhcyB0aGUgbWlzc2luZyBjb25zdHJ1Y3RvciBmb3IgdGhlIGRvY3VtZW50IG9iamVjdCwgYXR0YWNoIHRoZSBkb2N1bWVudCBvYmplY3QgYXMgaXRzIHByb3RvdHlwZS4gIFRoZSBmdW5jdGlvbiBuZWVkcyB0byBiZSBhbm9ueW1vdXMgZWxzZSBpdCBpcyBob2lzdGVkIGFuZCBjYXVzZXMgdGhlIGZlYXR1cmUgZGV0ZWN0IHRvIHByZW1hdHVyZWx5IHBhc3MsIHByZXZlbnRpbmcgdGhlIGFzc2lnbm1lbnRzIGJlbG93IGJlaW5nIG1hZGUuXG5cdFx0dGhpcy5Eb2N1bWVudCA9IHRoaXMuSFRNTERvY3VtZW50ID0gZG9jdW1lbnQuY29uc3RydWN0b3IgPSAobmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gRG9jdW1lbnQoKSB7fScpKCkpO1xuXHRcdHRoaXMuRG9jdW1lbnQucHJvdG90eXBlID0gZG9jdW1lbnQ7XG5cdH1cbn1cblxuXG59KVxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0VsZW1lbnQvZGV0ZWN0LmpzXG52YXIgZGV0ZWN0ID0gKCdFbGVtZW50JyBpbiB0aGlzICYmICdIVE1MRWxlbWVudCcgaW4gdGhpcyk7XG5cbmlmIChkZXRlY3QpIHJldHVyblxuXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUVsZW1lbnQmZmxhZ3M9YWx3YXlzXG4oZnVuY3Rpb24gKCkge1xuXG5cdC8vIElFOFxuXHRpZiAod2luZG93LkVsZW1lbnQgJiYgIXdpbmRvdy5IVE1MRWxlbWVudCkge1xuXHRcdHdpbmRvdy5IVE1MRWxlbWVudCA9IHdpbmRvdy5FbGVtZW50O1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIGNyZWF0ZSBFbGVtZW50IGNvbnN0cnVjdG9yXG5cdHdpbmRvdy5FbGVtZW50ID0gd2luZG93LkhUTUxFbGVtZW50ID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gRWxlbWVudCgpIHt9JykoKTtcblxuXHQvLyBnZW5lcmF0ZSBzYW5kYm94ZWQgaWZyYW1lXG5cdHZhciB2Ym9keSA9IGRvY3VtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSk7XG5cdHZhciBmcmFtZSA9IHZib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpKTtcblxuXHQvLyB1c2Ugc2FuZGJveGVkIGlmcmFtZSB0byByZXBsaWNhdGUgRWxlbWVudCBmdW5jdGlvbmFsaXR5XG5cdHZhciBmcmFtZURvY3VtZW50ID0gZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcblx0dmFyIHByb3RvdHlwZSA9IEVsZW1lbnQucHJvdG90eXBlID0gZnJhbWVEb2N1bWVudC5hcHBlbmRDaGlsZChmcmFtZURvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJyonKSk7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdC8vIHBvbHlmaWxsIEVsZW1lbnQucHJvdG90eXBlIG9uIGFuIGVsZW1lbnRcblx0dmFyIHNoaXYgPSBmdW5jdGlvbiAoZWxlbWVudCwgZGVlcCkge1xuXHRcdHZhclxuXHRcdGNoaWxkTm9kZXMgPSBlbGVtZW50LmNoaWxkTm9kZXMgfHwgW10sXG5cdFx0aW5kZXggPSAtMSxcblx0XHRrZXksIHZhbHVlLCBjaGlsZE5vZGU7XG5cblx0XHRpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtZW50LmNvbnN0cnVjdG9yICE9PSBFbGVtZW50KSB7XG5cdFx0XHRlbGVtZW50LmNvbnN0cnVjdG9yID0gRWxlbWVudDtcblxuXHRcdFx0Zm9yIChrZXkgaW4gY2FjaGUpIHtcblx0XHRcdFx0dmFsdWUgPSBjYWNoZVtrZXldO1xuXHRcdFx0XHRlbGVtZW50W2tleV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR3aGlsZSAoY2hpbGROb2RlID0gZGVlcCAmJiBjaGlsZE5vZGVzWysraW5kZXhdKSB7XG5cdFx0XHRzaGl2KGNoaWxkTm9kZSwgZGVlcCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH07XG5cblx0dmFyIGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJyonKTtcblx0dmFyIG5hdGl2ZUNyZWF0ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50O1xuXHR2YXIgaW50ZXJ2YWw7XG5cdHZhciBsb29wTGltaXQgPSAxMDA7XG5cblx0cHJvdG90eXBlLmF0dGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0dmFyXG5cdFx0cHJvcGVydHlOYW1lID0gZXZlbnQucHJvcGVydHlOYW1lLFxuXHRcdG5vblZhbHVlID0gIWNhY2hlLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSksXG5cdFx0bmV3VmFsdWUgPSBwcm90b3R5cGVbcHJvcGVydHlOYW1lXSxcblx0XHRvbGRWYWx1ZSA9IGNhY2hlW3Byb3BlcnR5TmFtZV0sXG5cdFx0aW5kZXggPSAtMSxcblx0XHRlbGVtZW50O1xuXG5cdFx0d2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50c1srK2luZGV4XSkge1xuXHRcdFx0aWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKG5vblZhbHVlIHx8IGVsZW1lbnRbcHJvcGVydHlOYW1lXSA9PT0gb2xkVmFsdWUpIHtcblx0XHRcdFx0XHRlbGVtZW50W3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNhY2hlW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcblx0fSk7XG5cblx0cHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRWxlbWVudDtcblxuXHRpZiAoIXByb3RvdHlwZS5oYXNBdHRyaWJ1dGUpIHtcblx0XHQvLyA8RWxlbWVudD4uaGFzQXR0cmlidXRlXG5cdFx0cHJvdG90eXBlLmhhc0F0dHJpYnV0ZSA9IGZ1bmN0aW9uIGhhc0F0dHJpYnV0ZShuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSkgIT09IG51bGw7XG5cdFx0fTtcblx0fVxuXG5cdC8vIEFwcGx5IEVsZW1lbnQgcHJvdG90eXBlIHRvIHRoZSBwcmUtZXhpc3RpbmcgRE9NIGFzIHNvb24gYXMgdGhlIGJvZHkgZWxlbWVudCBhcHBlYXJzLlxuXHRmdW5jdGlvbiBib2R5Q2hlY2soKSB7XG5cdFx0aWYgKCEobG9vcExpbWl0LS0pKSBjbGVhclRpbWVvdXQoaW50ZXJ2YWwpO1xuXHRcdGlmIChkb2N1bWVudC5ib2R5ICYmICFkb2N1bWVudC5ib2R5LnByb3RvdHlwZSAmJiAvKGNvbXBsZXRlfGludGVyYWN0aXZlKS8udGVzdChkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuXHRcdFx0c2hpdihkb2N1bWVudCwgdHJ1ZSk7XG5cdFx0XHRpZiAoaW50ZXJ2YWwgJiYgZG9jdW1lbnQuYm9keS5wcm90b3R5cGUpIGNsZWFyVGltZW91dChpbnRlcnZhbCk7XG5cdFx0XHRyZXR1cm4gKCEhZG9jdW1lbnQuYm9keS5wcm90b3R5cGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKCFib2R5Q2hlY2soKSkge1xuXHRcdGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGJvZHlDaGVjaztcblx0XHRpbnRlcnZhbCA9IHNldEludGVydmFsKGJvZHlDaGVjaywgMjUpO1xuXHR9XG5cblx0Ly8gQXBwbHkgdG8gYW55IG5ldyBlbGVtZW50cyBjcmVhdGVkIGFmdGVyIGxvYWRcblx0ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpIHtcblx0XHR2YXIgZWxlbWVudCA9IG5hdGl2ZUNyZWF0ZUVsZW1lbnQoU3RyaW5nKG5vZGVOYW1lKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRyZXR1cm4gc2hpdihlbGVtZW50KTtcblx0fTtcblxuXHQvLyByZW1vdmUgc2FuZGJveGVkIGlmcmFtZVxuXHRkb2N1bWVudC5yZW1vdmVDaGlsZCh2Ym9keSk7XG59KCkpO1xuXG59KVxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL09iamVjdC9kZWZpbmVQcm9wZXJ0eS9kZXRlY3QuanNcbnZhciBkZXRlY3QgPSAoXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcbiAgLy8gZm9yIHRoZSBmZWF0dXJlIHJlcXVpcmVzIHRoZSBhYmlsaXR5IHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIGFyYml0cmFyeSBvYmplY3RcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xuICBcdHRyeSB7XG4gIFx0XHR2YXIgYSA9IHt9O1xuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XG4gIFx0XHRyZXR1cm4gdHJ1ZTtcbiAgXHR9IGNhdGNoKGUpIHtcbiAgXHRcdHJldHVybiBmYWxzZVxuICBcdH1cbiAgfSgpKVxuKTtcblxuaWYgKGRldGVjdCkgcmV0dXJuXG5cbi8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9T2JqZWN0LmRlZmluZVByb3BlcnR5JmZsYWdzPWFsd2F5c1xuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xuXG5cdHZhciBzdXBwb3J0c0FjY2Vzc29ycyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ19fZGVmaW5lR2V0dGVyX18nKTtcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcblx0dmFyIEVSUl9WQUxVRV9BQ0NFU1NPUlMgPSAnQSBwcm9wZXJ0eSBjYW5ub3QgYm90aCBoYXZlIGFjY2Vzc29ycyBhbmQgYmUgd3JpdGFibGUgb3IgaGF2ZSBhIHZhbHVlJztcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG5cblx0XHQvLyBXaGVyZSBuYXRpdmUgc3VwcG9ydCBleGlzdHMsIGFzc3VtZSBpdFxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG5cdFx0XHRyZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XG5cdFx0fVxuXG5cdFx0aWYgKG9iamVjdCA9PT0gbnVsbCB8fCAhKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdCcpO1xuXHRcdH1cblxuXHRcdGlmICghKGRlc2NyaXB0b3IgaW5zdGFuY2VvZiBPYmplY3QpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xuXHRcdH1cblxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XG5cdFx0dmFyIGhhc1ZhbHVlT3JXcml0YWJsZSA9ICd2YWx1ZScgaW4gZGVzY3JpcHRvciB8fCAnd3JpdGFibGUnIGluIGRlc2NyaXB0b3I7XG5cdFx0dmFyIGdldHRlclR5cGUgPSAnZ2V0JyBpbiBkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLmdldDtcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xuXG5cdFx0Ly8gaGFuZGxlIGRlc2NyaXB0b3IuZ2V0XG5cdFx0aWYgKGdldHRlclR5cGUpIHtcblx0XHRcdGlmIChnZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0dldHRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHRcdH1cblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9WQUxVRV9BQ0NFU1NPUlMpO1xuXHRcdFx0fVxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLmdldCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxuXHRcdGlmIChzZXR0ZXJUeXBlKSB7XG5cdFx0XHRpZiAoc2V0dGVyVHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXN1cHBvcnRzQWNjZXNzb3JzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcblx0XHRcdH1cblx0XHRcdGlmIChoYXNWYWx1ZU9yV3JpdGFibGUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcblx0XHRcdH1cblx0XHRcdE9iamVjdC5fX2RlZmluZVNldHRlcl9fLmNhbGwob2JqZWN0LCBwcm9wZXJ0eVN0cmluZywgZGVzY3JpcHRvci5zZXQpO1xuXHRcdH1cblxuXHRcdC8vIE9LIHRvIGRlZmluZSB2YWx1ZSB1bmNvbmRpdGlvbmFsbHkgLSBpZiBhIGdldHRlciBoYXMgYmVlbiBzcGVjaWZpZWQgYXMgd2VsbCwgYW4gZXJyb3Igd291bGQgYmUgdGhyb3duIGFib3ZlXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fTtcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XG59KVxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0V2ZW50L2RldGVjdC5qc1xudmFyIGRldGVjdCA9IChcbiAgKGZ1bmN0aW9uKGdsb2JhbCkge1xuXG4gIFx0aWYgKCEoJ0V2ZW50JyBpbiBnbG9iYWwpKSByZXR1cm4gZmFsc2U7XG4gIFx0aWYgKHR5cGVvZiBnbG9iYWwuRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiB0cnVlO1xuXG4gIFx0dHJ5IHtcblxuICBcdFx0Ly8gSW4gSUUgOS0xMSwgdGhlIEV2ZW50IG9iamVjdCBleGlzdHMgYnV0IGNhbm5vdCBiZSBpbnN0YW50aWF0ZWRcbiAgXHRcdG5ldyBFdmVudCgnY2xpY2snKTtcbiAgXHRcdHJldHVybiB0cnVlO1xuICBcdH0gY2F0Y2goZSkge1xuICBcdFx0cmV0dXJuIGZhbHNlO1xuICBcdH1cbiAgfSh0aGlzKSlcbik7XG5cbmlmIChkZXRlY3QpIHJldHVyblxuXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUV2ZW50JmZsYWdzPWFsd2F5c1xuKGZ1bmN0aW9uICgpIHtcblx0dmFyIHVubGlzdGVuYWJsZVdpbmRvd0V2ZW50cyA9IHtcblx0XHRjbGljazogMSxcblx0XHRkYmxjbGljazogMSxcblx0XHRrZXl1cDogMSxcblx0XHRrZXlwcmVzczogMSxcblx0XHRrZXlkb3duOiAxLFxuXHRcdG1vdXNlZG93bjogMSxcblx0XHRtb3VzZXVwOiAxLFxuXHRcdG1vdXNlbW92ZTogMSxcblx0XHRtb3VzZW92ZXI6IDEsXG5cdFx0bW91c2VlbnRlcjogMSxcblx0XHRtb3VzZWxlYXZlOiAxLFxuXHRcdG1vdXNlb3V0OiAxLFxuXHRcdHN0b3JhZ2U6IDEsXG5cdFx0c3RvcmFnZWNvbW1pdDogMSxcblx0XHR0ZXh0aW5wdXQ6IDFcblx0fTtcblxuXHQvLyBUaGlzIHBvbHlmaWxsIGRlcGVuZHMgb24gYXZhaWxhYmlsaXR5IG9mIGBkb2N1bWVudGAgc28gd2lsbCBub3QgcnVuIGluIGEgd29ya2VyXG5cdC8vIEhvd2V2ZXIsIHdlIGFzc3N1bWUgdGhlcmUgYXJlIG5vIGJyb3dzZXJzIHdpdGggd29ya2VyIHN1cHBvcnQgdGhhdCBsYWNrIHByb3BlclxuXHQvLyBzdXBwb3J0IGZvciBgRXZlbnRgIHdpdGhpbiB0aGUgd29ya2VyXG5cdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cblx0ZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgZWxlbWVudCkge1xuXHRcdHZhclxuXHRcdGluZGV4ID0gLTEsXG5cdFx0bGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG5cdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdGlmIChpbmRleCBpbiBhcnJheSAmJiBhcnJheVtpbmRleF0gPT09IGVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGluZGV4O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdHZhciBleGlzdGluZ1Byb3RvID0gKHdpbmRvdy5FdmVudCAmJiB3aW5kb3cuRXZlbnQucHJvdG90eXBlKSB8fCBudWxsO1xuXHR3aW5kb3cuRXZlbnQgPSBXaW5kb3cucHJvdG90eXBlLkV2ZW50ID0gZnVuY3Rpb24gRXZlbnQodHlwZSwgZXZlbnRJbml0RGljdCkge1xuXHRcdGlmICghdHlwZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOb3QgZW5vdWdoIGFyZ3VtZW50cycpO1xuXHRcdH1cblxuXHRcdHZhciBldmVudDtcblx0XHQvLyBTaG9ydGN1dCBpZiBicm93c2VyIHN1cHBvcnRzIGNyZWF0ZUV2ZW50XG5cdFx0aWYgKCdjcmVhdGVFdmVudCcgaW4gZG9jdW1lbnQpIHtcblx0XHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG5cdFx0XHR2YXIgYnViYmxlcyA9IGV2ZW50SW5pdERpY3QgJiYgZXZlbnRJbml0RGljdC5idWJibGVzICE9PSB1bmRlZmluZWQgPyBldmVudEluaXREaWN0LmJ1YmJsZXMgOiBmYWxzZTtcblx0XHRcdHZhciBjYW5jZWxhYmxlID0gZXZlbnRJbml0RGljdCAmJiBldmVudEluaXREaWN0LmNhbmNlbGFibGUgIT09IHVuZGVmaW5lZCA/IGV2ZW50SW5pdERpY3QuY2FuY2VsYWJsZSA6IGZhbHNlO1xuXG5cdFx0XHRldmVudC5pbml0RXZlbnQodHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XG5cblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cblx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG5cblx0XHRldmVudC50eXBlID0gdHlwZTtcblx0XHRldmVudC5idWJibGVzID0gZXZlbnRJbml0RGljdCAmJiBldmVudEluaXREaWN0LmJ1YmJsZXMgIT09IHVuZGVmaW5lZCA/IGV2ZW50SW5pdERpY3QuYnViYmxlcyA6IGZhbHNlO1xuXHRcdGV2ZW50LmNhbmNlbGFibGUgPSBldmVudEluaXREaWN0ICYmIGV2ZW50SW5pdERpY3QuY2FuY2VsYWJsZSAhPT0gdW5kZWZpbmVkID8gZXZlbnRJbml0RGljdC5jYW5jZWxhYmxlIDogZmFsc2U7XG5cblx0XHRyZXR1cm4gZXZlbnQ7XG5cdH07XG5cdGlmIChleGlzdGluZ1Byb3RvKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5FdmVudCwgJ3Byb3RvdHlwZScsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0dmFsdWU6IGV4aXN0aW5nUHJvdG9cblx0XHR9KTtcblx0fVxuXG5cdGlmICghKCdjcmVhdGVFdmVudCcgaW4gZG9jdW1lbnQpKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgPSBXaW5kb3cucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBEb2N1bWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKCkge1xuXHRcdFx0dmFyXG5cdFx0XHRlbGVtZW50ID0gdGhpcyxcblx0XHRcdHR5cGUgPSBhcmd1bWVudHNbMF0sXG5cdFx0XHRsaXN0ZW5lciA9IGFyZ3VtZW50c1sxXTtcblxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHdpbmRvdyAmJiB0eXBlIGluIHVubGlzdGVuYWJsZVdpbmRvd0V2ZW50cykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luIElFOCB0aGUgZXZlbnQ6ICcgKyB0eXBlICsgJyBpcyBub3QgYXZhaWxhYmxlIG9uIHRoZSB3aW5kb3cgb2JqZWN0LiBQbGVhc2Ugc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9pc3N1ZXMvMzE3IGZvciBtb3JlIGluZm9ybWF0aW9uLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWVsZW1lbnQuX2V2ZW50cykge1xuXHRcdFx0XHRlbGVtZW50Ll9ldmVudHMgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFlbGVtZW50Ll9ldmVudHNbdHlwZV0pIHtcblx0XHRcdFx0ZWxlbWVudC5fZXZlbnRzW3R5cGVdID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0dmFyXG5cdFx0XHRcdFx0bGlzdCA9IGVsZW1lbnQuX2V2ZW50c1tldmVudC50eXBlXS5saXN0LFxuXHRcdFx0XHRcdGV2ZW50cyA9IGxpc3Quc2xpY2UoKSxcblx0XHRcdFx0XHRpbmRleCA9IC0xLFxuXHRcdFx0XHRcdGxlbmd0aCA9IGV2ZW50cy5sZW5ndGgsXG5cdFx0XHRcdFx0ZXZlbnRFbGVtZW50O1xuXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCgpIHtcblx0XHRcdFx0XHRcdGlmIChldmVudC5jYW5jZWxhYmxlICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0XHRldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oKSB7XG5cdFx0XHRcdFx0XHRldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gPSBmdW5jdGlvbiBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSB7XG5cdFx0XHRcdFx0XHRldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0ZXZlbnQuY2FuY2VsSW1tZWRpYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0ZXZlbnQuY3VycmVudFRhcmdldCA9IGVsZW1lbnQ7XG5cdFx0XHRcdFx0ZXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LmZyb21FbGVtZW50IHx8IG51bGw7XG5cdFx0XHRcdFx0ZXZlbnQudGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQgfHwgZWxlbWVudDtcblx0XHRcdFx0XHRldmVudC50aW1lU3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdFx0XHRcdGlmIChldmVudC5jbGllbnRYKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wYWdlWCA9IGV2ZW50LmNsaWVudFggKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcblx0XHRcdFx0XHRcdGV2ZW50LnBhZ2VZID0gZXZlbnQuY2xpZW50WSArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGggJiYgIWV2ZW50LmNhbmNlbEltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0aWYgKGluZGV4IGluIGV2ZW50cykge1xuXHRcdFx0XHRcdFx0XHRldmVudEVsZW1lbnQgPSBldmVudHNbaW5kZXhdO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleE9mKGxpc3QsIGV2ZW50RWxlbWVudCkgIT09IC0xICYmIHR5cGVvZiBldmVudEVsZW1lbnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRldmVudEVsZW1lbnQuY2FsbChlbGVtZW50LCBldmVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZWxlbWVudC5fZXZlbnRzW3R5cGVdLmxpc3QgPSBbXTtcblxuXHRcdFx0XHRpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuXHRcdFx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGVsZW1lbnQuX2V2ZW50c1t0eXBlXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudC5fZXZlbnRzW3R5cGVdLmxpc3QucHVzaChsaXN0ZW5lcik7XG5cdFx0fTtcblxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyID0gV2luZG93LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRG9jdW1lbnQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcblx0XHRcdHZhclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMsXG5cdFx0XHR0eXBlID0gYXJndW1lbnRzWzBdLFxuXHRcdFx0bGlzdGVuZXIgPSBhcmd1bWVudHNbMV0sXG5cdFx0XHRpbmRleDtcblxuXHRcdFx0aWYgKGVsZW1lbnQuX2V2ZW50cyAmJiBlbGVtZW50Ll9ldmVudHNbdHlwZV0gJiYgZWxlbWVudC5fZXZlbnRzW3R5cGVdLmxpc3QpIHtcblx0XHRcdFx0aW5kZXggPSBpbmRleE9mKGVsZW1lbnQuX2V2ZW50c1t0eXBlXS5saXN0LCBsaXN0ZW5lcik7XG5cblx0XHRcdFx0aWYgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRcdGVsZW1lbnQuX2V2ZW50c1t0eXBlXS5saXN0LnNwbGljZShpbmRleCwgMSk7XG5cblx0XHRcdFx0XHRpZiAoIWVsZW1lbnQuX2V2ZW50c1t0eXBlXS5saXN0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQuZGV0YWNoRXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgZWxlbWVudC5fZXZlbnRzW3R5cGVdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRlbGV0ZSBlbGVtZW50Ll9ldmVudHNbdHlwZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50ID0gV2luZG93LnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gRG9jdW1lbnQucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFbGVtZW50LnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChldmVudCkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignTm90IGVub3VnaCBhcmd1bWVudHMnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFldmVudCB8fCB0eXBlb2YgZXZlbnQudHlwZSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdET00gRXZlbnRzIEV4Y2VwdGlvbiAwJyk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcywgdHlwZSA9IGV2ZW50LnR5cGU7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICghZXZlbnQuYnViYmxlcykge1xuXHRcdFx0XHRcdGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG5cblx0XHRcdFx0XHR2YXIgY2FuY2VsQnViYmxlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRcdGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG5cblx0XHRcdFx0XHRcdChlbGVtZW50IHx8IHdpbmRvdykuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGNhbmNlbEJ1YmJsZUV2ZW50KTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0dGhpcy5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgY2FuY2VsQnViYmxlRXZlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGV2ZW50KTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGV2ZW50LnRhcmdldCA9IGVsZW1lbnQ7XG5cblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBlbGVtZW50O1xuXG5cdFx0XHRcdFx0aWYgKCdfZXZlbnRzJyBpbiBlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50Ll9ldmVudHNbdHlwZV0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQuX2V2ZW50c1t0eXBlXS5jYWxsKGVsZW1lbnQsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIGVsZW1lbnRbJ29uJyArIHR5cGVdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50WydvbicgKyB0eXBlXS5jYWxsKGVsZW1lbnQsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5ub2RlVHlwZSA9PT0gOSA/IGVsZW1lbnQucGFyZW50V2luZG93IDogZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9IHdoaWxlIChlbGVtZW50ICYmICFldmVudC5jYW5jZWxCdWJibGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0Ly8gQWRkIHRoZSBET01Db250ZW50TG9hZGVkIEV2ZW50XG5cdFx0ZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcblx0XHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ0RPTUNvbnRlbnRMb2FkZWQnLCB7XG5cdFx0XHRcdFx0YnViYmxlczogdHJ1ZVxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0oKSk7XG5cbn0pXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcblxuLyoqXG4gKiBKYXZhU2NyaXB0ICdzaGltJyB0byB0cmlnZ2VyIHRoZSBjbGljayBldmVudCBvZiBlbGVtZW50KHMpIHdoZW4gdGhlIHNwYWNlIGtleSBpcyBwcmVzc2VkLlxuICpcbiAqIENyZWF0ZWQgc2luY2Ugc29tZSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzIChmb3IgZXhhbXBsZSBzb21lIFNjcmVlbnJlYWRlcnMpXG4gKiB3aWxsIHRlbGwgYSB1c2VyIHRvIHByZXNzIHNwYWNlIG9uIGEgJ2J1dHRvbicsIHNvIHRoaXMgZnVuY3Rpb25hbGl0eSBuZWVkcyB0byBiZSBzaGltbWVkXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FscGhhZ292L2dvdnVrX2VsZW1lbnRzL3B1bGwvMjcyI2lzc3VlY29tbWVudC0yMzMwMjgyNzBcbiAqXG4gKiBVc2FnZSBpbnN0cnVjdGlvbnM6XG4gKiB0aGUgJ3NoaW0nIHdpbGwgYmUgYXV0b21hdGljYWxseSBpbml0aWFsaXNlZFxuICovXG5cbnZhciBLRVlfU1BBQ0UgPSAzMjtcblxuZnVuY3Rpb24gQnV0dG9uICgkbW9kdWxlKSB7XG4gIHRoaXMuJG1vZHVsZSA9ICRtb2R1bGU7XG59XG5cbi8qKlxuKiBBZGQgZXZlbnQgaGFuZGxlciBmb3IgS2V5RG93blxuKiBpZiB0aGUgZXZlbnQgdGFyZ2V0IGVsZW1lbnQgaGFzIGEgcm9sZT0nYnV0dG9uJyBhbmQgdGhlIGV2ZW50IGlzIGtleSBzcGFjZSBwcmVzc2VkXG4qIHRoZW4gaXQgcHJldmVudHMgdGhlIGRlZmF1bHQgZXZlbnQgYW5kIHRyaWdnZXJzIGEgY2xpY2sgZXZlbnRcbiogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGV2ZW50XG4qL1xuQnV0dG9uLnByb3RvdHlwZS5oYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vIGdldCB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGEgcm9sZT0nYnV0dG9uJyBhbmQgdGhlIHByZXNzZWQga2V5IGlzIGEgc3BhY2UsIHdlJ2xsIHNpbXVsYXRlIGEgY2xpY2tcbiAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSA9PT0gJ2J1dHRvbicgJiYgZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyB0cmlnZ2VyIHRoZSB0YXJnZXQncyBjbGljayBldmVudFxuICAgIHRhcmdldC5jbGljaygpO1xuICB9XG59O1xuXG4vKipcbiogSW5pdGlhbGlzZSBhbiBldmVudCBsaXN0ZW5lciBmb3Iga2V5ZG93biBhdCBkb2N1bWVudCBsZXZlbFxuKiB0aGlzIHdpbGwgaGVscCBsaXN0ZW5pbmcgZm9yIGxhdGVyIGluc2VydGVkIGVsZW1lbnRzIHdpdGggYSByb2xlPVwiYnV0dG9uXCJcbiovXG5CdXR0b24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJG1vZHVsZS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duKTtcbn07XG5cbihmdW5jdGlvbih1bmRlZmluZWQpIHtcbiAgLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kL2RldGVjdC5qc1xuICB2YXIgZGV0ZWN0ID0gJ2JpbmQnIGluIEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICBpZiAoZGV0ZWN0KSByZXR1cm5cblxuICAvLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJmZsYWdzPWFsd2F5c1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnYmluZCcsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgICAgLy8gYWRkIG5lY2Vzc2FyeSBlczUtc2hpbSB1dGlsaXRpZXNcbiAgICAgICAgICB2YXIgJEFycmF5ID0gQXJyYXk7XG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gICAgICAgICAgdmFyIE9iamVjdFByb3RvdHlwZSA9ICRPYmplY3QucHJvdG90eXBlO1xuICAgICAgICAgIHZhciBBcnJheVByb3RvdHlwZSA9ICRBcnJheS5wcm90b3R5cGU7XG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcbiAgICAgICAgICB2YXIgdG9fc3RyaW5nID0gT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nO1xuICAgICAgICAgIHZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCc7XG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xuICAgICAgICAgIHZhciBhcnJheV9zbGljZSA9IEFycmF5UHJvdG90eXBlLnNsaWNlO1xuICAgICAgICAgIHZhciBhcnJheV9jb25jYXQgPSBBcnJheVByb3RvdHlwZS5jb25jYXQ7XG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xuICAgICAgICAgIHZhciBtYXggPSBNYXRoLm1heDtcbiAgICAgICAgICAvLyAvYWRkIG5lY2Vzc2FyeSBlczUtc2hpbSB1dGlsaXRpZXNcblxuICAgICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnICsgdGFyZ2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcbiAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXG4gICAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcbiAgICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxuICAgICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxuICAgICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxuICAgICAgICAgIHZhciBib3VuZDtcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXG4gICAgICAgICAgICAgICAgICAvLyBGIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cbiAgICAgICAgICAgICAgICAgIC8vICAgaW50ZXJuYWwgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgLy8gICBtZXRob2Qgb2YgdGFyZ2V0IHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgaWYgKCRPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4xIFtbQ2FsbF1dXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXG4gICAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgICAvLyB0aGlzIHZhbHVlIGFuZCBhIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAvLyAgIG9mIHRhcmdldCBwcm92aWRpbmcgYm91bmRUaGlzIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICAvLyBlcXVpdjogdGFyZ2V0LmNhbGwodGhpcywgLi4uYm91bmRBcmdzLCAuLi5hcmdzKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cbiAgICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxuICAgICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXG4gICAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cblxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuXG4gICAgICAgICAgLy8gMTcuIFNldCB0aGUgYXR0cmlidXRlcyBvZiB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIHRoZSB2YWx1ZXNcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cbiAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3VuZExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcbiAgICAgICAgICAvLyB3YXkgdG8gc2V0IHRoZSBsZW5ndGggcHJvcGVydHkgb2YgYSBmdW5jdGlvbi5cbiAgICAgICAgICAvLyBJbiBlbnZpcm9ubWVudHMgd2hlcmUgQ29udGVudCBTZWN1cml0eSBQb2xpY2llcyBlbmFibGVkIChDaHJvbWUgZXh0ZW5zaW9ucyxcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgICAgICAgIC8vIEhvd2V2ZXIgaW4gYWxsIG9mIHRoZXNlIGVudmlyb25tZW50cyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBleGlzdHNcbiAgICAgICAgICAvLyBhbmQgc28gdGhpcyBjb2RlIHdpbGwgbmV2ZXIgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgICAgICAgIGlmICh0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgICAvLyBDbGVhbiB1cCBkYW5nbGluZyByZWZlcmVuY2VzLlxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXG5cbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxuICAgICAgICAgIC8vIDIwLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcbiAgICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcbiAgICAgICAgICAvLyAgIGZhbHNlLlxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcbiAgICAgICAgICAvLyAgIFtbU2V0XV06IHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LFxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxuXG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxuICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXG4gICAgICAgICAgLy8gW1tTY29wZV1dIGludGVybmFsIHByb3BlcnRpZXMuXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cblxuICAgICAgICAgIC8vIDIyLiBSZXR1cm4gRi5cbiAgICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgICB9XG4gIH0pO1xufSlcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xuXG4vKipcbiAqIEphdmFTY3JpcHQgJ3BvbHlmaWxsJyBmb3IgSFRNTDUncyA8ZGV0YWlscz4gYW5kIDxzdW1tYXJ5PiBlbGVtZW50c1xuICogYW5kICdzaGltJyB0byBhZGQgYWNjZXNzaWJsaXR5IGVuaGFuY2VtZW50cyBmb3IgYWxsIGJyb3dzZXJzXG4gKlxuICogaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWRldGFpbHNcbiAqXG4gKiBVc2FnZSBpbnN0cnVjdGlvbnM6XG4gKiB0aGUgJ3BvbHlmaWxsJyB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgaW5pdGlhbGlzZWRcbiAqL1xuXG52YXIgS0VZX0VOVEVSID0gMTM7XG52YXIgS0VZX1NQQUNFJDEgPSAzMjtcblxuLy8gQ3JlYXRlIGEgZmxhZyB0byBrbm93IGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIG5hdnRpdmUgZGV0YWlsc1xudmFyIE5BVElWRV9ERVRBSUxTID0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RldGFpbHMnKS5vcGVuID09PSAnYm9vbGVhbic7XG5cbmZ1bmN0aW9uIERldGFpbHMgKCRtb2R1bGUpIHtcbiAgdGhpcy4kbW9kdWxlID0gJG1vZHVsZTtcbn1cblxuLyoqXG4qIEhhbmRsZSBjcm9zcy1tb2RhbCBjbGljayBldmVudHNcbiogQHBhcmFtIHtvYmplY3R9IG5vZGUgZWxlbWVudFxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvblxuKi9cbkRldGFpbHMucHJvdG90eXBlLmhhbmRsZUlucHV0cyA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAvLyBXaGVuIHRoZSBrZXkgZ2V0cyBwcmVzc2VkIC0gY2hlY2sgaWYgaXQgaXMgZW50ZXIgb3Igc3BhY2VcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSQxKSB7XG4gICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgICAvLyBQcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlXG4gICAgICAgIC8vIGFuZCBlbnRlciBmcm9tIHN1Ym1pdHRpbmcgYSBmb3JtXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIENsaWNrIHRvIGxldCB0aGUgY2xpY2sgZXZlbnQgZG8gYWxsIHRoZSBuZWNlc3NhcnkgYWN0aW9uXG4gICAgICAgIGlmICh0YXJnZXQuY2xpY2spIHtcbiAgICAgICAgICB0YXJnZXQuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBleGNlcHQgU2FmYXJpIDUuMSBhbmQgdW5kZXIgZG9uJ3Qgc3VwcG9ydCAuY2xpY2soKSBoZXJlXG4gICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBQcmV2ZW50IGtleXVwIHRvIHByZXZlbnQgY2xpY2tpbmcgdHdpY2UgaW4gRmlyZWZveCB3aGVuIHVzaW5nIHNwYWNlIGtleVxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFJDEpIHtcbiAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xufTtcblxuRGV0YWlscy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XG5cbiAgaWYgKCEkbW9kdWxlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBTYXZlIHNob3J0Y3V0cyB0byB0aGUgaW5uZXIgc3VtbWFyeSBhbmQgY29udGVudCBlbGVtZW50c1xuICB2YXIgJHN1bW1hcnkgPSB0aGlzLiRzdW1tYXJ5ID0gJG1vZHVsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3VtbWFyeScpLml0ZW0oMCk7XG4gIHZhciAkY29udGVudCA9IHRoaXMuJGNvbnRlbnQgPSAkbW9kdWxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKS5pdGVtKDApO1xuXG4gIC8vIElmIDxkZXRhaWxzPiBkb2Vzbid0IGhhdmUgYSA8c3VtbWFyeT4gYW5kIGEgPGRpdj4gcmVwcmVzZW50aW5nIHRoZSBjb250ZW50XG4gIC8vIGl0IG1lYW5zIHRoZSByZXF1aXJlZCBIVE1MIHN0cnVjdHVyZSBpcyBub3QgbWV0IHNvIHRoZSBzY3JpcHQgd2lsbCBzdG9wXG4gIGlmICghJHN1bW1hcnkgfHwgISRjb250ZW50KSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgY29udGVudCBkb2Vzbid0IGhhdmUgYW4gSUQsIGFzc2lnbiBpdCBvbmUgbm93XG4gIC8vIHdoaWNoIHdlJ2xsIG5lZWQgZm9yIHRoZSBzdW1tYXJ5J3MgYXJpYS1jb250cm9scyBhc3NpZ25tZW50XG4gIGlmICghJGNvbnRlbnQuaWQpIHtcbiAgICAkY29udGVudC5pZCA9ICdkZXRhaWxzLWNvbnRlbnQtJyArIGdlbmVyYXRlVW5pcXVlSUQoKTtcbiAgfVxuXG4gIC8vIEFkZCBBUklBIHJvbGU9XCJncm91cFwiIHRvIGRldGFpbHNcbiAgJG1vZHVsZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZ3JvdXAnKTtcblxuICAvLyBBZGQgcm9sZT1idXR0b24gdG8gc3VtbWFyeVxuICAkc3VtbWFyeS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG5cbiAgLy8gQWRkIGFyaWEtY29udHJvbHNcbiAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgJGNvbnRlbnQuaWQpO1xuXG4gIC8vIFNldCB0YWJJbmRleCBzbyB0aGUgc3VtbWFyeSBpcyBrZXlib2FyZCBhY2Nlc3NpYmxlIGZvciBub24tbmF0aXZlIGVsZW1lbnRzXG4gIC8vIGh0dHA6Ly93d3cuc2FsaWVuY2VzLmNvbS9icm93c2VyQnVncy90YWJJbmRleC5odG1sXG4gIGlmICghTkFUSVZFX0RFVEFJTFMpIHtcbiAgICAkc3VtbWFyeS50YWJJbmRleCA9IDA7XG4gIH1cblxuICAvLyBEZXRlY3QgaW5pdGlhbCBvcGVuIHN0YXRlXG4gIHZhciBvcGVuQXR0ciA9ICRtb2R1bGUuZ2V0QXR0cmlidXRlKCdvcGVuJykgIT09IG51bGw7XG4gIGlmIChvcGVuQXR0ciA9PT0gdHJ1ZSkge1xuICAgICRzdW1tYXJ5LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICB9IGVsc2Uge1xuICAgICRzdW1tYXJ5LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGlmICghTkFUSVZFX0RFVEFJTFMpIHtcbiAgICAgICRjb250ZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG5cbiAgLy8gQmluZCBhbiBldmVudCB0byBoYW5kbGUgc3VtbWFyeSBlbGVtZW50c1xuICB0aGlzLmhhbmRsZUlucHV0cygkc3VtbWFyeSwgdGhpcy5zZXRBdHRyaWJ1dGVzLmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4qIERlZmluZSBhIHN0YXRlY2hhbmdlIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyBhcmlhLWV4cGFuZGVkIGFuZCBzdHlsZS5kaXNwbGF5XG4qIEBwYXJhbSB7b2JqZWN0fSBzdW1tYXJ5IGVsZW1lbnRcbiovXG5EZXRhaWxzLnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgJG1vZHVsZSA9IHRoaXMuJG1vZHVsZTtcbiAgdmFyICRzdW1tYXJ5ID0gdGhpcy4kc3VtbWFyeTtcbiAgdmFyICRjb250ZW50ID0gdGhpcy4kY29udGVudDtcblxuICB2YXIgZXhwYW5kZWQgPSAkc3VtbWFyeS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xuICB2YXIgaGlkZGVuID0gJGNvbnRlbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZSc7XG5cbiAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKGV4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xuICAkY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgKGhpZGRlbiA/ICdmYWxzZScgOiAndHJ1ZScpKTtcblxuICBpZiAoIU5BVElWRV9ERVRBSUxTKSB7XG4gICAgJGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9IChleHBhbmRlZCA/ICdub25lJyA6ICcnKTtcblxuICAgIHZhciBoYXNPcGVuQXR0ciA9ICRtb2R1bGUuZ2V0QXR0cmlidXRlKCdvcGVuJykgIT09IG51bGw7XG4gICAgaWYgKCFoYXNPcGVuQXR0cikge1xuICAgICAgJG1vZHVsZS5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnb3BlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkbW9kdWxlLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZVxufTtcblxuLyoqXG4qIFJlbW92ZSB0aGUgY2xpY2sgZXZlbnQgZnJvbSB0aGUgbm9kZSBlbGVtZW50XG4qIEBwYXJhbSB7b2JqZWN0fSBub2RlIGVsZW1lbnRcbiovXG5EZXRhaWxzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycpO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJyk7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcbn07XG5cbmZ1bmN0aW9uIENoZWNrYm94ZXMgKCRtb2R1bGUpIHtcbiAgdGhpcy4kbW9kdWxlID0gJG1vZHVsZTtcbiAgdGhpcy4kaW5wdXRzID0gJG1vZHVsZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbn1cblxuQ2hlY2tib3hlcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XG4gIHZhciAkaW5wdXRzID0gdGhpcy4kaW5wdXRzO1xuXG4gIC8qKlxuICAqIExvb3Agb3ZlciBhbGwgaXRlbXMgd2l0aCBbZGF0YS1jb250cm9sc11cbiAgKiBDaGVjayBpZiB0aGV5IGhhdmUgYSBtYXRjaGluZyBjb25kaXRpb25hbCByZXZlYWxcbiAgKiBJZiB0aGV5IGRvLCBhc3NpZ24gYXR0cmlidXRlcy5cbiAgKiovXG4gIG5vZGVMaXN0Rm9yRWFjaCgkaW5wdXRzLCBmdW5jdGlvbiAoJGlucHV0KSB7XG4gICAgdmFyIGNvbnRyb2xzID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWNvbnRyb2xzJyk7XG5cbiAgICAvLyBDaGVjayBpZiBpbnB1dCBjb250cm9scyBhbnl0aGluZ1xuICAgIC8vIENoZWNrIGlmIGNvbnRlbnQgZXhpc3RzLCBiZWZvcmUgc2V0dGluZyBhdHRyaWJ1dGVzLlxuICAgIGlmICghY29udHJvbHMgfHwgISRtb2R1bGUucXVlcnlTZWxlY3RvcignIycgKyBjb250cm9scykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgY29udGVudCB0aGF0IGlzIGNvbnRyb2xsZWQsIHNldCBhdHRyaWJ1dGVzLlxuICAgICRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBjb250cm9scyk7XG4gICAgJGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1hcmlhLWNvbnRyb2xzJyk7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVzKCRpbnB1dCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgLy8gSGFuZGxlIGV2ZW50c1xuICAkbW9kdWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKTtcbn07XG5cbkNoZWNrYm94ZXMucHJvdG90eXBlLnNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoJGlucHV0KSB7XG4gIHZhciBpbnB1dElzQ2hlY2tlZCA9ICRpbnB1dC5jaGVja2VkO1xuICAkaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgaW5wdXRJc0NoZWNrZWQpO1xuXG4gIHZhciAkY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcbiAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICFpbnB1dElzQ2hlY2tlZCk7XG59O1xuXG5DaGVja2JveGVzLnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIgJHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblxuICAvLyBJZiBhIGNoZWNrYm94IHdpdGggYXJpYS1jb250cm9scywgaGFuZGxlIGNsaWNrXG4gIHZhciBpc0NoZWNrYm94ID0gJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JztcbiAgdmFyIGhhc0FyaWFDb250cm9scyA9ICR0YXJnZXQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gIGlmIChpc0NoZWNrYm94ICYmIGhhc0FyaWFDb250cm9scykge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlcygkdGFyZ2V0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gRXJyb3JTdW1tYXJ5ICgkbW9kdWxlKSB7XG4gIHRoaXMuJG1vZHVsZSA9ICRtb2R1bGU7XG59XG5cbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XG4gIGlmICghJG1vZHVsZSkge1xuICAgIHJldHVyblxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICRtb2R1bGUuZm9jdXMoKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBIZWFkZXIgKCRtb2R1bGUpIHtcbiAgdGhpcy4kbW9kdWxlID0gJG1vZHVsZTtcbn1cblxuSGVhZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBDaGVjayBmb3IgbW9kdWxlXG4gIHZhciAkbW9kdWxlID0gdGhpcy4kbW9kdWxlO1xuICBpZiAoISRtb2R1bGUpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIENoZWNrIGZvciBidXR0b25cbiAgdmFyICR0b2dnbGVCdXR0b24gPSAkbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoJy5qcy1oZWFkZXItdG9nZ2xlJyk7XG4gIGlmICghJHRvZ2dsZUJ1dHRvbikge1xuICAgIHJldHVyblxuICB9XG5cbiAgLy8gSGFuZGxlICR0b2dnbGVCdXR0b24gY2xpY2sgZXZlbnRzXG4gICR0b2dnbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4qIFRvZ2dsZSBjbGFzc1xuKiBAcGFyYW0ge29iamVjdH0gbm9kZSBlbGVtZW50XG4qIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgdG8gdG9nZ2xlXG4qL1xuSGVhZGVyLnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uIChub2RlLCBjbGFzc05hbWUpIHtcbiAgaWYgKG5vZGUuY2xhc3NOYW1lLmluZGV4T2YoY2xhc3NOYW1lKSA+IDApIHtcbiAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UoJyAnICsgY2xhc3NOYW1lLCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICB9XG59O1xuXG4vKipcbiogQW4gZXZlbnQgaGFuZGxlciBmb3IgY2xpY2sgZXZlbnQgb24gJHRvZ2dsZUJ1dHRvblxuKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgZXZlbnRcbiovXG5IZWFkZXIucHJvdG90eXBlLmhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHZhciAkbW9kdWxlID0gdGhpcy4kbW9kdWxlO1xuICB2YXIgJHRvZ2dsZUJ1dHRvbiA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xuICB2YXIgJHRhcmdldCA9ICRtb2R1bGUucXVlcnlTZWxlY3RvcignIycgKyAkdG9nZ2xlQnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcblxuICAvLyBJZiBhIGJ1dHRvbiB3aXRoIGFyaWEtY29udHJvbHMsIGhhbmRsZSBjbGlja1xuICBpZiAoJHRvZ2dsZUJ1dHRvbiAmJiAkdGFyZ2V0KSB7XG4gICAgdGhpcy50b2dnbGVDbGFzcygkdGFyZ2V0LCAnZ292dWstaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgdGhpcy50b2dnbGVDbGFzcygkdG9nZ2xlQnV0dG9uLCAnZ292dWstaGVhZGVyX19tZW51LWJ1dHRvbi0tb3BlbicpO1xuXG4gICAgJHRvZ2dsZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAkdG9nZ2xlQnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpICE9PSAndHJ1ZScpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICR0YXJnZXQuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAnZmFsc2UnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gUmFkaW9zICgkbW9kdWxlKSB7XG4gIHRoaXMuJG1vZHVsZSA9ICRtb2R1bGU7XG4gIHRoaXMuJGlucHV0cyA9ICRtb2R1bGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XG59XG5cblJhZGlvcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XG4gIHZhciAkaW5wdXRzID0gdGhpcy4kaW5wdXRzO1xuXG4gIC8qKlxuICAqIExvb3Agb3ZlciBhbGwgaXRlbXMgd2l0aCBbZGF0YS1jb250cm9sc11cbiAgKiBDaGVjayBpZiB0aGV5IGhhdmUgYSBtYXRjaGluZyBjb25kaXRpb25hbCByZXZlYWxcbiAgKiBJZiB0aGV5IGRvLCBhc3NpZ24gYXR0cmlidXRlcy5cbiAgKiovXG4gIG5vZGVMaXN0Rm9yRWFjaCgkaW5wdXRzLCBmdW5jdGlvbiAoJGlucHV0KSB7XG4gICAgdmFyIGNvbnRyb2xzID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWNvbnRyb2xzJyk7XG5cbiAgICAvLyBDaGVjayBpZiBpbnB1dCBjb250cm9scyBhbnl0aGluZ1xuICAgIC8vIENoZWNrIGlmIGNvbnRlbnQgZXhpc3RzLCBiZWZvcmUgc2V0dGluZyBhdHRyaWJ1dGVzLlxuICAgIGlmICghY29udHJvbHMgfHwgISRtb2R1bGUucXVlcnlTZWxlY3RvcignIycgKyBjb250cm9scykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgY29udGVudCB0aGF0IGlzIGNvbnRyb2xsZWQsIHNldCBhdHRyaWJ1dGVzLlxuICAgICRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBjb250cm9scyk7XG4gICAgJGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1hcmlhLWNvbnRyb2xzJyk7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVzKCRpbnB1dCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgLy8gSGFuZGxlIGV2ZW50c1xuICAkbW9kdWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKTtcbn07XG5cblJhZGlvcy5wcm90b3R5cGUuc2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcbiAgdmFyIGlucHV0SXNDaGVja2VkID0gJGlucHV0LmNoZWNrZWQ7XG4gICRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpbnB1dElzQ2hlY2tlZCk7XG5cbiAgdmFyICRjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyAkaW5wdXQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuICAkY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIWlucHV0SXNDaGVja2VkKTtcbn07XG5cblJhZGlvcy5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgbm9kZUxpc3RGb3JFYWNoKHRoaXMuJGlucHV0cywgZnVuY3Rpb24gKCRpbnB1dCkge1xuICAgIC8vIElmIGEgcmFkaW8gd2l0aCBhcmlhLWNvbnRyb2xzLCBoYW5kbGUgY2xpY2tcbiAgICB2YXIgaXNSYWRpbyA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3JhZGlvJztcbiAgICB2YXIgaGFzQXJpYUNvbnRyb2xzID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIGlmIChpc1JhZGlvICYmIGhhc0FyaWFDb250cm9scykge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKCRpbnB1dCk7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuXG4gICAgLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9ET01Ub2tlbkxpc3QvZGV0ZWN0LmpzXG4gICAgdmFyIGRldGVjdCA9IChcbiAgICAgICdET01Ub2tlbkxpc3QnIGluIHRoaXMgJiYgKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiAnY2xhc3NMaXN0JyBpbiB4ID8gIXguY2xhc3NMaXN0LnRvZ2dsZSgneCcsIGZhbHNlKSAmJiAheC5jbGFzc05hbWUgOiB0cnVlO1xuICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneCcpKVxuICAgICk7XG5cbiAgICBpZiAoZGV0ZWN0KSByZXR1cm5cblxuICAgIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9ET01Ub2tlbkxpc3QvcG9seWZpbGwuanNcbiAgICAoZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICAgdmFyIG5hdGl2ZUltcGwgPSBcIkRPTVRva2VuTGlzdFwiIGluIGdsb2JhbCAmJiBnbG9iYWwuRE9NVG9rZW5MaXN0O1xuXG4gICAgICBpZiAoXG4gICAgICAgICAgIW5hdGl2ZUltcGwgfHxcbiAgICAgICAgICAoXG4gICAgICAgICAgICAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJlxuICAgICAgICAgICAgISFkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpICYmXG4gICAgICAgICAgICAhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpLmNsYXNzTGlzdCBpbnN0YW5jZW9mIERPTVRva2VuTGlzdClcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICBnbG9iYWwuRE9NVG9rZW5MaXN0ID0gKGZ1bmN0aW9uKCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgdmFyIGRwU3VwcG9ydCA9IHRydWU7XG4gICAgICAgICAgdmFyIGRlZmluZUdldHRlciA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIGZuLCBjb25maWd1cmFibGUpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpXG4gICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlID09PSBkcFN1cHBvcnQgPyB0cnVlIDogISFjb25maWd1cmFibGUsXG4gICAgICAgICAgICAgICAgZ2V0OiBmblxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxzZSBvYmplY3QuX19kZWZpbmVHZXR0ZXJfXyhuYW1lLCBmbik7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8qKiBFbnN1cmUgdGhlIGJyb3dzZXIgYWxsb3dzIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBiZSB1c2VkIG9uIG5hdGl2ZSBKYXZhU2NyaXB0IG9iamVjdHMuICovXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRlZmluZUdldHRlcih7fSwgXCJzdXBwb3J0XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZHBTdXBwb3J0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICB2YXIgX0RPTVRva2VuTGlzdCA9IGZ1bmN0aW9uIChlbCwgcHJvcCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHRva2VucyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRva2VuTWFwID0ge307XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHZhciBtYXhMZW5ndGggPSAwO1xuICAgICAgICAgICAgdmFyIGFkZEluZGV4R2V0dGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgZGVmaW5lR2V0dGVyKHRoYXQsIGksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwcmVvcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbnNbaV07XG4gICAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByZWluZGV4ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgIC8qKiBEZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgYXJyYXktbGlrZSBhY2Nlc3MgdG8gdGhlIHRva2VuTGlzdCdzIGNvbnRlbnRzLiAqL1xuICAgICAgICAgICAgICBpZiAobGVuZ3RoID49IG1heExlbmd0aClcbiAgICAgICAgICAgICAgICBmb3IgKDsgbWF4TGVuZ3RoIDwgbGVuZ3RoOyArK21heExlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgYWRkSW5kZXhHZXR0ZXIobWF4TGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKiogSGVscGVyIGZ1bmN0aW9uIGNhbGxlZCBhdCB0aGUgc3RhcnQgb2YgZWFjaCBjbGFzcyBtZXRob2QuIEludGVybmFsIHVzZSBvbmx5LiAqL1xuICAgICAgICAgICAgdmFyIHByZW9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgdmFyIHJTcGFjZSA9IC9cXHMrLztcblxuICAgICAgICAgICAgICAvKiogVmFsaWRhdGUgdGhlIHRva2VuL3MgcGFzc2VkIHRvIGFuIGluc3RhbmNlIG1ldGhvZCwgaWYgYW55LiAqL1xuICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgICBpZiAoclNwYWNlLnRlc3QoYXJnc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgU3ludGF4RXJyb3IoJ1N0cmluZyBcIicgKyBhcmdzW2ldICsgJ1wiICcgKyBcImNvbnRhaW5zXCIgKyAnIGFuIGludmFsaWQgY2hhcmFjdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvZGUgPSA1O1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5uYW1lID0gXCJJbnZhbGlkQ2hhcmFjdGVyRXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAvKiogU3BsaXQgdGhlIG5ldyB2YWx1ZSBhcGFydCBieSB3aGl0ZXNwYWNlKi9cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbFtwcm9wXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRva2VucyA9IChcIlwiICsgZWxbcHJvcF0uYmFzZVZhbCkucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIikuc3BsaXQoclNwYWNlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b2tlbnMgPSAoXCJcIiArIGVsW3Byb3BdKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKS5zcGxpdChyU3BhY2UpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLyoqIEF2b2lkIHRyZWF0aW5nIGJsYW5rIHN0cmluZ3MgYXMgc2luZ2xlLWl0ZW0gdG9rZW4gbGlzdHMgKi9cbiAgICAgICAgICAgICAgaWYgKFwiXCIgPT09IHRva2Vuc1swXSkgdG9rZW5zID0gW107XG5cbiAgICAgICAgICAgICAgLyoqIFJlcG9wdWxhdGUgdGhlIGludGVybmFsIHRva2VuIGxpc3RzICovXG4gICAgICAgICAgICAgIHRva2VuTWFwID0ge307XG4gICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgdG9rZW5NYXBbdG9rZW5zW2ldXSA9IHRydWU7XG4gICAgICAgICAgICAgIGxlbmd0aCA9IHRva2Vucy5sZW5ndGg7XG4gICAgICAgICAgICAgIHJlaW5kZXgoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qKiBQb3B1bGF0ZSBvdXIgaW50ZXJuYWwgdG9rZW4gbGlzdCBpZiB0aGUgdGFyZ2V0ZWQgYXR0cmlidXRlIG9mIHRoZSBzdWJqZWN0IGVsZW1lbnQgaXNuJ3QgZW1wdHkuICovXG4gICAgICAgICAgICBwcmVvcCgpO1xuXG4gICAgICAgICAgICAvKiogUmV0dXJuIHRoZSBudW1iZXIgb2YgdG9rZW5zIGluIHRoZSB1bmRlcmx5aW5nIHN0cmluZy4gUmVhZC1vbmx5LiAqL1xuICAgICAgICAgICAgZGVmaW5lR2V0dGVyKHRoYXQsIFwibGVuZ3RoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcHJlb3AoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiogT3ZlcnJpZGUgdGhlIGRlZmF1bHQgdG9TdHJpbmcvdG9Mb2NhbGVTdHJpbmcgbWV0aG9kcyB0byByZXR1cm4gYSBzcGFjZS1kZWxpbWl0ZWQgbGlzdCBvZiB0b2tlbnMgd2hlbiB0eXBlY2FzdC4gKi9cbiAgICAgICAgICAgIHRoYXQudG9Mb2NhbGVTdHJpbmcgPVxuICAgICAgICAgICAgICB0aGF0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHByZW9wKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2Vucy5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC5pdGVtID0gZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICAgICAgICBwcmVvcCgpO1xuICAgICAgICAgICAgICByZXR1cm4gdG9rZW5zW2lkeF07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgIHByZW9wKCk7XG4gICAgICAgICAgICAgIHJldHVybiAhIXRva2VuTWFwW3Rva2VuXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoYXQuYWRkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBwcmVvcC5hcHBseSh0aGF0LCBhcmdzID0gYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBhcmdzLCB0b2tlbiwgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuTWFwW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgICAgdG9rZW5NYXBbdG9rZW5dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvKiogVXBkYXRlIHRoZSB0YXJnZXRlZCBhdHRyaWJ1dGUgb2YgdGhlIGF0dGFjaGVkIGVsZW1lbnQgaWYgdGhlIHRva2VuIGxpc3QncyBjaGFuZ2VkLiAqL1xuICAgICAgICAgICAgICBpZiAobGVuZ3RoICE9PSB0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdG9rZW5zLmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsW3Byb3BdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICBlbFtwcm9wXS5iYXNlVmFsID0gdG9rZW5zLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBlbFtwcm9wXSA9IHRva2Vucy5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVpbmRleCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGF0LnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcHJlb3AuYXBwbHkodGhhdCwgYXJncyA9IGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgLyoqIEJ1aWxkIGEgaGFzaCBvZiB0b2tlbiBuYW1lcyB0byBjb21wYXJlIGFnYWluc3Qgd2hlbiByZWNvbGxlY3Rpbmcgb3VyIHRva2VuIGxpc3QuICovXG4gICAgICAgICAgICAgIGZvciAodmFyIGFyZ3MsIGlnbm9yZSA9IHt9LCBpID0gMCwgdCA9IFtdOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlnbm9yZVthcmdzW2ldXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuTWFwW2FyZ3NbaV1dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLyoqIFJ1biB0aHJvdWdoIG91ciB0b2tlbnMgbGlzdCBhbmQgcmVhc3NpZ24gb25seSB0aG9zZSB0aGF0IGFyZW4ndCBkZWZpbmVkIGluIHRoZSBoYXNoIGRlY2xhcmVkIGFib3ZlLiAqL1xuICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGlmICghaWdub3JlW3Rva2Vuc1tpXV0pIHQucHVzaCh0b2tlbnNbaV0pO1xuXG4gICAgICAgICAgICAgIHRva2VucyA9IHQ7XG4gICAgICAgICAgICAgIGxlbmd0aCA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgICAgICAgIC8qKiBVcGRhdGUgdGhlIHRhcmdldGVkIGF0dHJpYnV0ZSBvZiB0aGUgYXR0YWNoZWQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbFtwcm9wXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGVsW3Byb3BdLmJhc2VWYWwgPSB0b2tlbnMuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxbcHJvcF0gPSB0b2tlbnMuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVpbmRleCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhhdC50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG4gICAgICAgICAgICAgIHByZW9wLmFwcGx5KHRoYXQsIFt0b2tlbl0pO1xuXG4gICAgICAgICAgICAgIC8qKiBUb2tlbiBzdGF0ZSdzIGJlaW5nIGZvcmNlZC4gKi9cbiAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gZm9yY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgICAgICAgIHRoYXQuYWRkKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGF0LnJlbW92ZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLyoqIFRva2VuIGFscmVhZHkgZXhpc3RzIGluIHRva2VuTGlzdC4gUmVtb3ZlIGl0LCBhbmQgcmV0dXJuIEZBTFNFLiAqL1xuICAgICAgICAgICAgICBpZiAodG9rZW5NYXBbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5yZW1vdmUodG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8qKiBPdGhlcndpc2UsIGFkZCB0aGUgdG9rZW4gYW5kIHJldHVybiBUUlVFLiAqL1xuICAgICAgICAgICAgICB0aGF0LmFkZCh0b2tlbik7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJldHVybiBfRE9NVG9rZW5MaXN0O1xuICAgICAgICB9KCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgc2Vjb25kIGFyZ3VtZW50IHRvIG5hdGl2ZSBET01Ub2tlbkxpc3QudG9nZ2xlKCkgaWYgbmVjZXNzYXJ5XG4gICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgaWYgKCEoJ2NsYXNzTGlzdCcgaW4gZSkpIHJldHVybjtcbiAgICAgICAgZS5jbGFzc0xpc3QudG9nZ2xlKCd4JywgZmFsc2UpO1xuICAgICAgICBpZiAoIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCd4JykpIHJldHVybjtcbiAgICAgICAgZS5jbGFzc0xpc3QuY29uc3RydWN0b3IucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZSh0b2tlbiAvKiwgZm9yY2UqLykge1xuICAgICAgICAgIHZhciBmb3JjZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBpZiAoZm9yY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGFkZCA9ICF0aGlzLmNvbnRhaW5zKHRva2VuKTtcbiAgICAgICAgICAgIHRoaXNbYWRkID8gJ2FkZCcgOiAncmVtb3ZlJ10odG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIGFkZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yY2UgPSAhIWZvcmNlO1xuICAgICAgICAgIHRoaXNbZm9yY2UgPyAnYWRkJyA6ICdyZW1vdmUnXSh0b2tlbik7XG4gICAgICAgICAgcmV0dXJuIGZvcmNlO1xuICAgICAgICB9O1xuICAgICAgfSgpKTtcblxuICAgICAgLy8gQWRkIG11bHRpcGxlIGFyZ3VtZW50cyB0byBuYXRpdmUgRE9NVG9rZW5MaXN0LmFkZCgpIGlmIG5lY2Vzc2FyeVxuICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICghKCdjbGFzc0xpc3QnIGluIGUpKSByZXR1cm47XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYScsICdiJyk7XG4gICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnYicpKSByZXR1cm47XG4gICAgICAgIHZhciBuYXRpdmUgPSBlLmNsYXNzTGlzdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuYWRkO1xuICAgICAgICBlLmNsYXNzTGlzdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbmF0aXZlLmNhbGwodGhpcywgYXJnc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSgpKTtcblxuICAgICAgLy8gQWRkIG11bHRpcGxlIGFyZ3VtZW50cyB0byBuYXRpdmUgRE9NVG9rZW5MaXN0LnJlbW92ZSgpIGlmIG5lY2Vzc2FyeVxuICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICghKCdjbGFzc0xpc3QnIGluIGUpKSByZXR1cm47XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYScpO1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2InKTtcbiAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhJywgJ2InKTtcbiAgICAgICAgaWYgKCFlLmNsYXNzTGlzdC5jb250YWlucygnYicpKSByZXR1cm47XG4gICAgICAgIHZhciBuYXRpdmUgPSBlLmNsYXNzTGlzdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucmVtb3ZlO1xuICAgICAgICBlLmNsYXNzTGlzdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbmF0aXZlLmNhbGwodGhpcywgYXJnc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSgpKTtcblxuICAgIH0odGhpcykpO1xuXG59KS5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xuXG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XG5cbiAgICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvODcxN2E5ZTA0YWM3YWZmOTliNDk4MGZiZWRlYWQ5ODAzNmIwOTI5YS9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9FbGVtZW50L3Byb3RvdHlwZS9jbGFzc0xpc3QvZGV0ZWN0LmpzXG4gICAgdmFyIGRldGVjdCA9IChcbiAgICAgICdkb2N1bWVudCcgaW4gdGhpcyAmJiBcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAnRWxlbWVudCcgaW4gdGhpcyAmJiAnY2xhc3NMaXN0JyBpbiBFbGVtZW50LnByb3RvdHlwZSAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhJywgJ2InKTtcbiAgICAgICAgcmV0dXJuIGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdiJyk7XG4gICAgICB9KCkpXG4gICAgKTtcblxuICAgIGlmIChkZXRlY3QpIHJldHVyblxuXG4gICAgLy8gUG9seWZpbGwgZnJvbSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvODcxN2E5ZTA0YWM3YWZmOTliNDk4MGZiZWRlYWQ5ODAzNmIwOTI5YS9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9FbGVtZW50L3Byb3RvdHlwZS9jbGFzc0xpc3QvcG9seWZpbGwuanNcbiAgICAoZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICAgdmFyIGRwU3VwcG9ydCA9IHRydWU7XG4gICAgICB2YXIgZGVmaW5lR2V0dGVyID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgZm4sIGNvbmZpZ3VyYWJsZSkge1xuICAgICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UgPT09IGRwU3VwcG9ydCA/IHRydWUgOiAhIWNvbmZpZ3VyYWJsZSxcbiAgICAgICAgICAgIGdldDogZm5cbiAgICAgICAgICB9KTtcblxuICAgICAgICBlbHNlIG9iamVjdC5fX2RlZmluZUdldHRlcl9fKG5hbWUsIGZuKTtcbiAgICAgIH07XG4gICAgICAvKiogRW5zdXJlIHRoZSBicm93c2VyIGFsbG93cyBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gYmUgdXNlZCBvbiBuYXRpdmUgSmF2YVNjcmlwdCBvYmplY3RzLiAqL1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVmaW5lR2V0dGVyKHt9LCBcInN1cHBvcnRcIik7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBkcFN1cHBvcnQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8qKiBQb2x5ZmlsbHMgYSBwcm9wZXJ0eSB3aXRoIGEgRE9NVG9rZW5MaXN0ICovXG4gICAgICB2YXIgYWRkUHJvcCA9IGZ1bmN0aW9uIChvLCBuYW1lLCBhdHRyKSB7XG5cbiAgICAgICAgZGVmaW5lR2V0dGVyKG8ucHJvdG90eXBlLCBuYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHRva2VuTGlzdDtcblxuICAgICAgICAgIHZhciBUSElTID0gdGhpcyxcblxuICAgICAgICAgIC8qKiBQcmV2ZW50IHRoaXMgZnJvbSBmaXJpbmcgdHdpY2UgZm9yIHNvbWUgcmVhc29uLiBXaGF0IHRoZSBoZWxsLCBJRS4gKi9cbiAgICAgICAgICBnaWJiZXJpc2hQcm9wZXJ0eSA9IFwiX19kZWZpbmVHZXR0ZXJfX1wiICsgXCJERUZJTkVfUFJPUEVSVFlcIiArIG5hbWU7XG4gICAgICAgICAgaWYoVEhJU1tnaWJiZXJpc2hQcm9wZXJ0eV0pIHJldHVybiB0b2tlbkxpc3Q7XG4gICAgICAgICAgVEhJU1tnaWJiZXJpc2hQcm9wZXJ0eV0gPSB0cnVlO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSUU4IGNhbid0IGRlZmluZSBwcm9wZXJ0aWVzIG9uIG5hdGl2ZSBKYXZhU2NyaXB0IG9iamVjdHMsIHNvIHdlJ2xsIHVzZSBhIGR1bWIgaGFjayBpbnN0ZWFkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogV2hhdCB0aGlzIGlzIGRvaW5nIGlzIGNyZWF0aW5nIGEgZHVtbXkgZWxlbWVudCAoXCJyZWZsZWN0aW9uXCIpIGluc2lkZSBhIGRldGFjaGVkIHBoYW50b20gbm9kZSAoXCJtaXJyb3JcIilcbiAgICAgICAgICAgKiB0aGF0IHNlcnZlcyBhcyB0aGUgdGFyZ2V0IG9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBpbnN0ZWFkLiBXaGlsZSB3ZSBjb3VsZCBzaW1wbHkgdXNlIHRoZSBzdWJqZWN0IEhUTUxcbiAgICAgICAgICAgKiBlbGVtZW50IGluc3RlYWQsIHRoaXMgd291bGQgY29uZmxpY3Qgd2l0aCBlbGVtZW50IHR5cGVzIHdoaWNoIHVzZSBpbmRleGVkIHByb3BlcnRpZXMgKHN1Y2ggYXMgZm9ybXMgYW5kXG4gICAgICAgICAgICogc2VsZWN0IGxpc3RzKS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoZmFsc2UgPT09IGRwU3VwcG9ydCkge1xuXG4gICAgICAgICAgICB2YXIgdmlzYWdlO1xuICAgICAgICAgICAgdmFyIG1pcnJvciA9IGFkZFByb3AubWlycm9yIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB2YXIgcmVmbGVjdGlvbnMgPSBtaXJyb3IuY2hpbGROb2RlcztcbiAgICAgICAgICAgIHZhciBsID0gcmVmbGVjdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSlcbiAgICAgICAgICAgICAgaWYgKHJlZmxlY3Rpb25zW2ldLl9SID09PSBUSElTKSB7XG4gICAgICAgICAgICAgICAgdmlzYWdlID0gcmVmbGVjdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIENvdWxkbid0IGZpbmQgYW4gZWxlbWVudCdzIHJlZmxlY3Rpb24gaW5zaWRlIHRoZSBtaXJyb3IuIE1hdGVyaWFsaXNlIG9uZS4gKi9cbiAgICAgICAgICAgIHZpc2FnZSB8fCAodmlzYWdlID0gbWlycm9yLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpKTtcblxuICAgICAgICAgICAgdG9rZW5MaXN0ID0gRE9NVG9rZW5MaXN0LmNhbGwodmlzYWdlLCBUSElTLCBhdHRyKTtcbiAgICAgICAgICB9IGVsc2UgdG9rZW5MaXN0ID0gbmV3IERPTVRva2VuTGlzdChUSElTLCBhdHRyKTtcblxuICAgICAgICAgIGRlZmluZUdldHRlcihUSElTLCBuYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5MaXN0O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRlbGV0ZSBUSElTW2dpYmJlcmlzaFByb3BlcnR5XTtcblxuICAgICAgICAgIHJldHVybiB0b2tlbkxpc3Q7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfTtcblxuICAgICAgYWRkUHJvcChnbG9iYWwuRWxlbWVudCwgXCJjbGFzc0xpc3RcIiwgXCJjbGFzc05hbWVcIik7XG4gICAgICBhZGRQcm9wKGdsb2JhbC5IVE1MRWxlbWVudCwgXCJjbGFzc0xpc3RcIiwgXCJjbGFzc05hbWVcIik7XG4gICAgICBhZGRQcm9wKGdsb2JhbC5IVE1MTGlua0VsZW1lbnQsIFwicmVsTGlzdFwiLCBcInJlbFwiKTtcbiAgICAgIGFkZFByb3AoZ2xvYmFsLkhUTUxBbmNob3JFbGVtZW50LCBcInJlbExpc3RcIiwgXCJyZWxcIik7XG4gICAgICBhZGRQcm9wKGdsb2JhbC5IVE1MQXJlYUVsZW1lbnQsIFwicmVsTGlzdFwiLCBcInJlbFwiKTtcbiAgICB9KHRoaXMpKTtcblxufSkuY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcblxuZnVuY3Rpb24gVGFicyAoJG1vZHVsZSkge1xuICB0aGlzLiRtb2R1bGUgPSAkbW9kdWxlO1xuICB0aGlzLiR0YWJzID0gJG1vZHVsZS5xdWVyeVNlbGVjdG9yQWxsKCcuZ292dWstdGFic19fdGFiJyk7XG5cbiAgdGhpcy5rZXlzID0geyBsZWZ0OiAzNywgcmlnaHQ6IDM5LCB1cDogMzgsIGRvd246IDQwIH07XG4gIHRoaXMuanNIaWRkZW5DbGFzcyA9ICdqcy1oaWRkZW4nO1xufVxuXG5UYWJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5tYXRjaE1lZGlhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5zZXR1cFJlc3BvbnNpdmVDaGVja3MoKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNldHVwKCk7XG4gIH1cbn07XG5cblRhYnMucHJvdG90eXBlLnNldHVwUmVzcG9uc2l2ZUNoZWNrcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5tcWwgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogNDAuMDYyNWVtKScpO1xuICB0aGlzLm1xbC5hZGRMaXN0ZW5lcih0aGlzLmNoZWNrTW9kZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5jaGVja01vZGUoKTtcbn07XG5cblRhYnMucHJvdG90eXBlLmNoZWNrTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMubXFsLm1hdGNoZXMpIHtcbiAgICB0aGlzLnNldHVwKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50ZWFyZG93bigpO1xuICB9XG59O1xuXG5UYWJzLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XG4gIHZhciAkdGFicyA9IHRoaXMuJHRhYnM7XG4gIHZhciAkdGFiTGlzdCA9ICRtb2R1bGUucXVlcnlTZWxlY3RvcignLmdvdnVrLXRhYnNfX2xpc3QnKTtcbiAgdmFyICR0YWJMaXN0SXRlbXMgPSAkbW9kdWxlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5nb3Z1ay10YWJzX19saXN0LWl0ZW0nKTtcblxuICBpZiAoISR0YWJzIHx8ICEkdGFiTGlzdCB8fCAhJHRhYkxpc3RJdGVtcykge1xuICAgIHJldHVyblxuICB9XG5cbiAgJHRhYkxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcblxuICBub2RlTGlzdEZvckVhY2goJHRhYkxpc3RJdGVtcywgZnVuY3Rpb24gKCRpdGVtKSB7XG4gICAgJGl0ZW0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICB9KTtcblxuICBub2RlTGlzdEZvckVhY2goJHRhYnMsIGZ1bmN0aW9uICgkdGFiKSB7XG4gICAgLy8gU2V0IEhUTUwgYXR0cmlidXRlc1xuICAgIHRoaXMuc2V0QXR0cmlidXRlcygkdGFiKTtcblxuICAgIC8vIFNhdmUgYm91bmRlZCBmdW5jdGlvbnMgdG8gdXNlIHdoZW4gcmVtb3ZpbmcgZXZlbnQgbGlzdGVuZXJzIGR1cmluZyB0ZWFyZG93blxuICAgICR0YWIuYm91bmRUYWJDbGljayA9IHRoaXMub25UYWJDbGljay5iaW5kKHRoaXMpO1xuICAgICR0YWIuYm91bmRUYWJLZXlkb3duID0gdGhpcy5vblRhYktleWRvd24uYmluZCh0aGlzKTtcblxuICAgIC8vIEhhbmRsZSBldmVudHNcbiAgICAkdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgJHRhYi5ib3VuZFRhYkNsaWNrLCB0cnVlKTtcbiAgICAkdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAkdGFiLmJvdW5kVGFiS2V5ZG93biwgdHJ1ZSk7XG5cbiAgICAvLyBSZW1vdmUgb2xkIGFjdGl2ZSBwYW5lbHNcbiAgICB0aGlzLmhpZGVUYWIoJHRhYik7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgLy8gU2hvdyBlaXRoZXIgdGhlIGFjdGl2ZSB0YWIgYWNjb3JkaW5nIHRvIHRoZSBVUkwncyBoYXNoIG9yIHRoZSBmaXJzdCB0YWJcbiAgdmFyICRhY3RpdmVUYWIgPSB0aGlzLmdldFRhYih3aW5kb3cubG9jYXRpb24uaGFzaCkgfHwgdGhpcy4kdGFic1swXTtcbiAgdGhpcy5zaG93VGFiKCRhY3RpdmVUYWIpO1xuXG4gIC8vIEhhbmRsZSBoYXNoY2hhbmdlIGV2ZW50c1xuICAkbW9kdWxlLmJvdW5kT25IYXNoQ2hhbmdlID0gdGhpcy5vbkhhc2hDaGFuZ2UuYmluZCh0aGlzKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCAkbW9kdWxlLmJvdW5kT25IYXNoQ2hhbmdlLCB0cnVlKTtcbn07XG5cblRhYnMucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICB2YXIgJG1vZHVsZSA9IHRoaXMuJG1vZHVsZTtcbiAgdmFyICR0YWJzID0gdGhpcy4kdGFicztcbiAgdmFyICR0YWJMaXN0ID0gJG1vZHVsZS5xdWVyeVNlbGVjdG9yKCcuZ292dWstdGFic19fbGlzdCcpO1xuICB2YXIgJHRhYkxpc3RJdGVtcyA9ICRtb2R1bGUucXVlcnlTZWxlY3RvckFsbCgnLmdvdnVrLXRhYnNfX2xpc3QtaXRlbScpO1xuXG4gIGlmICghJHRhYnMgfHwgISR0YWJMaXN0IHx8ICEkdGFiTGlzdEl0ZW1zKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAkdGFiTGlzdC5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKTtcblxuICBub2RlTGlzdEZvckVhY2goJHRhYkxpc3RJdGVtcywgZnVuY3Rpb24gKCRpdGVtKSB7XG4gICAgJGl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICB9KTtcblxuICBub2RlTGlzdEZvckVhY2goJHRhYnMsIGZ1bmN0aW9uICgkdGFiKSB7XG4gICAgLy8gUmVtb3ZlIGV2ZW50c1xuICAgICR0YWIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkdGFiLmJvdW5kVGFiQ2xpY2ssIHRydWUpO1xuICAgICR0YWIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsICR0YWIuYm91bmRUYWJLZXlkb3duLCB0cnVlKTtcblxuICAgIC8vIFVuc2V0IEhUTUwgYXR0cmlidXRlc1xuICAgIHRoaXMudW5zZXRBdHRyaWJ1dGVzKCR0YWIpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIC8vIFJlbW92ZSBoYXNoY2hhbmdlIGV2ZW50IGhhbmRsZXJcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCAkbW9kdWxlLmJvdW5kT25IYXNoQ2hhbmdlLCB0cnVlKTtcbn07XG5cblRhYnMucHJvdG90eXBlLm9uSGFzaENoYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gIGlmICghdGhpcy5oYXNUYWIoaGFzaCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICAvLyBQcmV2ZW50IGNoYW5naW5nIHRoZSBoYXNoXG4gIGlmICh0aGlzLmNoYW5naW5nSGFzaCkge1xuICAgIHRoaXMuY2hhbmdpbmdIYXNoID0gZmFsc2U7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBTaG93IGVpdGhlciB0aGUgYWN0aXZlIHRhYiBhY2NvcmRpbmcgdG8gdGhlIFVSTCdzIGhhc2ggb3IgdGhlIGZpcnN0IHRhYlxuICB2YXIgJHByZXZpb3VzVGFiID0gdGhpcy5nZXRDdXJyZW50VGFiKCk7XG4gIHZhciAkYWN0aXZlVGFiID0gdGhpcy5nZXRUYWIoaGFzaCkgfHwgdGhpcy4kdGFic1swXTtcblxuICB0aGlzLmhpZGVUYWIoJHByZXZpb3VzVGFiKTtcbiAgdGhpcy5zaG93VGFiKCRhY3RpdmVUYWIpO1xuICAkYWN0aXZlVGFiLmZvY3VzKCk7XG59O1xuXG5UYWJzLnByb3RvdHlwZS5oYXNUYWIgPSBmdW5jdGlvbiAoaGFzaCkge1xuICByZXR1cm4gdGhpcy4kbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoaGFzaClcbn07XG5cblRhYnMucHJvdG90eXBlLmhpZGVUYWIgPSBmdW5jdGlvbiAoJHRhYikge1xuICB0aGlzLnVuaGlnaGxpZ2h0VGFiKCR0YWIpO1xuICB0aGlzLmhpZGVQYW5lbCgkdGFiKTtcbn07XG5cblRhYnMucHJvdG90eXBlLnNob3dUYWIgPSBmdW5jdGlvbiAoJHRhYikge1xuICB0aGlzLmhpZ2hsaWdodFRhYigkdGFiKTtcbiAgdGhpcy5zaG93UGFuZWwoJHRhYik7XG59O1xuXG5UYWJzLnByb3RvdHlwZS5nZXRUYWIgPSBmdW5jdGlvbiAoaGFzaCkge1xuICByZXR1cm4gdGhpcy4kbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoJ2Fbcm9sZT1cInRhYlwiXVtocmVmPVwiJyArIGhhc2ggKyAnXCJdJylcbn07XG5cblRhYnMucHJvdG90eXBlLnNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoJHRhYikge1xuICAvLyBzZXQgdGFiIGF0dHJpYnV0ZXNcbiAgdmFyIHBhbmVsSWQgPSB0aGlzLmdldEhyZWYoJHRhYikuc2xpY2UoMSk7XG4gICR0YWIuc2V0QXR0cmlidXRlKCdpZCcsICd0YWJfJyArIHBhbmVsSWQpO1xuICAkdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgJHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBwYW5lbElkKTtcbiAgJHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgLy8gc2V0IHBhbmVsIGF0dHJpYnV0ZXNcbiAgdmFyICRwYW5lbCA9IHRoaXMuZ2V0UGFuZWwoJHRhYik7XG4gICRwYW5lbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgJHBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgJHRhYi5pZCk7XG4gICRwYW5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuanNIaWRkZW5DbGFzcyk7XG59O1xuXG5UYWJzLnByb3RvdHlwZS51bnNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoJHRhYikge1xuICAvLyB1bnNldCB0YWIgYXR0cmlidXRlc1xuICAkdGFiLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKTtcbiAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcbiAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG5cbiAgLy8gdW5zZXQgcGFuZWwgYXR0cmlidXRlc1xuICB2YXIgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKTtcbiAgJHBhbmVsLnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpO1xuICAkcGFuZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgJHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5qc0hpZGRlbkNsYXNzKTtcbn07XG5cblRhYnMucHJvdG90eXBlLm9uVGFiQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHZhciAkbmV3VGFiID0gZS50YXJnZXQ7XG4gIHZhciAkY3VycmVudFRhYiA9IHRoaXMuZ2V0Q3VycmVudFRhYigpO1xuICB0aGlzLmhpZGVUYWIoJGN1cnJlbnRUYWIpO1xuICB0aGlzLnNob3dUYWIoJG5ld1RhYik7XG4gIHRoaXMuY3JlYXRlSGlzdG9yeUVudHJ5KCRuZXdUYWIpO1xufTtcblxuVGFicy5wcm90b3R5cGUuY3JlYXRlSGlzdG9yeUVudHJ5ID0gZnVuY3Rpb24gKCR0YWIpIHtcbiAgdmFyICRwYW5lbCA9IHRoaXMuZ2V0UGFuZWwoJHRhYik7XG5cbiAgLy8gU2F2ZSBhbmQgcmVzdG9yZSB0aGUgaWRcbiAgLy8gc28gdGhlIHBhZ2UgZG9lc24ndCBqdW1wIHdoZW4gYSB1c2VyIGNsaWNrcyBhIHRhYiAod2hpY2ggY2hhbmdlcyB0aGUgaGFzaClcbiAgdmFyIGlkID0gJHBhbmVsLmlkO1xuICAkcGFuZWwuaWQgPSAnJztcbiAgdGhpcy5jaGFuZ2luZ0hhc2ggPSB0cnVlO1xuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHRoaXMuZ2V0SHJlZigkdGFiKS5zbGljZSgxKTtcbiAgJHBhbmVsLmlkID0gaWQ7XG59O1xuXG5UYWJzLnByb3RvdHlwZS5vblRhYktleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgIGNhc2UgdGhpcy5rZXlzLmxlZnQ6XG4gICAgY2FzZSB0aGlzLmtleXMudXA6XG4gICAgICB0aGlzLmFjdGl2YXRlUHJldmlvdXNUYWIoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGJyZWFrXG4gICAgY2FzZSB0aGlzLmtleXMucmlnaHQ6XG4gICAgY2FzZSB0aGlzLmtleXMuZG93bjpcbiAgICAgIHRoaXMuYWN0aXZhdGVOZXh0VGFiKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBicmVha1xuICB9XG59O1xuXG5UYWJzLnByb3RvdHlwZS5hY3RpdmF0ZU5leHRUYWIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50VGFiID0gdGhpcy5nZXRDdXJyZW50VGFiKCk7XG4gIHZhciBuZXh0VGFiTGlzdEl0ZW0gPSBjdXJyZW50VGFiLnBhcmVudE5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICBpZiAobmV4dFRhYkxpc3RJdGVtKSB7XG4gICAgdmFyIG5leHRUYWIgPSBuZXh0VGFiTGlzdEl0ZW0uZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIH1cbiAgaWYgKG5leHRUYWIpIHtcbiAgICB0aGlzLmhpZGVUYWIoY3VycmVudFRhYik7XG4gICAgdGhpcy5zaG93VGFiKG5leHRUYWIpO1xuICAgIG5leHRUYWIuZm9jdXMoKTtcbiAgICB0aGlzLmNyZWF0ZUhpc3RvcnlFbnRyeShuZXh0VGFiKTtcbiAgfVxufTtcblxuVGFicy5wcm90b3R5cGUuYWN0aXZhdGVQcmV2aW91c1RhYiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGN1cnJlbnRUYWIgPSB0aGlzLmdldEN1cnJlbnRUYWIoKTtcbiAgdmFyIHByZXZpb3VzVGFiTGlzdEl0ZW0gPSBjdXJyZW50VGFiLnBhcmVudE5vZGUucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgaWYgKHByZXZpb3VzVGFiTGlzdEl0ZW0pIHtcbiAgICB2YXIgcHJldmlvdXNUYWIgPSBwcmV2aW91c1RhYkxpc3RJdGVtLmZpcnN0RWxlbWVudENoaWxkO1xuICB9XG4gIGlmIChwcmV2aW91c1RhYikge1xuICAgIHRoaXMuaGlkZVRhYihjdXJyZW50VGFiKTtcbiAgICB0aGlzLnNob3dUYWIocHJldmlvdXNUYWIpO1xuICAgIHByZXZpb3VzVGFiLmZvY3VzKCk7XG4gICAgdGhpcy5jcmVhdGVIaXN0b3J5RW50cnkocHJldmlvdXNUYWIpO1xuICB9XG59O1xuXG5UYWJzLnByb3RvdHlwZS5nZXRQYW5lbCA9IGZ1bmN0aW9uICgkdGFiKSB7XG4gIHZhciAkcGFuZWwgPSB0aGlzLiRtb2R1bGUucXVlcnlTZWxlY3Rvcih0aGlzLmdldEhyZWYoJHRhYikpO1xuICByZXR1cm4gJHBhbmVsXG59O1xuXG5UYWJzLnByb3RvdHlwZS5zaG93UGFuZWwgPSBmdW5jdGlvbiAoJHRhYikge1xuICB2YXIgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKTtcbiAgJHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5qc0hpZGRlbkNsYXNzKTtcbn07XG5cblRhYnMucHJvdG90eXBlLmhpZGVQYW5lbCA9IGZ1bmN0aW9uICh0YWIpIHtcbiAgdmFyICRwYW5lbCA9IHRoaXMuZ2V0UGFuZWwodGFiKTtcbiAgJHBhbmVsLmNsYXNzTGlzdC5hZGQodGhpcy5qc0hpZGRlbkNsYXNzKTtcbn07XG5cblRhYnMucHJvdG90eXBlLnVuaGlnaGxpZ2h0VGFiID0gZnVuY3Rpb24gKCR0YWIpIHtcbiAgJHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgJHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG59O1xuXG5UYWJzLnByb3RvdHlwZS5oaWdobGlnaHRUYWIgPSBmdW5jdGlvbiAoJHRhYikge1xuICAkdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICR0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG59O1xuXG5UYWJzLnByb3RvdHlwZS5nZXRDdXJyZW50VGFiID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy4kbW9kdWxlLnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPXRhYl1bYXJpYS1zZWxlY3RlZD10cnVlXScpXG59O1xuXG4vLyB0aGlzIGlzIGJlY2F1c2UgSUUgZG9lc24ndCBhbHdheXMgcmV0dXJuIHRoZSBhY3R1YWwgdmFsdWUgYnV0IGEgcmVsYXRpdmUgZnVsbCBwYXRoXG4vLyBzaG91bGQgYmUgYSB1dGlsaXR5IGZ1bmN0aW9uIG1vc3QgcHJvYlxuLy8gaHR0cDovL2xhYnMudGhlc2VkYXlzLmNvbS9ibG9nLzIwMTAvMDEvMDgvZ2V0dGluZy10aGUtaHJlZi12YWx1ZS13aXRoLWpxdWVyeS1pbi1pZS9cblRhYnMucHJvdG90eXBlLmdldEhyZWYgPSBmdW5jdGlvbiAoJHRhYikge1xuICB2YXIgaHJlZiA9ICR0YWIuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gIHZhciBoYXNoID0gaHJlZi5zbGljZShocmVmLmluZGV4T2YoJyMnKSwgaHJlZi5sZW5ndGgpO1xuICByZXR1cm4gaGFzaFxufTtcblxuZnVuY3Rpb24gaW5pdEFsbCAoKSB7XG4gIC8vIEZpbmQgYWxsIGJ1dHRvbnMgd2l0aCBbcm9sZT1idXR0b25dIG9uIHRoZSBkb2N1bWVudCB0byBlbmhhbmNlLlxuICBuZXcgQnV0dG9uKGRvY3VtZW50KS5pbml0KCk7XG5cbiAgLy8gRmluZCBhbGwgZ2xvYmFsIGRldGFpbHMgZWxlbWVudHMgdG8gZW5oYW5jZS5cbiAgdmFyICRkZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGV0YWlscycpO1xuICBub2RlTGlzdEZvckVhY2goJGRldGFpbHMsIGZ1bmN0aW9uICgkZGV0YWlsKSB7XG4gICAgbmV3IERldGFpbHMoJGRldGFpbCkuaW5pdCgpO1xuICB9KTtcblxuICB2YXIgJGNoZWNrYm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJjaGVja2JveGVzXCJdJyk7XG4gIG5vZGVMaXN0Rm9yRWFjaCgkY2hlY2tib3hlcywgZnVuY3Rpb24gKCRjaGVja2JveCkge1xuICAgIG5ldyBDaGVja2JveGVzKCRjaGVja2JveCkuaW5pdCgpO1xuICB9KTtcblxuICAvLyBGaW5kIGZpcnN0IGVycm9yIHN1bW1hcnkgbW9kdWxlIHRvIGVuaGFuY2UuXG4gIHZhciAkZXJyb3JTdW1tYXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbW9kdWxlPVwiZXJyb3Itc3VtbWFyeVwiXScpO1xuICBuZXcgRXJyb3JTdW1tYXJ5KCRlcnJvclN1bW1hcnkpLmluaXQoKTtcblxuICAvLyBGaW5kIGZpcnN0IGhlYWRlciBtb2R1bGUgdG8gZW5oYW5jZS5cbiAgdmFyICR0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb2R1bGU9XCJoZWFkZXJcIl0nKTtcbiAgbmV3IEhlYWRlcigkdG9nZ2xlQnV0dG9uKS5pbml0KCk7XG5cbiAgdmFyICRyYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJyYWRpb3NcIl0nKTtcbiAgbm9kZUxpc3RGb3JFYWNoKCRyYWRpb3MsIGZ1bmN0aW9uICgkcmFkaW8pIHtcbiAgICBuZXcgUmFkaW9zKCRyYWRpbykuaW5pdCgpO1xuICB9KTtcblxuICB2YXIgJHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJ0YWJzXCJdJyk7XG4gIG5vZGVMaXN0Rm9yRWFjaCgkdGFicywgZnVuY3Rpb24gKCR0YWJzKSB7XG4gICAgbmV3IFRhYnMoJHRhYnMpLmluaXQoKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMuaW5pdEFsbCA9IGluaXRBbGw7XG5leHBvcnRzLkJ1dHRvbiA9IEJ1dHRvbjtcbmV4cG9ydHMuRGV0YWlscyA9IERldGFpbHM7XG5leHBvcnRzLkNoZWNrYm94ZXMgPSBDaGVja2JveGVzO1xuZXhwb3J0cy5FcnJvclN1bW1hcnkgPSBFcnJvclN1bW1hcnk7XG5leHBvcnRzLkhlYWRlciA9IEhlYWRlcjtcbmV4cG9ydHMuUmFkaW9zID0gUmFkaW9zO1xuZXhwb3J0cy5UYWJzID0gVGFicztcblxufSkpKTtcbiIsIi8qISBqUXVlcnkgdjMuMi4xIHwgKGMpIEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyB8IGpxdWVyeS5vcmcvbGljZW5zZSAqLyAhIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgXCJvYmplY3RcIiA9PSB0eXBlb2YgbW9kdWxlICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBhLmRvY3VtZW50ID8gYihhLCAhMCkgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICBpZiAoIWEuZG9jdW1lbnQpIHRocm93IG5ldyBFcnJvcihcImpRdWVyeSByZXF1aXJlcyBhIHdpbmRvdyB3aXRoIGEgZG9jdW1lbnRcIik7XG4gICAgICAgIHJldHVybiBiKGEpXG4gICAgfSA6IGIoYSlcbn0oXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2Ygd2luZG93ID8gd2luZG93IDogdGhpcywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgYyA9IFtdLFxuICAgICAgICBkID0gYS5kb2N1bWVudCxcbiAgICAgICAgZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgICAgICAgZiA9IGMuc2xpY2UsXG4gICAgICAgIGcgPSBjLmNvbmNhdCxcbiAgICAgICAgaCA9IGMucHVzaCxcbiAgICAgICAgaSA9IGMuaW5kZXhPZixcbiAgICAgICAgaiA9IHt9LFxuICAgICAgICBrID0gai50b1N0cmluZyxcbiAgICAgICAgbCA9IGouaGFzT3duUHJvcGVydHksXG4gICAgICAgIG0gPSBsLnRvU3RyaW5nLFxuICAgICAgICBuID0gbS5jYWxsKE9iamVjdCksXG4gICAgICAgIG8gPSB7fTtcblxuICAgIGZ1bmN0aW9uIHAoYSwgYikge1xuICAgICAgICBiID0gYiB8fCBkO1xuICAgICAgICB2YXIgYyA9IGIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgYy50ZXh0ID0gYSwgYi5oZWFkLmFwcGVuZENoaWxkKGMpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYylcbiAgICB9XG4gICAgdmFyIHEgPSBcIjMuMi4xXCIsXG4gICAgICAgIHIgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyByLmZuLmluaXQoYSwgYilcbiAgICAgICAgfSxcbiAgICAgICAgcyA9IC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZyxcbiAgICAgICAgdCA9IC9eLW1zLS8sXG4gICAgICAgIHUgPSAvLShbYS16XSkvZyxcbiAgICAgICAgdiA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi50b1VwcGVyQ2FzZSgpXG4gICAgICAgIH07XG4gICAgci5mbiA9IHIucHJvdG90eXBlID0ge1xuICAgICAgICBqcXVlcnk6IHEsXG4gICAgICAgIGNvbnN0cnVjdG9yOiByLFxuICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmNhbGwodGhpcylcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgPT0gYSA/IGYuY2FsbCh0aGlzKSA6IGEgPCAwID8gdGhpc1thICsgdGhpcy5sZW5ndGhdIDogdGhpc1thXVxuICAgICAgICB9LFxuICAgICAgICBwdXNoU3RhY2s6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IHIubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLCBhKTtcbiAgICAgICAgICAgIHJldHVybiBiLnByZXZPYmplY3QgPSB0aGlzLCBiXG4gICAgICAgIH0sXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gci5lYWNoKHRoaXMsIGEpXG4gICAgICAgIH0sXG4gICAgICAgIG1hcDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayhyLm1hcCh0aGlzLCBmdW5jdGlvbiAoYiwgYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmNhbGwoYiwgYywgYilcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9LFxuICAgICAgICBzbGljZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKGYuYXBwbHkodGhpcywgYXJndW1lbnRzKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVxKDApXG4gICAgICAgIH0sXG4gICAgICAgIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVxKC0xKVxuICAgICAgICB9LFxuICAgICAgICBlcTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYyA9ICthICsgKGEgPCAwID8gYiA6IDApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKGMgPj0gMCAmJiBjIDwgYiA/IFt0aGlzW2NdXSA6IFtdKVxuICAgICAgICB9LFxuICAgICAgICBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZPYmplY3QgfHwgdGhpcy5jb25zdHJ1Y3RvcigpXG4gICAgICAgIH0sXG4gICAgICAgIHB1c2g6IGgsXG4gICAgICAgIHNvcnQ6IGMuc29ydCxcbiAgICAgICAgc3BsaWNlOiBjLnNwbGljZVxuICAgIH0sIHIuZXh0ZW5kID0gci5mbi5leHRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhLCBiLCBjLCBkLCBlLCBmLCBnID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgICAgICAgaCA9IDEsXG4gICAgICAgICAgICBpID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGogPSAhMTtcbiAgICAgICAgZm9yIChcImJvb2xlYW5cIiA9PSB0eXBlb2YgZyAmJiAoaiA9IGcsIGcgPSBhcmd1bWVudHNbaF0gfHwge30sIGgrKyksIFwib2JqZWN0XCIgPT0gdHlwZW9mIGcgfHwgci5pc0Z1bmN0aW9uKGcpIHx8IChnID0ge30pLCBoID09PSBpICYmIChnID0gdGhpcywgaC0tKTsgaCA8IGk7IGgrKylcbiAgICAgICAgICAgIGlmIChudWxsICE9IChhID0gYXJndW1lbnRzW2hdKSlcbiAgICAgICAgICAgICAgICBmb3IgKGIgaW4gYSkgYyA9IGdbYl0sIGQgPSBhW2JdLCBnICE9PSBkICYmIChqICYmIGQgJiYgKHIuaXNQbGFpbk9iamVjdChkKSB8fCAoZSA9IEFycmF5LmlzQXJyYXkoZCkpKSA/IChlID8gKGUgPSAhMSwgZiA9IGMgJiYgQXJyYXkuaXNBcnJheShjKSA/IGMgOiBbXSkgOiBmID0gYyAmJiByLmlzUGxhaW5PYmplY3QoYykgPyBjIDoge30sIGdbYl0gPSByLmV4dGVuZChqLCBmLCBkKSkgOiB2b2lkIDAgIT09IGQgJiYgKGdbYl0gPSBkKSk7XG4gICAgICAgIHJldHVybiBnXG4gICAgfSwgci5leHRlbmQoe1xuICAgICAgICBleHBhbmRvOiBcImpRdWVyeVwiICsgKHEgKyBNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZywgXCJcIiksXG4gICAgICAgIGlzUmVhZHk6ICEwLFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihhKVxuICAgICAgICB9LFxuICAgICAgICBub29wOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgaXNGdW5jdGlvbjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBcImZ1bmN0aW9uXCIgPT09IHIudHlwZShhKVxuICAgICAgICB9LFxuICAgICAgICBpc1dpbmRvdzogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsICE9IGEgJiYgYSA9PT0gYS53aW5kb3dcbiAgICAgICAgfSxcbiAgICAgICAgaXNOdW1lcmljOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGIgPSByLnR5cGUoYSk7XG4gICAgICAgICAgICByZXR1cm4gKFwibnVtYmVyXCIgPT09IGIgfHwgXCJzdHJpbmdcIiA9PT0gYikgJiYgIWlzTmFOKGEgLSBwYXJzZUZsb2F0KGEpKVxuICAgICAgICB9LFxuICAgICAgICBpc1BsYWluT2JqZWN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGIsIGM7XG4gICAgICAgICAgICByZXR1cm4gISghYSB8fCBcIltvYmplY3QgT2JqZWN0XVwiICE9PSBrLmNhbGwoYSkpICYmICghKGIgPSBlKGEpKSB8fCAoYyA9IGwuY2FsbChiLCBcImNvbnN0cnVjdG9yXCIpICYmIGIuY29uc3RydWN0b3IsIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgYyAmJiBtLmNhbGwoYykgPT09IG4pKVxuICAgICAgICB9LFxuICAgICAgICBpc0VtcHR5T2JqZWN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGI7XG4gICAgICAgICAgICBmb3IgKGIgaW4gYSkgcmV0dXJuICExO1xuICAgICAgICAgICAgcmV0dXJuICEwXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBhID8gYSArIFwiXCIgOiBcIm9iamVjdFwiID09IHR5cGVvZiBhIHx8IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgYSA/IGpbay5jYWxsKGEpXSB8fCBcIm9iamVjdFwiIDogdHlwZW9mIGFcbiAgICAgICAgfSxcbiAgICAgICAgZ2xvYmFsRXZhbDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHAoYSlcbiAgICAgICAgfSxcbiAgICAgICAgY2FtZWxDYXNlOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEucmVwbGFjZSh0LCBcIm1zLVwiKS5yZXBsYWNlKHUsIHYpXG4gICAgICAgIH0sXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgYywgZCA9IDA7XG4gICAgICAgICAgICBpZiAodyhhKSkge1xuICAgICAgICAgICAgICAgIGZvciAoYyA9IGEubGVuZ3RoOyBkIDwgYzsgZCsrKVxuICAgICAgICAgICAgICAgICAgICBpZiAoYi5jYWxsKGFbZF0sIGQsIGFbZF0pID09PSAhMSkgYnJlYWtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIGZvciAoZCBpbiBhKVxuICAgICAgICAgICAgICAgICAgICBpZiAoYi5jYWxsKGFbZF0sIGQsIGFbZF0pID09PSAhMSkgYnJlYWs7XG4gICAgICAgICAgICByZXR1cm4gYVxuICAgICAgICB9LFxuICAgICAgICB0cmltOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgPT0gYSA/IFwiXCIgOiAoYSArIFwiXCIpLnJlcGxhY2UocywgXCJcIilcbiAgICAgICAgfSxcbiAgICAgICAgbWFrZUFycmF5OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSBiIHx8IFtdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgIT0gYSAmJiAodyhPYmplY3QoYSkpID8gci5tZXJnZShjLCBcInN0cmluZ1wiID09IHR5cGVvZiBhID8gW2FdIDogYSkgOiBoLmNhbGwoYywgYSkpLCBjXG4gICAgICAgIH0sXG4gICAgICAgIGluQXJyYXk6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBiID8gLTEgOiBpLmNhbGwoYiwgYSwgYylcbiAgICAgICAgfSxcbiAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gK2IubGVuZ3RoLCBkID0gMCwgZSA9IGEubGVuZ3RoOyBkIDwgYzsgZCsrKSBhW2UrK10gPSBiW2RdO1xuICAgICAgICAgICAgcmV0dXJuIGEubGVuZ3RoID0gZSwgYVxuICAgICAgICB9LFxuICAgICAgICBncmVwOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgZm9yICh2YXIgZCwgZSA9IFtdLCBmID0gMCwgZyA9IGEubGVuZ3RoLCBoID0gIWM7IGYgPCBnOyBmKyspIGQgPSAhYihhW2ZdLCBmKSwgZCAhPT0gaCAmJiBlLnB1c2goYVtmXSk7XG4gICAgICAgICAgICByZXR1cm4gZVxuICAgICAgICB9LFxuICAgICAgICBtYXA6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZCwgZSwgZiA9IDAsXG4gICAgICAgICAgICAgICAgaCA9IFtdO1xuICAgICAgICAgICAgaWYgKHcoYSkpXG4gICAgICAgICAgICAgICAgZm9yIChkID0gYS5sZW5ndGg7IGYgPCBkOyBmKyspIGUgPSBiKGFbZl0sIGYsIGMpLCBudWxsICE9IGUgJiYgaC5wdXNoKGUpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvciAoZiBpbiBhKSBlID0gYihhW2ZdLCBmLCBjKSwgbnVsbCAhPSBlICYmIGgucHVzaChlKTtcbiAgICAgICAgICAgIHJldHVybiBnLmFwcGx5KFtdLCBoKVxuICAgICAgICB9LFxuICAgICAgICBndWlkOiAxLFxuICAgICAgICBwcm94eTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjLCBkLCBlO1xuICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIGIgJiYgKGMgPSBhW2JdLCBiID0gYSwgYSA9IGMpLCByLmlzRnVuY3Rpb24oYSkpIHJldHVybiBkID0gZi5jYWxsKGFyZ3VtZW50cywgMiksIGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuYXBwbHkoYiB8fCB0aGlzLCBkLmNvbmNhdChmLmNhbGwoYXJndW1lbnRzKSkpXG4gICAgICAgICAgICB9LCBlLmd1aWQgPSBhLmd1aWQgPSBhLmd1aWQgfHwgci5ndWlkKyssIGVcbiAgICAgICAgfSxcbiAgICAgICAgbm93OiBEYXRlLm5vdyxcbiAgICAgICAgc3VwcG9ydDogb1xuICAgIH0pLCBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiAoci5mbltTeW1ib2wuaXRlcmF0b3JdID0gY1tTeW1ib2wuaXRlcmF0b3JdKSwgci5lYWNoKFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvciBTeW1ib2xcIi5zcGxpdChcIiBcIiksIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGpbXCJbb2JqZWN0IFwiICsgYiArIFwiXVwiXSA9IGIudG9Mb3dlckNhc2UoKVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdyhhKSB7XG4gICAgICAgIHZhciBiID0gISFhICYmIFwibGVuZ3RoXCIgaW4gYSAmJiBhLmxlbmd0aCxcbiAgICAgICAgICAgIGMgPSByLnR5cGUoYSk7XG4gICAgICAgIHJldHVybiBcImZ1bmN0aW9uXCIgIT09IGMgJiYgIXIuaXNXaW5kb3coYSkgJiYgKFwiYXJyYXlcIiA9PT0gYyB8fCAwID09PSBiIHx8IFwibnVtYmVyXCIgPT0gdHlwZW9mIGIgJiYgYiA+IDAgJiYgYiAtIDEgaW4gYSlcbiAgICB9XG4gICAgdmFyIHggPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgaiwgaywgbCwgbSwgbiwgbywgcCwgcSwgciwgcywgdCwgdSA9IFwic2l6emxlXCIgKyAxICogbmV3IERhdGUsXG4gICAgICAgICAgICB2ID0gYS5kb2N1bWVudCxcbiAgICAgICAgICAgIHcgPSAwLFxuICAgICAgICAgICAgeCA9IDAsXG4gICAgICAgICAgICB5ID0gaGEoKSxcbiAgICAgICAgICAgIHogPSBoYSgpLFxuICAgICAgICAgICAgQSA9IGhhKCksXG4gICAgICAgICAgICBCID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA9PT0gYiAmJiAobCA9ICEwKSwgMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEMgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgICAgICAgIEQgPSBbXSxcbiAgICAgICAgICAgIEUgPSBELnBvcCxcbiAgICAgICAgICAgIEYgPSBELnB1c2gsXG4gICAgICAgICAgICBHID0gRC5wdXNoLFxuICAgICAgICAgICAgSCA9IEQuc2xpY2UsXG4gICAgICAgICAgICBJID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMCwgZCA9IGEubGVuZ3RoOyBjIDwgZDsgYysrKVxuICAgICAgICAgICAgICAgICAgICBpZiAoYVtjXSA9PT0gYikgcmV0dXJuIGM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSiA9IFwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufGlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixcbiAgICAgICAgICAgIEsgPSBcIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsXG4gICAgICAgICAgICBMID0gXCIoPzpcXFxcXFxcXC58W1xcXFx3LV18W15cXDAtXFxcXHhhMF0pK1wiLFxuICAgICAgICAgICAgTSA9IFwiXFxcXFtcIiArIEsgKyBcIiooXCIgKyBMICsgXCIpKD86XCIgKyBLICsgXCIqKFsqXiR8IX5dPz0pXCIgKyBLICsgXCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIiArIEwgKyBcIikpfClcIiArIEsgKyBcIipcXFxcXVwiLFxuICAgICAgICAgICAgTiA9IFwiOihcIiArIEwgKyBcIikoPzpcXFxcKCgoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXwoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIgKyBNICsgXCIpKil8LiopXFxcXCl8KVwiLFxuICAgICAgICAgICAgTyA9IG5ldyBSZWdFeHAoSyArIFwiK1wiLCBcImdcIiksXG4gICAgICAgICAgICBQID0gbmV3IFJlZ0V4cChcIl5cIiArIEsgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgKyBLICsgXCIrJFwiLCBcImdcIiksXG4gICAgICAgICAgICBRID0gbmV3IFJlZ0V4cChcIl5cIiArIEsgKyBcIiosXCIgKyBLICsgXCIqXCIpLFxuICAgICAgICAgICAgUiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBLICsgXCIqKFs+K35dfFwiICsgSyArIFwiKVwiICsgSyArIFwiKlwiKSxcbiAgICAgICAgICAgIFMgPSBuZXcgUmVnRXhwKFwiPVwiICsgSyArIFwiKihbXlxcXFxdJ1xcXCJdKj8pXCIgKyBLICsgXCIqXFxcXF1cIiwgXCJnXCIpLFxuICAgICAgICAgICAgVCA9IG5ldyBSZWdFeHAoTiksXG4gICAgICAgICAgICBVID0gbmV3IFJlZ0V4cChcIl5cIiArIEwgKyBcIiRcIiksXG4gICAgICAgICAgICBWID0ge1xuICAgICAgICAgICAgICAgIElEOiBuZXcgUmVnRXhwKFwiXiMoXCIgKyBMICsgXCIpXCIpLFxuICAgICAgICAgICAgICAgIENMQVNTOiBuZXcgUmVnRXhwKFwiXlxcXFwuKFwiICsgTCArIFwiKVwiKSxcbiAgICAgICAgICAgICAgICBUQUc6IG5ldyBSZWdFeHAoXCJeKFwiICsgTCArIFwifFsqXSlcIiksXG4gICAgICAgICAgICAgICAgQVRUUjogbmV3IFJlZ0V4cChcIl5cIiArIE0pLFxuICAgICAgICAgICAgICAgIFBTRVVETzogbmV3IFJlZ0V4cChcIl5cIiArIE4pLFxuICAgICAgICAgICAgICAgIENISUxEOiBuZXcgUmVnRXhwKFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIiArIEsgKyBcIiooZXZlbnxvZGR8KChbKy1dfCkoXFxcXGQqKW58KVwiICsgSyArIFwiKig/OihbKy1dfClcIiArIEsgKyBcIiooXFxcXGQrKXwpKVwiICsgSyArIFwiKlxcXFwpfClcIiwgXCJpXCIpLFxuICAgICAgICAgICAgICAgIGJvb2w6IG5ldyBSZWdFeHAoXCJeKD86XCIgKyBKICsgXCIpJFwiLCBcImlcIiksXG4gICAgICAgICAgICAgICAgbmVlZHNDb250ZXh0OiBuZXcgUmVnRXhwKFwiXlwiICsgSyArIFwiKls+K35dfDooZXZlbnxvZGR8ZXF8Z3R8bHR8bnRofGZpcnN0fGxhc3QpKD86XFxcXChcIiArIEsgKyBcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyBLICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVyA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG4gICAgICAgICAgICBYID0gL15oXFxkJC9pLFxuICAgICAgICAgICAgWSA9IC9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXG4gICAgICAgICAgICBaID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG4gICAgICAgICAgICAkID0gL1srfl0vLFxuICAgICAgICAgICAgXyA9IG5ldyBSZWdFeHAoXCJcXFxcXFxcXChbXFxcXGRhLWZdezEsNn1cIiArIEsgKyBcIj98KFwiICsgSyArIFwiKXwuKVwiLCBcImlnXCIpLFxuICAgICAgICAgICAgYWEgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgICAgIHZhciBkID0gXCIweFwiICsgYiAtIDY1NTM2O1xuICAgICAgICAgICAgICAgIHJldHVybiBkICE9PSBkIHx8IGMgPyBiIDogZCA8IDAgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGQgKyA2NTUzNikgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGQgPj4gMTAgfCA1NTI5NiwgMTAyMyAmIGQgfCA1NjMyMClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiYSA9IC8oW1xcMC1cXHgxZlxceDdmXXxeLT9cXGQpfF4tJHxbXlxcMC1cXHgxZlxceDdmLVxcdUZGRkZcXHctXS9nLFxuICAgICAgICAgICAgY2EgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiID8gXCJcXDBcIiA9PT0gYSA/IFwiXFx1ZmZmZFwiIDogYS5zbGljZSgwLCAtMSkgKyBcIlxcXFxcIiArIGEuY2hhckNvZGVBdChhLmxlbmd0aCAtIDEpLnRvU3RyaW5nKDE2KSArIFwiIFwiIDogXCJcXFxcXCIgKyBhXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbSgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWEgPSB0YShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmRpc2FibGVkID09PSAhMCAmJiAoXCJmb3JtXCIgaW4gYSB8fCBcImxhYmVsXCIgaW4gYSlcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkaXI6IFwicGFyZW50Tm9kZVwiLFxuICAgICAgICAgICAgICAgIG5leHQ6IFwibGVnZW5kXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgRy5hcHBseShEID0gSC5jYWxsKHYuY2hpbGROb2RlcyksIHYuY2hpbGROb2RlcyksIERbdi5jaGlsZE5vZGVzLmxlbmd0aF0ubm9kZVR5cGVcbiAgICAgICAgfSBjYXRjaCAoZmEpIHtcbiAgICAgICAgICAgIEcgPSB7XG4gICAgICAgICAgICAgICAgYXBwbHk6IEQubGVuZ3RoID8gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgRi5hcHBseShhLCBILmNhbGwoYikpXG4gICAgICAgICAgICAgICAgfSA6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gYS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGFbYysrXSA9IGJbZCsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGEubGVuZ3RoID0gYyAtIDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnYShhLCBiLCBkLCBlKSB7XG4gICAgICAgICAgICB2YXIgZiwgaCwgaiwgaywgbCwgbywgciwgcyA9IGIgJiYgYi5vd25lckRvY3VtZW50LFxuICAgICAgICAgICAgICAgIHcgPSBiID8gYi5ub2RlVHlwZSA6IDk7XG4gICAgICAgICAgICBpZiAoZCA9IGQgfHwgW10sIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEgfHwgIWEgfHwgMSAhPT0gdyAmJiA5ICE9PSB3ICYmIDExICE9PSB3KSByZXR1cm4gZDtcbiAgICAgICAgICAgIGlmICghZSAmJiAoKGIgPyBiLm93bmVyRG9jdW1lbnQgfHwgYiA6IHYpICE9PSBuICYmIG0oYiksIGIgPSBiIHx8IG4sIHApKSB7XG4gICAgICAgICAgICAgICAgaWYgKDExICE9PSB3ICYmIChsID0gWi5leGVjKGEpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGYgPSBsWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoOSA9PT0gdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGogPSBiLmdldEVsZW1lbnRCeUlkKGYpKSkgcmV0dXJuIGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGouaWQgPT09IGYpIHJldHVybiBkLnB1c2goaiksIGRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocyAmJiAoaiA9IHMuZ2V0RWxlbWVudEJ5SWQoZikpICYmIHQoYiwgaikgJiYgai5pZCA9PT0gZikgcmV0dXJuIGQucHVzaChqKSwgZFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxbMl0pIHJldHVybiBHLmFwcGx5KGQsIGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSkpLCBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmID0gbFszXSkgJiYgYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkgcmV0dXJuIEcuYXBwbHkoZCwgYi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGYpKSwgZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGMucXNhICYmICFBW2EgKyBcIiBcIl0gJiYgKCFxIHx8ICFxLnRlc3QoYSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxICE9PSB3KSBzID0gYiwgciA9IGE7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwib2JqZWN0XCIgIT09IGIubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGsgPSBiLmdldEF0dHJpYnV0ZShcImlkXCIpKSA/IGsgPSBrLnJlcGxhY2UoYmEsIGNhKTogYi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBrID0gdSksIG8gPSBnKGEpLCBoID0gby5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaC0tKSBvW2hdID0gXCIjXCIgKyBrICsgXCIgXCIgKyBzYShvW2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBvLmpvaW4oXCIsXCIpLCBzID0gJC50ZXN0KGEpICYmIHFhKGIucGFyZW50Tm9kZSkgfHwgYlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyKSB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEcuYXBwbHkoZCwgcy5xdWVyeVNlbGVjdG9yQWxsKHIpKSwgZFxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoICh4KSB7fSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPT09IHUgJiYgYi5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGkoYS5yZXBsYWNlKFAsIFwiJDFcIiksIGIsIGQsIGUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYSgpIHtcbiAgICAgICAgICAgIHZhciBhID0gW107XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGIoYywgZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnB1c2goYyArIFwiIFwiKSA+IGQuY2FjaGVMZW5ndGggJiYgZGVsZXRlIGJbYS5zaGlmdCgpXSwgYltjICsgXCIgXCJdID0gZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlhKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhW3VdID0gITAsIGFcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGphKGEpIHtcbiAgICAgICAgICAgIHZhciBiID0gbi5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWEoYilcbiAgICAgICAgICAgIH0gY2F0Y2ggKGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gITFcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgYi5wYXJlbnROb2RlICYmIGIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKSwgYiA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGthKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjID0gYS5zcGxpdChcInxcIiksXG4gICAgICAgICAgICAgICAgZSA9IGMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGUtLSkgZC5hdHRySGFuZGxlW2NbZV1dID0gYlxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGEoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSBiICYmIGEsXG4gICAgICAgICAgICAgICAgZCA9IGMgJiYgMSA9PT0gYS5ub2RlVHlwZSAmJiAxID09PSBiLm5vZGVUeXBlICYmIGEuc291cmNlSW5kZXggLSBiLnNvdXJjZUluZGV4O1xuICAgICAgICAgICAgaWYgKGQpIHJldHVybiBkO1xuICAgICAgICAgICAgaWYgKGMpXG4gICAgICAgICAgICAgICAgd2hpbGUgKGMgPSBjLm5leHRTaWJsaW5nKVxuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gYikgcmV0dXJuIC0xO1xuICAgICAgICAgICAgcmV0dXJuIGEgPyAxIDogLTFcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHZhciBjID0gYi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImlucHV0XCIgPT09IGMgJiYgYi50eXBlID09PSBhXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBuYShhKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFwiaW5wdXRcIiA9PT0gYyB8fCBcImJ1dHRvblwiID09PSBjKSAmJiBiLnR5cGUgPT09IGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9hKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImZvcm1cIiBpbiBiID8gYi5wYXJlbnROb2RlICYmIGIuZGlzYWJsZWQgPT09ICExID8gXCJsYWJlbFwiIGluIGIgPyBcImxhYmVsXCIgaW4gYi5wYXJlbnROb2RlID8gYi5wYXJlbnROb2RlLmRpc2FibGVkID09PSBhIDogYi5kaXNhYmxlZCA9PT0gYSA6IGIuaXNEaXNhYmxlZCA9PT0gYSB8fCBiLmlzRGlzYWJsZWQgIT09ICFhICYmIGVhKGIpID09PSBhIDogYi5kaXNhYmxlZCA9PT0gYSA6IFwibGFiZWxcIiBpbiBiICYmIGIuZGlzYWJsZWQgPT09IGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBhKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBpYShmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiID0gK2IsIGlhKGZ1bmN0aW9uIChjLCBkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlLCBmID0gYShbXSwgYy5sZW5ndGgsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGYubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZy0tKSBjW2UgPSBmW2ddXSAmJiAoY1tlXSA9ICEoZFtlXSA9IGNbZV0pKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcWEoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYS5nZXRFbGVtZW50c0J5VGFnTmFtZSAmJiBhXG4gICAgICAgIH1cbiAgICAgICAgYyA9IGdhLnN1cHBvcnQgPSB7fSwgZiA9IGdhLmlzWE1MID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiID0gYSAmJiAoYS5vd25lckRvY3VtZW50IHx8IGEpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIHJldHVybiAhIWIgJiYgXCJIVE1MXCIgIT09IGIubm9kZU5hbWVcbiAgICAgICAgfSwgbSA9IGdhLnNldERvY3VtZW50ID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiLCBlLCBnID0gYSA/IGEub3duZXJEb2N1bWVudCB8fCBhIDogdjtcbiAgICAgICAgICAgIHJldHVybiBnICE9PSBuICYmIDkgPT09IGcubm9kZVR5cGUgJiYgZy5kb2N1bWVudEVsZW1lbnQgPyAobiA9IGcsIG8gPSBuLmRvY3VtZW50RWxlbWVudCwgcCA9ICFmKG4pLCB2ICE9PSBuICYmIChlID0gbi5kZWZhdWx0VmlldykgJiYgZS50b3AgIT09IGUgJiYgKGUuYWRkRXZlbnRMaXN0ZW5lciA/IGUuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCBkYSwgITEpIDogZS5hdHRhY2hFdmVudCAmJiBlLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIiwgZGEpKSwgYy5hdHRyaWJ1dGVzID0gamEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5jbGFzc05hbWUgPSBcImlcIiwgIWEuZ2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIpXG4gICAgICAgICAgICB9KSwgYy5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGphKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuYXBwZW5kQ2hpbGQobi5jcmVhdGVDb21tZW50KFwiXCIpKSwgIWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLmxlbmd0aFxuICAgICAgICAgICAgfSksIGMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IFkudGVzdChuLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpLCBjLmdldEJ5SWQgPSBqYShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmFwcGVuZENoaWxkKGEpLmlkID0gdSwgIW4uZ2V0RWxlbWVudHNCeU5hbWUgfHwgIW4uZ2V0RWxlbWVudHNCeU5hbWUodSkubGVuZ3RoXG4gICAgICAgICAgICB9KSwgYy5nZXRCeUlkID8gKGQuZmlsdGVyLklEID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGEucmVwbGFjZShfLCBhYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZC5maW5kLklEID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYi5nZXRFbGVtZW50QnlJZCAmJiBwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gYi5nZXRFbGVtZW50QnlJZChhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMgPyBbY10gOiBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pIDogKGQuZmlsdGVyLklEID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGEucmVwbGFjZShfLCBhYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYS5nZXRBdHRyaWJ1dGVOb2RlICYmIGEuZ2V0QXR0cmlidXRlTm9kZShcImlkXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYyAmJiBjLnZhbHVlID09PSBiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZC5maW5kLklEID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYi5nZXRFbGVtZW50QnlJZCAmJiBwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjLCBkLCBlLCBmID0gYi5nZXRFbGVtZW50QnlJZChhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID0gZi5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIiksIGMgJiYgYy52YWx1ZSA9PT0gYSkgcmV0dXJuIFtmXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBiLmdldEVsZW1lbnRzQnlOYW1lKGEpLCBkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChmID0gZVtkKytdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID0gZi5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIiksIGMgJiYgYy52YWx1ZSA9PT0gYSkgcmV0dXJuIFtmXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLCBkLmZpbmQuVEFHID0gYy5nZXRFbGVtZW50c0J5VGFnTmFtZSA/IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPyBiLmdldEVsZW1lbnRzQnlUYWdOYW1lKGEpIDogYy5xc2EgPyBiLnF1ZXJ5U2VsZWN0b3JBbGwoYSkgOiB2b2lkIDBcbiAgICAgICAgICAgIH0gOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciBjLCBkID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGUgPSAwLFxuICAgICAgICAgICAgICAgICAgICBmID0gYi5nZXRFbGVtZW50c0J5VGFnTmFtZShhKTtcbiAgICAgICAgICAgICAgICBpZiAoXCIqXCIgPT09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGMgPSBmW2UrK10pIDEgPT09IGMubm9kZVR5cGUgJiYgZC5wdXNoKGMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZlxuICAgICAgICAgICAgfSwgZC5maW5kLkNMQVNTID0gYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJiBwKSByZXR1cm4gYi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGEpXG4gICAgICAgICAgICB9LCByID0gW10sIHEgPSBbXSwgKGMucXNhID0gWS50ZXN0KG4ucXVlcnlTZWxlY3RvckFsbCkpICYmIChqYShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIG8uYXBwZW5kQ2hpbGQoYSkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyB1ICsgXCInPjwvYT48c2VsZWN0IGlkPSdcIiArIHUgKyBcIi1cXHJcXFxcJyBtc2FsbG93Y2FwdHVyZT0nJz48b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiLCBhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGggJiYgcS5wdXNoKFwiWypeJF09XCIgKyBLICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIpLCBhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc2VsZWN0ZWRdXCIpLmxlbmd0aCB8fCBxLnB1c2goXCJcXFxcW1wiICsgSyArIFwiKig/OnZhbHVlfFwiICsgSiArIFwiKVwiKSwgYS5xdWVyeVNlbGVjdG9yQWxsKFwiW2lkfj1cIiArIHUgKyBcIi1dXCIpLmxlbmd0aCB8fCBxLnB1c2goXCJ+PVwiKSwgYS5xdWVyeVNlbGVjdG9yQWxsKFwiOmNoZWNrZWRcIikubGVuZ3RoIHx8IHEucHVzaChcIjpjaGVja2VkXCIpLCBhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJhI1wiICsgdSArIFwiKypcIikubGVuZ3RoIHx8IHEucHVzaChcIi4jLitbK35dXCIpXG4gICAgICAgICAgICB9KSwgamEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICBhLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nJyBkaXNhYmxlZD0nZGlzYWJsZWQnPjwvYT48c2VsZWN0IGRpc2FibGVkPSdkaXNhYmxlZCc+PG9wdGlvbi8+PC9zZWxlY3Q+XCI7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBuLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICBiLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJoaWRkZW5cIiksIGEuYXBwZW5kQ2hpbGQoYikuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcIkRcIiksIGEucXVlcnlTZWxlY3RvckFsbChcIltuYW1lPWRdXCIpLmxlbmd0aCAmJiBxLnB1c2goXCJuYW1lXCIgKyBLICsgXCIqWypeJHwhfl0/PVwiKSwgMiAhPT0gYS5xdWVyeVNlbGVjdG9yQWxsKFwiOmVuYWJsZWRcIikubGVuZ3RoICYmIHEucHVzaChcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIpLCBvLmFwcGVuZENoaWxkKGEpLmRpc2FibGVkID0gITAsIDIgIT09IGEucXVlcnlTZWxlY3RvckFsbChcIjpkaXNhYmxlZFwiKS5sZW5ndGggJiYgcS5wdXNoKFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiksIGEucXVlcnlTZWxlY3RvckFsbChcIiosOnhcIiksIHEucHVzaChcIiwuKjpcIilcbiAgICAgICAgICAgIH0pKSwgKGMubWF0Y2hlc1NlbGVjdG9yID0gWS50ZXN0KHMgPSBvLm1hdGNoZXMgfHwgby53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgby5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgby5vTWF0Y2hlc1NlbGVjdG9yIHx8IG8ubXNNYXRjaGVzU2VsZWN0b3IpKSAmJiBqYShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIGMuZGlzY29ubmVjdGVkTWF0Y2ggPSBzLmNhbGwoYSwgXCIqXCIpLCBzLmNhbGwoYSwgXCJbcyE9JyddOnhcIiksIHIucHVzaChcIiE9XCIsIE4pXG4gICAgICAgICAgICB9KSwgcSA9IHEubGVuZ3RoICYmIG5ldyBSZWdFeHAocS5qb2luKFwifFwiKSksIHIgPSByLmxlbmd0aCAmJiBuZXcgUmVnRXhwKHIuam9pbihcInxcIikpLCBiID0gWS50ZXN0KG8uY29tcGFyZURvY3VtZW50UG9zaXRpb24pLCB0ID0gYiB8fCBZLnRlc3Qoby5jb250YWlucykgPyBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciBjID0gOSA9PT0gYS5ub2RlVHlwZSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhID09PSBkIHx8ICEoIWQgfHwgMSAhPT0gZC5ub2RlVHlwZSB8fCAhKGMuY29udGFpbnMgPyBjLmNvbnRhaW5zKGQpIDogYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiAxNiAmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZCkpKVxuICAgICAgICAgICAgfSA6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIpXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChiID0gYi5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgPT09IGEpIHJldHVybiAhMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gITFcbiAgICAgICAgICAgIH0sIEIgPSBiID8gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGwgPSAhMCwgMDtcbiAgICAgICAgICAgICAgICB2YXIgZCA9ICFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIC0gIWIuY29tcGFyZURvY3VtZW50UG9zaXRpb247XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQgPyBkIDogKGQgPSAoYS5vd25lckRvY3VtZW50IHx8IGEpID09PSAoYi5vd25lckRvY3VtZW50IHx8IGIpID8gYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSA6IDEsIDEgJiBkIHx8ICFjLnNvcnREZXRhY2hlZCAmJiBiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGEpID09PSBkID8gYSA9PT0gbiB8fCBhLm93bmVyRG9jdW1lbnQgPT09IHYgJiYgdCh2LCBhKSA/IC0xIDogYiA9PT0gbiB8fCBiLm93bmVyRG9jdW1lbnQgPT09IHYgJiYgdCh2LCBiKSA/IDEgOiBrID8gSShrLCBhKSAtIEkoaywgYikgOiAwIDogNCAmIGQgPyAtMSA6IDEpXG4gICAgICAgICAgICB9IDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGwgPSAhMCwgMDtcbiAgICAgICAgICAgICAgICB2YXIgYywgZCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGUgPSBhLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGYgPSBiLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGcgPSBbYV0sXG4gICAgICAgICAgICAgICAgICAgIGggPSBbYl07XG4gICAgICAgICAgICAgICAgaWYgKCFlIHx8ICFmKSByZXR1cm4gYSA9PT0gbiA/IC0xIDogYiA9PT0gbiA/IDEgOiBlID8gLTEgOiBmID8gMSA6IGsgPyBJKGssIGEpIC0gSShrLCBiKSA6IDA7XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IGYpIHJldHVybiBsYShhLCBiKTtcbiAgICAgICAgICAgICAgICBjID0gYTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoYyA9IGMucGFyZW50Tm9kZSkgZy51bnNoaWZ0KGMpO1xuICAgICAgICAgICAgICAgIGMgPSBiO1xuICAgICAgICAgICAgICAgIHdoaWxlIChjID0gYy5wYXJlbnROb2RlKSBoLnVuc2hpZnQoYyk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGdbZF0gPT09IGhbZF0pIGQrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gZCA/IGxhKGdbZF0sIGhbZF0pIDogZ1tkXSA9PT0gdiA/IC0xIDogaFtkXSA9PT0gdiA/IDEgOiAwXG4gICAgICAgICAgICB9LCBuKSA6IG5cbiAgICAgICAgfSwgZ2EubWF0Y2hlcyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2EoYSwgbnVsbCwgbnVsbCwgYilcbiAgICAgICAgfSwgZ2EubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmICgoYS5vd25lckRvY3VtZW50IHx8IGEpICE9PSBuICYmIG0oYSksIGIgPSBiLnJlcGxhY2UoUywgXCI9JyQxJ11cIiksIGMubWF0Y2hlc1NlbGVjdG9yICYmIHAgJiYgIUFbYiArIFwiIFwiXSAmJiAoIXIgfHwgIXIudGVzdChiKSkgJiYgKCFxIHx8ICFxLnRlc3QoYikpKSB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBkID0gcy5jYWxsKGEsIGIpO1xuICAgICAgICAgICAgICAgIGlmIChkIHx8IGMuZGlzY29ubmVjdGVkTWF0Y2ggfHwgYS5kb2N1bWVudCAmJiAxMSAhPT0gYS5kb2N1bWVudC5ub2RlVHlwZSkgcmV0dXJuIGRcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICByZXR1cm4gZ2EoYiwgbiwgbnVsbCwgW2FdKS5sZW5ndGggPiAwXG4gICAgICAgIH0sIGdhLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5vd25lckRvY3VtZW50IHx8IGEpICE9PSBuICYmIG0oYSksIHQoYSwgYilcbiAgICAgICAgfSwgZ2EuYXR0ciA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAoYS5vd25lckRvY3VtZW50IHx8IGEpICE9PSBuICYmIG0oYSk7XG4gICAgICAgICAgICB2YXIgZSA9IGQuYXR0ckhhbmRsZVtiLnRvTG93ZXJDYXNlKCldLFxuICAgICAgICAgICAgICAgIGYgPSBlICYmIEMuY2FsbChkLmF0dHJIYW5kbGUsIGIudG9Mb3dlckNhc2UoKSkgPyBlKGEsIGIsICFwKSA6IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDAgIT09IGYgPyBmIDogYy5hdHRyaWJ1dGVzIHx8ICFwID8gYS5nZXRBdHRyaWJ1dGUoYikgOiAoZiA9IGEuZ2V0QXR0cmlidXRlTm9kZShiKSkgJiYgZi5zcGVjaWZpZWQgPyBmLnZhbHVlIDogbnVsbFxuICAgICAgICB9LCBnYS5lc2NhcGUgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIChhICsgXCJcIikucmVwbGFjZShiYSwgY2EpXG4gICAgICAgIH0sIGdhLmVycm9yID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN5bnRheCBlcnJvciwgdW5yZWNvZ25pemVkIGV4cHJlc3Npb246IFwiICsgYSlcbiAgICAgICAgfSwgZ2EudW5pcXVlU29ydCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiwgZCA9IFtdLFxuICAgICAgICAgICAgICAgIGUgPSAwLFxuICAgICAgICAgICAgICAgIGYgPSAwO1xuICAgICAgICAgICAgaWYgKGwgPSAhYy5kZXRlY3REdXBsaWNhdGVzLCBrID0gIWMuc29ydFN0YWJsZSAmJiBhLnNsaWNlKDApLCBhLnNvcnQoQiksIGwpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoYiA9IGFbZisrXSkgYiA9PT0gYVtmXSAmJiAoZSA9IGQucHVzaChmKSk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGUtLSkgYS5zcGxpY2UoZFtlXSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrID0gbnVsbCwgYVxuICAgICAgICB9LCBlID0gZ2EuZ2V0VGV4dCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiwgYyA9IFwiXCIsXG4gICAgICAgICAgICAgICAgZCA9IDAsXG4gICAgICAgICAgICAgICAgZiA9IGEubm9kZVR5cGU7XG4gICAgICAgICAgICBpZiAoZikge1xuICAgICAgICAgICAgICAgIGlmICgxID09PSBmIHx8IDkgPT09IGYgfHwgMTEgPT09IGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIGEudGV4dENvbnRlbnQpIHJldHVybiBhLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGEgPSBhLmZpcnN0Q2hpbGQ7IGE7IGEgPSBhLm5leHRTaWJsaW5nKSBjICs9IGUoYSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKDMgPT09IGYgfHwgNCA9PT0gZikgcmV0dXJuIGEubm9kZVZhbHVlXG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB3aGlsZSAoYiA9IGFbZCsrXSkgYyArPSBlKGIpO1xuICAgICAgICAgICAgcmV0dXJuIGNcbiAgICAgICAgfSwgZCA9IGdhLnNlbGVjdG9ycyA9IHtcbiAgICAgICAgICAgIGNhY2hlTGVuZ3RoOiA1MCxcbiAgICAgICAgICAgIGNyZWF0ZVBzZXVkbzogaWEsXG4gICAgICAgICAgICBtYXRjaDogVixcbiAgICAgICAgICAgIGF0dHJIYW5kbGU6IHt9LFxuICAgICAgICAgICAgZmluZDoge30sXG4gICAgICAgICAgICByZWxhdGl2ZToge1xuICAgICAgICAgICAgICAgIFwiPlwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpcjogXCJwYXJlbnROb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiAhMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIgXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlyOiBcInBhcmVudE5vZGVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIrXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlyOiBcInByZXZpb3VzU2libGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdDogITBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiflwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmVGaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBBVFRSOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVsxXSA9IGFbMV0ucmVwbGFjZShfLCBhYSksIGFbM10gPSAoYVszXSB8fCBhWzRdIHx8IGFbNV0gfHwgXCJcIikucmVwbGFjZShfLCBhYSksIFwifj1cIiA9PT0gYVsyXSAmJiAoYVszXSA9IFwiIFwiICsgYVszXSArIFwiIFwiKSwgYS5zbGljZSgwLCA0KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQ0hJTEQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhWzFdID0gYVsxXS50b0xvd2VyQ2FzZSgpLCBcIm50aFwiID09PSBhWzFdLnNsaWNlKDAsIDMpID8gKGFbM10gfHwgZ2EuZXJyb3IoYVswXSksIGFbNF0gPSArKGFbNF0gPyBhWzVdICsgKGFbNl0gfHwgMSkgOiAyICogKFwiZXZlblwiID09PSBhWzNdIHx8IFwib2RkXCIgPT09IGFbM10pKSwgYVs1XSA9ICsoYVs3XSArIGFbOF0gfHwgXCJvZGRcIiA9PT0gYVszXSkpIDogYVszXSAmJiBnYS5lcnJvcihhWzBdKSwgYVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUFNFVURPOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiwgYyA9ICFhWzZdICYmIGFbMl07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBWLkNISUxELnRlc3QoYVswXSkgPyBudWxsIDogKGFbM10gPyBhWzJdID0gYVs0XSB8fCBhWzVdIHx8IFwiXCIgOiBjICYmIFQudGVzdChjKSAmJiAoYiA9IGcoYywgITApKSAmJiAoYiA9IGMuaW5kZXhPZihcIilcIiwgYy5sZW5ndGggLSBiKSAtIGMubGVuZ3RoKSAmJiAoYVswXSA9IGFbMF0uc2xpY2UoMCwgYiksIGFbMl0gPSBjLnNsaWNlKDAsIGIpKSwgYS5zbGljZSgwLCAzKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgVEFHOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGEucmVwbGFjZShfLCBhYSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiKlwiID09PSBhID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEwXG4gICAgICAgICAgICAgICAgICAgIH0gOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubm9kZU5hbWUgJiYgYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENMQVNTOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IHlbYSArIFwiIFwiXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIgfHwgKGIgPSBuZXcgUmVnRXhwKFwiKF58XCIgKyBLICsgXCIpXCIgKyBhICsgXCIoXCIgKyBLICsgXCJ8JClcIikpICYmIHkoYSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiLnRlc3QoXCJzdHJpbmdcIiA9PSB0eXBlb2YgYS5jbGFzc05hbWUgJiYgYS5jbGFzc05hbWUgfHwgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYS5nZXRBdHRyaWJ1dGUgJiYgYS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQVRUUjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGdhLmF0dHIoZCwgYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBlID8gXCIhPVwiID09PSBiIDogIWIgfHwgKGUgKz0gXCJcIiwgXCI9XCIgPT09IGIgPyBlID09PSBjIDogXCIhPVwiID09PSBiID8gZSAhPT0gYyA6IFwiXj1cIiA9PT0gYiA/IGMgJiYgMCA9PT0gZS5pbmRleE9mKGMpIDogXCIqPVwiID09PSBiID8gYyAmJiBlLmluZGV4T2YoYykgPiAtMSA6IFwiJD1cIiA9PT0gYiA/IGMgJiYgZS5zbGljZSgtYy5sZW5ndGgpID09PSBjIDogXCJ+PVwiID09PSBiID8gKFwiIFwiICsgZS5yZXBsYWNlKE8sIFwiIFwiKSArIFwiIFwiKS5pbmRleE9mKGMpID4gLTEgOiBcInw9XCIgPT09IGIgJiYgKGUgPT09IGMgfHwgZS5zbGljZSgwLCBjLmxlbmd0aCArIDEpID09PSBjICsgXCItXCIpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDSElMRDogZnVuY3Rpb24gKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBcIm50aFwiICE9PSBhLnNsaWNlKDAsIDMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IFwibGFzdFwiICE9PSBhLnNsaWNlKC00KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBcIm9mLXR5cGVcIiA9PT0gYjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEgPT09IGQgJiYgMCA9PT0gZSA/IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFhLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgICAgfSA6IGZ1bmN0aW9uIChiLCBjLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaiwgaywgbCwgbSwgbiwgbywgcCA9IGYgIT09IGcgPyBcIm5leHRTaWJsaW5nXCIgOiBcInByZXZpb3VzU2libGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEgPSBiLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGggJiYgYi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSAhaSAmJiAhaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtID0gYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChtID0gbVtwXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaCA/IG0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gciA6IDEgPT09IG0ubm9kZVR5cGUpIHJldHVybiAhMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8gPSBwID0gXCJvbmx5XCIgPT09IGEgJiYgIW8gJiYgXCJuZXh0U2libGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvID0gW2cgPyBxLmZpcnN0Q2hpbGQgOiBxLmxhc3RDaGlsZF0sIGcgJiYgcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtID0gcSwgbCA9IG1bdV0gfHwgKG1bdV0gPSB7fSksIGsgPSBsW20udW5pcXVlSURdIHx8IChsW20udW5pcXVlSURdID0ge30pLCBqID0ga1thXSB8fCBbXSwgbiA9IGpbMF0gPT09IHcgJiYgalsxXSwgdCA9IG4gJiYgalsyXSwgbSA9IG4gJiYgcS5jaGlsZE5vZGVzW25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobSA9ICsrbiAmJiBtICYmIG1bcF0gfHwgKHQgPSBuID0gMCkgfHwgby5wb3AoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBtLm5vZGVUeXBlICYmICsrdCAmJiBtID09PSBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga1thXSA9IFt3LCBuLCB0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocyAmJiAobSA9IGIsIGwgPSBtW3VdIHx8IChtW3VdID0ge30pLCBrID0gbFttLnVuaXF1ZUlEXSB8fCAobFttLnVuaXF1ZUlEXSA9IHt9KSwgaiA9IGtbYV0gfHwgW10sIG4gPSBqWzBdID09PSB3ICYmIGpbMV0sIHQgPSBuKSwgdCA9PT0gITEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChtID0gKytuICYmIG0gJiYgbVtwXSB8fCAodCA9IG4gPSAwKSB8fCBvLnBvcCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChoID8gbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSByIDogMSA9PT0gbS5ub2RlVHlwZSkgJiYgKyt0ICYmIChzICYmIChsID0gbVt1XSB8fCAobVt1XSA9IHt9KSwgayA9IGxbbS51bmlxdWVJRF0gfHwgKGxbbS51bmlxdWVJRF0gPSB7fSksIGtbYV0gPSBbdywgdF0pLCBtID09PSBiKSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQgLT0gZSwgdCA9PT0gZCB8fCB0ICUgZCA9PT0gMCAmJiB0IC8gZCA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFBTRVVETzogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMsIGUgPSBkLnBzZXVkb3NbYV0gfHwgZC5zZXRGaWx0ZXJzW2EudG9Mb3dlckNhc2UoKV0gfHwgZ2EuZXJyb3IoXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiICsgYSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlW3VdID8gZShiKSA6IGUubGVuZ3RoID4gMSA/IChjID0gW2EsIGEsIFwiXCIsIGJdLCBkLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoYS50b0xvd2VyQ2FzZSgpKSA/IGlhKGZ1bmN0aW9uIChhLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCwgZiA9IGUoYSwgYiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGYubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGctLSkgZCA9IEkoYSwgZltnXSksIGFbZF0gPSAhKGNbZF0gPSBmW2ddKVxuICAgICAgICAgICAgICAgICAgICB9KSA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZShhLCAwLCBjKVxuICAgICAgICAgICAgICAgICAgICB9KSA6IGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHNldWRvczoge1xuICAgICAgICAgICAgICAgIG5vdDogaWEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBoKGEucmVwbGFjZShQLCBcIiQxXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRbdV0gPyBpYShmdW5jdGlvbiAoYSwgYiwgYywgZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYsIGcgPSBkKGEsIG51bGwsIGUsIFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gYS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaC0tKShmID0gZ1toXSkgJiYgKGFbaF0gPSAhKGJbaF0gPSBmKSlcbiAgICAgICAgICAgICAgICAgICAgfSkgOiBmdW5jdGlvbiAoYSwgZSwgZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJbMF0gPSBhLCBkKGIsIG51bGwsIGYsIGMpLCBiWzBdID0gbnVsbCwgIWMucG9wKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGhhczogaWEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2EoYSwgYikubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IGlhKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhID0gYS5yZXBsYWNlKF8sIGFhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChiLnRleHRDb250ZW50IHx8IGIuaW5uZXJUZXh0IHx8IGUoYikpLmluZGV4T2YoYSkgPiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGxhbmc6IGlhKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBVLnRlc3QoYSB8fCBcIlwiKSB8fCBnYS5lcnJvcihcInVuc3VwcG9ydGVkIGxhbmc6IFwiICsgYSksIGEgPSBhLnJlcGxhY2UoXywgYWEpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID0gcCA/IGIubGFuZyA6IGIuZ2V0QXR0cmlidXRlKFwieG1sOmxhbmdcIikgfHwgYi5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKSByZXR1cm4gYyA9IGMudG9Mb3dlckNhc2UoKSwgYyA9PT0gYSB8fCAwID09PSBjLmluZGV4T2YoYSArIFwiLVwiKTsgd2hpbGUgKChiID0gYi5wYXJlbnROb2RlKSAmJiAxID09PSBiLm5vZGVUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gITFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gYS5sb2NhdGlvbiAmJiBhLmxvY2F0aW9uLmhhc2g7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjICYmIGMuc2xpY2UoMSkgPT09IGIuaWRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJvb3Q6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhID09PSBvXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmb2N1czogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPT09IG4uYWN0aXZlRWxlbWVudCAmJiAoIW4uaGFzRm9jdXMgfHwgbi5oYXNGb2N1cygpKSAmJiAhIShhLnR5cGUgfHwgYS5ocmVmIHx8IH5hLnRhYkluZGV4KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogb2EoITEpLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBvYSghMCksXG4gICAgICAgICAgICAgICAgY2hlY2tlZDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImlucHV0XCIgPT09IGIgJiYgISFhLmNoZWNrZWQgfHwgXCJvcHRpb25cIiA9PT0gYiAmJiAhIWEuc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5wYXJlbnROb2RlICYmIGEucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4LCBhLnNlbGVjdGVkID09PSAhMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoYSA9IGEuZmlyc3RDaGlsZDsgYTsgYSA9IGEubmV4dFNpYmxpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYS5ub2RlVHlwZSA8IDYpIHJldHVybiAhMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhZC5wc2V1ZG9zLmVtcHR5KGEpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBYLnRlc3QoYS5ub2RlTmFtZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlucHV0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVy50ZXN0KGEubm9kZU5hbWUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidXR0b246IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbnB1dFwiID09PSBiICYmIFwiYnV0dG9uXCIgPT09IGEudHlwZSB8fCBcImJ1dHRvblwiID09PSBiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiaW5wdXRcIiA9PT0gYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICYmIFwidGV4dFwiID09PSBhLnR5cGUgJiYgKG51bGwgPT0gKGIgPSBhLmdldEF0dHJpYnV0ZShcInR5cGVcIikpIHx8IFwidGV4dFwiID09PSBiLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmaXJzdDogcGEoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzBdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbGFzdDogcGEoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtiIC0gMV1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBlcTogcGEoZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjIDwgMCA/IGMgKyBiIDogY11cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBldmVuOiBwYShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGI7IGMgKz0gMikgYS5wdXNoKGMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG9kZDogcGEoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYyA9IDE7IGMgPCBiOyBjICs9IDIpIGEucHVzaChjKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBsdDogcGEoZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZCA9IGMgPCAwID8gYyArIGIgOiBjOyAtLWQgPj0gMDspIGEucHVzaChkKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBndDogcGEoZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZCA9IGMgPCAwID8gYyArIGIgOiBjOyArK2QgPCBiOykgYS5wdXNoKGQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGQucHNldWRvcy5udGggPSBkLnBzZXVkb3MuZXE7XG4gICAgICAgIGZvciAoYiBpbiB7XG4gICAgICAgICAgICAgICAgcmFkaW86ICEwLFxuICAgICAgICAgICAgICAgIGNoZWNrYm94OiAhMCxcbiAgICAgICAgICAgICAgICBmaWxlOiAhMCxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogITAsXG4gICAgICAgICAgICAgICAgaW1hZ2U6ICEwXG4gICAgICAgICAgICB9KSBkLnBzZXVkb3NbYl0gPSBtYShiKTtcbiAgICAgICAgZm9yIChiIGluIHtcbiAgICAgICAgICAgICAgICBzdWJtaXQ6ICEwLFxuICAgICAgICAgICAgICAgIHJlc2V0OiAhMFxuICAgICAgICAgICAgfSkgZC5wc2V1ZG9zW2JdID0gbmEoYik7XG5cbiAgICAgICAgZnVuY3Rpb24gcmEoKSB7fVxuICAgICAgICByYS5wcm90b3R5cGUgPSBkLmZpbHRlcnMgPSBkLnBzZXVkb3MsIGQuc2V0RmlsdGVycyA9IG5ldyByYSwgZyA9IGdhLnRva2VuaXplID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjLCBlLCBmLCBnLCBoLCBpLCBqLCBrID0gelthICsgXCIgXCJdO1xuICAgICAgICAgICAgaWYgKGspIHJldHVybiBiID8gMCA6IGsuc2xpY2UoMCk7XG4gICAgICAgICAgICBoID0gYSwgaSA9IFtdLCBqID0gZC5wcmVGaWx0ZXI7XG4gICAgICAgICAgICB3aGlsZSAoaCkge1xuICAgICAgICAgICAgICAgIGMgJiYgIShlID0gUS5leGVjKGgpKSB8fCAoZSAmJiAoaCA9IGguc2xpY2UoZVswXS5sZW5ndGgpIHx8IGgpLCBpLnB1c2goZiA9IFtdKSksIGMgPSAhMSwgKGUgPSBSLmV4ZWMoaCkpICYmIChjID0gZS5zaGlmdCgpLCBmLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZVswXS5yZXBsYWNlKFAsIFwiIFwiKVxuICAgICAgICAgICAgICAgIH0pLCBoID0gaC5zbGljZShjLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgIGZvciAoZyBpbiBkLmZpbHRlcikgIShlID0gVltnXS5leGVjKGgpKSB8fCBqW2ddICYmICEoZSA9IGpbZ10oZSkpIHx8IChjID0gZS5zaGlmdCgpLCBmLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZyxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlczogZVxuICAgICAgICAgICAgICAgIH0pLCBoID0gaC5zbGljZShjLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgIGlmICghYykgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiID8gaC5sZW5ndGggOiBoID8gZ2EuZXJyb3IoYSkgOiB6KGEsIGkpLnNsaWNlKDApXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc2EoYSkge1xuICAgICAgICAgICAgZm9yICh2YXIgYiA9IDAsIGMgPSBhLmxlbmd0aCwgZCA9IFwiXCI7IGIgPCBjOyBiKyspIGQgKz0gYVtiXS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBkXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0YShhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGIuZGlyLFxuICAgICAgICAgICAgICAgIGUgPSBiLm5leHQsXG4gICAgICAgICAgICAgICAgZiA9IGUgfHwgZCxcbiAgICAgICAgICAgICAgICBnID0gYyAmJiBcInBhcmVudE5vZGVcIiA9PT0gZixcbiAgICAgICAgICAgICAgICBoID0geCsrO1xuICAgICAgICAgICAgcmV0dXJuIGIuZmlyc3QgPyBmdW5jdGlvbiAoYiwgYywgZSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChiID0gYltkXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT09IGIubm9kZVR5cGUgfHwgZykgcmV0dXJuIGEoYiwgYywgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICExXG4gICAgICAgICAgICB9IDogZnVuY3Rpb24gKGIsIGMsIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaiwgaywgbCwgbSA9IFt3LCBoXTtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYiA9IGJbZF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKDEgPT09IGIubm9kZVR5cGUgfHwgZykgJiYgYShiLCBjLCBpKSkgcmV0dXJuICEwXG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChiID0gYltkXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBiLm5vZGVUeXBlIHx8IGcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGwgPSBiW3VdIHx8IChiW3VdID0ge30pLCBrID0gbFtiLnVuaXF1ZUlEXSB8fCAobFtiLnVuaXF1ZUlEXSA9IHt9KSwgZSAmJiBlID09PSBiLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIGIgPSBiW2RdIHx8IGI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaiA9IGtbZl0pICYmIGpbMF0gPT09IHcgJiYgalsxXSA9PT0gaCkgcmV0dXJuIG1bMl0gPSBqWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa1tmXSA9IG0sIG1bMl0gPSBhKGIsIGMsIGkpKSByZXR1cm4gITBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IHJldHVybiAhMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdWEoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEubGVuZ3RoID4gMSA/IGZ1bmN0aW9uIChiLCBjLCBkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZS0tKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFbZV0oYiwgYywgZCkpIHJldHVybiAhMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gITBcbiAgICAgICAgICAgIH0gOiBhWzBdXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB2YShhLCBiLCBjKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMCwgZSA9IGIubGVuZ3RoOyBkIDwgZTsgZCsrKSBnYShhLCBiW2RdLCBjKTtcbiAgICAgICAgICAgIHJldHVybiBjXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3YShhLCBiLCBjLCBkLCBlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBmLCBnID0gW10sIGggPSAwLCBpID0gYS5sZW5ndGgsIGogPSBudWxsICE9IGI7IGggPCBpOyBoKyspKGYgPSBhW2hdKSAmJiAoYyAmJiAhYyhmLCBkLCBlKSB8fCAoZy5wdXNoKGYpLCBqICYmIGIucHVzaChoKSkpO1xuICAgICAgICAgICAgcmV0dXJuIGdcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHhhKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAgICAgICAgIHJldHVybiBkICYmICFkW3VdICYmIChkID0geGEoZCkpLCBlICYmICFlW3VdICYmIChlID0geGEoZSwgZikpLCBpYShmdW5jdGlvbiAoZiwgZywgaCwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBqLCBrLCBsLCBtID0gW10sXG4gICAgICAgICAgICAgICAgICAgIG4gPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgbyA9IGcubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBwID0gZiB8fCB2YShiIHx8IFwiKlwiLCBoLm5vZGVUeXBlID8gW2hdIDogaCwgW10pLFxuICAgICAgICAgICAgICAgICAgICBxID0gIWEgfHwgIWYgJiYgYiA/IHAgOiB3YShwLCBtLCBhLCBoLCBpKSxcbiAgICAgICAgICAgICAgICAgICAgciA9IGMgPyBlIHx8IChmID8gYSA6IG8gfHwgZCkgPyBbXSA6IGcgOiBxO1xuICAgICAgICAgICAgICAgIGlmIChjICYmIGMocSwgciwgaCwgaSksIGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaiA9IHdhKHIsIG4pLCBkKGosIFtdLCBoLCBpKSwgayA9IGoubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoay0tKShsID0galtrXSkgJiYgKHJbbltrXV0gPSAhKHFbbltrXV0gPSBsKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgfHwgYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqID0gW10sIGsgPSByLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoay0tKShsID0gcltrXSkgJiYgai5wdXNoKHFba10gPSBsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlKG51bGwsIHIgPSBbXSwgaiwgaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChrLS0pKGwgPSByW2tdKSAmJiAoaiA9IGUgPyBJKGYsIGwpIDogbVtrXSkgPiAtMSAmJiAoZltqXSA9ICEoZ1tqXSA9IGwpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHIgPSB3YShyID09PSBnID8gci5zcGxpY2Uobywgci5sZW5ndGgpIDogciksIGUgPyBlKG51bGwsIGcsIHIsIGkpIDogRy5hcHBseShnLCByKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHlhKGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGIsIGMsIGUsIGYgPSBhLmxlbmd0aCwgZyA9IGQucmVsYXRpdmVbYVswXS50eXBlXSwgaCA9IGcgfHwgZC5yZWxhdGl2ZVtcIiBcIl0sIGkgPSBnID8gMSA6IDAsIGsgPSB0YShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PT0gYlxuICAgICAgICAgICAgICAgIH0sIGgsICEwKSwgbCA9IHRhKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJKGIsIGEpID4gLTFcbiAgICAgICAgICAgICAgICB9LCBoLCAhMCksIG0gPSBbZnVuY3Rpb24gKGEsIGMsIGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAhZyAmJiAoZCB8fCBjICE9PSBqKSB8fCAoKGIgPSBjKS5ub2RlVHlwZSA/IGsoYSwgYywgZCkgOiBsKGEsIGMsIGQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIgPSBudWxsLCBlXG4gICAgICAgICAgICAgICAgfV07IGkgPCBmOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKGMgPSBkLnJlbGF0aXZlW2FbaV0udHlwZV0pIG0gPSBbdGEodWEobSksIGMpXTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPSBkLmZpbHRlclthW2ldLnR5cGVdLmFwcGx5KG51bGwsIGFbaV0ubWF0Y2hlcyksIGNbdV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoZSA9ICsraTsgZSA8IGY7IGUrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZC5yZWxhdGl2ZVthW2VdLnR5cGVdKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4YShpID4gMSAmJiB1YShtKSwgaSA+IDEgJiYgc2EoYS5zbGljZSgwLCBpIC0gMSkuY29uY2F0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCIgXCIgPT09IGFbaSAtIDJdLnR5cGUgPyBcIipcIiA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKS5yZXBsYWNlKFAsIFwiJDFcIiksIGMsIGkgPCBlICYmIHlhKGEuc2xpY2UoaSwgZSkpLCBlIDwgZiAmJiB5YShhID0gYS5zbGljZShlKSksIGUgPCBmICYmIHNhKGEpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG0ucHVzaChjKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1YShtKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gemEoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSBiLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgZSA9IGEubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICBmID0gZnVuY3Rpb24gKGYsIGcsIGgsIGksIGspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGwsIG8sIHEsIHIgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IFwiMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IGYgJiYgW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gaixcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBmIHx8IGUgJiYgZC5maW5kLlRBRyhcIipcIiwgayksXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gdyArPSBudWxsID09IHYgPyAxIDogTWF0aC5yYW5kb20oKSB8fCAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHogPSB4Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrICYmIChqID0gZyA9PT0gbiB8fCBnIHx8IGspOyBzICE9PSB6ICYmIG51bGwgIT0gKGwgPSB4W3NdKTsgcysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSAmJiBsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbyA9IDAsIGcgfHwgbC5vd25lckRvY3VtZW50ID09PSBuIHx8IChtKGwpLCBoID0gIXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChxID0gYVtvKytdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocShsLCBnIHx8IG4sIGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLnB1c2gobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgayAmJiAodyA9IHkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjICYmICgobCA9ICFxICYmIGwpICYmIHItLSwgZiAmJiB0LnB1c2gobCkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgKz0gcywgYyAmJiBzICE9PSByKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChxID0gYltvKytdKSBxKHQsIHUsIGcsIGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChzLS0pIHRbc10gfHwgdVtzXSB8fCAodVtzXSA9IEUuY2FsbChpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdSA9IHdhKHUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBHLmFwcGx5KGksIHUpLCBrICYmICFmICYmIHUubGVuZ3RoID4gMCAmJiByICsgYi5sZW5ndGggPiAxICYmIGdhLnVuaXF1ZVNvcnQoaSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gayAmJiAodyA9IHksIGogPSB2KSwgdFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYyA/IGlhKGYpIDogZlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoID0gZ2EuY29tcGlsZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgYywgZCA9IFtdLFxuICAgICAgICAgICAgICAgIGUgPSBbXSxcbiAgICAgICAgICAgICAgICBmID0gQVthICsgXCIgXCJdO1xuICAgICAgICAgICAgaWYgKCFmKSB7XG4gICAgICAgICAgICAgICAgYiB8fCAoYiA9IGcoYSkpLCBjID0gYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGMtLSkgZiA9IHlhKGJbY10pLCBmW3VdID8gZC5wdXNoKGYpIDogZS5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIGYgPSBBKGEsIHphKGUsIGQpKSwgZi5zZWxlY3RvciA9IGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmXG4gICAgICAgIH0sIGkgPSBnYS5zZWxlY3QgPSBmdW5jdGlvbiAoYSwgYiwgYywgZSkge1xuICAgICAgICAgICAgdmFyIGYsIGksIGosIGssIGwsIG0gPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGEgJiYgYSxcbiAgICAgICAgICAgICAgICBuID0gIWUgJiYgZyhhID0gbS5zZWxlY3RvciB8fCBhKTtcbiAgICAgICAgICAgIGlmIChjID0gYyB8fCBbXSwgMSA9PT0gbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9IG5bMF0gPSBuWzBdLnNsaWNlKDApLCBpLmxlbmd0aCA+IDIgJiYgXCJJRFwiID09PSAoaiA9IGlbMF0pLnR5cGUgJiYgOSA9PT0gYi5ub2RlVHlwZSAmJiBwICYmIGQucmVsYXRpdmVbaVsxXS50eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYiA9IChkLmZpbmQuSUQoai5tYXRjaGVzWzBdLnJlcGxhY2UoXywgYWEpLCBiKSB8fCBbXSlbMF0sICFiKSByZXR1cm4gYztcbiAgICAgICAgICAgICAgICAgICAgbSAmJiAoYiA9IGIucGFyZW50Tm9kZSksIGEgPSBhLnNsaWNlKGkuc2hpZnQoKS52YWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGYgPSBWLm5lZWRzQ29udGV4dC50ZXN0KGEpID8gMCA6IGkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChmLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPSBpW2ZdLCBkLnJlbGF0aXZlW2sgPSBqLnR5cGVdKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgaWYgKChsID0gZC5maW5kW2tdKSAmJiAoZSA9IGwoai5tYXRjaGVzWzBdLnJlcGxhY2UoXywgYWEpLCAkLnRlc3QoaVswXS50eXBlKSAmJiBxYShiLnBhcmVudE5vZGUpIHx8IGIpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkuc3BsaWNlKGYsIDEpLCBhID0gZS5sZW5ndGggJiYgc2EoaSksICFhKSByZXR1cm4gRy5hcHBseShjLCBlKSwgYztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKG0gfHwgaChhLCBuKSkoZSwgYiwgIXAsIGMsICFiIHx8ICQudGVzdChhKSAmJiBxYShiLnBhcmVudE5vZGUpIHx8IGIpLCBjXG4gICAgICAgIH0sIGMuc29ydFN0YWJsZSA9IHUuc3BsaXQoXCJcIikuc29ydChCKS5qb2luKFwiXCIpID09PSB1LCBjLmRldGVjdER1cGxpY2F0ZXMgPSAhIWwsIG0oKSwgYy5zb3J0RGV0YWNoZWQgPSBqYShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIDEgJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG4uY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpKVxuICAgICAgICB9KSwgamEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nIyc+PC9hPlwiLCBcIiNcIiA9PT0gYS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIilcbiAgICAgICAgfSkgfHwga2EoXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICBpZiAoIWMpIHJldHVybiBhLmdldEF0dHJpYnV0ZShiLCBcInR5cGVcIiA9PT0gYi50b0xvd2VyQ2FzZSgpID8gMSA6IDIpXG4gICAgICAgIH0pLCBjLmF0dHJpYnV0ZXMgJiYgamEoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmlubmVySFRNTCA9IFwiPGlucHV0Lz5cIiwgYS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIFwiXCIpLCBcIlwiID09PSBhLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbiAgICAgICAgfSkgfHwga2EoXCJ2YWx1ZVwiLCBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgaWYgKCFjICYmIFwiaW5wdXRcIiA9PT0gYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gYS5kZWZhdWx0VmFsdWVcbiAgICAgICAgfSksIGphKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBhLmdldEF0dHJpYnV0ZShcImRpc2FibGVkXCIpXG4gICAgICAgIH0pIHx8IGthKEosIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZDtcbiAgICAgICAgICAgIGlmICghYykgcmV0dXJuIGFbYl0gPT09ICEwID8gYi50b0xvd2VyQ2FzZSgpIDogKGQgPSBhLmdldEF0dHJpYnV0ZU5vZGUoYikpICYmIGQuc3BlY2lmaWVkID8gZC52YWx1ZSA6IG51bGxcbiAgICAgICAgfSksIGdhXG4gICAgfShhKTtcbiAgICByLmZpbmQgPSB4LCByLmV4cHIgPSB4LnNlbGVjdG9ycywgci5leHByW1wiOlwiXSA9IHIuZXhwci5wc2V1ZG9zLCByLnVuaXF1ZVNvcnQgPSByLnVuaXF1ZSA9IHgudW5pcXVlU29ydCwgci50ZXh0ID0geC5nZXRUZXh0LCByLmlzWE1MRG9jID0geC5pc1hNTCwgci5jb250YWlucyA9IHguY29udGFpbnMsIHIuZXNjYXBlU2VsZWN0b3IgPSB4LmVzY2FwZTtcbiAgICB2YXIgeSA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZCA9IFtdLFxuICAgICAgICAgICAgICAgIGUgPSB2b2lkIDAgIT09IGM7XG4gICAgICAgICAgICB3aGlsZSAoKGEgPSBhW2JdKSAmJiA5ICE9PSBhLm5vZGVUeXBlKVxuICAgICAgICAgICAgICAgIGlmICgxID09PSBhLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlICYmIHIoYSkuaXMoYykpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goYSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZFxuICAgICAgICB9LFxuICAgICAgICB6ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSBbXTsgYTsgYSA9IGEubmV4dFNpYmxpbmcpIDEgPT09IGEubm9kZVR5cGUgJiYgYSAhPT0gYiAmJiBjLnB1c2goYSk7XG4gICAgICAgICAgICByZXR1cm4gY1xuICAgICAgICB9LFxuICAgICAgICBBID0gci5leHByLm1hdGNoLm5lZWRzQ29udGV4dDtcblxuICAgIGZ1bmN0aW9uIEIoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5ub2RlTmFtZSAmJiBhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGIudG9Mb3dlckNhc2UoKVxuICAgIH1cbiAgICB2YXIgQyA9IC9ePChbYS16XVteXFwvXFwwPjpcXHgyMFxcdFxcclxcblxcZl0qKVtcXHgyMFxcdFxcclxcblxcZl0qXFwvPz4oPzo8XFwvXFwxPnwpJC9pLFxuICAgICAgICBEID0gL14uW146I1xcW1xcLixdKiQvO1xuXG4gICAgZnVuY3Rpb24gRShhLCBiLCBjKSB7XG4gICAgICAgIHJldHVybiByLmlzRnVuY3Rpb24oYikgPyByLmdyZXAoYSwgZnVuY3Rpb24gKGEsIGQpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWIuY2FsbChhLCBkLCBhKSAhPT0gY1xuICAgICAgICB9KSA6IGIubm9kZVR5cGUgPyByLmdyZXAoYSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiICE9PSBjXG4gICAgICAgIH0pIDogXCJzdHJpbmdcIiAhPSB0eXBlb2YgYiA/IHIuZ3JlcChhLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuY2FsbChiLCBhKSA+IC0xICE9PSBjXG4gICAgICAgIH0pIDogRC50ZXN0KGIpID8gci5maWx0ZXIoYiwgYSwgYykgOiAoYiA9IHIuZmlsdGVyKGIsIGEpLCByLmdyZXAoYSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmNhbGwoYiwgYSkgPiAtMSAhPT0gYyAmJiAxID09PSBhLm5vZGVUeXBlXG4gICAgICAgIH0pKVxuICAgIH1cbiAgICByLmZpbHRlciA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIHZhciBkID0gYlswXTtcbiAgICAgICAgcmV0dXJuIGMgJiYgKGEgPSBcIjpub3QoXCIgKyBhICsgXCIpXCIpLCAxID09PSBiLmxlbmd0aCAmJiAxID09PSBkLm5vZGVUeXBlID8gci5maW5kLm1hdGNoZXNTZWxlY3RvcihkLCBhKSA/IFtkXSA6IFtdIDogci5maW5kLm1hdGNoZXMoYSwgci5ncmVwKGIsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gMSA9PT0gYS5ub2RlVHlwZVxuICAgICAgICB9KSlcbiAgICB9LCByLmZuLmV4dGVuZCh7XG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiwgYywgZCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgIT0gdHlwZW9mIGEpIHJldHVybiB0aGlzLnB1c2hTdGFjayhyKGEpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChiID0gMDsgYiA8IGQ7IGIrKylcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIuY29udGFpbnMoZVtiXSwgdGhpcykpIHJldHVybiAhMFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgZm9yIChjID0gdGhpcy5wdXNoU3RhY2soW10pLCBiID0gMDsgYiA8IGQ7IGIrKykgci5maW5kKGEsIGVbYl0sIGMpO1xuICAgICAgICAgICAgcmV0dXJuIGQgPiAxID8gci51bmlxdWVTb3J0KGMpIDogY1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2soRSh0aGlzLCBhIHx8IFtdLCAhMSkpXG4gICAgICAgIH0sXG4gICAgICAgIG5vdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayhFKHRoaXMsIGEgfHwgW10sICEwKSlcbiAgICAgICAgfSxcbiAgICAgICAgaXM6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gISFFKHRoaXMsIFwic3RyaW5nXCIgPT0gdHlwZW9mIGEgJiYgQS50ZXN0KGEpID8gcihhKSA6IGEgfHwgW10sICExKS5sZW5ndGhcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBGLCBHID0gL14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qfCMoW1xcdy1dKykpJC8sXG4gICAgICAgIEggPSByLmZuLmluaXQgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIGUsIGY7XG4gICAgICAgICAgICBpZiAoIWEpIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgaWYgKGMgPSBjIHx8IEYsIFwic3RyaW5nXCIgPT0gdHlwZW9mIGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSA9IFwiPFwiID09PSBhWzBdICYmIFwiPlwiID09PSBhW2EubGVuZ3RoIC0gMV0gJiYgYS5sZW5ndGggPj0gMyA/IFtudWxsLCBhLCBudWxsXSA6IEcuZXhlYyhhKSwgIWUgfHwgIWVbMV0gJiYgYikgcmV0dXJuICFiIHx8IGIuanF1ZXJ5ID8gKGIgfHwgYykuZmluZChhKSA6IHRoaXMuY29uc3RydWN0b3IoYikuZmluZChhKTtcbiAgICAgICAgICAgICAgICBpZiAoZVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYiA9IGIgaW5zdGFuY2VvZiByID8gYlswXSA6IGIsIHIubWVyZ2UodGhpcywgci5wYXJzZUhUTUwoZVsxXSwgYiAmJiBiLm5vZGVUeXBlID8gYi5vd25lckRvY3VtZW50IHx8IGIgOiBkLCAhMCkpLCBDLnRlc3QoZVsxXSkgJiYgci5pc1BsYWluT2JqZWN0KGIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChlIGluIGIpIHIuaXNGdW5jdGlvbih0aGlzW2VdKSA/IHRoaXNbZV0oYltlXSkgOiB0aGlzLmF0dHIoZSwgYltlXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmID0gZC5nZXRFbGVtZW50QnlJZChlWzJdKSwgZiAmJiAodGhpc1swXSA9IGYsIHRoaXMubGVuZ3RoID0gMSksIHRoaXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhLm5vZGVUeXBlID8gKHRoaXNbMF0gPSBhLCB0aGlzLmxlbmd0aCA9IDEsIHRoaXMpIDogci5pc0Z1bmN0aW9uKGEpID8gdm9pZCAwICE9PSBjLnJlYWR5ID8gYy5yZWFkeShhKSA6IGEocikgOiByLm1ha2VBcnJheShhLCB0aGlzKVxuICAgICAgICB9O1xuICAgIEgucHJvdG90eXBlID0gci5mbiwgRiA9IHIoZCk7XG4gICAgdmFyIEkgPSAvXig/OnBhcmVudHN8cHJldig/OlVudGlsfEFsbCkpLyxcbiAgICAgICAgSiA9IHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiAhMCxcbiAgICAgICAgICAgIGNvbnRlbnRzOiAhMCxcbiAgICAgICAgICAgIG5leHQ6ICEwLFxuICAgICAgICAgICAgcHJldjogITBcbiAgICAgICAgfTtcbiAgICByLmZuLmV4dGVuZCh7XG4gICAgICAgIGhhczogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiID0gcihhLCB0aGlzKSxcbiAgICAgICAgICAgICAgICBjID0gYi5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgYzsgYSsrKVxuICAgICAgICAgICAgICAgICAgICBpZiAoci5jb250YWlucyh0aGlzLCBiW2FdKSkgcmV0dXJuICEwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZXN0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMsIGQgPSAwLFxuICAgICAgICAgICAgICAgIGUgPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBmID0gW10sXG4gICAgICAgICAgICAgICAgZyA9IFwic3RyaW5nXCIgIT0gdHlwZW9mIGEgJiYgcihhKTtcbiAgICAgICAgICAgIGlmICghQS50ZXN0KGEpKVxuICAgICAgICAgICAgICAgIGZvciAoOyBkIDwgZTsgZCsrKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGMgPSB0aGlzW2RdOyBjICYmIGMgIT09IGI7IGMgPSBjLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5ub2RlVHlwZSA8IDExICYmIChnID8gZy5pbmRleChjKSA+IC0xIDogMSA9PT0gYy5ub2RlVHlwZSAmJiByLmZpbmQubWF0Y2hlc1NlbGVjdG9yKGMsIGEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYucHVzaChjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKGYubGVuZ3RoID4gMSA/IHIudW5pcXVlU29ydChmKSA6IGYpXG4gICAgICAgIH0sXG4gICAgICAgIGluZGV4OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgPyBcInN0cmluZ1wiID09IHR5cGVvZiBhID8gaS5jYWxsKHIoYSksIHRoaXNbMF0pIDogaS5jYWxsKHRoaXMsIGEuanF1ZXJ5ID8gYVswXSA6IGEpIDogdGhpc1swXSAmJiB0aGlzWzBdLnBhcmVudE5vZGUgPyB0aGlzLmZpcnN0KCkucHJldkFsbCgpLmxlbmd0aCA6IC0xXG4gICAgICAgIH0sXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayhyLnVuaXF1ZVNvcnQoci5tZXJnZSh0aGlzLmdldCgpLCByKGEsIGIpKSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFkZEJhY2s6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQobnVsbCA9PSBhID8gdGhpcy5wcmV2T2JqZWN0IDogdGhpcy5wcmV2T2JqZWN0LmZpbHRlcihhKSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gSyhhLCBiKSB7XG4gICAgICAgIHdoaWxlICgoYSA9IGFbYl0pICYmIDEgIT09IGEubm9kZVR5cGUpO1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cbiAgICByLmVhY2goe1xuICAgICAgICBwYXJlbnQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGEucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHJldHVybiBiICYmIDExICE9PSBiLm5vZGVUeXBlID8gYiA6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50czogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB5KGEsIFwicGFyZW50Tm9kZVwiKVxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnRzVW50aWw6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4geShhLCBcInBhcmVudE5vZGVcIiwgYylcbiAgICAgICAgfSxcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBLKGEsIFwibmV4dFNpYmxpbmdcIilcbiAgICAgICAgfSxcbiAgICAgICAgcHJldjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBLKGEsIFwicHJldmlvdXNTaWJsaW5nXCIpXG4gICAgICAgIH0sXG4gICAgICAgIG5leHRBbGw6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4geShhLCBcIm5leHRTaWJsaW5nXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZBbGw6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4geShhLCBcInByZXZpb3VzU2libGluZ1wiKVxuICAgICAgICB9LFxuICAgICAgICBuZXh0VW50aWw6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4geShhLCBcIm5leHRTaWJsaW5nXCIsIGMpXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZVbnRpbDogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB5KGEsIFwicHJldmlvdXNTaWJsaW5nXCIsIGMpXG4gICAgICAgIH0sXG4gICAgICAgIHNpYmxpbmdzOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHooKGEucGFyZW50Tm9kZSB8fCB7fSkuZmlyc3RDaGlsZCwgYSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4geihhLmZpcnN0Q2hpbGQpXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRzOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIEIoYSwgXCJpZnJhbWVcIikgPyBhLmNvbnRlbnREb2N1bWVudCA6IChCKGEsIFwidGVtcGxhdGVcIikgJiYgKGEgPSBhLmNvbnRlbnQgfHwgYSksIHIubWVyZ2UoW10sIGEuY2hpbGROb2RlcykpXG4gICAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByLmZuW2FdID0gZnVuY3Rpb24gKGMsIGQpIHtcbiAgICAgICAgICAgIHZhciBlID0gci5tYXAodGhpcywgYiwgYyk7XG4gICAgICAgICAgICByZXR1cm4gXCJVbnRpbFwiICE9PSBhLnNsaWNlKC01KSAmJiAoZCA9IGMpLCBkICYmIFwic3RyaW5nXCIgPT0gdHlwZW9mIGQgJiYgKGUgPSByLmZpbHRlcihkLCBlKSksIHRoaXMubGVuZ3RoID4gMSAmJiAoSlthXSB8fCByLnVuaXF1ZVNvcnQoZSksIEkudGVzdChhKSAmJiBlLnJldmVyc2UoKSksIHRoaXMucHVzaFN0YWNrKGUpXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgTCA9IC9bXlxceDIwXFx0XFxyXFxuXFxmXSsvZztcblxuICAgIGZ1bmN0aW9uIE0oYSkge1xuICAgICAgICB2YXIgYiA9IHt9O1xuICAgICAgICByZXR1cm4gci5lYWNoKGEubWF0Y2goTCkgfHwgW10sIGZ1bmN0aW9uIChhLCBjKSB7XG4gICAgICAgICAgICBiW2NdID0gITBcbiAgICAgICAgfSksIGJcbiAgICB9XG4gICAgci5DYWxsYmFja3MgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICBhID0gXCJzdHJpbmdcIiA9PSB0eXBlb2YgYSA/IE0oYSkgOiByLmV4dGVuZCh7fSwgYSk7XG4gICAgICAgIHZhciBiLCBjLCBkLCBlLCBmID0gW10sXG4gICAgICAgICAgICBnID0gW10sXG4gICAgICAgICAgICBoID0gLTEsXG4gICAgICAgICAgICBpID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZvciAoZSA9IGUgfHwgYS5vbmNlLCBkID0gYiA9ICEwOyBnLmxlbmd0aDsgaCA9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGMgPSBnLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgrK2ggPCBmLmxlbmd0aCkgZltoXS5hcHBseShjWzBdLCBjWzFdKSA9PT0gITEgJiYgYS5zdG9wT25GYWxzZSAmJiAoaCA9IGYubGVuZ3RoLCBjID0gITEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGEubWVtb3J5IHx8IChjID0gITEpLCBiID0gITEsIGUgJiYgKGYgPSBjID8gW10gOiBcIlwiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGogPSB7XG4gICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmICYmIChjICYmICFiICYmIChoID0gZi5sZW5ndGggLSAxLCBnLnB1c2goYykpLCBmdW5jdGlvbiBkKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIuZWFjaChiLCBmdW5jdGlvbiAoYiwgYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIuaXNGdW5jdGlvbihjKSA/IGEudW5pcXVlICYmIGouaGFzKGMpIHx8IGYucHVzaChjKSA6IGMgJiYgYy5sZW5ndGggJiYgXCJzdHJpbmdcIiAhPT0gci50eXBlKGMpICYmIGQoYylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0oYXJndW1lbnRzKSwgYyAmJiAhYiAmJiBpKCkpLCB0aGlzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIuZWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgoYyA9IHIuaW5BcnJheShiLCBmLCBjKSkgPiAtMSkgZi5zcGxpY2UoYywgMSksIGMgPD0gaCAmJiBoLS1cbiAgICAgICAgICAgICAgICAgICAgfSksIHRoaXNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhhczogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPyByLmluQXJyYXkoYSwgZikgPiAtMSA6IGYubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYgJiYgKGYgPSBbXSksIHRoaXNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUgPSBnID0gW10sIGYgPSBjID0gXCJcIiwgdGhpc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlID0gZyA9IFtdLCBjIHx8IGIgfHwgKGYgPSBjID0gXCJcIiksIHRoaXNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxvY2tlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmaXJlV2l0aDogZnVuY3Rpb24gKGEsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUgfHwgKGMgPSBjIHx8IFtdLCBjID0gW2EsIGMuc2xpY2UgPyBjLnNsaWNlKCkgOiBjXSwgZy5wdXNoKGMpLCBiIHx8IGkoKSksIHRoaXNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZpcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGouZmlyZVdpdGgodGhpcywgYXJndW1lbnRzKSwgdGhpc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmlyZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIHJldHVybiBqXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIE4oYSkge1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIE8oYSkge1xuICAgICAgICB0aHJvdyBhXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUChhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciBlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYSAmJiByLmlzRnVuY3Rpb24oZSA9IGEucHJvbWlzZSkgPyBlLmNhbGwoYSkuZG9uZShiKS5mYWlsKGMpIDogYSAmJiByLmlzRnVuY3Rpb24oZSA9IGEudGhlbikgPyBlLmNhbGwoYSwgYiwgYykgOiBiLmFwcGx5KHZvaWQgMCwgW2FdLnNsaWNlKGQpKVxuICAgICAgICB9IGNhdGNoIChhKSB7XG4gICAgICAgICAgICBjLmFwcGx5KHZvaWQgMCwgW2FdKVxuICAgICAgICB9XG4gICAgfVxuICAgIHIuZXh0ZW5kKHtcbiAgICAgICAgRGVmZXJyZWQ6IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICB2YXIgYyA9IFtcbiAgICAgICAgICAgICAgICAgICAgW1wibm90aWZ5XCIsIFwicHJvZ3Jlc3NcIiwgci5DYWxsYmFja3MoXCJtZW1vcnlcIiksIHIuQ2FsbGJhY2tzKFwibWVtb3J5XCIpLCAyXSxcbiAgICAgICAgICAgICAgICAgICAgW1wicmVzb2x2ZVwiLCBcImRvbmVcIiwgci5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSwgci5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSwgMCwgXCJyZXNvbHZlZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgW1wicmVqZWN0XCIsIFwiZmFpbFwiLCByLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLCByLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLCAxLCBcInJlamVjdGVkXCJdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkID0gXCJwZW5kaW5nXCIsXG4gICAgICAgICAgICAgICAgZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYuZG9uZShhcmd1bWVudHMpLmZhaWwoYXJndW1lbnRzKSwgdGhpc1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS50aGVuKG51bGwsIGEpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBpcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIuRGVmZXJyZWQoZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByLmVhY2goYywgZnVuY3Rpb24gKGMsIGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSByLmlzRnVuY3Rpb24oYVtkWzRdXSkgJiYgYVtkWzRdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZltkWzFdXShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IGUgJiYgZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSAmJiByLmlzRnVuY3Rpb24oYS5wcm9taXNlKSA/IGEucHJvbWlzZSgpLnByb2dyZXNzKGIubm90aWZ5KS5kb25lKGIucmVzb2x2ZSkuZmFpbChiLnJlamVjdCkgOiBiW2RbMF0gKyBcIldpdGhcIl0odGhpcywgZSA/IFthXSA6IGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSwgYSA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnByb21pc2UoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGVuOiBmdW5jdGlvbiAoYiwgZCwgZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnKGIsIGMsIGQsIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSwgajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShiIDwgZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEgPSBkLmFwcGx5KGgsIGkpLCBhID09PSBjLnByb21pc2UoKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZW5hYmxlIHNlbGYtcmVzb2x1dGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IGEgJiYgKFwib2JqZWN0XCIgPT0gdHlwZW9mIGEgfHwgXCJmdW5jdGlvblwiID09IHR5cGVvZiBhKSAmJiBhLnRoZW4sIHIuaXNGdW5jdGlvbihqKSA/IGUgPyBqLmNhbGwoYSwgZyhmLCBjLCBOLCBlKSwgZyhmLCBjLCBPLCBlKSkgOiAoZisrLCBqLmNhbGwoYSwgZyhmLCBjLCBOLCBlKSwgZyhmLCBjLCBPLCBlKSwgZyhmLCBjLCBOLCBjLm5vdGlmeVdpdGgpKSkgOiAoZCAhPT0gTiAmJiAoaCA9IHZvaWQgMCwgaSA9IFthXSksIChlIHx8IGMucmVzb2x2ZVdpdGgpKGgsIGkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrID0gZSA/IGogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByLkRlZmVycmVkLmV4Y2VwdGlvbkhvb2sgJiYgci5EZWZlcnJlZC5leGNlcHRpb25Ib29rKGEsIGsuc3RhY2tUcmFjZSksIGIgKyAxID49IGYgJiYgKGQgIT09IE8gJiYgKGggPSB2b2lkIDAsIGkgPSBbYV0pLCBjLnJlamVjdFdpdGgoaCwgaSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA/IGsoKSA6IChyLkRlZmVycmVkLmdldFN0YWNrSG9vayAmJiAoay5zdGFja1RyYWNlID0gci5EZWZlcnJlZC5nZXRTdGFja0hvb2soKSksIGEuc2V0VGltZW91dChrKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gci5EZWZlcnJlZChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNbMF1bM10uYWRkKGcoMCwgYSwgci5pc0Z1bmN0aW9uKGUpID8gZSA6IE4sIGEubm90aWZ5V2l0aCkpLCBjWzFdWzNdLmFkZChnKDAsIGEsIHIuaXNGdW5jdGlvbihiKSA/IGIgOiBOKSksIGNbMl1bM10uYWRkKGcoMCwgYSwgci5pc0Z1bmN0aW9uKGQpID8gZCA6IE8pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkucHJvbWlzZSgpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2U6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCAhPSBhID8gci5leHRlbmQoYSwgZSkgOiBlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGYgPSB7fTtcbiAgICAgICAgICAgIHJldHVybiByLmVhY2goYywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZyA9IGJbMl0sXG4gICAgICAgICAgICAgICAgICAgIGggPSBiWzVdO1xuICAgICAgICAgICAgICAgIGVbYlsxXV0gPSBnLmFkZCwgaCAmJiBnLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBoXG4gICAgICAgICAgICAgICAgfSwgY1szIC0gYV1bMl0uZGlzYWJsZSwgY1swXVsyXS5sb2NrKSwgZy5hZGQoYlszXS5maXJlKSwgZltiWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZbYlswXSArIFwiV2l0aFwiXSh0aGlzID09PSBmID8gdm9pZCAwIDogdGhpcywgYXJndW1lbnRzKSwgdGhpc1xuICAgICAgICAgICAgICAgIH0sIGZbYlswXSArIFwiV2l0aFwiXSA9IGcuZmlyZVdpdGhcbiAgICAgICAgICAgIH0pLCBlLnByb21pc2UoZiksIGIgJiYgYi5jYWxsKGYsIGYpLCBmXG4gICAgICAgIH0sXG4gICAgICAgIHdoZW46IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYyA9IGIsXG4gICAgICAgICAgICAgICAgZCA9IEFycmF5KGMpLFxuICAgICAgICAgICAgICAgIGUgPSBmLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICBnID0gci5EZWZlcnJlZCgpLFxuICAgICAgICAgICAgICAgIGggPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRbYV0gPSB0aGlzLCBlW2FdID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBmLmNhbGwoYXJndW1lbnRzKSA6IGMsIC0tYiB8fCBnLnJlc29sdmVXaXRoKGQsIGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGIgPD0gMSAmJiAoUChhLCBnLmRvbmUoaChjKSkucmVzb2x2ZSwgZy5yZWplY3QsICFiKSwgXCJwZW5kaW5nXCIgPT09IGcuc3RhdGUoKSB8fCByLmlzRnVuY3Rpb24oZVtjXSAmJiBlW2NdLnRoZW4pKSkgcmV0dXJuIGcudGhlbigpO1xuICAgICAgICAgICAgd2hpbGUgKGMtLSkgUChlW2NdLCBoKGMpLCBnLnJlamVjdCk7XG4gICAgICAgICAgICByZXR1cm4gZy5wcm9taXNlKClcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBRID0gL14oRXZhbHxJbnRlcm5hbHxSYW5nZXxSZWZlcmVuY2V8U3ludGF4fFR5cGV8VVJJKUVycm9yJC87XG4gICAgci5EZWZlcnJlZC5leGNlcHRpb25Ib29rID0gZnVuY3Rpb24gKGIsIGMpIHtcbiAgICAgICAgYS5jb25zb2xlICYmIGEuY29uc29sZS53YXJuICYmIGIgJiYgUS50ZXN0KGIubmFtZSkgJiYgYS5jb25zb2xlLndhcm4oXCJqUXVlcnkuRGVmZXJyZWQgZXhjZXB0aW9uOiBcIiArIGIubWVzc2FnZSwgYi5zdGFjaywgYylcbiAgICB9LCByLnJlYWR5RXhjZXB0aW9uID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgYS5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IGJcbiAgICAgICAgfSlcbiAgICB9O1xuICAgIHZhciBSID0gci5EZWZlcnJlZCgpO1xuICAgIHIuZm4ucmVhZHkgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gUi50aGVuKGEpW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHIucmVhZHlFeGNlcHRpb24oYSlcbiAgICAgICAgfSksIHRoaXNcbiAgICB9LCByLmV4dGVuZCh7XG4gICAgICAgIGlzUmVhZHk6ICExLFxuICAgICAgICByZWFkeVdhaXQ6IDEsXG4gICAgICAgIHJlYWR5OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgKGEgPT09ICEwID8gLS1yLnJlYWR5V2FpdCA6IHIuaXNSZWFkeSkgfHwgKHIuaXNSZWFkeSA9ICEwLCBhICE9PSAhMCAmJiAtLXIucmVhZHlXYWl0ID4gMCB8fCBSLnJlc29sdmVXaXRoKGQsIFtyXSkpXG4gICAgICAgIH1cbiAgICB9KSwgci5yZWFkeS50aGVuID0gUi50aGVuO1xuXG4gICAgZnVuY3Rpb24gUygpIHtcbiAgICAgICAgZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBTKSxcbiAgICAgICAgICAgIGEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgUyksIHIucmVhZHkoKVxuICAgIH1cbiAgICBcImNvbXBsZXRlXCIgPT09IGQucmVhZHlTdGF0ZSB8fCBcImxvYWRpbmdcIiAhPT0gZC5yZWFkeVN0YXRlICYmICFkLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCA/IGEuc2V0VGltZW91dChyLnJlYWR5KSA6IChkLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIFMpLCBhLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIFMpKTtcbiAgICB2YXIgVCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlLCBmLCBnKSB7XG4gICAgICAgICAgICB2YXIgaCA9IDAsXG4gICAgICAgICAgICAgICAgaSA9IGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGogPSBudWxsID09IGM7XG4gICAgICAgICAgICBpZiAoXCJvYmplY3RcIiA9PT0gci50eXBlKGMpKSB7XG4gICAgICAgICAgICAgICAgZSA9ICEwO1xuICAgICAgICAgICAgICAgIGZvciAoaCBpbiBjKSBUKGEsIGIsIGgsIGNbaF0sICEwLCBmLCBnKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh2b2lkIDAgIT09IGQgJiYgKGUgPSAhMCwgci5pc0Z1bmN0aW9uKGQpIHx8IChnID0gITApLCBqICYmIChnID8gKGIuY2FsbChhLCBkKSwgYiA9IG51bGwpIDogKGogPSBiLCBiID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGouY2FsbChyKGEpLCBjKVxuICAgICAgICAgICAgICAgIH0pKSwgYikpXG4gICAgICAgICAgICAgICAgZm9yICg7IGggPCBpOyBoKyspIGIoYVtoXSwgYywgZyA/IGQgOiBkLmNhbGwoYVtoXSwgaCwgYihhW2hdLCBjKSkpO1xuICAgICAgICAgICAgcmV0dXJuIGUgPyBhIDogaiA/IGIuY2FsbChhKSA6IGkgPyBiKGFbMF0sIGMpIDogZlxuICAgICAgICB9LFxuICAgICAgICBVID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAxID09PSBhLm5vZGVUeXBlIHx8IDkgPT09IGEubm9kZVR5cGUgfHwgISthLm5vZGVUeXBlXG4gICAgICAgIH07XG5cbiAgICBmdW5jdGlvbiBWKCkge1xuICAgICAgICB0aGlzLmV4cGFuZG8gPSByLmV4cGFuZG8gKyBWLnVpZCsrXG4gICAgfVxuICAgIFYudWlkID0gMSwgVi5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNhY2hlOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGIgPSBhW3RoaXMuZXhwYW5kb107XG4gICAgICAgICAgICByZXR1cm4gYiB8fCAoYiA9IHt9LCBVKGEpICYmIChhLm5vZGVUeXBlID8gYVt0aGlzLmV4cGFuZG9dID0gYiA6IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLCB0aGlzLmV4cGFuZG8sIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogYixcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6ICEwXG4gICAgICAgICAgICB9KSkpLCBiXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkLCBlID0gdGhpcy5jYWNoZShhKTtcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBiKSBlW3IuY2FtZWxDYXNlKGIpXSA9IGM7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yIChkIGluIGIpIGVbci5jYW1lbENhc2UoZCldID0gYltkXTtcbiAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDAgPT09IGIgPyB0aGlzLmNhY2hlKGEpIDogYVt0aGlzLmV4cGFuZG9dICYmIGFbdGhpcy5leHBhbmRvXVtyLmNhbWVsQ2FzZShiKV1cbiAgICAgICAgfSxcbiAgICAgICAgYWNjZXNzOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMCA9PT0gYiB8fCBiICYmIFwic3RyaW5nXCIgPT0gdHlwZW9mIGIgJiYgdm9pZCAwID09PSBjID8gdGhpcy5nZXQoYSwgYikgOiAodGhpcy5zZXQoYSwgYiwgYyksIHZvaWQgMCAhPT0gYyA/IGMgOiBiKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgYywgZCA9IGFbdGhpcy5leHBhbmRvXTtcbiAgICAgICAgICAgIGlmICh2b2lkIDAgIT09IGQpIHtcbiAgICAgICAgICAgICAgICBpZiAodm9pZCAwICE9PSBiKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoYikgPyBiID0gYi5tYXAoci5jYW1lbENhc2UpIDogKGIgPSByLmNhbWVsQ2FzZShiKSwgYiA9IGIgaW4gZCA/IFtiXSA6IGIubWF0Y2goTCkgfHwgW10pLCBjID0gYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjLS0pIGRlbGV0ZSBkW2JbY11dXG4gICAgICAgICAgICAgICAgfSh2b2lkIDAgPT09IGIgfHwgci5pc0VtcHR5T2JqZWN0KGQpKSAmJiAoYS5ub2RlVHlwZSA/IGFbdGhpcy5leHBhbmRvXSA9IHZvaWQgMCA6IGRlbGV0ZSBhW3RoaXMuZXhwYW5kb10pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0RhdGE6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGFbdGhpcy5leHBhbmRvXTtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDAgIT09IGIgJiYgIXIuaXNFbXB0eU9iamVjdChiKVxuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgVyA9IG5ldyBWLFxuICAgICAgICBYID0gbmV3IFYsXG4gICAgICAgIFkgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC8sXG4gICAgICAgIFogPSAvW0EtWl0vZztcblxuICAgIGZ1bmN0aW9uICQoYSkge1xuICAgICAgICByZXR1cm4gXCJ0cnVlXCIgPT09IGEgfHwgXCJmYWxzZVwiICE9PSBhICYmIChcIm51bGxcIiA9PT0gYSA/IG51bGwgOiBhID09PSArYSArIFwiXCIgPyArYSA6IFkudGVzdChhKSA/IEpTT04ucGFyc2UoYSkgOiBhKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF8oYSwgYiwgYykge1xuICAgICAgICB2YXIgZDtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gYyAmJiAxID09PSBhLm5vZGVUeXBlKVxuICAgICAgICAgICAgaWYgKGQgPSBcImRhdGEtXCIgKyBiLnJlcGxhY2UoWiwgXCItJCZcIikudG9Mb3dlckNhc2UoKSwgYyA9IGEuZ2V0QXR0cmlidXRlKGQpLCBcInN0cmluZ1wiID09IHR5cGVvZiBjKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYyA9ICQoYylcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIFguc2V0KGEsIGIsIGMpXG4gICAgICAgICAgICB9IGVsc2UgYyA9IHZvaWQgMDtcbiAgICAgICAgcmV0dXJuIGNcbiAgICB9XG4gICAgci5leHRlbmQoe1xuICAgICAgICBoYXNEYXRhOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIFguaGFzRGF0YShhKSB8fCBXLmhhc0RhdGEoYSlcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiBYLmFjY2VzcyhhLCBiLCBjKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVEYXRhOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgWC5yZW1vdmUoYSwgYilcbiAgICAgICAgfSxcbiAgICAgICAgX2RhdGE6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gVy5hY2Nlc3MoYSwgYiwgYylcbiAgICAgICAgfSxcbiAgICAgICAgX3JlbW92ZURhdGE6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBXLnJlbW92ZShhLCBiKVxuICAgICAgICB9XG4gICAgfSksIHIuZm4uZXh0ZW5kKHtcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjLCBkLCBlLCBmID0gdGhpc1swXSxcbiAgICAgICAgICAgICAgICBnID0gZiAmJiBmLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBpZiAodm9pZCAwID09PSBhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoICYmIChlID0gWC5nZXQoZiksIDEgPT09IGYubm9kZVR5cGUgJiYgIVcuZ2V0KGYsIFwiaGFzRGF0YUF0dHJzXCIpKSkge1xuICAgICAgICAgICAgICAgICAgICBjID0gZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjLS0pIGdbY10gJiYgKGQgPSBnW2NdLm5hbWUsIDAgPT09IGQuaW5kZXhPZihcImRhdGEtXCIpICYmIChkID0gci5jYW1lbENhc2UoZC5zbGljZSg1KSksIF8oZiwgZCwgZVtkXSkpKTtcbiAgICAgICAgICAgICAgICAgICAgVy5zZXQoZiwgXCJoYXNEYXRhQXR0cnNcIiwgITApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJvYmplY3RcIiA9PSB0eXBlb2YgYSA/IHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgWC5zZXQodGhpcywgYSlcbiAgICAgICAgICAgIH0pIDogVCh0aGlzLCBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHZhciBjO1xuICAgICAgICAgICAgICAgIGlmIChmICYmIHZvaWQgMCA9PT0gYikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9IFguZ2V0KGYsIGEpLCB2b2lkIDAgIT09IGMpIHJldHVybiBjO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9IF8oZiwgYSksIHZvaWQgMCAhPT0gYykgcmV0dXJuIGNcbiAgICAgICAgICAgICAgICB9IGVsc2UgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgWC5zZXQodGhpcywgYSwgYilcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSwgbnVsbCwgYiwgYXJndW1lbnRzLmxlbmd0aCA+IDEsIG51bGwsICEwKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVEYXRhOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgWC5yZW1vdmUodGhpcywgYSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KSwgci5leHRlbmQoe1xuICAgICAgICBxdWV1ZTogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkO1xuICAgICAgICAgICAgaWYgKGEpIHJldHVybiBiID0gKGIgfHwgXCJmeFwiKSArIFwicXVldWVcIiwgZCA9IFcuZ2V0KGEsIGIpLCBjICYmICghZCB8fCBBcnJheS5pc0FycmF5KGMpID8gZCA9IFcuYWNjZXNzKGEsIGIsIHIubWFrZUFycmF5KGMpKSA6IGQucHVzaChjKSksIGQgfHwgW11cbiAgICAgICAgfSxcbiAgICAgICAgZGVxdWV1ZTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGIgPSBiIHx8IFwiZnhcIjtcbiAgICAgICAgICAgIHZhciBjID0gci5xdWV1ZShhLCBiKSxcbiAgICAgICAgICAgICAgICBkID0gYy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgZSA9IGMuc2hpZnQoKSxcbiAgICAgICAgICAgICAgICBmID0gci5fcXVldWVIb29rcyhhLCBiKSxcbiAgICAgICAgICAgICAgICBnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByLmRlcXVldWUoYSwgYilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgXCJpbnByb2dyZXNzXCIgPT09IGUgJiYgKGUgPSBjLnNoaWZ0KCksIGQtLSksIGUgJiYgKFwiZnhcIiA9PT0gYiAmJiBjLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpLCBkZWxldGUgZi5zdG9wLCBlLmNhbGwoYSwgZywgZikpLCAhZCAmJiBmICYmIGYuZW1wdHkuZmlyZSgpXG4gICAgICAgIH0sXG4gICAgICAgIF9xdWV1ZUhvb2tzOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSBiICsgXCJxdWV1ZUhvb2tzXCI7XG4gICAgICAgICAgICByZXR1cm4gVy5nZXQoYSwgYykgfHwgVy5hY2Nlc3MoYSwgYywge1xuICAgICAgICAgICAgICAgIGVtcHR5OiByLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIFcucmVtb3ZlKGEsIFtiICsgXCJxdWV1ZVwiLCBjXSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pLCByLmZuLmV4dGVuZCh7XG4gICAgICAgIHF1ZXVlOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSAyO1xuICAgICAgICAgICAgcmV0dXJuIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEgJiYgKGIgPSBhLCBhID0gXCJmeFwiLCBjLS0pLCBhcmd1bWVudHMubGVuZ3RoIDwgYyA/IHIucXVldWUodGhpc1swXSwgYSkgOiB2b2lkIDAgPT09IGIgPyB0aGlzIDogdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHIucXVldWUodGhpcywgYSwgYik7XG4gICAgICAgICAgICAgICAgci5fcXVldWVIb29rcyh0aGlzLCBhKSwgXCJmeFwiID09PSBhICYmIFwiaW5wcm9ncmVzc1wiICE9PSBjWzBdICYmIHIuZGVxdWV1ZSh0aGlzLCBhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZGVxdWV1ZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHIuZGVxdWV1ZSh0aGlzLCBhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYXJRdWV1ZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlKGEgfHwgXCJmeFwiLCBbXSlcbiAgICAgICAgfSxcbiAgICAgICAgcHJvbWlzZTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjLCBkID0gMSxcbiAgICAgICAgICAgICAgICBlID0gci5EZWZlcnJlZCgpLFxuICAgICAgICAgICAgICAgIGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGcgPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAtLWQgfHwgZS5yZXNvbHZlV2l0aChmLCBbZl0pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEgJiYgKGIgPSBhLCBhID0gdm9pZCAwKSwgYSA9IGEgfHwgXCJmeFwiO1xuICAgICAgICAgICAgd2hpbGUgKGctLSkgYyA9IFcuZ2V0KGZbZ10sIGEgKyBcInF1ZXVlSG9va3NcIiksIGMgJiYgYy5lbXB0eSAmJiAoZCsrLCBjLmVtcHR5LmFkZChoKSk7XG4gICAgICAgICAgICByZXR1cm4gaCgpLCBlLnByb21pc2UoYilcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhYSA9IC9bKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkvLnNvdXJjZSxcbiAgICAgICAgYmEgPSBuZXcgUmVnRXhwKFwiXig/OihbKy1dKT18KShcIiArIGFhICsgXCIpKFthLXolXSopJFwiLCBcImlcIiksXG4gICAgICAgIGNhID0gW1wiVG9wXCIsIFwiUmlnaHRcIiwgXCJCb3R0b21cIiwgXCJMZWZ0XCJdLFxuICAgICAgICBkYSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSA9IGIgfHwgYSwgXCJub25lXCIgPT09IGEuc3R5bGUuZGlzcGxheSB8fCBcIlwiID09PSBhLnN0eWxlLmRpc3BsYXkgJiYgci5jb250YWlucyhhLm93bmVyRG9jdW1lbnQsIGEpICYmIFwibm9uZVwiID09PSByLmNzcyhhLCBcImRpc3BsYXlcIilcbiAgICAgICAgfSxcbiAgICAgICAgZWEgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkge1xuICAgICAgICAgICAgdmFyIGUsIGYsIGcgPSB7fTtcbiAgICAgICAgICAgIGZvciAoZiBpbiBiKSBnW2ZdID0gYS5zdHlsZVtmXSwgYS5zdHlsZVtmXSA9IGJbZl07XG4gICAgICAgICAgICBlID0gYy5hcHBseShhLCBkIHx8IFtdKTtcbiAgICAgICAgICAgIGZvciAoZiBpbiBiKSBhLnN0eWxlW2ZdID0gZ1tmXTtcbiAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgIH07XG5cbiAgICBmdW5jdGlvbiBmYShhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciBlLCBmID0gMSxcbiAgICAgICAgICAgIGcgPSAyMCxcbiAgICAgICAgICAgIGggPSBkID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmN1cigpXG4gICAgICAgICAgICB9IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByLmNzcyhhLCBiLCBcIlwiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGkgPSBoKCksXG4gICAgICAgICAgICBqID0gYyAmJiBjWzNdIHx8IChyLmNzc051bWJlcltiXSA/IFwiXCIgOiBcInB4XCIpLFxuICAgICAgICAgICAgayA9IChyLmNzc051bWJlcltiXSB8fCBcInB4XCIgIT09IGogJiYgK2kpICYmIGJhLmV4ZWMoci5jc3MoYSwgYikpO1xuICAgICAgICBpZiAoayAmJiBrWzNdICE9PSBqKSB7XG4gICAgICAgICAgICBqID0gaiB8fCBrWzNdLCBjID0gYyB8fCBbXSwgayA9ICtpIHx8IDE7XG4gICAgICAgICAgICBkbyBmID0gZiB8fCBcIi41XCIsIGsgLz0gZiwgci5zdHlsZShhLCBiLCBrICsgaik7IHdoaWxlIChmICE9PSAoZiA9IGgoKSAvIGkpICYmIDEgIT09IGYgJiYgLS1nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjICYmIChrID0gK2sgfHwgK2kgfHwgMCwgZSA9IGNbMV0gPyBrICsgKGNbMV0gKyAxKSAqIGNbMl0gOiArY1syXSwgZCAmJiAoZC51bml0ID0gaiwgZC5zdGFydCA9IGssIGQuZW5kID0gZSkpLCBlXG4gICAgfVxuICAgIHZhciBnYSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gaGEoYSkge1xuICAgICAgICB2YXIgYiwgYyA9IGEub3duZXJEb2N1bWVudCxcbiAgICAgICAgICAgIGQgPSBhLm5vZGVOYW1lLFxuICAgICAgICAgICAgZSA9IGdhW2RdO1xuICAgICAgICByZXR1cm4gZSA/IGUgOiAoYiA9IGMuYm9keS5hcHBlbmRDaGlsZChjLmNyZWF0ZUVsZW1lbnQoZCkpLCBlID0gci5jc3MoYiwgXCJkaXNwbGF5XCIpLCBiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYiksIFwibm9uZVwiID09PSBlICYmIChlID0gXCJibG9ja1wiKSwgZ2FbZF0gPSBlLCBlKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlhKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgYywgZCwgZSA9IFtdLCBmID0gMCwgZyA9IGEubGVuZ3RoOyBmIDwgZzsgZisrKSBkID0gYVtmXSwgZC5zdHlsZSAmJiAoYyA9IGQuc3R5bGUuZGlzcGxheSwgYiA/IChcIm5vbmVcIiA9PT0gYyAmJiAoZVtmXSA9IFcuZ2V0KGQsIFwiZGlzcGxheVwiKSB8fCBudWxsLCBlW2ZdIHx8IChkLnN0eWxlLmRpc3BsYXkgPSBcIlwiKSksIFwiXCIgPT09IGQuc3R5bGUuZGlzcGxheSAmJiBkYShkKSAmJiAoZVtmXSA9IGhhKGQpKSkgOiBcIm5vbmVcIiAhPT0gYyAmJiAoZVtmXSA9IFwibm9uZVwiLCBXLnNldChkLCBcImRpc3BsYXlcIiwgYykpKTtcbiAgICAgICAgZm9yIChmID0gMDsgZiA8IGc7IGYrKykgbnVsbCAhPSBlW2ZdICYmIChhW2ZdLnN0eWxlLmRpc3BsYXkgPSBlW2ZdKTtcbiAgICAgICAgcmV0dXJuIGFcbiAgICB9XG4gICAgci5mbi5leHRlbmQoe1xuICAgICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaWEodGhpcywgITApXG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpYSh0aGlzKVxuICAgICAgICB9LFxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJib29sZWFuXCIgPT0gdHlwZW9mIGEgPyBhID8gdGhpcy5zaG93KCkgOiB0aGlzLmhpZGUoKSA6IHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGEodGhpcykgPyByKHRoaXMpLnNob3coKSA6IHIodGhpcykuaGlkZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGphID0gL14oPzpjaGVja2JveHxyYWRpbykkL2ksXG4gICAgICAgIGthID0gLzwoW2Etel1bXlxcL1xcMD5cXHgyMFxcdFxcclxcblxcZl0rKS9pLFxuICAgICAgICBsYSA9IC9eJHxcXC8oPzpqYXZhfGVjbWEpc2NyaXB0L2ksXG4gICAgICAgIG1hID0ge1xuICAgICAgICAgICAgb3B0aW9uOiBbMSwgXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsIFwiPC9zZWxlY3Q+XCJdLFxuICAgICAgICAgICAgdGhlYWQ6IFsxLCBcIjx0YWJsZT5cIiwgXCI8L3RhYmxlPlwiXSxcbiAgICAgICAgICAgIGNvbDogWzIsIFwiPHRhYmxlPjxjb2xncm91cD5cIiwgXCI8L2NvbGdyb3VwPjwvdGFibGU+XCJdLFxuICAgICAgICAgICAgdHI6IFsyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiXSxcbiAgICAgICAgICAgIHRkOiBbMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sXG4gICAgICAgICAgICBfZGVmYXVsdDogWzAsIFwiXCIsIFwiXCJdXG4gICAgICAgIH07XG4gICAgbWEub3B0Z3JvdXAgPSBtYS5vcHRpb24sIG1hLnRib2R5ID0gbWEudGZvb3QgPSBtYS5jb2xncm91cCA9IG1hLmNhcHRpb24gPSBtYS50aGVhZCwgbWEudGggPSBtYS50ZDtcblxuICAgIGZ1bmN0aW9uIG5hKGEsIGIpIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIHJldHVybiBjID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYS5nZXRFbGVtZW50c0J5VGFnTmFtZSA/IGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYiB8fCBcIipcIikgOiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBhLnF1ZXJ5U2VsZWN0b3JBbGwgPyBhLnF1ZXJ5U2VsZWN0b3JBbGwoYiB8fCBcIipcIikgOiBbXSwgdm9pZCAwID09PSBiIHx8IGIgJiYgQihhLCBiKSA/IHIubWVyZ2UoW2FdLCBjKSA6IGNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvYShhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwLCBkID0gYS5sZW5ndGg7IGMgPCBkOyBjKyspIFcuc2V0KGFbY10sIFwiZ2xvYmFsRXZhbFwiLCAhYiB8fCBXLmdldChiW2NdLCBcImdsb2JhbEV2YWxcIikpXG4gICAgfVxuICAgIHZhciBwYSA9IC88fCYjP1xcdys7LztcblxuICAgIGZ1bmN0aW9uIHFhKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgZm9yICh2YXIgZiwgZywgaCwgaSwgaiwgaywgbCA9IGIuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBtID0gW10sIG4gPSAwLCBvID0gYS5sZW5ndGg7IG4gPCBvOyBuKyspXG4gICAgICAgICAgICBpZiAoZiA9IGFbbl0sIGYgfHwgMCA9PT0gZilcbiAgICAgICAgICAgICAgICBpZiAoXCJvYmplY3RcIiA9PT0gci50eXBlKGYpKSByLm1lcmdlKG0sIGYubm9kZVR5cGUgPyBbZl0gOiBmKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYS50ZXN0KGYpKSB7XG4gICAgICAgICAgICBnID0gZyB8fCBsLmFwcGVuZENoaWxkKGIuY3JlYXRlRWxlbWVudChcImRpdlwiKSksIGggPSAoa2EuZXhlYyhmKSB8fCBbXCJcIiwgXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCksIGkgPSBtYVtoXSB8fCBtYS5fZGVmYXVsdCwgZy5pbm5lckhUTUwgPSBpWzFdICsgci5odG1sUHJlZmlsdGVyKGYpICsgaVsyXSwgayA9IGlbMF07XG4gICAgICAgICAgICB3aGlsZSAoay0tKSBnID0gZy5sYXN0Q2hpbGQ7XG4gICAgICAgICAgICByLm1lcmdlKG0sIGcuY2hpbGROb2RlcyksIGcgPSBsLmZpcnN0Q2hpbGQsIGcudGV4dENvbnRlbnQgPSBcIlwiXG4gICAgICAgIH0gZWxzZSBtLnB1c2goYi5jcmVhdGVUZXh0Tm9kZShmKSk7XG4gICAgICAgIGwudGV4dENvbnRlbnQgPSBcIlwiLCBuID0gMDtcbiAgICAgICAgd2hpbGUgKGYgPSBtW24rK10pXG4gICAgICAgICAgICBpZiAoZCAmJiByLmluQXJyYXkoZiwgZCkgPiAtMSkgZSAmJiBlLnB1c2goZik7XG4gICAgICAgICAgICBlbHNlIGlmIChqID0gci5jb250YWlucyhmLm93bmVyRG9jdW1lbnQsIGYpLCBnID0gbmEobC5hcHBlbmRDaGlsZChmKSwgXCJzY3JpcHRcIiksIGogJiYgb2EoZyksIGMpIHtcbiAgICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGYgPSBnW2srK10pIGxhLnRlc3QoZi50eXBlIHx8IFwiXCIpICYmIGMucHVzaChmKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsXG4gICAgfSEgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IGQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgYiA9IGEuYXBwZW5kQ2hpbGQoZC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxcbiAgICAgICAgICAgIGMgPSBkLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgYy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFkaW9cIiksIGMuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIiksIGMuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInRcIiksIGIuYXBwZW5kQ2hpbGQoYyksIG8uY2hlY2tDbG9uZSA9IGIuY2xvbmVOb2RlKCEwKS5jbG9uZU5vZGUoITApLmxhc3RDaGlsZC5jaGVja2VkLCBiLmlubmVySFRNTCA9IFwiPHRleHRhcmVhPng8L3RleHRhcmVhPlwiLCBvLm5vQ2xvbmVDaGVja2VkID0gISFiLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZVxuICAgIH0oKTtcbiAgICB2YXIgcmEgPSBkLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgc2EgPSAvXmtleS8sXG4gICAgICAgIHRhID0gL14oPzptb3VzZXxwb2ludGVyfGNvbnRleHRtZW51fGRyYWd8ZHJvcCl8Y2xpY2svLFxuICAgICAgICB1YSA9IC9eKFteLl0qKSg/OlxcLiguKyl8KS87XG5cbiAgICBmdW5jdGlvbiB2YSgpIHtcbiAgICAgICAgcmV0dXJuICEwXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2EoKSB7XG4gICAgICAgIHJldHVybiAhMVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHhhKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGQuYWN0aXZlRWxlbWVudFxuICAgICAgICB9IGNhdGNoIChhKSB7fVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHlhKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAgICAgdmFyIGcsIGg7XG4gICAgICAgIGlmIChcIm9iamVjdFwiID09IHR5cGVvZiBiKSB7XG4gICAgICAgICAgICBcInN0cmluZ1wiICE9IHR5cGVvZiBjICYmIChkID0gZCB8fCBjLCBjID0gdm9pZCAwKTtcbiAgICAgICAgICAgIGZvciAoaCBpbiBiKSB5YShhLCBoLCBjLCBkLCBiW2hdLCBmKTtcbiAgICAgICAgICAgIHJldHVybiBhXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bGwgPT0gZCAmJiBudWxsID09IGUgPyAoZSA9IGMsIGQgPSBjID0gdm9pZCAwKSA6IG51bGwgPT0gZSAmJiAoXCJzdHJpbmdcIiA9PSB0eXBlb2YgYyA/IChlID0gZCwgZCA9IHZvaWQgMCkgOiAoZSA9IGQsIGQgPSBjLCBjID0gdm9pZCAwKSksIGUgPT09ICExKSBlID0gd2E7XG4gICAgICAgIGVsc2UgaWYgKCFlKSByZXR1cm4gYTtcbiAgICAgICAgcmV0dXJuIDEgPT09IGYgJiYgKGcgPSBlLCBlID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiByKCkub2ZmKGEpLCBnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfSwgZS5ndWlkID0gZy5ndWlkIHx8IChnLmd1aWQgPSByLmd1aWQrKykpLCBhLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgci5ldmVudC5hZGQodGhpcywgYiwgZSwgZCwgYylcbiAgICAgICAgfSlcbiAgICB9XG4gICAgci5ldmVudCA9IHtcbiAgICAgICAgZ2xvYmFsOiB7fSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSkge1xuICAgICAgICAgICAgdmFyIGYsIGcsIGgsIGksIGosIGssIGwsIG0sIG4sIG8sIHAsIHEgPSBXLmdldChhKTtcbiAgICAgICAgICAgIGlmIChxKSB7XG4gICAgICAgICAgICAgICAgYy5oYW5kbGVyICYmIChmID0gYywgYyA9IGYuaGFuZGxlciwgZSA9IGYuc2VsZWN0b3IpLCBlICYmIHIuZmluZC5tYXRjaGVzU2VsZWN0b3IocmEsIGUpLCBjLmd1aWQgfHwgKGMuZ3VpZCA9IHIuZ3VpZCsrKSwgKGkgPSBxLmV2ZW50cykgfHwgKGkgPSBxLmV2ZW50cyA9IHt9KSwgKGcgPSBxLmhhbmRsZSkgfHwgKGcgPSBxLmhhbmRsZSA9IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiByICYmIHIuZXZlbnQudHJpZ2dlcmVkICE9PSBiLnR5cGUgPyByLmV2ZW50LmRpc3BhdGNoLmFwcGx5KGEsIGFyZ3VtZW50cykgOiB2b2lkIDBcbiAgICAgICAgICAgICAgICB9KSwgYiA9IChiIHx8IFwiXCIpLm1hdGNoKEwpIHx8IFtcIlwiXSwgaiA9IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChqLS0pIGggPSB1YS5leGVjKGJbal0pIHx8IFtdLCBuID0gcCA9IGhbMV0sIG8gPSAoaFsyXSB8fCBcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLCBuICYmIChsID0gci5ldmVudC5zcGVjaWFsW25dIHx8IHt9LCBuID0gKGUgPyBsLmRlbGVnYXRlVHlwZSA6IGwuYmluZFR5cGUpIHx8IG4sIGwgPSByLmV2ZW50LnNwZWNpYWxbbl0gfHwge30sIGsgPSByLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG4sXG4gICAgICAgICAgICAgICAgICAgIG9yaWdUeXBlOiBwLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBjLFxuICAgICAgICAgICAgICAgICAgICBndWlkOiBjLmd1aWQsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBlLFxuICAgICAgICAgICAgICAgICAgICBuZWVkc0NvbnRleHQ6IGUgJiYgci5leHByLm1hdGNoLm5lZWRzQ29udGV4dC50ZXN0KGUpLFxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IG8uam9pbihcIi5cIilcbiAgICAgICAgICAgICAgICB9LCBmKSwgKG0gPSBpW25dKSB8fCAobSA9IGlbbl0gPSBbXSwgbS5kZWxlZ2F0ZUNvdW50ID0gMCwgbC5zZXR1cCAmJiBsLnNldHVwLmNhbGwoYSwgZCwgbywgZykgIT09ICExIHx8IGEuYWRkRXZlbnRMaXN0ZW5lciAmJiBhLmFkZEV2ZW50TGlzdGVuZXIobiwgZykpLCBsLmFkZCAmJiAobC5hZGQuY2FsbChhLCBrKSwgay5oYW5kbGVyLmd1aWQgfHwgKGsuaGFuZGxlci5ndWlkID0gYy5ndWlkKSksIGUgPyBtLnNwbGljZShtLmRlbGVnYXRlQ291bnQrKywgMCwgaykgOiBtLnB1c2goayksIHIuZXZlbnQuZ2xvYmFsW25dID0gITApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgICAgIHZhciBmLCBnLCBoLCBpLCBqLCBrLCBsLCBtLCBuLCBvLCBwLCBxID0gVy5oYXNEYXRhKGEpICYmIFcuZ2V0KGEpO1xuICAgICAgICAgICAgaWYgKHEgJiYgKGkgPSBxLmV2ZW50cykpIHtcbiAgICAgICAgICAgICAgICBiID0gKGIgfHwgXCJcIikubWF0Y2goTCkgfHwgW1wiXCJdLCBqID0gYi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGotLSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGggPSB1YS5leGVjKGJbal0pIHx8IFtdLCBuID0gcCA9IGhbMV0sIG8gPSAoaFsyXSB8fCBcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLCBuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsID0gci5ldmVudC5zcGVjaWFsW25dIHx8IHt9LCBuID0gKGQgPyBsLmRlbGVnYXRlVHlwZSA6IGwuYmluZFR5cGUpIHx8IG4sIG0gPSBpW25dIHx8IFtdLCBoID0gaFsyXSAmJiBuZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIgKyBvLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKSArIFwiKFxcXFwufCQpXCIpLCBnID0gZiA9IG0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGYtLSkgayA9IG1bZl0sICFlICYmIHAgIT09IGsub3JpZ1R5cGUgfHwgYyAmJiBjLmd1aWQgIT09IGsuZ3VpZCB8fCBoICYmICFoLnRlc3Qoay5uYW1lc3BhY2UpIHx8IGQgJiYgZCAhPT0gay5zZWxlY3RvciAmJiAoXCIqKlwiICE9PSBkIHx8ICFrLnNlbGVjdG9yKSB8fCAobS5zcGxpY2UoZiwgMSksIGsuc2VsZWN0b3IgJiYgbS5kZWxlZ2F0ZUNvdW50LS0sIGwucmVtb3ZlICYmIGwucmVtb3ZlLmNhbGwoYSwgaykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyAmJiAhbS5sZW5ndGggJiYgKGwudGVhcmRvd24gJiYgbC50ZWFyZG93bi5jYWxsKGEsIG8sIHEuaGFuZGxlKSAhPT0gITEgfHwgci5yZW1vdmVFdmVudChhLCBuLCBxLmhhbmRsZSksIGRlbGV0ZSBpW25dKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobiBpbiBpKSByLmV2ZW50LnJlbW92ZShhLCBuICsgYltqXSwgYywgZCwgITApO1xuICAgICAgICAgICAgICAgIHIuaXNFbXB0eU9iamVjdChpKSAmJiBXLnJlbW92ZShhLCBcImhhbmRsZSBldmVudHNcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IHIuZXZlbnQuZml4KGEpLFxuICAgICAgICAgICAgICAgIGMsIGQsIGUsIGYsIGcsIGgsIGkgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgaiA9IChXLmdldCh0aGlzLCBcImV2ZW50c1wiKSB8fCB7fSlbYi50eXBlXSB8fCBbXSxcbiAgICAgICAgICAgICAgICBrID0gci5ldmVudC5zcGVjaWFsW2IudHlwZV0gfHwge307XG4gICAgICAgICAgICBmb3IgKGlbMF0gPSBiLCBjID0gMTsgYyA8IGFyZ3VtZW50cy5sZW5ndGg7IGMrKykgaVtjXSA9IGFyZ3VtZW50c1tjXTtcbiAgICAgICAgICAgIGlmIChiLmRlbGVnYXRlVGFyZ2V0ID0gdGhpcywgIWsucHJlRGlzcGF0Y2ggfHwgay5wcmVEaXNwYXRjaC5jYWxsKHRoaXMsIGIpICE9PSAhMSkge1xuICAgICAgICAgICAgICAgIGggPSByLmV2ZW50LmhhbmRsZXJzLmNhbGwodGhpcywgYiwgaiksIGMgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlICgoZiA9IGhbYysrXSkgJiYgIWIuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBiLmN1cnJlbnRUYXJnZXQgPSBmLmVsZW0sIGQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGcgPSBmLmhhbmRsZXJzW2QrK10pICYmICFiLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkpIGIucm5hbWVzcGFjZSAmJiAhYi5ybmFtZXNwYWNlLnRlc3QoZy5uYW1lc3BhY2UpIHx8IChiLmhhbmRsZU9iaiA9IGcsIGIuZGF0YSA9IGcuZGF0YSwgZSA9ICgoci5ldmVudC5zcGVjaWFsW2cub3JpZ1R5cGVdIHx8IHt9KS5oYW5kbGUgfHwgZy5oYW5kbGVyKS5hcHBseShmLmVsZW0sIGkpLCB2b2lkIDAgIT09IGUgJiYgKGIucmVzdWx0ID0gZSkgPT09ICExICYmIChiLnByZXZlbnREZWZhdWx0KCksIGIuc3RvcFByb3BhZ2F0aW9uKCkpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gay5wb3N0RGlzcGF0Y2ggJiYgay5wb3N0RGlzcGF0Y2guY2FsbCh0aGlzLCBiKSwgYi5yZXN1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlcnM6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgYywgZCwgZSwgZiwgZywgaCA9IFtdLFxuICAgICAgICAgICAgICAgIGkgPSBiLmRlbGVnYXRlQ291bnQsXG4gICAgICAgICAgICAgICAgaiA9IGEudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKGkgJiYgai5ub2RlVHlwZSAmJiAhKFwiY2xpY2tcIiA9PT0gYS50eXBlICYmIGEuYnV0dG9uID49IDEpKVxuICAgICAgICAgICAgICAgIGZvciAoOyBqICE9PSB0aGlzOyBqID0gai5wYXJlbnROb2RlIHx8IHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBqLm5vZGVUeXBlICYmIChcImNsaWNrXCIgIT09IGEudHlwZSB8fCBqLmRpc2FibGVkICE9PSAhMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoZiA9IFtdLCBnID0ge30sIGMgPSAwOyBjIDwgaTsgYysrKSBkID0gYltjXSwgZSA9IGQuc2VsZWN0b3IgKyBcIiBcIiwgdm9pZCAwID09PSBnW2VdICYmIChnW2VdID0gZC5uZWVkc0NvbnRleHQgPyByKGUsIHRoaXMpLmluZGV4KGopID4gLTEgOiByLmZpbmQoZSwgdGhpcywgbnVsbCwgW2pdKS5sZW5ndGgpLCBnW2VdICYmIGYucHVzaChkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYubGVuZ3RoICYmIGgucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbTogaixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyczogZlxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGogPSB0aGlzLCBpIDwgYi5sZW5ndGggJiYgaC5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbGVtOiBqLFxuICAgICAgICAgICAgICAgIGhhbmRsZXJzOiBiLnNsaWNlKGkpXG4gICAgICAgICAgICB9KSwgaFxuICAgICAgICB9LFxuICAgICAgICBhZGRQcm9wOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHIuRXZlbnQucHJvdG90eXBlLCBhLCB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogITAsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICBnZXQ6IHIuaXNGdW5jdGlvbihiKSA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudCkgcmV0dXJuIGIodGhpcy5vcmlnaW5hbEV2ZW50KVxuICAgICAgICAgICAgICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQpIHJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnRbYV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6ICEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZml4OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGFbci5leHBhbmRvXSA/IGEgOiBuZXcgci5FdmVudChhKVxuICAgICAgICB9LFxuICAgICAgICBzcGVjaWFsOiB7XG4gICAgICAgICAgICBsb2FkOiB7XG4gICAgICAgICAgICAgICAgbm9CdWJibGU6ICEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9jdXM6IHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzICE9PSB4YSgpICYmIHRoaXMuZm9jdXMpIHJldHVybiB0aGlzLmZvY3VzKCksICExXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZVR5cGU6IFwiZm9jdXNpblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmx1cjoge1xuICAgICAgICAgICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IHhhKCkgJiYgdGhpcy5ibHVyKSByZXR1cm4gdGhpcy5ibHVyKCksICExXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZVR5cGU6IFwiZm9jdXNvdXRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsaWNrOiB7XG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXCJjaGVja2JveFwiID09PSB0aGlzLnR5cGUgJiYgdGhpcy5jbGljayAmJiBCKHRoaXMsIFwiaW5wdXRcIikpIHJldHVybiB0aGlzLmNsaWNrKCksICExXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfZGVmYXVsdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEIoYS50YXJnZXQsIFwiYVwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmV1bmxvYWQ6IHtcbiAgICAgICAgICAgICAgICBwb3N0RGlzcGF0Y2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZvaWQgMCAhPT0gYS5yZXN1bHQgJiYgYS5vcmlnaW5hbEV2ZW50ICYmIChhLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBhLnJlc3VsdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCByLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgYS5yZW1vdmVFdmVudExpc3RlbmVyICYmIGEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLCBjKVxuICAgIH0sIHIuRXZlbnQgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIHIuRXZlbnQgPyAoYSAmJiBhLnR5cGUgPyAodGhpcy5vcmlnaW5hbEV2ZW50ID0gYSwgdGhpcy50eXBlID0gYS50eXBlLCB0aGlzLmlzRGVmYXVsdFByZXZlbnRlZCA9IGEuZGVmYXVsdFByZXZlbnRlZCB8fCB2b2lkIDAgPT09IGEuZGVmYXVsdFByZXZlbnRlZCAmJiBhLnJldHVyblZhbHVlID09PSAhMSA/IHZhIDogd2EsIHRoaXMudGFyZ2V0ID0gYS50YXJnZXQgJiYgMyA9PT0gYS50YXJnZXQubm9kZVR5cGUgPyBhLnRhcmdldC5wYXJlbnROb2RlIDogYS50YXJnZXQsIHRoaXMuY3VycmVudFRhcmdldCA9IGEuY3VycmVudFRhcmdldCwgdGhpcy5yZWxhdGVkVGFyZ2V0ID0gYS5yZWxhdGVkVGFyZ2V0KSA6IHRoaXMudHlwZSA9IGEsIGIgJiYgci5leHRlbmQodGhpcywgYiksIHRoaXMudGltZVN0YW1wID0gYSAmJiBhLnRpbWVTdGFtcCB8fCByLm5vdygpLCB2b2lkKHRoaXNbci5leHBhbmRvXSA9ICEwKSkgOiBuZXcgci5FdmVudChhLCBiKVxuICAgIH0sIHIuRXZlbnQucHJvdG90eXBlID0ge1xuICAgICAgICBjb25zdHJ1Y3Rvcjogci5FdmVudCxcbiAgICAgICAgaXNEZWZhdWx0UHJldmVudGVkOiB3YSxcbiAgICAgICAgaXNQcm9wYWdhdGlvblN0b3BwZWQ6IHdhLFxuICAgICAgICBpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDogd2EsXG4gICAgICAgIGlzU2ltdWxhdGVkOiAhMSxcbiAgICAgICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgICAgdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSB2YSwgYSAmJiAhdGhpcy5pc1NpbXVsYXRlZCAmJiBhLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMub3JpZ2luYWxFdmVudDtcbiAgICAgICAgICAgIHRoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQgPSB2YSwgYSAmJiAhdGhpcy5pc1NpbXVsYXRlZCAmJiBhLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIH0sXG4gICAgICAgIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgICB0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gdmEsIGEgJiYgIXRoaXMuaXNTaW11bGF0ZWQgJiYgYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSwgdGhpcy5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICB9XG4gICAgfSwgci5lYWNoKHtcbiAgICAgICAgYWx0S2V5OiAhMCxcbiAgICAgICAgYnViYmxlczogITAsXG4gICAgICAgIGNhbmNlbGFibGU6ICEwLFxuICAgICAgICBjaGFuZ2VkVG91Y2hlczogITAsXG4gICAgICAgIGN0cmxLZXk6ICEwLFxuICAgICAgICBkZXRhaWw6ICEwLFxuICAgICAgICBldmVudFBoYXNlOiAhMCxcbiAgICAgICAgbWV0YUtleTogITAsXG4gICAgICAgIHBhZ2VYOiAhMCxcbiAgICAgICAgcGFnZVk6ICEwLFxuICAgICAgICBzaGlmdEtleTogITAsXG4gICAgICAgIHZpZXc6ICEwLFxuICAgICAgICBcImNoYXJcIjogITAsXG4gICAgICAgIGNoYXJDb2RlOiAhMCxcbiAgICAgICAga2V5OiAhMCxcbiAgICAgICAga2V5Q29kZTogITAsXG4gICAgICAgIGJ1dHRvbjogITAsXG4gICAgICAgIGJ1dHRvbnM6ICEwLFxuICAgICAgICBjbGllbnRYOiAhMCxcbiAgICAgICAgY2xpZW50WTogITAsXG4gICAgICAgIG9mZnNldFg6ICEwLFxuICAgICAgICBvZmZzZXRZOiAhMCxcbiAgICAgICAgcG9pbnRlcklkOiAhMCxcbiAgICAgICAgcG9pbnRlclR5cGU6ICEwLFxuICAgICAgICBzY3JlZW5YOiAhMCxcbiAgICAgICAgc2NyZWVuWTogITAsXG4gICAgICAgIHRhcmdldFRvdWNoZXM6ICEwLFxuICAgICAgICB0b0VsZW1lbnQ6ICEwLFxuICAgICAgICB0b3VjaGVzOiAhMCxcbiAgICAgICAgd2hpY2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGEuYnV0dG9uO1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgPT0gYS53aGljaCAmJiBzYS50ZXN0KGEudHlwZSkgPyBudWxsICE9IGEuY2hhckNvZGUgPyBhLmNoYXJDb2RlIDogYS5rZXlDb2RlIDogIWEud2hpY2ggJiYgdm9pZCAwICE9PSBiICYmIHRhLnRlc3QoYS50eXBlKSA/IDEgJiBiID8gMSA6IDIgJiBiID8gMyA6IDQgJiBiID8gMiA6IDAgOiBhLndoaWNoXG4gICAgICAgIH1cbiAgICB9LCByLmV2ZW50LmFkZFByb3ApLCByLmVhY2goe1xuICAgICAgICBtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuICAgICAgICBtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCIsXG4gICAgICAgIHBvaW50ZXJlbnRlcjogXCJwb2ludGVyb3ZlclwiLFxuICAgICAgICBwb2ludGVybGVhdmU6IFwicG9pbnRlcm91dFwiXG4gICAgfSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgci5ldmVudC5zcGVjaWFsW2FdID0ge1xuICAgICAgICAgICAgZGVsZWdhdGVUeXBlOiBiLFxuICAgICAgICAgICAgYmluZFR5cGU6IGIsXG4gICAgICAgICAgICBoYW5kbGU6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMsIGQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBlID0gYS5yZWxhdGVkVGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICBmID0gYS5oYW5kbGVPYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUgJiYgKGUgPT09IGQgfHwgci5jb250YWlucyhkLCBlKSkgfHwgKGEudHlwZSA9IGYub3JpZ1R5cGUsIGMgPSBmLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgYS50eXBlID0gYiksIGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pLCByLmZuLmV4dGVuZCh7XG4gICAgICAgIG9uOiBmdW5jdGlvbiAoYSwgYiwgYywgZCkge1xuICAgICAgICAgICAgcmV0dXJuIHlhKHRoaXMsIGEsIGIsIGMsIGQpXG4gICAgICAgIH0sXG4gICAgICAgIG9uZTogZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIHJldHVybiB5YSh0aGlzLCBhLCBiLCBjLCBkLCAxKVxuICAgICAgICB9LFxuICAgICAgICBvZmY6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZCwgZTtcbiAgICAgICAgICAgIGlmIChhICYmIGEucHJldmVudERlZmF1bHQgJiYgYS5oYW5kbGVPYmopIHJldHVybiBkID0gYS5oYW5kbGVPYmosIHIoYS5kZWxlZ2F0ZVRhcmdldCkub2ZmKGQubmFtZXNwYWNlID8gZC5vcmlnVHlwZSArIFwiLlwiICsgZC5uYW1lc3BhY2UgOiBkLm9yaWdUeXBlLCBkLnNlbGVjdG9yLCBkLmhhbmRsZXIpLCB0aGlzO1xuICAgICAgICAgICAgaWYgKFwib2JqZWN0XCIgPT0gdHlwZW9mIGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGUgaW4gYSkgdGhpcy5vZmYoZSwgYiwgYVtlXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiICE9PSAhMSAmJiBcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIGIgfHwgKGMgPSBiLCBiID0gdm9pZCAwKSwgYyA9PT0gITEgJiYgKGMgPSB3YSksIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgci5ldmVudC5yZW1vdmUodGhpcywgYSwgYywgYilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgemEgPSAvPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbYS16XVteXFwvXFwwPlxceDIwXFx0XFxyXFxuXFxmXSopW14+XSopXFwvPi9naSxcbiAgICAgICAgQWEgPSAvPHNjcmlwdHw8c3R5bGV8PGxpbmsvaSxcbiAgICAgICAgQmEgPSAvY2hlY2tlZFxccyooPzpbXj1dfD1cXHMqLmNoZWNrZWQuKS9pLFxuICAgICAgICBDYSA9IC9edHJ1ZVxcLyguKikvLFxuICAgICAgICBEYSA9IC9eXFxzKjwhKD86XFxbQ0RBVEFcXFt8LS0pfCg/OlxcXVxcXXwtLSk+XFxzKiQvZztcblxuICAgIGZ1bmN0aW9uIEVhKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIEIoYSwgXCJ0YWJsZVwiKSAmJiBCKDExICE9PSBiLm5vZGVUeXBlID8gYiA6IGIuZmlyc3RDaGlsZCwgXCJ0clwiKSA/IHIoXCI+dGJvZHlcIiwgYSlbMF0gfHwgYSA6IGFcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGYShhKSB7XG4gICAgICAgIHJldHVybiBhLnR5cGUgPSAobnVsbCAhPT0gYS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKSArIFwiL1wiICsgYS50eXBlLCBhXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gR2EoYSkge1xuICAgICAgICB2YXIgYiA9IENhLmV4ZWMoYS50eXBlKTtcbiAgICAgICAgcmV0dXJuIGIgPyBhLnR5cGUgPSBiWzFdIDogYS5yZW1vdmVBdHRyaWJ1dGUoXCJ0eXBlXCIpLCBhXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gSGEoYSwgYikge1xuICAgICAgICB2YXIgYywgZCwgZSwgZiwgZywgaCwgaSwgajtcbiAgICAgICAgaWYgKDEgPT09IGIubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGlmIChXLmhhc0RhdGEoYSkgJiYgKGYgPSBXLmFjY2VzcyhhKSwgZyA9IFcuc2V0KGIsIGYpLCBqID0gZi5ldmVudHMpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGcuaGFuZGxlLCBnLmV2ZW50cyA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAoZSBpbiBqKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGMgPSAwLCBkID0galtlXS5sZW5ndGg7IGMgPCBkOyBjKyspIHIuZXZlbnQuYWRkKGIsIGUsIGpbZV1bY10pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBYLmhhc0RhdGEoYSkgJiYgKGggPSBYLmFjY2VzcyhhKSwgaSA9IHIuZXh0ZW5kKHt9LCBoKSwgWC5zZXQoYiwgaSkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBJYShhLCBiKSB7XG4gICAgICAgIHZhciBjID0gYi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcImlucHV0XCIgPT09IGMgJiYgamEudGVzdChhLnR5cGUpID8gYi5jaGVja2VkID0gYS5jaGVja2VkIDogXCJpbnB1dFwiICE9PSBjICYmIFwidGV4dGFyZWFcIiAhPT0gYyB8fCAoYi5kZWZhdWx0VmFsdWUgPSBhLmRlZmF1bHRWYWx1ZSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBKYShhLCBiLCBjLCBkKSB7XG4gICAgICAgIGIgPSBnLmFwcGx5KFtdLCBiKTtcbiAgICAgICAgdmFyIGUsIGYsIGgsIGksIGosIGssIGwgPSAwLFxuICAgICAgICAgICAgbSA9IGEubGVuZ3RoLFxuICAgICAgICAgICAgbiA9IG0gLSAxLFxuICAgICAgICAgICAgcSA9IGJbMF0sXG4gICAgICAgICAgICBzID0gci5pc0Z1bmN0aW9uKHEpO1xuICAgICAgICBpZiAocyB8fCBtID4gMSAmJiBcInN0cmluZ1wiID09IHR5cGVvZiBxICYmICFvLmNoZWNrQ2xvbmUgJiYgQmEudGVzdChxKSkgcmV0dXJuIGEuZWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGYgPSBhLmVxKGUpO1xuICAgICAgICAgICAgcyAmJiAoYlswXSA9IHEuY2FsbCh0aGlzLCBlLCBmLmh0bWwoKSkpLCBKYShmLCBiLCBjLCBkKVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG0gJiYgKGUgPSBxYShiLCBhWzBdLm93bmVyRG9jdW1lbnQsICExLCBhLCBkKSwgZiA9IGUuZmlyc3RDaGlsZCwgMSA9PT0gZS5jaGlsZE5vZGVzLmxlbmd0aCAmJiAoZSA9IGYpLCBmIHx8IGQpKSB7XG4gICAgICAgICAgICBmb3IgKGggPSByLm1hcChuYShlLCBcInNjcmlwdFwiKSwgRmEpLCBpID0gaC5sZW5ndGg7IGwgPCBtOyBsKyspIGogPSBlLCBsICE9PSBuICYmIChqID0gci5jbG9uZShqLCAhMCwgITApLCBpICYmIHIubWVyZ2UoaCwgbmEoaiwgXCJzY3JpcHRcIikpKSwgYy5jYWxsKGFbbF0sIGosIGwpO1xuICAgICAgICAgICAgaWYgKGkpXG4gICAgICAgICAgICAgICAgZm9yIChrID0gaFtoLmxlbmd0aCAtIDFdLm93bmVyRG9jdW1lbnQsIHIubWFwKGgsIEdhKSwgbCA9IDA7IGwgPCBpOyBsKyspIGogPSBoW2xdLCBsYS50ZXN0KGoudHlwZSB8fCBcIlwiKSAmJiAhVy5hY2Nlc3MoaiwgXCJnbG9iYWxFdmFsXCIpICYmIHIuY29udGFpbnMoaywgaikgJiYgKGouc3JjID8gci5fZXZhbFVybCAmJiByLl9ldmFsVXJsKGouc3JjKSA6IHAoai50ZXh0Q29udGVudC5yZXBsYWNlKERhLCBcIlwiKSwgaykpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBLYShhLCBiLCBjKSB7XG4gICAgICAgIGZvciAodmFyIGQsIGUgPSBiID8gci5maWx0ZXIoYiwgYSkgOiBhLCBmID0gMDsgbnVsbCAhPSAoZCA9IGVbZl0pOyBmKyspIGMgfHwgMSAhPT0gZC5ub2RlVHlwZSB8fCByLmNsZWFuRGF0YShuYShkKSksIGQucGFyZW50Tm9kZSAmJiAoYyAmJiByLmNvbnRhaW5zKGQub3duZXJEb2N1bWVudCwgZCkgJiYgb2EobmEoZCwgXCJzY3JpcHRcIikpLCBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCkpO1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cbiAgICByLmV4dGVuZCh7XG4gICAgICAgIGh0bWxQcmVmaWx0ZXI6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5yZXBsYWNlKHphLCBcIjwkMT48LyQyPlwiKVxuICAgICAgICB9LFxuICAgICAgICBjbG9uZTogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkLCBlLCBmLCBnLCBoID0gYS5jbG9uZU5vZGUoITApLFxuICAgICAgICAgICAgICAgIGkgPSByLmNvbnRhaW5zKGEub3duZXJEb2N1bWVudCwgYSk7XG4gICAgICAgICAgICBpZiAoIShvLm5vQ2xvbmVDaGVja2VkIHx8IDEgIT09IGEubm9kZVR5cGUgJiYgMTEgIT09IGEubm9kZVR5cGUgfHwgci5pc1hNTERvYyhhKSkpXG4gICAgICAgICAgICAgICAgZm9yIChnID0gbmEoaCksIGYgPSBuYShhKSwgZCA9IDAsIGUgPSBmLmxlbmd0aDsgZCA8IGU7IGQrKykgSWEoZltkXSwgZ1tkXSk7XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICBpZiAoYylcbiAgICAgICAgICAgICAgICAgICAgZm9yIChmID0gZiB8fCBuYShhKSwgZyA9IGcgfHwgbmEoaCksIGQgPSAwLCBlID0gZi5sZW5ndGg7IGQgPCBlOyBkKyspIEhhKGZbZF0sIGdbZF0pO1xuICAgICAgICAgICAgICAgIGVsc2UgSGEoYSwgaCk7XG4gICAgICAgICAgICByZXR1cm4gZyA9IG5hKGgsIFwic2NyaXB0XCIpLCBnLmxlbmd0aCA+IDAgJiYgb2EoZywgIWkgJiYgbmEoYSwgXCJzY3JpcHRcIikpLCBoXG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFuRGF0YTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGIsIGMsIGQsIGUgPSByLmV2ZW50LnNwZWNpYWwsIGYgPSAwOyB2b2lkIDAgIT09IChjID0gYVtmXSk7IGYrKylcbiAgICAgICAgICAgICAgICBpZiAoVShjKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYiA9IGNbVy5leHBhbmRvXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuZXZlbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoZCBpbiBiLmV2ZW50cykgZVtkXSA/IHIuZXZlbnQucmVtb3ZlKGMsIGQpIDogci5yZW1vdmVFdmVudChjLCBkLCBiLmhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjW1cuZXhwYW5kb10gPSB2b2lkIDBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjW1guZXhwYW5kb10gJiYgKGNbWC5leHBhbmRvXSA9IHZvaWQgMClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSwgci5mbi5leHRlbmQoe1xuICAgICAgICBkZXRhY2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gS2EodGhpcywgYSwgITApXG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBLYSh0aGlzLCBhKVxuICAgICAgICB9LFxuICAgICAgICB0ZXh0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIFQodGhpcywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwID09PSBhID8gci50ZXh0KHRoaXMpIDogdGhpcy5lbXB0eSgpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAxICE9PSB0aGlzLm5vZGVUeXBlICYmIDExICE9PSB0aGlzLm5vZGVUeXBlICYmIDkgIT09IHRoaXMubm9kZVR5cGUgfHwgKHRoaXMudGV4dENvbnRlbnQgPSBhKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LCBudWxsLCBhLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB9LFxuICAgICAgICBhcHBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBKYSh0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgaWYgKDEgPT09IHRoaXMubm9kZVR5cGUgfHwgMTEgPT09IHRoaXMubm9kZVR5cGUgfHwgOSA9PT0gdGhpcy5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IEVhKHRoaXMsIGEpO1xuICAgICAgICAgICAgICAgICAgICBiLmFwcGVuZENoaWxkKGEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgcHJlcGVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEphKHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoMSA9PT0gdGhpcy5ub2RlVHlwZSB8fCAxMSA9PT0gdGhpcy5ub2RlVHlwZSB8fCA5ID09PSB0aGlzLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gRWEodGhpcywgYSk7XG4gICAgICAgICAgICAgICAgICAgIGIuaW5zZXJ0QmVmb3JlKGEsIGIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBKYSh0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlICYmIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgdGhpcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gSmEodGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZSAmJiB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIHRoaXMubmV4dFNpYmxpbmcpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgYSwgYiA9IDA7IG51bGwgIT0gKGEgPSB0aGlzW2JdKTsgYisrKSAxID09PSBhLm5vZGVUeXBlICYmIChyLmNsZWFuRGF0YShuYShhLCAhMSkpLCBhLnRleHRDb250ZW50ID0gXCJcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9LFxuICAgICAgICBjbG9uZTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhID0gbnVsbCAhPSBhICYmIGEsIGIgPSBudWxsID09IGIgPyBhIDogYiwgdGhpcy5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByLmNsb25lKHRoaXMsIGEsIGIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBodG1sOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIFQodGhpcywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHRoaXNbMF0gfHwge30sXG4gICAgICAgICAgICAgICAgICAgIGMgPSAwLFxuICAgICAgICAgICAgICAgICAgICBkID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHZvaWQgMCA9PT0gYSAmJiAxID09PSBiLm5vZGVUeXBlKSByZXR1cm4gYi5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIGEgJiYgIUFhLnRlc3QoYSkgJiYgIW1hWyhrYS5leGVjKGEpIHx8IFtcIlwiLCBcIlwiXSlbMV0udG9Mb3dlckNhc2UoKV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IHIuaHRtbFByZWZpbHRlcihhKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoOyBjIDwgZDsgYysrKSBiID0gdGhpc1tjXSB8fCB7fSwgMSA9PT0gYi5ub2RlVHlwZSAmJiAoci5jbGVhbkRhdGEobmEoYiwgITEpKSwgYi5pbm5lckhUTUwgPSBhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSAwXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIgJiYgdGhpcy5lbXB0eSgpLmFwcGVuZChhKVxuICAgICAgICAgICAgfSwgbnVsbCwgYSwgYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgfSxcbiAgICAgICAgcmVwbGFjZVdpdGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhID0gW107XG4gICAgICAgICAgICByZXR1cm4gSmEodGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHIuaW5BcnJheSh0aGlzLCBhKSA8IDAgJiYgKHIuY2xlYW5EYXRhKG5hKHRoaXMpKSwgYyAmJiBjLnJlcGxhY2VDaGlsZChiLCB0aGlzKSlcbiAgICAgICAgICAgIH0sIGEpXG4gICAgICAgIH1cbiAgICB9KSwgci5lYWNoKHtcbiAgICAgICAgYXBwZW5kVG86IFwiYXBwZW5kXCIsXG4gICAgICAgIHByZXBlbmRUbzogXCJwcmVwZW5kXCIsXG4gICAgICAgIGluc2VydEJlZm9yZTogXCJiZWZvcmVcIixcbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IFwiYWZ0ZXJcIixcbiAgICAgICAgcmVwbGFjZUFsbDogXCJyZXBsYWNlV2l0aFwiXG4gICAgfSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgci5mblthXSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjLCBkID0gW10sIGUgPSByKGEpLCBmID0gZS5sZW5ndGggLSAxLCBnID0gMDsgZyA8PSBmOyBnKyspIGMgPSBnID09PSBmID8gdGhpcyA6IHRoaXMuY2xvbmUoITApLCByKGVbZ10pW2JdKGMpLCBoLmFwcGx5KGQsIGMuZ2V0KCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKGQpXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgTGEgPSAvXm1hcmdpbi8sXG4gICAgICAgIE1hID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBhYSArIFwiKSg/IXB4KVthLXolXSskXCIsIFwiaVwiKSxcbiAgICAgICAgTmEgPSBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgdmFyIGMgPSBiLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgICAgICAgICByZXR1cm4gYyAmJiBjLm9wZW5lciB8fCAoYyA9IGEpLCBjLmdldENvbXB1dGVkU3R5bGUoYilcbiAgICAgICAgfTtcbiAgICAhIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gYigpIHtcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgaS5zdHlsZS5jc3NUZXh0ID0gXCJib3gtc2l6aW5nOmJvcmRlci1ib3g7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpibG9jazttYXJnaW46YXV0bztib3JkZXI6MXB4O3BhZGRpbmc6MXB4O3RvcDoxJTt3aWR0aDo1MCVcIiwgaS5pbm5lckhUTUwgPSBcIlwiLCByYS5hcHBlbmRDaGlsZChoKTtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGEuZ2V0Q29tcHV0ZWRTdHlsZShpKTtcbiAgICAgICAgICAgICAgICBjID0gXCIxJVwiICE9PSBiLnRvcCwgZyA9IFwiMnB4XCIgPT09IGIubWFyZ2luTGVmdCwgZSA9IFwiNHB4XCIgPT09IGIud2lkdGgsIGkuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjUwJVwiLCBmID0gXCI0cHhcIiA9PT0gYi5tYXJnaW5SaWdodCwgcmEucmVtb3ZlQ2hpbGQoaCksIGkgPSBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGMsIGUsIGYsIGcsIGggPSBkLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICBpID0gZC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBpLnN0eWxlICYmIChpLnN0eWxlLmJhY2tncm91bmRDbGlwID0gXCJjb250ZW50LWJveFwiLCBpLmNsb25lTm9kZSghMCkuc3R5bGUuYmFja2dyb3VuZENsaXAgPSBcIlwiLCBvLmNsZWFyQ2xvbmVTdHlsZSA9IFwiY29udGVudC1ib3hcIiA9PT0gaS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcCwgaC5zdHlsZS5jc3NUZXh0ID0gXCJib3JkZXI6MDt3aWR0aDo4cHg7aGVpZ2h0OjA7dG9wOjA7bGVmdDotOTk5OXB4O3BhZGRpbmc6MDttYXJnaW4tdG9wOjFweDtwb3NpdGlvbjphYnNvbHV0ZVwiLCBoLmFwcGVuZENoaWxkKGkpLCByLmV4dGVuZChvLCB7XG4gICAgICAgICAgICBwaXhlbFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIoKSwgY1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJveFNpemluZ1JlbGlhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIoKSwgZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBpeGVsTWFyZ2luUmlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYigpLCBmXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVsaWFibGVNYXJnaW5MZWZ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIoKSwgZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSlcbiAgICB9KCk7XG5cbiAgICBmdW5jdGlvbiBPYShhLCBiLCBjKSB7XG4gICAgICAgIHZhciBkLCBlLCBmLCBnLCBoID0gYS5zdHlsZTtcbiAgICAgICAgcmV0dXJuIGMgPSBjIHx8IE5hKGEpLCBjICYmIChnID0gYy5nZXRQcm9wZXJ0eVZhbHVlKGIpIHx8IGNbYl0sIFwiXCIgIT09IGcgfHwgci5jb250YWlucyhhLm93bmVyRG9jdW1lbnQsIGEpIHx8IChnID0gci5zdHlsZShhLCBiKSksICFvLnBpeGVsTWFyZ2luUmlnaHQoKSAmJiBNYS50ZXN0KGcpICYmIExhLnRlc3QoYikgJiYgKGQgPSBoLndpZHRoLCBlID0gaC5taW5XaWR0aCwgZiA9IGgubWF4V2lkdGgsIGgubWluV2lkdGggPSBoLm1heFdpZHRoID0gaC53aWR0aCA9IGcsIGcgPSBjLndpZHRoLCBoLndpZHRoID0gZCwgaC5taW5XaWR0aCA9IGUsIGgubWF4V2lkdGggPSBmKSksIHZvaWQgMCAhPT0gZyA/IGcgKyBcIlwiIDogZ1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFBhKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhKCkgPyB2b2lkIGRlbGV0ZSB0aGlzLmdldCA6ICh0aGlzLmdldCA9IGIpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgUWEgPSAvXihub25lfHRhYmxlKD8hLWNbZWFdKS4rKS8sXG4gICAgICAgIFJhID0gL14tLS8sXG4gICAgICAgIFNhID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgIHZpc2liaWxpdHk6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcImJsb2NrXCJcbiAgICAgICAgfSxcbiAgICAgICAgVGEgPSB7XG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjBcIixcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFwiNDAwXCJcbiAgICAgICAgfSxcbiAgICAgICAgVWEgPSBbXCJXZWJraXRcIiwgXCJNb3pcIiwgXCJtc1wiXSxcbiAgICAgICAgVmEgPSBkLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikuc3R5bGU7XG5cbiAgICBmdW5jdGlvbiBXYShhKSB7XG4gICAgICAgIGlmIChhIGluIFZhKSByZXR1cm4gYTtcbiAgICAgICAgdmFyIGIgPSBhWzBdLnRvVXBwZXJDYXNlKCkgKyBhLnNsaWNlKDEpLFxuICAgICAgICAgICAgYyA9IFVhLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGMtLSlcbiAgICAgICAgICAgIGlmIChhID0gVWFbY10gKyBiLCBhIGluIFZhKSByZXR1cm4gYVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFhhKGEpIHtcbiAgICAgICAgdmFyIGIgPSByLmNzc1Byb3BzW2FdO1xuICAgICAgICByZXR1cm4gYiB8fCAoYiA9IHIuY3NzUHJvcHNbYV0gPSBXYShhKSB8fCBhKSwgYlxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFlhKGEsIGIsIGMpIHtcbiAgICAgICAgdmFyIGQgPSBiYS5leGVjKGIpO1xuICAgICAgICByZXR1cm4gZCA/IE1hdGgubWF4KDAsIGRbMl0gLSAoYyB8fCAwKSkgKyAoZFszXSB8fCBcInB4XCIpIDogYlxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFphKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgdmFyIGYsIGcgPSAwO1xuICAgICAgICBmb3IgKGYgPSBjID09PSAoZCA/IFwiYm9yZGVyXCIgOiBcImNvbnRlbnRcIikgPyA0IDogXCJ3aWR0aFwiID09PSBiID8gMSA6IDA7IGYgPCA0OyBmICs9IDIpIFwibWFyZ2luXCIgPT09IGMgJiYgKGcgKz0gci5jc3MoYSwgYyArIGNhW2ZdLCAhMCwgZSkpLCBkID8gKFwiY29udGVudFwiID09PSBjICYmIChnIC09IHIuY3NzKGEsIFwicGFkZGluZ1wiICsgY2FbZl0sICEwLCBlKSksIFwibWFyZ2luXCIgIT09IGMgJiYgKGcgLT0gci5jc3MoYSwgXCJib3JkZXJcIiArIGNhW2ZdICsgXCJXaWR0aFwiLCAhMCwgZSkpKSA6IChnICs9IHIuY3NzKGEsIFwicGFkZGluZ1wiICsgY2FbZl0sICEwLCBlKSwgXCJwYWRkaW5nXCIgIT09IGMgJiYgKGcgKz0gci5jc3MoYSwgXCJib3JkZXJcIiArIGNhW2ZdICsgXCJXaWR0aFwiLCAhMCwgZSkpKTtcbiAgICAgICAgcmV0dXJuIGdcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkYShhLCBiLCBjKSB7XG4gICAgICAgIHZhciBkLCBlID0gTmEoYSksXG4gICAgICAgICAgICBmID0gT2EoYSwgYiwgZSksXG4gICAgICAgICAgICBnID0gXCJib3JkZXItYm94XCIgPT09IHIuY3NzKGEsIFwiYm94U2l6aW5nXCIsICExLCBlKTtcbiAgICAgICAgcmV0dXJuIE1hLnRlc3QoZikgPyBmIDogKGQgPSBnICYmIChvLmJveFNpemluZ1JlbGlhYmxlKCkgfHwgZiA9PT0gYS5zdHlsZVtiXSksIFwiYXV0b1wiID09PSBmICYmIChmID0gYVtcIm9mZnNldFwiICsgYlswXS50b1VwcGVyQ2FzZSgpICsgYi5zbGljZSgxKV0pLCBmID0gcGFyc2VGbG9hdChmKSB8fCAwLCBmICsgWmEoYSwgYiwgYyB8fCAoZyA/IFwiYm9yZGVyXCIgOiBcImNvbnRlbnRcIiksIGQsIGUpICsgXCJweFwiKVxuICAgIH1cbiAgICByLmV4dGVuZCh7XG4gICAgICAgIGNzc0hvb2tzOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBPYShhLCBcIm9wYWNpdHlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIiA9PT0gYyA/IFwiMVwiIDogY1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjc3NOdW1iZXI6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiAhMCxcbiAgICAgICAgICAgIGNvbHVtbkNvdW50OiAhMCxcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAhMCxcbiAgICAgICAgICAgIGZsZXhHcm93OiAhMCxcbiAgICAgICAgICAgIGZsZXhTaHJpbms6ICEwLFxuICAgICAgICAgICAgZm9udFdlaWdodDogITAsXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAhMCxcbiAgICAgICAgICAgIG9wYWNpdHk6ICEwLFxuICAgICAgICAgICAgb3JkZXI6ICEwLFxuICAgICAgICAgICAgb3JwaGFuczogITAsXG4gICAgICAgICAgICB3aWRvd3M6ICEwLFxuICAgICAgICAgICAgekluZGV4OiAhMCxcbiAgICAgICAgICAgIHpvb206ICEwXG4gICAgICAgIH0sXG4gICAgICAgIGNzc1Byb3BzOiB7XG4gICAgICAgICAgICBcImZsb2F0XCI6IFwiY3NzRmxvYXRcIlxuICAgICAgICB9LFxuICAgICAgICBzdHlsZTogZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIGlmIChhICYmIDMgIT09IGEubm9kZVR5cGUgJiYgOCAhPT0gYS5ub2RlVHlwZSAmJiBhLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUsIGYsIGcsIGggPSByLmNhbWVsQ2FzZShiKSxcbiAgICAgICAgICAgICAgICAgICAgaSA9IFJhLnRlc3QoYiksXG4gICAgICAgICAgICAgICAgICAgIGogPSBhLnN0eWxlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpIHx8IChiID0gWGEoaCkpLCBnID0gci5jc3NIb29rc1tiXSB8fCByLmNzc0hvb2tzW2hdLCB2b2lkIDAgPT09IGMgPyBnICYmIFwiZ2V0XCIgaW4gZyAmJiB2b2lkIDAgIT09IChlID0gZy5nZXQoYSwgITEsIGQpKSA/IGUgOiBqW2JdIDogKGYgPSB0eXBlb2YgYywgXCJzdHJpbmdcIiA9PT0gZiAmJiAoZSA9IGJhLmV4ZWMoYykpICYmIGVbMV0gJiYgKGMgPSBmYShhLCBiLCBlKSwgZiA9IFwibnVtYmVyXCIpLCBudWxsICE9IGMgJiYgYyA9PT0gYyAmJiAoXCJudW1iZXJcIiA9PT0gZiAmJiAoYyArPSBlICYmIGVbM10gfHwgKHIuY3NzTnVtYmVyW2hdID8gXCJcIiA6IFwicHhcIikpLCBvLmNsZWFyQ2xvbmVTdHlsZSB8fCBcIlwiICE9PSBjIHx8IDAgIT09IGIuaW5kZXhPZihcImJhY2tncm91bmRcIikgfHwgKGpbYl0gPSBcImluaGVyaXRcIiksIGcgJiYgXCJzZXRcIiBpbiBnICYmIHZvaWQgMCA9PT0gKGMgPSBnLnNldChhLCBjLCBkKSkgfHwgKGkgPyBqLnNldFByb3BlcnR5KGIsIGMpIDogaltiXSA9IGMpKSwgdm9pZCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjc3M6IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgICB2YXIgZSwgZiwgZywgaCA9IHIuY2FtZWxDYXNlKGIpLFxuICAgICAgICAgICAgICAgIGkgPSBSYS50ZXN0KGIpO1xuICAgICAgICAgICAgcmV0dXJuIGkgfHwgKGIgPSBYYShoKSksIGcgPSByLmNzc0hvb2tzW2JdIHx8IHIuY3NzSG9va3NbaF0sIGcgJiYgXCJnZXRcIiBpbiBnICYmIChlID0gZy5nZXQoYSwgITAsIGMpKSwgdm9pZCAwID09PSBlICYmIChlID0gT2EoYSwgYiwgZCkpLCBcIm5vcm1hbFwiID09PSBlICYmIGIgaW4gVGEgJiYgKGUgPSBUYVtiXSksIFwiXCIgPT09IGMgfHwgYyA/IChmID0gcGFyc2VGbG9hdChlKSwgYyA9PT0gITAgfHwgaXNGaW5pdGUoZikgPyBmIHx8IDAgOiBlKSA6IGVcbiAgICAgICAgfVxuICAgIH0pLCByLmVhY2goW1wiaGVpZ2h0XCIsIFwid2lkdGhcIl0sIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHIuY3NzSG9va3NbYl0gPSB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhLCBjLCBkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMpIHJldHVybiAhUWEudGVzdChyLmNzcyhhLCBcImRpc3BsYXlcIikpIHx8IGEuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggJiYgYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA/ICRhKGEsIGIsIGQpIDogZWEoYSwgU2EsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRhKGEsIGIsIGQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChhLCBjLCBkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUsIGYgPSBkICYmIE5hKGEpLFxuICAgICAgICAgICAgICAgICAgICBnID0gZCAmJiBaYShhLCBiLCBkLCBcImJvcmRlci1ib3hcIiA9PT0gci5jc3MoYSwgXCJib3hTaXppbmdcIiwgITEsIGYpLCBmKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZyAmJiAoZSA9IGJhLmV4ZWMoYykpICYmIFwicHhcIiAhPT0gKGVbM10gfHwgXCJweFwiKSAmJiAoYS5zdHlsZVtiXSA9IGMsIGMgPSByLmNzcyhhLCBiKSksIFlhKGEsIGMsIGcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSwgci5jc3NIb29rcy5tYXJnaW5MZWZ0ID0gUGEoby5yZWxpYWJsZU1hcmdpbkxlZnQsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmIChiKSByZXR1cm4gKHBhcnNlRmxvYXQoT2EoYSwgXCJtYXJnaW5MZWZ0XCIpKSB8fCBhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBlYShhLCB7XG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiAwXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICAgICAgfSkpICsgXCJweFwiXG4gICAgfSksIHIuZWFjaCh7XG4gICAgICAgIG1hcmdpbjogXCJcIixcbiAgICAgICAgcGFkZGluZzogXCJcIixcbiAgICAgICAgYm9yZGVyOiBcIldpZHRoXCJcbiAgICB9LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByLmNzc0hvb2tzW2EgKyBiXSA9IHtcbiAgICAgICAgICAgIGV4cGFuZDogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBkID0gMCwgZSA9IHt9LCBmID0gXCJzdHJpbmdcIiA9PSB0eXBlb2YgYyA/IGMuc3BsaXQoXCIgXCIpIDogW2NdOyBkIDwgNDsgZCsrKSBlW2EgKyBjYVtkXSArIGJdID0gZltkXSB8fCBmW2QgLSAyXSB8fCBmWzBdO1xuICAgICAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIExhLnRlc3QoYSkgfHwgKHIuY3NzSG9va3NbYSArIGJdLnNldCA9IFlhKVxuICAgIH0pLCByLmZuLmV4dGVuZCh7XG4gICAgICAgIGNzczogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBUKHRoaXMsIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQsIGUsIGYgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgZyA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChkID0gTmEoYSksIGUgPSBiLmxlbmd0aDsgZyA8IGU7IGcrKykgZltiW2ddXSA9IHIuY3NzKGEsIGJbZ10sICExLCBkKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgMCAhPT0gYyA/IHIuc3R5bGUoYSwgYiwgYykgOiByLmNzcyhhLCBiKVxuICAgICAgICAgICAgfSwgYSwgYiwgYXJndW1lbnRzLmxlbmd0aCA+IDEpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIF9hKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBfYS5wcm90b3R5cGUuaW5pdChhLCBiLCBjLCBkLCBlKVxuICAgIH1cbiAgICByLlR3ZWVuID0gX2EsIF9hLnByb3RvdHlwZSA9IHtcbiAgICAgICAgY29uc3RydWN0b3I6IF9hLFxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSwgZikge1xuICAgICAgICAgICAgdGhpcy5lbGVtID0gYSwgdGhpcy5wcm9wID0gYywgdGhpcy5lYXNpbmcgPSBlIHx8IHIuZWFzaW5nLl9kZWZhdWx0LCB0aGlzLm9wdGlvbnMgPSBiLCB0aGlzLnN0YXJ0ID0gdGhpcy5ub3cgPSB0aGlzLmN1cigpLCB0aGlzLmVuZCA9IGQsIHRoaXMudW5pdCA9IGYgfHwgKHIuY3NzTnVtYmVyW2NdID8gXCJcIiA6IFwicHhcIilcbiAgICAgICAgfSxcbiAgICAgICAgY3VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYSA9IF9hLnByb3BIb29rc1t0aGlzLnByb3BdO1xuICAgICAgICAgICAgcmV0dXJuIGEgJiYgYS5nZXQgPyBhLmdldCh0aGlzKSA6IF9hLnByb3BIb29rcy5fZGVmYXVsdC5nZXQodGhpcylcbiAgICAgICAgfSxcbiAgICAgICAgcnVuOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGIsIGMgPSBfYS5wcm9wSG9va3NbdGhpcy5wcm9wXTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZHVyYXRpb24gPyB0aGlzLnBvcyA9IGIgPSByLmVhc2luZ1t0aGlzLmVhc2luZ10oYSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uICogYSwgMCwgMSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uKSA6IHRoaXMucG9zID0gYiA9IGEsIHRoaXMubm93ID0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydCkgKiBiICsgdGhpcy5zdGFydCwgdGhpcy5vcHRpb25zLnN0ZXAgJiYgdGhpcy5vcHRpb25zLnN0ZXAuY2FsbCh0aGlzLmVsZW0sIHRoaXMubm93LCB0aGlzKSwgYyAmJiBjLnNldCA/IGMuc2V0KHRoaXMpIDogX2EucHJvcEhvb2tzLl9kZWZhdWx0LnNldCh0aGlzKSwgdGhpc1xuICAgICAgICB9XG4gICAgfSwgX2EucHJvdG90eXBlLmluaXQucHJvdG90eXBlID0gX2EucHJvdG90eXBlLCBfYS5wcm9wSG9va3MgPSB7XG4gICAgICAgIF9kZWZhdWx0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgIT09IGEuZWxlbS5ub2RlVHlwZSB8fCBudWxsICE9IGEuZWxlbVthLnByb3BdICYmIG51bGwgPT0gYS5lbGVtLnN0eWxlW2EucHJvcF0gPyBhLmVsZW1bYS5wcm9wXSA6IChiID0gci5jc3MoYS5lbGVtLCBhLnByb3AsIFwiXCIpLCBiICYmIFwiYXV0b1wiICE9PSBiID8gYiA6IDApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHIuZnguc3RlcFthLnByb3BdID8gci5meC5zdGVwW2EucHJvcF0oYSkgOiAxICE9PSBhLmVsZW0ubm9kZVR5cGUgfHwgbnVsbCA9PSBhLmVsZW0uc3R5bGVbci5jc3NQcm9wc1thLnByb3BdXSAmJiAhci5jc3NIb29rc1thLnByb3BdID8gYS5lbGVtW2EucHJvcF0gPSBhLm5vdyA6IHIuc3R5bGUoYS5lbGVtLCBhLnByb3AsIGEubm93ICsgYS51bml0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgX2EucHJvcEhvb2tzLnNjcm9sbFRvcCA9IF9hLnByb3BIb29rcy5zY3JvbGxMZWZ0ID0ge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICBhLmVsZW0ubm9kZVR5cGUgJiYgYS5lbGVtLnBhcmVudE5vZGUgJiYgKGEuZWxlbVthLnByb3BdID0gYS5ub3cpXG4gICAgICAgIH1cbiAgICB9LCByLmVhc2luZyA9IHtcbiAgICAgICAgbGluZWFyOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgfSxcbiAgICAgICAgc3dpbmc6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gLjUgLSBNYXRoLmNvcyhhICogTWF0aC5QSSkgLyAyXG4gICAgICAgIH0sXG4gICAgICAgIF9kZWZhdWx0OiBcInN3aW5nXCJcbiAgICB9LCByLmZ4ID0gX2EucHJvdG90eXBlLmluaXQsIHIuZnguc3RlcCA9IHt9O1xuICAgIHZhciBhYiwgYmIsIGNiID0gL14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLFxuICAgICAgICBkYiA9IC9xdWV1ZUhvb2tzJC87XG5cbiAgICBmdW5jdGlvbiBlYigpIHtcbiAgICAgICAgYmIgJiYgKGQuaGlkZGVuID09PSAhMSAmJiBhLnJlcXVlc3RBbmltYXRpb25GcmFtZSA/IGEucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGViKSA6IGEuc2V0VGltZW91dChlYiwgci5meC5pbnRlcnZhbCksIHIuZngudGljaygpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZiKCkge1xuICAgICAgICByZXR1cm4gYS5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFiID0gdm9pZCAwXG4gICAgICAgIH0pLCBhYiA9IHIubm93KClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnYihhLCBiKSB7XG4gICAgICAgIHZhciBjLCBkID0gMCxcbiAgICAgICAgICAgIGUgPSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBhXG4gICAgICAgICAgICB9O1xuICAgICAgICBmb3IgKGIgPSBiID8gMSA6IDA7IGQgPCA0OyBkICs9IDIgLSBiKSBjID0gY2FbZF0sIGVbXCJtYXJnaW5cIiArIGNdID0gZVtcInBhZGRpbmdcIiArIGNdID0gYTtcbiAgICAgICAgcmV0dXJuIGIgJiYgKGUub3BhY2l0eSA9IGUud2lkdGggPSBhKSwgZVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhiKGEsIGIsIGMpIHtcbiAgICAgICAgZm9yICh2YXIgZCwgZSA9IChrYi50d2VlbmVyc1tiXSB8fCBbXSkuY29uY2F0KGtiLnR3ZWVuZXJzW1wiKlwiXSksIGYgPSAwLCBnID0gZS5sZW5ndGg7IGYgPCBnOyBmKyspXG4gICAgICAgICAgICBpZiAoZCA9IGVbZl0uY2FsbChjLCBiLCBhKSkgcmV0dXJuIGRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpYihhLCBiLCBjKSB7XG4gICAgICAgIHZhciBkLCBlLCBmLCBnLCBoLCBpLCBqLCBrLCBsID0gXCJ3aWR0aFwiIGluIGIgfHwgXCJoZWlnaHRcIiBpbiBiLFxuICAgICAgICAgICAgbSA9IHRoaXMsXG4gICAgICAgICAgICBuID0ge30sXG4gICAgICAgICAgICBvID0gYS5zdHlsZSxcbiAgICAgICAgICAgIHAgPSBhLm5vZGVUeXBlICYmIGRhKGEpLFxuICAgICAgICAgICAgcSA9IFcuZ2V0KGEsIFwiZnhzaG93XCIpO1xuICAgICAgICBjLnF1ZXVlIHx8IChnID0gci5fcXVldWVIb29rcyhhLCBcImZ4XCIpLCBudWxsID09IGcudW5xdWV1ZWQgJiYgKGcudW5xdWV1ZWQgPSAwLCBoID0gZy5lbXB0eS5maXJlLCBnLmVtcHR5LmZpcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnLnVucXVldWVkIHx8IGgoKVxuICAgICAgICB9KSwgZy51bnF1ZXVlZCsrLCBtLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZy51bnF1ZXVlZC0tLCByLnF1ZXVlKGEsIFwiZnhcIikubGVuZ3RoIHx8IGcuZW1wdHkuZmlyZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG4gICAgICAgIGZvciAoZCBpbiBiKVxuICAgICAgICAgICAgaWYgKGUgPSBiW2RdLCBjYi50ZXN0KGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGV0ZSBiW2RdLCBmID0gZiB8fCBcInRvZ2dsZVwiID09PSBlLCBlID09PSAocCA/IFwiaGlkZVwiIDogXCJzaG93XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcInNob3dcIiAhPT0gZSB8fCAhcSB8fCB2b2lkIDAgPT09IHFbZF0pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBwID0gITBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbltkXSA9IHEgJiYgcVtkXSB8fCByLnN0eWxlKGEsIGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIGlmIChpID0gIXIuaXNFbXB0eU9iamVjdChiKSwgaSB8fCAhci5pc0VtcHR5T2JqZWN0KG4pKSB7XG4gICAgICAgICAgICBsICYmIDEgPT09IGEubm9kZVR5cGUgJiYgKGMub3ZlcmZsb3cgPSBbby5vdmVyZmxvdywgby5vdmVyZmxvd1gsIG8ub3ZlcmZsb3dZXSwgaiA9IHEgJiYgcS5kaXNwbGF5LCBudWxsID09IGogJiYgKGogPSBXLmdldChhLCBcImRpc3BsYXlcIikpLCBrID0gci5jc3MoYSwgXCJkaXNwbGF5XCIpLCBcIm5vbmVcIiA9PT0gayAmJiAoaiA/IGsgPSBqIDogKGlhKFthXSwgITApLCBqID0gYS5zdHlsZS5kaXNwbGF5IHx8IGosIGsgPSByLmNzcyhhLCBcImRpc3BsYXlcIiksIGlhKFthXSkpKSwgKFwiaW5saW5lXCIgPT09IGsgfHwgXCJpbmxpbmUtYmxvY2tcIiA9PT0gayAmJiBudWxsICE9IGopICYmIFwibm9uZVwiID09PSByLmNzcyhhLCBcImZsb2F0XCIpICYmIChpIHx8IChtLmRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG8uZGlzcGxheSA9IGpcbiAgICAgICAgICAgIH0pLCBudWxsID09IGogJiYgKGsgPSBvLmRpc3BsYXksIGogPSBcIm5vbmVcIiA9PT0gayA/IFwiXCIgOiBrKSksIG8uZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCIpKSwgYy5vdmVyZmxvdyAmJiAoby5vdmVyZmxvdyA9IFwiaGlkZGVuXCIsIG0uYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvLm92ZXJmbG93ID0gYy5vdmVyZmxvd1swXSwgby5vdmVyZmxvd1ggPSBjLm92ZXJmbG93WzFdLCBvLm92ZXJmbG93WSA9IGMub3ZlcmZsb3dbMl1cbiAgICAgICAgICAgIH0pKSwgaSA9ICExO1xuICAgICAgICAgICAgZm9yIChkIGluIG4pIGkgfHwgKHEgPyBcImhpZGRlblwiIGluIHEgJiYgKHAgPSBxLmhpZGRlbikgOiBxID0gVy5hY2Nlc3MoYSwgXCJmeHNob3dcIiwge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGpcbiAgICAgICAgICAgIH0pLCBmICYmIChxLmhpZGRlbiA9ICFwKSwgcCAmJiBpYShbYV0sICEwKSwgbS5kb25lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwIHx8IGlhKFthXSksIFcucmVtb3ZlKGEsIFwiZnhzaG93XCIpO1xuICAgICAgICAgICAgICAgIGZvciAoZCBpbiBuKSByLnN0eWxlKGEsIGQsIG5bZF0pXG4gICAgICAgICAgICB9KSksIGkgPSBoYihwID8gcVtkXSA6IDAsIGQsIG0pLCBkIGluIHEgfHwgKHFbZF0gPSBpLnN0YXJ0LCBwICYmIChpLmVuZCA9IGkuc3RhcnQsIGkuc3RhcnQgPSAwKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpiKGEsIGIpIHtcbiAgICAgICAgdmFyIGMsIGQsIGUsIGYsIGc7XG4gICAgICAgIGZvciAoYyBpbiBhKVxuICAgICAgICAgICAgaWYgKGQgPSByLmNhbWVsQ2FzZShjKSwgZSA9IGJbZF0sIGYgPSBhW2NdLCBBcnJheS5pc0FycmF5KGYpICYmIChlID0gZlsxXSwgZiA9IGFbY10gPSBmWzBdKSwgYyAhPT0gZCAmJiAoYVtkXSA9IGYsIGRlbGV0ZSBhW2NdKSwgZyA9IHIuY3NzSG9va3NbZF0sIGcgJiYgXCJleHBhbmRcIiBpbiBnKSB7XG4gICAgICAgICAgICAgICAgZiA9IGcuZXhwYW5kKGYpLCBkZWxldGUgYVtkXTtcbiAgICAgICAgICAgICAgICBmb3IgKGMgaW4gZikgYyBpbiBhIHx8IChhW2NdID0gZltjXSwgYltjXSA9IGUpXG4gICAgICAgICAgICB9IGVsc2UgYltkXSA9IGVcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrYihhLCBiLCBjKSB7XG4gICAgICAgIHZhciBkLCBlLCBmID0gMCxcbiAgICAgICAgICAgIGcgPSBrYi5wcmVmaWx0ZXJzLmxlbmd0aCxcbiAgICAgICAgICAgIGggPSByLkRlZmVycmVkKCkuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgaS5lbGVtXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUpIHJldHVybiAhMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBiID0gYWIgfHwgZmIoKSwgYyA9IE1hdGgubWF4KDAsIGouc3RhcnRUaW1lICsgai5kdXJhdGlvbiAtIGIpLCBkID0gYyAvIGouZHVyYXRpb24gfHwgMCwgZiA9IDEgLSBkLCBnID0gMCwgaSA9IGoudHdlZW5zLmxlbmd0aDsgZyA8IGk7IGcrKykgai50d2VlbnNbZ10ucnVuKGYpO1xuICAgICAgICAgICAgICAgIHJldHVybiBoLm5vdGlmeVdpdGgoYSwgW2osIGYsIGNdKSwgZiA8IDEgJiYgaSA/IGMgOiAoaSB8fCBoLm5vdGlmeVdpdGgoYSwgW2osIDEsIDBdKSwgaC5yZXNvbHZlV2l0aChhLCBbal0pLCAhMSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBqID0gaC5wcm9taXNlKHtcbiAgICAgICAgICAgICAgICBlbGVtOiBhLFxuICAgICAgICAgICAgICAgIHByb3BzOiByLmV4dGVuZCh7fSwgYiksXG4gICAgICAgICAgICAgICAgb3B0czogci5leHRlbmQoITAsIHtcbiAgICAgICAgICAgICAgICAgICAgc3BlY2lhbEVhc2luZzoge30sXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZzogci5lYXNpbmcuX2RlZmF1bHRcbiAgICAgICAgICAgICAgICB9LCBjKSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFByb3BlcnRpZXM6IGIsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxPcHRpb25zOiBjLFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogYWIgfHwgZmIoKSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogYy5kdXJhdGlvbixcbiAgICAgICAgICAgICAgICB0d2VlbnM6IFtdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVR3ZWVuOiBmdW5jdGlvbiAoYiwgYykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHIuVHdlZW4oYSwgai5vcHRzLCBiLCBjLCBqLm9wdHMuc3BlY2lhbEVhc2luZ1tiXSB8fCBqLm9wdHMuZWFzaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGoudHdlZW5zLnB1c2goZCksIGRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBiID8gai50d2VlbnMubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGUgPSAhMDsgYyA8IGQ7IGMrKykgai50d2VlbnNbY10ucnVuKDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYiA/IChoLm5vdGlmeVdpdGgoYSwgW2osIDEsIDBdKSwgaC5yZXNvbHZlV2l0aChhLCBbaiwgYl0pKSA6IGgucmVqZWN0V2l0aChhLCBbaiwgYl0pLCB0aGlzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBrID0gai5wcm9wcztcbiAgICAgICAgZm9yIChqYihrLCBqLm9wdHMuc3BlY2lhbEVhc2luZyk7IGYgPCBnOyBmKyspXG4gICAgICAgICAgICBpZiAoZCA9IGtiLnByZWZpbHRlcnNbZl0uY2FsbChqLCBhLCBrLCBqLm9wdHMpKSByZXR1cm4gci5pc0Z1bmN0aW9uKGQuc3RvcCkgJiYgKHIuX3F1ZXVlSG9va3Moai5lbGVtLCBqLm9wdHMucXVldWUpLnN0b3AgPSByLnByb3h5KGQuc3RvcCwgZCkpLCBkO1xuICAgICAgICByZXR1cm4gci5tYXAoaywgaGIsIGopLCByLmlzRnVuY3Rpb24oai5vcHRzLnN0YXJ0KSAmJiBqLm9wdHMuc3RhcnQuY2FsbChhLCBqKSwgai5wcm9ncmVzcyhqLm9wdHMucHJvZ3Jlc3MpLmRvbmUoai5vcHRzLmRvbmUsIGoub3B0cy5jb21wbGV0ZSkuZmFpbChqLm9wdHMuZmFpbCkuYWx3YXlzKGoub3B0cy5hbHdheXMpLCByLmZ4LnRpbWVyKHIuZXh0ZW5kKGksIHtcbiAgICAgICAgICAgIGVsZW06IGEsXG4gICAgICAgICAgICBhbmltOiBqLFxuICAgICAgICAgICAgcXVldWU6IGoub3B0cy5xdWV1ZVxuICAgICAgICB9KSksIGpcbiAgICB9XG4gICAgci5BbmltYXRpb24gPSByLmV4dGVuZChrYiwge1xuICAgICAgICAgICAgdHdlZW5lcnM6IHtcbiAgICAgICAgICAgICAgICBcIipcIjogW2Z1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jcmVhdGVUd2VlbihhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhKGMuZWxlbSwgYSwgYmEuZXhlYyhiKSwgYyksIGNcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR3ZWVuZXI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgci5pc0Z1bmN0aW9uKGEpID8gKGIgPSBhLCBhID0gW1wiKlwiXSkgOiBhID0gYS5tYXRjaChMKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjLCBkID0gMCwgZSA9IGEubGVuZ3RoOyBkIDwgZTsgZCsrKSBjID0gYVtkXSwga2IudHdlZW5lcnNbY10gPSBrYi50d2VlbmVyc1tjXSB8fCBbXSwga2IudHdlZW5lcnNbY10udW5zaGlmdChiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZWZpbHRlcnM6IFtpYl0sXG4gICAgICAgICAgICBwcmVmaWx0ZXI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgYiA/IGtiLnByZWZpbHRlcnMudW5zaGlmdChhKSA6IGtiLnByZWZpbHRlcnMucHVzaChhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgci5zcGVlZCA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZCA9IGEgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2YgYSA/IHIuZXh0ZW5kKHt9LCBhKSA6IHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogYyB8fCAhYyAmJiBiIHx8IHIuaXNGdW5jdGlvbihhKSAmJiBhLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBhLFxuICAgICAgICAgICAgICAgIGVhc2luZzogYyAmJiBiIHx8IGIgJiYgIXIuaXNGdW5jdGlvbihiKSAmJiBiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHIuZngub2ZmID8gZC5kdXJhdGlvbiA9IDAgOiBcIm51bWJlclwiICE9IHR5cGVvZiBkLmR1cmF0aW9uICYmIChkLmR1cmF0aW9uIGluIHIuZnguc3BlZWRzID8gZC5kdXJhdGlvbiA9IHIuZnguc3BlZWRzW2QuZHVyYXRpb25dIDogZC5kdXJhdGlvbiA9IHIuZnguc3BlZWRzLl9kZWZhdWx0KSwgbnVsbCAhPSBkLnF1ZXVlICYmIGQucXVldWUgIT09ICEwIHx8IChkLnF1ZXVlID0gXCJmeFwiKSwgZC5vbGQgPSBkLmNvbXBsZXRlLCBkLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHIuaXNGdW5jdGlvbihkLm9sZCkgJiYgZC5vbGQuY2FsbCh0aGlzKSwgZC5xdWV1ZSAmJiByLmRlcXVldWUodGhpcywgZC5xdWV1ZSlcbiAgICAgICAgICAgIH0sIGRcbiAgICAgICAgfSwgci5mbi5leHRlbmQoe1xuICAgICAgICAgICAgZmFkZVRvOiBmdW5jdGlvbiAoYSwgYiwgYywgZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcihkYSkuY3NzKFwib3BhY2l0eVwiLCAwKS5zaG93KCkuZW5kKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGJcbiAgICAgICAgICAgICAgICB9LCBhLCBjLCBkKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSByLmlzRW1wdHlPYmplY3QoYSksXG4gICAgICAgICAgICAgICAgICAgIGYgPSByLnNwZWVkKGIsIGMsIGQpLFxuICAgICAgICAgICAgICAgICAgICBnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBrYih0aGlzLCByLmV4dGVuZCh7fSwgYSksIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGUgfHwgVy5nZXQodGhpcywgXCJmaW5pc2hcIikpICYmIGIuc3RvcCghMClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZy5maW5pc2ggPSBnLCBlIHx8IGYucXVldWUgPT09ICExID8gdGhpcy5lYWNoKGcpIDogdGhpcy5xdWV1ZShmLnF1ZXVlLCBnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGEuc3RvcDtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGEuc3RvcCwgYihjKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEgJiYgKGMgPSBiLCBiID0gYSwgYSA9IHZvaWQgMCksIGIgJiYgYSAhPT0gITEgJiYgdGhpcy5xdWV1ZShhIHx8IFwiZnhcIiwgW10pLCB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9ICEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IG51bGwgIT0gYSAmJiBhICsgXCJxdWV1ZUhvb2tzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gci50aW1lcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gVy5nZXQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlKSBnW2VdICYmIGdbZV0uc3RvcCAmJiBkKGdbZV0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGUgaW4gZykgZ1tlXSAmJiBnW2VdLnN0b3AgJiYgZGIudGVzdChlKSAmJiBkKGdbZV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGUgPSBmLmxlbmd0aDsgZS0tOykgZltlXS5lbGVtICE9PSB0aGlzIHx8IG51bGwgIT0gYSAmJiBmW2VdLnF1ZXVlICE9PSBhIHx8IChmW2VdLmFuaW0uc3RvcChjKSwgYiA9ICExLCBmLnNwbGljZShlLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICFiICYmIGMgfHwgci5kZXF1ZXVlKHRoaXMsIGEpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgIT09ICExICYmIChhID0gYSB8fCBcImZ4XCIpLCB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiwgYyA9IFcuZ2V0KHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZCA9IGNbYSArIFwicXVldWVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gY1thICsgXCJxdWV1ZUhvb2tzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHIudGltZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGQgPyBkLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoYy5maW5pc2ggPSAhMCwgci5xdWV1ZSh0aGlzLCBhLCBbXSksIGUgJiYgZS5zdG9wICYmIGUuc3RvcC5jYWxsKHRoaXMsICEwKSwgYiA9IGYubGVuZ3RoOyBiLS07KSBmW2JdLmVsZW0gPT09IHRoaXMgJiYgZltiXS5xdWV1ZSA9PT0gYSAmJiAoZltiXS5hbmltLnN0b3AoITApLCBmLnNwbGljZShiLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoYiA9IDA7IGIgPCBnOyBiKyspIGRbYl0gJiYgZFtiXS5maW5pc2ggJiYgZFtiXS5maW5pc2guY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGMuZmluaXNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksIHIuZWFjaChbXCJ0b2dnbGVcIiwgXCJzaG93XCIsIFwiaGlkZVwiXSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjID0gci5mbltiXTtcbiAgICAgICAgICAgIHIuZm5bYl0gPSBmdW5jdGlvbiAoYSwgZCwgZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsID09IGEgfHwgXCJib29sZWFuXCIgPT0gdHlwZW9mIGEgPyBjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB0aGlzLmFuaW1hdGUoZ2IoYiwgITApLCBhLCBkLCBlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgci5lYWNoKHtcbiAgICAgICAgICAgIHNsaWRlRG93bjogZ2IoXCJzaG93XCIpLFxuICAgICAgICAgICAgc2xpZGVVcDogZ2IoXCJoaWRlXCIpLFxuICAgICAgICAgICAgc2xpZGVUb2dnbGU6IGdiKFwidG9nZ2xlXCIpLFxuICAgICAgICAgICAgZmFkZUluOiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogXCJzaG93XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWRlT3V0OiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogXCJoaWRlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWRlVG9nZ2xlOiB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogXCJ0b2dnbGVcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgci5mblthXSA9IGZ1bmN0aW9uIChhLCBjLCBkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0ZShiLCBhLCBjLCBkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgci50aW1lcnMgPSBbXSwgci5meC50aWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGEsIGIgPSAwLFxuICAgICAgICAgICAgICAgIGMgPSByLnRpbWVycztcbiAgICAgICAgICAgIGZvciAoYWIgPSByLm5vdygpOyBiIDwgYy5sZW5ndGg7IGIrKykgYSA9IGNbYl0sIGEoKSB8fCBjW2JdICE9PSBhIHx8IGMuc3BsaWNlKGItLSwgMSk7XG4gICAgICAgICAgICBjLmxlbmd0aCB8fCByLmZ4LnN0b3AoKSwgYWIgPSB2b2lkIDBcbiAgICAgICAgfSwgci5meC50aW1lciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByLnRpbWVycy5wdXNoKGEpLCByLmZ4LnN0YXJ0KClcbiAgICAgICAgfSwgci5meC5pbnRlcnZhbCA9IDEzLCByLmZ4LnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYmIgfHwgKGJiID0gITAsIGViKCkpXG4gICAgICAgIH0sIHIuZnguc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJiID0gbnVsbFxuICAgICAgICB9LCByLmZ4LnNwZWVkcyA9IHtcbiAgICAgICAgICAgIHNsb3c6IDYwMCxcbiAgICAgICAgICAgIGZhc3Q6IDIwMCxcbiAgICAgICAgICAgIF9kZWZhdWx0OiA0MDBcbiAgICAgICAgfSwgci5mbi5kZWxheSA9IGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gYiA9IHIuZnggPyByLmZ4LnNwZWVkc1tiXSB8fCBiIDogYiwgYyA9IGMgfHwgXCJmeFwiLCB0aGlzLnF1ZXVlKGMsIGZ1bmN0aW9uIChjLCBkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBhLnNldFRpbWVvdXQoYywgYik7XG4gICAgICAgICAgICAgICAgZC5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhLmNsZWFyVGltZW91dChlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhID0gZC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksXG4gICAgICAgICAgICAgICAgYiA9IGQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKSxcbiAgICAgICAgICAgICAgICBjID0gYi5hcHBlbmRDaGlsZChkLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikpO1xuICAgICAgICAgICAgYS50eXBlID0gXCJjaGVja2JveFwiLCBvLmNoZWNrT24gPSBcIlwiICE9PSBhLnZhbHVlLCBvLm9wdFNlbGVjdGVkID0gYy5zZWxlY3RlZCwgYSA9IGQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLCBhLnZhbHVlID0gXCJ0XCIsIGEudHlwZSA9IFwicmFkaW9cIiwgby5yYWRpb1ZhbHVlID0gXCJ0XCIgPT09IGEudmFsdWVcbiAgICAgICAgfSgpO1xuICAgIHZhciBsYiwgbWIgPSByLmV4cHIuYXR0ckhhbmRsZTtcbiAgICByLmZuLmV4dGVuZCh7XG4gICAgICAgIGF0dHI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gVCh0aGlzLCByLmF0dHIsIGEsIGIsIGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVBdHRyOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgci5yZW1vdmVBdHRyKHRoaXMsIGEpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSksIHIuZXh0ZW5kKHtcbiAgICAgICAgYXR0cjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkLCBlLCBmID0gYS5ub2RlVHlwZTtcbiAgICAgICAgICAgIGlmICgzICE9PSBmICYmIDggIT09IGYgJiYgMiAhPT0gZikgcmV0dXJuIFwidW5kZWZpbmVkXCIgPT0gdHlwZW9mIGEuZ2V0QXR0cmlidXRlID8gci5wcm9wKGEsIGIsIGMpIDogKDEgPT09IGYgJiYgci5pc1hNTERvYyhhKSB8fCAoZSA9IHIuYXR0ckhvb2tzW2IudG9Mb3dlckNhc2UoKV0gfHwgKHIuZXhwci5tYXRjaC5ib29sLnRlc3QoYikgPyBsYiA6IHZvaWQgMCkpLCB2b2lkIDAgIT09IGMgPyBudWxsID09PSBjID8gdm9pZCByLnJlbW92ZUF0dHIoYSwgYikgOiBlICYmIFwic2V0XCIgaW4gZSAmJiB2b2lkIDAgIT09IChkID0gZS5zZXQoYSwgYywgYikpID8gZCA6IChhLnNldEF0dHJpYnV0ZShiLCBjICsgXCJcIiksIGMpIDogZSAmJiBcImdldFwiIGluIGUgJiYgbnVsbCAhPT0gKGQgPSBlLmdldChhLCBiKSkgPyBkIDogKGQgPSByLmZpbmQuYXR0cihhLCBiKSxcbiAgICAgICAgICAgICAgICBudWxsID09IGQgPyB2b2lkIDAgOiBkKSlcbiAgICAgICAgfSxcbiAgICAgICAgYXR0ckhvb2tzOiB7XG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW8ucmFkaW9WYWx1ZSAmJiBcInJhZGlvXCIgPT09IGIgJiYgQihhLCBcImlucHV0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIGIpLCBjICYmIChhLnZhbHVlID0gYyksIGJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlQXR0cjogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBjLCBkID0gMCxcbiAgICAgICAgICAgICAgICBlID0gYiAmJiBiLm1hdGNoKEwpO1xuICAgICAgICAgICAgaWYgKGUgJiYgMSA9PT0gYS5ub2RlVHlwZSlcbiAgICAgICAgICAgICAgICB3aGlsZSAoYyA9IGVbZCsrXSkgYS5yZW1vdmVBdHRyaWJ1dGUoYylcbiAgICAgICAgfVxuICAgIH0pLCBsYiA9IHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgcmV0dXJuIGIgPT09ICExID8gci5yZW1vdmVBdHRyKGEsIGMpIDogYS5zZXRBdHRyaWJ1dGUoYywgYyksIGNcbiAgICAgICAgfVxuICAgIH0sIHIuZWFjaChyLmV4cHIubWF0Y2guYm9vbC5zb3VyY2UubWF0Y2goL1xcdysvZyksIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHZhciBjID0gbWJbYl0gfHwgci5maW5kLmF0dHI7XG4gICAgICAgIG1iW2JdID0gZnVuY3Rpb24gKGEsIGIsIGQpIHtcbiAgICAgICAgICAgIHZhciBlLCBmLCBnID0gYi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGQgfHwgKGYgPSBtYltnXSwgbWJbZ10gPSBlLCBlID0gbnVsbCAhPSBjKGEsIGIsIGQpID8gZyA6IG51bGwsIG1iW2ddID0gZiksIGVcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBuYiA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG4gICAgICAgIG9iID0gL14oPzphfGFyZWEpJC9pO1xuICAgIHIuZm4uZXh0ZW5kKHtcbiAgICAgICAgcHJvcDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBUKHRoaXMsIHIucHJvcCwgYSwgYiwgYXJndW1lbnRzLmxlbmd0aCA+IDEpXG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZVByb3A6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1tyLnByb3BGaXhbYV0gfHwgYV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KSwgci5leHRlbmQoe1xuICAgICAgICBwcm9wOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIGQsIGUsIGYgPSBhLm5vZGVUeXBlO1xuICAgICAgICAgICAgaWYgKDMgIT09IGYgJiYgOCAhPT0gZiAmJiAyICE9PSBmKSByZXR1cm4gMSA9PT0gZiAmJiByLmlzWE1MRG9jKGEpIHx8IChiID0gci5wcm9wRml4W2JdIHx8IGIsIGUgPSByLnByb3BIb29rc1tiXSksIHZvaWQgMCAhPT0gYyA/IGUgJiYgXCJzZXRcIiBpbiBlICYmIHZvaWQgMCAhPT0gKGQgPSBlLnNldChhLCBjLCBiKSkgPyBkIDogYVtiXSA9IGMgOiBlICYmIFwiZ2V0XCIgaW4gZSAmJiBudWxsICE9PSAoZCA9IGUuZ2V0KGEsIGIpKSA/IGQgOiBhW2JdXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BIb29rczoge1xuICAgICAgICAgICAgdGFiSW5kZXg6IHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gci5maW5kLmF0dHIoYSwgXCJ0YWJpbmRleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIgPyBwYXJzZUludChiLCAxMCkgOiBuYi50ZXN0KGEubm9kZU5hbWUpIHx8IG9iLnRlc3QoYS5ub2RlTmFtZSkgJiYgYS5ocmVmID8gMCA6IC0xXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwcm9wRml4OiB7XG4gICAgICAgICAgICBcImZvclwiOiBcImh0bWxGb3JcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjbGFzc05hbWVcIlxuICAgICAgICB9XG4gICAgfSksIG8ub3B0U2VsZWN0ZWQgfHwgKHIucHJvcEhvb2tzLnNlbGVjdGVkID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGEucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHJldHVybiBiICYmIGIucGFyZW50Tm9kZSAmJiBiLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCwgbnVsbFxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGEucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGIgJiYgKGIuc2VsZWN0ZWRJbmRleCwgYi5wYXJlbnROb2RlICYmIGIucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4KVxuICAgICAgICB9XG4gICAgfSksIHIuZWFjaChbXCJ0YWJJbmRleFwiLCBcInJlYWRPbmx5XCIsIFwibWF4TGVuZ3RoXCIsIFwiY2VsbFNwYWNpbmdcIiwgXCJjZWxsUGFkZGluZ1wiLCBcInJvd1NwYW5cIiwgXCJjb2xTcGFuXCIsIFwidXNlTWFwXCIsIFwiZnJhbWVCb3JkZXJcIiwgXCJjb250ZW50RWRpdGFibGVcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgci5wcm9wRml4W3RoaXMudG9Mb3dlckNhc2UoKV0gPSB0aGlzXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBwYihhKSB7XG4gICAgICAgIHZhciBiID0gYS5tYXRjaChMKSB8fCBbXTtcbiAgICAgICAgcmV0dXJuIGIuam9pbihcIiBcIilcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxYihhKSB7XG4gICAgICAgIHJldHVybiBhLmdldEF0dHJpYnV0ZSAmJiBhLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCJcbiAgICB9XG4gICAgci5mbi5leHRlbmQoe1xuICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpID0gMDtcbiAgICAgICAgICAgIGlmIChyLmlzRnVuY3Rpb24oYSkpIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICByKHRoaXMpLmFkZENsYXNzKGEuY2FsbCh0aGlzLCBiLCBxYih0aGlzKSkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBhICYmIGEpIHtcbiAgICAgICAgICAgICAgICBiID0gYS5tYXRjaChMKSB8fCBbXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoYyA9IHRoaXNbaSsrXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPSBxYihjKSwgZCA9IDEgPT09IGMubm9kZVR5cGUgJiYgXCIgXCIgKyBwYihlKSArIFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChmID0gYltnKytdKSBkLmluZGV4T2YoXCIgXCIgKyBmICsgXCIgXCIpIDwgMCAmJiAoZCArPSBmICsgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IHBiKGQpLCBlICE9PSBoICYmIGMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgaClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiwgYywgZCwgZSwgZiwgZywgaCwgaSA9IDA7XG4gICAgICAgICAgICBpZiAoci5pc0Z1bmN0aW9uKGEpKSByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgcih0aGlzKS5yZW1vdmVDbGFzcyhhLmNhbGwodGhpcywgYiwgcWIodGhpcykpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLmF0dHIoXCJjbGFzc1wiLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBhICYmIGEpIHtcbiAgICAgICAgICAgICAgICBiID0gYS5tYXRjaChMKSB8fCBbXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoYyA9IHRoaXNbaSsrXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPSBxYihjKSwgZCA9IDEgPT09IGMubm9kZVR5cGUgJiYgXCIgXCIgKyBwYihlKSArIFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChmID0gYltnKytdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChkLmluZGV4T2YoXCIgXCIgKyBmICsgXCIgXCIpID4gLTEpIGQgPSBkLnJlcGxhY2UoXCIgXCIgKyBmICsgXCIgXCIsIFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBwYihkKSwgZSAhPT0gaCAmJiBjLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSB0eXBlb2YgYTtcbiAgICAgICAgICAgIHJldHVybiBcImJvb2xlYW5cIiA9PSB0eXBlb2YgYiAmJiBcInN0cmluZ1wiID09PSBjID8gYiA/IHRoaXMuYWRkQ2xhc3MoYSkgOiB0aGlzLnJlbW92ZUNsYXNzKGEpIDogci5pc0Z1bmN0aW9uKGEpID8gdGhpcy5lYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgcih0aGlzKS50b2dnbGVDbGFzcyhhLmNhbGwodGhpcywgYywgcWIodGhpcyksIGIpLCBiKVxuICAgICAgICAgICAgfSkgOiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBiLCBkLCBlLCBmO1xuICAgICAgICAgICAgICAgIGlmIChcInN0cmluZ1wiID09PSBjKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSAwLCBlID0gcih0aGlzKSwgZiA9IGEubWF0Y2goTCkgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChiID0gZltkKytdKSBlLmhhc0NsYXNzKGIpID8gZS5yZW1vdmVDbGFzcyhiKSA6IGUuYWRkQ2xhc3MoYilcbiAgICAgICAgICAgICAgICB9IGVsc2Ugdm9pZCAwICE9PSBhICYmIFwiYm9vbGVhblwiICE9PSBjIHx8IChiID0gcWIodGhpcyksIGIgJiYgVy5zZXQodGhpcywgXCJfX2NsYXNzTmFtZV9fXCIsIGIpLCB0aGlzLnNldEF0dHJpYnV0ZSAmJiB0aGlzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGIgfHwgYSA9PT0gITEgPyBcIlwiIDogVy5nZXQodGhpcywgXCJfX2NsYXNzTmFtZV9fXCIpIHx8IFwiXCIpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYiwgYywgZCA9IDA7XG4gICAgICAgICAgICBiID0gXCIgXCIgKyBhICsgXCIgXCI7XG4gICAgICAgICAgICB3aGlsZSAoYyA9IHRoaXNbZCsrXSlcbiAgICAgICAgICAgICAgICBpZiAoMSA9PT0gYy5ub2RlVHlwZSAmJiAoXCIgXCIgKyBwYihxYihjKSkgKyBcIiBcIikuaW5kZXhPZihiKSA+IC0xKSByZXR1cm4gITA7XG4gICAgICAgICAgICByZXR1cm4gITFcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciByYiA9IC9cXHIvZztcbiAgICByLmZuLmV4dGVuZCh7XG4gICAgICAgIHZhbDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiLCBjLCBkLCBlID0gdGhpc1swXTsge1xuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZCA9IHIuaXNGdW5jdGlvbihhKSwgdGhpcy5lYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlO1xuICAgICAgICAgICAgICAgICAgICAxID09PSB0aGlzLm5vZGVUeXBlICYmIChlID0gZCA/IGEuY2FsbCh0aGlzLCBjLCByKHRoaXMpLnZhbCgpKSA6IGEsIG51bGwgPT0gZSA/IGUgPSBcIlwiIDogXCJudW1iZXJcIiA9PSB0eXBlb2YgZSA/IGUgKz0gXCJcIiA6IEFycmF5LmlzQXJyYXkoZSkgJiYgKGUgPSByLm1hcChlLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGwgPT0gYSA/IFwiXCIgOiBhICsgXCJcIlxuICAgICAgICAgICAgICAgICAgICB9KSksIGIgPSByLnZhbEhvb2tzW3RoaXMudHlwZV0gfHwgci52YWxIb29rc1t0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLCBiICYmIFwic2V0XCIgaW4gYiAmJiB2b2lkIDAgIT09IGIuc2V0KHRoaXMsIGUsIFwidmFsdWVcIikgfHwgKHRoaXMudmFsdWUgPSBlKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoZSkgcmV0dXJuIGIgPSByLnZhbEhvb2tzW2UudHlwZV0gfHwgci52YWxIb29rc1tlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLCBiICYmIFwiZ2V0XCIgaW4gYiAmJiB2b2lkIDAgIT09IChjID0gYi5nZXQoZSwgXCJ2YWx1ZVwiKSkgPyBjIDogKGMgPSBlLnZhbHVlLCBcInN0cmluZ1wiID09IHR5cGVvZiBjID8gYy5yZXBsYWNlKHJiLCBcIlwiKSA6IG51bGwgPT0gYyA/IFwiXCIgOiBjKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSksIHIuZXh0ZW5kKHtcbiAgICAgICAgdmFsSG9va3M6IHtcbiAgICAgICAgICAgIG9wdGlvbjoge1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSByLmZpbmQuYXR0cihhLCBcInZhbHVlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCAhPSBiID8gYiA6IHBiKHIudGV4dChhKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiwgYywgZCwgZSA9IGEub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBhLnNlbGVjdGVkSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gXCJzZWxlY3Qtb25lXCIgPT09IGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBnID8gbnVsbCA6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGcgPyBmICsgMSA6IGUubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGQgPSBmIDwgMCA/IGkgOiBnID8gZiA6IDA7IGQgPCBpOyBkKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9IGVbZF0sIChjLnNlbGVjdGVkIHx8IGQgPT09IGYpICYmICFjLmRpc2FibGVkICYmICghYy5wYXJlbnROb2RlLmRpc2FibGVkIHx8ICFCKGMucGFyZW50Tm9kZSwgXCJvcHRncm91cFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiA9IHIoYykudmFsKCksIGcpIHJldHVybiBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgucHVzaChiKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYywgZCwgZSA9IGEub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSByLm1ha2VBcnJheShiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPSBlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGctLSkgZCA9IGVbZ10sIChkLnNlbGVjdGVkID0gci5pbkFycmF5KHIudmFsSG9va3Mub3B0aW9uLmdldChkKSwgZikgPiAtMSkgJiYgKGMgPSAhMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjIHx8IChhLnNlbGVjdGVkSW5kZXggPSAtMSksIGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSwgci5lYWNoKFtcInJhZGlvXCIsIFwiY2hlY2tib3hcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgci52YWxIb29rc1t0aGlzXSA9IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShiKSkgcmV0dXJuIGEuY2hlY2tlZCA9IHIuaW5BcnJheShyKGEpLnZhbCgpLCBiKSA+IC0xXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG8uY2hlY2tPbiB8fCAoci52YWxIb29rc1t0aGlzXS5nZXQgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGwgPT09IGEuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgPyBcIm9uXCIgOiBhLnZhbHVlXG4gICAgICAgIH0pXG4gICAgfSk7XG4gICAgdmFyIHNiID0gL14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvO1xuICAgIHIuZXh0ZW5kKHIuZXZlbnQsIHtcbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24gKGIsIGMsIGUsIGYpIHtcbiAgICAgICAgICAgIHZhciBnLCBoLCBpLCBqLCBrLCBtLCBuLCBvID0gW2UgfHwgZF0sXG4gICAgICAgICAgICAgICAgcCA9IGwuY2FsbChiLCBcInR5cGVcIikgPyBiLnR5cGUgOiBiLFxuICAgICAgICAgICAgICAgIHEgPSBsLmNhbGwoYiwgXCJuYW1lc3BhY2VcIikgPyBiLm5hbWVzcGFjZS5zcGxpdChcIi5cIikgOiBbXTtcbiAgICAgICAgICAgIGlmIChoID0gaSA9IGUgPSBlIHx8IGQsIDMgIT09IGUubm9kZVR5cGUgJiYgOCAhPT0gZS5ub2RlVHlwZSAmJiAhc2IudGVzdChwICsgci5ldmVudC50cmlnZ2VyZWQpICYmIChwLmluZGV4T2YoXCIuXCIpID4gLTEgJiYgKHEgPSBwLnNwbGl0KFwiLlwiKSwgcCA9IHEuc2hpZnQoKSwgcS5zb3J0KCkpLCBrID0gcC5pbmRleE9mKFwiOlwiKSA8IDAgJiYgXCJvblwiICsgcCwgYiA9IGJbci5leHBhbmRvXSA/IGIgOiBuZXcgci5FdmVudChwLCBcIm9iamVjdFwiID09IHR5cGVvZiBiICYmIGIpLCBiLmlzVHJpZ2dlciA9IGYgPyAyIDogMywgYi5uYW1lc3BhY2UgPSBxLmpvaW4oXCIuXCIpLCBiLnJuYW1lc3BhY2UgPSBiLm5hbWVzcGFjZSA/IG5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIiArIHEuam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpICsgXCIoXFxcXC58JClcIikgOiBudWxsLCBiLnJlc3VsdCA9IHZvaWQgMCwgYi50YXJnZXQgfHwgKGIudGFyZ2V0ID0gZSksIGMgPSBudWxsID09IGMgPyBbYl0gOiByLm1ha2VBcnJheShjLCBbYl0pLCBuID0gci5ldmVudC5zcGVjaWFsW3BdIHx8IHt9LCBmIHx8ICFuLnRyaWdnZXIgfHwgbi50cmlnZ2VyLmFwcGx5KGUsIGMpICE9PSAhMSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWYgJiYgIW4ubm9CdWJibGUgJiYgIXIuaXNXaW5kb3coZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gbi5kZWxlZ2F0ZVR5cGUgfHwgcCwgc2IudGVzdChqICsgcCkgfHwgKGggPSBoLnBhcmVudE5vZGUpOyBoOyBoID0gaC5wYXJlbnROb2RlKSBvLnB1c2goaCksIGkgPSBoO1xuICAgICAgICAgICAgICAgICAgICBpID09PSAoZS5vd25lckRvY3VtZW50IHx8IGQpICYmIG8ucHVzaChpLmRlZmF1bHRWaWV3IHx8IGkucGFyZW50V2luZG93IHx8IGEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGcgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlICgoaCA9IG9bZysrXSkgJiYgIWIuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkgYi50eXBlID0gZyA+IDEgPyBqIDogbi5iaW5kVHlwZSB8fCBwLCBtID0gKFcuZ2V0KGgsIFwiZXZlbnRzXCIpIHx8IHt9KVtiLnR5cGVdICYmIFcuZ2V0KGgsIFwiaGFuZGxlXCIpLCBtICYmIG0uYXBwbHkoaCwgYyksIG0gPSBrICYmIGhba10sIG0gJiYgbS5hcHBseSAmJiBVKGgpICYmIChiLnJlc3VsdCA9IG0uYXBwbHkoaCwgYyksIGIucmVzdWx0ID09PSAhMSAmJiBiLnByZXZlbnREZWZhdWx0KCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBiLnR5cGUgPSBwLCBmIHx8IGIuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgbi5fZGVmYXVsdCAmJiBuLl9kZWZhdWx0LmFwcGx5KG8ucG9wKCksIGMpICE9PSAhMSB8fCAhVShlKSB8fCBrICYmIHIuaXNGdW5jdGlvbihlW3BdKSAmJiAhci5pc1dpbmRvdyhlKSAmJiAoaSA9IGVba10sIGkgJiYgKGVba10gPSBudWxsKSwgci5ldmVudC50cmlnZ2VyZWQgPSBwLCBlW3BdKCksIHIuZXZlbnQudHJpZ2dlcmVkID0gdm9pZCAwLCBpICYmIChlW2tdID0gaSkpLCBiLnJlc3VsdFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaW11bGF0ZTogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkID0gci5leHRlbmQobmV3IHIuRXZlbnQsIGMsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBhLFxuICAgICAgICAgICAgICAgIGlzU2ltdWxhdGVkOiAhMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByLmV2ZW50LnRyaWdnZXIoZCwgbnVsbCwgYilcbiAgICAgICAgfVxuICAgIH0pLCByLmZuLmV4dGVuZCh7XG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByLmV2ZW50LnRyaWdnZXIoYSwgYiwgdGhpcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRyaWdnZXJIYW5kbGVyOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGMgPSB0aGlzWzBdO1xuICAgICAgICAgICAgaWYgKGMpIHJldHVybiByLmV2ZW50LnRyaWdnZXIoYSwgYiwgYywgITApXG4gICAgICAgIH1cbiAgICB9KSwgci5lYWNoKFwiYmx1ciBmb2N1cyBmb2N1c2luIGZvY3Vzb3V0IHJlc2l6ZSBzY3JvbGwgY2xpY2sgZGJsY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgY2hhbmdlIHNlbGVjdCBzdWJtaXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBjb250ZXh0bWVudVwiLnNwbGl0KFwiIFwiKSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgci5mbltiXSA9IGZ1bmN0aW9uIChhLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyB0aGlzLm9uKGIsIG51bGwsIGEsIGMpIDogdGhpcy50cmlnZ2VyKGIpXG4gICAgICAgIH1cbiAgICB9KSwgci5mbi5leHRlbmQoe1xuICAgICAgICBob3ZlcjogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdXNlZW50ZXIoYSkubW91c2VsZWF2ZShiIHx8IGEpXG4gICAgICAgIH1cbiAgICB9KSwgby5mb2N1c2luID0gXCJvbmZvY3VzaW5cIiBpbiBhLCBvLmZvY3VzaW4gfHwgci5lYWNoKHtcbiAgICAgICAgZm9jdXM6IFwiZm9jdXNpblwiLFxuICAgICAgICBibHVyOiBcImZvY3Vzb3V0XCJcbiAgICB9LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICB2YXIgYyA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByLmV2ZW50LnNpbXVsYXRlKGIsIGEudGFyZ2V0LCByLmV2ZW50LmZpeChhKSlcbiAgICAgICAgfTtcbiAgICAgICAgci5ldmVudC5zcGVjaWFsW2JdID0ge1xuICAgICAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBlID0gVy5hY2Nlc3MoZCwgYik7XG4gICAgICAgICAgICAgICAgZSB8fCBkLmFkZEV2ZW50TGlzdGVuZXIoYSwgYywgITApLCBXLmFjY2VzcyhkLCBiLCAoZSB8fCAwKSArIDEpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVhcmRvd246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBlID0gVy5hY2Nlc3MoZCwgYikgLSAxO1xuICAgICAgICAgICAgICAgIGUgPyBXLmFjY2VzcyhkLCBiLCBlKSA6IChkLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSwgYywgITApLCBXLnJlbW92ZShkLCBiKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciB0YiA9IGEubG9jYXRpb24sXG4gICAgICAgIHViID0gci5ub3coKSxcbiAgICAgICAgdmIgPSAvXFw/LztcbiAgICByLnBhcnNlWE1MID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGlmICghYiB8fCBcInN0cmluZ1wiICE9IHR5cGVvZiBiKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGMgPSAobmV3IGEuRE9NUGFyc2VyKS5wYXJzZUZyb21TdHJpbmcoYiwgXCJ0ZXh0L3htbFwiKVxuICAgICAgICB9IGNhdGNoIChkKSB7XG4gICAgICAgICAgICBjID0gdm9pZCAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGMgJiYgIWMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwYXJzZXJlcnJvclwiKS5sZW5ndGggfHwgci5lcnJvcihcIkludmFsaWQgWE1MOiBcIiArIGIpLCBjXG4gICAgfTtcbiAgICB2YXIgd2IgPSAvXFxbXFxdJC8sXG4gICAgICAgIHhiID0gL1xccj9cXG4vZyxcbiAgICAgICAgeWIgPSAvXig/OnN1Ym1pdHxidXR0b258aW1hZ2V8cmVzZXR8ZmlsZSkkL2ksXG4gICAgICAgIHpiID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pO1xuXG4gICAgZnVuY3Rpb24gQWIoYSwgYiwgYywgZCkge1xuICAgICAgICB2YXIgZTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYikpIHIuZWFjaChiLCBmdW5jdGlvbiAoYiwgZSkge1xuICAgICAgICAgICAgYyB8fCB3Yi50ZXN0KGEpID8gZChhLCBlKSA6IEFiKGEgKyBcIltcIiArIChcIm9iamVjdFwiID09IHR5cGVvZiBlICYmIG51bGwgIT0gZSA/IGIgOiBcIlwiKSArIFwiXVwiLCBlLCBjLCBkKVxuICAgICAgICB9KTtcbiAgICAgICAgZWxzZSBpZiAoYyB8fCBcIm9iamVjdFwiICE9PSByLnR5cGUoYikpIGQoYSwgYik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZvciAoZSBpbiBiKSBBYihhICsgXCJbXCIgKyBlICsgXCJdXCIsIGJbZV0sIGMsIGQpXG4gICAgfVxuICAgIHIucGFyYW0gPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICB2YXIgYywgZCA9IFtdLFxuICAgICAgICAgICAgZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSByLmlzRnVuY3Rpb24oYikgPyBiKCkgOiBiO1xuICAgICAgICAgICAgICAgIGRbZC5sZW5ndGhdID0gZW5jb2RlVVJJQ29tcG9uZW50KGEpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobnVsbCA9PSBjID8gXCJcIiA6IGMpXG4gICAgICAgICAgICB9O1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhKSB8fCBhLmpxdWVyeSAmJiAhci5pc1BsYWluT2JqZWN0KGEpKSByLmVhY2goYSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZSh0aGlzLm5hbWUsIHRoaXMudmFsdWUpXG4gICAgICAgIH0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgKGMgaW4gYSkgQWIoYywgYVtjXSwgYiwgZSk7XG4gICAgICAgIHJldHVybiBkLmpvaW4oXCImXCIpXG4gICAgfSwgci5mbi5leHRlbmQoe1xuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByLnBhcmFtKHRoaXMuc2VyaWFsaXplQXJyYXkoKSlcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSByLnByb3AodGhpcywgXCJlbGVtZW50c1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA/IHIubWFrZUFycmF5KGEpIDogdGhpc1xuICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHRoaXMudHlwZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lICYmICFyKHRoaXMpLmlzKFwiOmRpc2FibGVkXCIpICYmIHpiLnRlc3QodGhpcy5ub2RlTmFtZSkgJiYgIXliLnRlc3QoYSkgJiYgKHRoaXMuY2hlY2tlZCB8fCAhamEudGVzdChhKSlcbiAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciBjID0gcih0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBjID8gbnVsbCA6IEFycmF5LmlzQXJyYXkoYykgPyByLm1hcChjLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGEucmVwbGFjZSh4YiwgXCJcXHJcXG5cIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pIDoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBiLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjLnJlcGxhY2UoeGIsIFwiXFxyXFxuXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZ2V0KClcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBCYiA9IC8lMjAvZyxcbiAgICAgICAgQ2IgPSAvIy4qJC8sXG4gICAgICAgIERiID0gLyhbPyZdKV89W14mXSovLFxuICAgICAgICBFYiA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvZ20sXG4gICAgICAgIEZiID0gL14oPzphYm91dHxhcHB8YXBwLXN0b3JhZ2V8ListZXh0ZW5zaW9ufGZpbGV8cmVzfHdpZGdldCk6JC8sXG4gICAgICAgIEdiID0gL14oPzpHRVR8SEVBRCkkLyxcbiAgICAgICAgSGIgPSAvXlxcL1xcLy8sXG4gICAgICAgIEliID0ge30sXG4gICAgICAgIEpiID0ge30sXG4gICAgICAgIEtiID0gXCIqL1wiLmNvbmNhdChcIipcIiksXG4gICAgICAgIExiID0gZC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBMYi5ocmVmID0gdGIuaHJlZjtcblxuICAgIGZ1bmN0aW9uIE1iKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICBcInN0cmluZ1wiICE9IHR5cGVvZiBiICYmIChjID0gYiwgYiA9IFwiKlwiKTtcbiAgICAgICAgICAgIHZhciBkLCBlID0gMCxcbiAgICAgICAgICAgICAgICBmID0gYi50b0xvd2VyQ2FzZSgpLm1hdGNoKEwpIHx8IFtdO1xuICAgICAgICAgICAgaWYgKHIuaXNGdW5jdGlvbihjKSlcbiAgICAgICAgICAgICAgICB3aGlsZSAoZCA9IGZbZSsrXSkgXCIrXCIgPT09IGRbMF0gPyAoZCA9IGQuc2xpY2UoMSkgfHwgXCIqXCIsIChhW2RdID0gYVtkXSB8fCBbXSkudW5zaGlmdChjKSkgOiAoYVtkXSA9IGFbZF0gfHwgW10pLnB1c2goYylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIE5iKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgdmFyIGUgPSB7fSxcbiAgICAgICAgICAgIGYgPSBhID09PSBKYjtcblxuICAgICAgICBmdW5jdGlvbiBnKGgpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgcmV0dXJuIGVbaF0gPSAhMCwgci5lYWNoKGFbaF0gfHwgW10sIGZ1bmN0aW9uIChhLCBoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGogPSBoKGIsIGMsIGQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBcInN0cmluZ1wiICE9IHR5cGVvZiBqIHx8IGYgfHwgZVtqXSA/IGYgPyAhKGkgPSBqKSA6IHZvaWQgMCA6IChiLmRhdGFUeXBlcy51bnNoaWZ0KGopLCBnKGopLCAhMSlcbiAgICAgICAgICAgIH0pLCBpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGcoYi5kYXRhVHlwZXNbMF0pIHx8ICFlW1wiKlwiXSAmJiBnKFwiKlwiKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIE9iKGEsIGIpIHtcbiAgICAgICAgdmFyIGMsIGQsIGUgPSByLmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9ucyB8fCB7fTtcbiAgICAgICAgZm9yIChjIGluIGIpIHZvaWQgMCAhPT0gYltjXSAmJiAoKGVbY10gPyBhIDogZCB8fCAoZCA9IHt9KSlbY10gPSBiW2NdKTtcbiAgICAgICAgcmV0dXJuIGQgJiYgci5leHRlbmQoITAsIGEsIGQpLCBhXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUGIoYSwgYiwgYykge1xuICAgICAgICB2YXIgZCwgZSwgZiwgZywgaCA9IGEuY29udGVudHMsXG4gICAgICAgICAgICBpID0gYS5kYXRhVHlwZXM7XG4gICAgICAgIHdoaWxlIChcIipcIiA9PT0gaVswXSkgaS5zaGlmdCgpLCB2b2lkIDAgPT09IGQgJiYgKGQgPSBhLm1pbWVUeXBlIHx8IGIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICBpZiAoZClcbiAgICAgICAgICAgIGZvciAoZSBpbiBoKVxuICAgICAgICAgICAgICAgIGlmIChoW2VdICYmIGhbZV0udGVzdChkKSkge1xuICAgICAgICAgICAgICAgICAgICBpLnVuc2hpZnQoZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBpZiAoaVswXSBpbiBjKSBmID0gaVswXTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGUgaW4gYykge1xuICAgICAgICAgICAgICAgIGlmICghaVswXSB8fCBhLmNvbnZlcnRlcnNbZSArIFwiIFwiICsgaVswXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZiA9IGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGcgfHwgKGcgPSBlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZiA9IGYgfHwgZ1xuICAgICAgICB9XG4gICAgICAgIGlmIChmKSByZXR1cm4gZiAhPT0gaVswXSAmJiBpLnVuc2hpZnQoZiksIGNbZl1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBRYihhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciBlLCBmLCBnLCBoLCBpLCBqID0ge30sXG4gICAgICAgICAgICBrID0gYS5kYXRhVHlwZXMuc2xpY2UoKTtcbiAgICAgICAgaWYgKGtbMV0pXG4gICAgICAgICAgICBmb3IgKGcgaW4gYS5jb252ZXJ0ZXJzKSBqW2cudG9Mb3dlckNhc2UoKV0gPSBhLmNvbnZlcnRlcnNbZ107XG4gICAgICAgIGYgPSBrLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlIChmKVxuICAgICAgICAgICAgaWYgKGEucmVzcG9uc2VGaWVsZHNbZl0gJiYgKGNbYS5yZXNwb25zZUZpZWxkc1tmXV0gPSBiKSwgIWkgJiYgZCAmJiBhLmRhdGFGaWx0ZXIgJiYgKGIgPSBhLmRhdGFGaWx0ZXIoYiwgYS5kYXRhVHlwZSkpLCBpID0gZiwgZiA9IGsuc2hpZnQoKSlcbiAgICAgICAgICAgICAgICBpZiAoXCIqXCIgPT09IGYpIGYgPSBpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwiKlwiICE9PSBpICYmIGkgIT09IGYpIHtcbiAgICAgICAgICAgIGlmIChnID0galtpICsgXCIgXCIgKyBmXSB8fCBqW1wiKiBcIiArIGZdLCAhZylcbiAgICAgICAgICAgICAgICBmb3IgKGUgaW4gailcbiAgICAgICAgICAgICAgICAgICAgaWYgKGggPSBlLnNwbGl0KFwiIFwiKSwgaFsxXSA9PT0gZiAmJiAoZyA9IGpbaSArIFwiIFwiICsgaFswXV0gfHwgaltcIiogXCIgKyBoWzBdXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPT09ICEwID8gZyA9IGpbZV0gOiBqW2VdICE9PSAhMCAmJiAoZiA9IGhbMF0sIGsudW5zaGlmdChoWzFdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZyAhPT0gITApXG4gICAgICAgICAgICAgICAgaWYgKGcgJiYgYVtcInRocm93c1wiXSkgYiA9IGcoYik7XG4gICAgICAgICAgICAgICAgZWxzZSB0cnkge1xuICAgICAgICAgICAgICAgICAgICBiID0gZyhiKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiBcInBhcnNlcmVycm9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZyA/IGwgOiBcIk5vIGNvbnZlcnNpb24gZnJvbSBcIiArIGkgKyBcIiB0byBcIiArIGZcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgZGF0YTogYlxuICAgICAgICB9XG4gICAgfVxuICAgIHIuZXh0ZW5kKHtcbiAgICAgICAgYWN0aXZlOiAwLFxuICAgICAgICBsYXN0TW9kaWZpZWQ6IHt9LFxuICAgICAgICBldGFnOiB7fSxcbiAgICAgICAgYWpheFNldHRpbmdzOiB7XG4gICAgICAgICAgICB1cmw6IHRiLmhyZWYsXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgaXNMb2NhbDogRmIudGVzdCh0Yi5wcm90b2NvbCksXG4gICAgICAgICAgICBnbG9iYWw6ICEwLFxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6ICEwLFxuICAgICAgICAgICAgYXN5bmM6ICEwLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCIsXG4gICAgICAgICAgICBhY2NlcHRzOiB7XG4gICAgICAgICAgICAgICAgXCIqXCI6IEtiLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwidGV4dC9wbGFpblwiLFxuICAgICAgICAgICAgICAgIGh0bWw6IFwidGV4dC9odG1sXCIsXG4gICAgICAgICAgICAgICAgeG1sOiBcImFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWxcIixcbiAgICAgICAgICAgICAgICBqc29uOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udGVudHM6IHtcbiAgICAgICAgICAgICAgICB4bWw6IC9cXGJ4bWxcXGIvLFxuICAgICAgICAgICAgICAgIGh0bWw6IC9cXGJodG1sLyxcbiAgICAgICAgICAgICAgICBqc29uOiAvXFxianNvblxcYi9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNwb25zZUZpZWxkczoge1xuICAgICAgICAgICAgICAgIHhtbDogXCJyZXNwb25zZVhNTFwiLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwicmVzcG9uc2VUZXh0XCIsXG4gICAgICAgICAgICAgICAganNvbjogXCJyZXNwb25zZUpTT05cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnZlcnRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIiogdGV4dFwiOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgXCJ0ZXh0IGh0bWxcIjogITAsXG4gICAgICAgICAgICAgICAgXCJ0ZXh0IGpzb25cIjogSlNPTi5wYXJzZSxcbiAgICAgICAgICAgICAgICBcInRleHQgeG1sXCI6IHIucGFyc2VYTUxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmbGF0T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHVybDogITAsXG4gICAgICAgICAgICAgICAgY29udGV4dDogITBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWpheFNldHVwOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIgPyBPYihPYihhLCByLmFqYXhTZXR0aW5ncyksIGIpIDogT2Ioci5hamF4U2V0dGluZ3MsIGEpXG4gICAgICAgIH0sXG4gICAgICAgIGFqYXhQcmVmaWx0ZXI6IE1iKEliKSxcbiAgICAgICAgYWpheFRyYW5zcG9ydDogTWIoSmIpLFxuICAgICAgICBhamF4OiBmdW5jdGlvbiAoYiwgYykge1xuICAgICAgICAgICAgXCJvYmplY3RcIiA9PSB0eXBlb2YgYiAmJiAoYyA9IGIsIGIgPSB2b2lkIDApLCBjID0gYyB8fCB7fTtcbiAgICAgICAgICAgIHZhciBlLCBmLCBnLCBoLCBpLCBqLCBrLCBsLCBtLCBuLCBvID0gci5hamF4U2V0dXAoe30sIGMpLFxuICAgICAgICAgICAgICAgIHAgPSBvLmNvbnRleHQgfHwgbyxcbiAgICAgICAgICAgICAgICBxID0gby5jb250ZXh0ICYmIChwLm5vZGVUeXBlIHx8IHAuanF1ZXJ5KSA/IHIocCkgOiByLmV2ZW50LFxuICAgICAgICAgICAgICAgIHMgPSByLkRlZmVycmVkKCksXG4gICAgICAgICAgICAgICAgdCA9IHIuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXG4gICAgICAgICAgICAgICAgdSA9IG8uc3RhdHVzQ29kZSB8fCB7fSxcbiAgICAgICAgICAgICAgICB2ID0ge30sXG4gICAgICAgICAgICAgICAgdyA9IHt9LFxuICAgICAgICAgICAgICAgIHggPSBcImNhbmNlbGVkXCIsXG4gICAgICAgICAgICAgICAgeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZHlTdGF0ZTogMCxcbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVzcG9uc2VIZWFkZXI6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGIgPSBFYi5leGVjKGcpKSBoW2JbMV0udG9Mb3dlckNhc2UoKV0gPSBiWzJdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBoW2EudG9Mb3dlckNhc2UoKV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsID09IGIgPyBudWxsIDogYlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBnZXRBbGxSZXNwb25zZUhlYWRlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrID8gZyA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2V0UmVxdWVzdEhlYWRlcjogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsID09IGsgJiYgKGEgPSB3W2EudG9Mb3dlckNhc2UoKV0gPSB3W2EudG9Mb3dlckNhc2UoKV0gfHwgYSwgdlthXSA9IGIpLCB0aGlzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG92ZXJyaWRlTWltZVR5cGU6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCA9PSBrICYmIChvLm1pbWVUeXBlID0gYSksIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGspIHkuYWx3YXlzKGFbeS5zdGF0dXNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoYiBpbiBhKSB1W2JdID0gW3VbYl0sIGFbYl1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWJvcnQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGEgfHwgeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlICYmIGUuYWJvcnQoYiksIEEoMCwgYiksIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocy5wcm9taXNlKHkpLCBvLnVybCA9ICgoYiB8fCBvLnVybCB8fCB0Yi5ocmVmKSArIFwiXCIpLnJlcGxhY2UoSGIsIHRiLnByb3RvY29sICsgXCIvL1wiKSwgby50eXBlID0gYy5tZXRob2QgfHwgYy50eXBlIHx8IG8ubWV0aG9kIHx8IG8udHlwZSwgby5kYXRhVHlwZXMgPSAoby5kYXRhVHlwZSB8fCBcIipcIikudG9Mb3dlckNhc2UoKS5tYXRjaChMKSB8fCBbXCJcIl0sIG51bGwgPT0gby5jcm9zc0RvbWFpbikge1xuICAgICAgICAgICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGouaHJlZiA9IG8udXJsLCBqLmhyZWYgPSBqLmhyZWYsIG8uY3Jvc3NEb21haW4gPSBMYi5wcm90b2NvbCArIFwiLy9cIiArIExiLmhvc3QgIT0gai5wcm90b2NvbCArIFwiLy9cIiArIGouaG9zdFxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHopIHtcbiAgICAgICAgICAgICAgICAgICAgby5jcm9zc0RvbWFpbiA9ICEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG8uZGF0YSAmJiBvLnByb2Nlc3NEYXRhICYmIFwic3RyaW5nXCIgIT0gdHlwZW9mIG8uZGF0YSAmJiAoby5kYXRhID0gci5wYXJhbShvLmRhdGEsIG8udHJhZGl0aW9uYWwpKSwgTmIoSWIsIG8sIGMsIHkpLCBrKSByZXR1cm4geTtcbiAgICAgICAgICAgIGwgPSByLmV2ZW50ICYmIG8uZ2xvYmFsLCBsICYmIDAgPT09IHIuYWN0aXZlKysgJiYgci5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpLCBvLnR5cGUgPSBvLnR5cGUudG9VcHBlckNhc2UoKSwgby5oYXNDb250ZW50ID0gIUdiLnRlc3Qoby50eXBlKSwgZiA9IG8udXJsLnJlcGxhY2UoQ2IsIFwiXCIpLCBvLmhhc0NvbnRlbnQgPyBvLmRhdGEgJiYgby5wcm9jZXNzRGF0YSAmJiAwID09PSAoby5jb250ZW50VHlwZSB8fCBcIlwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpICYmIChvLmRhdGEgPSBvLmRhdGEucmVwbGFjZShCYiwgXCIrXCIpKSA6IChuID0gby51cmwuc2xpY2UoZi5sZW5ndGgpLCBvLmRhdGEgJiYgKGYgKz0gKHZiLnRlc3QoZikgPyBcIiZcIiA6IFwiP1wiKSArIG8uZGF0YSwgZGVsZXRlIG8uZGF0YSksIG8uY2FjaGUgPT09ICExICYmIChmID0gZi5yZXBsYWNlKERiLCBcIiQxXCIpLCBuID0gKHZiLnRlc3QoZikgPyBcIiZcIiA6IFwiP1wiKSArIFwiXz1cIiArIHViKysgKyBuKSwgby51cmwgPSBmICsgbiksIG8uaWZNb2RpZmllZCAmJiAoci5sYXN0TW9kaWZpZWRbZl0gJiYgeS5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIiwgci5sYXN0TW9kaWZpZWRbZl0pLCByLmV0YWdbZl0gJiYgeS5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTm9uZS1NYXRjaFwiLCByLmV0YWdbZl0pKSwgKG8uZGF0YSAmJiBvLmhhc0NvbnRlbnQgJiYgby5jb250ZW50VHlwZSAhPT0gITEgfHwgYy5jb250ZW50VHlwZSkgJiYgeS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIG8uY29udGVudFR5cGUpLCB5LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgby5kYXRhVHlwZXNbMF0gJiYgby5hY2NlcHRzW28uZGF0YVR5cGVzWzBdXSA/IG8uYWNjZXB0c1tvLmRhdGFUeXBlc1swXV0gKyAoXCIqXCIgIT09IG8uZGF0YVR5cGVzWzBdID8gXCIsIFwiICsgS2IgKyBcIjsgcT0wLjAxXCIgOiBcIlwiKSA6IG8uYWNjZXB0c1tcIipcIl0pO1xuICAgICAgICAgICAgZm9yIChtIGluIG8uaGVhZGVycykgeS5zZXRSZXF1ZXN0SGVhZGVyKG0sIG8uaGVhZGVyc1ttXSk7XG4gICAgICAgICAgICBpZiAoby5iZWZvcmVTZW5kICYmIChvLmJlZm9yZVNlbmQuY2FsbChwLCB5LCBvKSA9PT0gITEgfHwgaykpIHJldHVybiB5LmFib3J0KCk7XG4gICAgICAgICAgICBpZiAoeCA9IFwiYWJvcnRcIiwgdC5hZGQoby5jb21wbGV0ZSksIHkuZG9uZShvLnN1Y2Nlc3MpLCB5LmZhaWwoby5lcnJvciksIGUgPSBOYihKYiwgbywgYywgeSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoeS5yZWFkeVN0YXRlID0gMSwgbCAmJiBxLnRyaWdnZXIoXCJhamF4U2VuZFwiLCBbeSwgb10pLCBrKSByZXR1cm4geTtcbiAgICAgICAgICAgICAgICBvLmFzeW5jICYmIG8udGltZW91dCA+IDAgJiYgKGkgPSBhLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB5LmFib3J0KFwidGltZW91dFwiKVxuICAgICAgICAgICAgICAgIH0sIG8udGltZW91dCkpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGsgPSAhMSwgZS5zZW5kKHYsIEEpXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoeikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaykgdGhyb3cgejtcbiAgICAgICAgICAgICAgICAgICAgQSgtMSwgeilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgQSgtMSwgXCJObyBUcmFuc3BvcnRcIik7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIEEoYiwgYywgZCwgaCkge1xuICAgICAgICAgICAgICAgIHZhciBqLCBtLCBuLCB2LCB3LCB4ID0gYztcbiAgICAgICAgICAgICAgICBrIHx8IChrID0gITAsIGkgJiYgYS5jbGVhclRpbWVvdXQoaSksIGUgPSB2b2lkIDAsIGcgPSBoIHx8IFwiXCIsIHkucmVhZHlTdGF0ZSA9IGIgPiAwID8gNCA6IDAsIGogPSBiID49IDIwMCAmJiBiIDwgMzAwIHx8IDMwNCA9PT0gYiwgZCAmJiAodiA9IFBiKG8sIHksIGQpKSwgdiA9IFFiKG8sIHYsIHksIGopLCBqID8gKG8uaWZNb2RpZmllZCAmJiAodyA9IHkuZ2V0UmVzcG9uc2VIZWFkZXIoXCJMYXN0LU1vZGlmaWVkXCIpLCB3ICYmIChyLmxhc3RNb2RpZmllZFtmXSA9IHcpLCB3ID0geS5nZXRSZXNwb25zZUhlYWRlcihcImV0YWdcIiksIHcgJiYgKHIuZXRhZ1tmXSA9IHcpKSwgMjA0ID09PSBiIHx8IFwiSEVBRFwiID09PSBvLnR5cGUgPyB4ID0gXCJub2NvbnRlbnRcIiA6IDMwNCA9PT0gYiA/IHggPSBcIm5vdG1vZGlmaWVkXCIgOiAoeCA9IHYuc3RhdGUsIG0gPSB2LmRhdGEsIG4gPSB2LmVycm9yLCBqID0gIW4pKSA6IChuID0geCwgIWIgJiYgeCB8fCAoeCA9IFwiZXJyb3JcIiwgYiA8IDAgJiYgKGIgPSAwKSkpLCB5LnN0YXR1cyA9IGIsIHkuc3RhdHVzVGV4dCA9IChjIHx8IHgpICsgXCJcIiwgaiA/IHMucmVzb2x2ZVdpdGgocCwgW20sIHgsIHldKSA6IHMucmVqZWN0V2l0aChwLCBbeSwgeCwgbl0pLCB5LnN0YXR1c0NvZGUodSksIHUgPSB2b2lkIDAsIGwgJiYgcS50cmlnZ2VyKGogPyBcImFqYXhTdWNjZXNzXCIgOiBcImFqYXhFcnJvclwiLCBbeSwgbywgaiA/IG0gOiBuXSksIHQuZmlyZVdpdGgocCwgW3ksIHhdKSwgbCAmJiAocS50cmlnZ2VyKFwiYWpheENvbXBsZXRlXCIsIFt5LCBvXSksIC0tci5hY3RpdmUgfHwgci5ldmVudC50cmlnZ2VyKFwiYWpheFN0b3BcIikpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SlNPTjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiByLmdldChhLCBiLCBjLCBcImpzb25cIilcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U2NyaXB0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIHIuZ2V0KGEsIHZvaWQgMCwgYiwgXCJzY3JpcHRcIilcbiAgICAgICAgfVxuICAgIH0pLCByLmVhY2goW1wiZ2V0XCIsIFwicG9zdFwiXSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcltiXSA9IGZ1bmN0aW9uIChhLCBjLCBkLCBlKSB7XG4gICAgICAgICAgICByZXR1cm4gci5pc0Z1bmN0aW9uKGMpICYmIChlID0gZSB8fCBkLCBkID0gYywgYyA9IHZvaWQgMCksIHIuYWpheChyLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgdXJsOiBhLFxuICAgICAgICAgICAgICAgIHR5cGU6IGIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IGUsXG4gICAgICAgICAgICAgICAgZGF0YTogYyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBkXG4gICAgICAgICAgICB9LCByLmlzUGxhaW5PYmplY3QoYSkgJiYgYSkpXG4gICAgICAgIH1cbiAgICB9KSwgci5fZXZhbFVybCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiByLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBhLFxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgY2FjaGU6ICEwLFxuICAgICAgICAgICAgYXN5bmM6ICExLFxuICAgICAgICAgICAgZ2xvYmFsOiAhMSxcbiAgICAgICAgICAgIFwidGhyb3dzXCI6ICEwXG4gICAgICAgIH0pXG4gICAgfSwgci5mbi5leHRlbmQoe1xuICAgICAgICB3cmFwQWxsOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGI7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1swXSAmJiAoci5pc0Z1bmN0aW9uKGEpICYmIChhID0gYS5jYWxsKHRoaXNbMF0pKSwgYiA9IHIoYSwgdGhpc1swXS5vd25lckRvY3VtZW50KS5lcSgwKS5jbG9uZSghMCksIHRoaXNbMF0ucGFyZW50Tm9kZSAmJiBiLmluc2VydEJlZm9yZSh0aGlzWzBdKSwgYi5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gdGhpcztcbiAgICAgICAgICAgICAgICB3aGlsZSAoYS5maXJzdEVsZW1lbnRDaGlsZCkgYSA9IGEuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgICAgIH0pLmFwcGVuZCh0aGlzKSksIHRoaXNcbiAgICAgICAgfSxcbiAgICAgICAgd3JhcElubmVyOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHIuaXNGdW5jdGlvbihhKSA/IHRoaXMuZWFjaChmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHIodGhpcykud3JhcElubmVyKGEuY2FsbCh0aGlzLCBiKSlcbiAgICAgICAgICAgIH0pIDogdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHIodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGMgPSBiLmNvbnRlbnRzKCk7XG4gICAgICAgICAgICAgICAgYy5sZW5ndGggPyBjLndyYXBBbGwoYSkgOiBiLmFwcGVuZChhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgd3JhcDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBiID0gci5pc0Z1bmN0aW9uKGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICAgIHIodGhpcykud3JhcEFsbChiID8gYS5jYWxsKHRoaXMsIGMpIDogYSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHVud3JhcDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudChhKS5ub3QoXCJib2R5XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHIodGhpcykucmVwbGFjZVdpdGgodGhpcy5jaGlsZE5vZGVzKVxuICAgICAgICAgICAgfSksIHRoaXNcbiAgICAgICAgfVxuICAgIH0pLCByLmV4cHIucHNldWRvcy5oaWRkZW4gPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gIXIuZXhwci5wc2V1ZG9zLnZpc2libGUoYSlcbiAgICB9LCByLmV4cHIucHNldWRvcy52aXNpYmxlID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuICEhKGEub2Zmc2V0V2lkdGggfHwgYS5vZmZzZXRIZWlnaHQgfHwgYS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aClcbiAgICB9LCByLmFqYXhTZXR0aW5ncy54aHIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IGEuWE1MSHR0cFJlcXVlc3RcbiAgICAgICAgfSBjYXRjaCAoYikge31cbiAgICB9O1xuICAgIHZhciBSYiA9IHtcbiAgICAgICAgICAgIDA6IDIwMCxcbiAgICAgICAgICAgIDEyMjM6IDIwNFxuICAgICAgICB9LFxuICAgICAgICBTYiA9IHIuYWpheFNldHRpbmdzLnhocigpO1xuICAgIG8uY29ycyA9ICEhU2IgJiYgXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiBTYiwgby5hamF4ID0gU2IgPSAhIVNiLCByLmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgdmFyIGMsIGQ7XG4gICAgICAgIGlmIChvLmNvcnMgfHwgU2IgJiYgIWIuY3Jvc3NEb21haW4pIHJldHVybiB7XG4gICAgICAgICAgICBzZW5kOiBmdW5jdGlvbiAoZSwgZikge1xuICAgICAgICAgICAgICAgIHZhciBnLCBoID0gYi54aHIoKTtcbiAgICAgICAgICAgICAgICBpZiAoaC5vcGVuKGIudHlwZSwgYi51cmwsIGIuYXN5bmMsIGIudXNlcm5hbWUsIGIucGFzc3dvcmQpLCBiLnhockZpZWxkcylcbiAgICAgICAgICAgICAgICAgICAgZm9yIChnIGluIGIueGhyRmllbGRzKSBoW2ddID0gYi54aHJGaWVsZHNbZ107XG4gICAgICAgICAgICAgICAgYi5taW1lVHlwZSAmJiBoLm92ZXJyaWRlTWltZVR5cGUgJiYgaC5vdmVycmlkZU1pbWVUeXBlKGIubWltZVR5cGUpLCBiLmNyb3NzRG9tYWluIHx8IGVbXCJYLVJlcXVlc3RlZC1XaXRoXCJdIHx8IChlW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXSA9IFwiWE1MSHR0cFJlcXVlc3RcIik7XG4gICAgICAgICAgICAgICAgZm9yIChnIGluIGUpIGguc2V0UmVxdWVzdEhlYWRlcihnLCBlW2ddKTtcbiAgICAgICAgICAgICAgICBjID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgJiYgKGMgPSBkID0gaC5vbmxvYWQgPSBoLm9uZXJyb3IgPSBoLm9uYWJvcnQgPSBoLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGwsIFwiYWJvcnRcIiA9PT0gYSA/IGguYWJvcnQoKSA6IFwiZXJyb3JcIiA9PT0gYSA/IFwibnVtYmVyXCIgIT0gdHlwZW9mIGguc3RhdHVzID8gZigwLCBcImVycm9yXCIpIDogZihoLnN0YXR1cywgaC5zdGF0dXNUZXh0KSA6IGYoUmJbaC5zdGF0dXNdIHx8IGguc3RhdHVzLCBoLnN0YXR1c1RleHQsIFwidGV4dFwiICE9PSAoaC5yZXNwb25zZVR5cGUgfHwgXCJ0ZXh0XCIpIHx8IFwic3RyaW5nXCIgIT0gdHlwZW9mIGgucmVzcG9uc2VUZXh0ID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeTogaC5yZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBoLnJlc3BvbnNlVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgaC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBoLm9ubG9hZCA9IGMoKSwgZCA9IGgub25lcnJvciA9IGMoXCJlcnJvclwiKSwgdm9pZCAwICE9PSBoLm9uYWJvcnQgPyBoLm9uYWJvcnQgPSBkIDogaC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIDQgPT09IGgucmVhZHlTdGF0ZSAmJiBhLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyAmJiBkKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LCBjID0gYyhcImFib3J0XCIpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGguc2VuZChiLmhhc0NvbnRlbnQgJiYgYi5kYXRhIHx8IG51bGwpXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYykgdGhyb3cgaVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGMgJiYgYygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSwgci5hamF4UHJlZmlsdGVyKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIGEuY3Jvc3NEb21haW4gJiYgKGEuY29udGVudHMuc2NyaXB0ID0gITEpXG4gICAgfSksIHIuYWpheFNldHVwKHtcbiAgICAgICAgYWNjZXB0czoge1xuICAgICAgICAgICAgc2NyaXB0OiBcInRleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCwgYXBwbGljYXRpb24vZWNtYXNjcmlwdCwgYXBwbGljYXRpb24veC1lY21hc2NyaXB0XCJcbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudHM6IHtcbiAgICAgICAgICAgIHNjcmlwdDogL1xcYig/OmphdmF8ZWNtYSlzY3JpcHRcXGIvXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnZlcnRlcnM6IHtcbiAgICAgICAgICAgIFwidGV4dCBzY3JpcHRcIjogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5nbG9iYWxFdmFsKGEpLCBhXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSwgci5hamF4UHJlZmlsdGVyKFwic2NyaXB0XCIsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZvaWQgMCA9PT0gYS5jYWNoZSAmJiAoYS5jYWNoZSA9ICExKSwgYS5jcm9zc0RvbWFpbiAmJiAoYS50eXBlID0gXCJHRVRcIilcbiAgICB9KSwgci5hamF4VHJhbnNwb3J0KFwic2NyaXB0XCIsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIGlmIChhLmNyb3NzRG9tYWluKSB7XG4gICAgICAgICAgICB2YXIgYiwgYztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24gKGUsIGYpIHtcbiAgICAgICAgICAgICAgICAgICAgYiA9IHIoXCI8c2NyaXB0PlwiKS5wcm9wKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJzZXQ6IGEuc2NyaXB0Q2hhcnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogYS51cmxcbiAgICAgICAgICAgICAgICAgICAgfSkub24oXCJsb2FkIGVycm9yXCIsIGMgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYi5yZW1vdmUoKSwgYyA9IG51bGwsIGEgJiYgZihcImVycm9yXCIgPT09IGEudHlwZSA/IDQwNCA6IDIwMCwgYS50eXBlKVxuICAgICAgICAgICAgICAgICAgICB9KSwgZC5oZWFkLmFwcGVuZENoaWxkKGJbMF0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjICYmIGMoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBUYiA9IFtdLFxuICAgICAgICBVYiA9IC8oPSlcXD8oPz0mfCQpfFxcP1xcPy87XG4gICAgci5hamF4U2V0dXAoe1xuICAgICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxuICAgICAgICBqc29ucENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYSA9IFRiLnBvcCgpIHx8IHIuZXhwYW5kbyArIFwiX1wiICsgdWIrKztcbiAgICAgICAgICAgIHJldHVybiB0aGlzW2FdID0gITAsIGFcbiAgICAgICAgfVxuICAgIH0pLCByLmFqYXhQcmVmaWx0ZXIoXCJqc29uIGpzb25wXCIsIGZ1bmN0aW9uIChiLCBjLCBkKSB7XG4gICAgICAgIHZhciBlLCBmLCBnLCBoID0gYi5qc29ucCAhPT0gITEgJiYgKFViLnRlc3QoYi51cmwpID8gXCJ1cmxcIiA6IFwic3RyaW5nXCIgPT0gdHlwZW9mIGIuZGF0YSAmJiAwID09PSAoYi5jb250ZW50VHlwZSB8fCBcIlwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpICYmIFViLnRlc3QoYi5kYXRhKSAmJiBcImRhdGFcIik7XG4gICAgICAgIGlmIChoIHx8IFwianNvbnBcIiA9PT0gYi5kYXRhVHlwZXNbMF0pIHJldHVybiBlID0gYi5qc29ucENhbGxiYWNrID0gci5pc0Z1bmN0aW9uKGIuanNvbnBDYWxsYmFjaykgPyBiLmpzb25wQ2FsbGJhY2soKSA6IGIuanNvbnBDYWxsYmFjaywgaCA/IGJbaF0gPSBiW2hdLnJlcGxhY2UoVWIsIFwiJDFcIiArIGUpIDogYi5qc29ucCAhPT0gITEgJiYgKGIudXJsICs9ICh2Yi50ZXN0KGIudXJsKSA/IFwiJlwiIDogXCI/XCIpICsgYi5qc29ucCArIFwiPVwiICsgZSksIGIuY29udmVydGVyc1tcInNjcmlwdCBqc29uXCJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGcgfHwgci5lcnJvcihlICsgXCIgd2FzIG5vdCBjYWxsZWRcIiksIGdbMF1cbiAgICAgICAgfSwgYi5kYXRhVHlwZXNbMF0gPSBcImpzb25cIiwgZiA9IGFbZV0sIGFbZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnID0gYXJndW1lbnRzXG4gICAgICAgIH0sIGQuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZvaWQgMCA9PT0gZiA/IHIoYSkucmVtb3ZlUHJvcChlKSA6IGFbZV0gPSBmLCBiW2VdICYmIChiLmpzb25wQ2FsbGJhY2sgPSBjLmpzb25wQ2FsbGJhY2ssIFRiLnB1c2goZSkpLCBnICYmIHIuaXNGdW5jdGlvbihmKSAmJiBmKGdbMF0pLCBnID0gZiA9IHZvaWQgMFxuICAgICAgICB9KSwgXCJzY3JpcHRcIlxuICAgIH0pLCBvLmNyZWF0ZUhUTUxEb2N1bWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBkLmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcIlwiKS5ib2R5O1xuICAgICAgICByZXR1cm4gYS5pbm5lckhUTUwgPSBcIjxmb3JtPjwvZm9ybT48Zm9ybT48L2Zvcm0+XCIsIDIgPT09IGEuY2hpbGROb2Rlcy5sZW5ndGhcbiAgICB9KCksIHIucGFyc2VIVE1MID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgIT0gdHlwZW9mIGEpIHJldHVybiBbXTtcbiAgICAgICAgXCJib29sZWFuXCIgPT0gdHlwZW9mIGIgJiYgKGMgPSBiLCBiID0gITEpO1xuICAgICAgICB2YXIgZSwgZiwgZztcbiAgICAgICAgcmV0dXJuIGIgfHwgKG8uY3JlYXRlSFRNTERvY3VtZW50ID8gKGIgPSBkLmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcIlwiKSwgZSA9IGIuY3JlYXRlRWxlbWVudChcImJhc2VcIiksIGUuaHJlZiA9IGQubG9jYXRpb24uaHJlZiwgYi5oZWFkLmFwcGVuZENoaWxkKGUpKSA6IGIgPSBkKSwgZiA9IEMuZXhlYyhhKSwgZyA9ICFjICYmIFtdLCBmID8gW2IuY3JlYXRlRWxlbWVudChmWzFdKV0gOiAoZiA9IHFhKFthXSwgYiwgZyksIGcgJiYgZy5sZW5ndGggJiYgcihnKS5yZW1vdmUoKSwgci5tZXJnZShbXSwgZi5jaGlsZE5vZGVzKSlcbiAgICB9LCByLmZuLmxvYWQgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICB2YXIgZCwgZSwgZiwgZyA9IHRoaXMsXG4gICAgICAgICAgICBoID0gYS5pbmRleE9mKFwiIFwiKTtcbiAgICAgICAgcmV0dXJuIGggPiAtMSAmJiAoZCA9IHBiKGEuc2xpY2UoaCkpLCBhID0gYS5zbGljZSgwLCBoKSksIHIuaXNGdW5jdGlvbihiKSA/IChjID0gYiwgYiA9IHZvaWQgMCkgOiBiICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIGIgJiYgKGUgPSBcIlBPU1RcIiksIGcubGVuZ3RoID4gMCAmJiByLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBhLFxuICAgICAgICAgICAgdHlwZTogZSB8fCBcIkdFVFwiLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgZGF0YTogYlxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICBmID0gYXJndW1lbnRzLCBnLmh0bWwoZCA/IHIoXCI8ZGl2PlwiKS5hcHBlbmQoci5wYXJzZUhUTUwoYSkpLmZpbmQoZCkgOiBhKVxuICAgICAgICB9KS5hbHdheXMoYyAmJiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgZy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjLmFwcGx5KHRoaXMsIGYgfHwgW2EucmVzcG9uc2VUZXh0LCBiLCBhXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLCB0aGlzXG4gICAgfSwgci5lYWNoKFtcImFqYXhTdGFydFwiLCBcImFqYXhTdG9wXCIsIFwiYWpheENvbXBsZXRlXCIsIFwiYWpheEVycm9yXCIsIFwiYWpheFN1Y2Nlc3NcIiwgXCJhamF4U2VuZFwiXSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgci5mbltiXSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vbihiLCBhKVxuICAgICAgICB9XG4gICAgfSksIHIuZXhwci5wc2V1ZG9zLmFuaW1hdGVkID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIHIuZ3JlcChyLnRpbWVycywgZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiLmVsZW1cbiAgICAgICAgfSkubGVuZ3RoXG4gICAgfSwgci5vZmZzZXQgPSB7XG4gICAgICAgIHNldE9mZnNldDogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkLCBlLCBmLCBnLCBoLCBpLCBqLCBrID0gci5jc3MoYSwgXCJwb3NpdGlvblwiKSxcbiAgICAgICAgICAgICAgICBsID0gcihhKSxcbiAgICAgICAgICAgICAgICBtID0ge307XG4gICAgICAgICAgICBcInN0YXRpY1wiID09PSBrICYmIChhLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiKSwgaCA9IGwub2Zmc2V0KCksIGYgPSByLmNzcyhhLCBcInRvcFwiKSwgaSA9IHIuY3NzKGEsIFwibGVmdFwiKSwgaiA9IChcImFic29sdXRlXCIgPT09IGsgfHwgXCJmaXhlZFwiID09PSBrKSAmJiAoZiArIGkpLmluZGV4T2YoXCJhdXRvXCIpID4gLTEsIGogPyAoZCA9IGwucG9zaXRpb24oKSwgZyA9IGQudG9wLCBlID0gZC5sZWZ0KSA6IChnID0gcGFyc2VGbG9hdChmKSB8fCAwLCBlID0gcGFyc2VGbG9hdChpKSB8fCAwKSwgci5pc0Z1bmN0aW9uKGIpICYmIChiID0gYi5jYWxsKGEsIGMsIHIuZXh0ZW5kKHt9LCBoKSkpLCBudWxsICE9IGIudG9wICYmIChtLnRvcCA9IGIudG9wIC0gaC50b3AgKyBnKSwgbnVsbCAhPSBiLmxlZnQgJiYgKG0ubGVmdCA9IGIubGVmdCAtIGgubGVmdCArIGUpLCBcInVzaW5nXCIgaW4gYiA/IGIudXNpbmcuY2FsbChhLCBtKSA6IGwuY3NzKG0pXG4gICAgICAgIH1cbiAgICB9LCByLmZuLmV4dGVuZCh7XG4gICAgICAgIG9mZnNldDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdm9pZCAwID09PSBhID8gdGhpcyA6IHRoaXMuZWFjaChmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgIHIub2Zmc2V0LnNldE9mZnNldCh0aGlzLCBhLCBiKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgYiwgYywgZCwgZSwgZiA9IHRoaXNbMF07XG4gICAgICAgICAgICBpZiAoZikgcmV0dXJuIGYuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPyAoZCA9IGYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGIgPSBmLm93bmVyRG9jdW1lbnQsIGMgPSBiLmRvY3VtZW50RWxlbWVudCwgZSA9IGIuZGVmYXVsdFZpZXcsIHtcbiAgICAgICAgICAgICAgICB0b3A6IGQudG9wICsgZS5wYWdlWU9mZnNldCAtIGMuY2xpZW50VG9wLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGQubGVmdCArIGUucGFnZVhPZmZzZXQgLSBjLmNsaWVudExlZnRcbiAgICAgICAgICAgIH0pIDoge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpc1swXSkge1xuICAgICAgICAgICAgICAgIHZhciBhLCBiLCBjID0gdGhpc1swXSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJmaXhlZFwiID09PSByLmNzcyhjLCBcInBvc2l0aW9uXCIpID8gYiA9IGMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiAoYSA9IHRoaXMub2Zmc2V0UGFyZW50KCksIGIgPSB0aGlzLm9mZnNldCgpLCBCKGFbMF0sIFwiaHRtbFwiKSB8fCAoZCA9IGEub2Zmc2V0KCkpLCBkID0ge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IGQudG9wICsgci5jc3MoYVswXSwgXCJib3JkZXJUb3BXaWR0aFwiLCAhMCksXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGQubGVmdCArIHIuY3NzKGFbMF0sIFwiYm9yZGVyTGVmdFdpZHRoXCIsICEwKVxuICAgICAgICAgICAgICAgIH0pLCB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogYi50b3AgLSBkLnRvcCAtIHIuY3NzKGMsIFwibWFyZ2luVG9wXCIsICEwKSxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogYi5sZWZ0IC0gZC5sZWZ0IC0gci5jc3MoYywgXCJtYXJnaW5MZWZ0XCIsICEwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb2Zmc2V0UGFyZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gdGhpcy5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGEgJiYgXCJzdGF0aWNcIiA9PT0gci5jc3MoYSwgXCJwb3NpdGlvblwiKSkgYSA9IGEub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBhIHx8IHJhXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSksIHIuZWFjaCh7XG4gICAgICAgIHNjcm9sbExlZnQ6IFwicGFnZVhPZmZzZXRcIixcbiAgICAgICAgc2Nyb2xsVG9wOiBcInBhZ2VZT2Zmc2V0XCJcbiAgICB9LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICB2YXIgYyA9IFwicGFnZVlPZmZzZXRcIiA9PT0gYjtcbiAgICAgICAgci5mblthXSA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICByZXR1cm4gVCh0aGlzLCBmdW5jdGlvbiAoYSwgZCwgZSkge1xuICAgICAgICAgICAgICAgIHZhciBmO1xuICAgICAgICAgICAgICAgIHJldHVybiByLmlzV2luZG93KGEpID8gZiA9IGEgOiA5ID09PSBhLm5vZGVUeXBlICYmIChmID0gYS5kZWZhdWx0VmlldyksIHZvaWQgMCA9PT0gZSA/IGYgPyBmW2JdIDogYVtkXSA6IHZvaWQoZiA/IGYuc2Nyb2xsVG8oYyA/IGYucGFnZVhPZmZzZXQgOiBlLCBjID8gZSA6IGYucGFnZVlPZmZzZXQpIDogYVtkXSA9IGUpXG4gICAgICAgICAgICB9LCBhLCBkLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB9XG4gICAgfSksIHIuZWFjaChbXCJ0b3BcIiwgXCJsZWZ0XCJdLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByLmNzc0hvb2tzW2JdID0gUGEoby5waXhlbFBvc2l0aW9uLCBmdW5jdGlvbiAoYSwgYykge1xuICAgICAgICAgICAgaWYgKGMpIHJldHVybiBjID0gT2EoYSwgYiksIE1hLnRlc3QoYykgPyByKGEpLnBvc2l0aW9uKClbYl0gKyBcInB4XCIgOiBjXG4gICAgICAgIH0pXG4gICAgfSksIHIuZWFjaCh7XG4gICAgICAgIEhlaWdodDogXCJoZWlnaHRcIixcbiAgICAgICAgV2lkdGg6IFwid2lkdGhcIlxuICAgIH0sIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHIuZWFjaCh7XG4gICAgICAgICAgICBwYWRkaW5nOiBcImlubmVyXCIgKyBhLFxuICAgICAgICAgICAgY29udGVudDogYixcbiAgICAgICAgICAgIFwiXCI6IFwib3V0ZXJcIiArIGFcbiAgICAgICAgfSwgZnVuY3Rpb24gKGMsIGQpIHtcbiAgICAgICAgICAgIHIuZm5bZF0gPSBmdW5jdGlvbiAoZSwgZikge1xuICAgICAgICAgICAgICAgIHZhciBnID0gYXJndW1lbnRzLmxlbmd0aCAmJiAoYyB8fCBcImJvb2xlYW5cIiAhPSB0eXBlb2YgZSksXG4gICAgICAgICAgICAgICAgICAgIGggPSBjIHx8IChlID09PSAhMCB8fCBmID09PSAhMCA/IFwibWFyZ2luXCIgOiBcImJvcmRlclwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gVCh0aGlzLCBmdW5jdGlvbiAoYiwgYywgZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIuaXNXaW5kb3coYikgPyAwID09PSBkLmluZGV4T2YoXCJvdXRlclwiKSA/IGJbXCJpbm5lclwiICsgYV0gOiBiLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtcImNsaWVudFwiICsgYV0gOiA5ID09PSBiLm5vZGVUeXBlID8gKGYgPSBiLmRvY3VtZW50RWxlbWVudCwgTWF0aC5tYXgoYi5ib2R5W1wic2Nyb2xsXCIgKyBhXSwgZltcInNjcm9sbFwiICsgYV0sIGIuYm9keVtcIm9mZnNldFwiICsgYV0sIGZbXCJvZmZzZXRcIiArIGFdLCBmW1wiY2xpZW50XCIgKyBhXSkpIDogdm9pZCAwID09PSBlID8gci5jc3MoYiwgYywgaCkgOiByLnN0eWxlKGIsIGMsIGUsIGgpXG4gICAgICAgICAgICAgICAgfSwgYiwgZyA/IGUgOiB2b2lkIDAsIGcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSksIHIuZm4uZXh0ZW5kKHtcbiAgICAgICAgYmluZDogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uKGEsIG51bGwsIGIsIGMpXG4gICAgICAgIH0sXG4gICAgICAgIHVuYmluZDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9mZihhLCBudWxsLCBiKVxuICAgICAgICB9LFxuICAgICAgICBkZWxlZ2F0ZTogZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uKGIsIGEsIGMsIGQpXG4gICAgICAgIH0sXG4gICAgICAgIHVuZGVsZWdhdGU6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gMSA9PT0gYXJndW1lbnRzLmxlbmd0aCA/IHRoaXMub2ZmKGEsIFwiKipcIikgOiB0aGlzLm9mZihiLCBhIHx8IFwiKipcIiwgYylcbiAgICAgICAgfVxuICAgIH0pLCByLmhvbGRSZWFkeSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIGEgPyByLnJlYWR5V2FpdCsrIDogci5yZWFkeSghMClcbiAgICB9LCByLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5LCByLnBhcnNlSlNPTiA9IEpTT04ucGFyc2UsIHIubm9kZU5hbWUgPSBCLCBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kICYmIGRlZmluZShcImpxdWVyeVwiLCBbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gclxuICAgIH0pO1xuICAgIHZhciBWYiA9IGEualF1ZXJ5LFxuICAgICAgICBXYiA9IGEuJDtcbiAgICByZXR1cm4gci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgcmV0dXJuIGEuJCA9PT0gciAmJiAoYS4kID0gV2IpLCBiICYmIGEualF1ZXJ5ID09PSByICYmIChhLmpRdWVyeSA9IFZiKSwgclxuICAgIH0sIGIgfHwgKGEualF1ZXJ5ID0gYS4kID0gciksIHJcbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZyYW5raWVyb2JlcnRvL2FjY29yZGlvblxuXG5mdW5jdGlvbiBBY2NvcmRpb24oZWxlbWVudCkge1xuXG4gIC8vIEZpcnN0IGRvIGZlYXR1cmUgZGV0ZWN0aW9uIGZvciByZXF1aXJlZCBBUEkgbWV0aG9kc1xuICBpZiAoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCAmJlxuICAgIHdpbmRvdy5Ob2RlTGlzdCAmJlxuICAgICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmJvZHlcbiAgKSB7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgdGhpcy5zZWN0aW9ucyA9IFtdXG4gICAgdGhpcy5zZXR1cCgpXG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIEFjY29yZGlvblNlY3Rpb24oZWxlbWVudCwgYWNjb3JkaW9uKSB7XG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb25cbiAgdGhpcy5zZXR1cCgpXG59XG5cbkFjY29yZGlvbi5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgYWNjb3JkaW9uX3NlY3Rpb25zID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tc2VjdGlvbicpXG5cbiAgdmFyIGFjY29yZGlvbiA9IHRoaXNcblxuICBmb3IgKHZhciBpID0gYWNjb3JkaW9uX3NlY3Rpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgIGFjY29yZGlvbi5zZWN0aW9ucy5wdXNoKG5ldyBBY2NvcmRpb25TZWN0aW9uKGFjY29yZGlvbl9zZWN0aW9uc1tpXSwgYWNjb3JkaW9uKSlcbiAgfTtcblxuICB2YXIgYWNjb3JkaW9uX2NvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYWNjb3JkaW9uX2NvbnRyb2xzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYWNjb3JkaW9uLWNvbnRyb2xzJylcblxuICB2YXIgb3Blbl9vcl9jbG9zZV9hbGxfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgb3Blbl9vcl9jbG9zZV9hbGxfYnV0dG9uLnRleHRDb250ZW50ID0gJ09wZW4gYWxsJ1xuICBvcGVuX29yX2Nsb3NlX2FsbF9idXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdhY2NvcmRpb24tZXhwYW5kLWFsbCcpXG4gIG9wZW5fb3JfY2xvc2VfYWxsX2J1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICBvcGVuX29yX2Nsb3NlX2FsbF9idXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXG5cbiAgb3Blbl9vcl9jbG9zZV9hbGxfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuT3JDbG9zZUFsbC5iaW5kKHRoaXMpKVxuXG4gIGFjY29yZGlvbl9jb250cm9scy5hcHBlbmRDaGlsZChvcGVuX29yX2Nsb3NlX2FsbF9idXR0b24pXG5cbiAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZShhY2NvcmRpb25fY29udHJvbHMsIHRoaXMuZWxlbWVudC5maXJzdENoaWxkKVxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnd2l0aC1qcycpXG59XG5cbkFjY29yZGlvbi5wcm90b3R5cGUub3Blbk9yQ2xvc2VBbGwgPSBmdW5jdGlvbihldmVudCkge1xuXG4gIHZhciBvcGVuX29yX2Nsb3NlX2FsbF9idXR0b24gPSBldmVudC50YXJnZXRcbiAgdmFyIG5vd19leHBhbmRlZCA9ICEob3Blbl9vcl9jbG9zZV9hbGxfYnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09ICd0cnVlJylcblxuICBmb3IgKHZhciBpID0gdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHRoaXMuc2VjdGlvbnNbaV0uc2V0RXhwYW5kZWQobm93X2V4cGFuZGVkKVxuICB9O1xuXG4gIHRoaXMuc2V0T3BlbkNsb3NlQnV0dG9uRXhwYW5kZWQobm93X2V4cGFuZGVkKVxuXG59XG5cblxuQWNjb3JkaW9uLnByb3RvdHlwZS5zZXRPcGVuQ2xvc2VCdXR0b25FeHBhbmRlZCA9IGZ1bmN0aW9uKGV4cGFuZGVkKSB7XG5cbiAgdmFyIG9wZW5fb3JfY2xvc2VfYWxsX2J1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uLWV4cGFuZC1hbGwnKVxuXG4gIHZhciBuZXdfYnV0dG9uX3RleHQgPSBleHBhbmRlZCA/IFwiQ2xvc2UgYWxsXCIgOiBcIk9wZW4gYWxsXCJcbiAgb3Blbl9vcl9jbG9zZV9hbGxfYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGV4cGFuZGVkKVxuICBvcGVuX29yX2Nsb3NlX2FsbF9idXR0b24udGV4dENvbnRlbnQgPSBuZXdfYnV0dG9uX3RleHRcblxufVxuXG5BY2NvcmRpb24ucHJvdG90eXBlLnVwZGF0ZU9wZW5BbGwgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgc2VjdGlvbnNDb3VudCA9IHRoaXMuc2VjdGlvbnMubGVuZ3RoXG5cbiAgdmFyIG9wZW5TZWN0aW9uc0NvdW50ID0gMFxuXG4gIGZvciAodmFyIGkgPSB0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHRoaXMuc2VjdGlvbnNbaV0uZXhwYW5kZWQoKSkge1xuICAgICAgb3BlblNlY3Rpb25zQ291bnQgKz0gMVxuICAgIH1cbiAgfTtcblxuICBpZiAoc2VjdGlvbnNDb3VudCA9PSBvcGVuU2VjdGlvbnNDb3VudCkge1xuICAgIHRoaXMuc2V0T3BlbkNsb3NlQnV0dG9uRXhwYW5kZWQodHJ1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNldE9wZW5DbG9zZUJ1dHRvbkV4cGFuZGVkKGZhbHNlKVxuICB9XG5cbn1cblxuQWNjb3JkaW9uU2VjdGlvbi5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgc2VjdGlvbkV4cGFuZGVkID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLXNlY3Rpb24tLWV4cGFuZGVkJylcblxuICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgc2VjdGlvbkV4cGFuZGVkKVxuXG4gIHZhciBoZWFkZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbi1zZWN0aW9uLWhlYWRlcicpXG4gIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudG9nZ2xlRXhwYW5kZWQuYmluZCh0aGlzKSlcbiAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcy5rZXlQcmVzc2VkLmJpbmQodGhpcykpXG4gIGhlYWRlci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKVxuICBoZWFkZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpXG5cbiAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgaWNvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2ljb24nKVxuXG4gIGhlYWRlci5hcHBlbmRDaGlsZChpY29uKVxuXG4gIC8qIFJlbW92ZSB0aGlzIGNsYXNzIG5vdywgYXMgdGhlIGBhcmlhLWV4cGFuZGVkYCBhdHRyaWJ1dGUgaXMgYmVpbmcgdXNlZFxuICAgICAgIHRvIHN0b3JlIGV4cGFuZGVkIHN0YXRlIGluc3RlYWQuICovXG4gIGlmIChzZWN0aW9uRXhwYW5kZWQpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWNjb3JkaW9uLXNlY3Rpb24tLWV4cGFuZGVkJyk7XG4gIH1cblxufVxuXG5BY2NvcmRpb25TZWN0aW9uLnByb3RvdHlwZS50b2dnbGVFeHBhbmRlZCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBleHBhbmRlZCA9ICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT0gJ3RydWUnKVxuXG4gIHRoaXMuc2V0RXhwYW5kZWQoIWV4cGFuZGVkKVxuICB0aGlzLmFjY29yZGlvbi51cGRhdGVPcGVuQWxsKClcbn1cblxuQWNjb3JkaW9uU2VjdGlvbi5wcm90b3R5cGUua2V5UHJlc3NlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgaWYgKGV2ZW50LmtleSA9PT0gXCIgXCIgfHwgZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG9nZ2xlRXhwYW5kZWQoKTtcbiAgfVxufVxuXG5BY2NvcmRpb25TZWN0aW9uLnByb3RvdHlwZS5leHBhbmRlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PSAndHJ1ZScpXG59XG5cbkFjY29yZGlvblNlY3Rpb24ucHJvdG90eXBlLnNldEV4cGFuZGVkID0gZnVuY3Rpb24oZXhwYW5kZWQpIHtcbiAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGV4cGFuZGVkKVxuXG4gIC8vIFRoaXMgaXMgc2V0IHRvIHRyaWdnZXIgcmVmbG93IGZvciBJRTgsIHdoaWNoIGRvZXNuJ3RcbiAgLy8gYWx3YXlzIHJlZmxvdyBhZnRlciBhIHNldEF0dHJpYnV0ZSBjYWxsLlxuICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5lbGVtZW50LmNsYXNzTmFtZVxuXG59XG4iLCI7KGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCdcbiAgICB2YXIgcm9vdCA9IHRoaXNcbiAgICBpZiAodHlwZW9mIHJvb3QuR09WVUsgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJvb3QuR09WVUsgPSB7fVxuICAgIH1cblxuICAgIC8qXG4gICAgICBDb29raWUgbWV0aG9kc1xuICAgICAgPT09PT09PT09PT09PT1cbiAgICAgIFVzYWdlOlxuICAgICAgICBTZXR0aW5nIGEgY29va2llOlxuICAgICAgICBHT1ZVSy5jb29raWUoJ2hvYm5vYicsICd0YXN0eScsIHsgZGF5czogMzAgfSk7XG4gICAgICAgIFJlYWRpbmcgYSBjb29raWU6XG4gICAgICAgIEdPVlVLLmNvb2tpZSgnaG9ibm9iJyk7XG4gICAgICAgIERlbGV0aW5nIGEgY29va2llOlxuICAgICAgICBHT1ZVSy5jb29raWUoJ2hvYm5vYicsIG51bGwpO1xuICAgICovXG4gICAgcm9vdC5HT1ZVSy5jb29raWUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdC5HT1ZVSy5zZXRDb29raWUobmFtZSwgJycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGF5czogLTFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdC5HT1ZVSy5zZXRDb29raWUobmFtZSwgdmFsdWUsIG9wdGlvbnMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdC5HT1ZVSy5nZXRDb29raWUobmFtZSlcbiAgICAgICAgfVxuICAgIH1cbiAgICByb290LkdPVlVLLnNldENvb2tpZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge31cbiAgICAgICAgfVxuICAgICAgICB2YXIgY29va2llU3RyaW5nID0gbmFtZSArICc9JyArIHZhbHVlICsgJzsgcGF0aD0vJ1xuICAgICAgICBpZiAob3B0aW9ucy5kYXlzKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChvcHRpb25zLmRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSlcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyA9IGNvb2tpZVN0cmluZyArICc7IGV4cGlyZXM9JyArIGRhdGUudG9HTVRTdHJpbmcoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHtcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyA9IGNvb2tpZVN0cmluZyArICc7IFNlY3VyZSdcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWVTdHJpbmdcbiAgICB9XG4gICAgcm9vdC5HT1ZVSy5nZXRDb29raWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9J1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb29raWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXVxuICAgICAgICAgICAgd2hpbGUgKGNvb2tpZS5jaGFyQXQoMCkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgIGNvb2tpZSA9IGNvb2tpZS5zdWJzdHJpbmcoMSwgY29va2llLmxlbmd0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb29raWUuaW5kZXhPZihuYW1lRVEpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIHJvb3QuR09WVUsuYWRkQ29va2llTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jb29raWUtYmFubmVyJylbMF1cbiAgICAgICAgdmFyIGhhc0Nvb2tpZU1lc3NhZ2UgPSAobWVzc2FnZSAmJiByb290LkdPVlVLLmNvb2tpZSgnc2Vlbl9jb29raWVfbWVzc2FnZScpID09PSBudWxsKVxuXG4gICAgICAgIGlmIChoYXNDb29raWVNZXNzYWdlKSB7XG4gICAgICAgICAgICBtZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgICByb290LkdPVlVLLmNvb2tpZSgnc2Vlbl9jb29raWVfbWVzc2FnZScsICd5ZXMnLCB7XG4gICAgICAgICAgICAgICAgZGF5czogMjhcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gYWRkIGNvb2tpZSBtZXNzYWdlXG4gICAgaWYgKHJvb3QuR09WVUsgJiYgcm9vdC5HT1ZVSy5hZGRDb29raWVNZXNzYWdlKSB7XG4gICAgICAgIHJvb3QuR09WVUsuYWRkQ29va2llTWVzc2FnZSgpXG4gICAgfVxufSkuY2FsbCh0aGlzKVxuIiwiLy8gVG9nZ2xlIGVsZW1lbnQgdmlzaWJpbGl0eVxudmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpO1xufTtcblxuLy8gTGlzdGVuIGZvciBjbGljayBldmVudHNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgLy8gTWFrZSBzdXJlIGNsaWNrZWQgZWxlbWVudCBpcyBvdXIgdG9nZ2xlXG4gIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9nZ2xlJykpIHJldHVybjtcblxuICAvLyBBZGQgaXMtdG9nZ2xlZCB0byBhbmNob3IgdG8gY2hhbmdlIGFycm93IGRpcmVjdGlvblxuICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdG9nZ2xlZCcpO1xuXG4gIC8vIFByZXZlbnQgZGVmYXVsdCBsaW5rIGJlaGF2aW9yXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgLy8gR2V0IHRoZSBjb250ZW50XG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihldmVudC50YXJnZXQuZGF0YXNldC50YXJnZXQpO1xuICBpZiAoIWNvbnRlbnQpIHJldHVybjtcblxuICAvLyBUb2dnbGUgdGhlIGNvbnRlbnRcbiAgdG9nZ2xlKGNvbnRlbnQpO1xuXG4gIC8vIFNldCBhaXJhIGV4cGFuZGVkIG9uIGNsaWNrZWQgZWxlbWVudFxuICBpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXZpc2libGUnKSkge1xuICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICB9XG59LCBmYWxzZSk7XG4iLCIvKiFcbiAqIHR5cGVhaGVhZC5qcyAwLjExLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2l0dGVyL3R5cGVhaGVhZC5qc1xuICogQ29weXJpZ2h0IDIwMTMtMjAxNSBUd2l0dGVyLCBJbmMuIGFuZCBvdGhlciBjb250cmlidXRvcnM7IExpY2Vuc2VkIE1JVFxuICovXG5cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ0eXBlYWhlYWQuanNcIiwgW1wianF1ZXJ5XCJdLCBmdW5jdGlvbiAoYTApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5KGEwKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImpxdWVyeVwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShqUXVlcnkpO1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIF8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNNc2llOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8obXNpZSB8cnY6KShcXGQrKC5cXGQrKT8pL2kpWzJdIDogZmFsc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNCbGFua1N0cmluZzogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiAhc3RyIHx8IC9eXFxzKiQvLnRlc3Qoc3RyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlc2NhcGVSZWdFeENoYXJzOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc051bWJlcjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQXJyYXk6ICQuaXNBcnJheSxcbiAgICAgICAgICAgIGlzRnVuY3Rpb246ICQuaXNGdW5jdGlvbixcbiAgICAgICAgICAgIGlzT2JqZWN0OiAkLmlzUGxhaW5PYmplY3QsXG4gICAgICAgICAgICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRWxlbWVudDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0pRdWVyeTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiAkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvU3RyOiBmdW5jdGlvbiB0b1N0cihzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNVbmRlZmluZWQocykgfHwgcyA9PT0gbnVsbCA/IFwiXCIgOiBzICsgXCJcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kOiAkLnByb3h5LFxuICAgICAgICAgICAgZWFjaDogZnVuY3Rpb24gKGNvbGxlY3Rpb24sIGNiKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKGNvbGxlY3Rpb24sIHJldmVyc2VBcmdzKTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJldmVyc2VBcmdzKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IodmFsdWUsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwOiAkLm1hcCxcbiAgICAgICAgICAgIGZpbHRlcjogJC5ncmVwLFxuICAgICAgICAgICAgZXZlcnk6IGZ1bmN0aW9uIChvYmosIHRlc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVzdWx0ID0gdGVzdC5jYWxsKG51bGwsIHZhbCwga2V5LCBvYmopKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhcmVzdWx0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNvbWU6IGZ1bmN0aW9uIChvYmosIHRlc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPSB0ZXN0LmNhbGwobnVsbCwgdmFsLCBrZXksIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaXhpbjogJC5leHRlbmQsXG4gICAgICAgICAgICBpZGVudGl0eTogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9uZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJZEdlbmVyYXRvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY291bnRlcisrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGlmeTogZnVuY3Rpb24gdGVtcGxhdGlmeShvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5pc0Z1bmN0aW9uKG9iaikgPyBvYmogOiB0ZW1wbGF0ZTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlZmVyOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWJvdW5jZTogZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lb3V0LCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVyLCBjYWxsTm93O1xuICAgICAgICAgICAgICAgICAgICBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRocm90dGxlOiBmdW5jdGlvbiAoZnVuYywgd2FpdCkge1xuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0LCBhcmdzLCB0aW1lb3V0LCByZXN1bHQsIHByZXZpb3VzLCBsYXRlcjtcbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICAgICAgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmlzU3RyaW5nKHZhbCkgPyB2YWwgOiBKU09OLnN0cmluZ2lmeSh2YWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vb3A6IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgIH07XG4gICAgfSgpO1xuICAgIHZhciBXV1cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgZGVmYXVsdENsYXNzTmFtZXMgPSB7XG4gICAgICAgICAgICB3cmFwcGVyOiBcInR3aXR0ZXItdHlwZWFoZWFkXCIsXG4gICAgICAgICAgICBpbnB1dDogXCJ0dC1pbnB1dFwiLFxuICAgICAgICAgICAgaGludDogXCJ0dC1oaW50XCIsXG4gICAgICAgICAgICBtZW51OiBcInR0LW1lbnVcIixcbiAgICAgICAgICAgIGRhdGFzZXQ6IFwidHQtZGF0YXNldFwiLFxuICAgICAgICAgICAgc3VnZ2VzdGlvbjogXCJ0dC1zdWdnZXN0aW9uXCIsXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiBcInR0LXNlbGVjdGFibGVcIixcbiAgICAgICAgICAgIGVtcHR5OiBcInR0LWVtcHR5XCIsXG4gICAgICAgICAgICBvcGVuOiBcInR0LW9wZW5cIixcbiAgICAgICAgICAgIGN1cnNvcjogXCJ0dC1jdXJzb3JcIixcbiAgICAgICAgICAgIGhpZ2hsaWdodDogXCJ0dC1oaWdobGlnaHRcIlxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYnVpbGQ7XG5cbiAgICAgICAgZnVuY3Rpb24gYnVpbGQobykge1xuICAgICAgICAgICAgdmFyIHd3dywgY2xhc3NlcztcbiAgICAgICAgICAgIGNsYXNzZXMgPSBfLm1peGluKHt9LCBkZWZhdWx0Q2xhc3NOYW1lcywgbyk7XG4gICAgICAgICAgICB3d3cgPSB7XG4gICAgICAgICAgICAgICAgY3NzOiBidWlsZENzcygpLFxuICAgICAgICAgICAgICAgIGNsYXNzZXM6IGNsYXNzZXMsXG4gICAgICAgICAgICAgICAgaHRtbDogYnVpbGRIdG1sKGNsYXNzZXMpLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yczogYnVpbGRTZWxlY3RvcnMoY2xhc3NlcylcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNzczogd3d3LmNzcyxcbiAgICAgICAgICAgICAgICBodG1sOiB3d3cuaHRtbCxcbiAgICAgICAgICAgICAgICBjbGFzc2VzOiB3d3cuY2xhc3NlcyxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcnM6IHd3dy5zZWxlY3RvcnMsXG4gICAgICAgICAgICAgICAgbWl4aW46IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICAgICAgICAgIF8ubWl4aW4obywgd3d3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYnVpbGRIdG1sKGMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3JhcHBlcjogJzxzcGFuIGNsYXNzPVwiJyArIGMud3JhcHBlciArICdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgICAgICBtZW51OiAnPGRpdiBjbGFzcz1cIicgKyBjLm1lbnUgKyAnXCI+PC9kaXY+J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkU2VsZWN0b3JzKGNsYXNzZXMpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcnMgPSB7fTtcbiAgICAgICAgICAgIF8uZWFjaChjbGFzc2VzLCBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yc1trXSA9IFwiLlwiICsgdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9ycztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkQ3NzKCkge1xuICAgICAgICAgICAgdmFyIGNzcyA9IHtcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhpbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFwiMVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiBcInRvcFwiLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5wdXRXaXRoTm9IaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IFwidG9wXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1lbnU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogXCIwXCIsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXCIxMDBcIixcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGx0cjoge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBcIjBcIixcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IFwiYXV0b1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBydGw6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogXCJhdXRvXCIsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBcIiAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKF8uaXNNc2llKCkpIHtcbiAgICAgICAgICAgICAgICBfLm1peGluKGNzcy5pbnB1dCwge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IFwidXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNylcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNzcztcbiAgICAgICAgfVxuICAgIH0oKTtcbiAgICB2YXIgRXZlbnRCdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgbmFtZXNwYWNlLCBkZXByZWNhdGlvbk1hcDtcbiAgICAgICAgbmFtZXNwYWNlID0gXCJ0eXBlYWhlYWQ6XCI7XG4gICAgICAgIGRlcHJlY2F0aW9uTWFwID0ge1xuICAgICAgICAgICAgcmVuZGVyOiBcInJlbmRlcmVkXCIsXG4gICAgICAgICAgICBjdXJzb3JjaGFuZ2U6IFwiY3Vyc29yY2hhbmdlZFwiLFxuICAgICAgICAgICAgc2VsZWN0OiBcInNlbGVjdGVkXCIsXG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IFwiYXV0b2NvbXBsZXRlZFwiXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRCdXMobykge1xuICAgICAgICAgICAgaWYgKCFvIHx8ICFvLmVsKSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcihcIkV2ZW50QnVzIGluaXRpYWxpemVkIHdpdGhvdXQgZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRlbCA9ICQoby5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgXy5taXhpbihFdmVudEJ1cy5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIF90cmlnZ2VyOiBmdW5jdGlvbiAodHlwZSwgYXJncykge1xuICAgICAgICAgICAgICAgIHZhciAkZTtcbiAgICAgICAgICAgICAgICAkZSA9ICQuRXZlbnQobmFtZXNwYWNlICsgdHlwZSk7XG4gICAgICAgICAgICAgICAgKGFyZ3MgPSBhcmdzIHx8IFtdKS51bnNoaWZ0KCRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC50cmlnZ2VyLmFwcGx5KHRoaXMuJGVsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVmb3JlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzLCAkZTtcbiAgICAgICAgICAgICAgICBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICRlID0gdGhpcy5fdHJpZ2dlcihcImJlZm9yZVwiICsgdHlwZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRlLmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlcHJlY2F0ZWRUeXBlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIodHlwZSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGVwcmVjYXRlZFR5cGUgPSBkZXByZWNhdGlvbk1hcFt0eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyKGRlcHJlY2F0ZWRUeXBlLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBFdmVudEJ1cztcbiAgICB9KCk7XG4gICAgdmFyIEV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBzcGxpdHRlciA9IC9cXHMrLyxcbiAgICAgICAgICAgIG5leHRUaWNrID0gZ2V0TmV4dFRpY2soKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uU3luYzogb25TeW5jLFxuICAgICAgICAgICAgb25Bc3luYzogb25Bc3luYyxcbiAgICAgICAgICAgIG9mZjogb2ZmLFxuICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlclxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uKG1ldGhvZCwgdHlwZXMsIGNiLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgdHlwZTtcbiAgICAgICAgICAgIGlmICghY2IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHR5cGVzID0gdHlwZXMuc3BsaXQoc3BsaXR0ZXIpO1xuICAgICAgICAgICAgY2IgPSBjb250ZXh0ID8gYmluZENvbnRleHQoY2IsIGNvbnRleHQpIDogY2I7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICAgICAgICAgICB3aGlsZSAodHlwZSA9IHR5cGVzLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja3NbdHlwZV0gPSB0aGlzLl9jYWxsYmFja3NbdHlwZV0gfHwge1xuICAgICAgICAgICAgICAgICAgICBzeW5jOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja3NbdHlwZV1bbWV0aG9kXS5wdXNoKGNiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25Bc3luYyh0eXBlcywgY2IsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvbi5jYWxsKHRoaXMsIFwiYXN5bmNcIiwgdHlwZXMsIGNiLCBjb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3luYyh0eXBlcywgY2IsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvbi5jYWxsKHRoaXMsIFwic3luY1wiLCB0eXBlcywgY2IsIGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2ZmKHR5cGVzKSB7XG4gICAgICAgICAgICB2YXIgdHlwZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eXBlcyA9IHR5cGVzLnNwbGl0KHNwbGl0dGVyKTtcbiAgICAgICAgICAgIHdoaWxlICh0eXBlID0gdHlwZXMuc2hpZnQoKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbdHlwZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyaWdnZXIodHlwZXMpIHtcbiAgICAgICAgICAgIHZhciB0eXBlLCBjYWxsYmFja3MsIGFyZ3MsIHN5bmNGbHVzaCwgYXN5bmNGbHVzaDtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eXBlcyA9IHR5cGVzLnNwbGl0KHNwbGl0dGVyKTtcbiAgICAgICAgICAgIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICB3aGlsZSAoKHR5cGUgPSB0eXBlcy5zaGlmdCgpKSAmJiAoY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW3R5cGVdKSkge1xuICAgICAgICAgICAgICAgIHN5bmNGbHVzaCA9IGdldEZsdXNoKGNhbGxiYWNrcy5zeW5jLCB0aGlzLCBbdHlwZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICBhc3luY0ZsdXNoID0gZ2V0Rmx1c2goY2FsbGJhY2tzLmFzeW5jLCB0aGlzLCBbdHlwZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICBzeW5jRmx1c2goKSAmJiBuZXh0VGljayhhc3luY0ZsdXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Rmx1c2goY2FsbGJhY2tzLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmx1c2g7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgICAgICAgICAgICAgIHZhciBjYW5jZWxsZWQ7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7ICFjYW5jZWxsZWQgJiYgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGxlZCA9IGNhbGxiYWNrc1tpXS5hcHBseShjb250ZXh0LCBhcmdzKSA9PT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhY2FuY2VsbGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmV4dFRpY2soKSB7XG4gICAgICAgICAgICB2YXIgbmV4dFRpY2tGbjtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgbmV4dFRpY2tGbiA9IGZ1bmN0aW9uIG5leHRUaWNrU2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0VGlja0ZuID0gZnVuY3Rpb24gbmV4dFRpY2tTZXRUaW1lb3V0KGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0VGlja0ZuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYmluZENvbnRleHQoZm4sIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5iaW5kID8gZm4uYmluZChjb250ZXh0KSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmbi5hcHBseShjb250ZXh0LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0oKTtcbiAgICB2YXIgaGlnaGxpZ2h0ID0gZnVuY3Rpb24gKGRvYykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgbm9kZTogbnVsbCxcbiAgICAgICAgICAgIHBhdHRlcm46IG51bGwsXG4gICAgICAgICAgICB0YWdOYW1lOiBcInN0cm9uZ1wiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgICAgICAgd29yZHNPbmx5OiBmYWxzZSxcbiAgICAgICAgICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBoaWdodGxpZ2h0KG8pIHtcbiAgICAgICAgICAgIHZhciByZWdleDtcbiAgICAgICAgICAgIG8gPSBfLm1peGluKHt9LCBkZWZhdWx0cywgbyk7XG4gICAgICAgICAgICBpZiAoIW8ubm9kZSB8fCAhby5wYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgby5wYXR0ZXJuID0gXy5pc0FycmF5KG8ucGF0dGVybikgPyBvLnBhdHRlcm4gOiBbby5wYXR0ZXJuXTtcbiAgICAgICAgICAgIHJlZ2V4ID0gZ2V0UmVnZXgoby5wYXR0ZXJuLCBvLmNhc2VTZW5zaXRpdmUsIG8ud29yZHNPbmx5KTtcbiAgICAgICAgICAgIHRyYXZlcnNlKG8ubm9kZSwgaGlnaHRsaWdodFRleHROb2RlKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gaGlnaHRsaWdodFRleHROb2RlKHRleHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoLCBwYXR0ZXJuTm9kZSwgd3JhcHBlck5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoID0gcmVnZXguZXhlYyh0ZXh0Tm9kZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50KG8udGFnTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uY2xhc3NOYW1lICYmICh3cmFwcGVyTm9kZS5jbGFzc05hbWUgPSBvLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm5Ob2RlID0gdGV4dE5vZGUuc3BsaXRUZXh0KG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybk5vZGUuc3BsaXRUZXh0KG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXJOb2RlLmFwcGVuZENoaWxkKHBhdHRlcm5Ob2RlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHdyYXBwZXJOb2RlLCBwYXR0ZXJuTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIW1hdGNoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZShlbCwgaGlnaHRsaWdodFRleHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSwgVEVYVF9OT0RFX1RZUEUgPSAzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBlbC5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBURVhUX05PREVfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBoaWdodGxpZ2h0VGV4dE5vZGUoY2hpbGROb2RlKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVyc2UoY2hpbGROb2RlLCBoaWdodGxpZ2h0VGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlZ2V4KHBhdHRlcm5zLCBjYXNlU2Vuc2l0aXZlLCB3b3Jkc09ubHkpIHtcbiAgICAgICAgICAgIHZhciBlc2NhcGVkUGF0dGVybnMgPSBbXSxcbiAgICAgICAgICAgICAgICByZWdleFN0cjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYXR0ZXJucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGVzY2FwZWRQYXR0ZXJucy5wdXNoKF8uZXNjYXBlUmVnRXhDaGFycyhwYXR0ZXJuc1tpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnZXhTdHIgPSB3b3Jkc09ubHkgPyBcIlxcXFxiKFwiICsgZXNjYXBlZFBhdHRlcm5zLmpvaW4oXCJ8XCIpICsgXCIpXFxcXGJcIiA6IFwiKFwiICsgZXNjYXBlZFBhdHRlcm5zLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gICAgICAgICAgICByZXR1cm4gY2FzZVNlbnNpdGl2ZSA/IG5ldyBSZWdFeHAocmVnZXhTdHIpIDogbmV3IFJlZ0V4cChyZWdleFN0ciwgXCJpXCIpO1xuICAgICAgICB9XG4gICAgfSh3aW5kb3cuZG9jdW1lbnQpO1xuICAgIHZhciBJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBzcGVjaWFsS2V5Q29kZU1hcDtcbiAgICAgICAgc3BlY2lhbEtleUNvZGVNYXAgPSB7XG4gICAgICAgICAgICA5OiBcInRhYlwiLFxuICAgICAgICAgICAgMjc6IFwiZXNjXCIsXG4gICAgICAgICAgICAzNzogXCJsZWZ0XCIsXG4gICAgICAgICAgICAzOTogXCJyaWdodFwiLFxuICAgICAgICAgICAgMTM6IFwiZW50ZXJcIixcbiAgICAgICAgICAgIDM4OiBcInVwXCIsXG4gICAgICAgICAgICA0MDogXCJkb3duXCJcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBJbnB1dChvLCB3d3cpIHtcbiAgICAgICAgICAgIG8gPSBvIHx8IHt9O1xuICAgICAgICAgICAgaWYgKCFvLmlucHV0KSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcihcImlucHV0IGlzIG1pc3NpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3d3cubWl4aW4odGhpcyk7XG4gICAgICAgICAgICB0aGlzLiRoaW50ID0gJChvLmhpbnQpO1xuICAgICAgICAgICAgdGhpcy4kaW5wdXQgPSAkKG8uaW5wdXQpO1xuICAgICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGlucHV0LnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5xdWVyeVdoZW5Gb2N1c2VkID0gdGhpcy5oYXNGb2N1cygpID8gdGhpcy5xdWVyeSA6IG51bGw7XG4gICAgICAgICAgICB0aGlzLiRvdmVyZmxvd0hlbHBlciA9IGJ1aWxkT3ZlcmZsb3dIZWxwZXIodGhpcy4kaW5wdXQpO1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tMYW5ndWFnZURpcmVjdGlvbigpO1xuICAgICAgICAgICAgaWYgKHRoaXMuJGhpbnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIaW50ID0gdGhpcy5nZXRIaW50ID0gdGhpcy5jbGVhckhpbnQgPSB0aGlzLmNsZWFySGludElmSW52YWxpZCA9IF8ubm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBJbnB1dC5ub3JtYWxpemVRdWVyeSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnRvU3RyKHN0cikucmVwbGFjZSgvXlxccyovZywgXCJcIikucmVwbGFjZSgvXFxzezIsfS9nLCBcIiBcIik7XG4gICAgICAgIH07XG4gICAgICAgIF8ubWl4aW4oSW5wdXQucHJvdG90eXBlLCBFdmVudEVtaXR0ZXIsIHtcbiAgICAgICAgICAgIF9vbkJsdXI6IGZ1bmN0aW9uIG9uQmx1cigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0SW5wdXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcImJsdXJyZWRcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uRm9jdXM6IGZ1bmN0aW9uIG9uRm9jdXMoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeVdoZW5Gb2N1c2VkID0gdGhpcy5xdWVyeTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoXCJmb2N1c2VkXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbktleWRvd246IGZ1bmN0aW9uIG9uS2V5ZG93bigkZSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXlOYW1lID0gc3BlY2lhbEtleUNvZGVNYXBbJGUud2hpY2ggfHwgJGUua2V5Q29kZV07XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFuYWdlUHJldmVudERlZmF1bHQoa2V5TmFtZSwgJGUpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlOYW1lICYmIHRoaXMuX3Nob3VsZFRyaWdnZXIoa2V5TmFtZSwgJGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihrZXlOYW1lICsgXCJLZXllZFwiLCAkZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbklucHV0OiBmdW5jdGlvbiBvbklucHV0KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldFF1ZXJ5KHRoaXMuZ2V0SW5wdXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFySGludElmSW52YWxpZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrTGFuZ3VhZ2VEaXJlY3Rpb24oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfbWFuYWdlUHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uIG1hbmFnZVByZXZlbnREZWZhdWx0KGtleU5hbWUsICRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZlbnREZWZhdWx0O1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0ID0gIXdpdGhNb2RpZmllcigkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQgJiYgJGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfc2hvdWxkVHJpZ2dlcjogZnVuY3Rpb24gc2hvdWxkVHJpZ2dlcihrZXlOYW1lLCAkZSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmlnZ2VyO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidGFiXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyID0gIXdpdGhNb2RpZmllcigkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9jaGVja0xhbmd1YWdlRGlyZWN0aW9uOiBmdW5jdGlvbiBjaGVja0xhbmd1YWdlRGlyZWN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIgPSAodGhpcy4kaW5wdXQuY3NzKFwiZGlyZWN0aW9uXCIpIHx8IFwibHRyXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyICE9PSBkaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXIgPSBkaXI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGhpbnQuYXR0cihcImRpclwiLCBkaXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoXCJsYW5nRGlyQ2hhbmdlZFwiLCBkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfc2V0UXVlcnk6IGZ1bmN0aW9uIHNldFF1ZXJ5KHZhbCwgc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZUVxdWl2YWxlbnQsIGhhc0RpZmZlcmVudFdoaXRlc3BhY2U7XG4gICAgICAgICAgICAgICAgYXJlRXF1aXZhbGVudCA9IGFyZVF1ZXJpZXNFcXVpdmFsZW50KHZhbCwgdGhpcy5xdWVyeSk7XG4gICAgICAgICAgICAgICAgaGFzRGlmZmVyZW50V2hpdGVzcGFjZSA9IGFyZUVxdWl2YWxlbnQgPyB0aGlzLnF1ZXJ5Lmxlbmd0aCAhPT0gdmFsLmxlbmd0aCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMucXVlcnkgPSB2YWw7XG4gICAgICAgICAgICAgICAgaWYgKCFzaWxlbnQgJiYgIWFyZUVxdWl2YWxlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwicXVlcnlDaGFuZ2VkXCIsIHRoaXMucXVlcnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNpbGVudCAmJiBoYXNEaWZmZXJlbnRXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcIndoaXRlc3BhY2VDaGFuZ2VkXCIsIHRoaXMucXVlcnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBvbkJsdXIsIG9uRm9jdXMsIG9uS2V5ZG93biwgb25JbnB1dDtcbiAgICAgICAgICAgICAgICBvbkJsdXIgPSBfLmJpbmQodGhpcy5fb25CbHVyLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBvbkZvY3VzID0gXy5iaW5kKHRoaXMuX29uRm9jdXMsIHRoaXMpO1xuICAgICAgICAgICAgICAgIG9uS2V5ZG93biA9IF8uYmluZCh0aGlzLl9vbktleWRvd24sIHRoaXMpO1xuICAgICAgICAgICAgICAgIG9uSW5wdXQgPSBfLmJpbmQodGhpcy5fb25JbnB1dCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQub24oXCJibHVyLnR0XCIsIG9uQmx1cikub24oXCJmb2N1cy50dFwiLCBvbkZvY3VzKS5vbihcImtleWRvd24udHRcIiwgb25LZXlkb3duKTtcbiAgICAgICAgICAgICAgICBpZiAoIV8uaXNNc2llKCkgfHwgXy5pc01zaWUoKSA+IDkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQub24oXCJpbnB1dC50dFwiLCBvbklucHV0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRpbnB1dC5vbihcImtleWRvd24udHQga2V5cHJlc3MudHQgY3V0LnR0IHBhc3RlLnR0XCIsIGZ1bmN0aW9uICgkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwZWNpYWxLZXlDb2RlTWFwWyRlLndoaWNoIHx8ICRlLmtleUNvZGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWZlcihfLmJpbmQodGhhdC5fb25JbnB1dCwgdGhhdCwgJGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRpbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJsdXI6IGZ1bmN0aW9uIGJsdXIoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQuYmx1cigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldExhbmdEaXI6IGZ1bmN0aW9uIGdldExhbmdEaXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFF1ZXJ5OiBmdW5jdGlvbiBnZXRRdWVyeSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVyeSB8fCBcIlwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldFF1ZXJ5OiBmdW5jdGlvbiBzZXRRdWVyeSh2YWwsIHNpbGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWx1ZSh2YWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldFF1ZXJ5KHZhbCwgc2lsZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYXNRdWVyeUNoYW5nZWRTaW5jZUxhc3RGb2N1czogZnVuY3Rpb24gaGFzUXVlcnlDaGFuZ2VkU2luY2VMYXN0Rm9jdXMoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlcnkgIT09IHRoaXMucXVlcnlXaGVuRm9jdXNlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbiBnZXRJbnB1dFZhbHVlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRJbnB1dFZhbHVlOiBmdW5jdGlvbiBzZXRJbnB1dFZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFySGludElmSW52YWxpZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrTGFuZ3VhZ2VEaXJlY3Rpb24oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNldElucHV0VmFsdWU6IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGhpcy5xdWVyeSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0SGludDogZnVuY3Rpb24gZ2V0SGludCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kaGludC52YWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRIaW50OiBmdW5jdGlvbiBzZXRIaW50KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kaGludC52YWwodmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFySGludDogZnVuY3Rpb24gY2xlYXJIaW50KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SGludChcIlwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGVhckhpbnRJZkludmFsaWQ6IGZ1bmN0aW9uIGNsZWFySGludElmSW52YWxpZCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsLCBoaW50LCB2YWxJc1ByZWZpeE9mSGludCwgaXNWYWxpZDtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmdldElucHV0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBoaW50ID0gdGhpcy5nZXRIaW50KCk7XG4gICAgICAgICAgICAgICAgdmFsSXNQcmVmaXhPZkhpbnQgPSB2YWwgIT09IGhpbnQgJiYgaGludC5pbmRleE9mKHZhbCkgPT09IDA7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHZhbCAhPT0gXCJcIiAmJiB2YWxJc1ByZWZpeE9mSGludCAmJiAhdGhpcy5oYXNPdmVyZmxvdygpO1xuICAgICAgICAgICAgICAgICFpc1ZhbGlkICYmIHRoaXMuY2xlYXJIaW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzRm9jdXM6IGZ1bmN0aW9uIGhhc0ZvY3VzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRpbnB1dC5pcyhcIjpmb2N1c1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYXNPdmVyZmxvdzogZnVuY3Rpb24gaGFzT3ZlcmZsb3coKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnN0cmFpbnQgPSB0aGlzLiRpbnB1dC53aWR0aCgpIC0gMjtcbiAgICAgICAgICAgICAgICB0aGlzLiRvdmVyZmxvd0hlbHBlci50ZXh0KHRoaXMuZ2V0SW5wdXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kb3ZlcmZsb3dIZWxwZXIud2lkdGgoKSA+PSBjb25zdHJhaW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQ3Vyc29yQXRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVMZW5ndGgsIHNlbGVjdGlvblN0YXJ0LCByYW5nZTtcbiAgICAgICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IHRoaXMuJGlucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHRoaXMuJGlucHV0WzBdLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIGlmIChfLmlzTnVtYmVyKHNlbGVjdGlvblN0YXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0aW9uU3RhcnQgPT09IHZhbHVlTGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCAtdmFsdWVMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVMZW5ndGggPT09IHJhbmdlLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGhpbnQub2ZmKFwiLnR0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGlucHV0Lm9mZihcIi50dFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRvdmVyZmxvd0hlbHBlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRoaW50ID0gdGhpcy4kaW5wdXQgPSB0aGlzLiRvdmVyZmxvd0hlbHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBJbnB1dDtcblxuICAgICAgICBmdW5jdGlvbiBidWlsZE92ZXJmbG93SGVscGVyKCRpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJzxwcmUgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9wcmU+JykuY3NzKHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogXCJwcmVcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAkaW5wdXQuY3NzKFwiZm9udC1mYW1pbHlcIiksXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICRpbnB1dC5jc3MoXCJmb250LXNpemVcIiksXG4gICAgICAgICAgICAgICAgZm9udFN0eWxlOiAkaW5wdXQuY3NzKFwiZm9udC1zdHlsZVwiKSxcbiAgICAgICAgICAgICAgICBmb250VmFyaWFudDogJGlucHV0LmNzcyhcImZvbnQtdmFyaWFudFwiKSxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAkaW5wdXQuY3NzKFwiZm9udC13ZWlnaHRcIiksXG4gICAgICAgICAgICAgICAgd29yZFNwYWNpbmc6ICRpbnB1dC5jc3MoXCJ3b3JkLXNwYWNpbmdcIiksXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJGlucHV0LmNzcyhcImxldHRlci1zcGFjaW5nXCIpLFxuICAgICAgICAgICAgICAgIHRleHRJbmRlbnQ6ICRpbnB1dC5jc3MoXCJ0ZXh0LWluZGVudFwiKSxcbiAgICAgICAgICAgICAgICB0ZXh0UmVuZGVyaW5nOiAkaW5wdXQuY3NzKFwidGV4dC1yZW5kZXJpbmdcIiksXG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJGlucHV0LmNzcyhcInRleHQtdHJhbnNmb3JtXCIpXG4gICAgICAgICAgICB9KS5pbnNlcnRBZnRlcigkaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXJlUXVlcmllc0VxdWl2YWxlbnQoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIElucHV0Lm5vcm1hbGl6ZVF1ZXJ5KGEpID09PSBJbnB1dC5ub3JtYWxpemVRdWVyeShiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdpdGhNb2RpZmllcigkZSkge1xuICAgICAgICAgICAgcmV0dXJuICRlLmFsdEtleSB8fCAkZS5jdHJsS2V5IHx8ICRlLm1ldGFLZXkgfHwgJGUuc2hpZnRLZXk7XG4gICAgICAgIH1cbiAgICB9KCk7XG4gICAgdmFyIERhdGFzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIga2V5cywgbmFtZUdlbmVyYXRvcjtcbiAgICAgICAga2V5cyA9IHtcbiAgICAgICAgICAgIHZhbDogXCJ0dC1zZWxlY3RhYmxlLWRpc3BsYXlcIixcbiAgICAgICAgICAgIG9iajogXCJ0dC1zZWxlY3RhYmxlLW9iamVjdFwiXG4gICAgICAgIH07XG4gICAgICAgIG5hbWVHZW5lcmF0b3IgPSBfLmdldElkR2VuZXJhdG9yKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gRGF0YXNldChvLCB3d3cpIHtcbiAgICAgICAgICAgIG8gPSBvIHx8IHt9O1xuICAgICAgICAgICAgby50ZW1wbGF0ZXMgPSBvLnRlbXBsYXRlcyB8fCB7fTtcbiAgICAgICAgICAgIG8udGVtcGxhdGVzLm5vdEZvdW5kID0gby50ZW1wbGF0ZXMubm90Rm91bmQgfHwgby50ZW1wbGF0ZXMuZW1wdHk7XG4gICAgICAgICAgICBpZiAoIW8uc291cmNlKSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcihcIm1pc3Npbmcgc291cmNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAkLmVycm9yKFwibWlzc2luZyBub2RlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG8ubmFtZSAmJiAhaXNWYWxpZE5hbWUoby5uYW1lKSkge1xuICAgICAgICAgICAgICAgICQuZXJyb3IoXCJpbnZhbGlkIGRhdGFzZXQgbmFtZTogXCIgKyBvLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd3d3Lm1peGluKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHQgPSAhIW8uaGlnaGxpZ2h0O1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gby5uYW1lIHx8IG5hbWVHZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIHRoaXMubGltaXQgPSBvLmxpbWl0IHx8IDU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlGbiA9IGdldERpc3BsYXlGbihvLmRpc3BsYXkgfHwgby5kaXNwbGF5S2V5KTtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzID0gZ2V0VGVtcGxhdGVzKG8udGVtcGxhdGVzLCB0aGlzLmRpc3BsYXlGbik7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IG8uc291cmNlLl9fdHRBZGFwdGVyID8gby5zb3VyY2UuX190dEFkYXB0ZXIoKSA6IG8uc291cmNlO1xuICAgICAgICAgICAgdGhpcy5hc3luYyA9IF8uaXNVbmRlZmluZWQoby5hc3luYykgPyB0aGlzLnNvdXJjZS5sZW5ndGggPiAyIDogISFvLmFzeW5jO1xuICAgICAgICAgICAgdGhpcy5fcmVzZXRMYXN0U3VnZ2VzdGlvbigpO1xuICAgICAgICAgICAgdGhpcy4kZWwgPSAkKG8ubm9kZSkuYWRkQ2xhc3ModGhpcy5jbGFzc2VzLmRhdGFzZXQpLmFkZENsYXNzKHRoaXMuY2xhc3Nlcy5kYXRhc2V0ICsgXCItXCIgKyB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIERhdGFzZXQuZXh0cmFjdERhdGEgPSBmdW5jdGlvbiBleHRyYWN0RGF0YShlbCkge1xuICAgICAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICAgICAgaWYgKCRlbC5kYXRhKGtleXMub2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbDogJGVsLmRhdGEoa2V5cy52YWwpIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIG9iajogJGVsLmRhdGEoa2V5cy5vYmopIHx8IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIF8ubWl4aW4oRGF0YXNldC5wcm90b3R5cGUsIEV2ZW50RW1pdHRlciwge1xuICAgICAgICAgICAgX292ZXJ3cml0ZTogZnVuY3Rpb24gb3ZlcndyaXRlKHF1ZXJ5LCBzdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnMgfHwgW107XG4gICAgICAgICAgICAgICAgaWYgKHN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJTdWdnZXN0aW9ucyhxdWVyeSwgc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5hc3luYyAmJiB0aGlzLnRlbXBsYXRlcy5wZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlclBlbmRpbmcocXVlcnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuYXN5bmMgJiYgdGhpcy50ZW1wbGF0ZXMubm90Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyTm90Rm91bmQocXVlcnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcInJlbmRlcmVkXCIsIHRoaXMubmFtZSwgc3VnZ2VzdGlvbnMsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfYXBwZW5kOiBmdW5jdGlvbiBhcHBlbmQocXVlcnksIHN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucyB8fCBbXTtcbiAgICAgICAgICAgICAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoICYmIHRoaXMuJGxhc3RTdWdnZXN0aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBlbmRTdWdnZXN0aW9ucyhxdWVyeSwgc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlclN1Z2dlc3Rpb25zKHF1ZXJ5LCBzdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy4kbGFzdFN1Z2dlc3Rpb24ubGVuZ3RoICYmIHRoaXMudGVtcGxhdGVzLm5vdEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlck5vdEZvdW5kKHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwicmVuZGVyZWRcIiwgdGhpcy5uYW1lLCBzdWdnZXN0aW9ucywgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3JlbmRlclN1Z2dlc3Rpb25zOiBmdW5jdGlvbiByZW5kZXJTdWdnZXN0aW9ucyhxdWVyeSwgc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGZyYWdtZW50O1xuICAgICAgICAgICAgICAgICRmcmFnbWVudCA9IHRoaXMuX2dldFN1Z2dlc3Rpb25zRnJhZ21lbnQocXVlcnksIHN1Z2dlc3Rpb25zKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRsYXN0U3VnZ2VzdGlvbiA9ICRmcmFnbWVudC5jaGlsZHJlbigpLmxhc3QoKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5odG1sKCRmcmFnbWVudCkucHJlcGVuZCh0aGlzLl9nZXRIZWFkZXIocXVlcnksIHN1Z2dlc3Rpb25zKSkuYXBwZW5kKHRoaXMuX2dldEZvb3RlcihxdWVyeSwgc3VnZ2VzdGlvbnMpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfYXBwZW5kU3VnZ2VzdGlvbnM6IGZ1bmN0aW9uIGFwcGVuZFN1Z2dlc3Rpb25zKHF1ZXJ5LCBzdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciAkZnJhZ21lbnQsICRsYXN0U3VnZ2VzdGlvbjtcbiAgICAgICAgICAgICAgICAkZnJhZ21lbnQgPSB0aGlzLl9nZXRTdWdnZXN0aW9uc0ZyYWdtZW50KHF1ZXJ5LCBzdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICAgICAgJGxhc3RTdWdnZXN0aW9uID0gJGZyYWdtZW50LmNoaWxkcmVuKCkubGFzdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGxhc3RTdWdnZXN0aW9uLmFmdGVyKCRmcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy4kbGFzdFN1Z2dlc3Rpb24gPSAkbGFzdFN1Z2dlc3Rpb247XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3JlbmRlclBlbmRpbmc6IGZ1bmN0aW9uIHJlbmRlclBlbmRpbmcocXVlcnkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlcy5wZW5kaW5nO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0TGFzdFN1Z2dlc3Rpb24oKTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSAmJiB0aGlzLiRlbC5odG1sKHRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0OiB0aGlzLm5hbWVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3JlbmRlck5vdEZvdW5kOiBmdW5jdGlvbiByZW5kZXJOb3RGb3VuZChxdWVyeSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVzLm5vdEZvdW5kO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0TGFzdFN1Z2dlc3Rpb24oKTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSAmJiB0aGlzLiRlbC5odG1sKHRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0OiB0aGlzLm5hbWVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX2VtcHR5OiBmdW5jdGlvbiBlbXB0eSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0TGFzdFN1Z2dlc3Rpb24oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfZ2V0U3VnZ2VzdGlvbnNGcmFnbWVudDogZnVuY3Rpb24gZ2V0U3VnZ2VzdGlvbnNGcmFnbWVudChxdWVyeSwgc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50O1xuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgICAgIF8uZWFjaChzdWdnZXN0aW9ucywgZnVuY3Rpb24gZ2V0U3VnZ2VzdGlvbk5vZGUoc3VnZ2VzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGVsLCBjb250ZXh0O1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhhdC5faW5qZWN0UXVlcnkocXVlcnksIHN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAkZWwgPSAkKHRoYXQudGVtcGxhdGVzLnN1Z2dlc3Rpb24oY29udGV4dCkpLmRhdGEoa2V5cy5vYmosIHN1Z2dlc3Rpb24pLmRhdGEoa2V5cy52YWwsIHRoYXQuZGlzcGxheUZuKHN1Z2dlc3Rpb24pKS5hZGRDbGFzcyh0aGF0LmNsYXNzZXMuc3VnZ2VzdGlvbiArIFwiIFwiICsgdGhhdC5jbGFzc2VzLnNlbGVjdGFibGUpO1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgkZWxbMF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ICYmIGhpZ2hsaWdodCh7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc2VzLmhpZ2hsaWdodCxcbiAgICAgICAgICAgICAgICAgICAgbm9kZTogZnJhZ21lbnQsXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IHF1ZXJ5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoZnJhZ21lbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9nZXRGb290ZXI6IGZ1bmN0aW9uIGdldEZvb3RlcihxdWVyeSwgc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXMuZm9vdGVyID8gdGhpcy50ZW1wbGF0ZXMuZm9vdGVyKHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uczogc3VnZ2VzdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFzZXQ6IHRoaXMubmFtZVxuICAgICAgICAgICAgICAgIH0pIDogbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfZ2V0SGVhZGVyOiBmdW5jdGlvbiBnZXRIZWFkZXIocXVlcnksIHN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzLmhlYWRlciA/IHRoaXMudGVtcGxhdGVzLmhlYWRlcih7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnM6IHN1Z2dlc3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0OiB0aGlzLm5hbWVcbiAgICAgICAgICAgICAgICB9KSA6IG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3Jlc2V0TGFzdFN1Z2dlc3Rpb246IGZ1bmN0aW9uIHJlc2V0TGFzdFN1Z2dlc3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kbGFzdFN1Z2dlc3Rpb24gPSAkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX2luamVjdFF1ZXJ5OiBmdW5jdGlvbiBpbmplY3RRdWVyeShxdWVyeSwgb2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNPYmplY3Qob2JqKSA/IF8ubWl4aW4oe1xuICAgICAgICAgICAgICAgICAgICBfcXVlcnk6IHF1ZXJ5XG4gICAgICAgICAgICAgICAgfSwgb2JqKSA6IG9iajtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShxdWVyeSkge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3luY0NhbGxlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNhbmNlbCA9ICQubm9vcDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5hc3luYyAmJiB0aGF0LnRyaWdnZXIoXCJhc3luY0NhbmNlbGVkXCIsIHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlKHF1ZXJ5LCBzeW5jLCBhc3luYyk7XG4gICAgICAgICAgICAgICAgIXN5bmNDYWxsZWQgJiYgc3luYyhbXSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzeW5jKHN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeW5jQ2FsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3luY0NhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zID0gKHN1Z2dlc3Rpb25zIHx8IFtdKS5zbGljZSgwLCB0aGF0LmxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBzdWdnZXN0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX292ZXJ3cml0ZShxdWVyeSwgc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWQgPCB0aGF0LmxpbWl0ICYmIHRoYXQuYXN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudHJpZ2dlcihcImFzeW5jUmVxdWVzdGVkXCIsIHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFzeW5jIChzdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhbmNlbGVkICYmIHJlbmRlcmVkIDwgdGhhdC5saW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jYW5jZWwgPSAkLm5vb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlZCArPSBzdWdnZXN0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9hcHBlbmQocXVlcnksIHN1Z2dlc3Rpb25zLnNsaWNlKDAsIHRoYXQubGltaXQgLSByZW5kZXJlZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5hc3luYyAmJiB0aGF0LnRyaWdnZXIoXCJhc3luY1JlY2VpdmVkXCIsIHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYW5jZWw6ICQubm9vcCxcbiAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbXB0eSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwiY2xlYXJlZFwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0VtcHR5OiBmdW5jdGlvbiBpc0VtcHR5KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5pcyhcIjplbXB0eVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsID0gJChcIjxkaXY+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIERhdGFzZXQ7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGlzcGxheUZuKGRpc3BsYXkpIHtcbiAgICAgICAgICAgIGRpc3BsYXkgPSBkaXNwbGF5IHx8IF8uc3RyaW5naWZ5O1xuICAgICAgICAgICAgcmV0dXJuIF8uaXNGdW5jdGlvbihkaXNwbGF5KSA/IGRpc3BsYXkgOiBkaXNwbGF5Rm47XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlGbihvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqW2Rpc3BsYXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzKHRlbXBsYXRlcywgZGlzcGxheUZuKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vdEZvdW5kOiB0ZW1wbGF0ZXMubm90Rm91bmQgJiYgXy50ZW1wbGF0aWZ5KHRlbXBsYXRlcy5ub3RGb3VuZCksXG4gICAgICAgICAgICAgICAgcGVuZGluZzogdGVtcGxhdGVzLnBlbmRpbmcgJiYgXy50ZW1wbGF0aWZ5KHRlbXBsYXRlcy5wZW5kaW5nKSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHRlbXBsYXRlcy5oZWFkZXIgJiYgXy50ZW1wbGF0aWZ5KHRlbXBsYXRlcy5oZWFkZXIpLFxuICAgICAgICAgICAgICAgIGZvb3RlcjogdGVtcGxhdGVzLmZvb3RlciAmJiBfLnRlbXBsYXRpZnkodGVtcGxhdGVzLmZvb3RlciksXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbjogdGVtcGxhdGVzLnN1Z2dlc3Rpb24gfHwgc3VnZ2VzdGlvblRlbXBsYXRlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWdnZXN0aW9uVGVtcGxhdGUoY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkKFwiPGRpdj5cIikudGV4dChkaXNwbGF5Rm4oY29udGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNWYWxpZE5hbWUoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gL15bX2EtekEtWjAtOS1dKyQvLnRlc3Qoc3RyKTtcbiAgICAgICAgfVxuICAgIH0oKTtcbiAgICB2YXIgTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgZnVuY3Rpb24gTWVudShvLCB3d3cpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIG8gPSBvIHx8IHt9O1xuICAgICAgICAgICAgaWYgKCFvLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAkLmVycm9yKFwibm9kZSBpcyByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHd3dy5taXhpbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuJG5vZGUgPSAkKG8ubm9kZSk7XG4gICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZGF0YXNldHMgPSBfLm1hcChvLmRhdGFzZXRzLCBpbml0aWFsaXplRGF0YXNldCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVEYXRhc2V0KG9EYXRhc2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGF0LiRub2RlLmZpbmQob0RhdGFzZXQubm9kZSkuZmlyc3QoKTtcbiAgICAgICAgICAgICAgICBvRGF0YXNldC5ub2RlID0gbm9kZS5sZW5ndGggPyBub2RlIDogJChcIjxkaXY+XCIpLmFwcGVuZFRvKHRoYXQuJG5vZGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YXNldChvRGF0YXNldCwgd3d3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfLm1peGluKE1lbnUucHJvdG90eXBlLCBFdmVudEVtaXR0ZXIsIHtcbiAgICAgICAgICAgIF9vblNlbGVjdGFibGVDbGljazogZnVuY3Rpb24gb25TZWxlY3RhYmxlQ2xpY2soJGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoXCJzZWxlY3RhYmxlQ2xpY2tlZFwiLCAkKCRlLmN1cnJlbnRUYXJnZXQpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25SZW5kZXJlZDogZnVuY3Rpb24gb25SZW5kZXJlZCh0eXBlLCBkYXRhc2V0LCBzdWdnZXN0aW9ucywgYXN5bmMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRub2RlLnRvZ2dsZUNsYXNzKHRoaXMuY2xhc3Nlcy5lbXB0eSwgdGhpcy5fYWxsRGF0YXNldHNFbXB0eSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoXCJkYXRhc2V0UmVuZGVyZWRcIiwgZGF0YXNldCwgc3VnZ2VzdGlvbnMsIGFzeW5jKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25DbGVhcmVkOiBmdW5jdGlvbiBvbkNsZWFyZWQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kbm9kZS50b2dnbGVDbGFzcyh0aGlzLmNsYXNzZXMuZW1wdHksIHRoaXMuX2FsbERhdGFzZXRzRW1wdHkoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwiZGF0YXNldENsZWFyZWRcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3Byb3BhZ2F0ZTogZnVuY3Rpb24gcHJvcGFnYXRlKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9hbGxEYXRhc2V0c0VtcHR5OiBmdW5jdGlvbiBhbGxEYXRhc2V0c0VtcHR5KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmV2ZXJ5KHRoaXMuZGF0YXNldHMsIGlzRGF0YXNldEVtcHR5KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzRGF0YXNldEVtcHR5KGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFzZXQuaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfZ2V0U2VsZWN0YWJsZXM6IGZ1bmN0aW9uIGdldFNlbGVjdGFibGVzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRub2RlLmZpbmQodGhpcy5zZWxlY3RvcnMuc2VsZWN0YWJsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3JlbW92ZUN1cnNvcjogZnVuY3Rpb24gX3JlbW92ZUN1cnNvcigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGVjdGFibGUgPSB0aGlzLmdldEFjdGl2ZVNlbGVjdGFibGUoKTtcbiAgICAgICAgICAgICAgICAkc2VsZWN0YWJsZSAmJiAkc2VsZWN0YWJsZS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzZXMuY3Vyc29yKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfZW5zdXJlVmlzaWJsZTogZnVuY3Rpb24gZW5zdXJlVmlzaWJsZSgkZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxUb3AsIGVsQm90dG9tLCBub2RlU2Nyb2xsVG9wLCBub2RlSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGVsVG9wID0gJGVsLnBvc2l0aW9uKCkudG9wO1xuICAgICAgICAgICAgICAgIGVsQm90dG9tID0gZWxUb3AgKyAkZWwub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgbm9kZVNjcm9sbFRvcCA9IHRoaXMuJG5vZGUuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICAgICAgbm9kZUhlaWdodCA9IHRoaXMuJG5vZGUuaGVpZ2h0KCkgKyBwYXJzZUludCh0aGlzLiRub2RlLmNzcyhcInBhZGRpbmdUb3BcIiksIDEwKSArIHBhcnNlSW50KHRoaXMuJG5vZGUuY3NzKFwicGFkZGluZ0JvdHRvbVwiKSwgMTApO1xuICAgICAgICAgICAgICAgIGlmIChlbFRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kbm9kZS5zY3JvbGxUb3Aobm9kZVNjcm9sbFRvcCArIGVsVG9wKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVIZWlnaHQgPCBlbEJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRub2RlLnNjcm9sbFRvcChub2RlU2Nyb2xsVG9wICsgKGVsQm90dG9tIC0gbm9kZUhlaWdodCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGFibGVDbGljaztcbiAgICAgICAgICAgICAgICBvblNlbGVjdGFibGVDbGljayA9IF8uYmluZCh0aGlzLl9vblNlbGVjdGFibGVDbGljaywgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy4kbm9kZS5vbihcImNsaWNrLnR0XCIsIHRoaXMuc2VsZWN0b3JzLnNlbGVjdGFibGUsIG9uU2VsZWN0YWJsZUNsaWNrKTtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5kYXRhc2V0cywgZnVuY3Rpb24gKGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldC5vblN5bmMoXCJhc3luY1JlcXVlc3RlZFwiLCB0aGF0Ll9wcm9wYWdhdGUsIHRoYXQpLm9uU3luYyhcImFzeW5jQ2FuY2VsZWRcIiwgdGhhdC5fcHJvcGFnYXRlLCB0aGF0KS5vblN5bmMoXCJhc3luY1JlY2VpdmVkXCIsIHRoYXQuX3Byb3BhZ2F0ZSwgdGhhdCkub25TeW5jKFwicmVuZGVyZWRcIiwgdGhhdC5fb25SZW5kZXJlZCwgdGhhdCkub25TeW5jKFwiY2xlYXJlZFwiLCB0aGF0Ll9vbkNsZWFyZWQsIHRoYXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzT3BlbjogZnVuY3Rpb24gaXNPcGVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRub2RlLmhhc0NsYXNzKHRoaXMuY2xhc3Nlcy5vcGVuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJG5vZGUuYWRkQ2xhc3ModGhpcy5jbGFzc2VzLm9wZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRub2RlLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3Nlcy5vcGVuKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDdXJzb3IoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRMYW5ndWFnZURpcmVjdGlvbjogZnVuY3Rpb24gc2V0TGFuZ3VhZ2VEaXJlY3Rpb24oZGlyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kbm9kZS5hdHRyKFwiZGlyXCIsIGRpcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0YWJsZVJlbGF0aXZlVG9DdXJzb3I6IGZ1bmN0aW9uIHNlbGVjdGFibGVSZWxhdGl2ZVRvQ3Vyc29yKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyICRzZWxlY3RhYmxlcywgJG9sZEN1cnNvciwgb2xkSW5kZXgsIG5ld0luZGV4O1xuICAgICAgICAgICAgICAgICRvbGRDdXJzb3IgPSB0aGlzLmdldEFjdGl2ZVNlbGVjdGFibGUoKTtcbiAgICAgICAgICAgICAgICAkc2VsZWN0YWJsZXMgPSB0aGlzLl9nZXRTZWxlY3RhYmxlcygpO1xuICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gJG9sZEN1cnNvciA/ICRzZWxlY3RhYmxlcy5pbmRleCgkb2xkQ3Vyc29yKSA6IC0xO1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gb2xkSW5kZXggKyBkZWx0YTtcbiAgICAgICAgICAgICAgICBuZXdJbmRleCA9IChuZXdJbmRleCArIDEpICUgKCRzZWxlY3RhYmxlcy5sZW5ndGggKyAxKSAtIDE7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBuZXdJbmRleCA8IC0xID8gJHNlbGVjdGFibGVzLmxlbmd0aCAtIDEgOiBuZXdJbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3SW5kZXggPT09IC0xID8gbnVsbCA6ICRzZWxlY3RhYmxlcy5lcShuZXdJbmRleCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0Q3Vyc29yOiBmdW5jdGlvbiBzZXRDdXJzb3IoJHNlbGVjdGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoJHNlbGVjdGFibGUgPSAkc2VsZWN0YWJsZSAmJiAkc2VsZWN0YWJsZS5maXJzdCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3RhYmxlLmFkZENsYXNzKHRoaXMuY2xhc3Nlcy5jdXJzb3IpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbnN1cmVWaXNpYmxlKCRzZWxlY3RhYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0U2VsZWN0YWJsZURhdGE6IGZ1bmN0aW9uIGdldFNlbGVjdGFibGVEYXRhKCRlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZWwgJiYgJGVsLmxlbmd0aCA/IERhdGFzZXQuZXh0cmFjdERhdGEoJGVsKSA6IG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWN0aXZlU2VsZWN0YWJsZTogZnVuY3Rpb24gZ2V0QWN0aXZlU2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGVjdGFibGUgPSB0aGlzLl9nZXRTZWxlY3RhYmxlcygpLmZpbHRlcih0aGlzLnNlbGVjdG9ycy5jdXJzb3IpLmZpcnN0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRzZWxlY3RhYmxlLmxlbmd0aCA/ICRzZWxlY3RhYmxlIDogbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRUb3BTZWxlY3RhYmxlOiBmdW5jdGlvbiBnZXRUb3BTZWxlY3RhYmxlKCkge1xuICAgICAgICAgICAgICAgIHZhciAkc2VsZWN0YWJsZSA9IHRoaXMuX2dldFNlbGVjdGFibGVzKCkuZmlyc3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlbGVjdGFibGUubGVuZ3RoID8gJHNlbGVjdGFibGUgOiBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzVmFsaWRVcGRhdGUgPSBxdWVyeSAhPT0gdGhpcy5xdWVyeTtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZFVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLmRhdGFzZXRzLCB1cGRhdGVEYXRhc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWRVcGRhdGU7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVEYXRhc2V0KGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldC51cGRhdGUocXVlcnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuZGF0YXNldHMsIGNsZWFyRGF0YXNldCk7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy4kbm9kZS5hZGRDbGFzcyh0aGlzLmNsYXNzZXMuZW1wdHkpO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJEYXRhc2V0KGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldC5jbGVhcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJG5vZGUub2ZmKFwiLnR0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJG5vZGUgPSAkKFwiPGRpdj5cIik7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuZGF0YXNldHMsIGRlc3Ryb3lEYXRhc2V0KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lEYXRhc2V0KGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE1lbnU7XG4gICAgfSgpO1xuICAgIHZhciBEZWZhdWx0TWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBzID0gTWVudS5wcm90b3R5cGU7XG5cbiAgICAgICAgZnVuY3Rpb24gRGVmYXVsdE1lbnUoKSB7XG4gICAgICAgICAgICBNZW51LmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgXy5taXhpbihEZWZhdWx0TWVudS5wcm90b3R5cGUsIE1lbnUucHJvdG90eXBlLCB7XG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge1xuICAgICAgICAgICAgICAgICF0aGlzLl9hbGxEYXRhc2V0c0VtcHR5KCkgJiYgdGhpcy5fc2hvdygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzLm9wZW4uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGlkZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzLmNsb3NlLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uUmVuZGVyZWQ6IGZ1bmN0aW9uIG9uUmVuZGVyZWQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FsbERhdGFzZXRzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09wZW4oKSAmJiB0aGlzLl9zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzLl9vblJlbmRlcmVkLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uQ2xlYXJlZDogZnVuY3Rpb24gb25DbGVhcmVkKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbGxEYXRhc2V0c0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPcGVuKCkgJiYgdGhpcy5fc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcy5fb25DbGVhcmVkLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0TGFuZ3VhZ2VEaXJlY3Rpb246IGZ1bmN0aW9uIHNldExhbmd1YWdlRGlyZWN0aW9uKGRpcikge1xuICAgICAgICAgICAgICAgIHRoaXMuJG5vZGUuY3NzKGRpciA9PT0gXCJsdHJcIiA/IHRoaXMuY3NzLmx0ciA6IHRoaXMuY3NzLnJ0bCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMuc2V0TGFuZ3VhZ2VEaXJlY3Rpb24uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfaGlkZTogZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRub2RlLmhpZGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfc2hvdzogZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRub2RlLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBEZWZhdWx0TWVudTtcbiAgICB9KCk7XG4gICAgdmFyIFR5cGVhaGVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgZnVuY3Rpb24gVHlwZWFoZWFkKG8sIHd3dykge1xuICAgICAgICAgICAgdmFyIG9uRm9jdXNlZCwgb25CbHVycmVkLCBvbkVudGVyS2V5ZWQsIG9uVGFiS2V5ZWQsIG9uRXNjS2V5ZWQsIG9uVXBLZXllZCwgb25Eb3duS2V5ZWQsIG9uTGVmdEtleWVkLCBvblJpZ2h0S2V5ZWQsIG9uUXVlcnlDaGFuZ2VkLCBvbldoaXRlc3BhY2VDaGFuZ2VkO1xuICAgICAgICAgICAgbyA9IG8gfHwge307XG4gICAgICAgICAgICBpZiAoIW8uaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAkLmVycm9yKFwibWlzc2luZyBpbnB1dFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghby5tZW51KSB7XG4gICAgICAgICAgICAgICAgJC5lcnJvcihcIm1pc3NpbmcgbWVudVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghby5ldmVudEJ1cykge1xuICAgICAgICAgICAgICAgICQuZXJyb3IoXCJtaXNzaW5nIGV2ZW50IGJ1c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHd3dy5taXhpbih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRCdXMgPSBvLmV2ZW50QnVzO1xuICAgICAgICAgICAgdGhpcy5taW5MZW5ndGggPSBfLmlzTnVtYmVyKG8ubWluTGVuZ3RoKSA/IG8ubWluTGVuZ3RoIDogMTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBvLmlucHV0O1xuICAgICAgICAgICAgdGhpcy5tZW51ID0gby5tZW51O1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlucHV0Lmhhc0ZvY3VzKCkgJiYgdGhpcy5hY3RpdmF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5kaXIgPSB0aGlzLmlucHV0LmdldExhbmdEaXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2hhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLm1lbnUuYmluZCgpLm9uU3luYyhcInNlbGVjdGFibGVDbGlja2VkXCIsIHRoaXMuX29uU2VsZWN0YWJsZUNsaWNrZWQsIHRoaXMpLm9uU3luYyhcImFzeW5jUmVxdWVzdGVkXCIsIHRoaXMuX29uQXN5bmNSZXF1ZXN0ZWQsIHRoaXMpLm9uU3luYyhcImFzeW5jQ2FuY2VsZWRcIiwgdGhpcy5fb25Bc3luY0NhbmNlbGVkLCB0aGlzKS5vblN5bmMoXCJhc3luY1JlY2VpdmVkXCIsIHRoaXMuX29uQXN5bmNSZWNlaXZlZCwgdGhpcykub25TeW5jKFwiZGF0YXNldFJlbmRlcmVkXCIsIHRoaXMuX29uRGF0YXNldFJlbmRlcmVkLCB0aGlzKS5vblN5bmMoXCJkYXRhc2V0Q2xlYXJlZFwiLCB0aGlzLl9vbkRhdGFzZXRDbGVhcmVkLCB0aGlzKTtcbiAgICAgICAgICAgIG9uRm9jdXNlZCA9IGModGhpcywgXCJhY3RpdmF0ZVwiLCBcIm9wZW5cIiwgXCJfb25Gb2N1c2VkXCIpO1xuICAgICAgICAgICAgb25CbHVycmVkID0gYyh0aGlzLCBcImRlYWN0aXZhdGVcIiwgXCJfb25CbHVycmVkXCIpO1xuICAgICAgICAgICAgb25FbnRlcktleWVkID0gYyh0aGlzLCBcImlzQWN0aXZlXCIsIFwiaXNPcGVuXCIsIFwiX29uRW50ZXJLZXllZFwiKTtcbiAgICAgICAgICAgIG9uVGFiS2V5ZWQgPSBjKHRoaXMsIFwiaXNBY3RpdmVcIiwgXCJpc09wZW5cIiwgXCJfb25UYWJLZXllZFwiKTtcbiAgICAgICAgICAgIG9uRXNjS2V5ZWQgPSBjKHRoaXMsIFwiaXNBY3RpdmVcIiwgXCJfb25Fc2NLZXllZFwiKTtcbiAgICAgICAgICAgIG9uVXBLZXllZCA9IGModGhpcywgXCJpc0FjdGl2ZVwiLCBcIm9wZW5cIiwgXCJfb25VcEtleWVkXCIpO1xuICAgICAgICAgICAgb25Eb3duS2V5ZWQgPSBjKHRoaXMsIFwiaXNBY3RpdmVcIiwgXCJvcGVuXCIsIFwiX29uRG93bktleWVkXCIpO1xuICAgICAgICAgICAgb25MZWZ0S2V5ZWQgPSBjKHRoaXMsIFwiaXNBY3RpdmVcIiwgXCJpc09wZW5cIiwgXCJfb25MZWZ0S2V5ZWRcIik7XG4gICAgICAgICAgICBvblJpZ2h0S2V5ZWQgPSBjKHRoaXMsIFwiaXNBY3RpdmVcIiwgXCJpc09wZW5cIiwgXCJfb25SaWdodEtleWVkXCIpO1xuICAgICAgICAgICAgb25RdWVyeUNoYW5nZWQgPSBjKHRoaXMsIFwiX29wZW5JZkFjdGl2ZVwiLCBcIl9vblF1ZXJ5Q2hhbmdlZFwiKTtcbiAgICAgICAgICAgIG9uV2hpdGVzcGFjZUNoYW5nZWQgPSBjKHRoaXMsIFwiX29wZW5JZkFjdGl2ZVwiLCBcIl9vbldoaXRlc3BhY2VDaGFuZ2VkXCIpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5iaW5kKCkub25TeW5jKFwiZm9jdXNlZFwiLCBvbkZvY3VzZWQsIHRoaXMpLm9uU3luYyhcImJsdXJyZWRcIiwgb25CbHVycmVkLCB0aGlzKS5vblN5bmMoXCJlbnRlcktleWVkXCIsIG9uRW50ZXJLZXllZCwgdGhpcykub25TeW5jKFwidGFiS2V5ZWRcIiwgb25UYWJLZXllZCwgdGhpcykub25TeW5jKFwiZXNjS2V5ZWRcIiwgb25Fc2NLZXllZCwgdGhpcykub25TeW5jKFwidXBLZXllZFwiLCBvblVwS2V5ZWQsIHRoaXMpLm9uU3luYyhcImRvd25LZXllZFwiLCBvbkRvd25LZXllZCwgdGhpcykub25TeW5jKFwibGVmdEtleWVkXCIsIG9uTGVmdEtleWVkLCB0aGlzKS5vblN5bmMoXCJyaWdodEtleWVkXCIsIG9uUmlnaHRLZXllZCwgdGhpcykub25TeW5jKFwicXVlcnlDaGFuZ2VkXCIsIG9uUXVlcnlDaGFuZ2VkLCB0aGlzKS5vblN5bmMoXCJ3aGl0ZXNwYWNlQ2hhbmdlZFwiLCBvbldoaXRlc3BhY2VDaGFuZ2VkLCB0aGlzKS5vblN5bmMoXCJsYW5nRGlyQ2hhbmdlZFwiLCB0aGlzLl9vbkxhbmdEaXJDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBfLm1peGluKFR5cGVhaGVhZC5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIF9oYWNrczogZnVuY3Rpb24gaGFja3MoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCwgJG1lbnU7XG4gICAgICAgICAgICAgICAgJGlucHV0ID0gdGhpcy5pbnB1dC4kaW5wdXQgfHwgJChcIjxkaXY+XCIpO1xuICAgICAgICAgICAgICAgICRtZW51ID0gdGhpcy5tZW51LiRub2RlIHx8ICQoXCI8ZGl2PlwiKTtcbiAgICAgICAgICAgICAgICAkaW5wdXQub24oXCJibHVyLnR0XCIsIGZ1bmN0aW9uICgkZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlLCBpc0FjdGl2ZSwgaGFzQWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA9ICRtZW51LmlzKGFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FjdGl2ZSA9ICRtZW51LmhhcyhhY3RpdmUpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmlzTXNpZSgpICYmIChpc0FjdGl2ZSB8fCBoYXNBY3RpdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJG1lbnUub24oXCJtb3VzZWRvd24udHRcIiwgZnVuY3Rpb24gKCRlKSB7XG4gICAgICAgICAgICAgICAgICAgICRlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uU2VsZWN0YWJsZUNsaWNrZWQ6IGZ1bmN0aW9uIG9uU2VsZWN0YWJsZUNsaWNrZWQodHlwZSwgJGVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QoJGVsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25EYXRhc2V0Q2xlYXJlZDogZnVuY3Rpb24gb25EYXRhc2V0Q2xlYXJlZCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVIaW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uRGF0YXNldFJlbmRlcmVkOiBmdW5jdGlvbiBvbkRhdGFzZXRSZW5kZXJlZCh0eXBlLCBkYXRhc2V0LCBzdWdnZXN0aW9ucywgYXN5bmMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVIaW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudEJ1cy50cmlnZ2VyKFwicmVuZGVyXCIsIHN1Z2dlc3Rpb25zLCBhc3luYywgZGF0YXNldCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uQXN5bmNSZXF1ZXN0ZWQ6IGZ1bmN0aW9uIG9uQXN5bmNSZXF1ZXN0ZWQodHlwZSwgZGF0YXNldCwgcXVlcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50QnVzLnRyaWdnZXIoXCJhc3luY3JlcXVlc3RcIiwgcXVlcnksIGRhdGFzZXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbkFzeW5jQ2FuY2VsZWQ6IGZ1bmN0aW9uIG9uQXN5bmNDYW5jZWxlZCh0eXBlLCBkYXRhc2V0LCBxdWVyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRCdXMudHJpZ2dlcihcImFzeW5jY2FuY2VsXCIsIHF1ZXJ5LCBkYXRhc2V0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25Bc3luY1JlY2VpdmVkOiBmdW5jdGlvbiBvbkFzeW5jUmVjZWl2ZWQodHlwZSwgZGF0YXNldCwgcXVlcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50QnVzLnRyaWdnZXIoXCJhc3luY3JlY2VpdmVcIiwgcXVlcnksIGRhdGFzZXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbkZvY3VzZWQ6IGZ1bmN0aW9uIG9uRm9jdXNlZCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5MZW5ndGhNZXQoKSAmJiB0aGlzLm1lbnUudXBkYXRlKHRoaXMuaW5wdXQuZ2V0UXVlcnkoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uQmx1cnJlZDogZnVuY3Rpb24gb25CbHVycmVkKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Lmhhc1F1ZXJ5Q2hhbmdlZFNpbmNlTGFzdEZvY3VzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEJ1cy50cmlnZ2VyKFwiY2hhbmdlXCIsIHRoaXMuaW5wdXQuZ2V0UXVlcnkoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbkVudGVyS2V5ZWQ6IGZ1bmN0aW9uIG9uRW50ZXJLZXllZCh0eXBlLCAkZSkge1xuICAgICAgICAgICAgICAgIHZhciAkc2VsZWN0YWJsZTtcbiAgICAgICAgICAgICAgICBpZiAoJHNlbGVjdGFibGUgPSB0aGlzLm1lbnUuZ2V0QWN0aXZlU2VsZWN0YWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0KCRzZWxlY3RhYmxlKSAmJiAkZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25UYWJLZXllZDogZnVuY3Rpb24gb25UYWJLZXllZCh0eXBlLCAkZSkge1xuICAgICAgICAgICAgICAgIHZhciAkc2VsZWN0YWJsZTtcbiAgICAgICAgICAgICAgICBpZiAoJHNlbGVjdGFibGUgPSB0aGlzLm1lbnUuZ2V0QWN0aXZlU2VsZWN0YWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0KCRzZWxlY3RhYmxlKSAmJiAkZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNlbGVjdGFibGUgPSB0aGlzLm1lbnUuZ2V0VG9wU2VsZWN0YWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlKCRzZWxlY3RhYmxlKSAmJiAkZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25Fc2NLZXllZDogZnVuY3Rpb24gb25Fc2NLZXllZCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uVXBLZXllZDogZnVuY3Rpb24gb25VcEtleWVkKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uRG93bktleWVkOiBmdW5jdGlvbiBvbkRvd25LZXllZCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVDdXJzb3IoKzEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbkxlZnRLZXllZDogZnVuY3Rpb24gb25MZWZ0S2V5ZWQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyID09PSBcInJ0bFwiICYmIHRoaXMuaW5wdXQuaXNDdXJzb3JBdEVuZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlKHRoaXMubWVudS5nZXRUb3BTZWxlY3RhYmxlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25SaWdodEtleWVkOiBmdW5jdGlvbiBvblJpZ2h0S2V5ZWQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyID09PSBcImx0clwiICYmIHRoaXMuaW5wdXQuaXNDdXJzb3JBdEVuZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlKHRoaXMubWVudS5nZXRUb3BTZWxlY3RhYmxlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfb25RdWVyeUNoYW5nZWQ6IGZ1bmN0aW9uIG9uUXVlcnlDaGFuZ2VkKGUsIHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluTGVuZ3RoTWV0KHF1ZXJ5KSA/IHRoaXMubWVudS51cGRhdGUocXVlcnkpIDogdGhpcy5tZW51LmVtcHR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29uV2hpdGVzcGFjZUNoYW5nZWQ6IGZ1bmN0aW9uIG9uV2hpdGVzcGFjZUNoYW5nZWQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlSGludCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9vbkxhbmdEaXJDaGFuZ2VkOiBmdW5jdGlvbiBvbkxhbmdEaXJDaGFuZ2VkKGUsIGRpcikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpciAhPT0gZGlyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyID0gZGlyO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lbnUuc2V0TGFuZ3VhZ2VEaXJlY3Rpb24oZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX29wZW5JZkFjdGl2ZTogZnVuY3Rpb24gb3BlbklmQWN0aXZlKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUoKSAmJiB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfbWluTGVuZ3RoTWV0OiBmdW5jdGlvbiBtaW5MZW5ndGhNZXQocXVlcnkpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IF8uaXNTdHJpbmcocXVlcnkpID8gcXVlcnkgOiB0aGlzLmlucHV0LmdldFF1ZXJ5KCkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnkubGVuZ3RoID49IHRoaXMubWluTGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF91cGRhdGVIaW50OiBmdW5jdGlvbiB1cGRhdGVIaW50KCkge1xuICAgICAgICAgICAgICAgIHZhciAkc2VsZWN0YWJsZSwgZGF0YSwgdmFsLCBxdWVyeSwgZXNjYXBlZFF1ZXJ5LCBmcm9udE1hdGNoUmVnRXgsIG1hdGNoO1xuICAgICAgICAgICAgICAgICRzZWxlY3RhYmxlID0gdGhpcy5tZW51LmdldFRvcFNlbGVjdGFibGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5tZW51LmdldFNlbGVjdGFibGVEYXRhKCRzZWxlY3RhYmxlKTtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmlucHV0LmdldElucHV0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiAhXy5pc0JsYW5rU3RyaW5nKHZhbCkgJiYgIXRoaXMuaW5wdXQuaGFzT3ZlcmZsb3coKSkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IElucHV0Lm5vcm1hbGl6ZVF1ZXJ5KHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWRRdWVyeSA9IF8uZXNjYXBlUmVnRXhDaGFycyhxdWVyeSk7XG4gICAgICAgICAgICAgICAgICAgIGZyb250TWF0Y2hSZWdFeCA9IG5ldyBSZWdFeHAoXCJeKD86XCIgKyBlc2NhcGVkUXVlcnkgKyBcIikoLiskKVwiLCBcImlcIik7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZnJvbnRNYXRjaFJlZ0V4LmV4ZWMoZGF0YS52YWwpO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCAmJiB0aGlzLmlucHV0LnNldEhpbnQodmFsICsgbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xlYXJIaW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRW5hYmxlZDogZnVuY3Rpb24gaXNFbmFibGVkKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0VuYWJsZWQoKSB8fCB0aGlzLmV2ZW50QnVzLmJlZm9yZShcImFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50QnVzLnRyaWdnZXIoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWFjdGl2YXRlOiBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5ldmVudEJ1cy5iZWZvcmUoXCJpZGxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRCdXMudHJpZ2dlcihcImlkbGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc09wZW46IGZ1bmN0aW9uIGlzT3BlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tZW51LmlzT3BlbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3BlbigpICYmICF0aGlzLmV2ZW50QnVzLmJlZm9yZShcIm9wZW5cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZW51Lm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlSGludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50QnVzLnRyaWdnZXIoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc09wZW4oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuKCkgJiYgIXRoaXMuZXZlbnRCdXMuYmVmb3JlKFwiY2xvc2VcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZW51LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xlYXJIaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQucmVzZXRJbnB1dFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRCdXMudHJpZ2dlcihcImNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNPcGVuKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0VmFsOiBmdW5jdGlvbiBzZXRWYWwodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRRdWVyeShfLnRvU3RyKHZhbCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFZhbDogZnVuY3Rpb24gZ2V0VmFsKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0LmdldFF1ZXJ5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoJHNlbGVjdGFibGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMubWVudS5nZXRTZWxlY3RhYmxlRGF0YSgkc2VsZWN0YWJsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgIXRoaXMuZXZlbnRCdXMuYmVmb3JlKFwic2VsZWN0XCIsIGRhdGEub2JqKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0LnNldFF1ZXJ5KGRhdGEudmFsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEJ1cy50cmlnZ2VyKFwic2VsZWN0XCIsIGRhdGEub2JqKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZTogZnVuY3Rpb24gYXV0b2NvbXBsZXRlKCRzZWxlY3RhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5LCBkYXRhLCBpc1ZhbGlkO1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gdGhpcy5pbnB1dC5nZXRRdWVyeSgpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLm1lbnUuZ2V0U2VsZWN0YWJsZURhdGEoJHNlbGVjdGFibGUpO1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBkYXRhICYmIHF1ZXJ5ICE9PSBkYXRhLnZhbDtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZCAmJiAhdGhpcy5ldmVudEJ1cy5iZWZvcmUoXCJhdXRvY29tcGxldGVcIiwgZGF0YS5vYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQuc2V0UXVlcnkoZGF0YS52YWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50QnVzLnRyaWdnZXIoXCJhdXRvY29tcGxldGVcIiwgZGF0YS5vYmopO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdmVDdXJzb3I6IGZ1bmN0aW9uIG1vdmVDdXJzb3IoZGVsdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnksICRjYW5kaWRhdGUsIGRhdGEsIHBheWxvYWQsIGNhbmNlbE1vdmU7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSB0aGlzLmlucHV0LmdldFF1ZXJ5KCk7XG4gICAgICAgICAgICAgICAgJGNhbmRpZGF0ZSA9IHRoaXMubWVudS5zZWxlY3RhYmxlUmVsYXRpdmVUb0N1cnNvcihkZWx0YSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMubWVudS5nZXRTZWxlY3RhYmxlRGF0YSgkY2FuZGlkYXRlKTtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gZGF0YSA/IGRhdGEub2JqIDogbnVsbDtcbiAgICAgICAgICAgICAgICBjYW5jZWxNb3ZlID0gdGhpcy5fbWluTGVuZ3RoTWV0KCkgJiYgdGhpcy5tZW51LnVwZGF0ZShxdWVyeSk7XG4gICAgICAgICAgICAgICAgaWYgKCFjYW5jZWxNb3ZlICYmICF0aGlzLmV2ZW50QnVzLmJlZm9yZShcImN1cnNvcmNoYW5nZVwiLCBwYXlsb2FkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lbnUuc2V0Q3Vyc29yKCRjYW5kaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRJbnB1dFZhbHVlKGRhdGEudmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQucmVzZXRJbnB1dFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVIaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEJ1cy50cmlnZ2VyKFwiY3Vyc29yY2hhbmdlXCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBUeXBlYWhlYWQ7XG5cbiAgICAgICAgZnVuY3Rpb24gYyhjdHgpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3R4W21ldGhvZF0uYXBwbHkoY3R4LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KCk7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBvbGQsIGtleXMsIG1ldGhvZHM7XG4gICAgICAgIG9sZCA9ICQuZm4udHlwZWFoZWFkO1xuICAgICAgICBrZXlzID0ge1xuICAgICAgICAgICAgd3d3OiBcInR0LXd3d1wiLFxuICAgICAgICAgICAgYXR0cnM6IFwidHQtYXR0cnNcIixcbiAgICAgICAgICAgIHR5cGVhaGVhZDogXCJ0dC10eXBlYWhlYWRcIlxuICAgICAgICB9O1xuICAgICAgICBtZXRob2RzID0ge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdGlhbGl6ZShvLCBkYXRhc2V0cykge1xuICAgICAgICAgICAgICAgIHZhciB3d3c7XG4gICAgICAgICAgICAgICAgZGF0YXNldHMgPSBfLmlzQXJyYXkoZGF0YXNldHMpID8gZGF0YXNldHMgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgbyA9IG8gfHwge307XG4gICAgICAgICAgICAgICAgd3d3ID0gV1dXKG8uY2xhc3NOYW1lcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChhdHRhY2gpO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYXR0YWNoKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGlucHV0LCAkd3JhcHBlciwgJGhpbnQsICRtZW51LCBkZWZhdWx0SGludCwgZGVmYXVsdE1lbnUsIGV2ZW50QnVzLCBpbnB1dCwgbWVudSwgdHlwZWFoZWFkLCBNZW51Q29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChkYXRhc2V0cywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuaGlnaGxpZ2h0ID0gISFvLmhpZ2hsaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCh3d3cuaHRtbC53cmFwcGVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGhpbnQgPSAkZWxPck51bGwoby5oaW50KTtcbiAgICAgICAgICAgICAgICAgICAgJG1lbnUgPSAkZWxPck51bGwoby5tZW51KTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEhpbnQgPSBvLmhpbnQgIT09IGZhbHNlICYmICEkaGludDtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE1lbnUgPSBvLm1lbnUgIT09IGZhbHNlICYmICEkbWVudTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEhpbnQgJiYgKCRoaW50ID0gYnVpbGRIaW50RnJvbUlucHV0KCRpbnB1dCwgd3d3KSk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRNZW51ICYmICgkbWVudSA9ICQod3d3Lmh0bWwubWVudSkuY3NzKHd3dy5jc3MubWVudSkpO1xuICAgICAgICAgICAgICAgICAgICAkaGludCAmJiAkaGludC52YWwoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dCA9IHByZXBJbnB1dCgkaW5wdXQsIHd3dyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0SGludCB8fCBkZWZhdWx0TWVudSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHd3dy5jc3Mud3JhcHBlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuY3NzKGRlZmF1bHRIaW50ID8gd3d3LmNzcy5pbnB1dCA6IHd3dy5jc3MuaW5wdXRXaXRoTm9IaW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dC53cmFwKCR3cmFwcGVyKS5wYXJlbnQoKS5wcmVwZW5kKGRlZmF1bHRIaW50ID8gJGhpbnQgOiBudWxsKS5hcHBlbmQoZGVmYXVsdE1lbnUgPyAkbWVudSA6IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIE1lbnVDb25zdHJ1Y3RvciA9IGRlZmF1bHRNZW51ID8gRGVmYXVsdE1lbnUgOiBNZW51O1xuICAgICAgICAgICAgICAgICAgICBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbDogJGlucHV0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IG5ldyBJbnB1dCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaW50OiAkaGludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiAkaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgfSwgd3d3KTtcbiAgICAgICAgICAgICAgICAgICAgbWVudSA9IG5ldyBNZW51Q29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogJG1lbnUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0czogZGF0YXNldHNcbiAgICAgICAgICAgICAgICAgICAgfSwgd3d3KTtcbiAgICAgICAgICAgICAgICAgICAgdHlwZWFoZWFkID0gbmV3IFR5cGVhaGVhZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW51OiBtZW51LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRCdXM6IGV2ZW50QnVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluTGVuZ3RoOiBvLm1pbkxlbmd0aFxuICAgICAgICAgICAgICAgICAgICB9LCB3d3cpO1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXQuZGF0YShrZXlzLnd3dywgd3d3KTtcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LmRhdGEoa2V5cy50eXBlYWhlYWQsIHR5cGVhaGVhZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRW5hYmxlZDogZnVuY3Rpb24gaXNFbmFibGVkKCkge1xuICAgICAgICAgICAgICAgIHZhciBlbmFibGVkO1xuICAgICAgICAgICAgICAgIHR0RWFjaCh0aGlzLmZpcnN0KCksIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQgPSB0LmlzRW5hYmxlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgICAgICAgICAgICAgIHR0RWFjaCh0aGlzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICB0LmVuYWJsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlO1xuICAgICAgICAgICAgICAgIHR0RWFjaCh0aGlzLmZpcnN0KCksIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHQuaXNBY3RpdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgICAgICB0dEVhY2godGhpcywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdC5hY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQuZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzT3BlbjogZnVuY3Rpb24gaXNPcGVuKCkge1xuICAgICAgICAgICAgICAgIHZhciBvcGVuO1xuICAgICAgICAgICAgICAgIHR0RWFjaCh0aGlzLmZpcnN0KCksIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW4gPSB0LmlzT3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGVuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgICAgICAgICB0dEVhY2godGhpcywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJGVsID0gJChlbCk7XG4gICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMuZmlyc3QoKSwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IHQuc2VsZWN0KCRlbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXV0b2NvbXBsZXRlOiBmdW5jdGlvbiBhdXRvY29tcGxldGUoZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAkZWwgPSAkKGVsKTtcbiAgICAgICAgICAgICAgICB0dEVhY2godGhpcy5maXJzdCgpLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gdC5hdXRvY29tcGxldGUoJGVsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlQ3Vyc29yOiBmdW5jdGlvbiBtb3ZlQ3Vyc29lKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0dEVhY2godGhpcy5maXJzdCgpLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gdC5tb3ZlQ3Vyc29yKGRlbHRhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2YWw6IGZ1bmN0aW9uIHZhbChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnk7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHR0RWFjaCh0aGlzLmZpcnN0KCksIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHQuZ2V0VmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnNldFZhbChuZXdWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgdHRFYWNoKHRoaXMsIGZ1bmN0aW9uICh0eXBlYWhlYWQsICRpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnQoJGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgdHlwZWFoZWFkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICQuZm4udHlwZWFoZWFkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgICAgICAgICAgJC5mbi50eXBlYWhlYWQgPSBvbGQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB0dEVhY2goJGVscywgZm4pIHtcbiAgICAgICAgICAgICRlbHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHR5cGVhaGVhZDtcbiAgICAgICAgICAgICAgICAodHlwZWFoZWFkID0gJGlucHV0LmRhdGEoa2V5cy50eXBlYWhlYWQpKSAmJiBmbih0eXBlYWhlYWQsICRpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkSGludEZyb21JbnB1dCgkaW5wdXQsIHd3dykge1xuICAgICAgICAgICAgcmV0dXJuICRpbnB1dC5jbG9uZSgpLmFkZENsYXNzKHd3dy5jbGFzc2VzLmhpbnQpLnJlbW92ZURhdGEoKS5jc3Mod3d3LmNzcy5oaW50KS5jc3MoZ2V0QmFja2dyb3VuZFN0eWxlcygkaW5wdXQpKS5wcm9wKFwicmVhZG9ubHlcIiwgdHJ1ZSkucmVtb3ZlQXR0cihcImlkIG5hbWUgcGxhY2Vob2xkZXIgcmVxdWlyZWRcIikuYXR0cih7XG4gICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlOiBcIm9mZlwiLFxuICAgICAgICAgICAgICAgIHNwZWxsY2hlY2s6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICAgICB0YWJpbmRleDogLTFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJlcElucHV0KCRpbnB1dCwgd3d3KSB7XG4gICAgICAgICAgICAkaW5wdXQuZGF0YShrZXlzLmF0dHJzLCB7XG4gICAgICAgICAgICAgICAgZGlyOiAkaW5wdXQuYXR0cihcImRpclwiKSxcbiAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU6ICRpbnB1dC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIpLFxuICAgICAgICAgICAgICAgIHNwZWxsY2hlY2s6ICRpbnB1dC5hdHRyKFwic3BlbGxjaGVja1wiKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogJGlucHV0LmF0dHIoXCJzdHlsZVwiKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3Mod3d3LmNsYXNzZXMuaW5wdXQpLmF0dHIoe1xuICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZTogXCJvZmZcIixcbiAgICAgICAgICAgICAgICBzcGVsbGNoZWNrOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICEkaW5wdXQuYXR0cihcImRpclwiKSAmJiAkaW5wdXQuYXR0cihcImRpclwiLCBcImF1dG9cIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgcmV0dXJuICRpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJhY2tncm91bmRTdHlsZXMoJGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRBdHRhY2htZW50OiAkZWwuY3NzKFwiYmFja2dyb3VuZC1hdHRhY2htZW50XCIpLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDbGlwOiAkZWwuY3NzKFwiYmFja2dyb3VuZC1jbGlwXCIpLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJGVsLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiksXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiAkZWwuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiKSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kT3JpZ2luOiAkZWwuY3NzKFwiYmFja2dyb3VuZC1vcmlnaW5cIiksXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiAkZWwuY3NzKFwiYmFja2dyb3VuZC1wb3NpdGlvblwiKSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiAkZWwuY3NzKFwiYmFja2dyb3VuZC1yZXBlYXRcIiksXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6ICRlbC5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIilcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXZlcnQoJGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd3d3LCAkd3JhcHBlcjtcbiAgICAgICAgICAgIHd3dyA9ICRpbnB1dC5kYXRhKGtleXMud3d3KTtcbiAgICAgICAgICAgICR3cmFwcGVyID0gJGlucHV0LnBhcmVudCgpLmZpbHRlcih3d3cuc2VsZWN0b3JzLndyYXBwZXIpO1xuICAgICAgICAgICAgXy5lYWNoKCRpbnB1dC5kYXRhKGtleXMuYXR0cnMpLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBfLmlzVW5kZWZpbmVkKHZhbCkgPyAkaW5wdXQucmVtb3ZlQXR0cihrZXkpIDogJGlucHV0LmF0dHIoa2V5LCB2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkaW5wdXQucmVtb3ZlRGF0YShrZXlzLnR5cGVhaGVhZCkucmVtb3ZlRGF0YShrZXlzLnd3dykucmVtb3ZlRGF0YShrZXlzLmF0dHIpLnJlbW92ZUNsYXNzKHd3dy5jbGFzc2VzLmlucHV0KTtcbiAgICAgICAgICAgIGlmICgkd3JhcHBlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkaW5wdXQuZGV0YWNoKCkuaW5zZXJ0QWZ0ZXIoJHdyYXBwZXIpO1xuICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gJGVsT3JOdWxsKG9iaikge1xuICAgICAgICAgICAgdmFyIGlzVmFsaWQsICRlbDtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBfLmlzSlF1ZXJ5KG9iaikgfHwgXy5pc0VsZW1lbnQob2JqKTtcbiAgICAgICAgICAgICRlbCA9IGlzVmFsaWQgPyAkKG9iaikuZmlyc3QoKSA6IFtdO1xuICAgICAgICAgICAgcmV0dXJuICRlbC5sZW5ndGggPyAkZWwgOiBudWxsO1xuICAgICAgICB9XG4gICAgfSkoKTtcbn0pO1xuIiwiaWYgKCEhJCkge1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gVHVybiBvZmYgalF1ZXJ5IGFuaW1hdGlvblxuICAgIGpRdWVyeS5meC5vZmYgPSB0cnVlXG5cbiAgICAkKCcudHlwZWFoZWFkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgdmFyIHVybCA9ICR0aGlzLmRhdGEoXCJ1cmxcIik7XG4gICAgICAkdGhpcy50eXBlYWhlYWQoe1xuICAgICAgICBtaW5MZW5ndGg6IDMsXG4gICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiB1cmwucmVwbGFjZSgvXFwvL2csIFwiLVwiKSxcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIGNiU3luYywgY2JBc3luYykge1xuICAgICAgICAgICQuZ2V0KHVybCwge1xuICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICBjYkFzeW5jKHJlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiAxMFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pXG59XG5cbmlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gZG9jdW1lbnQgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhY2NvcmRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbicpXG4gICAgZm9yICh2YXIgaSA9IGFjY29yZGlvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIG5ldyBBY2NvcmRpb24oYWNjb3JkaW9uc1tpXSlcbiAgICB9O1xuICB9KVxufVxuXG53aW5kb3cuR09WVUtGcm9udGVuZC5pbml0QWxsKClcbiJdfQ==
