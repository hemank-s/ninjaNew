/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function(W) {
	    'use strict';

	    __webpack_require__(1);
	    W.Mustache = __webpack_require__(2);

	    var platformSdk = __webpack_require__(3);
	    var utils = __webpack_require__(4);

	    W.notifDataReceived = function(res) {
	        console.log('Some notif data recieved');
	    };

	    platformSdk.ready(function() {
	        var environment = document.body.getAttribute('data-env'),
	            config = __webpack_require__(6)(environment),
	            Constants = __webpack_require__(5);

	        W.appConfig = config;

	        var Application = __webpack_require__(7);

	        if (platformSdk.appData === undefined) {
	            platformSdk.appData = {};
	            platformSdk.appData.helperData = {};


	            // save all helperData to localStorage
	            platformSdk.events.subscribe('app.noHelperData', function(res) {
	                platformSdk.events.publish('app.store.set', {
	                    key: '_helperData',
	                    value: res
	                });
	            });

	            platformSdk.events.publish('app.store.get', {
	                key: '_helperData',
	                ctx: this,
	                cb: function(res) {
	                    if (res.status === 1) {
	                        platformSdk.appData.helperData = res.results;
	                    }
	                }
	            });

	        }

	        platformSdk.bridge.setDebuggableEnabled(true);
	        //if (platformSdk.bridgeEnabled) platformSdk.bridge.setDebuggableEnabled(environment === Constants.PROD_ENV || environment === Constants.DEV_ENV);

	        if ((platformSdk.appData && platformSdk.appData.platformUid === undefined) || (platformSdk.appData && platformSdk.appData.platformUid === "")) platformSdk.appData.platformUid = 'VhzmGOSwNYkM6JHE';
	        if ((platformSdk.appData && platformSdk.appData.platformToken === undefined) || (platformSdk.appData && platformSdk.appData.platformToken === "")) platformSdk.appData.platformToken = 'mACoHN4G0DI=';

	        try {
	            platformSdk.appData.helperData = JSON.parse(platformSdk.appData.helperData);
	        } catch (e) {
	            // platformSdk.helperData = platformSdk.appData.helperData;
	        }

	        var application = new Application({
	            container: document.getElementById("container"),
	            route: platformSdk.link && platformSdk.link.route // ToDo: Where is this link being set from
	        });

	        application.start();

	        //window.onResume = application.resumeHikeNinja.bind(application);
	        window.intentData = application.getIntentData.bind(application);
	    });

	})(window);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* Zepto 1.1.6 - zepto event ajax form ie - zeptojs.com/license */

	var Zepto = (function() {
	  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
	    document = window.document,
	    elementDisplay = {}, classCache = {},
	    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	    rootNodeRE = /^(?:body|html)$/i,
	    capitalRE = /([A-Z])/g,

	    // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

	    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	    table = document.createElement('table'),
	    tableRow = document.createElement('tr'),
	    containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table, 'thead': table, 'tfoot': table,
	      'td': tableRow, 'th': tableRow,
	      '*': document.createElement('div')
	    },
	    readyRE = /complete|loaded|interactive/,
	    simpleSelectorRE = /^[\w-]*$/,
	    class2type = {},
	    toString = class2type.toString,
	    zepto = {},
	    camelize, uniq,
	    tempParent = document.createElement('div'),
	    propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    },
	    isArray = Array.isArray ||
	      function(object){ return object instanceof Array }

	  zepto.matches = function(element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false
	    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
	                          element.oMatchesSelector || element.matchesSelector
	    if (matchesSelector) return matchesSelector.call(element, selector)
	    // fall back to performing a selector:
	    var match, parent = element.parentNode, temp = !parent
	    if (temp) (parent = tempParent).appendChild(element)
	    match = ~zepto.qsa(parent, selector).indexOf(element)
	    temp && tempParent.removeChild(element)
	    return match
	  }

	  function type(obj) {
	    return obj == null ? String(obj) :
	      class2type[toString.call(obj)] || "object"
	  }

	  function isFunction(value) { return type(value) == "function" }
	  function isWindow(obj)     { return obj != null && obj == obj.window }
	  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	  function isObject(obj)     { return type(obj) == "object" }
	  function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	  }
	  function likeArray(obj) { return typeof obj.length == 'number' }

	  function compact(array) { return filter.call(array, function(item){ return item != null }) }
	  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	  function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	  }
	  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

	  function classRE(name) {
	    return name in classCache ?
	      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	  }

	  function maybeAddPx(name, value) {
	    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }

	  function defaultDisplay(nodeName) {
	    var element, display
	    if (!elementDisplay[nodeName]) {
	      element = document.createElement(nodeName)
	      document.body.appendChild(element)
	      display = getComputedStyle(element, '').getPropertyValue("display")
	      element.parentNode.removeChild(element)
	      display == "none" && (display = "block")
	      elementDisplay[nodeName] = display
	    }
	    return elementDisplay[nodeName]
	  }

	  function children(element) {
	    return 'children' in element ?
	      slice.call(element.children) :
	      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	  }

	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overriden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name, properties) {
	    var dom, nodes, container

	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	      if (!(name in containers)) name = '*'

	      container = containers[name]
	      container.innerHTML = '' + html
	      dom = $.each(slice.call(container.childNodes), function(){
	        container.removeChild(this)
	      })
	    }

	    if (isPlainObject(properties)) {
	      nodes = $(dom)
	      $.each(properties, function(key, value) {
	        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	        else nodes.attr(key, value)
	      })
	    }

	    return dom
	  }

	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. Note that `__proto__` is not supported on Internet
	  // Explorer. This method can be overriden in plugins.
	  zepto.Z = function(dom, selector) {
	    dom = dom || []
	    dom.__proto__ = $.fn
	    dom.selector = selector || ''
	    return dom
	  }

	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overriden in plugins.
	  zepto.isZ = function(object) {
	    return object instanceof zepto.Z
	  }

	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overriden in plugins.
	  zepto.init = function(selector, context) {
	    var dom
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z()
	    // Optimize for string selectors
	    else if (typeof selector == 'string') {
	      selector = selector.trim()
	      // If it's a html fragment, create nodes from it
	      // Note: In both Chrome 21 and Firefox 15, DOM error 12
	      // is thrown if the fragment doesn't begin with <
	      if (selector[0] == '<' && fragmentRE.test(selector))
	        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // If it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // If a function is given, call it when the DOM is ready
	    else if (isFunction(selector)) return $(document).ready(selector)
	    // If a Zepto collection is given, just return it
	    else if (zepto.isZ(selector)) return selector
	    else {
	      // normalize array if an array of nodes is given
	      if (isArray(selector)) dom = compact(selector)
	      // Wrap DOM nodes.
	      else if (isObject(selector))
	        dom = [selector], selector = null
	      // If it's a html fragment, create nodes from it
	      else if (fragmentRE.test(selector))
	        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // And last but no least, if it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // create a new Zepto collection from the nodes found
	    return zepto.Z(dom, selector)
	  }

	  // `$` will be the base `Zepto` object. When calling this
	  // function just call `$.zepto.init, which makes the implementation
	  // details of selecting nodes and creating Zepto collections
	  // patchable in plugins.
	  $ = function(selector, context){
	    return zepto.init(selector, context)
	  }

	  function extend(target, source, deep) {
	    for (key in source)
	      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	          target[key] = {}
	        if (isArray(source[key]) && !isArray(target[key]))
	          target[key] = []
	        extend(target[key], source[key], deep)
	      }
	      else if (source[key] !== undefined) target[key] = source[key]
	  }

	  // Copy all but undefined properties from one or more
	  // objects to the `target` object.
	  $.extend = function(target){
	    var deep, args = slice.call(arguments, 1)
	    if (typeof target == 'boolean') {
	      deep = target
	      target = args.shift()
	    }
	    args.forEach(function(arg){ extend(target, arg, deep) })
	    return target
	  }

	  // `$.zepto.qsa` is Zepto's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overriden in plugins.
	  zepto.qsa = function(element, selector){
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	        isSimple = simpleSelectorRE.test(nameOnly)
	    return (isDocument(element) && isSimple && maybeID) ?
	      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
	      slice.call(
	        isSimple && !maybeID ?
	          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	          element.getElementsByTagName(selector) : // Or a tag
	          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	      )
	  }

	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector)
	  }

	  $.contains = document.documentElement.contains ?
	    function(parent, node) {
	      return parent !== node && parent.contains(node)
	    } :
	    function(parent, node) {
	      while (node && (node = node.parentNode))
	        if (node === parent) return true
	      return false
	    }

	  function funcArg(context, arg, idx, payload) {
	    return isFunction(arg) ? arg.call(context, idx, payload) : arg
	  }

	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	  }

	  // access className property while respecting SVGAnimatedString
	  function className(node, value){
	    var klass = node.className || '',
	        svg   = klass && klass.baseVal !== undefined

	    if (value === undefined) return svg ? klass.baseVal : klass
	    svg ? (klass.baseVal = value) : (node.className = value)
	  }

	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    try {
	      return value ?
	        value == "true" ||
	        ( value == "false" ? false :
	          value == "null" ? null :
	          +value + "" == value ? +value :
	          /^[\[\{]/.test(value) ? $.parseJSON(value) :
	          value )
	        : value
	    } catch(e) {
	      return value
	    }
	  }

	  $.type = type
	  $.isFunction = isFunction
	  $.isWindow = isWindow
	  $.isArray = isArray
	  $.isPlainObject = isPlainObject

	  $.isEmptyObject = function(obj) {
	    var name
	    for (name in obj) return false
	    return true
	  }

	  $.inArray = function(elem, array, i){
	    return emptyArray.indexOf.call(array, elem, i)
	  }

	  $.camelCase = camelize
	  $.trim = function(str) {
	    return str == null ? "" : String.prototype.trim.call(str)
	  }

	  // plugin compatibility
	  $.uuid = 0
	  $.support = { }
	  $.expr = { }

	  $.map = function(elements, callback){
	    var value, values = [], i, key
	    if (likeArray(elements))
	      for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i)
	        if (value != null) values.push(value)
	      }
	    else
	      for (key in elements) {
	        value = callback(elements[key], key)
	        if (value != null) values.push(value)
	      }
	    return flatten(values)
	  }

	  $.each = function(elements, callback){
	    var i, key
	    if (likeArray(elements)) {
	      for (i = 0; i < elements.length; i++)
	        if (callback.call(elements[i], i, elements[i]) === false) return elements
	    } else {
	      for (key in elements)
	        if (callback.call(elements[key], key, elements[key]) === false) return elements
	    }

	    return elements
	  }

	  $.grep = function(elements, callback){
	    return filter.call(elements, callback)
	  }

	  if (window.JSON) $.parseJSON = JSON.parse

	  // Populate the class2type map
	  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	    class2type[ "[object " + name + "]" ] = name.toLowerCase()
	  })

	  // Define methods that will be available on all
	  // Zepto collections
	  $.fn = {
	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    indexOf: emptyArray.indexOf,
	    concat: emptyArray.concat,

	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function(fn){
	      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	    },
	    slice: function(){
	      return $(slice.apply(this, arguments))
	    },

	    ready: function(callback){
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    get: function(idx){
	      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	    },
	    toArray: function(){ return this.get() },
	    size: function(){
	      return this.length
	    },
	    remove: function(){
	      return this.each(function(){
	        if (this.parentNode != null)
	          this.parentNode.removeChild(this)
	      })
	    },
	    each: function(callback){
	      emptyArray.every.call(this, function(el, idx){
	        return callback.call(el, idx, el) !== false
	      })
	      return this
	    },
	    filter: function(selector){
	      if (isFunction(selector)) return this.not(this.not(selector))
	      return $(filter.call(this, function(element){
	        return zepto.matches(element, selector)
	      }))
	    },
	    add: function(selector,context){
	      return $(uniq(this.concat($(selector,context))))
	    },
	    is: function(selector){
	      return this.length > 0 && zepto.matches(this[0], selector)
	    },
	    not: function(selector){
	      var nodes=[]
	      if (isFunction(selector) && selector.call !== undefined)
	        this.each(function(idx){
	          if (!selector.call(this,idx)) nodes.push(this)
	        })
	      else {
	        var excludes = typeof selector == 'string' ? this.filter(selector) :
	          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	        this.forEach(function(el){
	          if (excludes.indexOf(el) < 0) nodes.push(el)
	        })
	      }
	      return $(nodes)
	    },
	    has: function(selector){
	      return this.filter(function(){
	        return isObject(selector) ?
	          $.contains(this, selector) :
	          $(this).find(selector).size()
	      })
	    },
	    eq: function(idx){
	      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	    },
	    first: function(){
	      var el = this[0]
	      return el && !isObject(el) ? el : $(el)
	    },
	    last: function(){
	      var el = this[this.length - 1]
	      return el && !isObject(el) ? el : $(el)
	    },
	    find: function(selector){
	      var result, $this = this
	      if (!selector) result = $()
	      else if (typeof selector == 'object')
	        result = $(selector).filter(function(){
	          var node = this
	          return emptyArray.some.call($this, function(parent){
	            return $.contains(parent, node)
	          })
	        })
	      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	      else result = this.map(function(){ return zepto.qsa(this, selector) })
	      return result
	    },
	    closest: function(selector, context){
	      var node = this[0], collection = false
	      if (typeof selector == 'object') collection = $(selector)
	      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	        node = node !== context && !isDocument(node) && node.parentNode
	      return $(node)
	    },
	    parents: function(selector){
	      var ancestors = [], nodes = this
	      while (nodes.length > 0)
	        nodes = $.map(nodes, function(node){
	          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	            ancestors.push(node)
	            return node
	          }
	        })
	      return filtered(ancestors, selector)
	    },
	    parent: function(selector){
	      return filtered(uniq(this.pluck('parentNode')), selector)
	    },
	    children: function(selector){
	      return filtered(this.map(function(){ return children(this) }), selector)
	    },
	    contents: function() {
	      return this.map(function() { return slice.call(this.childNodes) })
	    },
	    siblings: function(selector){
	      return filtered(this.map(function(i, el){
	        return filter.call(children(el.parentNode), function(child){ return child!==el })
	      }), selector)
	    },
	    empty: function(){
	      return this.each(function(){ this.innerHTML = '' })
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function(property){
	      return $.map(this, function(el){ return el[property] })
	    },
	    show: function(){
	      return this.each(function(){
	        this.style.display == "none" && (this.style.display = '')
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	    },
	    replaceWith: function(newContent){
	      return this.before(newContent).remove()
	    },
	    wrap: function(structure){
	      var func = isFunction(structure)
	      if (this[0] && !func)
	        var dom   = $(structure).get(0),
	            clone = dom.parentNode || this.length > 1

	      return this.each(function(index){
	        $(this).wrapAll(
	          func ? structure.call(this, index) :
	            clone ? dom.cloneNode(true) : dom
	        )
	      })
	    },
	    wrapAll: function(structure){
	      if (this[0]) {
	        $(this[0]).before(structure = $(structure))
	        var children
	        // drill down to the inmost element
	        while ((children = structure.children()).length) structure = children.first()
	        $(structure).append(this)
	      }
	      return this
	    },
	    wrapInner: function(structure){
	      var func = isFunction(structure)
	      return this.each(function(index){
	        var self = $(this), contents = self.contents(),
	            dom  = func ? structure.call(this, index) : structure
	        contents.length ? contents.wrapAll(dom) : self.append(dom)
	      })
	    },
	    unwrap: function(){
	      this.parent().each(function(){
	        $(this).replaceWith($(this).children())
	      })
	      return this
	    },
	    clone: function(){
	      return this.map(function(){ return this.cloneNode(true) })
	    },
	    hide: function(){
	      return this.css("display", "none")
	    },
	    toggle: function(setting){
	      return this.each(function(){
	        var el = $(this)
	        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	      })
	    },
	    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	    html: function(html){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var originHtml = this.innerHTML
	          $(this).empty().append( funcArg(this, html, idx, originHtml) )
	        }) :
	        (0 in this ? this[0].innerHTML : null)
	    },
	    text: function(text){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var newText = funcArg(this, text, idx, this.textContent)
	          this.textContent = newText == null ? '' : ''+newText
	        }) :
	        (0 in this ? this[0].textContent : null)
	    },
	    attr: function(name, value){
	      var result
	      return (typeof name == 'string' && !(1 in arguments)) ?
	        (!this.length || this[0].nodeType !== 1 ? undefined :
	          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	        ) :
	        this.each(function(idx){
	          if (this.nodeType !== 1) return
	          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	        })
	    },
	    removeAttr: function(name){
	      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
	        setAttribute(this, attribute)
	      }, this)})
	    },
	    prop: function(name, value){
	      name = propMap[name] || name
	      return (1 in arguments) ?
	        this.each(function(idx){
	          this[name] = funcArg(this, value, idx, this[name])
	        }) :
	        (this[0] && this[0][name])
	    },
	    data: function(name, value){
	      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

	      var data = (1 in arguments) ?
	        this.attr(attrName, value) :
	        this.attr(attrName)

	      return data !== null ? deserializeValue(data) : undefined
	    },
	    val: function(value){
	      return 0 in arguments ?
	        this.each(function(idx){
	          this.value = funcArg(this, value, idx, this.value)
	        }) :
	        (this[0] && (this[0].multiple ?
	           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	           this[0].value)
	        )
	    },
	    offset: function(coordinates){
	      if (coordinates) return this.each(function(index){
	        var $this = $(this),
	            coords = funcArg(this, coordinates, index, $this.offset()),
	            parentOffset = $this.offsetParent().offset(),
	            props = {
	              top:  coords.top  - parentOffset.top,
	              left: coords.left - parentOffset.left
	            }

	        if ($this.css('position') == 'static') props['position'] = 'relative'
	        $this.css(props)
	      })
	      if (!this.length) return null
	      var obj = this[0].getBoundingClientRect()
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)
	      }
	    },
	    css: function(property, value){
	      if (arguments.length < 2) {
	        var computedStyle, element = this[0]
	        if(!element) return
	        computedStyle = getComputedStyle(element, '')
	        if (typeof property == 'string')
	          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
	        else if (isArray(property)) {
	          var props = {}
	          $.each(property, function(_, prop){
	            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	          })
	          return props
	        }
	      }

	      var css = ''
	      if (type(property) == 'string') {
	        if (!value && value !== 0)
	          this.each(function(){ this.style.removeProperty(dasherize(property)) })
	        else
	          css = dasherize(property) + ":" + maybeAddPx(property, value)
	      } else {
	        for (key in property)
	          if (!property[key] && property[key] !== 0)
	            this.each(function(){ this.style.removeProperty(dasherize(key)) })
	          else
	            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	      }

	      return this.each(function(){ this.style.cssText += ';' + css })
	    },
	    index: function(element){
	      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	    },
	    hasClass: function(name){
	      if (!name) return false
	      return emptyArray.some.call(this, function(el){
	        return this.test(className(el))
	      }, classRE(name))
	    },
	    addClass: function(name){
	      if (!name) return this
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        classList = []
	        var cls = className(this), newName = funcArg(this, name, idx, cls)
	        newName.split(/\s+/g).forEach(function(klass){
	          if (!$(this).hasClass(klass)) classList.push(klass)
	        }, this)
	        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	      })
	    },
	    removeClass: function(name){
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        if (name === undefined) return className(this, '')
	        classList = className(this)
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	          classList = classList.replace(classRE(klass), " ")
	        })
	        className(this, classList.trim())
	      })
	    },
	    toggleClass: function(name, when){
	      if (!name) return this
	      return this.each(function(idx){
	        var $this = $(this), names = funcArg(this, name, idx, className(this))
	        names.split(/\s+/g).forEach(function(klass){
	          (when === undefined ? !$this.hasClass(klass) : when) ?
	            $this.addClass(klass) : $this.removeClass(klass)
	        })
	      })
	    },
	    scrollTop: function(value){
	      if (!this.length) return
	      var hasScrollTop = 'scrollTop' in this[0]
	      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	      return this.each(hasScrollTop ?
	        function(){ this.scrollTop = value } :
	        function(){ this.scrollTo(this.scrollX, value) })
	    },
	    scrollLeft: function(value){
	      if (!this.length) return
	      var hasScrollLeft = 'scrollLeft' in this[0]
	      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	      return this.each(hasScrollLeft ?
	        function(){ this.scrollLeft = value } :
	        function(){ this.scrollTo(value, this.scrollY) })
	    },
	    position: function() {
	      if (!this.length) return

	      var elem = this[0],
	        // Get *real* offsetParent
	        offsetParent = this.offsetParent(),
	        // Get correct offsets
	        offset       = this.offset(),
	        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

	      // Subtract element margins
	      // note: when an element has margin: auto the offsetLeft and marginLeft
	      // are the same in Safari causing offset.left to incorrectly be 0
	      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

	      // Add offsetParent borders
	      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

	      // Subtract the two offsets
	      return {
	        top:  offset.top  - parentOffset.top,
	        left: offset.left - parentOffset.left
	      }
	    },
	    offsetParent: function() {
	      return this.map(function(){
	        var parent = this.offsetParent || document.body
	        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	          parent = parent.offsetParent
	        return parent
	      })
	    }
	  }

	  // for now
	  $.fn.detach = $.fn.remove

	  // Generate the `width` and `height` functions
	  ;['width', 'height'].forEach(function(dimension){
	    var dimensionProperty =
	      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

	    $.fn[dimension] = function(value){
	      var offset, el = this[0]
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	        (offset = this.offset()) && offset[dimension]
	      else return this.each(function(idx){
	        el = $(this)
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	      })
	    }
	  })

	  function traverseNode(node, fun) {
	    fun(node)
	    for (var i = 0, len = node.childNodes.length; i < len; i++)
	      traverseNode(node.childNodes[i], fun)
	  }

	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function(operator, operatorIndex) {
	    var inside = operatorIndex % 2 //=> prepend, append

	    $.fn[operator] = function(){
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var argType, nodes = $.map(arguments, function(arg) {
	            argType = type(arg)
	            return argType == "object" || argType == "array" || arg == null ?
	              arg : zepto.fragment(arg)
	          }),
	          parent, copyByClone = this.length > 1
	      if (nodes.length < 1) return this

	      return this.each(function(_, target){
	        parent = inside ? target : target.parentNode

	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling :
	                 operatorIndex == 1 ? target.firstChild :
	                 operatorIndex == 2 ? target :
	                 null

	        var parentInDocument = $.contains(document.documentElement, parent)

	        nodes.forEach(function(node){
	          if (copyByClone) node = node.cloneNode(true)
	          else if (!parent) return $(node).remove()

	          parent.insertBefore(node, target)
	          if (parentInDocument) traverseNode(node, function(el){
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	               (!el.type || el.type === 'text/javascript') && !el.src)
	              window['eval'].call(window, el.innerHTML)
	          })
	        })
	      })
	    }

	    // after    => insertAfter
	    // prepend  => prependTo
	    // before   => insertBefore
	    // append   => appendTo
	    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	      $(html)[operator](this)
	      return this
	    }
	  })

	  zepto.Z.prototype = $.fn

	  // Export internal API functions in the `$.zepto` namespace
	  zepto.uniq = uniq
	  zepto.deserializeValue = deserializeValue
	  $.zepto = zepto

	  return $
	})()

	window.Zepto = Zepto
	window.$ === undefined && (window.$ = Zepto)

	;(function($){
	  var _zid = 1, undefined,
	      slice = Array.prototype.slice,
	      isFunction = $.isFunction,
	      isString = function(obj){ return typeof obj == 'string' },
	      handlers = {},
	      specialEvents={},
	      focusinSupported = 'onfocusin' in window,
	      focus = { focus: 'focusin', blur: 'focusout' },
	      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

	  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	  function zid(element) {
	    return element._zid || (element._zid = _zid++)
	  }
	  function findHandlers(element, event, fn, selector) {
	    event = parse(event)
	    if (event.ns) var matcher = matcherFor(event.ns)
	    return (handlers[zid(element)] || []).filter(function(handler) {
	      return handler
	        && (!event.e  || handler.e == event.e)
	        && (!event.ns || matcher.test(handler.ns))
	        && (!fn       || zid(handler.fn) === zid(fn))
	        && (!selector || handler.sel == selector)
	    })
	  }
	  function parse(event) {
	    var parts = ('' + event).split('.')
	    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	  }
	  function matcherFor(ns) {
	    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	  }

	  function eventCapture(handler, captureSetting) {
	    return handler.del &&
	      (!focusinSupported && (handler.e in focus)) ||
	      !!captureSetting
	  }

	  function realEvent(type) {
	    return hover[type] || (focusinSupported && focus[type]) || type
	  }

	  function add(element, events, fn, data, selector, delegator, capture){
	    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	    events.split(/\s/).forEach(function(event){
	      if (event == 'ready') return $(document).ready(fn)
	      var handler   = parse(event)
	      handler.fn    = fn
	      handler.sel   = selector
	      // emulate mouseenter, mouseleave
	      if (handler.e in hover) fn = function(e){
	        var related = e.relatedTarget
	        if (!related || (related !== this && !$.contains(this, related)))
	          return handler.fn.apply(this, arguments)
	      }
	      handler.del   = delegator
	      var callback  = delegator || fn
	      handler.proxy = function(e){
	        e = compatible(e)
	        if (e.isImmediatePropagationStopped()) return
	        e.data = data
	        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	        if (result === false) e.preventDefault(), e.stopPropagation()
	        return result
	      }
	      handler.i = set.length
	      set.push(handler)
	      if ('addEventListener' in element)
	        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	    })
	  }
	  function remove(element, events, fn, selector, capture){
	    var id = zid(element)
	    ;(events || '').split(/\s/).forEach(function(event){
	      findHandlers(element, event, fn, selector).forEach(function(handler){
	        delete handlers[id][handler.i]
	      if ('removeEventListener' in element)
	        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	      })
	    })
	  }

	  $.event = { add: add, remove: remove }

	  $.proxy = function(fn, context) {
	    var args = (2 in arguments) && slice.call(arguments, 2)
	    if (isFunction(fn)) {
	      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
	      proxyFn._zid = zid(fn)
	      return proxyFn
	    } else if (isString(context)) {
	      if (args) {
	        args.unshift(fn[context], fn)
	        return $.proxy.apply(null, args)
	      } else {
	        return $.proxy(fn[context], fn)
	      }
	    } else {
	      throw new TypeError("expected function")
	    }
	  }

	  $.fn.bind = function(event, data, callback){
	    return this.on(event, data, callback)
	  }
	  $.fn.unbind = function(event, callback){
	    return this.off(event, callback)
	  }
	  $.fn.one = function(event, selector, data, callback){
	    return this.on(event, selector, data, callback, 1)
	  }

	  var returnTrue = function(){return true},
	      returnFalse = function(){return false},
	      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
	      eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	      }

	  function compatible(event, source) {
	    if (source || !event.isDefaultPrevented) {
	      source || (source = event)

	      $.each(eventMethods, function(name, predicate) {
	        var sourceMethod = source[name]
	        event[name] = function(){
	          this[predicate] = returnTrue
	          return sourceMethod && sourceMethod.apply(source, arguments)
	        }
	        event[predicate] = returnFalse
	      })

	      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	          'returnValue' in source ? source.returnValue === false :
	          source.getPreventDefault && source.getPreventDefault())
	        event.isDefaultPrevented = returnTrue
	    }
	    return event
	  }

	  function createProxy(event) {
	    var key, proxy = { originalEvent: event }
	    for (key in event)
	      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

	    return compatible(proxy, event)
	  }

	  $.fn.delegate = function(selector, event, callback){
	    return this.on(event, selector, callback)
	  }
	  $.fn.undelegate = function(selector, event, callback){
	    return this.off(event, selector, callback)
	  }

	  $.fn.live = function(event, callback){
	    $(document.body).delegate(this.selector, event, callback)
	    return this
	  }
	  $.fn.die = function(event, callback){
	    $(document.body).undelegate(this.selector, event, callback)
	    return this
	  }

	  $.fn.on = function(event, selector, data, callback, one){
	    var autoRemove, delegator, $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.on(type, selector, data, fn, one)
	      })
	      return $this
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = data, data = selector, selector = undefined
	    if (isFunction(data) || data === false)
	      callback = data, data = undefined

	    if (callback === false) callback = returnFalse

	    return $this.each(function(_, element){
	      if (one) autoRemove = function(e){
	        remove(element, e.type, callback)
	        return callback.apply(this, arguments)
	      }

	      if (selector) delegator = function(e){
	        var evt, match = $(e.target).closest(selector, element).get(0)
	        if (match && match !== element) {
	          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	        }
	      }

	      add(element, event, callback, data, selector, delegator || autoRemove)
	    })
	  }
	  $.fn.off = function(event, selector, callback){
	    var $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.off(type, selector, fn)
	      })
	      return $this
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = selector, selector = undefined

	    if (callback === false) callback = returnFalse

	    return $this.each(function(){
	      remove(this, event, callback, selector)
	    })
	  }

	  $.fn.trigger = function(event, args){
	    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	    event._args = args
	    return this.each(function(){
	      // handle focus(), blur() by calling them directly
	      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
	      // items in the collection might not be DOM elements
	      else if ('dispatchEvent' in this) this.dispatchEvent(event)
	      else $(this).triggerHandler(event, args)
	    })
	  }

	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function(event, args){
	    var e, result
	    this.each(function(i, element){
	      e = createProxy(isString(event) ? $.Event(event) : event)
	      e._args = args
	      e.target = element
	      $.each(findHandlers(element, event.type || event), function(i, handler){
	        result = handler.proxy(e)
	        if (e.isImmediatePropagationStopped()) return false
	      })
	    })
	    return result
	  }

	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
	  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	    $.fn[event] = function(callback) {
	      return (0 in arguments) ?
	        this.bind(event, callback) :
	        this.trigger(event)
	    }
	  })

	  $.Event = function(type, props) {
	    if (!isString(type)) props = type, type = props.type
	    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	    event.initEvent(type, bubbles, true)
	    return compatible(event)
	  }

	})(Zepto)

	;(function($){
	  var jsonpID = 0,
	      document = window.document,
	      key,
	      name,
	      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      scriptTypeRE = /^(?:text|application)\/javascript/i,
	      xmlTypeRE = /^(?:text|application)\/xml/i,
	      jsonType = 'application/json',
	      htmlType = 'text/html',
	      blankRE = /^\s*$/,
	      originAnchor = document.createElement('a')

	  originAnchor.href = window.location.href

	  // trigger a custom event and return false if it was cancelled
	  function triggerAndReturn(context, eventName, data) {
	    var event = $.Event(eventName)
	    $(context).trigger(event, data)
	    return !event.isDefaultPrevented()
	  }

	  // trigger an Ajax "global" event
	  function triggerGlobal(settings, context, eventName, data) {
	    if (settings.global) return triggerAndReturn(context || document, eventName, data)
	  }

	  // Number of active Ajax requests
	  $.active = 0

	  function ajaxStart(settings) {
	    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	  }
	  function ajaxStop(settings) {
	    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	  }

	  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	  function ajaxBeforeSend(xhr, settings) {
	    var context = settings.context
	    if (settings.beforeSend.call(context, xhr, settings) === false ||
	        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	      return false

	    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	  }
	  function ajaxSuccess(data, xhr, settings, deferred) {
	    var context = settings.context, status = 'success'
	    settings.success.call(context, data, status, xhr)
	    if (deferred) deferred.resolveWith(context, [data, status, xhr])
	    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	    ajaxComplete(status, xhr, settings)
	  }
	  // type: "timeout", "error", "abort", "parsererror"
	  function ajaxError(error, type, xhr, settings, deferred) {
	    var context = settings.context
	    settings.error.call(context, xhr, type, error)
	    if (deferred) deferred.rejectWith(context, [xhr, type, error])
	    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
	    ajaxComplete(type, xhr, settings)
	  }
	  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	  function ajaxComplete(status, xhr, settings) {
	    var context = settings.context
	    settings.complete.call(context, xhr, status)
	    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	    ajaxStop(settings)
	  }

	  // Empty function, used as default callback
	  function empty() {}

	  $.ajaxJSONP = function(options, deferred){
	    if (!('type' in options)) return $.ajax(options)

	    var _callbackName = options.jsonpCallback,
	      callbackName = ($.isFunction(_callbackName) ?
	        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
	      script = document.createElement('script'),
	      originalCallback = window[callbackName],
	      responseData,
	      abort = function(errorType) {
	        $(script).triggerHandler('error', errorType || 'abort')
	      },
	      xhr = { abort: abort }, abortTimeout

	    if (deferred) deferred.promise(xhr)

	    $(script).on('load error', function(e, errorType){
	      clearTimeout(abortTimeout)
	      $(script).off().remove()

	      if (e.type == 'error' || !responseData) {
	        ajaxError(null, errorType || 'error', xhr, options, deferred)
	      } else {
	        ajaxSuccess(responseData[0], xhr, options, deferred)
	      }

	      window[callbackName] = originalCallback
	      if (responseData && $.isFunction(originalCallback))
	        originalCallback(responseData[0])

	      originalCallback = responseData = undefined
	    })

	    if (ajaxBeforeSend(xhr, options) === false) {
	      abort('abort')
	      return xhr
	    }

	    window[callbackName] = function(){
	      responseData = arguments
	    }

	    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
	    document.head.appendChild(script)

	    if (options.timeout > 0) abortTimeout = setTimeout(function(){
	      abort('timeout')
	    }, options.timeout)

	    return xhr
	  }

	  $.ajaxSettings = {
	    // Default type of request
	    type: 'GET',
	    // Callback that is executed before request
	    beforeSend: empty,
	    // Callback that is executed if the request succeeds
	    success: empty,
	    // Callback that is executed the the server drops error
	    error: empty,
	    // Callback that is executed on request complete (both: error and success)
	    complete: empty,
	    // The context for the callbacks
	    context: null,
	    // Whether to trigger "global" Ajax events
	    global: true,
	    // Transport
	    xhr: function () {
	      return new window.XMLHttpRequest()
	    },
	    // MIME types mapping
	    // IIS returns Javascript as "application/x-javascript"
	    accepts: {
	      script: 'text/javascript, application/javascript, application/x-javascript',
	      json:   jsonType,
	      xml:    'application/xml, text/xml',
	      html:   htmlType,
	      text:   'text/plain'
	    },
	    // Whether the request is to another domain
	    crossDomain: false,
	    // Default timeout
	    timeout: 0,
	    // Whether data should be serialized to string
	    processData: true,
	    // Whether the browser should be allowed to cache GET responses
	    cache: true
	  }

	  function mimeToDataType(mime) {
	    if (mime) mime = mime.split(';', 2)[0]
	    return mime && ( mime == htmlType ? 'html' :
	      mime == jsonType ? 'json' :
	      scriptTypeRE.test(mime) ? 'script' :
	      xmlTypeRE.test(mime) && 'xml' ) || 'text'
	  }

	  function appendQuery(url, query) {
	    if (query == '') return url
	    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	  }

	  // serialize payload and append it to the URL for GET requests
	  function serializeData(options) {
	    if (options.processData && options.data && $.type(options.data) != "string")
	      options.data = $.param(options.data, options.traditional)
	    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
	      options.url = appendQuery(options.url, options.data), options.data = undefined
	  }

	  $.ajax = function(options){
	    var settings = $.extend({}, options || {}),
	        deferred = $.Deferred && $.Deferred(),
	        urlAnchor
	    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

	    ajaxStart(settings)

	    if (!settings.crossDomain) {
	      urlAnchor = document.createElement('a')
	      urlAnchor.href = settings.url
	      urlAnchor.href = urlAnchor.href
	      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
	    }

	    if (!settings.url) settings.url = window.location.toString()
	    serializeData(settings)

	    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
	    if (hasPlaceholder) dataType = 'jsonp'

	    if (settings.cache === false || (
	         (!options || options.cache !== true) &&
	         ('script' == dataType || 'jsonp' == dataType)
	        ))
	      settings.url = appendQuery(settings.url, '_=' + Date.now())

	    if ('jsonp' == dataType) {
	      if (!hasPlaceholder)
	        settings.url = appendQuery(settings.url,
	          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
	      return $.ajaxJSONP(settings, deferred)
	    }

	    var mime = settings.accepts[dataType],
	        headers = { },
	        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
	        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	        xhr = settings.xhr(),
	        nativeSetHeader = xhr.setRequestHeader,
	        abortTimeout

	    if (deferred) deferred.promise(xhr)

	    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
	    setHeader('Accept', mime || '*/*')
	    if (mime = settings.mimeType || mime) {
	      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	      xhr.overrideMimeType && xhr.overrideMimeType(mime)
	    }
	    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
	      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

	    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
	    xhr.setRequestHeader = setHeader

	    xhr.onreadystatechange = function(){
	      if (xhr.readyState == 4) {
	        xhr.onreadystatechange = empty
	        clearTimeout(abortTimeout)
	        var result, error = false
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
	          result = xhr.responseText

	          try {
	            // http://perfectionkills.com/global-eval-what-are-the-options/
	            if (dataType == 'script')    (1,eval)(result)
	            else if (dataType == 'xml')  result = xhr.responseXML
	            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
	          } catch (e) { error = e }

	          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
	          else ajaxSuccess(result, xhr, settings, deferred)
	        } else {
	          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
	        }
	      }
	    }

	    if (ajaxBeforeSend(xhr, settings) === false) {
	      xhr.abort()
	      ajaxError(null, 'abort', xhr, settings, deferred)
	      return xhr
	    }

	    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

	    var async = 'async' in settings ? settings.async : true
	    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

	    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

	    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	        xhr.onreadystatechange = empty
	        xhr.abort()
	        ajaxError(null, 'timeout', xhr, settings, deferred)
	      }, settings.timeout)

	    // avoid sending empty string (#319)
	    xhr.send(settings.data ? settings.data : null)
	    return xhr
	  }

	  // handle optional data/success arguments
	  function parseArguments(url, data, success, dataType) {
	    if ($.isFunction(data)) dataType = success, success = data, data = undefined
	    if (!$.isFunction(success)) dataType = success, success = undefined
	    return {
	      url: url
	    , data: data
	    , success: success
	    , dataType: dataType
	    }
	  }

	  $.get = function(/* url, data, success, dataType */){
	    return $.ajax(parseArguments.apply(null, arguments))
	  }

	  $.post = function(/* url, data, success, dataType */){
	    var options = parseArguments.apply(null, arguments)
	    options.type = 'POST'
	    return $.ajax(options)
	  }

	  $.getJSON = function(/* url, data, success */){
	    var options = parseArguments.apply(null, arguments)
	    options.dataType = 'json'
	    return $.ajax(options)
	  }

	  $.fn.load = function(url, data, success){
	    if (!this.length) return this
	    var self = this, parts = url.split(/\s/), selector,
	        options = parseArguments(url, data, success),
	        callback = options.success
	    if (parts.length > 1) options.url = parts[0], selector = parts[1]
	    options.success = function(response){
	      self.html(selector ?
	        $('<div>').html(response.replace(rscript, "")).find(selector)
	        : response)
	      callback && callback.apply(self, arguments)
	    }
	    $.ajax(options)
	    return this
	  }

	  var escape = encodeURIComponent

	  function serialize(params, obj, traditional, scope){
	    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
	    $.each(obj, function(key, value) {
	      type = $.type(value)
	      if (scope) key = traditional ? scope :
	        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
	      // handle data in serializeArray() format
	      if (!scope && array) params.add(value.name, value.value)
	      // recurse into nested objects
	      else if (type == "array" || (!traditional && type == "object"))
	        serialize(params, value, traditional, key)
	      else params.add(key, value)
	    })
	  }

	  $.param = function(obj, traditional){
	    var params = []
	    params.add = function(key, value) {
	      if ($.isFunction(value)) value = value()
	      if (value == null) value = ""
	      this.push(escape(key) + '=' + escape(value))
	    }
	    serialize(params, obj, traditional)
	    return params.join('&').replace(/%20/g, '+')
	  }
	})(Zepto)

	;(function($){
	  $.fn.serializeArray = function() {
	    var name, type, result = [],
	      add = function(value) {
	        if (value.forEach) return value.forEach(add)
	        result.push({ name: name, value: value })
	      }
	    if (this[0]) $.each(this[0].elements, function(_, field){
	      type = field.type, name = field.name
	      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
	        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
	        ((type != 'radio' && type != 'checkbox') || field.checked))
	          add($(field).val())
	    })
	    return result
	  }

	  $.fn.serialize = function(){
	    var result = []
	    this.serializeArray().forEach(function(elm){
	      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	    })
	    return result.join('&')
	  }

	  $.fn.submit = function(callback) {
	    if (0 in arguments) this.bind('submit', callback)
	    else if (this.length) {
	      var event = $.Event('submit')
	      this.eq(0).trigger(event)
	      if (!event.isDefaultPrevented()) this.get(0).submit()
	    }
	    return this
	  }

	})(Zepto)

	;(function($){
	  // __proto__ doesn't exist on IE<11, so redefine
	  // the Z function to use object extension instead
	  if (!('__proto__' in {})) {
	    $.extend($.zepto, {
	      Z: function(dom, selector){
	        dom = dom || []
	        $.extend(dom, $.fn)
	        dom.selector = selector || ''
	        dom.__Z = true
	        return dom
	      },
	      // this is a kludge but works
	      isZ: function(object){
	        return $.type(object) === 'array' && '__Z' in object
	      }
	    })
	  }

	  // getComputedStyle shouldn't freak out when called
	  // without a valid element as argument
	  try {
	    getComputedStyle(undefined)
	  } catch(e) {
	    var nativeGetComputedStyle = getComputedStyle;
	    window.getComputedStyle = function(element){
	      try {
	        return nativeGetComputedStyle(element)
	      } catch(e) {
	        return null
	      }
	    }
	  }
	})(Zepto)


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * mustache.js - Logic-less {{mustache}} templates with JavaScript
	 * http://github.com/janl/mustache.js
	 */

	/*global define: false Mustache: true*/

	(function defineMustache (global, factory) {
	  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
	    factory(exports); // CommonJS
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	  } else {
	    global.Mustache = {};
	    factory(Mustache); // script, wsh, asp
	  }
	}(this, function mustacheFactory (mustache) {

	  var objectToString = Object.prototype.toString;
	  var isArray = Array.isArray || function isArrayPolyfill (object) {
	    return objectToString.call(object) === '[object Array]';
	  };

	  function isFunction (object) {
	    return typeof object === 'function';
	  }

	  /**
	   * More correct typeof string handling array
	   * which normally returns typeof 'object'
	   */
	  function typeStr (obj) {
	    return isArray(obj) ? 'array' : typeof obj;
	  }

	  function escapeRegExp (string) {
	    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	  }

	  /**
	   * Null safe way of checking whether or not an object,
	   * including its prototype, has a given property
	   */
	  function hasProperty (obj, propName) {
	    return obj != null && typeof obj === 'object' && (propName in obj);
	  }

	  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
	  // See https://github.com/janl/mustache.js/issues/189
	  var regExpTest = RegExp.prototype.test;
	  function testRegExp (re, string) {
	    return regExpTest.call(re, string);
	  }

	  var nonSpaceRe = /\S/;
	  function isWhitespace (string) {
	    return !testRegExp(nonSpaceRe, string);
	  }

	  var entityMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '/': '&#x2F;'
	  };

	  function escapeHtml (string) {
	    return String(string).replace(/[&<>"'\/]/g, function fromEntityMap (s) {
	      return entityMap[s];
	    });
	  }

	  var whiteRe = /\s*/;
	  var spaceRe = /\s+/;
	  var equalsRe = /\s*=/;
	  var curlyRe = /\s*\}/;
	  var tagRe = /#|\^|\/|>|\{|&|=|!/;

	  /**
	   * Breaks up the given `template` string into a tree of tokens. If the `tags`
	   * argument is given here it must be an array with two string values: the
	   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
	   * course, the default is to use mustaches (i.e. mustache.tags).
	   *
	   * A token is an array with at least 4 elements. The first element is the
	   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
	   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
	   * all text that appears outside a symbol this element is "text".
	   *
	   * The second element of a token is its "value". For mustache tags this is
	   * whatever else was inside the tag besides the opening symbol. For text tokens
	   * this is the text itself.
	   *
	   * The third and fourth elements of the token are the start and end indices,
	   * respectively, of the token in the original template.
	   *
	   * Tokens that are the root node of a subtree contain two more elements: 1) an
	   * array of tokens in the subtree and 2) the index in the original template at
	   * which the closing tag for that section begins.
	   */
	  function parseTemplate (template, tags) {
	    if (!template)
	      return [];

	    var sections = [];     // Stack to hold section tokens
	    var tokens = [];       // Buffer to hold the tokens
	    var spaces = [];       // Indices of whitespace tokens on the current line
	    var hasTag = false;    // Is there a {{tag}} on the current line?
	    var nonSpace = false;  // Is there a non-space char on the current line?

	    // Strips all whitespace tokens array for the current line
	    // if there was a {{#tag}} on it and otherwise only space.
	    function stripSpace () {
	      if (hasTag && !nonSpace) {
	        while (spaces.length)
	          delete tokens[spaces.pop()];
	      } else {
	        spaces = [];
	      }

	      hasTag = false;
	      nonSpace = false;
	    }

	    var openingTagRe, closingTagRe, closingCurlyRe;
	    function compileTags (tagsToCompile) {
	      if (typeof tagsToCompile === 'string')
	        tagsToCompile = tagsToCompile.split(spaceRe, 2);

	      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
	        throw new Error('Invalid tags: ' + tagsToCompile);

	      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
	      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
	      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
	    }

	    compileTags(tags || mustache.tags);

	    var scanner = new Scanner(template);

	    var start, type, value, chr, token, openSection;
	    while (!scanner.eos()) {
	      start = scanner.pos;

	      // Match any text between tags.
	      value = scanner.scanUntil(openingTagRe);

	      if (value) {
	        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
	          chr = value.charAt(i);

	          if (isWhitespace(chr)) {
	            spaces.push(tokens.length);
	          } else {
	            nonSpace = true;
	          }

	          tokens.push([ 'text', chr, start, start + 1 ]);
	          start += 1;

	          // Check for whitespace on the current line.
	          if (chr === '\n')
	            stripSpace();
	        }
	      }

	      // Match the opening tag.
	      if (!scanner.scan(openingTagRe))
	        break;

	      hasTag = true;

	      // Get the tag type.
	      type = scanner.scan(tagRe) || 'name';
	      scanner.scan(whiteRe);

	      // Get the tag value.
	      if (type === '=') {
	        value = scanner.scanUntil(equalsRe);
	        scanner.scan(equalsRe);
	        scanner.scanUntil(closingTagRe);
	      } else if (type === '{') {
	        value = scanner.scanUntil(closingCurlyRe);
	        scanner.scan(curlyRe);
	        scanner.scanUntil(closingTagRe);
	        type = '&';
	      } else {
	        value = scanner.scanUntil(closingTagRe);
	      }

	      // Match the closing tag.
	      if (!scanner.scan(closingTagRe))
	        throw new Error('Unclosed tag at ' + scanner.pos);

	      token = [ type, value, start, scanner.pos ];
	      tokens.push(token);

	      if (type === '#' || type === '^') {
	        sections.push(token);
	      } else if (type === '/') {
	        // Check section nesting.
	        openSection = sections.pop();

	        if (!openSection)
	          throw new Error('Unopened section "' + value + '" at ' + start);

	        if (openSection[1] !== value)
	          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
	      } else if (type === 'name' || type === '{' || type === '&') {
	        nonSpace = true;
	      } else if (type === '=') {
	        // Set the tags for the next time around.
	        compileTags(value);
	      }
	    }

	    // Make sure there are no open sections when we're done.
	    openSection = sections.pop();

	    if (openSection)
	      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

	    return nestTokens(squashTokens(tokens));
	  }

	  /**
	   * Combines the values of consecutive text tokens in the given `tokens` array
	   * to a single token.
	   */
	  function squashTokens (tokens) {
	    var squashedTokens = [];

	    var token, lastToken;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      if (token) {
	        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
	          lastToken[1] += token[1];
	          lastToken[3] = token[3];
	        } else {
	          squashedTokens.push(token);
	          lastToken = token;
	        }
	      }
	    }

	    return squashedTokens;
	  }

	  /**
	   * Forms the given array of `tokens` into a nested tree structure where
	   * tokens that represent a section have two additional items: 1) an array of
	   * all tokens that appear in that section and 2) the index in the original
	   * template that represents the end of that section.
	   */
	  function nestTokens (tokens) {
	    var nestedTokens = [];
	    var collector = nestedTokens;
	    var sections = [];

	    var token, section;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      switch (token[0]) {
	      case '#':
	      case '^':
	        collector.push(token);
	        sections.push(token);
	        collector = token[4] = [];
	        break;
	      case '/':
	        section = sections.pop();
	        section[5] = token[2];
	        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
	        break;
	      default:
	        collector.push(token);
	      }
	    }

	    return nestedTokens;
	  }

	  /**
	   * A simple string scanner that is used by the template parser to find
	   * tokens in template strings.
	   */
	  function Scanner (string) {
	    this.string = string;
	    this.tail = string;
	    this.pos = 0;
	  }

	  /**
	   * Returns `true` if the tail is empty (end of string).
	   */
	  Scanner.prototype.eos = function eos () {
	    return this.tail === '';
	  };

	  /**
	   * Tries to match the given regular expression at the current position.
	   * Returns the matched text if it can match, the empty string otherwise.
	   */
	  Scanner.prototype.scan = function scan (re) {
	    var match = this.tail.match(re);

	    if (!match || match.index !== 0)
	      return '';

	    var string = match[0];

	    this.tail = this.tail.substring(string.length);
	    this.pos += string.length;

	    return string;
	  };

	  /**
	   * Skips all text until the given regular expression can be matched. Returns
	   * the skipped string, which is the entire tail if no match can be made.
	   */
	  Scanner.prototype.scanUntil = function scanUntil (re) {
	    var index = this.tail.search(re), match;

	    switch (index) {
	    case -1:
	      match = this.tail;
	      this.tail = '';
	      break;
	    case 0:
	      match = '';
	      break;
	    default:
	      match = this.tail.substring(0, index);
	      this.tail = this.tail.substring(index);
	    }

	    this.pos += match.length;

	    return match;
	  };

	  /**
	   * Represents a rendering context by wrapping a view object and
	   * maintaining a reference to the parent context.
	   */
	  function Context (view, parentContext) {
	    this.view = view;
	    this.cache = { '.': this.view };
	    this.parent = parentContext;
	  }

	  /**
	   * Creates a new context using the given view with this context
	   * as the parent.
	   */
	  Context.prototype.push = function push (view) {
	    return new Context(view, this);
	  };

	  /**
	   * Returns the value of the given name in this context, traversing
	   * up the context hierarchy if the value is absent in this context's view.
	   */
	  Context.prototype.lookup = function lookup (name) {
	    var cache = this.cache;

	    var value;
	    if (cache.hasOwnProperty(name)) {
	      value = cache[name];
	    } else {
	      var context = this, names, index, lookupHit = false;

	      while (context) {
	        if (name.indexOf('.') > 0) {
	          value = context.view;
	          names = name.split('.');
	          index = 0;

	          /**
	           * Using the dot notion path in `name`, we descend through the
	           * nested objects.
	           *
	           * To be certain that the lookup has been successful, we have to
	           * check if the last object in the path actually has the property
	           * we are looking for. We store the result in `lookupHit`.
	           *
	           * This is specially necessary for when the value has been set to
	           * `undefined` and we want to avoid looking up parent contexts.
	           **/
	          while (value != null && index < names.length) {
	            if (index === names.length - 1)
	              lookupHit = hasProperty(value, names[index]);

	            value = value[names[index++]];
	          }
	        } else {
	          value = context.view[name];
	          lookupHit = hasProperty(context.view, name);
	        }

	        if (lookupHit)
	          break;

	        context = context.parent;
	      }

	      cache[name] = value;
	    }

	    if (isFunction(value))
	      value = value.call(this.view);

	    return value;
	  };

	  /**
	   * A Writer knows how to take a stream of tokens and render them to a
	   * string, given a context. It also maintains a cache of templates to
	   * avoid the need to parse the same template twice.
	   */
	  function Writer () {
	    this.cache = {};
	  }

	  /**
	   * Clears all cached templates in this writer.
	   */
	  Writer.prototype.clearCache = function clearCache () {
	    this.cache = {};
	  };

	  /**
	   * Parses and caches the given `template` and returns the array of tokens
	   * that is generated from the parse.
	   */
	  Writer.prototype.parse = function parse (template, tags) {
	    var cache = this.cache;
	    var tokens = cache[template];

	    if (tokens == null)
	      tokens = cache[template] = parseTemplate(template, tags);

	    return tokens;
	  };

	  /**
	   * High-level method that is used to render the given `template` with
	   * the given `view`.
	   *
	   * The optional `partials` argument may be an object that contains the
	   * names and templates of partials that are used in the template. It may
	   * also be a function that is used to load partial templates on the fly
	   * that takes a single argument: the name of the partial.
	   */
	  Writer.prototype.render = function render (template, view, partials) {
	    var tokens = this.parse(template);
	    var context = (view instanceof Context) ? view : new Context(view);
	    return this.renderTokens(tokens, context, partials, template);
	  };

	  /**
	   * Low-level method that renders the given array of `tokens` using
	   * the given `context` and `partials`.
	   *
	   * Note: The `originalTemplate` is only ever used to extract the portion
	   * of the original template that was contained in a higher-order section.
	   * If the template doesn't use higher-order sections, this argument may
	   * be omitted.
	   */
	  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
	    var buffer = '';

	    var token, symbol, value;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      value = undefined;
	      token = tokens[i];
	      symbol = token[0];

	      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
	      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
	      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
	      else if (symbol === '&') value = this.unescapedValue(token, context);
	      else if (symbol === 'name') value = this.escapedValue(token, context);
	      else if (symbol === 'text') value = this.rawValue(token);

	      if (value !== undefined)
	        buffer += value;
	    }

	    return buffer;
	  };

	  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
	    var self = this;
	    var buffer = '';
	    var value = context.lookup(token[1]);

	    // This function is used to render an arbitrary template
	    // in the current context by higher-order sections.
	    function subRender (template) {
	      return self.render(template, context, partials);
	    }

	    if (!value) return;

	    if (isArray(value)) {
	      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
	        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
	      }
	    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
	      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
	    } else if (isFunction(value)) {
	      if (typeof originalTemplate !== 'string')
	        throw new Error('Cannot use higher-order sections without the original template');

	      // Extract the portion of the original template that the section contains.
	      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

	      if (value != null)
	        buffer += value;
	    } else {
	      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
	    }
	    return buffer;
	  };

	  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
	    var value = context.lookup(token[1]);

	    // Use JavaScript's definition of falsy. Include empty arrays.
	    // See https://github.com/janl/mustache.js/issues/186
	    if (!value || (isArray(value) && value.length === 0))
	      return this.renderTokens(token[4], context, partials, originalTemplate);
	  };

	  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
	    if (!partials) return;

	    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
	    if (value != null)
	      return this.renderTokens(this.parse(value), context, partials, value);
	  };

	  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return value;
	  };

	  Writer.prototype.escapedValue = function escapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return mustache.escape(value);
	  };

	  Writer.prototype.rawValue = function rawValue (token) {
	    return token[1];
	  };

	  mustache.name = 'mustache.js';
	  mustache.version = '2.1.3';
	  mustache.tags = [ '{{', '}}' ];

	  // All high-level mustache.* functions use this writer.
	  var defaultWriter = new Writer();

	  /**
	   * Clears all cached templates in the default writer.
	   */
	  mustache.clearCache = function clearCache () {
	    return defaultWriter.clearCache();
	  };

	  /**
	   * Parses and caches the given template in the default writer and returns the
	   * array of tokens it contains. Doing this ahead of time avoids the need to
	   * parse templates on the fly as they are rendered.
	   */
	  mustache.parse = function parse (template, tags) {
	    return defaultWriter.parse(template, tags);
	  };

	  /**
	   * Renders the `template` with the given `view` and `partials` using the
	   * default writer.
	   */
	  mustache.render = function render (template, view, partials) {
	    if (typeof template !== 'string') {
	      throw new TypeError('Invalid template! Template should be a "string" ' +
	                          'but "' + typeStr(template) + '" was given as the first ' +
	                          'argument for mustache#render(template, view, partials)');
	    }

	    return defaultWriter.render(template, view, partials);
	  };

	  // This is here for backwards compatibility with 0.4.x.,
	  /*eslint-disable */ // eslint wants camel cased function name
	  mustache.to_html = function to_html (template, view, partials, send) {
	    /*eslint-enable*/

	    var result = mustache.render(template, view, partials);

	    if (isFunction(send)) {
	      send(result);
	    } else {
	      return result;
	    }
	  };

	  // Export the escaping function so that the user may override it.
	  // See https://github.com/janl/mustache.js/issues/244
	  mustache.escape = escapeHtml;

	  // Export these mainly for testing, but also for advanced usage.
	  mustache.Scanner = Scanner;
	  mustache.Context = Context;
	  mustache.Writer = Writer;

	}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function(window) {
	    'use strict';

	    var messageId,

	        /**
	         * Creates wrappers on bridge object for the list of methods provided.
	         * @param {Object} bridgeObj - The bridge object being built with methods as per platform version
	         * @param {Object[]} methodList - List of methods for which wrappers need to be created
	         * @private
	         */
	        _createWrappers = function(bridgeObj, methodList) {
	            var wrapper = function() {
	                    var args = Array.prototype.slice.call(arguments);
	                    _invokeMethod.apply(null, args);
	                },
	                methodKey;

	            for (var i = 0; i < methodList.length; i++) {
	                methodKey = methodList[i];
	                bridgeObj[methodKey] = wrapper.bind(null, methodKey);
	            }
	        },

	        /**
	         * Fallback for method not being available on Android Bridge.
	         * @private
	         */
	        _handleMethodNotAvailable = function() {
	            if (console) {
	                console.log("function not available");
	            }
	        },

	        /**
	         * Invokes method on Android Bridge
	         * @param {string} methodName The name of the method to be invoked
	         * @private
	         */
	        _invokeMethod = function(methodName) {
	            if (typeof PlatformBridge[methodName] === 'function') {
	                PlatformBridge[methodName].apply(PlatformBridge, Array.prototype.slice.call(arguments, 1));
	            } else {
	                _handleMethodNotAvailable();
	            }
	        };

	    /*
	     _______  _______  __   __  __   __  _______  __    _    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
	     |       ||       ||  |_|  ||  |_|  ||       ||  |  | |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
	     |       ||   _   ||       ||       ||   _   ||   |_| |  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
	     |       ||  | |  ||       ||       ||  | |  ||       |  |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
	     |      _||  |_|  ||       ||       ||  |_|  ||  _    |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
	     |     |_ |       || ||_|| || ||_|| ||       || | |   |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
	     |_______||_______||_|   |_||_|   |_||_______||_|  |__|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

	     */

	    var _commonBridgeMethods = {
	        ver0: [
	            /**
	             * Platform Bridge Version 0 Call this function to log analytics events.
	             * @method logAnalytics
	             * @memberOf platformSdk.bridge
	             * @param {string} isUI
	             * @param {string} subType
	             * @param {string} json Stringifed json object
	             */
	            'logAnalytics',

	            /**
	             * Platform Bridge Version 0 calling this function will generate logs for testing at the android IDE.
	             * @method logFromJS
	             * @memberOf platformSdk.bridge
	             * @param {string} tag
	             * @param {string} data
	             */
	            'logFromJS',

	            /**
	             * Platform Bridge Version 0 This function is called whenever the onLoadFinished of the html is called.
	             * @method onLoadFinished
	             * @memberOf platformSdk.bridge
	             * @param {string} height
	             */
	            'onLoadFinished',

	            /**
	             * Platform bridge Version 0 Call this function to open a full page webView within hike.
	             * @method openFullPage
	             * @memberOf platformSdk.bridge
	             * @param {string} title
	             * @param {string} url
	             */
	            'openFullPage',

	            /**
	             * Platform Bridge Version 0 call this function with parameter as true to enable the debugging for javascript.
	             * @method setDebuggableEnabled
	             * @memberOf platformSdk.bridge
	             * @param {string} enabled
	             */
	            'setDebuggableEnabled',

	            /**
	             * Platform Bridge Version 0 calling this function will share the screenshot of the webView along with the text at the top and a caption text to all social network platforms by calling the system's intent.
	             * @method share
	             * @memberOf platformSdk.bridge
	             * @param {string} text
	             * @param {string} caption
	             */
	            'share',

	            /**
	             * Platform Bridge Version 0 calling this function will share the screenshot of the webView along with the text at the top and a caption text to all social
	             * @method showToast
	             * @memberOf platformSdk.bridge
	             * @param {string} toast
	             */
	            'showToast',

	            /**
	             * Platform Bridge Version 0 This function can be used to start a hike native contact chooser/picker which will show all hike contacts to user and user
	             * @method startContactChooser
	             * @memberOf platformSdk.bridge
	             */
	            'startContactChooser',

	            /**
	             * Platform Bridge Version 0 Call this function to vibrate the device.
	             * @method vibrate
	             * @memberOf platformSdk.bridge
	             */
	            'vibrate'
	        ],

	        ver1: [
	            /**
	             * Platform Bridge Version 1 call this function to open a web page in the default browser.
	             * @method openPageInBrowser
	             * @memberOf platformSdk.bridge
	             * @param {string} url
	             */
	            'openPageInBrowser'
	        ],

	        ver3: [
	            /**
	             * Platform Bridge Version 3 Call this function to send email.
	             * @method sendEmail
	             * @memberOf platformSdk.bridge
	             * @param {string} subject
	             * @param {string} body
	             * @param {string} sendTo
	             */
	            'sendEmail',

	            /**
	             * Platform Bridge Version 3 Call this function to enable zooming in webViews.
	             * @method setZoomEnabled
	             * @memberOf platformSdk.bridge
	             * @param {string} enabled
	             */
	            'setZoomEnabled'
	        ],

	        ver5: [
	            /**
	             * Platform Bridge version 5 To download sticker pack
	             * @method downloadStkPack
	             * @memberOf platformSdk.bridge
	             * @param {string} stickerData
	             */
	            'downloadStkPack', // Platform Bridge version 5 To download sticker pack

	            /**
	             * Platform Bridge version 5
	             * @method sendMultiFwdSticker
	             * @memberOf platformSdk.bridge
	             * @param {string} stickerData
	             */
	            'sendMultiFwdSticker'
	        ],

	        ver6: [
	            /**
	             * Platform Bridge version 6 Call this function to close the current activity.
	             * @method closeWebView
	             * @memberOf platformSdk.bridge
	             */
	            'closeWebView'
	        ]
	    };

	    /*
	     __   __  _______  _______  _______  _______  _______  ___   __    _  _______    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
	     |  |_|  ||       ||       ||       ||   _   ||       ||   | |  |  | ||       |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
	     |       ||    ___||  _____||  _____||  |_|  ||    ___||   | |   |_| ||    ___|  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
	     |       ||   |___ | |_____ | |_____ |       ||   | __ |   | |       ||   | __   |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
	     |       ||    ___||_____  ||_____  ||       ||   ||  ||   | |  _    ||   ||  |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
	     | ||_|| ||   |___  _____| | _____| ||   _   ||   |_| ||   | | | |   ||   |_| |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
	     |_|   |_||_______||_______||_______||__| |__||_______||___| |_|  |__||_______|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

	     */

	    var _msgBridgeMethods = {
	        ver0: [
	            /**
	             * Platform Bridge Version 0 calling this function will delete the alarm associated with this javascript.
	             * @method deleteAlarm
	             * @memberOf platformSdk.bridge
	             */
	            'deleteAlarm',

	            /**
	             * Platform Bridge Version 0 call this function to delete the message.
	             * @method deleteMessage
	             * @memberOf platformSdk.bridge
	             */
	            'deleteMessage',

	            /**
	             * Platform Bridge Version 0 Calling this function will initiate forward of the message to a friend or group.
	             * @method forwardToChat
	             * @memberOf platformSdk.bridge
	             * @param {string} json
	             */
	            'forwardToChat',

	            /**
	             * Platform Bridge Version 0 calling this method will forcefully mute the chat thread.
	             * @method muteChatThread
	             * @memberOf platformSdk.bridge
	             */
	            'muteChatThread',

	            /**
	             * Platform Bridge Version 0 Call this function to set the alarm at certain time that is defined by the second parameter.
	             * @method setAlarm
	             * @memberOf platformSdk.bridge
	             * @param {string} json Stringified json
	             * @param {string} timeInMillis
	             */
	            'setAlarm',

	            /**
	             * Platform Bridge Version 0
	             * @method share
	             * @memberOf platformSdk.bridge
	             */
	            'share',

	            /**
	             * Platform Bridge Version 0 this function will update the helper data.
	             * @method updateHelperData
	             * @memberOf platformSdk.bridge
	             * @param {string} json Stringified json
	             */
	            'updateHelperData',

	            /**
	             * Platform Bridge Version 0 Calling this function will update the metadata.
	             * @method updateMetaData
	             * @memberOf platformSdk.bridge
	             * @param {string} json
	             * @param {string} notifyScreen
	             */
	            'updateMetadata'
	        ]
	    };

	    /*
	     __    _  _______  __    _         __   __  _______  _______  _______  _______  _______  ___   __    _  _______    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
	     |  |  | ||       ||  |  | |       |  |_|  ||       ||       ||       ||   _   ||       ||   | |  |  | ||       |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
	     |   |_| ||   _   ||   |_| | ____  |       ||    ___||  _____||  _____||  |_|  ||    ___||   | |   |_| ||    ___|  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
	     |       ||  | |  ||       ||____| |       ||   |___ | |_____ | |_____ |       ||   | __ |   | |       ||   | __   |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
	     |  _    ||  |_|  ||  _    |       |       ||    ___||_____  ||_____  ||       ||   ||  ||   | |  _    ||   ||  |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
	     | | |   ||       || | |   |       | ||_|| ||   |___  _____| | _____| ||   _   ||   |_| ||   | | | |   ||   |_| |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
	     |_|  |__||_______||_|  |__|       |_|   |_||_______||_______||_______||__| |__||_______||___| |_|  |__||_______|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

	     */
	    var _nonMsgBridgeMethods = {
	        ver1: [
	            /**
	             * Platform Bridge Version 1 Call this function to allow the back Press.
	             * @method allowBackPress
	             * @memberOf platformSdk.bridge
	             * @param {string} allowBack
	             */
	            'allowBackPress',

	            /**
	             * Platform Bridge Version 1 calling this method will forcefully block the full screen bot.
	             * @method blockChatThread
	             * @memberOf platformSdk.bridge
	             * @param {string} isBlocked
	             */
	            'blockChatThread',

	            /**
	             * Platform Bridge Version 1 call this function to delete the entire notif data of the microApp.
	             * @method deleteAllNotifData
	             * @memberOf platformSdk.bridge
	             */
	            'deleteAllNotifData',

	            /**
	             * Platform Bridge Version 1 Call this function to delete partial notif data pertaining to a microApp.
	             * @method deletePartialNotifData
	             * @memberOf platformSdk.bridge
	             */
	            'deletePartialNotifData',

	            /**
	             * Platform Bridge Version 1 Utility method to call finish of the current activity
	             * @method finish
	             * @memberOf platformSdk.bridge
	             */
	            'finish',

	            /**
	             * Platform Bridge Version 1 Calling this function will initiate forward of the message to a friend or group.
	             * @method forwardToChat
	             * @param {string} json Stringified json
	             * @param {string} hikeMessage
	             * @memberOf platformSdk.bridge
	             */
	            'forwardToChat',

	            /**
	             * Platform Bridge Version 1 calling this method will forcefully mute the full screen bot.
	             * @method muteChatThread
	             * @memberOf platformSdk.bridge
	             */
	            'muteChatThread',

	            /**
	             * Platform Bridge Version 1 Call this method to put data in cache.
	             * @method putInCache
	             * @param {string} key
	             * @param {string} value
	             * @memberOf platformSdk.bridge
	             */
	            'putInCache',

	            /**
	             * Platform Bridge Version 1 Call this method to put bulk data in cache.
	             * @method putLargeDataInCache
	             * @param {string} json Stringified json
	             * @memberOf platformSdk.bridge
	             */
	            'putLargeDataInCache',

	            /**
	             * Platform Bridge Version 1 Utility method to remove a menu from the list of menu options for a bot
	             * @method removeMenu
	             * @param {string} id
	             * @memberOf platformSdk.bridge
	             */
	            'removeMenu',

	            /**
	             * Platform Bridge Version 1 Utility method to fetch the overflowMenu from the MicroApp.
	             * @method replaceOverflowMenu
	             * @param {string} newMenuString Stringified menu item object
	             * @memberOf platformSdk.bridge
	             */
	            'replaceOverflowMenu',

	            /**
	             * Platform Bridge Version 1 this function will update the helper data.
	             * @method updateHelperData
	             * @param {string} json Stringified helper data object
	             * @memberOf platformSdk.bridge
	             */
	            'updateHelperData',

	            /**
	             * Platform Bridge Version 1 Call this function to update the overflow menu items.
	             * @method updateOverflowMenu
	             * @param {string} itemId
	             * @param {string} itemJson Stringified menu item json
	             * @memberOf platformSdk.bridge
	             */
	            'updateOverflowMenu'
	        ],

	        ver2: [
	            /**
	             * Platform Version 2 called by the special packet sent in the bot to delete the conversation of the particular bot
	             * @method deleteBotConversation
	             * @memberOf platformSdk.bridge
	             */
	            'deleteBotConversation',

	            /**
	             * Platform bridge Version 2 Call this function to open a full page webView within hike.
	             * @method openFullPage
	             * @param {string} title
	             * @param {string} url
	             * @memberOf platformSdk.bridge
	             */
	            'openFullPage'
	        ],

	        ver3: [
	            /**
	             * Platform Version 3 call this method to change the title of the action bar for the bot.
	             * @method changeBotTitle
	             * @param {string} title New title
	             * @memberOf platformSdk.bridge
	             */
	            'changeBotTitle',

	            /**
	             * Platform Bridge Version 3 call this function to delete the entire caching related to the namespace of the bot.
	             * @method deleteAllCacheData
	             * @memberOf platformSdk.bridge
	             */
	            'deleteAllCacheData',

	            /**
	             * Platform Bridge Version 3 Call this function to delete partial cached data pertaining to the namespace of the bot, The key is provided by Javascript
	             * @method deletePartialCacheData
	             * @param {string} key
	             * @memberOf platformSdk.bridge
	             */
	            'deletePartialCacheData',

	            /**
	             * Platform Version 3 call this method to reset the title of the action bar for the bot to the original title sent by server.
	             * @method resetBotTitle
	             * @memberOf platformSdk.bridge
	             */
	            'resetBotTitle'
	        ],

	        ver4: [
	            /**
	             * Platform bridge Version 4 Call this method to change the status bar color at runtime.
	             * @method setStatusBarColor
	             * @param {string} sbColor Status bar color in argb
	             * @memberOf platformSdk.bridge
	             */
	            'setStatusBarColor'
	        ],

	        ver5: [
	            /**
	             * Platform Bridge Version 5 Call this function to allow the up Press.
	             * @method allowUpPress
	             * @param {string} toAllow
	             * @memberOf platformSdk.bridge
	             */
	            'allowUpPress',

	            /**
	             * Platform Bridge Version 5 Call this function to change action bar color at runtime.
	             * @method setActionBarColor
	             * @param {string} abColor Action bar color in argb
	             * @memberOf platformSdk.bridge
	             */
	            'setActionBarColor'
	        ],

	        ver6: [
	            /**
	             * Platform Version 6 This function is made for the special Shared bot that has the information about some other bots as well, and acts as a channel for them.
	             * @method blockBot
	             * @param {string} block
	             * @param {string} msisdn
	             * @memberOf platformSdk.bridge
	             */
	            'blockBot',

	            /**
	             * Platform Version 6 Call this function to delete all the events, be it shared data or normal event pertaining to a single message.
	             * @method deleteAllEventsForMessage
	             * @param {string} messageHash
	             * @memberOf platformSdk.bridge
	             */
	            'deleteAllEventsForMessage',

	            /**
	             * Platform Version 6 Call this function to delete an event from the list of events that are shared with the microapp.
	             * @method deleteEvent
	             * @param {string} eventId
	             * @memberOf platformSdk.bridge
	             */
	            'deleteEvent',

	            /**
	             * Platform Bridge Version 6 Call this method to post a status update to timeline.
	             * @method postStatusUpdate
	             * @param {string} status
	             * @param {string} moodId
	             * @param {string} [imageFilePath]
	             * @memberOf platformSdk.bridge
	             */
	            'postStatusUpdate',

	            /**
	             * Platform version 6 Call this method to send a normal event.
	             * @method sendNormalEvent
	             * @param {string} messageHash
	             * @param {string} eventData
	             * @memberOf platformSdk.bridge
	             */
	            'sendNormalEvent',

	            /**
	             * Platform Version 6 Call this function to send a shared message to the contacts of the user.
	             * @method sendSharedMessage
	             * @param {string} cardObject Stringified card object
	             * @param {string} hikeMessage
	             * @param {string} sharedData Stringified json
	             * @memberOf platformSdk.bridge
	             */
	            'sendSharedMessage' // Platform Version 6 Call this function to send a shared message to the contacts of the user.
	        ]
	    };

	    /**
	     * Initiates android bridge.
	     * @param platformVersion
	     * @param appType
	     * @param appMessageId
	     * @returns {Object}
	     */
	    window.initiateBridge = function(platformVersion, appType, appMessageId) {
	        var _bridge, bridgeMethods, counter;

	        /**
	         * Methods to interact with the Android Bridge.
	         *
	         * @namespace platformSdk.bridge
	         * @memberOf platformSdk
	         */
	        _bridge = {};

	        messageId = appMessageId;

	        bridgeMethods = appType === 'NM' ? _nonMsgBridgeMethods : _msgBridgeMethods;

	        for (counter = 0; counter <= parseInt(platformVersion); counter++) {
	            var versionKey = 'ver' + counter,
	                baseMethodList = _commonBridgeMethods[versionKey],
	                bridgeMethodList = bridgeMethods[versionKey];

	            baseMethodList && _createWrappers(_bridge, baseMethodList);
	            bridgeMethodList && _createWrappers(_bridge, bridgeMethodList);
	        }

	        return _bridge;
	    };

	})(window);

	/**
	 * @namespace platformSdk
	 */

	window.platformSdk = function(window, undefined) {
	    "use strict";

	    //classlist hack for android 2.3 and below
	    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== "undefined") {
	        Object.defineProperty(HTMLElement.prototype, "classList", {
	            get: function() {
	                function t(t) {
	                    return function(n) {
	                        var r = e.className.split(/\s+/),
	                            i = r.indexOf(n);
	                        t(r, i, n);
	                        e.className = r.join(" ");
	                    };
	                }

	                var e = this;
	                var n = {
	                    add: t(function(e, t, n) {
	                        ~t || e.push(n);
	                    }),
	                    remove: t(function(e, t) {
	                        ~t && e.splice(t, 1);
	                    }),
	                    toggle: t(function(e, t, n) {
	                        ~t ? e.splice(t, 1) : e.push(n);
	                    }),
	                    contains: function(t) {
	                        return !!~e.className.split(/\s+/).indexOf(t);
	                    },
	                    item: function(t) {
	                        return e.className.split(/\s+/)[t] || null;
	                    }
	                };
	                Object.defineProperty(n, "length", {
	                    get: function() {
	                        return e.className.split(/\s+/).length;
	                    }
	                });
	                return n;
	            }
	        });
	    }

	    var platformVersion = parseInt(document.getElementsByTagName('body')[0].getAttribute("data-platform-version")) || 0;
	    var appType = document.getElementsByTagName('body')[0].getAttribute("data-app-type") || 'M';
	    var messageId = document.getElementsByTagName('body')[0].getAttribute('data-message-id');

	    var platformBridge = window.initiateBridge(platformVersion, appType);

	    var fireAppInit = function() {
	        var cardHeight = document.body.offsetHeight;
	        if (platformBridge) platformSdk.ui.onLoadFinished(cardHeight + "");

	        if ('M' === appType) {
	            setTimeout(function() {
	                cardHeight = document.body.offsetHeight;

	                if (Math.abs(window.innerHeight - cardHeight) > 5 && platformBridge) {
	                    platformSdk.ui.resize(cardHeight);
	                    platformSdk.events.publish('onnativeready');
	                }
	            }, 100);
	        }
	    };

	    window.onload = fireAppInit;

	    /**
	     * Called by the android to pass on the initial data to micro app
	     * @function
	     * @global
	     * @param {String} msisdn - msisdn of micro app.
	     * @param {Object} helperData - helper data for the micro app.
	     * @param {Boolean} isSent - isSent
	     * @param {String} uid - uid
	     * @param {String} appVersion - app version
	     */
	    var setData = function(msisdn, helperData, isSent, uid, appVersion) {

	        var appData = {
	            msisdn: msisdn,
	            isSent: isSent,
	            uid: uid,
	            appVersion: appVersion
	        };

	        appData.helperData = JSON.parse(helperData);
	        setAppData(appData);
	    };

	    var appInitialized = false;


	    /**
	     * Called by the android to pass on the initial data to micro app
	     * @function
	     * @global
	     * @param {Object} appData - application data passed to the micro app on startup
	     */
	    var setAppData = function(appData) {

	        if (appInitialized) return;
	        else appInitialized = true;

	        if (typeof appData === 'string') {
	            appData = decodeURIComponent(appData);
	            appData = JSON.parse(appData);
	        }

	        if (appData.hd) {
	            appData.helperData = JSON.parse(appData.hd);
	            delete appData.hd;
	        }

	        if (appData.msisdn) {

	            platformSdk.appData = appData;

	            /*for (var key in appData) {
	             platformSdk[key] = appData[key];
	             }*/

	            if (appData.helperData) {
	                if (appData.helperData.debug) {
	                    platformSdk.debugMode = true;
	                    platformSdk.logger.logLoadTimeInfo();
	                    platformBridge.setDebuggableEnabled(true);
	                }
	            } else platformSdk.appData.helperData = {};
	        }

	        platformSdk.events.publish('webview/data/loaded');

	        if (platformSdk.appData && platformSdk.appData.helperData && platformSdk.appData.helperData.cardExpireTime) {
	            PlatformBridge.setAlarm('{"alarm_data": {"isAlarmSet": 0},  "conv_msisdn" :"' + platformSdk.msisdn + '", "inc_unread": "0", "delete_card": true}', platformSdk.helperData.cardExpireTime.toString());
	        }
	    };

	    window.setData = setData;

	    /**
	     * Called by the android to pass on the initial data to micro app
	     * @function
	     * @global
	     */
	    window.onResume = function() {
	        platformSdk.events.publish('app/onresume');
	    };

	    /**
	     * Called by the android on exit from the micro app.
	     * @function
	     * @global
	     * @fire 'app/onbeforeunload'
	     */
	    window.onPause = function() {
	        platformSdk.events.publish('app/onbeforeunload');
	    };

	    if (typeof PlatformBridge === "undefined") window.onload = setAppData;

	    window.init = setAppData;

	    return {
	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        VERSION: '0.0.1',

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        card: '',

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        msisdn: null,

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {Boolean}
	         */
	        bridgeEnabled: true, // ToDo: This should be dynamically set

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        platformVersion: platformVersion,

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        appType: appType,

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {String}
	         */
	        messageId: messageId,

	        /**
	         * @memberOf platformSdk
	         * @inner
	         * @type {Object}
	         */
	        bridge: platformBridge,


	        /**
	         * Specify a function to execute when the micro-app and android bridge are fully loaded.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {function} fn - function to be called once the 'webview/data/loaded' event has been fired
	         */
	        ready: function(fn) {
	            var that = this;
	            var start = platformSdk.events.subscribe('webview/data/loaded', function() {
	                that.bridgeEnabled = that.checkBridge();
	                if (typeof fn === "function") fn();
	                start.remove();
	            });
	        },

	        /**
	         * checks if android bridge is available or not
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {function} fn - function to be called once the 'webview/data/loaded' event has been fired
	         * @return {Boolean} 'true' if bridge available, 'false' otherwise
	         */
	        checkBridge: function() {
	            return typeof PlatformBridge === "undefined" ? false : true;
	        },

	        /**
	         * Blocks the current chat thread. The user won't see any messages in the chat thread afterwards.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         */
	        blockChatThread: function() {
	            platformBridge.blockChatThread("true");
	        },

	        /**
	         * Un-blocks the current chat thread.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         */
	        unblockChatThread: function() {
	            platformBridge.blockChatThread("false");
	        },

	        /**
	         * Deletes the current message.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         */
	        deleteMessage: function() {
	            platformBridge.deleteMessage();
	        },


	        /**
	         * Updates the metadata of the app.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {Object} data - new metaData object
	         * @param {boolean} notifyScreen - if true, the adapter will be notified of the change, else there will be only db update.
	         */
	        updateMetadata: function(data, notifyScreen) {
	            platformBridge.updateMetadata(platformSdk.utils.validateStringifyJson(data), notifyScreen);
	        },


	        /**
	         * Opens the given link in a full screen webview.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {String} title - title of the new page.
	         * @param {String} href - url of the web page to be opened in full screen.
	         */
	        openFullPage: function(title, href) {
	            platformBridge.openFullPage(title, href);
	        },


	        /**
	         * Mutes the current chat thread. The user won't receive any more notifications there after.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         */
	        muteChatThread: function() {
	            platformBridge.muteChatThread();
	        },

	        /**
	         * Deletes any alarm set by the micro app
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         */
	        deleteAlarm: function() {
	            platformBridge.deleteAlarm();
	        },

	        /**
	         * Updates the helper data of the micro app.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {Object} data - new helper data object
	         */
	        updateHelperData: function(data) {
	            if (typeof platformBridge.updateHelperData === "function") platformBridge.updateHelperData(platformSdk.utils.validateStringifyJson(data));
	            else platformSdk.events.publish('app.noHelperData', data);
	        },

	        /**
	         * puts large data in the cache for the microapp.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {Object} data - data object to be put into cache
	         */
	        setBlob: function(data) {
	            var str = platformSdk.utils.validateStringifyJson(data);
	            platformBridge.putLargeDataInCache(str);
	        },

	        /**
	         * sets an alarm for the micro app for the given time.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @param {Object} alarmData - data to pass for setting alarm
	         * @param {Object} nextPollIt - time in milli seconds.
	         */
	        setAlarm: function(alarmData, nextPollIt) {
	            if (typeof alarmData !== 'string')
	                alarmData = platformSdk.utils.validateStringifyJson(alarmData);

	            platformBridge.setAlarm(alarmData, nextPollIt);
	        },

	        /**
	         * Gets the latest data received by the app through notifications.
	         * @function
	         * @memberOf platformSdk
	         * @inner
	         * @return {Object} latest notification data object
	         */
	        getLatestNotifData: function() {
	            var notifData = platformSdk.appData.notifData;

	            var arr = [];
	            for (var key in notifData) {
	                arr.push(key);
	            }

	            arr.sort(function(a, b) {
	                return b - a;
	            });
	            return notifData[arr[0]];
	        }
	    };
	}(window);

	if (true) {
	    module.exports = platformSdk;
	}

	/**
	 * General utility function.
	 * @namespace platformSdk.utils
	 * @memberOf platformSdk
	 */
	platformSdk.utils = function(window, platformSdk) {

	    var platformBridge = platformSdk.bridge;

	    (function() {
	        var cache = {};
	        this.tmpl = function tmpl(str, data) {
	            var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
	            return data ? fn(data) : fn;
	        };
	    })();

	    return {
	        /**
	         * Logs the given message and caption
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {String} msg - message string to be logged
	         * @param {String} caption - caption for the log
	         */
	        log: function(msg, caption) {
	            if (platformSdk.bridgeEnabled) platformBridge.logFromJS("platform-js-sdk", msg);
	            if (console) {
	                if (caption)
	                    console.log(caption + ":");
	                console.log(msg);
	            }
	        },

	        debug: function(object) {
	            if (platformSdk.bridgeEnabled) platformBridge.logFromJS("platform-js-sdk", this.validateStringifyJson(object));
	        },

	        /**
	         * Logs the analytics to the analytics server
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Boolean} isUI - whether the event is a UI event or not
	         * @param {String} type - the subtype of the event to be logged, eg. send "click", to determine whether it is a click event.
	         * @param {Object} analyticEvents  - the analytics event object
	         */
	        logAnalytics: function(isUI, type, analyticEvents) {
	            analyticEvents = this.validateStringifyJson(analyticEvents);
	            this.log("analytic with isui = " + isUI + " type = " + type + " analyticEvents = " + analyticEvents);
	            if (platformSdk.bridgeEnabled) PlatformBridge.logAnalytics(isUI, type, analyticEvents);
	        },

	        /**
	         * Validates and stringify a passed json Object
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Object} josn - json object to be validated and strigified
	         * @return {String} stringified json
	         */
	        validateStringifyJson: function(json) {
	            //HACK to handle the helperdata bug. we cannot have \" or ' in the str.
	            var jsonString = JSON.stringify(json);
	            jsonString = jsonString.replace(/\\"/g, "&quot;");
	            jsonString = jsonString.replace(/'/g, "&#39;");
	            jsonString = jsonString.replace(/\\n/g, " ");
	            return jsonString;
	        },

	        /**
	         * Merges 2 arrays while removing the duplicate enteries.
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Array} array1 - first array
	         * @param {Array} array2 - second array to be merged
	         * @return {Array} merged array
	         */
	        merge: function(array1, array2) {
	            var array = array1.concat(array2);
	            for (var i = 0; i < array.length; i++) {
	                for (var j = i + 1; j < array.length; j++) {
	                    if (array[i] === array[j])
	                        array.splice(j--, 1);
	                }
	            }
	            return array;
	        },

	        /**
	         * Sort an array with the given key
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Array} array - Array to be sorted
	         * @param {String} key - key to sort the array with
	         * @param {String} type - type of sorting, 'asc' for ascending and 'desc' for descending
	         */
	        sort: function(array, key, type) {
	            type = type || 'asc';
	            return array.sort(function(a, b) {
	                var x = a[key];
	                var y = b[key];
	                if (type === "asc") return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	                else return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	            });
	        },

	        /**
	         * Determines if object is empty(has no properties of his own)
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Object} obj - Object to be checked for emptiness
	         * @return {Boolean} true if object is empty, false otherwise.
	         */
	        isEmpty: function(obj) {
	            for (var prop in obj) {
	                if (obj.hasOwnProperty(prop))
	                    return false;
	            }

	            return true;
	        },

	        /**
	         * Adds a given function as an event listener for a list of node elements
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Array} list - list of node elemnets
	         * @param {String} event - event name
	         * @param {Function} fn - listener function
	         */
	        addEventListenerList: function(list, event, fn) {
	            for (var i = 0, len = list.length; i < len; i++) {
	                list[i].addEventListener(event, fn, false);
	            }
	        },

	        /**
	         * Removes a given function as an event listener for a list of node elements
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Array} list - list of node elemnets
	         * @param {String} event - event name
	         * @param {Function} fn - listener function to be removed
	         */
	        removeEventListenerList: function(list, event, fn) {
	            for (var i = 0, len = list.length; i < len; i++) {
	                list[i].removeEventListener(event, fn, false);
	            }
	        },

	        /**
	         * returns a list of all siblings of the given element
	         * @param  {nodeElement} ele - element whose siblings are required
	         * @return {Array} list of siblings
	         */
	        siblings: function(ele) {
	            function getChildren(ele, skipMe) {
	                var r = [];
	                var elem = null;
	                for (; ele; ele = ele.nextSibling)
	                    if (ele.nodeType == 1 && ele != skipMe)
	                        r.push(ele);
	                return r;
	            }

	            return getChildren(ele.parentNode.firstChild, ele);
	        },

	        /**
	         * Scrolls down a given element to the given Y position
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {HtmlNode} elem - element to scroll
	         * @param {Number} Y - position to scroll to
	         * @param {Number} duration - scroll duration in milliseconds
	         * @param {Function} easingFunction - easing function to scroll with
	         * @param {Function} callback - callback once the scroll is complete
	         */
	        scrollTo: function(elem, Y, duration, easingFunction, callback) {

	            if (typeof elem == "undefined")
	                elem = document.documentElement.scrollTop ? document.documentElement : document.body;
	            var start = Date.now();
	            var from = elem.scrollTop;

	            if (from === Y) {
	                if (callback) callback();
	                return;
	                /* Prevent scrolling to the Y point if already there */
	            }

	            function min(a, b) {
	                return a < b ? a : b;
	            }

	            function scroll() {

	                var currentTime = Date.now(),
	                    time = min(1, ((currentTime - start) / duration)),
	                    easedT = easingFunction(time);

	                elem.scrollTop = (easedT * (Y - from)) + from;

	                if (time < 1) requestAnimationFrame(scroll);
	                else if (callback) callback();
	            }

	            requestAnimationFrame(scroll);
	        },

	        /**
	         * common easing function, each of them require time duration as input
	         * @namespace
	         * @memberOf platformSdk.utils
	         * @inner
	         * @property {Function} linear - no easing, no acceleration
	         * @property {Function} easeInQuad - accelerating from zero velocity
	         * @property {Function} easeOutQuad - decelerating to zero velocity
	         * @property {Function} easeInOutQuad - acceleration until halfway, then deceleration
	         * @property {Function} easeInCubic - accelerating from zero velocity
	         * @property {Function} easeOutCubic - decelerating to zero velocity
	         * @property {Function} easeInOutCubic - acceleration until halfway, then deceleration
	         * @property {Function} easeInQuart - accelerating from zero velocity
	         * @property {Function} easeOutQuart - decelerating to zero velocity
	         * @property {Function} easeInOutQuart - acceleration until halfway, then deceleration
	         * @property {Function} easeInQuint - accelerating from zero velocity
	         * @property {Function} easeOutQuint - decelerating to zero velocity
	         * @property {Function} easeInOutQuint - acceleration until halfway, then deceleration
	         */
	        easing: {
	            // no easing, no acceleration
	            linear: function(t) {
	                return t;
	            },

	            // accelerating from zero velocity
	            easeInQuad: function(t) {
	                return t * t;
	            },

	            // decelerating to zero velocity
	            easeOutQuad: function(t) {
	                return t * (2 - t);
	            },

	            // acceleration until halfway, then deceleration
	            easeInOutQuad: function(t) {
	                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	            },

	            // accelerating from zero velocity
	            easeInCubic: function(t) {
	                return t * t * t;
	            },

	            // decelerating to zero velocity
	            easeOutCubic: function(t) {
	                return (--t) * t * t + 1;
	            },

	            // acceleration until halfway, then deceleration
	            easeInOutCubic: function(t) {
	                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	            },

	            // accelerating from zero velocity
	            easeInQuart: function(t) {
	                return t * t * t * t;
	            },

	            // decelerating to zero velocity
	            easeOutQuart: function(t) {
	                return 1 - (--t) * t * t * t;
	            },

	            // acceleration until halfway, then deceleration
	            easeInOutQuart: function(t) {
	                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	            },

	            // accelerating from zero velocity
	            easeInQuint: function(t) {
	                return t * t * t * t * t;
	            },

	            // decelerating to zero velocity
	            easeOutQuint: function(t) {
	                return 1 + (--t) * t * t * t * t;
	            },

	            // acceleration until halfway, then deceleration
	            easeInOutQuint: function(t) {
	                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	            }
	        },

	        /**
	         * get the height of a dom element
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {NodeElement} el - dom element
	         * @return {Number} height of the given element
	         */
	        getHeight: function(el) {
	            var children = el.children;
	            var len = children.length;
	            var height = 0;

	            for (var i = 0; i < len; i++) {
	                height = height + parseInt(children[i].offsetHeight);
	            }
	            return height;
	        },

	        /**
	         * Find the closest elemnt of a given dom element
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {NodeElement} el - Dom element to find closest of
	         * @param {String} tag - elemnt to search for closest to el
	         * @return {NodeElement} closest element
	         */
	        closest: function(el, tag) {
	            tag = tag.toUpperCase();
	            do {
	                if (el.nodeName === tag) return el;
	            } while (el = el.parentNode);

	            return null;
	        },

	        /**
	         * The debounce function will not allow a callback to be used more than once per given time frame.
	         * @function
	         * @memberOf platformSdk.utils
	         * @inner
	         * @param {Function} func - the callback function
	         * @param {Number} wait - wait time in milliseconds
	         * @param {Boolean} immediate - if true callback will be executed on the leading edge instead of trailing edge
	         * @return {Function} Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for 'wait' milliseconds. If `immediate` is passed, the callback function will be triggered on the leading edge, instead of the trailing.
	         */
	        debounce: function(func, wait, immediate) {
	            var timeout;
	            return function() {
	                var context = this,
	                    args = arguments;
	                var later = function() {
	                    timeout = null;
	                    if (!immediate) func.apply(context, args);
	                };
	                var callNow = immediate && !timeout;
	                clearTimeout(timeout);
	                timeout = setTimeout(later, wait);
	                if (callNow) func.apply(context, args);
	            };
	        }
	    };

	}(window, window.platformSdk);


	/**
	 * @namespace platformSdk.events
	 * @memberOf platformSdk
	 */
	platformSdk.events = function(window, platformSdk) {
	    var events = {};
	    var hOP = events.hasOwnProperty;
	    var platformBridge = platformSdk.bridge;

	    return {
	        /**
	         * Subscribe to an event and attach a listener function to be called whenever that event is published
	         * @function
	         * @memberOf platformSdk.events
	         * @param {String} eventName - name of the event you wish to subscribe to
	         * @param {Function} listener - function to be executed each time the event is published
	         * @return {Object} an object with a remove function to remove the event subscription
	         */
	        subscribe: function(eventName, listener) {
	            if (!hOP.call(events, eventName)) events[eventName] = [];
	            var index = events[eventName].push(listener) - 1;
	            return {
	                remove: function() {
	                    delete events[eventName][index];
	                }
	            };
	        },


	        /**
	         * Publish an event.
	         * @function
	         * @memberOf platformSdk.events
	         * @param {String} eventName - name of the event you wish to publish
	         * @param {Object} data - data to be passed to the listener function
	         */
	        publish: function(eventName, data) {
	            if (!hOP.call(events, eventName))
	                return;
	            events[eventName].forEach(function(item) {
	                item(data != undefined ? data : {});
	            });
	        }
	    };

	}(window, window.platformSdk);

	(function(window, platformSdk) {
	    var callbacks = {};
	    var eventsObject = {};

	    function getNewId() {
	        var cbId = Math.round(Math.random() * 999999999);
	        while (cbId in callbacks) {
	            cbId = Math.round(Math.random() * 999999999);
	        }
	        return cbId;
	    }

	    /**
	     * Called by the android to return the response for the action asked by the microapp through platformSdk.nativeReq function.
	     * @function
	     * @global
	     * @param {String} id - unique id to map the response to the action.
	     * @param {Object} data - data in response from the android.
	     */
	    window.callbackFromNative = function(id, data) {

	        var args, cbItem = callbacks[id];
	        if (cbItem && typeof(cbItem.callback) === 'function') {
	            cbItem.callback.call(cbItem.context, data);
	        }

	        delete callbacks[id];
	    };

	    /**
	     * calling an action from android and accepting a success callback to be called with data from android in response
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {Object} param - object containing the configuration for communication with android
	     */
	    platformSdk.nativeReq = function(param) {

	        var callBackId = "" + getNewId();

	        callbacks[callBackId] = {
	            context: param.ctx,
	            callback: param.success
	        };

	        if (platformSdk.bridgeEnabled) {
	            if (param.data === "" || param.data === undefined || param.data === null) PlatformBridge[param.fn](callBackId);
	            else PlatformBridge[param.fn](callBackId, param.data);
	        }
	    };


	    /**  New Function for AB exp functions
	     * calling an action from android and accepting a success callback to be called with data from android in response
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {Object} param - object containing the configuration for communication with android
	     */
	    platformSdk.nativeReqAB = function(param) {

	        var callBackId = "" + getNewId();

	        callbacks[callBackId] = {
	            context: param.ctx,
	            callback: param.success
	        };

	        if (platformSdk.bridgeEnabled) {
	            if (param.data === "" || param.data === undefined || param.data === null) PlatformBridge[param.fn](callBackId);
	            else PlatformBridge[param.fn](callBackId, param.data[0], param.data[1]);
	        }
	    };



	    /**
	     * Setting up 3-dot menu options and setting up callbacks for each of them
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {Object} omList - object containing the 3-dot menu options.
	     */
	    platformSdk.setOverflowMenu = function(omList) {
	        for (var i = 0; i < omList.length; i++) {
	            var omItem = omList[i];
	            var eventId = getNewId();
	            callbacks[eventId] = omItem;
	            omItem.id = eventId;
	        }

	        omListObject = omList;

	        if (platformSdk.bridgeEnabled) PlatformBridge.replaceOverflowMenu(platformSdk.utils.validateStringifyJson(omList));
	    };


	    /**
	     * Called from android on click of 3-dot menu items
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {String} id - id of the clicked menu item
	     */
	    platformSdk.onMenuItemClicked = function(id) {
	        platformSdk.events.publish(callbacks[id].eventName, id);
	    };

	    /**
	     * updating the 3-dot menu options and setting up callbacks for each of them
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {Object} omList - object containing the 3-dot menu options.
	     */
	    platformSdk.updateOverflowMenu = function(id, c) {
	        var obj = callbacks[id];
	        for (var key in c) {
	            obj[key] = c[key];
	        }

	        console.log('updateOverflowMenu object: ', id, obj);
	        if (platformSdk.bridgeEnabled) PlatformBridge.updateOverflowMenu(id, platformSdk.utils.validateStringifyJson(obj));
	    };

	    /**
	     * Get the id of the 3-dot menu item by their event name
	     * @function
	     * @memberOf platformSdk
	     * @inner
	     * @param {String} eventName - event name of the required 3-dot menu item
	     * @return {String} id of the required 3-dot menu item
	     */
	    platformSdk.retrieveId = function(eventName) {
	        for (var i = 0; i < omListObject.length; i++) {
	            var omItem = omListObject[i];
	            if (omItem.eventName === eventName) return omItem.id;
	        }
	    };

	})(window, window.platformSdk);

	platformSdk.device = function(window, platformSdk) {

	    "use strict";

	    var platformBridge = platformSdk.bridge;

	    return {};

	}(window, window.platformSdk);

	platformSdk.network = function(window, platformSdk) {

	    "use strict";

	    var platformBridge = platformSdk.bridge;

	    return {};

	}(window, window.platformSdk);

	platformSdk.user = function(window, platformSdk) {

	    "use strict";
	    var platformBridge = platformSdk.bridge;

	    return {};

	}(window, window.platformSdk);

	/**
	 * Microapp UI functions
	 * @namespace platformSdk.ui
	 * @memberOf platformSdk
	 */
	platformSdk.ui = function(window, platformSdk) {

	    var platformBridge = platformSdk.bridge;

	    var shareMessage;
	    var captionText;

	    platformSdk.events.subscribe('refresh/startAnimation/', function(ele) {
	        ele.classList.add('play');
	    });

	    platformSdk.events.subscribe('refresh/stopAnimation/', function(ele) {
	        ele.classList.remove('play');
	    });

	    if (!platformSdk.checkBridge) return false;
	    return {

	        /**
	         * Communicate the Android about windows onload being finished, so that webview can be resized if required.
	         * @function
	         * @memberOf platformSdk.ui
	         * @inner
	         * @param {String} height - offsetHeight of the document.body
	         */
	        onLoadFinished: function(height) {
	            platformBridge.onLoadFinished(height + "");
	        },

	        /**
	         * Resize webview to a new height
	         * @function
	         * @memberOf platformSdk.ui
	         * @inner
	         * @param {String} height - height to be resized to
	         */
	        resize: function(height) {
	            height = height || document.body.offsetHeight;
	            platformBridge.onResize(height + "");
	        },

	        /**
	         * Shows toast message to the user
	         * @function
	         * @memberOf platformSdk.ui
	         * @inner
	         * @param {String} msg - message to be shown in toast
	         */
	        showToast: function(msg) {
	            platformBridge.showToast(msg);
	        },


	        /**
	         * Share the current card to other users
	         * @function
	         * @memberOf platformSdk.ui
	         * @inner
	         * @param {Object} e - click event of the share button/link
	         */
	        shareCard: function(e) {
	            e.preventDefault();
	            e.stopPropagation();

	            platformSdk.utils.log("share calling");

	            if (platformSdk.appData.helperData != null && platformSdk.appData.helperData.share_text) {
	                shareMessage = platformSdk.appData.helperData.share_text;
	            } else {
	                //shareMessage = "World Cup 2015 Live scores only on hike!";
	                shareMessage = "hike up your life only on hike!";
	            }
	            if (platformSdk.appData.helperData != null && platformSdk.appData.helperData.caption_text) {
	                captionText = platformSdk.appData.helperData.caption_text;
	            } else {
	                captionText = "";
	            }

	            platformBridge.share(shareMessage, captionText);
	            platformSdk.utils.log("share called");

	            return false;
	        },

	        /**
	         * Forwards the current card to other users
	         * @function
	         * @memberOf platformSdk.ui
	         * @inner
	         * @param {Object} e - click event of the share button/link
	         */
	        forwardCard: function(e) {
	            e.preventDefault();
	            e.stopPropagation();
	            //addRippleEffect(e);

	            platformSdk.utils.log("forward calling");
	            platformBridge.forwardToChat(platformSdk.forwardCardData);
	            platformSdk.utils.log("forward callied  with json=" + platformSdk.forwardCardData);

	            return false;
	        }
	    };
	}(window, window.platformSdk);


	/**
	 * creates XMLHttpRequest object, set up the event listeners and makes httpRequest as per the given options
	 * @function
	 * @memberOf platformSdk
	 * @inner
	 * @param {Object} options - an object with properties required to make an ajax call.
	 */
	platformSdk.ajax = function(window, platformSdk) {

	    var platformBridge = platformSdk.bridge;

	    /**
	     * function to handle success of ajax request
	     * @param  {Object} xhr - XMLHttpRequest Object
	     * @param  {Function} callback - callback function to be called on success
	     */
	    var ajaxSuccess = function(xhr, callback) {
	        if (callback && typeof callback === 'function')
	            callback(xhr.responseText, xhr.status);
	    };


	    /**
	     * function to handle error of ajax request
	     * @param  {Object} xhr - XMLHttpRequest Object
	     * @param  {Function} callback - callback function to be called on error
	     * @return {String} errorMsg - error message to be shown as toast in case of ajax error
	     */
	    var ajaxError = function(xhr, callback, errorMsg) {
	        if (callback && typeof callback === 'function')
	            callback(xhr.responseText, xhr.status, xhr);
	        if (errorMsg)
	            platformBridge.showToast(errorMsg);
	    };

	    /**
	     * function to check internet connection
	     * @param  {Function} fn - function to be called if user is connected to internet
	     */
	    var checkConnection = function(fn) {
	        platformSdk.nativeReq({
	            fn: 'checkConnection',
	            ctx: this,
	            data: "",
	            success: function(response) {
	                if (response != "-1" && response != "0") {
	                    if (typeof fn === "function")
	                        fn();
	                } else
	                    platformSdk.events.publish('app/offline');
	            }
	        });
	    };

	    /**
	     * takes the options object for the ajax call, creates XMLHttpRequest object and set up the event listeners
	     * @param  {Object} options - an object with properties required to make an ajax call
	     */
	    var fire = function(options) {
	        var url = options.url,
	            headers = options.headers,
	            data = options.data,
	            errorMsg = options.errorMessage,
	            callbackSucess = options.success,
	            callbackFailure = options.error,
	            type = options.type.toUpperCase();

	        var xhr = new XMLHttpRequest();

	        platformSdk.utils.log("ajax call started on " + url);
	        if (xhr) {

	            /**
	             * ready state change listener for the xhr object
	             */
	            xhr.onreadystatechange = function() {
	                if (4 == xhr.readyState && 200 == xhr.status) {
	                    if (platformSdk.debugMode)
	                        platformSdk.logger.endMarker('xhrCall');
	                    ajaxSuccess(xhr, callbackSucess);
	                }
	                if (4 == xhr.readyState && 200 != xhr.status) {
	                    if (platformSdk.debugMode)
	                        platformSdk.logger.endMarker('xhrCall');
	                    ajaxError(xhr, callbackFailure, errorMsg);
	                }
	            };

	            var datatype = Object.prototype.toString.call(data);
	            if (datatype === '[object Object]')
	                data = platformSdk.utils.validateStringifyJson(data);

	            xhr.open(type, url, true);
	            if (headers) {
	                for (var i = 0; i < headers.length; i++) {
	                    xhr.setRequestHeader(headers[i][0], headers[i][1]);
	                }
	            }

	            if (platformSdk.debugMode)
	                platformSdk.logger.setMarker('xhrCall');

	            xhr.send(data);
	        }
	    }

	    return function(options) {
	        fire(options);
	    };

	}(window, window.platformSdk);

	/**
	 * @namespace platformSdk.logger
	 * @memberOf platformSdk
	 */
	platformSdk.logger = function(window, platformSdk) {

	    "use strict";

	    var platformBridge = platformSdk.bridge;

	    var markers = {};

	    var latencyData = {
	        html: {}
	    };

	    var drawDebugInfoOverlay = function(name, dataObj) {
	        var debugInfoOverlay = document.getElementById("debug-info-overlay");

	        if (debugInfoOverlay) {
	            debugInfoOverlay.remove();
	        }

	        setTimeout(function() {
	            var htmlStr = name;
	            var body = document.body;
	            var listStr = '<ul>';
	            var link = document.getElementsByTagName('link');
	            var basePath = link[0].getAttribute('href').split('assets')[0];
	            var debugInfoOverlayDiv = document.createElement("div");
	            var keyData;

	            for (var key in dataObj) {
	                listStr += '<li><b>' + key + '</b></li>';
	                keyData = dataObj[key];

	                for (var key in keyData) {
	                    listStr += '<li>' + key + ' : ' + keyData[key] + '</li>';
	                }
	            }
	            listStr += '</ul>';
	            htmlStr = listStr + '<span class="icon-close tappingEffect" id="close-icon"><img width="14" src="' + basePath + 'assets/images/cross.png"></span>';

	            debugInfoOverlayDiv.setAttribute('id', "debug-info-overlay");
	            debugInfoOverlayDiv.innerHTML = htmlStr;

	            body.appendChild(debugInfoOverlayDiv);

	            var closeIcon = debugInfoOverlayDiv.getElementsByClassName('icon-close')[0];
	            closeIcon.addEventListener('click', function() {
	                debugInfoOverlayDiv.remove();
	            });

	        }, 15);
	    };

	    return {

	        /**
	         * Logs the load time data
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         */
	        logLoadTimeInfo: function() {
	            setTimeout(function() {
	                var timingAPI;
	                if (!platformSdk.debugMode)
	                    return;

	                if (window.performance) {
	                    timingAPI = performance.timing;
	                } else {
	                    platformSdk.utils.log("timing API not supported by the webView");
	                    return;
	                }
	                latencyData.html.networkLatency = timingAPI.responseEnd - timingAPI.fetchStart;
	                latencyData.html.domReadiness = timingAPI.loadEventEnd - timingAPI.responseEnd;

	                if (platformSdk.appData.time) {
	                    latencyData.native = platformSdk.appData.time;
	                }

	                drawDebugInfoOverlay('DOM load', latencyData);

	                platformSdk.utils.log(latencyData, 'latencyData');

	            }, 100);
	        },


	        /**
	         * Set a marker for navigation.performance api for performance measurements
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         * @param {String} name - name of the marker
	         */
	        setMarker: function(name) {
	            if (window.performance)
	                window.performance.mark(name + "_marker_start");
	        },


	        /**
	         * End the marker set using setMarker function
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         * @param {String} name - name of the marker you wish to end
	         * @param {Boolean} clearFlag - if true marker will be cleared
	         */
	        endMarker: function(name, clearFlag) {
	            if (window.performance) {
	                window.performance.mark(name + "_marker_end");
	                this.measureMarker(name, clearFlag);
	            }
	        },

	        /**
	         * Logs the measurements of given marker
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         * @param {String} name - name of the marker you wish to measure
	         * @param {Boolean} clearFlag - if true marker and its measurements will be cleared
	         */
	        measureMarker: function(name, clearFlag) {
	            var measureName = name + '_measure';
	            if (!window.performance) return;

	            window.performance.measure(measureName, name + '_marker_start', name + '_marker_end');
	            var measures = window.performance.getEntriesByName(name + '_measure');


	            platformSdk.utils.log('name: ' + measures[0].name + ', duration: ' + measures[0].duration);

	            if (clearFlag) {
	                this.clearMarker(name);
	                this.clearMeasure(name);
	            }

	            drawDebugInfoOverlay(name, measures[0]);
	        },

	        /**
	         * Clear the marker set using setMarker function
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         * @param {String} name - name of the marker you wish to clear
	         */
	        clearMarker: function(name) {
	            if (window.performance) {
	                window.performance.clearMarks(name + "_marker_start");
	                window.performance.clearMarks(name + "_marker_end");
	            }
	        },

	        /**
	         * Clear the measure
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         * @param {String} name - name of the marker you wish to clear
	         */
	        clearMeasure: function(name) {
	            if (window.performance) {
	                window.performance.clearMeasures(name + "_measure");
	            }
	        },


	        /**
	         * Clear all the markers
	         * @function
	         * @memberOf platformSdk.logger
	         * @inner
	         */
	        clearAllMarker: function() {
	            if (window.performance) {
	                window.performance.clearMarks();
	            }
	        }
	    };

	}(window, window.platformSdk);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, undefined) {
	    'use strict';

	    HTMLElement.prototype.toggleClass = function(classToken, flag) {
	        var element = this;

	        if (flag !== undefined) {
	            if (flag) {
	                element.classList.add(classToken);
	            } else {
	                element.classList.remove(classToken);
	            }
	        } else {
	            element.classList.toggle(classToken);
	        }
	    };

	    var ConnTypes = __webpack_require__(5).ConnectionTypes,
	        _extend = function(toObj, fromObj) {
	            for (var key in fromObj) {
	                if (fromObj.hasOwnProperty(key) && toObj[key] === undefined) {
	                    toObj[key] = fromObj[key];
	                }
	            }
	        },
	        imageOptimizationConnTypes = [ConnTypes.NO_NETWORK, ConnTypes.UNKNOWN, ConnTypes.TWO_G],
	        noop = function() {

	        },
	        memoizationCache = {},
	        basePrefix = 'id_',
	        idCounter = 1;

	    module.exports = {
	        isFunction: function(fn) {
	            return typeof fn === 'function';
	        },

	        extend: function(toObj, fromObj) {
	            _extend(toObj.prototype, fromObj.prototype);
	            _extend(toObj, fromObj);

	            return toObj;
	        },

	        serializeParams: function(params) {
	            var serializedParams = [];

	            for (var key in params) {
	                if (params.hasOwnProperty(key)) {
	                    serializedParams.push(key + '=' + params[key]);
	                }
	            }

	            return serializedParams.join('&');
	        },

	        empty: function(element) {
	            while (element.firstChild) {
	                element.removeChild(element.firstChild);
	            }

	            return element;
	        },

	        getUniqueId: function(prefix) {
	            return (prefix || basePrefix) + idCounter++;
	        },

	        simpleClone: function(obj) {
	            return JSON.parse(JSON.stringify(obj));
	        },

	        loadImage: function(params) {
	            var imageEl = document.createElement('img');

	            imageEl.src = params.src;

	            imageEl.onload = function() {
	                params.success(imageEl, params.src);
	            };

	            imageEl.onError = function() {
	                params.error(imageEl);
	            };
	        },

	        toOptimizeForImages: function(connectionType) {
	            if (memoizationCache[connectionType] === undefined) {
	                memoizationCache[connectionType] = imageOptimizationConnTypes.indexOf(connectionType) !== -1;
	            }

	            return memoizationCache[connectionType];
	        },

	        getNodeIndex: function(elem) {
	            var index = 0;

	            while (elem == elem.previousElementSibling) {
	                index++;
	            }

	            return index;
	        },

	        twoStringCompare: function(str1, str2) {
	            var n = null;
	            n = str1.localeCompare(str2);
	            return n;
	        },

	        createCustomEvent: function(eventName) {
	            var customEvent;

	            if (W.CustomEvent) {
	                customEvent = new CustomEvent(eventName, {
	                    bubbles: true
	                });
	            } else {
	                customEvent = document.createEvent('Event');
	                customEvent.initEvent(eventName, true, false);
	            }

	            return customEvent;

	        },

	        // Toggle Back Navigation Set For Allowing Back and Up Press Inside The Application

	        toggleBackNavigation: function(enable) {

	            enable = enable ? 'true' : 'false';

	            if (platformSdk.bridgeEnabled) {
	                platformSdk.bridge.allowBackPress(enable);
	                // Allow up press in only available since Platform Version 5
	                platformSdk.bridge.allowUpPress && platformSdk.bridge.allowUpPress(enable);
	            }
	        },

	        hasClass: function(el, className) {
	            if (el.classList)
	                return el.classList.contains(className);
	            else
	                return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	        },

	        addClass: function(el, className) {
	            if (el.classList)
	                el.classList.add(className);
	            else if (!hasClass(el, className)) el.className += ' ' + className;
	        },

	        removeClass: function(el, className) {
	            if (el.classList)
	                el.classList.remove(className);
	            else if (hasClass(el, className)) {
	                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	                el.className = el.className.replace(reg, ' ');
	            }
	        },

	        openWebView: function(url) {
	            if (platformSdk.bridgeEnabled) {
	                platformSdk.bridge.openFullPage('FAQ', url);
	            } else {
	                console.log("Opening Web page to specified url");
	            }
	        },

	        // Show Toast in Android or console
	        showToast: function(toast) {
	            if (platformSdk.bridgeEnabled) {
	                platformSdk.ui.showToast(toast);
	            } else {
	                console.log(toast);
	            }
	        },

	        upgradeRequired: function(minVersion, appVersion) {

	           minVersion = minVersion.match(/\d/g);
	           appVersion = appVersion.match(/\d/g);

	           var minVersionLength = minVersion.length;
	           var appVersionLength = appVersion.length;

	           var maxLength = minVersionLength > appVersionLength ? minVersionLength : appVersionLength;

	           var appVer_part,minVer_part;

	           for(var i =0;i<maxLength;i++){

	              minVer_part = parseInt(minVersion[i], 10) || 0;
	              appVer_part = parseInt(appVersion[i], 10) || 0;

	              if(minVer_part == appVer_part){
	                    continue;
	              }
	              else if(appVer_part > minVer_part){
	                return false;
	              }
	              else{
	                return true;
	              }

	           }


	        },

	        debounce: function(func, wait, immediate) {
	            var timeout;
	            return function() {
	                var context = this,
	                    args = arguments;
	                var later = function() {
	                    timeout = null;
	                    if (!immediate) func.apply(context, args);
	                };
	                var callNow = immediate && !timeout;
	                clearTimeout(timeout);
	                timeout = setTimeout(later, wait);
	                if (callNow) func.apply(context, args);
	            };
	        }
	    };

	})(window);

/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    module.exports = {
	        DEV_ENV: 'dev',
	        STAGING_ENV: 'staging',
	        PROD_ENV: 'prod',

	        ConnectionTypes: {
	            NO_NETWORK: '-1',
	            UNKNOWN: '0',
	            WIFI: '1',
	            TWO_G: '2',
	            THREE_G: '3',
	            FOUR_G: '4'
	        },

	        Events: {
	            NAVIGATE_APP: 'app.navigate',
	            TOGGLE_BLOCK: 'app.menu.om.block',
	            RESET_APP: 'app.reset'
	        },

	        // Levels 0- Bronze; 1-Silver; Gold-2

	        REWARD_STATE: {

	            LOCKED: "0",
	            UNLOCKED: "1",
	            INPROGRESS: "2",
	            REDEEMED: "3",
	            FAILED: "4",
	            EXPIRED: "5"
	        },

	        CS_HELP_JSON: {
	            'appName': 'Friends',
	            'title': 'Everything you need to know about friends',
	            'data': [{
	                'text': 'Details',
	                'type': 'weburl',
	                'icon': 'faq',
	                'url': 'http://support.hike.in/forums/23106287-Friends-concept',
	                'active': true
	            }, {
	                'text': 'Give feedback',
	                'type': 'feature',
	                'icon': 'issue',
	                'subCat': [],
	                'active': true,
	                'label': 'Friends feedback',
	                'theme': 'HomeScreen5.0'
	            }]
	        },

	        INVOKE_MODE_APP_START: 1,
	        INVOKE_MODE_THREE_DOT: 2,


	    };

	})();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';

	    var Constants = __webpack_require__(5);

	    module.exports = function(env) {
	        if (env === Constants.DEV_ENV) {
	            return {
	                API_URL: 'http://54.169.82.65:5016/v1',
	                LOG_URL: 'http://54.169.82.65:5016/v1',
	                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
	                STICKER_SUFFIX: "&resId=LDPI&image=true",
	                INSTALL_URL: 'http://qa-content.hike.in/mapps/api/v2/apps/' + 'install.json'

	            };
	        } else if (env === Constants.STAGING_ENV) {
	            return {
	                API_URL: 'http://54.169.82.65:5016/v1',
	                LOG_URL: 'http://54.169.82.65:5016/v1',
	                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
	                STICKER_SUFFIX: "&resId=LDPI&image=true",
	                INSTALL_URL: 'http://qa-content.hike.in/mapps/api/v2/apps/' + 'install.json'

	            };
	        } else if (env === Constants.PROD_ENV) {
	            return {
	                API_URL: 'http://54.169.82.65:5016/v1',
	                LOG_URL: 'http://54.169.82.65:5016/v1',
	                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
	                STICKER_SUFFIX: "&resId=LDPI&image=true",
	                INSTALL_URL: 'http://mapps.platform.hike.in/mapps/api/v2/apps/install.json?hikecs'
	            };
	        }

	        return {};
	    };
	})();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, events) {
	    'use strict';

	    var WorkspaceController = __webpack_require__(8),
	        ExclusiveFeatureController = __webpack_require__(25),
	        StickerRewardController = __webpack_require__(27),
	        CustomerStickerController = __webpack_require__(30),
	        CrowdSourcingController = __webpack_require__(32),
	        FaqDetailsController = __webpack_require__(34),
	        StickerPackViewController = __webpack_require__(36),
	        CoolDownController = __webpack_require__(38),
	        StateController = __webpack_require__(39),
	        SubscriptionController = __webpack_require__(41),
	        UpgradeController = __webpack_require__(43),


	        Router = __webpack_require__(45),
	        utils = __webpack_require__(4),
	        profileModel = __webpack_require__(9),
	        rewardsModel = __webpack_require__(11),
	        activityModel = __webpack_require__(15),
	        mysteryBoxModel = __webpack_require__(17),
	        cacheProvider = __webpack_require__(10),
	        expHandlerAB = __webpack_require__(46),
	        TxService = __webpack_require__(13),
	        NinjaService = __webpack_require__(14),
	        Constants = __webpack_require__(5);

	    // Full Screen Loader
	    var loader = document.getElementById('loader');
	    var loadObject = events.subscribe('update.loader', function(params) {
	        loader.toggleClass('loading', params.show);
	    });

	    // Tap State Events :: Touch Start And Touch End

	    document.addEventListener('touchstart', function(evt) {
	        evt = evt || window.event;
	        var target = evt.target;
	        if (target.classList.contains('buttonTapWhite')) {
	            target.classList.add('tapStateWhite');
	        } else if (target.classList.contains('buttonTapRed')) {
	            target.classList.add('tapStateRed');
	        } else if (target.classList.contains('buttonTapOffer')) {
	            target.classList.add('tapStateOffer');
	        } else {
	            return;
	        }
	    }, false);

	    document.addEventListener('touchend', function(evt) {
	        evt = evt || window.event;
	        var target = evt.target;
	        if (target.classList.contains('buttonTapWhite')) {
	            target.classList.remove('tapStateWhite');
	        } else if (target.classList.contains('buttonTapRed')) {
	            target.classList.remove('tapStateRed');
	        } else if (target.classList.contains('buttonTapOffer')) {
	            target.classList.remove('tapStateOffer');
	        } else {
	            return;
	        }
	    }, false);

	    // Block Connection Tab
	    var isBlock = document.getElementById('blockScreen');
	    var isBlockObject = events.subscribe('app/block', function(params) {
	        isBlock.toggleClass('block-msg', params.show);
	    });

	    var unBlockApp = function() {
	        var self = this;
	        var id = '' + platformSdk.retrieveId('app.menu.om.block');

	        platformSdk.appData.block = 'false';
	        if (platformSdk.bridgeEnabled) platformSdk.unblockChatThread();
	        platformSdk.events.publish('app.state.block.hide');
	        platformSdk.updateOverflowMenu(id, {
	            'title': 'Block'
	        });

	        //utils.toggleBackNavigation( false );
	        events.publish('update.loader', {
	            show: false
	        });
	        events.publish('app/block', {
	            show: false
	        });
	    };

	    var Application = function(options) {
	        this.container = options.container;
	        this.routeIntent = options.route;

	        // Router Controller
	        this.router = new Router();
	        // Profile Controller
	        this.workspaceController = new WorkspaceController();

	        //Rewards Controller
	        this.exclusiveFeatureController = new ExclusiveFeatureController();
	        this.stickerRewardController = new StickerRewardController();
	        this.customerStickerController = new CustomerStickerController();
	        this.crowdSourcingController = new CrowdSourcingController();
	        this.faqDetailsController = new FaqDetailsController();
	        this.stickerPackViewController = new StickerPackViewController();
	        this.coolDownController = new CoolDownController();
	        this.stateController = new StateController();
	        this.subscriptionController = new SubscriptionController();
	        this.upgradeController = new UpgradeController();

	        // Communication Controller
	        this.TxService = new TxService();
	        this.NinjaService = new NinjaService(this.TxService); //communication layer
	    };

	    Application.prototype = {

	        // Three Dot Menu Overflow Events Subscriptions
	        OverflowEvents: function() {

	            var that = this;

	            // Notifications ON/OFF
	            platformSdk.events.subscribe('app.menu.om.mute', function(id) {
	                id = '' + platformSdk.retrieveId('app.menu.om.mute');

	                if (platformSdk.appData.mute == 'true') {
	                    platformSdk.appData.mute = 'false';
	                    platformSdk.muteChatThread();
	                    platformSdk.updateOverflowMenu(id, {
	                        'is_checked': 'true'
	                    });
	                } else {
	                    platformSdk.appData.mute = 'true';
	                    platformSdk.muteChatThread();
	                    platformSdk.updateOverflowMenu(id, {
	                        'is_checked': 'false'
	                    });
	                }
	            });

	            // Block Event From The Three Dot
	            platformSdk.events.subscribe('app.menu.om.block', function(id) {
	                id = '' + platformSdk.retrieveId('app.menu.om.block');
	                if (platformSdk.appData.block === 'true') {
	                    unBlockApp();
	                    that.start();
	                } else {
	                    platformSdk.appData.block = 'true';
	                    platformSdk.blockChatThread();
	                    platformSdk.events.publish('app.state.block.show');
	                    platformSdk.updateOverflowMenu(id, {
	                        'title': 'Unblock'
	                    });
	                    utils.toggleBackNavigation(false);
	                    events.publish('app/block', {
	                        show: true
	                    });
	                    events.publish('app/offline', {
	                        show: false
	                    });

	                }
	            });

	            //Help
	            platformSdk.events.subscribe('app.menu.om.help', function(id) {
	                that.checkAndDownloadBot('+hikecs+', Constants.INVOKE_MODE_THREE_DOT);
	            });
	        },


	        // To download a bot
	        downloadBot: function(botname) {

	            var obj = {
	                "apps": [{
	                    "name": botname
	                }]
	            };

	            var data = {
	                url: appConfig.INSTALL_URL,
	                params: obj
	            };

	            data = JSON.stringify(data);

	            platformSdk.nativeReq({
	                fn: 'doPostRequest',
	                ctx: this,
	                data: data,
	                success: function(res) {
	                    console.log(res);
	                }
	            });

	        },


	        // Check if a bot exists
	        // invokeMode  - 1    ->  App start -> Just download bot (dont open) if bot doesnot exist
	        //             - 2    ->  Three dot click
	        //                             - If bot exist, open it.
	        //                             - If bot doesnt exist, just keep checking (but no download)                 

	        checkAndDownloadBot: function(botname, invokeMode) {

	            console.log("checking bot",botname,invokeMode);

	            var that = this;

	            platformSdk.nativeReq({
	                fn: 'isBotExist',
	                ctx: this,
	                data: botname,
	                success: function(response) {
	                    //app start
	                    console.log(Constants);
	                    if (invokeMode == Constants.INVOKE_MODE_APP_START) {
	                        if (response == "false"){
	                            console.log("Downloading CS microapp for the first time");
	                            that.downloadBot(botname.replace(/\+/g, ''));
	                        }
	                    } else if (invokeMode == Constants.INVOKE_MODE_THREE_DOT) {
	                        if (response == 'false'){
	                            console.log("Downloading again");
	                            that.checkAndDownloadBot(botname, invokeMode);
	                        }
	                        else{
	                            console.log("cs microapp found");
	                            that.openExistingBot(botname);
	                        }
	                    }
	                }
	            });
	        },



	        openExistingBot: function(botname) {

	            var jsonobj = {
	                'screen': 'microapp',
	                'msisdn': botname,
	                'isBot': true,
	                'extra_data': Constants.CS_HELP_JSON
	            };
	            console.log("Opening CS microapp");
	            PlatformBridge.openActivity(JSON.stringify(jsonobj));
	        },


	        // Setting Up The Three Dot Menu
	        initOverflowMenu: function() {

	            var that = this;

	            var omList = [{
	                    'title': 'Notifications',
	                    'en': 'true',
	                    'eventName': 'app.menu.om.mute',
	                    'is_checked': platformSdk.appData.mute === 'true' ? 'false' : 'true'
	                },

	                {
	                    'title': platformSdk.appData.block === 'true' ? 'Unblock' : 'Block',
	                    'en': 'true',
	                    'eventName': 'app.menu.om.block'
	                },

	                {
	                    'title': 'Help',
	                    'en': 'true',
	                    'eventName': 'app.menu.om.help'

	                }
	            ];


	            that.OverflowEvents();
	            platformSdk.setOverflowMenu(omList);
	            that.checkAndDownloadBot('+hikecs+', Constants.INVOKE_MODE_APP_START);

	        },

	        // If card Data Comes From Any Forwarded Card that calls Open Non Messaging Bot Here
	        getIntentData: function(data) {
	            var that = this;
	            //console.log(data);
	            data = decodeURIComponent(data);
	            data = JSON.parse(data);

	        },

	        backPressTrigger: function() {

	            var stickerCooldownElement = document.getElementsByClassName('stickerCooldownContainer')[0];
	            var stickerShopElement = document.getElementsByClassName('stickerShopPageOne')[0];
	            var customStickerHistory = document.getElementsByClassName('customStickerHistory')[0];
	            var showHistoryButton = document.getElementsByClassName('showHistoryButton')[0];
	            var customStickerReadyState = document.getElementsByClassName('customStickerReadyState')[0];
	            var customStickerStatusCheck = document.getElementsByClassName('customStickerStatusCheck')[0];
	            var customStickerUploadScreen = document.getElementsByClassName('customStickerUploadScreen')[0];
	            var uploadParent = document.getElementsByClassName('uploadParent')[0];

	            if (stickerCooldownElement || stickerShopElement) {
	                this.goToNinjaProfilePage();
	                return;
	            } else if (customStickerHistory && !customStickerHistory.classList.contains('hideClass')) {
	                customStickerHistory.classList.add('hideClass');
	                showHistoryButton.classList.remove('hideClass');
	                if (customStickerUploadScreen && customStickerUploadScreen.classList.contains('hideClass')) {
	                    customStickerUploadScreen.classList.remove('hideClass');
	                }
	                if (uploadParent && uploadParent.classList.contains('hideClass')) {
	                    uploadParent.classList.remove('hideClass');
	                }
	                return;
	            } else if (customStickerReadyState && !customStickerReadyState.classList.contains('hideClass')) {
	                customStickerReadyState.classList.add('hideClass');
	                customStickerHistory.classList.remove('hideClass');
	                return;
	            } else if (customStickerStatusCheck && !customStickerStatusCheck.classList.contains('hideClass')) {
	                customStickerStatusCheck.classList.add('hideClass');
	                customStickerHistory.classList.remove('hideClass');
	                if (customStickerUploadScreen) {
	                    customStickerUploadScreen.classList.remove('hideClass');
	                }
	                return;
	            }

	            this.router.back();
	        },

	        goToNinjaProfilePage: function() {
	            var that = this;
	            var data = {};

	            data.ninjaRewardsCollection = cacheProvider.getFromCritical('ninjaRewards');
	            data.ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
	            data.ninjaActivityData = cacheProvider.getFromCritical('ninjaStats');

	            that.router.navigateTo('/', data);
	        },

	        getRoute: function() {
	            var that = this;

	            // ToDo: Remvove this if block from here?
	            if (this.routeIntent !== undefined) {

	            } else {
	                events.publish('app.store.get', {
	                    key: '_routerCache',
	                    ctx: this,
	                    cb: function(r) {
	                        if (r.status === 1 && platformSdk.bridgeEnabled) {
	                            try {
	                                that.router.navigateTo(r.results.route, r.results.cache);
	                            } catch (e) {
	                                that.router.navigateTo('/');
	                            }
	                        } else {
	                            that.router.navigateTo('/');
	                        }
	                    }
	                });
	            }
	        },

	        start: function() {

	            var self = this;
	            self.$el = $(this.container);

	            self.initOverflowMenu();

	            expHandlerAB.getVal(cacheProvider.getFromCritical('lockedRewardAB_key'), JSON.parse(cacheProvider.getFromCritical('lockedRewardAB_defaultVal')), function(response) {
	                cacheProvider.setInCritical('lockedGreyout', JSON.parse(response));
	            });

	            utils.toggleBackNavigation(false);
	            document.querySelector('.unblockButton').addEventListener('click', function() {
	                unBlockApp();
	                self.start();
	            }, false);

	            // No Internet Connection Tab
	            var noInternet = document.getElementById('nointernet');
	            var noInternetObject = events.subscribe('app/offline', function(params) {
	                noInternet.toggleClass('no-internet-msg', params.show);

	            });

	            platformSdk.events.subscribe('onBackPressed', function() {
	                self.backPressTrigger();
	            });

	            platformSdk.events.subscribe('onUpPressed', function() {
	                self.backPressTrigger();
	            });

	            // Ninja Home Screen Router :: Three Tabs (Rewards/Activity/Mystery Box)
	            this.router.route('/', function(data) {
	                self.container.innerHTML = '';
	                self.workspaceController.render(self.container, self, data);
	                utils.toggleBackNavigation(false);
	            });

	            // Exclusive Features :: Friend Emojis + GIF Sharing 
	            this.router.route('/exclusiveFeature', function(data) {
	                self.container.innerHTML = '';
	                self.exclusiveFeatureController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });

	            // Sticker Features :: Early Access + Exclusive Stickers + Animated Sticker Incorporate Here 
	            this.router.route('/stickerReward', function(data) {
	                self.container.innerHTML = '';
	                self.stickerRewardController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });

	            this.router.route('/stickerPackView', function(data) {
	                self.container.innerHTML = '';
	                self.stickerPackViewController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });



	            // Custom Sticker Controller 
	            this.router.route('/customSticker', function(data) {
	                self.container.innerHTML = '';
	                self.customerStickerController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });

	            // Crowd Sourcing Reward Controller
	            this.router.route('/ugc', function(data) {
	                self.container.innerHTML = '';
	                self.crowdSourcingController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });

	            // FAQ All Rewards Controller 
	            this.router.route('/rewardFaq', function(data) {
	                self.container.innerHTML = '';
	                self.faqDetailsController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });

	            // FAQ All Rewards Controller 
	            this.router.route('/coolDown', function(data) {
	                self.container.innerHTML = '';
	                self.coolDownController.render(self.container, self, data);
	                utils.toggleBackNavigation(true);
	            });


	            // FAQ All Rewards Controller 
	            this.router.route('/userState', function(data) {
	                self.container.innerHTML = '';
	                self.stateController.render(self.container, self, data);
	                utils.toggleBackNavigation(false);
	            });

	            // FAQ All Rewards Controller 
	            this.router.route('/subscribe', function(data) {
	                self.container.innerHTML = '';
	                self.subscriptionController.render(self.container, self, data);
	                utils.toggleBackNavigation(false);
	            });

	            // FAQ All Rewards Controller 
	            this.router.route('/upgrade', function(data) {
	                self.container.innerHTML = '';
	                self.upgradeController.render(self.container, self, data);
	                utils.toggleBackNavigation(false);
	            });



	            var subscriptionCompleted = cacheProvider.getFromCritical('subscriptionCompleted');
	            var ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');

	            // If user is already subscribed
	            if (subscriptionCompleted) {
	                if (ftueCompleted) {
	                    console.log("This is and old user :: Fetching Profile battery and streak for the user");

	                    // Check If Block True Or False
	                    if (platformSdk.appData.block === 'true') {

	                        console.log('User has blocked the Application');
	                        events.publish('app/block', {
	                            show: true
	                        });
	                    }

	                    this.NinjaService.getNinjaProfile(function(res) {
	                        console.log(res.data);

	                        //Check for older version
	                        if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {

	                            self.router.navigateTo('/upgrade');

	                        } else if (res.data.status == 'inactive' || res.data.status == 'locked') {

	                            self.router.navigateTo('/userState', res.data);
	                            console.log("User state  is " + res.data.status);

	                        } else {

	                            // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
	                            self.router.navigateTo('/');
	                            profileModel.updateNinjaData(res.data, self);
	                            activityModel.fetchNinjaActivity('lifetime');
	                            //mysteryBoxModel.getMysteryBoxDetails(self);
	                        }
	                    }, this);
	                }
	                // Show FTUE To the User
	                else {
	                    // STUB TO REMOVE

	                    var data = {};

	                    this.ninjaRewardsData = { 'rewards': [], 'rewards_hash': '' };
	                    this.ninjaProfileData = { "battery": 0, "rewards_hash": "", "status": "active", "streak": 0, "name": '' };
	                    this.ninjaActivityData = { "chatThemes": { "rec": 0, "sent": 0 }, "files": { "rec": 0, "sent": 0 }, "messages": { "rec": 0, "sent": 0 }, "statusUpdates": { "count": 0 }, "stickers": { "rec": 0, "sent": 0 } };

	                    // STUB TO REMOVE

	                    data.ninjaRewardsCollection = this.ninjaRewardsData;
	                    data.ninjaProfileData = this.ninjaProfileData;
	                    data.ninjaActivityData = this.ninjaActivityData;

	                    this.NinjaService.getNinjaProfile(function(res) {
	                        console.log(res.data);

	                         if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {
	                                cacheProvider.setInCritical('ftueCompleted', true);
	                                App.router.navigateTo('/upgrade');
	                        }
	                        else if (res.data.status == 'inactive' || res.data.status == 'locked') {
	                            cacheProvider.setInCritical('ftueCompleted', false);
	                            self.router.navigateTo('/userState', res.data);
	                            console.log("User state  is " + res.data.status);

	                        } else {
	                            // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
	                            cacheProvider.setInCritical('ftueCompleted', true);
	                            self.router.navigateTo('/', data);
	                            profileModel.updateNinjaData(res.data, self);
	                            activityModel.fetchNinjaActivity('lifetime');
	                            //mysteryBoxModel.getMysteryBoxDetails(self);
	                        }
	                    }, this);
	                }

	            } else
	                self.router.navigateTo('/subscribe');



	        }
	    };

	    module.exports = Application;

	})(window, platformSdk.events);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),
	        profileModel = __webpack_require__(9),
	        rewardsModel = __webpack_require__(11),
	        activityModel = __webpack_require__(15),
	        mysteryBoxModel = __webpack_require__(17),
	        cacheProvider = __webpack_require__(10),

	        WorkspaceController = function(options) {
	            this.template = __webpack_require__(24);
	        };

	    WorkspaceController.prototype.bind = function(App, data) {

	        //Swipe
	        function Swipe( t,n ) {'use strict';function e() {h = E.children,w = Array( h.length ),m = t.getBoundingClientRect().width || t.offsetWidth,E.style.width = h.length * m + 'px';for ( var n = h.length; n--; ) {var e = h[n];e.style.width = m + 'px',e.setAttribute( 'data-index', n ),f.transitions && ( e.style.left = n * -m + 'px',a( n, b > n ? -m : n > b ? m : 0, 0 ) )}f.transitions || ( E.style.left = b * -m + 'px' ),t.style.visibility = 'visible'}function i() {b ? r( b - 1 ) : n.continuous && r( h.length - 1 )}function o() {h.length - 1 > b ? r( b + 1 ) : n.continuous && r( 0 )}function r( t,e ) {if ( b != t ) {if ( f.transitions ) {for ( var i = Math.abs( b - t ) - 1,o = Math.abs( b - t ) / ( b - t ); i--; )a( ( t > b ? t : b ) - i - 1, m * o, 0 );a( b, m * o, e || T ),a( t, 0, e || T )}else d( b * -m, t * -m, e || T );b = t,v( n.callback && n.callback( b, h[b] ) )}}function a( t,n,e ) {s( t, n, e ),w[t] = n}function s( t,n,e ) {var i = h[t],o = i && i.style;o && ( o.webkitTransitionDuration = o.MozTransitionDuration = o.msTransitionDuration = o.OTransitionDuration = o.transitionDuration = e + 'ms',o.webkitTransform = 'translate(' + n + 'px,0)' + 'translateZ(0)',o.msTransform = o.MozTransform = o.OTransform = 'translateX(' + n + 'px)' )}function d( t,e,i ) {if ( ! i )return E.style.left = e + 'px',void 0;var o = +new Date,r = setInterval(function() {var a = +new Date - o;return a > i ? ( E.style.left = e + 'px',y && c(),n.transitionEnd && n.transitionEnd.call( event, b, h[b] ),clearInterval( r ),void 0 ) : ( E.style.left = ( e - t ) * ( Math.floor( 100 * ( a / i ) ) / 100 ) + t + 'px',void 0 )}, 4 )}function c() {p = setTimeout( o, y )}function u() {y = 0,clearTimeout( p )}var l = function() {},v = function( t ) {setTimeout( t || l, 0 )},f = { addEventListener:!! window.addEventListener,touch:'ontouchstart'in window || window.DocumentTouch && document instanceof DocumentTouch,transitions:function( t ) {var n = ['transformProperty','WebkitTransform','MozTransform','OTransform','msTransform'];for ( var e in n )if ( void 0 !== t.style[n[e]] )return ! 0;return ! 1}( document.createElement( 'swipe' ) ) };if ( t ) {var h,w,m,E = t.children[0];n = n || {};var p,x,b = parseInt( n.startSlide, 10 ) || 0,T = n.speed || 300,y = n.auto || 0,L = {},g = {},k = { handleEvent:function( t ) {switch ( t.type ){case'touchstart':this.start( t );break;case'touchmove':this.move( t );break;case'touchend':v( this.end( t ) );break;case'webkitTransitionEnd':case'msTransitionEnd':case'oTransitionEnd':case'otransitionend':case'transitionend':v( this.transitionEnd( t ) );break;case'resize':v( e.call() )}n.stopPropagation && t.stopPropagation()},start:function( t ) {var n = t.touches[0];L = { x:n.pageX,y:n.pageY,time:+new Date },x = void 0,g = {},E.addEventListener( 'touchmove', this, ! 1 ),E.addEventListener( 'touchend', this, ! 1 )},move:function( t ) {if ( ! ( t.touches.length > 1 || t.scale && 1 !== t.scale ) ) {n.disableScroll && t.preventDefault();var e = t.touches[0];g = { x:e.pageX - L.x,y:e.pageY - L.y },x === void 0 && ( x = !! ( x || Math.abs( g.x ) < Math.abs( g.y ) ) ),x || ( t.preventDefault(),u(),g.x = g.x / ( ! b && g.x > 0 || b == h.length - 1 && 0 > g.x ? Math.abs( g.x ) / m + 1 : 1 ),s( b - 1, g.x + w[b - 1], 0 ),s( b, g.x + w[b], 0 ),s( b + 1, g.x + w[b + 1], 0 ) )}},end:function() {var t = +new Date - L.time,e = 250 > Number( t ) && Math.abs( g.x ) > 20 || Math.abs( g.x ) > m / 2,i = ! b && g.x > 0 || b == h.length - 1 && 0 > g.x,o = 0 > g.x;x || ( e && ! i ? ( o ? ( a( b - 1, -m, 0 ),a( b, w[b] - m, T ),a( b + 1, w[b + 1] - m, T ),b += 1 ) : ( a( b + 1, m, 0 ),a( b, w[b] + m, T ),a( b - 1, w[b - 1] + m, T ),b += -1 ),n.callback && n.callback( b, h[b] ) ) : ( a( b - 1, -m, T ),a( b, 0, T ),a( b + 1, m, T ) ) ),E.removeEventListener( 'touchmove', k, ! 1 ),E.removeEventListener( 'touchend', k, ! 1 )},transitionEnd:function( t ) {parseInt( t.target.getAttribute( 'data-index' ), 10 ) == b && ( y && c(),n.transitionEnd && n.transitionEnd.call( t, b, h[b] ) )} };return e(),y && c(),f.addEventListener ? ( f.touch && E.addEventListener( 'touchstart', k, ! 1 ),f.transitions && ( E.addEventListener( 'webkitTransitionEnd', k, ! 1 ),E.addEventListener( 'msTransitionEnd', k, ! 1 ),E.addEventListener( 'oTransitionEnd', k, ! 1 ),E.addEventListener( 'otransitionend', k, ! 1 ),E.addEventListener( 'transitionend', k, ! 1 ) ),window.addEventListener( 'resize', k, ! 1 ) ) : window.onresize = function() {e()},{ setup:function() {e()},slide:function( t,n ) {r( t, n )},prev:function() {u(),i()},next:function() {u(),o()},getPos:function() {return b},kill:function() {u(),E.style.width = 'auto',E.style.left = 0;for ( var t = h.length; t--; ) {var n = h[t];n.style.width = '100%',n.style.left = 0,f.transitions && s( t, 0, 0 )}f.addEventListener ? ( E.removeEventListener( 'touchstart', k, ! 1 ),E.removeEventListener( 'webkitTransitionEnd', k, ! 1 ),E.removeEventListener( 'msTransitionEnd', k, ! 1 ),E.removeEventListener( 'oTransitionEnd', k, ! 1 ),E.removeEventListener( 'otransitionend', k, ! 1 ),E.removeEventListener( 'transitionend', k, ! 1 ),window.removeEventListener( 'resize', k, ! 1 ) ) : window.onresize = null} }}}( window.jQuery || window.Zepto ) && function( t ) {t.fn.Swipe = function( n ) {return this.each(function() {t( this ).data( 'Swipe', new Swipe( t( this )[0],n ) )})}}( window.jQuery || window.Zepto );

	        var workspace = this;
	        var allRewards = document.getElementsByClassName('rewardRow');
	        var containers = document.getElementsByClassName('tab-data');
	        var bullets = document.getElementsByClassName('comp__tab');

	        function defineNinjaHomeScreenTabs() {

	            containers[0].style.height = window.innerHeight + 'px';
	            containers[1].style.height = window.innerHeight + 'px';
	            containers[2].style.height = window.innerHeight + 'px';

	            window.slider =
	                new Swipe(document.getElementById('sliderTabs'), {
	                    continuous: false,
	                    disableScroll: false,
	                    stopPropagation: false,
	                    callback: function(pos) {

	                        var i = bullets.length;
	                        while (i--) {
	                            bullets[i].className = ' comp__tab';
	                        }
	                        bullets[pos].className = 'comp__tab selected';
	                        document.getElementById("sliderTabs").style.height = containers[pos].offsetHeight + "px";

	                    }

	                });

	            document.getElementById("sliderTabs").style.height = containers[0].offsetHeight + "px";

	            bullets[0].className = 'comp__tab selected';
	            bullets[1].className = 'comp__tab ';
	            bullets[2].className = 'comp__tab ';

	            if (bullets.length) {
	                console.log(bullets);
	                for (var i = 0; i < bullets.length; i++) {
	                    bullets[i].addEventListener("click", function(event) {
	                        event.preventDefault();
	                        var parent = this.parentNode;
	                        var index = Array.prototype.indexOf.call(parent.children, this);
	                        slider.slide(index);
	                    });
	                }
	            }
	        }
	        var elem = document.getElementsByClassName('rewardRow')
	        for (var i = 0; i < elem.length; i++) {
	            var H = window.getComputedStyle(elem[i]).height;
	            elem[i].querySelector('.rewardIcon').style.height = H;
	            if(elem[i].querySelector('.rewardStreakWrapper'))
	                elem[i].querySelector('.rewardStreakWrapper').style.lineHeight = H;
	        }

	        var ninjaIcon = document.getElementsByClassName('ninjaProfileIcon')[0];

	        if (data && data.ninjaProfileData && data.ninjaProfileData.dp) {
	            ninjaIcon.style.backgroundImage = "url('file:///" + data.ninjaProfileData.dp + "')";
	            rewardsModel.updateNinjaRewardsIcons(data.ninjaRewardsCollection.rewards);
	        } else if(data && data.ninjaProfileData && (data.ninjaProfileData.dp == "")) {
	            ninjaIcon.style.backgroundImage = "url('file:///" + data.ninjaProfileData.dp + "')";
	            rewardsModel.updateNinjaRewardsIcons(data.ninjaRewardsCollection.rewards);
	        } else {
	            console.log("Set a default dp");
	        }

	        // Run everything Here
	        defineNinjaHomeScreenTabs();
	        rewardsModel.updateNinjaRewardsLinks(App);
	        mysteryBoxModel.getMysteryBoxDetails(App);

	    };

	    WorkspaceController.prototype.render = function(ctr, App, data) {

	        if (!data) {
	            console.log("Taking up data from the helper data");
	            // Get all three tabs data from the helper data as of now

	            this.ninjaRewardsData = cacheProvider.getFromCritical('ninjaRewards');
	            this.ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
	            this.ninjaActivityData = cacheProvider.getFromCritical('ninjaStats');

	            // STUB TO REMOVE

	            // this.ninjaRewardsData = [{"title":"Early Access Stickers","stitle":"Get all the hike stickers before everyone else","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":1,"streak":0,"type":"sticker_reward"},{"title":"Friends Emoji","stitle":"See how deepy connected you are with your friends","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":2,"streak":20,"type":"exclusive_feature"},{"title":"Express GIF","stitle":"Express yourself with GIFs, like no one else can","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":3,"streak":40,"type":"exclusive_feature"},{"title":"Submit Content","stitle":"Submit hike content and get recognition","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":5,"streak":60,"type":"user_generated_content"},{"title":"My Sticker","stitle":"Have an exclusive sticker made just for you","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":6,"streak":80,"type":"custom_sticker"}];
	            // this.ninjaProfileData = {"battery":7,"rewards_hash":"be96dc8c0a876b08c8076b03acdee0db4","status":"active","streak":0,"name":'Hemank Sabharwal'};
	            // this.ninjaActivityData = {"chatThemes":{"rec":0,"sent":0},"files":{"rec":55,"sent":39},"messages":{"rec":203,"sent":87},"statusUpdates":{"count":0},"stickers":{"rec":33,"sent":7}};

	            // STUB TO REMOVE


	        } else {
	            console.log("Data arrived :: Use this directly");  
	            console.log("WORKSPACE ARRIVED",data);    
	            this.ninjaRewardsData = data.ninjaRewardsCollection;
	            this.ninjaProfileData = data.ninjaProfileData;
	            this.ninjaActivityData = data.ninjaActivityData;
	     
	        }

	        this.el = document.createElement('div');
	        this.el.className = 'workSpaceContainer animation_fadein noselect';


	        this.el.innerHTML = Mustache.render(this.template, {
	            ninjaRewardsCollection: (typeof this.ninjaRewardsData === 'undefined'? {} : this.ninjaRewardsData.rewards),
	            ninjaActivityData: this.ninjaActivityData,
	            ninjaProfileData: this.ninjaProfileData,
	            lockedGreyout : cacheProvider.getFromCritical('lockedGreyout')
	        });

	        ctr.appendChild(this.el);
	        events.publish('update.loader', { show: false });
	        this.bind(App, data);

	    };




	    WorkspaceController.prototype.destroy = function() {

	    };

	    module.exports = WorkspaceController;

	})(window, platformSdk, platformSdk.events);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by hemanksabharwal on 17/05/15.
	 */

	(function() {
	    'use strict';

	    var platformSdk = __webpack_require__(3),
	        utils = __webpack_require__(4),
	        cacheProvider = __webpack_require__(10),
	        rewardsModel = __webpack_require__(11),
	        TxService = __webpack_require__(13),
	        NinjaService = __webpack_require__(14),

	        ProfileModel = function() {
	            this.TxService = new TxService();
	            this.ninjaService = new NinjaService(this.TxService); //communication layer
	        },

	        EMPTY_OBJ_READ_ONLY = {};

	    ProfileModel.prototype = {

	        // Update the Ninja Data In Helper Data and Update the New Values on the Profile Screen

	        checkRewardStatus: function(rewardHash, App) {

	            var ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
	            //var oldRewardsHash = ninjaProfileData.rewards_hash;
	            var compareHash = null;


	            // STUB TO REMOVE

	            var oldRewardsHash = 'be96dc8c0a876b08c8076b03acdee0db4';

	            // STUB TO REMOVE


	            if (oldRewardsHash) {
	                compareHash = utils.twoStringCompare(oldRewardsHash, rewardHash);
	            } else {
	                console.log("No Old rewards Hash exist :: Call Rewards Anyway and store the rewards hash");
	            }

	            if (compareHash !== 0) {
	                console.log("Rewards Hash Does not match :: Fetch the New Rewards");

	                // Store New Rewards Hash In Helper Data

	                //ninjaProfileData.rewards_hash = rewardHash;
	                //cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);

	                // STUB TO REMOVE

	                // var newRewardData = [{"title":"Early Access Stickers","stitle":"Get all the hike stickers before everyone else","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":1,"streak":0,"type":"sticker_reward"},{"title":"Express GIF","stitle":"Express yourself with GIFs, like no one else can","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":3,"streak":35,"type":"exclusive_feature"},{"title":"Submit Content","stitle":"Submit hike content and get recognition","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":5,"streak":60,"type":"user_generated_content"},{"title":"My Sticker","stitle":"Have an exclusive sticker made just for you","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":6,"streak":0,"type":"custom_sticker"}];
	                // rewardsModel.updateNinjaRewards(newRewardData,App);

	                // STUB TO REMOVE

	                App.NinjaService.getNinjaRewards(function(res) {
	                    console.log("NINJA REWARDS ARE", res.data);
	                    rewardsModel.updateNinjaRewards(res.data, App);
	                }, this);


	            } else {
	                console.log("The rewards hash matches perfectly :: No need to update the rewards new model");
	            }
	        },

	        // Add String Compare Functions Here
	        checkNinjaState: function(status) {
	            if (status == 'active') {
	                return 'active';
	            } else if (status == 'blocked') {
	                return 'blocked';
	            } else if (status == 'lapsed') {
	                return 'lapsed';
	            }
	        },


	        // Check and Update Adhoc reward
	        checkAndUpdateAdhocReward: function(res) {
	            console.log(res);
	            if(res.adhoc_reward && res.adhoc_reward.length > 0){
	                console.log("At least one reward is present");
	                console.log(res.adhoc_reward);
	                cacheProvider.setInCritical('adhocRewardForUser', res.adhoc_reward);
	            }else{
	                console.log("No adhoc reward is present");
	            }
	        },

	        // Updates the Ninja Profile Data and check For Reward Status here

	        updateNinjaData: function(data, App) {

	            // Check the Reward Page and Update Rewards if need be
	            this.checkRewardStatus(data.rewards_hash, App);
	            this.checkAndUpdateAdhocReward(data,App);

	            var ninjaProfileData = [];
	            ninjaProfileData = data;

	            if(platformSdk.platformVersion >= 15){
	                console.log("Platform Verison is latest");

	                platformSdk.nativeReq({
	                fn: 'getUserProfile',
	                ctx: this,
	                data: "",
	                success: function(res) {

	                    res = JSON.parse(decodeURIComponent(res));
	                    
	                    ninjaProfileData.name = res.name;
	                    ninjaProfileData.dp = res.fp;

	                    console.log("NINJA PROFILE DATA IS", ninjaProfileData);

	                    // UI Definition 
	                    var streakValue = document.getElementsByClassName('ninjaStreakValue')[0];
	                    var batteryValue = document.getElementsByClassName('ninjaBatteryValue')[0];
	                    var ninjaName = document.getElementsByClassName('ninjaName')[0];
	                    var ninjaIcon = document.getElementsByClassName('ninjaProfileIcon')[0];

	                    if(ninjaProfileData.streak){
	                        streakValue.innerHTML = ninjaProfileData.streak;    
	                    }else{
	                        streakValue.innerHTML = 0;
	                    }

	                    if(ninjaProfileData.battery){
	                        batteryValue.innerHTML = ninjaProfileData.battery;    
	                    }else{
	                        batteryValue.innerHTML = 0;
	                    }
	                    
	                    ninjaName.innerHTML = ninjaProfileData.name;

	                    // For Dp Refer the Android Client DP Path
	                    if (ninjaProfileData.dp) {
	                        ninjaIcon.style.backgroundImage = "url('file:///" + ninjaProfileData.dp + "')";
	                    } else {
	                        console.log("Set a default dp");
	                    }
	                    cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
	                    //var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

	                }
	            });
	            }else{
	                    console.log("Platform Verison is old");
	                    console.log("NINJA PROFILE DATA IS", ninjaProfileData);

	                    // UI Definition 
	                    var streakValue = document.getElementsByClassName('ninjaStreakValue')[0];
	                    var batteryValue = document.getElementsByClassName('ninjaBatteryValue')[0];
	                    var ninjaName = document.getElementsByClassName('ninjaName')[0];
	                    var ninjaIcon = document.getElementsByClassName('ninjaProfileIcon')[0];

	                    if(ninjaProfileData.streak){
	                        streakValue.innerHTML = ninjaProfileData.streak;    
	                    }else{
	                        streakValue.innerHTML = 0;
	                    }

	                    if(ninjaProfileData.battery){
	                        batteryValue.innerHTML = ninjaProfileData.battery;    
	                    }else{
	                        batteryValue.innerHTML = 0;
	                    }
	                    
	                    ninjaName.innerHTML = ninjaProfileData.name;

	                    // For Dp Refer the Android Client DP Path
	                    if (ninjaProfileData.dp) {
	                        ninjaIcon.style.backgroundImage = "url('file:///" + ninjaProfileData.dp + "')";
	                    } else {
	                        console.log("Set a default dp");
	                    }
	                    cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
	                    //var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

	            }
	            
	        },

	    };

	    module.exports = new ProfileModel();
	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by hemanksabharwal on 17/05/15.
	 */

	(function () {
	    'use strict';

	    var platformSdk = __webpack_require__(3),
	        utils = __webpack_require__(4),

	        CacheProvider = function () {},

	        EMPTY_OBJ_READ_ONLY = {};

	    CacheProvider.prototype = {
	        // Get From Cache Hike Android
	        get: function (options) {
	            return platformSdk.nativeReq({
	                ctx: options.ctx,
	                success: options.success,
	                fn: 'getFromCache',
	                data: options.key
	            });    
	        },

	        // Cache Set 
	        set: function (key, val) {
	            platformSdk.bridge.putInCache(key, (val));    
	        },

	        // Critical Cache is Microapp - Helper Data
	        getFromCritical: function (key) {
	            var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

	            return helperData[key];
	        },

	        // Sets in helper data which does not get erased upon clearing app data.
	        setInCritical: function (key, value) {
	            var helperData = platformSdk.appData.helperData || {};

	            helperData[key] = value;
	            platformSdk.updateHelperData(helperData);
	        },

	    };

	    module.exports = new CacheProvider();
	})();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by hemanksabharwal on 17/05/15.
	 */

	(function() {
	    'use strict';

	    var platformSdk = __webpack_require__(3),
	        utils = __webpack_require__(4),
	        cacheProvider = __webpack_require__(10), 
	        Constants = __webpack_require__(5),

	        RewardsModel = function() {},

	        EMPTY_OBJ_READ_ONLY = {};

	    RewardsModel.prototype = {

	        // Get Reward Router Associated To Type Of Reward
	        getRewardRouter: function(rewardType) {
	            if (rewardType == 'sticker_reward') {
	                return '/stickerReward';
	            } else if (rewardType == 'exclusive_feature') {
	                return '/exclusiveFeature';
	            } else if (rewardType == 'user_generated_content') {
	                return '/ugc';
	            } else if (rewardType == 'custom_sticker') {
	                return '/customSticker';
	            }
	        },

	        showRewardStateToast: function(state) {
	            if (state == Constants.REWARD_STATE.UNLOCKED) {
	                console.log("The state is currently unlocked :: Can open the reward");
	            } else if (state == Constants.REWARD_STATE.LOCKED) {
	                utils.showToast('The reward is currently under locked state. Try again once you unlock it at a higher streak');
	            } else if (state == Constants.REWARD_STATE.REDEEMED) {
	                console.log("Reward already redeemed once or more.");
	            } else if (state == Constants.REWARD_STATE.DISABLED) {
	                utils.showToast('The reward is in disabled state, sorry for the inconvienience');
	            }
	        },

	        updateNinjaRewardsIcons: function(data){
	            var that = this;

	            var allRewards = document.getElementsByClassName('rewardRow');

	            if (allRewards.length) {
	                console.log(allRewards);
	                for (var i = 0; i < allRewards.length; i++) {
	                    var icon = allRewards[i].getElementsByClassName('rewardIcon')[0];
	                    icon.style.backgroundImage = 'url(\'' + data[i].icon + '\')';
	                }
	            }
	        },

	        // Update the ninja Click Events For rewards
	        updateNinjaRewardsLinks: function(App) {

	            var that = this;

	            var allRewards = document.getElementsByClassName('rewardRow');

	            if (allRewards.length) {
	                console.log(allRewards);
	                for (var i = 0; i < allRewards.length; i++) {
	                    allRewards[i].addEventListener('click', function(event) {

	                        // Get Reward related information
	                        var rewardState = this.getAttribute('data-state');

	                        if (rewardState == Constants.REWARD_STATE.LOCKED) {
	                            that.showRewardStateToast(rewardState);
	                            return;
	                        } else if (rewardState == Constants.REWARD_STATE.DISABLED) {
	                            that.showRewardStateToast(rewardState);
	                            return;
	                        }

	                        var rewardType = this.getAttribute('data-rewardtype');
	                        var rewardRouter = that.getRewardRouter(rewardType);
	                        var rewardId = this.getAttribute('data-rewardId');

	                        var data = {};
	                        data.rewardId = rewardId;

	                        // STUB TO REMOVE 

	                        // var GifRes = {'desc':"Now express your feelings with animated GIFs",'hicon':"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png",'title': 'Animated GIF'};
	                        // App.router.navigateTo(rewardRouter,{ "rewardDetails": GifRes , "rewardId" :rewardId, "rewardRouter":rewardRouter} );

	                        // STUB TO REMOVE

	                        // Reward Details API :: Send Reward Id As well
	                        App.NinjaService.getRewardDetails(data, function(res) {
	                            console.log(res.data);
	                             App.router.navigateTo(rewardRouter,{ "rewardDetails": res.data , "rewardId" :rewardId, "rewardRouter":rewardRouter} );
	                        }, this);
	                    });
	                }
	            }
	        },

	        // Update Ninja Rewards HTML
	        updateNinjaRewards: function(rewardsData, App) {

	            console.log('Updating the Ninja Rewards Old By New Ninja Rewards');
	            console.log(rewardsData);

	            // update helper data with new rewards

	            cacheProvider.setInCritical('ninjaRewards', rewardsData);
	            console.log("helper data is", platformSdk.appData.helperData);

	            var ninjaRewardsListOld = document.getElementsByClassName('rewardsContainer')[0]; // Gives Existing List of Rewards in the Template
	            ninjaRewardsListOld.innerHTML = '';

	            // Re Render The Reward Template Only From External HTML
	            this.template = __webpack_require__(12);

	            // To remove later for adhoc

	            var adhocReward = cacheProvider.getFromCritical('adhocRewardForUser');

	            if(adhocReward){
	                for(var i = 0; i<adhocReward.length; i++){
	                    rewardsData.rewards.push(adhocReward[i]);
	                    //adhocReward.splice(i,1);
	                }
	            }
	            
	            cacheProvider.setInCritical('adhocRewardForUser',adhocReward);

	            ninjaRewardsListOld.innerHTML = Mustache.render(this.template, {
	                ninjaRewardsCollection: (typeof rewardsData === 'undefined'? {} : rewardsData.rewards),
	                lockedGreyout : cacheProvider.getFromCritical('lockedGreyout')
	            });

	            this.updateNinjaRewardsLinks(App);
	            this.updateNinjaRewardsIcons(rewardsData.rewards);
	        }

	    };

	    module.exports = new RewardsModel();
	})();

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "{{#ninjaRewardsCollection}}\n<li class=\"rewardRow\" data-rewardId=\"{{id}}\" data-state=\"{{state}}\" data-rewardtype=\"{{type}}\">\n    <div class=\"rewardIcon\"></div>\n    <div class=\"rewardDetails\">\n        <p class=\"rewardHeading    {{^state}}{{#lockedGreyout}}rewardHeadingLocked{{/lockedGreyout}}{{/state}}\">{{title}}</p>\n        <p class=\"rewardSubheading {{^state}}{{#lockedGreyout}}rewardSubheadingLocked{{/lockedGreyout}}{{/state}}\">{{stitle}}</p>\n    </div>\n    {{#streak}}\n    <div class=\"rewardStreakWrapper\">\n        <div class=\"rewardStreakIcon\"></div>\n        <div class=\"rewardStreakValue\">{{streak}}</div>\n    </div>\n    {{/streak}}\n</li>\n{{/ninjaRewardsCollection}}"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4);
	    var checkTimeout = null;

	    var Constants = __webpack_require__(5);

	    var TxService = function() {},
	        checkConnection = function(fn, ctx) {

	            // For Devices, else case to run on Chrome's onLine method

	            if (platformSdk.bridgeEnabled) {
	                platformSdk.nativeReq({
	                    fn: 'checkConnection',
	                    ctx: this,
	                    data: "",
	                    success: function(response) {
	                        if (typeof fn === "function") {
	                            fn.call(ctx, response);
	                        }
	                    }
	                });
	            } else {
	                if (navigator.onLine) {
	                    if (typeof fn === "function") fn.call(ctx, navigator.onLine);
	                } else {
	                    if (typeof fn === "function") fn.call(ctx, -1);
	                }
	            }
	        };

	    TxService.prototype = {
	        communicate: function(params, fn, x) {
	            var that = this,
	                requestUrl = params.url,

	                successCb = function(res) {
	                    console.log("Success", res);

	                    var response;

	                    platformSdk.events.publish('app/offline', { show: false });

	                    try {
	                        res = JSON.parse(decodeURIComponent(res));
	                        if (platformSdk.bridgeEnabled)
	                            res = JSON.parse(res.response);
	                    } catch (e) {
	                        return false;
	                    }

	                    if (res) {
	                        if (res.stat == "ok") {
	                            console.log(res);
	                            fn.call(x, res);
	                        } else {
	                            console.log(res);
	                            if (res.stat == 'fail') {
	                                events.publish('update.loader', { show: false });
	                                console.log(res.data.reason);
	                                platformSdk.ui.showToast(res.data.reason);
	                            }
	                        }
	                    } else {
	                        if (platformSdk.bridgeEnabled) {
	                            // Switch Off Loader and Show Toast
	                            events.publish('update.loader', { show: false });
	                            platformSdk.ui.showToast("Hmm. Something went wrong. Not to worry, try again in a little bit :)");
	                        } else {
	                            console.log("Hmm. Something went wrong. Not to worry, try again in a little bit :)");
	                        }
	                    }
	                };

	            // For Every API Call start the Loader Once The Api Hits Communicate

	            if (params.loader) {
	                platformSdk.events.publish('update.loader', { show: false });
	            }

	            checkConnection(function(connType) {
	                if (connType === Constants.ConnectionTypes.NO_NETWORK) {
	                    // Show no internet screen.
	                    platformSdk.events.publish('app/offline', {
	                        show: true
	                    });

	                    return;
	                }

	                platformSdk.events.publish('app/offline', {
	                    show: false
	                });
	                if (platformSdk.bridgeEnabled) {
	                    if (params.type === 'GET') {
	                        console.log('calling service GET', requestUrl);

	                        platformSdk.nativeReq({
	                            fn: 'doGetRequest',
	                            ctx: params.ctx || that,
	                            data: requestUrl,
	                            success: successCb
	                        });
	                    } else if (params.type === 'POST') {
	                        var data = {};
	                        data.url = params.url;

	                        if (params.data) {
	                            data.params = params.data;
	                        } else {
	                            data.params = {};
	                        }

	                        console.log('calling service POST', data);
	                        data = JSON.stringify(data);

	                        platformSdk.nativeReq({
	                            fn: 'doPostRequest',
	                            ctx: params.ctx || this,
	                            data: data,
	                            success: successCb
	                        });
	                    }
	                } else {
	                    platformSdk.ajax({
	                        type: params.type,
	                        url: requestUrl,
	                        timeout: 30000,
	                        data: params.data !== undefined ? JSON.stringify(params.data) : null,
	                        headers: params.headers,
	                        success: successCb
	                    });
	                }



	            });
	        }
	    };

	    module.exports = TxService;

	})(window, platformSdk, platformSdk.events);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4);
	    var cacheProvider = __webpack_require__(10);
	    var Constants = __webpack_require__(5);
	    var checkTimeout = null;

	    var ninjaService = function(service) {
	        this.ninjaService = service;
	    };

	    var URL = {
	        api_location: appConfig.API_URL
	    };

	    ninjaService.prototype = {

	        // Subscribe Call For Engine / Game
	        subscribeHandler: function(data, fn, x) {
	            console.log(data);
	            var params = {
	                'url': URL.api_location + '/subscribe?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST',
	                'data': data
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        // Subscribe Call For Engine / Game
	        unsubscribeHandler: function(data, fn, x) {
	            console.log(data);
	            var params = {
	                'url': URL.api_location + '/unsubscribe?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST',
	                'data': data
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },


	        // Profile Service For Ninja 
	        getNinjaProfile: function(fn, x) {

	            var dpRequired = true;
	            var params = {};

	            if (platformSdk.appVersion >= 15) {
	                dpRequired = false;
	            }

	            if (dpRequired === true) {
	                console.log("DP IS REQUIRED IN CALL");
	                params = {
	                    'url': URL.api_location + '/profile?dp=' + dpRequired + '&random=' + Math.round(Math.random() * 999999999),
	                    'type': 'GET'
	                };
	            } else {
	                params = {
	                    'url': URL.api_location + '/profile?random=' + Math.round(Math.random() * 999999999),
	                    'type': 'GET'
	                };
	            }

	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        // Get complete Ninja List of Rewards That can be earned By Work
	        getNinjaRewards: function(fn, x) {
	            var params = {
	                'url': URL.api_location + '/rewards?random=' + Math.round(Math.random() * 999999999),
	                'type': 'GET'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        // Get Ninja Acitivty/Stats for Lifetime :: 30 days :: 7 days 
	        getNinjaActivity: function(fn, x) {
	            var params = {
	                'url': URL.api_location + '/stats?random=' + Math.round(Math.random() * 999999999),
	                'type': 'GET'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        // Get Speicifc Reward Details For The Reward Router
	        getRewardDetails: function(data, fn, x) {
	            console.log(data);
	            events.publish('update.loader', { show: true });
	            var params = {
	                'url': URL.api_location + '/rewards/' + data.rewardId + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'GET'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        uploadCustomStickerData: function(data, fn, x) {
	            console.log(data);
	            var params = {
	                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST',
	                'data': data.send
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        sendCustomSticker: function(data, fn, x) {
	            var params = {
	                'url': URL.api_location + '/custom_sticker/tid/' + data.rewardId + '/sid/' + data.customStickerId + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'GET'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        getMysteryBox: function(fn, x) {
	            var params = {
	                'url': URL.api_location + '/mysterybox' + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'GET'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        getMysteryBoxResult: function(fn, x) {
	            var params = {
	                'url': URL.api_location + '/mysterybox' + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST'
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);
	        },

	        getStickerPack: function(data, fn, x) {
	            console.log("Getting Sticker Pack For the User");
	            var params = {
	                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST',
	                'data': data.send
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);

	        },

	        getExclusiveFeature: function(data, fn, x) {
	            console.log("Getting Exclusive feature for you");
	            var params = {
	                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
	                'type': 'POST',
	                'data': { 'enable': data.enable }
	            };
	            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
	            else this.ninjaService.communicate(params);

	        }

	        // Rewards Service For Ninja 

	        // Activity Service For Ninja
	    };

	    module.exports = ninjaService;

	})(window, platformSdk, platformSdk.events);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by hemanksabharwal on 17/05/15.
	 */

	(function() {
	    'use strict';

	    var platformSdk = __webpack_require__(3),
	        utils = __webpack_require__(4),
	        cacheProvider = __webpack_require__(10),
	        TxService = __webpack_require__(13),
	        NinjaService = __webpack_require__(14),

	        ActivityModel = function() {
	            this.TxService = new TxService();
	            this.NinjaService = new NinjaService(this.TxService); //communication layer
	        },

	        EMPTY_OBJ_READ_ONLY = {};

	    ActivityModel.prototype = {

	        getNumberAbrr: function(value) {
	            var newValue = value;
	            if (value >= 1000) {
	                var suffixes = ['', 'K', 'M', 'B', 'T'];
	                var suffixNum = Math.floor(('' + value).length / 3);
	                var shortValue = '';
	                var shortNum;
	                for (var precision = 2; precision >= 1; precision--) {
	                    shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
	                    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
	                    if (dotLessShortValue.length <= 2) {
	                        break;
	                    }
	                }
	                if (shortValue % 1 !== 0) shortNum = shortValue.toFixed(1);
	                newValue = shortValue + suffixes[suffixNum];
	            }
	            return newValue;
	        },

	        formatActivityData: function(activityData) {

	            var that = this;
	            for (var key in activityData) {

	                if (typeof activityData[key].sent != 'undefined')
	                    activityData[key].sent = that.getNumberAbrr(activityData[key].sent);

	                if (typeof activityData[key].rec != 'undefined')
	                    activityData[key].rec = that.getNumberAbrr(activityData[key].rec);

	                if (typeof activityData[key].count != 'undefined')
	                    activityData[key].count = that.getNumberAbrr(activityData[key].count);

	            }
	        },

	        fetchNinjaActivity: function(timeperiod) {
	            console.log('Fetching the ninja activity for the lifetime');

	            // Not used as of now for :: Check Weather for 30 days or 7 days needed :: Product Call
	            var data = { 'duration': timeperiod };

	            // Timeperiod can be of three type :: Lifetime/ Last month / Last week :: decide the activity value string/integer

	            // STUB TO REMOVE
	            // var res = { 'data': { 'chatThemes': { 'rec': 10, 'sent': 10 }, 'files': { 'rec': 155, 'sent': 139 }, 'messages': { 'rec': 1203, 'sent': 187 }, 'statusUpdates': { 'count': 10 }, 'stickers': { 'rec': 133, 'sent': 17 } } };
	            // this.updateNinjaActivityTab( res.data );

	            // STUB TO REMOVE

	            this.NinjaService.getNinjaActivity(function(res) {
	                console.log(res.data);
	                // Set In Critical cache for quick fetch
	                cacheProvider.setInCritical('ninjaStats', res.data);
	                this.updateNinjaActivityTab(res.data);
	            }, this);
	        },

	        updateNinjaActivityTab: function(activityData) {
	            console.log('Updating the activity Three tab in Ninja');

	            this.formatActivityData(activityData);

	            var statsWrapper = document.getElementsByClassName('statsWrapper')[0]; // Gives Existing List of Rewards in the Template
	            statsWrapper.innerHTML = '';

	            // Re Render The Reward Template Only From External HTML
	            this.template = __webpack_require__(16);
	            statsWrapper.innerHTML = Mustache.render(this.template, {
	                ninjaActivityData: activityData
	            });
	        }

	    };

	    module.exports = new ActivityModel();
	})();


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "{{#ninjaActivityData}}\n<div class=\"statTypeContainer\">\n    <div class=\"statHeading\">Messaging</div>\n    <div class=\"statBoxWrapper statBoxFloatLeft\">\n        <div class=\"statValue messagesR\">{{ninjaActivityData.messages.rec}}</div>\n        <div class=\"statText\">Messages Received</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatRight\">\n        <div class=\"statValue messagesS\">{{ninjaActivityData.messages.sent}}</div>\n        <div class=\"statText\">Messages Sent</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatLeft\">\n        <div class=\"statValue stickersR\">{{ninjaActivityData.stickers.rec}}</div>\n        <div class=\"statText\">Stickers Received</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatRight\">\n        <div class=\"statValue stickersS\">{{ninjaActivityData.stickers.sent}}</div>\n        <div class=\"statText\">Stickers Sent</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatLeft\">\n        <div class=\"statValue chatThemesR\">{{ninjaActivityData.chatThemes.rec}}</div>\n        <div class=\"statText\">Chat Themes Received</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatRight\">\n        <div class=\"statValue chatThemesS\">{{ninjaActivityData.chatThemes.sent}}</div>\n        <div class=\"statText\">Chat Themes Sent</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatLeft\">\n        <div class=\"statValue filesR\">{{ninjaActivityData.files.rec}}</div>\n        <div class=\"statText\">Files Received</div>\n    </div>\n    <div class=\"statBoxWrapper statBoxFloatRight\">\n        <div class=\"statValue filesS\">{{ninjaActivityData.files.sent}}</div>\n        <div class=\"statText\">Files Sent</div>\n    </div>\n</div>\n<div class=\"statTypeContainer\">\n    <div class=\"statHeading\">Timeline</div>\n    <div class=\"statBoxWrapper statBoxFloatLeft\">\n        <div class=\"statValue statusUpdateCount\">{{ninjaActivityData.statusUpdates.count}}</div>\n        <div class=\"statText\">Status Updates Posted</div>\n    </div>\n</div>\n{{/ninjaActivityData}}\n"

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by hemanksabharwal on 17/05/15.
	 */

	(function() {
	    'use strict';

	    var platformSdk = __webpack_require__( 3 ),
	        utils = __webpack_require__( 4 ),
	        cacheProvider = __webpack_require__( 10 ),
	        profileModel = __webpack_require__( 9 ),
	        rewardsModel = __webpack_require__( 11 ),
	        TxService = __webpack_require__( 13 ),
	        NinjaService = __webpack_require__( 14 ),

	        MysteryBoxModel = function() {
	            this.TxService = new TxService();
	            this.NinjaService = new NinjaService( this.TxService ); //communication layer
	        },

	        EMPTY_OBJ_READ_ONLY = {};

	    MysteryBoxModel.prototype = {

	        getMysteryBoxDetails: function( App ) {

	            // Active :: Can Spin The Wheel and Earn Some Gift

	            // Inactive :: The Wheel is Not Available as of now

	            // Under Cooldown :: The spinning has been done and under cooldown period

	            // STUB TO REMOVE

	            // var res1 = { 'data': { 'status': 'active', 'rewards': [{ 'id': 1, 'type': 'mysteryBox_medium', 'title': 'Battery + 1' }, { 'id': 2, 'type': 'mysteryBox_medium', 'title': 'Streak + 1' }, { 'id': 3, 'type': 'mysteryBox_low', 'title': 'Battery + 0' }, { 'id': 4, 'type': 'mysteryBox_low', 'title': 'Streak + 0' }, { 'id': 5, 'type': 'mysteryBox_bumper', 'title': 'Custom sticker' }, { 'id': 6, 'type': 'mysteryBox_low', 'title': 'Battery - 1' }, { 'id': 7, 'type': 'mysteryBox_low', 'title': 'streak - 1' }, { 'id': 8, 'type': 'mysteryBox_low', 'title': 'Better Luck next time' }] } };
	            // var res2 = { 'data': { 'status': 'inactive', 'rewards': [], 'streakToUnlock': 14 } };
	            // var res3 = { 'data': { 'status': 'cooldown', 'rewards': [], 'coolDownTime': 1470916209263 } };

	            // this.updateMysteryBoxTab(res1.data, App);

	            // STUB TO REMOVE

	            App.NinjaService.getMysteryBox(function( res ) {
	                console.log( 'MYSTERY BOX DATA IS', res.data );
	                this.updateMysteryBoxTab( res.data, App );
	            }, this );

	        },

	        getMysteryBoxRewardDetails: function( data, rId ) {

	            for ( var i = 0; i < data.length; i++ ) {
	                if ( data[i].id == rId ) {
	                    console.log( 'Match found', data[i] );
	                    return data[i];
	                } else {
	                    console.log( 'Reward not found' );
	                }
	            }
	        },

	        defineYesterdayWinner: function( data ) {
	            var winnerIcon = document.getElementsByClassName( 'winnerIcon' )[0];
	            winnerIcon.style.backgroundImage = 'url(\'data:image/png;base64,' + data.dp + '\')';
	        },

	        defineLuckyBoxRewardIcons: function( data ) {

	            var mBoxRewardIcon = document.getElementsByClassName( 'mBoxRewardIcon' );
	            
	            for ( var i = 0; i < mBoxRewardIcon.length; i++ ) {
	                mBoxRewardIcon[i].style.backgroundImage = 'url(\'' + data[i].icon + '\')';
	            }
	        },

	        defineMysteryBoxResultAnimation: function( App, rewardData, cooldownTime ) {

	            var that = this;

	            var mysteryBoxContainer = document.getElementsByClassName( 'mysteryBoxContainer' )[0]; // Gives Existing List of Rewards in the Template
	            //mysteryBoxContainer.innerHTML = '';

	            if ( rewardData.value == 'HIGH' ) {
	                console.log( 'Bumper Anmation' );
	                that.template = __webpack_require__( 18 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    mysterBoxReward: rewardData
	                });

	                var mysteryRewardBumperAction = document.getElementsByClassName( 'mysteryRewardBumperAction' )[0];
	                mysteryRewardBumperAction.addEventListener( 'click', function() {

	                    var rid = this.getAttribute( 'data-rid' );
	                    var rewardType = this.getAttribute( 'data-rewardtype' );

	                    var rewardRouter = rewardsModel.getRewardRouter( rewardType );

	                    var data = {};
	                    data.rewardId = rid;

	                    App.NinjaService.getRewardDetails( data, function( res ) {
	                        console.log( res.data );
	                        App.router.navigateTo( rewardRouter, { 'rewardDetails': res.data, 'rewardId': rid, 'rewardRouter': rewardRouter });
	                    }, this );

	                });

	            } else if ( rewardData.value == 'LOW' ) {
	                console.log( 'Low animation :: Figure Out design' );
	                that.template = __webpack_require__( 19 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    mysterBoxReward: rewardData
	                });

	                var mysteryRewardActionLow = document.getElementsByClassName( 'mysteryRewardAction' )[0];
	                mysteryRewardActionLow.addEventListener( 'click', function() {
	                    that.template = __webpack_require__( 20 );
	                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {});
	                    that.defineCooldown( cooldownTime, App );
	                });

	                App.NinjaService.getNinjaProfile(function( res ) {
	                    console.log( 'REUPDATING THE PROFILE', res.data );
	                    profileModel.updateNinjaData( res.data, App );
	                }, that );

	            } else if ( rewardData.value == 'MED' ) {
	                console.log( 'Low animation :: Figure Out Design' );
	                that.template = __webpack_require__( 19 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    mysterBoxReward: rewardData
	                });

	                var mysteryRewardActionMed = document.getElementsByClassName( 'mysteryRewardAction' )[0];
	                mysteryRewardActionMed.addEventListener( 'click', function() {
	                    that.template = __webpack_require__( 20 );
	                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {});
	                    that.defineCooldown( cooldownTime, App );
	                });

	                App.NinjaService.getNinjaProfile(function( res ) {
	                    console.log( 'REUPDATING THE PROFILE', res.data );
	                    profileModel.updateNinjaData( res.data, App );
	                }, that );

	            }
	        },

	        mapRewardsToSlice: function( mysteryBoxData ) {
	            console.log( mysteryBoxData );

	            var slices = document.getElementsByClassName( 'part' );

	            for ( var i = 0; i < slices.length; i++ ) {
	                slices[i].setAttribute( 'data-reward', mysteryBoxData.rewards[i].id );
	            }

	            // Set Icons here as well
	        },

	        getRewardMapping: function( resultId, mysteryBoxData ) {

	            var slices = document.getElementsByClassName( 'part' );

	            for ( var i = 0; i < slices.length; i++ ) {
	                var result = slices[i].getAttribute( 'data-reward' );
	                if ( result == resultId ) {
	                    var winner = slices[i].getAttribute( 'data-slice' );
	                    return winner;
	                } else {
	                    console.log( 'No reward Found' );
	                }
	            }
	        },

	        defineMysteryBoxHistoryAction: function( App, historyData ) {

	            var that = this;

	            var bumperRow = document.getElementsByClassName( 'bumperRow' );
	            var bumperRowIcon = document.getElementsByClassName( 'bumperRowIcon' );

	            for ( var i = 0; i < bumperRowIcon.length; i++ ) {
	                bumperRowIcon[i].style.backgroundImage = 'url(\'' + historyData[i].icon + '\')';
	            }

	            for ( var j = 0; j < bumperRow.length; j++ ) {
	                bumperRow[j].addEventListener( 'click', function( event ) {

	                    var rid = this.getAttribute( 'data-rid' );
	                    var url = this.getAttribute( 'data-url' );
	                    var rewardType = this.getAttribute( 'data-rewardtype' );

	                    var rewardRouter = rewardsModel.getRewardRouter( rewardType );

	                    var data = {};
	                    data.rewardId = rid;

	                    App.NinjaService.getRewardDetails( data, function( res ) {
	                        console.log( res.data );
	                        App.router.navigateTo( rewardRouter, { 'rewardDetails': res.data, 'rewardId': rid, 'rewardRouter': rewardRouter });
	                    }, this );
	                });
	            }

	        },

	        defineLuckyBox: function( App, mysteryBoxData ) {

	            var that = this;

	            var spin = document.getElementById( 'spin' );
	            var wheel = document.getElementById( 'wheel' );
	            var result = document.getElementById( 'result' );

	            var rewardData = null;
	            var cooldownTime = null;

	            var setText = function( a, b, c ) {
	                a.addEventListener( 'transitionend', function() {
	                    b.innerText = rewardData.title;
	                    that.defineMysteryBoxResultAnimation( App, rewardData, cooldownTime );
	                    a.removeEventListener( 'transitionend', setText );
	                });
	            };

	            var deg = 0;
	            var rotations = 0;

	            spin.addEventListener( 'click', function() {
	                rotations++;
	                App.NinjaService.getMysteryBoxResult(function( res ) {
	                    console.log( res.data );
	                    mysteryBoxData.spin_result = res.data.spin_result;

	                    // Result of Spin
	                    var spinResult = that.getRewardMapping( mysteryBoxData.spin_result.id, mysteryBoxData );
	                    console.log( 'WINNER IS', spinResult );
	                    rewardData = mysteryBoxData.spin_result;
	                    cooldownTime = res.data.cooldown_time;

	                    // Define Wheel
	                    var stop = spinResult;
	                    console.log( 'stop is', stop );
	                    var rotationFix = 360 / 16 + 360 / 8 + rotations * 720;
	                    deg = 360 / 8 * stop + rotationFix;
	                    var rot = 'rotate3d(0,0,1,' + deg + 'deg)';
	                    wheel.style.transform = rot;
	                    wheel.style.webkitTransform = rot;
	                    setText( wheel, result, rewardData );
	                }, that );
	            });

	        },

	        defineCooldown: function( spinTimeLeft, App ) {

	            var that = this;

	            function getTimeRemaining( timeRemaining ) {
	                var t = timeRemaining;
	                var seconds = Math.floor( ( t / 1000 ) % 60 );
	                var minutes = Math.floor( ( t / 1000 / 60 ) % 60 );
	                var hours = Math.floor( ( t / ( 1000 * 60 * 60 ) ) % 24 );
	                var days = Math.floor( t / ( 1000 * 60 * 60 * 24 ) );
	                return {
	                    'total': t,
	                    'days': days,
	                    'hours': hours,
	                    'minutes': minutes,
	                    'seconds': seconds
	                };
	            }

	            function initializeClock( id, timeRemaining ) {
	                var clock = document.getElementById( id );
	                var daysSpan = clock.querySelector( '.days' );
	                var hoursSpan = clock.querySelector( '.hours' );
	                var minutesSpan = clock.querySelector( '.minutes' );
	                var secondsSpan = clock.querySelector( '.seconds' );

	                function updateClock() {
	                    var t = getTimeRemaining( timeRemaining );

	                    daysSpan.innerHTML = t.days;
	                    hoursSpan.innerHTML = ( '0' + t.hours ).slice( -2 );
	                    minutesSpan.innerHTML = ( '0' + t.minutes ).slice( -2 );
	                    secondsSpan.innerHTML = ( '0' + t.seconds ).slice( -2 );

	                    if ( t.total <= 0 ) {
	                        clearInterval( timeinterval );
	                        console.log( 'Cooldown has ended' );
	                        App.NinjaService.getMysteryBox(function( res ) {
	                            console.log( 'MYSTERY BOX DATA IS', res.data );
	                            that.updateMysteryBoxTab( res.data, App );
	                        }, that );
	                    }
	                    timeRemaining = timeRemaining - 1000;
	                }

	                updateClock();
	                var timeinterval = setInterval( updateClock, 1000 );
	            }

	            initializeClock( 'clockdiv', spinTimeLeft * 1000 );
	        },

	        updateMysteryBoxTab: function( mysteryBoxData, App ) {

	            var that = this;

	            var mysteryBoxContainer = document.getElementsByClassName( 'mysteryBoxContainer' )[0]; // Gives Existing List of Rewards in the Template
	            var showMysteryBoxHistoryButton = false;
	            mysteryBoxContainer.innerHTML = '';

	            if ( mysteryBoxData.history.length > 0 ) {
	                showMysteryBoxHistoryButton = true;
	            }

	            if ( mysteryBoxData.mstatus == 'inactive' ) {

	                // Re Render The Reward Template Only From External HTML
	                that.template = __webpack_require__( 21 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    streakToUnlock: mysteryBoxData.streak_unlock
	                });
	            } else if ( mysteryBoxData.mstatus == 'active' ) {

	                that.template = __webpack_require__( 22 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    previousWinner: mysteryBoxData.yesterday_winner,
	                    showMysteryBoxHistoryButton: showMysteryBoxHistoryButton
	                });
	                that.mapRewardsToSlice( mysteryBoxData );
	                that.defineLuckyBox( App, mysteryBoxData );
	                that.defineLuckyBoxRewardIcons( mysteryBoxData.rewards );
	                that.defineYesterdayWinner( mysteryBoxData.yesterday_winner );

	            } else if ( mysteryBoxData.mstatus == 'cooldown' ) {

	                console.log( mysteryBoxData );

	                that.template = __webpack_require__( 20 );
	                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                    showMysteryBoxHistoryButton: showMysteryBoxHistoryButton
	                });

	                that.defineCooldown( mysteryBoxData.time_left, App );

	            } else {
	                console.log( 'Add a default state here Later' );
	            }

	            var mHistoryButton = document.getElementsByClassName( 'mysteryBoxHistory' )[0];

	            if ( showMysteryBoxHistoryButton && mHistoryButton ) {
	                mHistoryButton.addEventListener( 'click', function() {
	                    console.log( 'Opening your Mystery Box History' );

	                    that.template = __webpack_require__( 23 );
	                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
	                        mysteryBoxHistory: mysteryBoxData.history
	                    });

	                    that.defineMysteryBoxHistoryAction( App, mysteryBoxData.history );
	                });

	            }

	            var swipeTab = document.getElementsByClassName( 'swipeTab' )[0];

	            if ( swipeTab ) {
	                console.log( 'Scrolling to top' );
	                swipeTab.scrollTop = 0;
	            }

	        }

	    };

	    module.exports = new MysteryBoxModel();
	})();


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "{{#mysterBoxReward}}\n\t<div class=\"mysteryBoxIcon\"></div>\n\t<div class=\"mysteryBoxMessageSpin\">Congrats! You’ve unlocked the grand prize - {{title}}. Get your gift now.</div>\n\t<div class=\"actionContainer align-center\">\n\t\t<div data-rid=\"{{tid}}\" data-rewardtype=\"{{type}}\" class=\"mysteryRewardBumperAction align-center\">Claim</div>\n\t</div>\n{{/mysterBoxReward}}\n"

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "{{#mysterBoxReward}}\n\t<div class=\"mysteryBoxIcon align-center\"></div>\n\t<div class=\"mysteryBoxMessageSpin align-center\">{{title}}</div>\n\t<div class=\"actionContainer align-center\">\n\t\t<div data-id=\"{{id}}\" class=\"mysteryRewardAction align-center\">Got It</div>\n\t</div>\n{{/mysterBoxReward}}"

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"mysteryBoxIcon align-center\"></div>\n<div class=\"mysteryBoxCounter align-center\">\n    <div id=\"clockdiv\">\n        <div>\n            <span class=\"days\"></span>\n            <div class=\"smalltext\">Days</div>\n        </div>\n        <div>\n            <span class=\"hours\"></span>\n            <div class=\"smalltext\">Hrs</div>\n        </div>\n        <div>\n            <span class=\"minutes\"></span>\n            <div class=\"smalltext\">Mins</div>\n        </div>\n        <div>\n            <span class=\"seconds\"></span>\n            <div class=\"smalltext\">Secs</div>\n        </div>\n    </div>\n</div>\n<div class=\"mysteryBoxMessage align-center\">Remaining For your Next Spin</div>\n\n{{#showMysteryBoxHistoryButton}}\n<div class=\"mysteryBoxHistory align-center\">My History</div>\n{{/showMysteryBoxHistoryButton}}\n"

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<div class=\"mysteryBoxMessage align-center\">You will be able to unlock the mystery box only after {{streakToUnlock}} days of streak</div>\n"

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<div id=\"spin\" class=\"spin\">SPIN</div>\n<div id=\"result\" class=\"result\"></div>\n<div class=\"mysteryBoxMessageSpin\">Spin the wheel to unlock the surprise. Only one Ninja per day wins the grand prize.</div>\n<div class=\"wheel-wrapper\">\n  <div class=\"needle\"></div>\n  <div id=\"wheel\" class=\"wheel\">\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"8\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"7\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"6\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"5\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"4\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"3\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"2\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n    <div class=\"cutter\">\n      <div class=\"slicer\">\n        <div class=\"part\" data-slice=\"1\" data-reward=\"\"><div class=\"mBoxRewardIcon\"></div></div>\n      </div>\n    </div>\n  </div>\n</div>\n\n{{#previousWinner}}\n  <div class=\"previousWinnerRow align-center\">\n    <p class=\"previousWinnerHeading\">Yesterday's Grand Prize Winner</p>\n    <div class=\"winnerWrapper\">\n      <div class=\"winnerIcon\"></div>\n      <div class=\"winnerName\">{{previousWinner.name}}</div>  \n    </div>\n  </div>\n{{/previousWinner}}\n\n{{#showMysteryBoxHistoryButton}}\n<div class=\"mysteryBoxHistory  align-center\">My History</div>\n{{/showMysteryBoxHistoryButton}}"

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div class=\"mysteryBoxHistoryContainer\">\n    {{#mysteryBoxHistory}}\n    <li class=\"bumperRow\" data-rid=\"{{id}}\" data-url=\"{{url}}\" data-state=\"{{state}}\" data-rewardtype=\"{{type}}\">\n        <div class=\"bumperRowIcon\"></div>\n        <div class=\"bumperRowDetails\">\n            <p class=\"bumperRowHeading\">{{title}}</p>\n            <p class=\"bumperRowSubHeading\">{{stitle}}</p>\n        </div>\n    </li>\n    {{/mysteryBoxHistory}}\n</div>"

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "<!-- Ninja Container and Background -->\n<div class=\"ninjaHomeWrapper\">\n    <div id=\"animate-area\" class=\"topIllustration animate-area\"></div>\n    <div class=\"bottomIllustration\"></div>\n    <!-- Ninja Profile Home Page -->\n    <div class=\"ninjaProfileContainer align-center\">\n        <!-- Ninja Profile -->\n        <div class=\"ninjaProfileWrapper\">\n            <div class=\"ninjaPhotoContainer\">\n                <div class=\"ninjaStreak\">\n                    <div class=\"ninjaStreakIcon\"></div>\n                    <div class=\"ninjaStreakValue\">{{ninjaProfileData.streak}}</div>\n                </div>\n                <div id=\"ninjaIcon\" class=\"ninjaProfileIcon\"></div>\n                <div class=\"ninjaBattery\">\n                    <div class=\"ninjaBatteryIcon\"></div>\n                    <div class=\"ninjaBatteryValue\">{{ninjaProfileData.battery}}</div>\n                </div>\n            </div>\n            <div class=\"ninjaName\">{{ninjaProfileData.name}}</div>\n        </div>\n    </div>\n    <div id=\"content\" class=\"container\">\n        <div class=\"view list-view\">\n            <div class=\"commonDv\">\n                <div class=\"containerTabs\">\n                    <div class=\"comp__tabs clearfix\">\n                        <a class=\"comp__tab\" data-id=\"rewards\">\n                            <div class=\"tabIconRewards\"></div>REWARDS</a>\n                        <a class=\"comp__tab\" data-id=\"activity\">\n                            <div class=\"tabIconStats\"></div>STATS</a>\n                        <a class=\"comp__tab \" data-id=\"gifts\">\n                            <div class=\"tabIconLuckyBox\"></div>LUCKY BOX</a>\n                    </div>\n                    <div class=\"comp__data\">\n                        <div id=\"sliderTabs\" class=\"swipe\">\n                            <div class=\"swipe-wrap\">\n                                <div class=\"tab-data videos_data tab-rewards\" data-id=\"rewards\">\n                                    <div class=\"rewardsContainer\">\n                                        {{#ninjaRewardsCollection}}\n                                        <li class=\"rewardRow\" data-rewardId=\"{{id}}\" data-state=\"{{state}}\" data-rewardtype=\"{{type}}\">\n                                            <div class=\"rewardIcon\"></div>\n                                            <div class=\"rewardDetails\">\n                                                <p class=\"rewardHeading    {{^state}}{{#lockedGreyout}}rewardHeadingLocked{{/lockedGreyout}}{{/state}}\">{{title}}</p>\n                                                <p class=\"rewardSubheading {{^state}}{{#lockedGreyout}}rewardSubheadingLocked{{/lockedGreyout}}{{/state}}\">{{stitle}}</p>\n                                            </div>\n                                            {{#streak}}\n                                            <div class=\"rewardStreakWrapper\">\n                                                <div class=\"rewardStreakIcon\"></div>\n                                                <div class=\"rewardStreakValue\">{{streak}}</div>\n                                            </div>\n                                            {{/streak}}\n                                        </li>\n                                        {{/ninjaRewardsCollection}}\n                                    </div>\n                                </div>\n                                <div class=\"news_data tab-data tab-activity\" data-id=\"activity\">\n                                    <div class=\"activityContainer\">\n                                        <!-- <div class=\"settingsWrapper clearfix\">\n                                            <div class=\"statTimePeriod selectedTime\">\n                                                <div class=\"optionOne selectedTime\">Lifetime</div>\n                                            </div>\n                                            <div class=\"statTimePeriod twoSideMargin\">\n                                                <div class=\"optionTwo \">Last month</div>\n                                            </div>\n                                            <div class=\"statTimePeriod\">\n                                                <div class=\"optionThree\">Last week</div>\n                                            </div>\n                                        </div>\n                                        <hr noshade class=\"seperator\">\n                                        <div class=\"leaderboardWrapper\">\n                                            <div class=\"leaderboardHeading\">Top Ninjas</div>\n                                            <div class=\"topNinjas\">\n                                         -->\n                                        <!-- Add the left right scrollable list here -->\n                                        <!-- <ul class=\"topList\">\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Hemank</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Deepak</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Pathik</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Srikant</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Patley</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Jagpreet</div>\n                                                    </li>\n                                                    <li class=\"listRow\">\n                                                        <div class=\"userIcon\"></div>\n                                                        <div class=\"userName\">Hemank</div>\n                                                    </li>\n                                                </ul>\n                                            </div>\n                                        </div>\n                                        <hr noshade class=\"seperator\"> -->\n                                        <div class=\"statsWrapper\">\n                                            {{#ninjaActivityData}}\n                                            <div class=\"statTypeContainer\">\n                                                <div class=\"statHeading\">Messaging</div>\n                                                <div class=\"statBoxWrapper statBoxFloatLeft\">\n                                                    <div class=\"statValue messagesR\">{{ninjaActivityData.messages.rec}}</div>\n                                                    <div class=\"statText\">Messages Received</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatRight\">\n                                                    <div class=\"statValue messagesS\">{{ninjaActivityData.messages.sent}}</div>\n                                                    <div class=\"statText\">Messages Sent</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatLeft\">\n                                                    <div class=\"statValue stickersR\">{{ninjaActivityData.stickers.rec}}</div>\n                                                    <div class=\"statText\">Stickers Received</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatRight\">\n                                                    <div class=\"statValue stickersS\">{{ninjaActivityData.stickers.sent}}</div>\n                                                    <div class=\"statText\">Stickers Sent</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatLeft\">\n                                                    <div class=\"statValue chatThemesR\">{{ninjaActivityData.chatThemes.rec}}</div>\n                                                    <div class=\"statText\">Chat Themes Received</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatRight\">\n                                                    <div class=\"statValue chatThemesS\">{{ninjaActivityData.chatThemes.sent}}</div>\n                                                    <div class=\"statText\">Chat Themes Sent</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatLeft\">\n                                                    <div class=\"statValue filesR\">{{ninjaActivityData.files.rec}}</div>\n                                                    <div class=\"statText\">Files Received</div>\n                                                </div>\n                                                <div class=\"statBoxWrapper statBoxFloatRight\">\n                                                    <div class=\"statValue filesS\">{{ninjaActivityData.files.sent}}</div>\n                                                    <div class=\"statText\">Files Sent</div>\n                                                </div>\n                                            </div>\n                                            <div class=\"statTypeContainer\">\n                                                <div class=\"statHeading\">Timeline</div>\n                                                <div class=\"statBoxWrapper statBoxFloatLeft\">\n                                                    <div class=\"statValue statusUpdateCount\">{{ninjaActivityData.statusUpdates.count}}</div>\n                                                    <div class=\"statText\">Status Updates Posted</div>\n                                                </div>\n                                            </div>\n                                            {{/ninjaActivityData}}\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"fixtures_data tab-data tab-mysterybox\" data-id=\"gifts\">\n                                    <div class=\"mysteryBoxContainer\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"view details-view\">\n        </div>\n    </div>\n</div>"

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),

	        ExclusiveFeatureController = function(options) {
	            this.template = __webpack_require__(26);
	        };

	    ExclusiveFeatureController.prototype.bind = function(App, data) {

	        var ftue = this;

	        var headerIcon = document.getElementsByClassName('featureImage')[0];
	        var featureEnableButton = document.getElementsByClassName('featureEnableButton')[0];
	        var featureRetryButton = document.getElementsByClassName('featureRetryButton')[0];
	        var featureProgress = document.getElementsByClassName('featureProgress')[0];
	        var progressBar = document.getElementsByClassName('progressBar')[0];

	        if (data.rewardDetails.hicon) {
	            headerIcon.style.backgroundImage = 'url(\'' + data.rewardDetails.hicon + '\')';
	        } else {
	            console.log("Set a default header Icon");
	        }

	        if(data.rewardDetails.sanctioned){
	            console.log("Reward has been redeemed");
	            featureEnableButton.classList.add('hideClass');
	            featureRetryButton.classList.remove('hideClass');
	        }else{
	            console.log("Reward has not been redeemed");
	        }

	        // Check the reward status here and set button enable or retry once redeemed or unlocked

	        // FAQ URL CLICK EVENT
	        featureEnableButton.addEventListener('click', function(ev) {
	            console.log("Enabling The Exclusive Feature For You");

	            var dataToSend = {};
	            dataToSend.rid = data.rewardId;
	            dataToSend.enable  = true;

	            // Reward Details API :: Send Reward Id As well
	            App.NinjaService.getExclusiveFeature(dataToSend, function(res) {

	                // Show Toast if Success
	                console.log(res);
	                utils.showToast('The feature will be enabled shortly.');

	                featureRetryButton.classList.remove('hideClass');
	                featureEnableButton.classList.add('hideClass');

	                // Routing to the specific Router
	                //App.router.navigateTo(rewardRouter, res.data);
	            }, this);
	        });

	        featureRetryButton.addEventListener('click', function(ev) {
	            console.log("Enabling The Exclusive Feature For You");

	            var dataToSend = {};
	            dataToSend.rid = data.rewardId;
	            dataToSend.enable  = true;

	            // Reward Details API :: Send Reward Id As well
	            App.NinjaService.getExclusiveFeature(dataToSend, function(res) {

	                // Show Toast if Success
	                console.log(res);
	                utils.showToast('We have sent you the feature once again!');

	            }, this);
	        });



	    };
	    ExclusiveFeatureController.prototype.render = function(ctr, App, data) {

	        console.log(data);

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'exclusiveFeatureContainer animation_fadein noselect';

	        that.el.innerHTML = Mustache.render(that.template, {
	            featureText: data.rewardDetails.desc
	        });

	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    ExclusiveFeatureController.prototype.destroy = function() {

	    };

	    module.exports = ExclusiveFeatureController;

	})(window, platformSdk, platformSdk.events);


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "<div id=\"animate-area\" class=\"topIllustration animate-area\"></div>\n<div class=\"bottomIllustration\"></div>\n<div class=\"exclusiveFeatureWrapper align-center\">\n\t<div class=\"featureImage\"></div>\n\t<div class=\"featureText\">{{featureText}}</div>\n\t<div class=\"featureCta\">\n\t\t<div class=\"featureEnableButton\">Enable</div>\n\t\t<div class=\"featureProgress hideClass\">\n\t\t\t<div class=\"meter\">\n  \t\t\t\t<span class=\"progressBar\" style=\"width: 0%\"></span>\n\t\t\t</div>\n\t\t\t<div class=\"progressText\">Enabling ...</div>\n\t\t</div>\n\t\t<div class=\"featureRetryButton hideClass\">Retry</div>\n\t\t<div class=\"featureDisableButton hideClass\">Disable</div>\n\t</div>\n\t<div class=\"faqButtton\">FAQs</div>\n</div>"

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),

	        StickerRewardController = function(options) {
	            this.template = __webpack_require__(28);
	        };

	    StickerRewardController.prototype.bind = function(App, data) {

	        var that = this;

	        console.log(data);

	        if (data.rewardDetails.cooldown) {
	            var stickerRewardList = document.getElementsByClassName('stickerRewardList')[0];

	            console.log("Removing THE",stickerRewardList);
	            stickerRewardList.innerHTML = '';

	            that.template = __webpack_require__(29);
	            stickerRewardList.innerHTML = Mustache.render(this.template, {});

	            console.log("DATAAA IS", data.rewardDetails);

	            that.defineCooldown(App,data.rewardDetails.cooldown,data.rewardId,data.rewardRouter);
	       
	        }

	        // Sticker packs data here
	        var stickerPacks = data.rewardDetails.packs;
	        var stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
	        var stickerRewardHeaderImage = document.getElementsByClassName('stickerRewardHeaderImage')[0];
	        stickerRewardHeaderImage.style.backgroundImage = 'url(\'' + data.rewardDetails.hicon + '\')';

	        that.assignStickerCatImages(stickerPacks, stickerDownloadRow);

	        for (var i = 0; i < stickerDownloadRow.length; i++) {
	            stickerDownloadRow[i].addEventListener('click', function(ev) {

	                var stickerState = this.getAttribute('data-status');
	                var catId = this.getAttribute('data-catId');
	                var rewardId = this.getAttribute('data-rewardid');
	                var stickerDetails = that.getStickerDetails(catId, stickerPacks);

	                App.router.navigateTo('/stickerPackView', { "stickerDetails": stickerDetails, "rewardId": rewardId, "rewardRouter": data.rewardRouter });                

	                // if (stickerState == '1') {
	                //     utils.showToast('You have already downloaded this sticker pack');
	                // } else {
	                //     console.log('Fetching sticker pack');
	                //     // Going to Sticker Pack View
	                //     App.router.navigateTo('/stickerPackView', { "stickerDetails": stickerDetails, "rewardId": rewardId, "rewardRouter": data.rewardRouter });
	                // }
	            });
	        }

	    };

	    StickerRewardController.prototype.getStickerDetails = function(catId, stickerPacks) {


	        for (var i = 0; i < stickerPacks.length; i++) {
	            if (catId == stickerPacks[i].catId) {
	                return stickerPacks[i];
	            } else {
	                console.log("Sticker Pack not found");
	            }
	        }

	    };


	    StickerRewardController.prototype.assignStickerCatImages = function(packs, rows) {

	        var stickerCatUrl = 'http://54.169.82.65:5016/v1/stickerpack/';

	        for (var i = 0; i < rows.length; i++) {
	            var icon = rows[i].getElementsByClassName('stickerPackIcon')[0];
	            console.log(icon);
	            icon.style.backgroundImage = 'url(\'' + stickerCatUrl + packs[i].catId + '/preview' + '\')';

	        }

	    };

	    StickerRewardController.prototype.defineCooldown = function(App, timeleft,rId, rewardRouter) {

	            function getTimeRemaining(timeRemaining) {
	                var t = timeRemaining;
	                var seconds = Math.floor((t / 1000) % 60);
	                var minutes = Math.floor((t / 1000 / 60) % 60);
	                var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	                var days = Math.floor(t / (1000 * 60 * 60 * 24));
	                return {
	                    'total': t,
	                    'days': days,
	                    'hours': hours,
	                    'minutes': minutes,
	                    'seconds': seconds
	                };
	            }

	            function initializeClock(id, timeRemaining) {
	                var clock = document.getElementById(id);
	                var daysSpan = clock.querySelector('.days');
	                var hoursSpan = clock.querySelector('.hours');
	                var minutesSpan = clock.querySelector('.minutes');
	                var secondsSpan = clock.querySelector('.seconds');

	                function updateClock() {
	                    var t = getTimeRemaining(timeRemaining);

	                    daysSpan.innerHTML = t.days;
	                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
	                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
	                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

	                    if (t.total <= 0) {
	                        clearInterval(timeinterval);
	                        console.log("Getting available rewards");

	                        var dataSend = {};
	                        dataSend.rewardId = rId;

	                        App.NinjaService.getRewardDetails(dataSend, function(res) {
	                            console.log(res.data);
	                             App.router.navigateTo(rewardRouter,{ "rewardDetails": res.data , "rewardId" :rId, "rewardRouter":rewardRouter} );
	                        });
	                    }
	                    timeRemaining = timeRemaining - 1000;
	                }

	                updateClock();
	                var timeinterval = setInterval(updateClock, 1000);
	            }

	            // var d = new Date(timeleft*1000); // The 0 there is the key, which sets the date to the epoch

	            // var deadline = d;
	            initializeClock('clockdiv', timeleft * 1000);

	    };



	    StickerRewardController.prototype.render = function(ctr, App, data) {

	        console.log("COOLDOWN is", data);

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'stickerRewardContainer ftueController animation_fadein noselect';

	        that.template = __webpack_require__(28);

	        that.el.innerHTML = Mustache.render(that.template, {
	            stickerPacks: data.rewardDetails.packs,
	            title: data.rewardDetails.title,
	            stitle: data.rewardDetails.desc,
	            rewardId: data.rewardId
	        });

	        //data = data.rewardDetails;

	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    StickerRewardController.prototype.destroy = function() {

	    };

	    module.exports = StickerRewardController;

	})(window, platformSdk, platformSdk.events);


/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<div id=\"animate-area\" class=\"topIllustration animate-area\"></div>\n<div class=\"bottomIllustration\"></div>\n<div class=\"stickerRewardsWrapper\">\n    <div class=\"stickerShopPageOne\">\n        <div class=\"stickerRewardHeader\">\n            <div class=\"stickerRewardHeaderImage\"></div>\n            <div class=\"stickerRewardHeadingContainer\">\n                <p class=\"stickerRewardHead\">{{title}}</p>\n                <p class=\"stickerRewardSub\">{{stitle}}</p>\n            </div>\n        </div>\n        <!-- Only If applicable -->\n        <div class=\"stickerRewardLevels\"></div>\n        \n        <div class=\"stickerRewardList\">\n            <div class=\"stickerDownloadList\">\n                <ul>\n                    {{#stickerPacks}}\n                    <li class=\"stickerDownloadRow\" data-status=\"{{downloaded}}\" data-catId=\"{{catId}}\" data-rewardid=\"{{rewardId}}\">\n                        <div class=\"stickerPackIcon\"></div>\n                        <!-- <div class=\"stickerPackIcon\"></div> -->\n                        <div class=\"stickerPackText\">\n                            <p class=\"stickerPackName\">{{name}}</p>\n                            <p class=\"stickerPackCount\">{{nos}} Stickers</p>\n                        </div>\n                        <div class=\"stickerPackStatenotdownloaded\"></div>\n                        <!-- {{#downloaded}}\n                            <div class=\"stickerPackStatedownloaded\"></div>\n                        {{/downloaded}}\n                        {{^downloaded}}\n                            <div class=\"stickerPackStatenotdownloaded\"></div>\n                        {{/downloaded}} -->\n                    </li>\n                    {{/stickerPacks}}\n                </ul>\n            </div>\n        </div>\n        <!-- <div class=\"stickerListEmptyState\">\n        </div>\n        <div class=\"stickerPackBlocked\">\n            <div class=\"stickerBlockedIllustration\"></div>\n            <div class=\"stickerBlockedText\"></div>\n        </div> -->\n    </div>\n    <!-- <div class=\"stickerDownloadPage\">\n        <div class=\"stickerCategoryIcon\"></div>\n        <div class=\"stickerIconPreview\">\n            <ul class=\"stickerPreviewList\">\n                <li class=\"stickerPreviewIcon\"></li>\n            </ul>\n        </div>\n        <div class=\"stickerDownloadButton\">Download</div>\n    </div> -->\n</div>"

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<div class=\"stickerCooldownContainer\">\n    <div class=\"stickerRewardCooldown\">\n        <div id=\"clockdiv\">\n            <div>\n                <span class=\"days\"></span>\n                <div class=\"smalltext\">Days</div>\n            </div>\n            <div>\n                <span class=\"hours\"></span>\n                <div class=\"smalltext\">Hrs</div>\n            </div>\n            <div>\n                <span class=\"minutes\"></span>\n                <div class=\"smalltext\">Mins</div>\n            </div>\n            <div>\n                <span class=\"seconds\"></span>\n                <div class=\"smalltext\">Secs</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"stickerCooldownMessage\">Only one sticker pack can be redeemed within X hours, Please try again later.</div>\n</div>\n"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	(function( W, platformSdk, events ) {
	    'use strict';

	    var utils = __webpack_require__( 4 ),
	        Constants = __webpack_require__( 5 ),
	        customImageUploaded = false,
	        uploadCustomStickerData = {},
	        sessionId = null,

	        CustomStickerController = function( options ) {
	            this.template = __webpack_require__( 31 );
	        };

	    CustomStickerController.prototype.bind = function( App, data ) {

	        var that = this;
	        var rewardId = data.rewardId;
	        
	        customImageUploaded = false;
	        uploadCustomStickerData = {};

	        // All Custom Sticker Views Defined

	        // Main views
	        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
	        var customStickerFtueWrapper = document.getElementsByClassName( 'customStickerFtueWrapper' )[0];

	        // Subsequent Views
	        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
	        var customStickerStatusCheck = document.getElementsByClassName( 'customStickerStatusCheck' )[0];
	        var customStickerReadyState = document.getElementsByClassName( 'customStickerReadyState' )[0];
	        var customStickerRow = document.getElementsByClassName( 'customStickerRow' );

	        var customStickerImage = document.getElementsByClassName( 'uploadPhotoContainer' )[0];

	        //var profilePicLoader = document.getElementById('profilePicLoader');
	        var errorMessage = document.getElementsByClassName( 'errorMessage' )[0];
	        var customStickerTextPhrase = document.getElementById( 'customStickerTextPhrase' );
	        var failCustomStickerTextPhrase = document.getElementById( 'failCustomStickerTextPhrase' );

	        //var textLanguage = document.getElementById('textLanguage');
	        var sendButton = document.getElementsByClassName( 'sendButton' )[0];
	        var sendStickerAgainButton = document.getElementsByClassName( 'sendStickerAgainButton' )[0];

	        // All Custom Sticker Actions

	        var uploadPhoto = document.getElementsByClassName( 'uploadPhotoContainer' )[0];
	        var customStickerButton = document.getElementsByClassName( 'customStickerButton' )[0];
	        var customStickerFaq = document.getElementsByClassName( 'customStickerFaq' )[0];
	        var customStickerShareAction = document.getElementsByClassName( 'customStickerShareAction' )[0];
	        var customStickerHistory = document.getElementsByClassName( 'customStickerHistory' )[0];

	        var showHistoryButton = document.getElementsByClassName( 'showHistoryButton' )[0];
	        var uploadParent = document.getElementsByClassName( 'uploadParent' )[0];

	        if ( data.rewardDetails.custom_stickers ) {

	            that.defineCustomStickerHistory( data.rewardDetails.custom_stickers );
	            if ( data.rewardDetails.custom_stickers.length > 0 ) {
	                console.log( 'The user is not new to custom Sticker' );
	                utils.removeClass( customStickerUploadScreen, 'hideClass' );
	            } else {
	                console.log( 'First Time user' );
	                utils.removeClass( customStickerFtueWrapper, 'hideClass' );
	            }
	        }

	        // Event Definations

	        // FAQ URL CLICK EVENT
	        customStickerFaq.addEventListener( 'click', function( ev ) {
	            utils.openWebView( data.rewardDetails.faqUrl );
	        });

	        if ( showHistoryButton ) {
	            showHistoryButton.addEventListener( 'click', function( ev ) {

	                // Hide Upload and Show The History
	                utils.removeClass( customStickerHistory, 'hideClass' );
	                if ( uploadParent ) {
	                    utils.addClass( uploadParent, 'hideClass' );
	                } else {
	                    utils.addClass( showHistoryButton, 'hideClass' );
	                }
	            });
	        }

	        // Show Upload Screen After the First Time
	        customStickerButton.addEventListener( 'click', function( ev ) {
	            utils.addClass( customStickerFtueWrapper, 'hideClass' );
	            utils.removeClass( customStickerUploadScreen, 'hideClass' );
	        });

	        // Choose Sticker Image From gallery
	        if ( customStickerImage ) {
	            customStickerImage.addEventListener( 'click', function( ev ) {

	                // utils.removeClass(errorMessage, 'hideClass');
	                that.chooseStickerImageFromGallery( data );
	            });
	        }

	        // Send the Data to Server
	        if ( sendButton ) {
	            sendButton.addEventListener( 'click', function( ev ) {
	                that.sendCustomStickerDataToServer( rewardId );
	            });
	        }

	        if ( sendStickerAgainButton ) {
	            sendStickerAgainButton.addEventListener( 'click', function( ev ) {
	                that.resendCustomStickerDataToServer( rewardId );
	            });
	        }

	        customStickerShareAction.addEventListener( 'click', function( ev ) {
	            var customStickerId = this.getAttribute( 'data-sid' );
	            that.sendCustomStickerToUser( App, rewardId, customStickerId );
	        });

	        if ( data.rewardDetails.custom_stickers ) {
	            that.defineCustomStickerClick( customStickerRow, data.rewardDetails.custom_stickers );

	        }

	    };

	    CustomStickerController.prototype.sendCustomStickerToUser = function( App, rewardId, customStickerId ) {

	        console.log( 'Sending the custom sticker to the user via packet' );

	        console.log( rewardId );
	        console.log( customStickerId );

	        var data = {};
	        data.rewardId = rewardId;
	        data.customStickerId = customStickerId;

	        // Reward Details API :: Send Reward Id As well
	        App.NinjaService.sendCustomSticker( data, function( res ) {

	            // Show Toast if Success
	            console.log( res );
	            utils.showToast( 'You will receive your sticker via the team hike bot shortly, start sharing.' );

	            // Routing to the specific Router
	            //App.router.navigateTo(rewardRouter, res.data);
	        }, this );

	    };

	    CustomStickerController.prototype.defineCustomStickerClick = function( customStickerRow, data ) {

	        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
	        var customStickerFtueWrapper = document.getElementsByClassName( 'customStickerFtueWrapper' )[0];
	        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

	        // Subsequent Views
	        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
	        var customStickerStatusCheck = document.getElementsByClassName( 'customStickerStatusCheck' )[0];
	        var customStickerReadyState = document.getElementsByClassName( 'customStickerReadyState' )[0];
	        var customStickerView = document.getElementsByClassName( 'customStickerView' )[0];
	        var customStickerHistory = document.getElementsByClassName( 'customStickerHistory' )[0];

	        var failReason = document.getElementsByClassName( 'failReason' )[0];

	        for ( var i = 0; i < customStickerRow.length; i++ ) {
	            customStickerRow[i].addEventListener( 'click', function( event ) {

	                var state = this.getAttribute( 'data-status' );
	                var sid = this.getAttribute( 'data-id' );
	                var url = this.getAttribute( 'data-url' );

	                if ( state == 'redeemed' ) {
	                    console.log( 'Take To Success Page :: Send Image and ID There Reference' );
	                    utils.removeClass( customStickerReadyState, 'hideClass' );
	                    utils.addClass( customStickerUploadScreen, 'hideClass' );
	                    utils.addClass( customStickerSent, 'hideClass' );
	                    utils.addClass( customStickerFtueWrapper, 'hideClass' );
	                    utils.addClass( customStickerHistory, 'hideClass' );

	                    // Set Id Attribute For Reference Later
	                    var customStickerShareAction = document.getElementsByClassName( 'customStickerShareAction' )[0];
	                    var att = document.createAttribute( 'data-sid' );
	                    att.value = sid;
	                    customStickerShareAction.setAttributeNode( att );

	                    // Set Background Image Of Sticker Being Set
	                    customStickerView.style.backgroundImage = 'url(\'' + url + '\')';

	                } else if ( state == 'inprogress' ) {
	                    console.log( 'Take to status Check Page :: Send ID' );
	                    utils.removeClass( customStickerStatusCheck, 'hideClass' );
	                    utils.addClass( customStickerUploadScreen, 'hideClass' );
	                    utils.addClass( customStickerSent, 'hideClass' );
	                    utils.addClass( customStickerFtueWrapper, 'hideClass' );
	                    utils.addClass( customStickerHistory, 'hideClass' );
	                } else if ( state == 'failed' ) {

	                    if ( sessionId ) {
	                        sessionId = null;
	                    }

	                    utils.addClass( customStickerHistory, 'hideClass' );
	                    var sId = this.getAttribute( 'data-id' );
	                    var reasonFail = this.getAttribute( 'data-reason' );
	                    sessionId = sId;
	                    failReason.innerHTML = reasonFail;
	                    console.log( 'Session Id is ', sessionId );
	                    utils.removeClass( customStickerFailScreen, 'hideClass' );
	                } else {
	                    utils.showToast( 'some error occured please try again later' );
	                }
	            });
	        }

	    };

	    // Reset To Default Sticker Image If Some Error Occurs While Selecting the Image :: Or uploading It
	    CustomStickerController.prototype.setDefaultCustomStickerImage = function() {

	        var uploadPhotoContainer = document.getElementsByClassName( 'uploadPhotoContainer' )[0];
	        var uploadPhoto = document.getElementsByClassName( 'uploadPhoto' )[0];

	        console.log( 'Setting the default custom sticker image' );
	        uploadPhotoContainer.style.backgroundImage = 'none';
	        uploadPhoto.style.display = 'block';
	    };

	    // Show Error State
	    CustomStickerController.prototype.showErrorState = function( text ) {
	        var errorMessage = document.getElementsByClassName( 'errorMessage' )[0];

	        errorMessage.innerHTML = text;
	        utils.removeClass( errorMessage, 'hideClass' );
	    };

	    // Check Full Form Before Sending Custom Sticker Data
	    CustomStickerController.prototype.customStickerFormCheck = function() {

	        console.log( customStickerTextPhrase.value );
	        console.log( customImageUploaded );

	        var sendForm = true;

	        if ( ! customImageUploaded ) {
	            this.showErrorState( 'Please fill all the details' );
	            sendForm = false;
	        }

	        if( customStickerTextPhrase.value === ""){
	            this.showErrorState( 'Please fill all the details' );
	            sendForm = false;   
	        }

	        return sendForm;

	    };

	    CustomStickerController.prototype.customStickerReFormCheck = function() {

	        console.log( failCustomStickerTextPhrase.value );
	        console.log( customImageUploaded );

	        var sendForm = true;

	        if ( ! customImageUploaded || ! failCustomStickerTextPhrase ) {
	            this.showErrorState( 'Please fill all the details' );
	            sendForm = false;
	        }

	        return sendForm;

	    };

	    CustomStickerController.prototype.chooseStickerImageFromGallery = function( data ) {

	        var that = this;

	        // Image Container
	        var customStickerImage = document.getElementsByClassName( 'uploadPhotoContainer' )[0];

	        try {
	            platformSdk.nativeReq({
	                ctx: self,
	                fn: 'chooseFile',
	                success: function( fileUrl ) {

	                    fileUrl = decodeURIComponent( fileUrl );
	                    fileUrl = JSON.parse( fileUrl );

	                    if ( ! fileUrl.filesize || fileUrl.filesize === 0 ) {

	                        utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                        customImageUploaded = false;
	                        that.setDefaultCustomStickerImage();
	                        return;
	                    }

	                    // Check Max Upload Size :: To Be Decided
	                    if ( fileUrl.filesize > 10000000 ) {
	                        utils.showToast( 'Max file upload size is 10 Mb' );
	                        customImageUploaded = false;
	                        that.setDefaultCustomStickerImage();
	                        return;
	                    }

	                    uploadCustomStickerData.filePath = fileUrl.filePath;

	                    // Show Profile Picture In the Round Tab
	                    // Hide the camera Icon
	                    var cameraIcon = document.getElementsByClassName( 'uploadPhoto' )[0];
	                    cameraIcon.style.display = 'none';

	                    // Set the image from gallery as the container image
	                    customStickerImage.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
	                    console.log("setting hemank to true");
	                    customImageUploaded = true;
	                }
	            });

	        } catch ( err ) {
	            events.publish( 'update.loader', { show: false });
	            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	            that.setDefaultCustomStickerImage();
	            customImageUploaded = false;
	        }
	    };

	    // Send Custom sticker Data To Server
	    CustomStickerController.prototype.resendCustomStickerDataToServer = function( rid ) {

	        var that = this;
	        var serverPath;

	        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
	        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
	        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

	        var formSend = that.customStickerReFormCheck();

	        if ( formSend ) {

	            events.publish( 'update.loader', { show: true });

	            console.log( 'All data is correct and can be sent to the user' );

	            // Remove any error message class if any
	            //utils.removeClass(errorMessage, 'hideClass');

	            var data = {};
	            data.rid = rid;
	            data.text_phrase = failCustomStickerTextPhrase.value;
	            serverPath = 'http://54.169.82.65:5016/v1/rewards/' + data.rid + '?sid=' + sessionId + '&t=' + data.text_phrase;

	            // Add the server path here
	            uploadCustomStickerData.uploadUrl = serverPath;
	            uploadCustomStickerData.doCompress = true;

	            try {
	                platformSdk.nativeReq({
	                    ctx: self,
	                    fn: 'uploadFile',
	                    data: platformSdk.utils.validateStringifyJson( uploadCustomStickerData ),
	                    success: function( res ) {
	                        try {
	                            res = JSON.parse( decodeURIComponent( res ) );
	                            console.log( res );

	                            if ( res.stat == 'ok' ) {

	                                //utils.showToast('Your Image has been updated.');
	                                sessionId = res.data.sid;

	                                // Show Sent Screen Here As below
	                                utils.addClass( customStickerUploadScreen, 'hideClass' );
	                                utils.addClass( customStickerFailScreen, 'hideClass' );
	                                utils.removeClass( customStickerSent, 'hideClass' );
	                                events.publish( 'update.loader', { show: false });
	                                customImageUploaded = false;
	                        

	                            } else if(res.stat == 'fail'){
	                                events.publish( 'update.loader', { show: false });
	                                utils.showToast( res.data.reason );
	                                that.setDefaultCustomStickerImage();
	                                customImageUploaded = false;
	                        
	                            } else {
	                                events.publish( 'update.loader', { show: false });
	                                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                                that.setDefaultCustomStickerImage();
	                                customImageUploaded = false;
	                        
	                            }
	                        } catch ( err ) {
	                            events.publish( 'update.loader', { show: false });
	                            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                            that.setDefaultCustomStickerImage();
	                            customImageUploaded = false;
	                        
	                        }

	                        //Hide loader
	                        //profilePicLoader.classList.remove('picLoader');
	                    }
	                });

	            } catch ( err ) {
	                events.publish( 'update.loader', { show: false });
	                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                            
	                //profilePicLoader.classList.remove('picLoader');
	                that.setDefaultCustomStickerImage();
	            }
	        } else {
	            utils.showToast( 'Some information seems to be incorrect. Please check!' );

	        }
	    };

	    // Send Custom sticker Data To Server
	    CustomStickerController.prototype.sendCustomStickerDataToServer = function( rid ) {

	        var that = this;
	        var serverPath;

	        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
	        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
	        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

	        var formSend = that.customStickerFormCheck();

	        if ( formSend ) {

	            events.publish( 'update.loader', { show: true });

	            var data = {};
	            data.rid = rid;
	            data.text_phrase = customStickerTextPhrase.value;
	            serverPath = 'http://54.169.82.65:5016/v1/rewards/' + data.rid + '?t=' + data.text_phrase;

	            // Add the server path here
	            uploadCustomStickerData.uploadUrl = serverPath;
	            uploadCustomStickerData.doCompress = true;

	            try {
	                platformSdk.nativeReq({
	                    ctx: self,
	                    fn: 'uploadFile',
	                    data: platformSdk.utils.validateStringifyJson( uploadCustomStickerData ),
	                    success: function( res ) {
	                        try {
	                            res = JSON.parse( decodeURIComponent( res ) );
	                            console.log( res );

	                            if ( res.stat == 'ok' ) {

	                                //utils.showToast('Your Image has been updated.');
	                                sessionId = res.data.sid;

	                                // Show Sent Screen Here As below
	                                utils.addClass( customStickerUploadScreen, 'hideClass' );
	                                utils.addClass( customStickerFailScreen, 'hideClass' );
	                                utils.removeClass( customStickerSent, 'hideClass' );
	                                events.publish( 'update.loader', { show: false });
	                                customImageUploaded = false;

	                            } else if(res.stat == 'fail'){
	                                events.publish( 'update.loader', { show: false });
	                                utils.showToast( res.data.reason );
	                                that.setDefaultCustomStickerImage();
	                                customImageUploaded = false;
	                        
	                            } else {
	                                events.publish( 'update.loader', { show: false });
	                                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                                that.setDefaultCustomStickerImage();
	                                customImageUploaded = false;
	                        
	                            }
	                        } catch ( err ) {
	                            events.publish( 'update.loader', { show: false });
	                            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
	                            that.setDefaultCustomStickerImage();
	                            customImageUploaded = false;
	                        
	                        }

	                        //Hide loader
	                        //profilePicLoader.classList.remove('picLoader');
	                    }
	                });

	            } catch ( err ) {
	                events.publish( 'update.loader', { show: false });
	                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );            
	                //profilePicLoader.classList.remove('picLoader');
	                that.setDefaultCustomStickerImage();
	            }
	        } else {
	            utils.showToast( 'Some information seems to be incorrect. Please check!' );

	        }
	    };

	    CustomStickerController.prototype.defineCustomStickerHistory = function( stickers ) {

	        // All Custom Sticker History
	        var allCustomStickers = document.getElementsByClassName( 'customStickerIcon' );

	        console.log( stickers );

	        for ( var i = 0; i < stickers.length; i++ ) {
	            if ( stickers[i].url ) {
	                allCustomStickers[i].style.backgroundImage = 'url(\'' + stickers[i].url + '\')';
	            } else {
	                console.log( 'Sticker Icon is not present, please try a default icon' );
	            }
	            if ( stickers[i].ts ) {
	                var timestamp = new Date( stickers[i].ts * 1000 );
	                stickers[i].ts = timestamp.getDate() + '/' + ( timestamp.getMonth() + 1 ) + '/' + ( timestamp.getYear() + 1900 );
	            } else {
	                sticker[i].ts = 'Order date is unavailable';
	            }

	        }

	    };

	    CustomStickerController.prototype.convertTimeStamp = function( stickers ) {

	        for ( var i = 0; i < stickers.length; i++ ) {
	            if ( stickers[i].ts ) {
	                var timestamp = new Date( stickers[i].ts );
	                stickers[i].ts = timestamp.getDate() + '/' + ( timestamp.getMonth() + 1 ) + '/' + ( timestamp.getYear() + 1900 );
	            } else {
	                sticker[i].ts = 'Order date is unavailable';
	            }
	        }
	    };

	    CustomStickerController.prototype.render = function( ctr, App, data ) {

	        console.log( data );

	        var that = this;
	        that.customStickersList = [];
	        that.showCustomStickerHistoryButton = false;

	        if ( data.rewardDetails.custom_stickers ) {
	            that.customStickersList = data.rewardDetails.custom_stickers;
	            that.convertTimeStamp( data.rewardDetails.custom_stickers );
	        }

	        if ( data.rewardDetails.custom_stickers.length > 0 ) {
	            that.showCustomStickerHistoryButton = true;
	        }

	        console.log( that.customStickersList );

	        that.el = document.createElement( 'div' );
	        that.el.className = 'customStickerContainer centerToScreenContainer animation_fadein noselect';
	        that.el.innerHTML = Mustache.render( that.template, {
	            customStickersList: that.customStickersList,
	            newStickerEligibility: data.rewardDetails.eligible,
	            showCustomStickerHistoryButton: that.showCustomStickerHistoryButton
	        });
	        ctr.appendChild( that.el );
	        events.publish( 'update.loader', { show: false });
	        that.bind( App, data );
	    };

	    CustomStickerController.prototype.destroy = function() {

	    };

	    module.exports = CustomStickerController;

	})( window, platformSdk, platformSdk.events );


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "<div id=\"animate-area\" class=\"topIllustration animate-area\"></div>\n<div class=\"bottomIllustration\"></div>\n<div class=\"customStickerUploadScreen hideClass\">\n    {{#newStickerEligibility}}\n    <div class=\"uploadParent\">\n        <div class=\"uploadPhotoContainer\">\n            <div class=\"uploadPhoto\"></div>\n        </div>\n        <!-- <div id=\"profilePicLoader\"> -->\n        <div class=\"customStickerText\">\n            <!-- <select id=\"textLanguage\">\n                <option value=\"\">Select your sticker language</option>\n                <option value=\"english\">English</option>\n                <option value=\"hindi\">Hindi</option>\n                <option value=\"marathi\">Marathi</option>\n                <option value=\"malyalam\">Malyalam</option>\n            </select> -->\n        </div>\n        <input id=\"customStickerTextPhrase\" type=\"text\" placeholder=\"Type your sticker text\" id=\"stickerPhrase\" onpaste=\"return false\" required value=\"\">\n        <div class=\"errorMessage hideClass\">If any error message on this screen</div>\n        <div class=\"sendButton\">Send</div>\n        {{/newStickerEligibility}} \n\n        {{#showCustomStickerHistoryButton}}\n        <div class=\"showHistoryButton\">\n            Custom Sticker History\n        </div>\n        {{/showCustomStickerHistoryButton}}\n    \n    </div>\n    <div class=\"customStickerHistory hideClass\">\n        <ul>\n            {{#customStickersList}}\n            <li class=\"customStickerRow\" data-id=\"{{sid}}\" data-status=\"{{status}}\" data-url=\"{{url}}\" data-reason=\"{{reason}}\">\n                <div class=\"customStickerIcon\"></div>\n                <div class=\"customStickerDetails\">\n                    <p class=\"stickerPhrase\">{{phrase}}</p>\n                    <p class=\"stickerOrderDate\">Order date - {{ts}}</p>\n                </div>\n                <div class=\"statusIcon{{status}}\"></div>\n            </li>\n            {{/customStickersList}}\n        </ul>\n    </div>\n</div>\n<div class=\"customStickerWrapper centerToScreenWrapper align-center\">\n    <div class=\"customStickerFailScreen hideClass\">\n        <div class=\"failUploadParent\">\n            <p class=\"failReason\"></p>\n            <div class=\"uploadPhotoContainer\">\n                <div class=\"uploadPhoto\"></div>\n            </div>\n            <div class=\"customStickerText\">\n            </div>\n            <input id=\"failCustomStickerTextPhrase\" type=\"text\" placeholder=\"Type your sticker text\" id=\"stickerPhrase\" onpaste=\"return false\" required value=\"\">\n            <div class=\"errorMessage hideClass\">If any error message on this screen</div>\n            <div class=\"sendStickerAgainButton\">Send</div>\n        </div>\n    </div>\n    <div class=\"customStickerFtueWrapper hideClass\">\n        <div class=\"customStickerHeaderImage\"></div>\n        <div class=\"customStickerDetail\">Get your own sticker made by Hike and share it with your friends.</div>\n        <div class=\"customStickerButton\">Start</div>\n        <div class=\"customStickerFaq\">FAQs</div>\n    </div>\n    <div class=\"customStickerSent hideClass\">\n        <div class=\"successSentImage\"></div>\n        <div class=\"successSentText\">Successfully sent, you will receive this sticker within 3-4 weeks. You can come back here to check your sticker status.</div>\n        <!-- <div class=\"successSentAction\">Check Status</div> -->\n    </div>\n    <div class=\"customStickerStatusCheck hideClass\">\n        <div class=\"statusHeaderImage\"></div>\n        <div class=\"statusText\">We believe in making beautiful stickers. Your sticker will approximately take 3-4 weeks. Keep checking!</div>\n    </div>\n    <div class=\"customStickerReadyState hideClass\">\n        <div class=\"customStickerView\"></div>\n        <div class=\"customStickerShareText\">Hey Your sticker is ready and good to go, let's surprise your friends by sending it to them!</div>\n        <div class=\"customStickerShareAction\">Send</div>\n    </div>\n</div>\n</div>\n"

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	(function( W, platformSdk, events ) {
	    'use strict';

	    var utils = __webpack_require__( 4 ),
	        Constants = __webpack_require__( 5 ),

	        CrowdSourcingController = function( options ) {
	            this.template = __webpack_require__( 33 );
	        };

	    CrowdSourcingController.prototype.bind = function( App, data ) {

	        var ftue = this;      
	    };

	    CrowdSourcingController.prototype.render = function( ctr, App, data ) {

	        var that = this;
	        that.el = document.createElement( 'div' );
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render( unescape( that.template ) );
	        ctr.appendChild( that.el );
	        events.publish( 'update.loader', { show: false });
	        that.bind( App, data );
	    };

	    CrowdSourcingController.prototype.destroy = function() {

	    };

	    module.exports = CrowdSourcingController;

	})( window, platformSdk, platformSdk.events );


/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "<p> User Generated Content</p>"

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	(function( W, platformSdk, events ) {
	    'use strict';

	    var utils = __webpack_require__( 4 ),
	        Constants = __webpack_require__( 5 ),

	        FaqDetailsController = function( options ) {
	            this.template = __webpack_require__( 35 );
	        };

	    FaqDetailsController.prototype.bind = function( App, data ) {

	        var ftue = this;      
	    };

	    FaqDetailsController.prototype.render = function( ctr, App, data ) {

	        var that = this;
	        that.el = document.createElement( 'div' );
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render( unescape( that.template ) );
	        ctr.appendChild( that.el );
	        events.publish( 'update.loader', { show: false });
	        that.bind( App, data );
	    };

	    FaqDetailsController.prototype.destroy = function() {

	    };

	    module.exports = FaqDetailsController;

	})( window, platformSdk, platformSdk.events );


/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "<div class=\"faqWrapper\">\n\t<ul class=\"faqQuestions\">\n\t\t<li class=\"questionRow\">\n\t\t\t<div class=\"faqQuestion\"></div>\n\t\t\t<div class=\"faqAnswer\"></div>\n\t\t</li>\n\t</ul>\n\t<div class=\"question\"></div>\n</div>"

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),
	        Config = __webpack_require__(6),

	        StickerPackViewController = function(options) {
	            this.template = __webpack_require__(37);
	        };

	    StickerPackViewController.prototype.bind = function(App, data,rId, rRouter) {

	        var that = this;

	        var downloadStickerPackButton = document.getElementsByClassName('downloadStickerPackButton')[0];
	        var stickerRow = document.getElementsByClassName('stickerRow');
	        var selectedSticker = document.getElementsByClassName('selectedSticker')[0];

	        console.log(data);
	        that.assignStickerPreviewImages(selectedSticker, data.act_stickers, stickerRow, data.catId);

	        downloadStickerPackButton.addEventListener('click', function(ev) {
	            console.log("Getting sticker pack for you");

	            var dataToSend = {};

	            //STUB
	            //var data = {};

	            /*data.rid = '57b56ec17e401ddfe70a9e8f';
	            data.send = { 'catId': catId };*/
	            //dataToSend.rid = "";
	            dataToSend.rid = this.getAttribute('data-rewardId');
	            dataToSend.send = { 'catId': data.catId };

	            var stickerJSON = { 'catId': data.catId, 'categoryName': data.name, 'totalStickers': data.nos, 'categorySize': data.size };
	            stickerJSON = JSON.stringify(stickerJSON);

	            App.NinjaService.getStickerPack(dataToSend, function(res) {

	                console.log("Inside actual function");
	                console.log(res);
	                if (res.stat == "ok") {
	                    PlatformBridge.downloadStkPack(stickerJSON);
	                    utils.showToast('You can view your sticker in the sticker palette. Start Sharing');

	                    var dataToSend = {};
	                    dataToSend.rewardId = rId;

	                    App.NinjaService.getRewardDetails(dataToSend, function(res) {
	                        console.log(res.data);
	                        App.router.navigateTo(rRouter, { "rewardDetails": res.data, "rewardId": rId, "rewardRouter": rRouter });
	                    }, this);
	                } else {
	                    utils.showToast("Sticker pack cannot be downloaded right now, please try again after some time!");
	                }
	                // App.router.navigateTo('/');
	            }, this);

	        });


	    };

	    StickerPackViewController.prototype.assignStickerPreviewImages = function(headerSticker, stickerList, rows, catId) {


	        var stickerPreviewUrl = appConfig.API_URL + '/stickerpack/';

	        // Header Sticker
	        headerSticker.style.backgroundImage = 'url(\'' + stickerPreviewUrl + catId + '/preview' + '\')';

	        for (var i = 0; i < rows.length; i++) {
	            var icon = rows[i].getElementsByClassName('stickerIcon')[0];
	            icon.style.backgroundImage = "url('" + appConfig.STICKER_PREFIX + "catId=" + catId + "&stId=" + stickerList[i] + appConfig.STICKER_SUFFIX + "')";
	        }
	    };

	    StickerPackViewController.prototype.render = function(ctr, App, data) {

	        console.log(data);

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'StickerPackViewController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render(that.template, {
	            stickers: data.stickerDetails.act_stickers,
	            rewardId: data.rewardId
	        });

	        var rId = data.rewardId;
	        var rRouter = data.rewardRouter;
	        data = data.stickerDetails;

	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data,rId, rRouter);
	    };

	    StickerPackViewController.prototype.destroy = function() {

	    };

	    module.exports = StickerPackViewController;

	})(window, platformSdk, platformSdk.events);


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "<div id=\"animate-area\" class=\"topIllustration animate-area\"></div>\n<div class=\"bottomIllustration\"></div>\n<div class=\"stickerPreviewWrapper\">\n\t<div class=\"selectedSticker\"></div>\n\t<div class=\"allStickerWrapper\">\n\t\t<ul class=\"stickerList\">\n\t\t\t{{#stickers}}\n\t\t\t\t<li class=\"stickerRow\">\n\t\t\t\t\t<div class=\"stickerIcon\"></div>\n\t\t\t\t</li>\n\t\t\t{{/stickers}}\n\t\t</ul>\n\t</div>\n</div>\n\n<div data-rewardId = \"{{rewardId}}\" class=\"downloadStickerPackButton\">Get Sticker Pack</div>"

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),

	        CoolDownController = function(options) {
	            //this.template = require( 'raw!../../templates/coolDown.html' );
	        };

	    CoolDownController.prototype.bind = function(App, data) {

	        var ftue = this;
	    };

	    CoolDownController.prototype.render = function(ctr, App, data) {

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render(unescape(that.template));
	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    CoolDownController.prototype.destroy = function() {

	    };

	    module.exports = CoolDownController;

	})(window, platformSdk, platformSdk.events);

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),

	        StateController = function(options) {
	            this.template = __webpack_require__(40);
	        };

	    StateController.prototype.bind = function(App, data) {

	        var cta = document.getElementsByClassName('stateCta')[0];

	        cta.addEventListener('click', function(event) {
	            platformSdk.bridge.openFullPage(cta.getAttribute('data-title'), cta.getAttribute('data-link'));
	        });


	    };

	    StateController.prototype.render = function(ctr, App, data) {

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render(unescape(that.template), { stateData: data });
	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    StateController.prototype.destroy = function() {

	    };

	    module.exports = StateController;

	})(window, platformSdk, platformSdk.events);

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = "<div class=\"stateContainer\">\n    <div class=\"stateIcon\" style=\"background-image:url({{stateData.url}});\"> </div>\n    <div class=\"stateTitle align-center\"> {{stateData.title}}</div>\n    <div class=\"stateProgress align-center hide\" data-per=\"{{stateData.per}}\">Progress -> {{stateData.per}} </div>\n    <div class=\"stateSubtitle align-center\"> {{stateData.subtitle}}</div>\n    <div class=\"stateCta align-center\" data-link=\"{{stateData.cta.link}}\" data-title=\"{{stateData.cta.title}}\"> {{stateData.cta.text}}</div>\n</div>"

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),
	        cacheProvider = __webpack_require__(10),
	        profileModel = __webpack_require__(9),
	        activityModel = __webpack_require__(15),
	        
	        

	        SubscriptionController = function(options) {
	            this.template = __webpack_require__(42);
	        };

	    SubscriptionController.prototype.bind = function(App, data) {


	        var that = this,
	            subscribe = document.getElementsByClassName('subscribeBtn')[0],
	            unsubscribe = document.getElementsByClassName('unsubscribeBtn')[0],
	            callInprogress = false,
	            ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');


	        subscribe.addEventListener('click', function(event) {

	            if (callInprogress)
	                return;
	            else
	                callInprogress = false;

	            App.NinjaService.subscribeHandler({}, function(res) {

	                if (res.stat === 'ok') {

	                    cacheProvider.setInCritical('subscriptionCompleted', true);
	                    if (ftueCompleted) {
	                        console.log("This is and old user :: Fetching Profile battery and streak for the user");

	                        // Check If Block True Or False
	                        if (platformSdk.appData.block === 'true') {

	                            console.log('User has blocked the Application');
	                            events.publish('app/block', {
	                                show: true
	                            });
	                        }

	                        App.NinjaService.getNinjaProfile(function(res) {
	                            console.log(res.data);

	                            if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {

	                                App.router.navigateTo('/upgrade');

	                            } else if (res.data.status == 'inactive' || res.data.status == 'locked') {

	                                App.router.navigateTo('/userState', res.data);
	                                console.log("User state  is " + res.data.status);

	                            } else {

	                                // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
	                                App.router.navigateTo('/');
	                                profileModel.updateNinjaData(res.data, App);
	                                activityModel.fetchNinjaActivity('lifetime');
	                                //mysteryBoxModel.getMysteryBoxDetails(self);
	                            }
	                        }, that);
	                    }
	                    // Show FTUE To the User
	                    else {
	                        // STUB TO REMOVE

	                        var data = {};

	                        this.ninjaRewardsData = { 'rewards': [], 'rewards_hash': '' };
	                        this.ninjaProfileData = { "battery": 0, "rewards_hash": "", "status": "active", "streak": 0, "name": '' };
	                        this.ninjaActivityData = { "chatThemes": { "rec": 0, "sent": 0 }, "files": { "rec": 0, "sent": 0 }, "messages": { "rec": 0, "sent": 0 }, "statusUpdates": { "count": 0 }, "stickers": { "rec": 0, "sent": 0 } };

	                        // STUB TO REMOVE

	                        data.ninjaRewardsCollection = this.ninjaRewardsData;
	                        data.ninjaProfileData = this.ninjaProfileData;
	                        data.ninjaActivityData = this.ninjaActivityData;

	                        App.NinjaService.getNinjaProfile(function(res) {
	                            console.log(res.data);

	                            if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {
	                                cacheProvider.setInCritical('ftueCompleted', true);
	                                App.router.navigateTo('/upgrade');
	                            }
	                            else if (res.data.status == 'locked' || res.data.status == 'locked') {
	                                cacheProvider.setInCritical('ftueCompleted', false);
	                                App.router.navigateTo('/userState', res.data);
	                                console.log("User state  is " + res.data.status);

	                            } else {
	                                // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
	                                cacheProvider.setInCritical('ftueCompleted', true);
	                                App.router.navigateTo('/', data);
	                                profileModel.updateNinjaData(res.data, App);
	                                activityModel.fetchNinjaActivity('lifetime');
	                                //mysteryBoxModel.getMysteryBoxDetails(that);
	                            }
	                        }, App);
	                    }

	                } else
	                    utils.showToast('Something went wrong while subscribing');


	            }, that);

	        });

	        unsubscribe.addEventListener('click', function(event) {

	            if (callInprogress)
	                return;
	            else
	                callInprogress = false;

	            App.NinjaService.unsubscribeHandler({}, function(res) {

	                if (res.stat === 'ok')
	                    PlatformBridge.closeWebView();
	                else
	                    utils.showToast('Something went wrong while unsubscribing');

	            }, that);

	        });

	    };

	    SubscriptionController.prototype.render = function(ctr, App, data) {

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render(unescape(that.template));
	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    SubscriptionController.prototype.destroy = function() {

	    };

	    module.exports = SubscriptionController;

	})(window, platformSdk, platformSdk.events);

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "<div class=\"stateContainer\">\n    <div class=\"stateIcon\" style=\"background-image:url(https://s16.postimg.org/re8de8j11/Bitmap.png )\"> </div>\n    <div class=\"stateTitle align-center\"> Congrats</div>\n    <div class=\"stateSubtitle align-center\"> You're one of our top users. You're chosen as a Hike Ninja</div>\n    <div class=\"stateCta align-center subscribeBtn\" style=\"padding-bottom:22px;font-size:22px\"> I'm Excited</div>\n    <div class=\"stateCta align-center unsubscribeBtn\" style='font-size:14px'> No, close this shit</div>\n</div>"

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	(function(W, platformSdk, events) {
	    'use strict';

	    var utils = __webpack_require__(4),
	        Constants = __webpack_require__(5),
	        cacheProvider = __webpack_require__(10),

	        UpgradeController = function(options) {
	            this.template = __webpack_require__(44);
	        };

	    UpgradeController.prototype.bind = function(App, data) {

	        var upgradeBtn = document.getElementsByClassName('upgradeBtn')[0];

	        upgradeBtn.addEventListener('click', function(event) {
	            
	            var jsonobj = {
	                'screen': 'openappstore',
	                'url': 'com.bsb.hike'
	            };
	            PlatformBridge.openActivity(JSON.stringify(jsonobj));
	        });

	    };

	    UpgradeController.prototype.render = function(ctr, App, data) {

	        var that = this;
	        that.el = document.createElement('div');
	        that.el.className = 'ftueController animation_fadein noselect';
	        that.el.innerHTML = Mustache.render(unescape(that.template));
	        ctr.appendChild(that.el);
	        events.publish('update.loader', { show: false });
	        that.bind(App, data);
	    };

	    UpgradeController.prototype.destroy = function() {

	    };

	    module.exports = UpgradeController;

	})(window, platformSdk, platformSdk.events);


/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = "<div class=\"stateContainer\">\n    <div class=\"stateIcon\" style=\"background-image:url(https://s16.postimg.org/re8de8j11/Bitmap.png)\"> </div>\n    <div class=\"stateTitle align-center\"> Opps</div>\n    <div class=\"stateSubtitle align-center\"> You're have to upgrade app to unlock some super cool features. </div>\n    <div class=\"stateCta align-center upgradeBtn\" style='font-size:24px'> Upgrade</div>\n</div>"

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	(function (W, events) {
	    'use strict';

	   var cacheProvider = __webpack_require__(10);
	   
	    var Router = function () {
	        this.routes = {};
	        this.history = [];
	        this.prevData = null;

	        this.getCache();
	    };

	    var _routerCache = {};

	    var unload = function () {
	        // ToDo: Redundant code
	        events.publish('app.store.set', {
	            key: '_routerCache',
	            value: _routerCache
	        });
	    };

	    // window.onbeforeunload = unload;

	    Router.prototype.getCache = function () {
	        events.publish('app.store.get', {
	            key: '_routerCache',
	            ctx: this,
	            cb: function (r) {
	                if (r.status === 1) {
	                    this.history = r.results.history || [];
	                }
	            }
	        });
	    };

	    Router.prototype.route = function (route, callback) {
	        this.routes[route] = callback;
	    };

	    Router.prototype.navigateTo = function (route, data) {

	        var historyTop = this.history[this.history.length - 1];

	        if (historyTop && historyTop.route === route) {
	            if (data.subPath !== undefined && (data.subPath === historyTop.data.subPath)) {
	                return;
	            } else {
	                // Navigate to sub path. Don't push into History. Replace top item with this one.
	                this.history[this.history.length - 1] = {
	                    route: route,
	                    data: data
	                };
	            }
	        } else {
	            this.history.push({
	                route: route,
	                data: data
	            });
	        }

	        this.routes[route](data);

	        _routerCache['route'] = route;
	        _routerCache['cache'] = data;
	        _routerCache['history'] = this.history;

	        unload();

	    };

	    Router.prototype.back = function () {
	        var history = this.history,
	            historyItem;

	        if (history.length !== 1) {
	            history.pop();
	        }

	        historyItem = history[history.length - 1];

	        if(historyItem.route == '/' && !historyItem.data ){
	            historyItem.data = {
	                ninjaRewardsCollection: cacheProvider.getFromCritical('ninjaRewards'),
	                ninjaActivityData: cacheProvider.getFromCritical('ninjaStats'),
	                ninjaProfileData: cacheProvider.getFromCritical('ninjaProfileData')
	            };
	        }

	        this.routes[historyItem.route](historyItem.data);
	    };

	    module.exports = Router;
	})(window, platformSdk.events);

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';

	    var platformSdk = __webpack_require__(3),

	        expHandlerAB = function() {};

	    expHandlerAB.prototype = {

	        // Get From Disk Cache
	        getVal: function(key, defaultVal, callback) {


	            if(typeof PlatformBridge.getABTestBoolean != 'undefined')
	                platformSdk.nativeReqAB({
	                    fn: 'getABTestBoolean',
	                    ctx: this,
	                    data: [key, defaultVal],
	                    success: callback
	                });
	            else{
	                callback(defaultVal);
	            }
	        },
	    };

	    module.exports = new expHandlerAB();
	})();

/***/ }
/******/ ]);