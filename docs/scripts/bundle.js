/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/docs/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	// Observable
	
	window.obs = riot.observable();
	
	var router = __webpack_require__(3);
	router.start();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.5, @license MIT */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.6.5', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},
	
	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  XLINK_NS = 'http://www.w3.org/1999/xlink',
	  XLINK_REGEX = /^xlink:(\w+)/,
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
	  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
	  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,
	
	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice
	
	  /**
	   * Private Methods
	   */
	
	  /**
	   * Helper function needed to get and loop all the events in a string
	   * @param   { String }   e - event string
	   * @param   {Function}   fn - callback
	   */
	  function onEachEvent(e, fn) {
	    var es = e.split(' '), l = es.length, i = 0
	    for (; i < l; i++) {
	      var name = es[i]
	      if (name) fn(name, i)
	    }
	  }
	
	  /**
	   * Public Api
	   */
	
	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el
	
	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name, pos) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to
	     * the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns
	
	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        onEachEvent(events, function(name, pos) {
	
	          fns = slice.call(callbacks[name] || [], 0)
	
	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) continue
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }
	
	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))
	
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	/* istanbul ignore next */
	;(function(riot) {
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	
	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)
	
	  if (args) return args.slice(1)
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}
	
	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0, first
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return
	
	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (first = emitStack.shift()) first() // stack increses within this call
	    emitStackLevel = 0
	  }
	}
	
	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return
	
	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return
	
	  if (el.href != loc.href
	    && (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) return
	
	  e.preventDefault()
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))
	
	  path = base + normalize(path)
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path)
	  // so we need to set it manually
	  doc.title = title
	  routeFound = false
	  emit()
	  return routeFound
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}
	
	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}
	
	/** Prepare the router **/
	route.base()
	route.parser()
	
	riot.route = route
	})(riot)
	/* istanbul ignore next */
	
	/**
	 * The riot template engine
	 * @version v2.4.2
	 */
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */
	
	var brackets = (function (UNDEF) {
	
	  var
	    REGLOB = 'g',
	
	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	
	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	
	    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),
	
	    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,
	
	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },
	
	    DEFAULT = '{ }'
	
	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]
	
	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings
	
	  function _loopback (re) { return re }
	
	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }
	
	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs
	
	    var arr = pair.split(' ')
	
	    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))
	
	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }
	
	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }
	
	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache
	
	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]
	
	    isexpr = start = re.lastIndex = 0
	
	    while ((match = re.exec(str))) {
	
	      pos = match.index
	
	      if (isexpr) {
	
	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }
	
	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }
	
	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }
	
	    return parts
	
	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }
	
	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]
	
	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }
	
	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }
	
	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])
	
	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }
	
	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }
	
	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }
	
	  function _setSettings (o) {
	    var b
	
	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }
	
	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })
	
	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset
	
	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS
	
	  return _brackets
	
	})()
	
	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */
	
	var tmpl = (function () {
	
	  var _cache = {}
	
	  function _tmpl (str, data) {
	    if (!str) return str
	
	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }
	
	  _tmpl.haveRaw = brackets.hasRaw
	
	  _tmpl.hasExpr = brackets.hasExpr
	
	  _tmpl.loopKeys = brackets.loopKeys
	
	  // istanbul ignore next
	  _tmpl.clearCache = function () { _cache = {} }
	
	  _tmpl.errorHandler = null
	
	  function _logErr (err, ctx) {
	
	    if (_tmpl.errorHandler) {
	
	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }
	
	  function _create (str) {
	    var expr = _getTmpl(str)
	
	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr
	
	    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
	  }
	
	  var
	    CH_IDEXPR = String.fromCharCode(0x2057),
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g
	
	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)
	
	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []
	
	      for (i = j = 0; i < parts.length; ++i) {
	
	        expr = parts[i]
	
	        if (expr && (expr = i & 1
	
	            ? _parseExpr(expr, 1, qstr)
	
	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'
	
	          )) list[j++] = expr
	
	      }
	
	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'
	
	    } else {
	
	      expr = _parseExpr(parts[1], 0, qstr)
	    }
	
	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }
	
	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }
	
	  function _parseExpr (expr, asText, qstr) {
	
	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')
	
	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match
	
	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g
	
	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]
	
	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)
	
	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext
	
	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }
	
	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr
	
	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]
	
	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }
	
	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/
	
	  function _wrapExpr (expr, asText, key) {
	    var tb
	
	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length
	
	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })
	
	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }
	
	    if (key) {
	
	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	
	    } else if (asText) {
	
	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }
	
	    return expr
	  }
	
	  _tmpl.version = brackets.version = 'v2.4.2'
	
	  return _tmpl
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/
	
	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   {string} templ  - The template coming from the custom tag definition
	   * @param   {string} [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div', isSVGTag(tagName))
	
	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)
	
	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      setInnerHTML(el, templ)
	
	    el.stub = true
	
	    return el
	  }
	
	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'
	
	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild
	
	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }
	
	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ
	
	    // be careful with #1343 - string on the source having `$1`
	    var src = {}
	
	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()
	
	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }
	
	  return _mkdom
	
	})()
	
	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {
	
	  var i = tags.length,
	    j = items.length,
	    t
	
	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}
	
	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}
	
	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)
	
	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}
	
	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}
	
	
	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {
	
	  // remove the each property from the original tag
	  remAttr(dom, 'each')
	
	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'
	
	  // parse the each expression
	  expr = tmpl.loopKeys(expr)
	
	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)
	
	  // clean template code
	  parent.one('before-mount', function () {
	
	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root
	
	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()
	
	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }
	
	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length
	
	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]
	
	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item
	
	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {
	
	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)
	
	        tag.mount()
	
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
	          oldItems.splice(i, 0, item)
	        }
	
	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)
	
	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	
	        // #closes 2040
	        if (contains(items, oldItems[i])) {
	          // update the DOM
	          if (isVirtual)
	            moveVirtual(tag, root, tags[i], dom.childNodes.length)
	          else if (tags[i].root.parentNode) root.insertBefore(tag.root, tags[i].root)
	        }
	
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }
	
	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }
	
	    // remove the redundant tags
	    unmountRedundant(items, tags)
	
	    // insert the new nodes
	    root.insertBefore(frag, ref)
	    if (isOption) {
	
	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }
	
	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags
	
	    // clone the items array
	    oldItems = items.slice()
	
	  })
	
	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {
	
	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }
	
	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')
	
	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)
	
	    return newNode
	  })()
	
	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''
	
	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })
	
	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }
	
	})(riot)
	
	
	function parseNamedElements(root, tag, childTags, forceParsingNamed) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0
	
	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)
	
	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }
	
	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    attr = getAttr(dom, 'each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom
	
	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id
	
	  extend(this, { parent: parent, root: root, opts: opts}, item)
	  // protect the "tags" property from being overridden
	  defineProperty(this, 'tags', {})
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })
	
	  dom = mkdom(impl.tmpl, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFrom(target) {
	    each(Object.keys(target), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)
	
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = target[k]
	      }
	    })
	  }
	
	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {
	
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent in loop
	    if (isLoop) {
	      inheritFrom(self.parent)
	    }
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	
	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })
	
	    return this
	  })
	
	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance,
	        props = [],
	        obj
	
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	
	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	      } else instance = mix
	
	      var proto = Object.getPrototypeOf(instance)
	
	      // build multilevel prototype inheritance chain property list
	      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
	      while (obj = Object.getPrototypeOf(obj || instance))
	
	      // loop the keys in the function prototype or the all object keys
	      each(props, function(key) {
	        // bind methods to self
	        // allow mixins to override other properties/parent mixins
	        if (key != 'init') {
	          // check for getters/setters
	          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
	          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)
	
	          // apply method only if it does not already exist on the instance
	          if (!self.hasOwnProperty(key) && hasGetterSetter) {
	            Object.defineProperty(self, key, descriptor)
	          } else {
	            self[key] = isFunction(instance[key]) ?
	              instance[key].bind(self) :
	              instance[key]
	          }
	        }
	      })
	
	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })
	
	  defineProperty(this, 'mount', function() {
	
	    updateOpts()
	
	    // add global mixins
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)
	
	    if (globalMixin)
	      for (var i in globalMixin)
	        if (globalMixin.hasOwnProperty(i))
	          self.mixin(globalMixin[i])
	
	    // children in loop should inherit from true parent
	    if (self._parent && self._parent.root.isLoop) {
	      inheritFrom(self._parent)
	    }
	
	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('before-mount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }
	
	    defineProperty(self, 'root', root)
	
	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)
	
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })
	
	
	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)
	
	    self.trigger('before-unmount')
	
	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }
	
	    }
	
	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag
	
	  })
	
	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'
	
	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }
	
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var ptag = tag._parent,
	      item = tag._item,
	      el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	
	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}
	
	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.parent || expr.dom.parentNode
	
	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }
	
	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value
	
	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        // cache the parent node because somehow it will become null on IE
	        // on the next iteration
	        expr.parent = parent
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }
	
	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      if (dom.value !== value) {
	        dom.value = value
	        setAttr(dom, attrName, value)
	      }
	      return
	    } else {
	      // remove original attribute
	      remAttr(dom, attrName)
	    }
	
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'
	
	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''
	
	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }
	
	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }
	
	  })
	
	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0
	
	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	/**
	 * Get the outer html of any DOM node SVGs included
	 * @param   { Object } el - DOM node to parse
	 * @returns { String } el.outerHTML
	 */
	function getOuterHTML(el) {
	  if (el.outerHTML) return el.outerHTML
	  // some browsers do not support outerHTML on the SVGs tags
	  else {
	    var container = mkEl('div')
	    container.appendChild(el.cloneNode(true))
	    return container.innerHTML
	  }
	}
	
	/**
	 * Set the inner html of any DOM node SVGs included
	 * @param { Object } container - DOM node where we will inject the new html
	 * @param { String } html - html to inject
	 */
	function setInnerHTML(container, html) {
	  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
	  // some browsers do not support innerHTML on the SVGs tags
	  else {
	    var doc = new DOMParser().parseFromString(html, 'application/xml')
	    container.appendChild(
	      container.ownerDocument.importNode(doc.documentElement, true)
	    )
	  }
	}
	
	/**
	 * Checks wether a DOM node must be considered part of an svg document
	 * @param   { String }  name - tag name
	 * @returns { Boolean } -
	 */
	function isSVGTag(name) {
	  return ~SVG_TAGS_LIST.indexOf(name)
	}
	
	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}
	
	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}
	
	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}
	
	/**
	 * Set any DOM/SVG attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  var xlink = XLINK_REGEX.exec(name)
	  if (xlink && xlink[1])
	    dom.setAttributeNS(XLINK_NS, xlink[1], val)
	  else
	    dom.setAttribute(name, val)
	}
	
	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}
	
	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return
	
	  tags = parent.tags[tagName]
	
	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}
	
	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent
	
	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''
	
	  return tag
	}
	
	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}
	
	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}
	
	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }
	
	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}
	
	
	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data
	
	  var o = {}
	  for (var key in data) {
	    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
	  }
	  return o
	}
	
	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @param   { Boolean } isSvg - should we use a SVG as parent node?
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name, isSvg) {
	  return isSvg ?
	    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
	    document.createElement(name)
	}
	
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  return Object.create(parent || null)
	}
	
	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}
	
	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }
	
	  // skip the elements with no named properties
	  if (!key) return
	
	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])
	
	}
	
	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame
	
	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0
	
	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf
	
	})(window || {})
	
	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }
	
	  return tag
	}
	/**
	 * Riot public api
	 */
	
	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }
	
	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {},
	    globals = mixins[GLOBAL_MIXIN] = {},
	    _id = 0
	
	  /**
	   * Create/Return a mixin by its name
	   * @param   { String }  name - mixin name (global mixin if object)
	   * @param   { Object }  mixin - mixin logic
	   * @param   { Boolean } g - is global?
	   * @returns { Object }  the mixin logic
	   */
	  return function(name, mixin, g) {
	    // Unnamed global
	    if (isObject(name)) {
	      riot.mixin('__unnamed_'+_id++, name, true)
	      return
	    }
	
	    var store = g ? globals : mixins
	
	    // Getter
	    if (!mixin) {
	      if (typeof store[name] === T_UNDEF) {
	        throw new Error('Unregistered mixin: ' + name)
	      }
	      return store[name]
	    }
	    // Setter
	    if (isFunction(mixin)) {
	      extend(mixin.prototype, store[name] || {})
	      store[name] = mixin
	    }
	    else {
	      store[name] = extend(store[name] || {}, mixin)
	    }
	  }
	
	})()
	
	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	    allTags,
	    tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)
	
	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  // inject styles into DOM
	  styleManager.inject()
	
	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))
	
	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  pushTags(els)
	
	  return tags
	}
	
	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom
	
	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(2) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(16);
	__webpack_require__(17);
	
	riot.route('/', function () {
		__webpack_require__(18);
		__webpack_require__(19);
		__webpack_require__(20);
	
		riot.mount('route', 'home');
	});
	
	riot.route('/archive/*/*', function (year, month) {
		__webpack_require__(22);
	
		riot.mount('route', 'archive', {
			year: year,
			month: month
		});
	});
	
	riot.route('/search/*/*/*', function (word, year, month) {
		__webpack_require__(23);
	
		riot.mount('route', 'search', {
			word: word,
			year: year,
			month: month
		});
	});
	
	module.exports = {
		start: function start() {
			riot.route.start(true);
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('navbar', '<header class="navbar"> <div class="left"> <button type="button" class="navbar-btn-icon"><span class="ion-ios-calendar-outline"></span></button> </div> <h1>デジタル版 白鳥寮献立表</h1> </header>', 'navbar .navbar,[riot-tag="navbar"] .navbar,[data-is="navbar"] .navbar{ position: relative; width: 100%; height: 40px; border-bottom: 1px solid #b3b3b3; background-image: -webkit-linear-gradient(#f0f0f0, #ddd); background-image: -o-linear-gradient(#f0f0f0, #ddd); background-image: linear-gradient(#f0f0f0, #ddd); } navbar .navbar h1,[riot-tag="navbar"] .navbar h1,[data-is="navbar"] .navbar h1{ margin: 0 auto; font-size: 16px; text-shadow: 1px 1px 0 #fff; text-align: center; line-height: 40px; color: #3e3e3e; cursor: default; } navbar .navbar .left,[riot-tag="navbar"] .navbar .left,[data-is="navbar"] .navbar .left{ position: absolute; left: 0; top: 0; }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('credit', '<footer class="global-footer"> <p>このサイトは非公認で勝手に運営しています</p> </footer>', 'credit .global-footer,[riot-tag="credit"] .global-footer,[data-is="credit"] .global-footer{ width: 100%; height: 40px; border-top: 1px solid #b3b3b3; background-image: -webkit-linear-gradient(#ddd, #f0f0f0); background-image: -o-linear-gradient(#ddd, #f0f0f0); background-image: linear-gradient(#ddd, #f0f0f0); } credit .global-footer p,[riot-tag="credit"] .global-footer p,[data-is="credit"] .global-footer p{ text-align: center; text-shadow: 1px 1px 0 #fff; font-size: 14px; line-height: 40px; color: #3e3e3e; cursor: default; }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('btn', '<button type="button" onclick="{onClick}" class="btn"><span class="icon"><span each="{icon in opts.icons}" class="ion-{icon}"></span></span>{opts.text}</button>', 'btn .btn,[riot-tag="btn"] .btn,[data-is="btn"] .btn{ display: block; width: 98%; height: 40px; margin: 10px auto; position: relative; border: 1px solid #ccc; border-radius: 15px; background-image: -webkit-linear-gradient(#fdfdfd, #f1f1f1); background-image: -o-linear-gradient(#fdfdfd, #f1f1f1); background-image: linear-gradient(#fdfdfd, #f1f1f1); box-shadow: 0 2px 3px #ccc; line-height: 40px; color: #2e3436; text-decoration: none; text-align: center; font-weight: bold; font-size: 100%; outline: none; cursor: pointer; -webkit-tap-highlight-color: transparent !important; } btn .btn:hover,[riot-tag="btn"] .btn:hover,[data-is="btn"] .btn:hover{ background-image: -webkit-linear-gradient(#f8f8f8, #e1e1e1); background-image: -o-linear-gradient(#f8f8f8, #e1e1e1); background-image: linear-gradient(#f8f8f8, #e1e1e1); } btn .btn:active,[riot-tag="btn"] .btn:active,[data-is="btn"] .btn:active{ background-image: -webkit-linear-gradient(#d1d1d1, #dfdfdf); background-image: -o-linear-gradient(#d1d1d1, #dfdfdf); background-image: linear-gradient(#d1d1d1, #dfdfdf); } btn .btn .icon,[riot-tag="btn"] .btn .icon,[data-is="btn"] .btn .icon{ position: absolute; top: 0; left: 5px; width: 40px; height: 40px; line-height: 40px; text-align: center; font-size: 25px; color: #939393; } btn .btn .icon > span:nth-child(2),[riot-tag="btn"] .btn .icon > span:nth-child(2),[data-is="btn"] .btn .icon > span:nth-child(2){ margin-left: 5px; }', '', function (opts) {
	    var anime = __webpack_require__(7);
	
	    this.onClick = function () {
	        // スムーススクロール
	        if (opts.scroller) {
	            if (!opts.scroller.target) return;
	            var target = opts.scroller.target;
	            var duration = opts.scroller.duration || 200;
	            var offset = opts.scroller.offset || 0;
	            var callback = opts.scroller.callback;
	            var $target = document.getElementById(target);
	            if (!$target) return;
	            var pos = $target.getBoundingClientRect().top + offset;
	            var pageY = window.pageYOffset;
	            var pageX = window.pageXOffset;
	            // アニメーション
	            anime({
	                duration: duration,
	                easing: 'easeOutCubic',
	                update: function update(step) {
	                    console.log(step.currentTime, step.duration, step.ended, step.progress);
	                    window.scrollTo(pageX, pageY + pos * step.progress / 100);
	                }
	            });
	        }
	        // リンク
	        if (opts.href) {
	            location.href = opts.href;
	        }
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Anime v1.1.1
	 * http://anime-js.com
	 * JavaScript animation engine
	 * Copyright (c) 2016 Julian Garnier
	 * http://juliangarnier.com
	 * Released under the MIT license
	 */
	
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module === 'object' && module.exports) {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    root.anime = factory();
	  }
	}(this, function () {
	
	  var version = '1.1.1';
	
	  // Defaults
	
	  var defaultSettings = {
	    duration: 1000,
	    delay: 0,
	    loop: false,
	    autoplay: true,
	    direction: 'normal',
	    easing: 'easeOutElastic',
	    elasticity: 400,
	    round: false,
	    begin: undefined,
	    update: undefined,
	    complete: undefined
	  }
	
	  // Transforms
	
	  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];
	  var transform, transformStr = 'transform';
	
	  // Utils
	
	  var is = {
	    arr: function(a) { return Array.isArray(a) },
	    obj: function(a) { return Object.prototype.toString.call(a).indexOf('Object') > -1 },
	    svg: function(a) { return a instanceof SVGElement },
	    dom: function(a) { return a.nodeType || is.svg(a) },
	    num: function(a) { return !isNaN(parseInt(a)) },
	    str: function(a) { return typeof a === 'string' },
	    fnc: function(a) { return typeof a === 'function' },
	    und: function(a) { return typeof a === 'undefined' },
	    nul: function(a) { return typeof a === 'null' },
	    hex: function(a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a) },
	    rgb: function(a) { return /^rgb/.test(a) },
	    hsl: function(a) { return /^hsl/.test(a) },
	    col: function(a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)) }
	  }
	
	  // Easings functions adapted from http://jqueryui.com/
	
	  var easings = (function() {
	    var eases = {};
	    var names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
	    var functions = {
	      Sine: function(t) { return 1 - Math.cos( t * Math.PI / 2 ); },
	      Circ: function(t) { return 1 - Math.sqrt( 1 - t * t ); },
	      Elastic: function(t, m) {
	        if( t === 0 || t === 1 ) return t;
	        var p = (1 - Math.min(m, 998) / 1000), st = t / 1, st1 = st - 1, s = p / ( 2 * Math.PI ) * Math.asin( 1 );
	        return -( Math.pow( 2, 10 * st1 ) * Math.sin( ( st1 - s ) * ( 2 * Math.PI ) / p ) );
	      },
	      Back: function(t) { return t * t * ( 3 * t - 2 ); },
	      Bounce: function(t) {
	        var pow2, bounce = 4;
	        while ( t < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
	        return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - t, 2 );
	      }
	    }
	    names.forEach(function(name, i) {
	      functions[name] = function(t) {
	        return Math.pow( t, i + 2 );
	      }
	    });
	    Object.keys(functions).forEach(function(name) {
	      var easeIn = functions[name];
	      eases['easeIn' + name] = easeIn;
	      eases['easeOut' + name] = function(t, m) { return 1 - easeIn(1 - t, m); };
	      eases['easeInOut' + name] = function(t, m) { return t < 0.5 ? easeIn(t * 2, m) / 2 : 1 - easeIn(t * -2 + 2, m) / 2; };
	      eases['easeOutIn' + name] = function(t, m) { return t < 0.5 ? (1 - easeIn(1 - 2 * t, m)) / 2 : (easeIn(t * 2 - 1, m) + 1) / 2; };
	    });
	    eases.linear = function(t) { return t; };
	    return eases;
	  })();
	
	  // Strings
	
	  var numberToString = function(val) {
	    return (is.str(val)) ? val : val + '';
	  }
	
	  var stringToHyphens = function(str) {
	    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	  }
	
	  var selectString = function(str) {
	    if (is.col(str)) return false;
	    try {
	      var nodes = document.querySelectorAll(str);
	      return nodes;
	    } catch(e) {
	      return false;
	    }
	  }
	
	  // Numbers
	
	  var random = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
	
	  // Arrays
	
	  var flattenArray = function(arr) {
	    return arr.reduce(function(a, b) {
	      return a.concat(is.arr(b) ? flattenArray(b) : b);
	    }, []);
	  }
	
	  var toArray = function(o) {
	    if (is.arr(o)) return o;
	    if (is.str(o)) o = selectString(o) || o;
	    if (o instanceof NodeList || o instanceof HTMLCollection) return [].slice.call(o);
	    return [o];
	  }
	
	  var arrayContains = function(arr, val) {
	    return arr.some(function(a) { return a === val; });
	  }
	
	  var groupArrayByProps = function(arr, propsArr) {
	    var groups = {};
	    arr.forEach(function(o) {
	      var group = JSON.stringify(propsArr.map(function(p) { return o[p]; }));
	      groups[group] = groups[group] || [];
	      groups[group].push(o);
	    });
	    return Object.keys(groups).map(function(group) {
	      return groups[group];
	    });
	  }
	
	  var removeArrayDuplicates = function(arr) {
	    return arr.filter(function(item, pos, self) {
	      return self.indexOf(item) === pos;
	    });
	  }
	
	  // Objects
	
	  var cloneObject = function(o) {
	    var newObject = {};
	    for (var p in o) newObject[p] = o[p];
	    return newObject;
	  }
	
	  var mergeObjects = function(o1, o2) {
	    for (var p in o2) o1[p] = !is.und(o1[p]) ? o1[p] : o2[p];
	    return o1;
	  }
	
	  // Colors
	
	  var hexToRgb = function(hex) {
	    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    var hex = hex.replace(rgx, function(m, r, g, b) { return r + r + g + g + b + b; });
	    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    var r = parseInt(rgb[1], 16);
	    var g = parseInt(rgb[2], 16);
	    var b = parseInt(rgb[3], 16);
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	  }
	
	  var hslToRgb = function(hsl) {
	    var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hsl);
	    var h = parseInt(hsl[1]) / 360;
	    var s = parseInt(hsl[2]) / 100;
	    var l = parseInt(hsl[3]) / 100;
	    var hue2rgb = function(p, q, t) {
	      if (t < 0) t += 1;
	      if (t > 1) t -= 1;
	      if (t < 1/6) return p + (q - p) * 6 * t;
	      if (t < 1/2) return q;
	      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	      return p;
	    }
	    var r, g, b;
	    if (s == 0) {
	      r = g = b = l;
	    } else {
	      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	      var p = 2 * l - q;
	      r = hue2rgb(p, q, h + 1/3);
	      g = hue2rgb(p, q, h);
	      b = hue2rgb(p, q, h - 1/3);
	    }
	    return 'rgb(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ')';
	  }
	
	  var colorToRgb = function(val) {
	    if (is.rgb(val)) return val;
	    if (is.hex(val)) return hexToRgb(val);
	    if (is.hsl(val)) return hslToRgb(val);
	  }
	
	  // Units
	
	  var getUnit = function(val) {
	    return /([\+\-]?[0-9|auto\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg)?/.exec(val)[2];
	  }
	
	  var addDefaultTransformUnit = function(prop, val, intialVal) {
	    if (getUnit(val)) return val;
	    if (prop.indexOf('translate') > -1) return getUnit(intialVal) ? val + getUnit(intialVal) : val + 'px';
	    if (prop.indexOf('rotate') > -1 || prop.indexOf('skew') > -1) return val + 'deg';
	    return val;
	  }
	
	  // Values
	
	  var getCSSValue = function(el, prop) {
	    // First check if prop is a valid CSS property
	    if (prop in el.style) {
	      // Then return the property value or fallback to '0' when getPropertyValue fails
	      return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
	    }
	  }
	
	  var getTransformValue = function(el, prop) {
	    var defaultVal = prop.indexOf('scale') > -1 ? 1 : 0;
	    var str = el.style.transform;
	    if (!str) return defaultVal;
	    var rgx = /(\w+)\((.+?)\)/g;
	    var match = [];
	    var props = [];
	    var values = [];
	    while (match = rgx.exec(str)) {
	      props.push(match[1]);
	      values.push(match[2]);
	    }
	    var val = values.filter(function(f, i) { return props[i] === prop; });
	    return val.length ? val[0] : defaultVal;
	  }
	
	  var getAnimationType = function(el, prop) {
	    if ( is.dom(el) && arrayContains(validTransforms, prop)) return 'transform';
	    if ( is.dom(el) && (el.getAttribute(prop) || (is.svg(el) && el[prop]))) return 'attribute';
	    if ( is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) return 'css';
	    if (!is.nul(el[prop]) && !is.und(el[prop])) return 'object';
	  }
	
	  var getInitialTargetValue = function(target, prop) {
	    switch (getAnimationType(target, prop)) {
	      case 'transform': return getTransformValue(target, prop);
	      case 'css': return getCSSValue(target, prop);
	      case 'attribute': return target.getAttribute(prop);
	    }
	    return target[prop] || 0;
	  }
	
	  var getValidValue = function(values, val, originalCSS) {
	    if (is.col(val)) return colorToRgb(val);
	    if (getUnit(val)) return val;
	    var unit = getUnit(values.to) ? getUnit(values.to) : getUnit(values.from);
	    if (!unit && originalCSS) unit = getUnit(originalCSS);
	    return unit ? val + unit : val;
	  }
	
	  var decomposeValue = function(val) {
	    var rgx = /-?\d*\.?\d+/g;
	    return {
	      original: val,
	      numbers: numberToString(val).match(rgx) ? numberToString(val).match(rgx).map(Number) : [0],
	      strings: numberToString(val).split(rgx)
	    }
	  }
	
	  var recomposeValue = function(numbers, strings, initialStrings) {
	    return strings.reduce(function(a, b, i) {
	      var b = (b ? b : initialStrings[i - 1]);
	      return a + numbers[i - 1] + b;
	    });
	  }
	
	  // Animatables
	
	  var getAnimatables = function(targets) {
	    var targets = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
	    return targets.map(function(t, i) {
	      return { target: t, id: i };
	    });
	  }
	
	  // Properties
	
	  var getProperties = function(params, settings) {
	    var props = [];
	    for (var p in params) {
	      if (!defaultSettings.hasOwnProperty(p) && p !== 'targets') {
	        var prop = is.obj(params[p]) ? cloneObject(params[p]) : {value: params[p]};
	        prop.name = p;
	        props.push(mergeObjects(prop, settings));
	      }
	    }
	    return props;
	  }
	
	  var getPropertiesValues = function(target, prop, value, i) {
	    var values = toArray( is.fnc(value) ? value(target, i) : value);
	    return {
	      from: (values.length > 1) ? values[0] : getInitialTargetValue(target, prop),
	      to: (values.length > 1) ? values[1] : values[0]
	    }
	  }
	
	  // Tweens
	
	  var getTweenValues = function(prop, values, type, target) {
	    var valid = {};
	    if (type === 'transform') {
	      valid.from = prop + '(' + addDefaultTransformUnit(prop, values.from, values.to) + ')';
	      valid.to = prop + '(' + addDefaultTransformUnit(prop, values.to) + ')';
	    } else {
	      var originalCSS = (type === 'css') ? getCSSValue(target, prop) : undefined;
	      valid.from = getValidValue(values, values.from, originalCSS);
	      valid.to = getValidValue(values, values.to, originalCSS);
	    }
	    return { from: decomposeValue(valid.from), to: decomposeValue(valid.to) };
	  }
	
	  var getTweensProps = function(animatables, props) {
	    var tweensProps = [];
	    animatables.forEach(function(animatable, i) {
	      var target = animatable.target;
	      return props.forEach(function(prop) {
	        var animType = getAnimationType(target, prop.name);
	        if (animType) {
	          var values = getPropertiesValues(target, prop.name, prop.value, i);
	          var tween = cloneObject(prop);
	          tween.animatables = animatable;
	          tween.type = animType;
	          tween.from = getTweenValues(prop.name, values, tween.type, target).from;
	          tween.to = getTweenValues(prop.name, values, tween.type, target).to;
	          tween.round = (is.col(values.from) || tween.round) ? 1 : 0;
	          tween.delay = (is.fnc(tween.delay) ? tween.delay(target, i, animatables.length) : tween.delay) / animation.speed;
	          tween.duration = (is.fnc(tween.duration) ? tween.duration(target, i, animatables.length) : tween.duration) / animation.speed;
	          tweensProps.push(tween);
	        }
	      });
	    });
	    return tweensProps;
	  }
	
	  var getTweens = function(animatables, props) {
	    var tweensProps = getTweensProps(animatables, props);
	    var splittedProps = groupArrayByProps(tweensProps, ['name', 'from', 'to', 'delay', 'duration']);
	    return splittedProps.map(function(tweenProps) {
	      var tween = cloneObject(tweenProps[0]);
	      tween.animatables = tweenProps.map(function(p) { return p.animatables });
	      tween.totalDuration = tween.delay + tween.duration;
	      return tween;
	    });
	  }
	
	  var reverseTweens = function(anim, delays) {
	    anim.tweens.forEach(function(tween) {
	      var toVal = tween.to;
	      var fromVal = tween.from;
	      var delayVal = anim.duration - (tween.delay + tween.duration);
	      tween.from = toVal;
	      tween.to = fromVal;
	      if (delays) tween.delay = delayVal;
	    });
	    anim.reversed = anim.reversed ? false : true;
	  }
	
	  var getTweensDuration = function(tweens) {
	    if (tweens.length) return Math.max.apply(Math, tweens.map(function(tween){ return tween.totalDuration; }));
	  }
	
	  // will-change
	
	  var getWillChange = function(anim) {
	    var props = [];
	    var els = [];
	    anim.tweens.forEach(function(tween) {
	      if (tween.type === 'css' || tween.type === 'transform' ) {
	        props.push(tween.type === 'css' ? stringToHyphens(tween.name) : 'transform');
	        tween.animatables.forEach(function(animatable) { els.push(animatable.target); });
	      }
	    });
	    return {
	      properties: removeArrayDuplicates(props).join(', '),
	      elements: removeArrayDuplicates(els)
	    }
	  }
	
	  var setWillChange = function(anim) {
	    var willChange = getWillChange(anim);
	    willChange.elements.forEach(function(element) {
	      element.style.willChange = willChange.properties;
	    });
	  }
	
	  var removeWillChange = function(anim) {
	    var willChange = getWillChange(anim);
	    willChange.elements.forEach(function(element) {
	      element.style.removeProperty('will-change');
	    });
	  }
	
	  /* Svg path */
	
	  var getPathProps = function(path) {
	    var el = is.str(path) ? selectString(path)[0] : path;
	    return {
	      path: el,
	      value: el.getTotalLength()
	    }
	  }
	
	  var snapProgressToPath = function(tween, progress) {
	    var pathEl = tween.path;
	    var pathProgress = tween.value * progress;
	    var point = function(offset) {
	      var o = offset || 0;
	      var p = progress > 1 ? tween.value + o : pathProgress + o;
	      return pathEl.getPointAtLength(p);
	    }
	    var p = point();
	    var p0 = point(-1);
	    var p1 = point(+1);
	    switch (tween.name) {
	      case 'translateX': return p.x;
	      case 'translateY': return p.y;
	      case 'rotate': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
	    }
	  }
	
	  // Progress
	
	  var getTweenProgress = function(tween, time) {
	    var elapsed = Math.min(Math.max(time - tween.delay, 0), tween.duration);
	    var percent = elapsed / tween.duration;
	    var progress = tween.to.numbers.map(function(number, p) {
	      var start = tween.from.numbers[p];
	      var eased = easings[tween.easing](percent, tween.elasticity);
	      var val = tween.path ? snapProgressToPath(tween, eased) : start + eased * (number - start);
	      val = tween.round ? Math.round(val * tween.round) / tween.round : val;
	      return val;
	    });
	    return recomposeValue(progress, tween.to.strings, tween.from.strings);
	  }
	
	  var setAnimationProgress = function(anim, time) {
	    var transforms;
	    anim.currentTime = time;
	    anim.progress = (time / anim.duration) * 100;
	    for (var t = 0; t < anim.tweens.length; t++) {
	      var tween = anim.tweens[t];
	      tween.currentValue = getTweenProgress(tween, time);
	      var progress = tween.currentValue;
	      for (var a = 0; a < tween.animatables.length; a++) {
	        var animatable = tween.animatables[a];
	        var id = animatable.id;
	        var target = animatable.target;
	        var name = tween.name;
	        switch (tween.type) {
	          case 'css': target.style[name] = progress; break;
	          case 'attribute': target.setAttribute(name, progress); break;
	          case 'object': target[name] = progress; break;
	          case 'transform':
	          if (!transforms) transforms = {};
	          if (!transforms[id]) transforms[id] = [];
	          transforms[id].push(progress);
	          break;
	        }
	      }
	    }
	    if (transforms) {
	      if (!transform) transform = (getCSSValue(document.body, transformStr) ? '' : '-webkit-') + transformStr;
	      for (var t in transforms) {
	        anim.animatables[t].target.style[transform] = transforms[t].join(' ');
	      }
	    }
	    if (anim.settings.update) anim.settings.update(anim);
	  }
	
	  // Animation
	
	  var createAnimation = function(params) {
	    var anim = {};
	    anim.animatables = getAnimatables(params.targets);
	    anim.settings = mergeObjects(params, defaultSettings);
	    anim.properties = getProperties(params, anim.settings);
	    anim.tweens = getTweens(anim.animatables, anim.properties);
	    anim.duration = getTweensDuration(anim.tweens) || params.duration;
	    anim.currentTime = 0;
	    anim.progress = 0;
	    anim.ended = false;
	    return anim;
	  }
	
	  // Public
	
	  var animations = [];
	  var raf = 0;
	
	  var engine = (function() {
	    var play = function() { raf = requestAnimationFrame(step); };
	    var step = function(t) {
	      if (animations.length) {
	        for (var i = 0; i < animations.length; i++) animations[i].tick(t);
	        play();
	      } else {
	        cancelAnimationFrame(raf);
	        raf = 0;
	      }
	    }
	    return play;
	  })();
	
	  var animation = function(params) {
	
	    var anim = createAnimation(params);
	    var time = {};
	
	    anim.tick = function(now) {
	      anim.ended = false;
	      if (!time.start) time.start = now;
	      time.current = Math.min(Math.max(time.last + now - time.start, 0), anim.duration);
	      setAnimationProgress(anim, time.current);
	      var s = anim.settings;
	      if (s.begin && time.current >= s.delay) { s.begin(anim); s.begin = undefined; };
	      if (time.current >= anim.duration) {
	        if (s.loop) {
	          time.start = now;
	          if (s.direction === 'alternate') reverseTweens(anim, true);
	          if (is.num(s.loop)) s.loop--;
	        } else {
	          anim.ended = true;
	          anim.pause();
	          if (s.complete) s.complete(anim);
	        }
	        time.last = 0;
	      }
	    }
	
	    anim.seek = function(progress) {
	      setAnimationProgress(anim, (progress / 100) * anim.duration);
	    }
	
	    anim.pause = function() {
	      removeWillChange(anim);
	      var i = animations.indexOf(anim);
	      if (i > -1) animations.splice(i, 1);
	    }
	
	    anim.play = function(params) {
	      anim.pause();
	      if (params) anim = mergeObjects(createAnimation(mergeObjects(params, anim.settings)), anim);
	      time.start = 0;
	      time.last = anim.ended ? 0 : anim.currentTime;
	      var s = anim.settings;
	      if (s.direction === 'reverse') reverseTweens(anim);
	      if (s.direction === 'alternate' && !s.loop) s.loop = 1;
	      setWillChange(anim);
	      animations.push(anim);
	      if (!raf) engine();
	    }
	
	    anim.restart = function() {
	      if (anim.reversed) reverseTweens(anim);
	      anim.pause();
	      anim.seek(0);
	      anim.play();
	    }
	
	    if (anim.settings.autoplay) anim.play();
	
	    return anim;
	
	  }
	
	  // Remove one or multiple targets from all active animations.
	
	  var remove = function(elements) {
	    var targets = flattenArray(is.arr(elements) ? elements.map(toArray) : toArray(elements));
	    for (var i = animations.length-1; i >= 0; i--) {
	      var animation = animations[i];
	      var tweens = animation.tweens;
	      for (var t = tweens.length-1; t >= 0; t--) {
	        var animatables = tweens[t].animatables;
	        for (var a = animatables.length-1; a >= 0; a--) {
	          if (arrayContains(targets, animatables[a].target)) {
	            animatables.splice(a, 1);
	            if (!animatables.length) tweens.splice(t, 1);
	            if (!tweens.length) animation.pause();
	          }
	        }
	      }
	    }
	  }
	
	  animation.version = version;
	  animation.speed = 1;
	  animation.list = animations;
	  animation.remove = remove;
	  animation.easings = easings;
	  animation.getValue = getInitialTargetValue;
	  animation.path = getPathProps;
	  animation.random = random;
	
	  return animation;
	
	}));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('menu-list', '<ol class="menu-list"> <li each="{item, i in menu}" onclick="{openPopup(item, date.isToday(item.date))}" data-index="{i}" id="{date.isToday(item.date) ? \'today\' : \'\'}" class="menu-item {date.isToday(item.date) ? \'today\' : \'open-popup\'} {date.week(item.date)}"> <div class="date">{date.date(item.date)}<span class="week">{date.week(item.date)}</span></div> <ol if="{!date.isToday(item.date)}" class="item-list"> <li class="list-item"> <div class="label">朝</div> <div onload="{m_main = item.m_main.split(\',\')}" class="menu"><span>{m_main[0]}</span><span if="{m_main[1]}"> / {m_main[1]}</span></div> </li> <li class="list-item"> <div class="label">昼</div> <div class="menu"><span>{item.l_main}</span></div> </li> <li class="list-item"> <div class="label">夜</div> <div onload="{d_main = item.d_main.split(\',\')}" class="menu dinner"> <div if="{d_main[1]}"><span>{d_main[0]}</span><span>{d_main[1]}</span></div> <div if="{!d_main[1]}"></div> </div> </li> </ol> <ol if="{date.isToday(item.date)}" class="item-list"> <li class="list-item"> <div class="label">朝</div> <div onload="{m_main = item.m_main.split(\',\')}" class="menu"><span class="main">{m_main[0]}</span><span if="{m_main[1]}" class="main">{m_main[1]}</span> <hr class="partition"><span each="{m_side in item.m_side.split(\',\')}" class="side">{m_side}</span> </div> </li> <li class="list-item"> <div class="label">昼</div> <div class="menu"><span class="main">{item.l_main}</span> <hr class="partition"><span each="{l_side in item.l_side.split(\',\')}" class="side">{l_side}</span> </div> </li> <li class="list-item"> <div class="label">夜</div> <div if="{d_main[1]}" onload="{d_main = item.d_main.split(\',\')}" class="menu dinner"><span class="main">{d_main[0]}</span><span class="main">{d_main[1]}</span> <hr class="partition"><span each="{d_side in item.d_side.split(\',\')}" class="side">{d_side}</span> </div> <div if="{!d_main[1]}" class="event"></div> </li> </ol> </li> </ol>', 'menu-list .menu-list,[riot-tag="menu-list"] .menu-list,[data-is="menu-list"] .menu-list{ width: 100%; } menu-list .menu-list .menu-item,[riot-tag="menu-list"] .menu-list .menu-item,[data-is="menu-list"] .menu-list .menu-item{ width: 100%; box-sizing: border-box; } menu-list .menu-list .menu-item:not(.today),[riot-tag="menu-list"] .menu-list .menu-item:not(.today),[data-is="menu-list"] .menu-list .menu-item:not(.today){ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; padding: 8px 5px; background: #fff; border-top: 1px solid #bbb; } menu-list .menu-list .menu-item:not(.today):last-child,[riot-tag="menu-list"] .menu-list .menu-item:not(.today):last-child,[data-is="menu-list"] .menu-list .menu-item:not(.today):last-child{ border-bottom: 1px solid #bbb; } menu-list .menu-list .menu-item:not(.today) .date,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .date,[data-is="menu-list"] .menu-list .menu-item:not(.today) .date{ width: 30px; font-size: 20px; text-align: center; color: #191919; } menu-list .menu-list .menu-item:not(.today) .date .week,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .date .week,[data-is="menu-list"] .menu-list .menu-item:not(.today) .date .week{ display: block; font-size: 10px; text-transform: uppercase; } menu-list .menu-list .menu-item:not(.today) .item-list,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list{ flex: 1; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item{ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; padding: 8px 5px; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .label,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .label,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .label{ display: block; width: 25px; height: 25px; border-radius: 100%; background: #ccc; line-height: 25px; text-align: center; font-size: 12px; color: #111; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu{ flex: 1; margin-left: 5px; padding: 8px; border-radius: 5px; background: #fff; font-size: 15px; line-height: 20px; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span{ display: block; margin-left: 22px; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span::before,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span::before,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span::before{ display: inline-block; width: 18px; height: 18px; margin: 1px 2px 1px -20px; background: #444; font-size: 12px; line-height: 18px; text-align: center; color: #fff; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child{ margin-bottom: 5px; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child::before,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child::before,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:first-child::before{ content: \'A\'; } menu-list .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:last-child::before,[riot-tag="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:last-child::before,[data-is="menu-list"] .menu-list .menu-item:not(.today) .item-list .list-item .menu.dinner span:last-child::before{ content: \'B\'; } menu-list .menu-list .menu-item.sat,[riot-tag="menu-list"] .menu-list .menu-item.sat,[data-is="menu-list"] .menu-list .menu-item.sat{ background: #d9dbf6; } menu-list .menu-list .menu-item.sat .item-list .list-item .label,[riot-tag="menu-list"] .menu-list .menu-item.sat .item-list .list-item .label,[data-is="menu-list"] .menu-list .menu-item.sat .item-list .list-item .label{ background: #a5abf0; } menu-list .menu-list .menu-item.sat .item-list .list-item .menu,[riot-tag="menu-list"] .menu-list .menu-item.sat .item-list .list-item .menu,[data-is="menu-list"] .menu-list .menu-item.sat .item-list .list-item .menu{ background: #d9dbf6; } menu-list .menu-list .menu-item.sun,[riot-tag="menu-list"] .menu-list .menu-item.sun,[data-is="menu-list"] .menu-list .menu-item.sun{ background: #f6d9db; } menu-list .menu-list .menu-item.sun .item-list .list-item .label,[riot-tag="menu-list"] .menu-list .menu-item.sun .item-list .list-item .label,[data-is="menu-list"] .menu-list .menu-item.sun .item-list .list-item .label{ background: #f0a5a9; } menu-list .menu-list .menu-item.sun .item-list .list-item .menu,[riot-tag="menu-list"] .menu-list .menu-item.sun .item-list .list-item .menu,[data-is="menu-list"] .menu-list .menu-item.sun .item-list .list-item .menu{ background: #f6d9db; } menu-list .menu-list .menu-item.open-popup,[riot-tag="menu-list"] .menu-list .menu-item.open-popup,[data-is="menu-list"] .menu-list .menu-item.open-popup{ cursor: pointer; } menu-list .menu-list .menu-item.open-popup:hover,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover{ background: #ccc; } menu-list .menu-list .menu-item.open-popup:hover .label,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover .label,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover .label{ background: #aaa; } menu-list .menu-list .menu-item.open-popup:hover.sun,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover.sun,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover.sun{ background: #f6a6ab; } menu-list .menu-list .menu-item.open-popup:hover.sun .label,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover.sun .label,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover.sun .label{ background: #f07077; } menu-list .menu-list .menu-item.open-popup:hover.sat,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover.sat,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover.sat{ background: #a5aaf6; } menu-list .menu-list .menu-item.open-popup:hover.sat .label,[riot-tag="menu-list"] .menu-list .menu-item.open-popup:hover.sat .label,[data-is="menu-list"] .menu-list .menu-item.open-popup:hover.sat .label{ background: #727bf2; } menu-list .today,[riot-tag="menu-list"] .today,[data-is="menu-list"] .today{ padding: 5px; border-top: 5px solid #bbb; border-right: 2px solid #bbb; border-bottom: 4px solid #bbb; border-left: 2px solid #bbb; background: #fff; } menu-list .today .date,[riot-tag="menu-list"] .today .date,[data-is="menu-list"] .today .date{ font-weight: bold; text-align: center; font-size: 25px; color: #252521; } menu-list .today .date .week,[riot-tag="menu-list"] .today .date .week,[data-is="menu-list"] .today .date .week{ font-weight: normal; margin-left: 8px; font-size: 14px; } menu-list .today .item-list .list-item,[riot-tag="menu-list"] .today .item-list .list-item,[data-is="menu-list"] .today .item-list .list-item{ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; margin: 15px 0; } menu-list .today .item-list .list-item .label,[riot-tag="menu-list"] .today .item-list .list-item .label,[data-is="menu-list"] .today .item-list .list-item .label{ width: 20px; margin: 0 5px; padding: 40px 0; border-radius: 20px; background: #ccc; text-align: center; line-height: 30px; color: #222; } menu-list .today .item-list .list-item .menu,[riot-tag="menu-list"] .today .item-list .list-item .menu,[data-is="menu-list"] .today .item-list .list-item .menu{ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; flex-direction: column; align-items: center; flex: 1; margin: 0 10px; } menu-list .today .item-list .list-item .menu .main,[riot-tag="menu-list"] .today .item-list .list-item .menu .main,[data-is="menu-list"] .today .item-list .list-item .menu .main{ margin: 6px 0; font-size: 18px; } menu-list .today .item-list .list-item .menu .side,[riot-tag="menu-list"] .today .item-list .list-item .menu .side,[data-is="menu-list"] .today .item-list .list-item .menu .side{ margin: 4px 0; font-size: 15px; color: #333; } menu-list .today .item-list .list-item .menu .partition,[riot-tag="menu-list"] .today .item-list .list-item .menu .partition,[data-is="menu-list"] .today .item-list .list-item .menu .partition{ width: 95%; margin: 5px auto 8px; border-top: 0; border-right: 0; border-bottom: 1px dashed #aaa; border-left: 0; } menu-list .today .item-list .list-item .menu.dinner .main,[riot-tag="menu-list"] .today .item-list .list-item .menu.dinner .main,[data-is="menu-list"] .today .item-list .list-item .menu.dinner .main{ margin-left: 26px; } menu-list .today .item-list .list-item .menu.dinner .main::before,[riot-tag="menu-list"] .today .item-list .list-item .menu.dinner .main::before,[data-is="menu-list"] .today .item-list .list-item .menu.dinner .main::before{ display: inline-block; width: 20px; height: 20px; margin: 1px 4px 1px -24px; background: #333; font-size: 15px; line-height: 20px; text-align: center; color: #fff; } menu-list .today .item-list .list-item .menu.dinner .main:nth-child(1),[riot-tag="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(1),[data-is="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(1){ margin-bottom: 5px; } menu-list .today .item-list .list-item .menu.dinner .main:nth-child(1)::before,[riot-tag="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(1)::before,[data-is="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(1)::before{ content: \'A\'; } menu-list .today .item-list .list-item .menu.dinner .main:nth-child(2)::before,[riot-tag="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(2)::before,[data-is="menu-list"] .today .item-list .list-item .menu.dinner .main:nth-child(2)::before{ content: \'B\'; }', '', function (opts) {
	    var u = __webpack_require__(9);
	    var api = __webpack_require__(10);
	    var self = this;
	
	    self.year = opts.year;
	    self.month = opts.month;
	    self.word = opts.word || null;
	
	    self.date = u.date;
	
	    self.openPopup = function (item, isToday) {
	        if (isToday) return;
	        return function (e) {
	            obs.trigger('openPopup', item);
	        };
	    };
	
	    api.get(self.year, self.month, self.word).then(function (data) {
	        self.menu = data.items;
	        self.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	var d = new Date();
	
	var zero = function zero(num) {
		var lv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	
		return ('0000000000' + num).slice(-lv);
	};
	
	module.exports = {
		now: {
			year: d.getFullYear(),
			month: d.getMonth() + 1
		},
		date: {
			year: function year(date) {
				return Math.floor(date / 10000);
			},
			month: function month(date) {
				return Math.floor(date / 100) % 100;
			},
			date: function date(_date) {
				return _date % 100;
			},
			week_en: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
			week_ja: ['日', '月', '火', '水', '木', '金', '土'],
			week: function week(date, lang) {
				lang = lang || 'en';
				var d = new Date(this.format(date));
				var week = d.getDay();
				switch (lang) {
					case 'ja':
						return this.week_ja[week];
					case 'en':
						return this.week_en[week];
					default:
						return week;
				}
			},
			format: function format(opts_date) {
				var year = this.year(opts_date);
				var month = this.month(opts_date);
				var date = this.date(opts_date);
				return year + '-' + zero(month) + '-' + zero(date);
			},
			isToday: function isToday(opts_date) {
				var d = new Date();
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var date = d.getDate();
				var format = '' + year + zero(month) + zero(date);
				if (opts_date == format) {
					return true;
				} else {
					return false;
				}
			},
			lastDate: function lastDate() {
				var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : d.getFullYear();
				var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : d.getMonth() + 1;
	
				return new Date(year, month, 0).getDate();
			}
		},
		zero: zero
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var request = __webpack_require__(11);
	var u = __webpack_require__(9);
	
	var menu = {};
	
	module.exports = {
		get: function get() {
			var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : u.now.year;
			var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : u.now.month;
			var word = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
			return new Promise(function (resolve, reject) {
				var date = '' + year + u.zero(month);
				// 取得済みの場合は取得しない
				if (menu[date]) {
					resolve(menu[date]);
					return;
				}
				var url = word === null ? 'http://uswan-api.simo.website/' + year + '/' + u.zero(month) : 'http://uswan-api.simo.website/' + year + '/' + u.zero(month) + '/' + word;
				request.get(url).end(function (err, res) {
					if (err) {
						reject(err);
						return;
					}
					menu[date] = res.body;
					resolve(res.body);
				});
			});
		},
		archive: function archive() {
			return new Promise(function (resolve, reject) {
				if (menu.archive) {
					resolve(menu.archive);
					return;
				}
				request.get('http://uswan-api.simo.website/archive').end(function (err, res) {
					if (err) {
						reject(err);
						return;
					}
					menu.archive = res.body;
					resolve(res.body);
				});
			});
		}
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}
	
	var Emitter = __webpack_require__(12);
	var requestBase = __webpack_require__(13);
	var isObject = __webpack_require__(14);
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Expose `request`.
	 */
	
	var request = module.exports = __webpack_require__(15).bind(null, Request);
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	
	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}
	
	/**
	 * Mixin `Emitter` and `requestBase`.
	 */
	
	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	
	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  this._appendQueryString();
	
	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(14);
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}
	
	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};
	
	/**
	 * Allow for extension
	 */
	
	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	exports.getHeader = exports.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	
	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }
	
	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }
	
	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};
	
	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */
	
	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || this._isHost(data)) return this;
	
	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}
	
	module.exports = isObject;


/***/ },
/* 15 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }
	
	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }
	
	  return new RequestConstructor(method, url);
	}
	
	module.exports = request;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('menu-popup', '<div id="popupWrapper" show="{isOpen}" class="popup-wrapper"> <div id="popup" class="dialog"> <div class="header {date.week(data.date)}">{date.date(data.date)}<span class="week">{date.week(data.date)}</span></div> <div id="popupBody" class="main-area"> <ol class="menu-list"> <li class="list-item"> <div class="label">朝</div> <div onload="{m_main = data.m_main.split(\',\')}" class="menu"> <div class="main"><span>{m_main[0]}</span><span if="{m_main[1]}"> / {m_main[1]}</span></div><span each="{m_side in data.m_side.split(\',\')}" class="side">{m_side}</span> </div> </li> <li class="list-item"> <div class="label">昼</div> <div class="menu"><span class="main">{data.l_main}</span><span each="{l_side in data.l_side.split(\',\')}" class="side">{l_side}</span></div> </li> <li class="list-item"> <div class="label">夜</div> <div onload="{d_main = data.d_main.split(\',\')}" class="menu dinner"><span class="main">{d_main[0]}</span><span class="main">{d_main[1]}</span><span each="{d_side in data.d_side.split(\',\')}" class="side">{d_side}</span></div> </li> </ol> </div> <div class="footer"> <button onclick="{close}" class="close-btn">閉じる</button> </div> </div> </div>', 'menu-popup .popup-wrapper,[riot-tag="menu-popup"] .popup-wrapper,[data-is="menu-popup"] .popup-wrapper{ position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 999; } menu-popup .popup-wrapper .dialog,[riot-tag="menu-popup"] .popup-wrapper .dialog,[data-is="menu-popup"] .popup-wrapper .dialog{ position: fixed; top: 30px; left: 15px; bottom: 50px; right: 15px; display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; flex-direction: column; box-sizing: border-box; border: 5px solid #797979; background: rgba(255, 255, 255, 0.85); opacity: 0; } menu-popup .popup-wrapper .dialog .header,[riot-tag="menu-popup"] .popup-wrapper .dialog .header,[data-is="menu-popup"] .popup-wrapper .dialog .header{ margin: 10px 0 5px; text-align: center; font-weight: bold; font-size: 25px; color: #252512; } menu-popup .popup-wrapper .dialog .header.sun,[riot-tag="menu-popup"] .popup-wrapper .dialog .header.sun,[data-is="menu-popup"] .popup-wrapper .dialog .header.sun{ color: #f07077; } menu-popup .popup-wrapper .dialog .header.sat,[riot-tag="menu-popup"] .popup-wrapper .dialog .header.sat,[data-is="menu-popup"] .popup-wrapper .dialog .header.sat{ color: #727bf2; } menu-popup .popup-wrapper .dialog .header .week,[riot-tag="menu-popup"] .popup-wrapper .dialog .header .week,[data-is="menu-popup"] .popup-wrapper .dialog .header .week{ display: inline-block; font-weight: normal; margin-left: 8px; font-size: 14px; text-transform: uppercase; } menu-popup .popup-wrapper .dialog .main-area,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area,[data-is="menu-popup"] .popup-wrapper .dialog .main-area{ flex: 1; overflow-y: auto; padding: 10px 25px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item{ margin-bottom: 30px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item:last-child,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item:last-child,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item:last-child{ margin-bottom: 10px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .label,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .label,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .label{ max-width: 200px; height: 20px; margin: 0 auto; border-radius: 8px; background: #d5d5d5; line-height: 20px; font-size: 14px; text-align: center; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu{ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; flex-direction: column; align-items: center; margin: 10px 0; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu .main,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu .main,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu .main{ margin: 10px 0; padding: 0; font-size: 22px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu .side,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu .side,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu .side{ margin: 8px 0; font-size: 15px; color: #333; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main{ margin-left: 26px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::before,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::before,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::before,menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::after,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::after,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main::after{ display: inline-block; width: 22px; height: 22px; margin: 1px 6px 1px -26px; background: #333; font-size: 15px; line-height: 22px; text-align: center; color: #fff; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1),[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1),[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1){ margin-bottom: 5px; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1)::before,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1)::before,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(1)::before{ content: \'A\'; } menu-popup .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(2)::before,[riot-tag="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(2)::before,[data-is="menu-popup"] .popup-wrapper .dialog .main-area .menu-list .list-item .menu.dinner .main:nth-child(2)::before{ content: \'B\'; } menu-popup .popup-wrapper .dialog .footer,[riot-tag="menu-popup"] .popup-wrapper .dialog .footer,[data-is="menu-popup"] .popup-wrapper .dialog .footer{ width: 100%; height: 60px; } menu-popup .popup-wrapper .dialog .footer .close-btn,[riot-tag="menu-popup"] .popup-wrapper .dialog .footer .close-btn,[data-is="menu-popup"] .popup-wrapper .dialog .footer .close-btn{ display: block; width: 90%; height: 40px; margin: 10px auto; outline: rgba(255, 255, 255, 0.5); border: 1px solid #aaa; background: transparent; font-size: 15px; color: #454545; cursor: pointer; transition: all .2s ease; } menu-popup .popup-wrapper .dialog .footer .close-btn:active,[riot-tag="menu-popup"] .popup-wrapper .dialog .footer .close-btn:active,[data-is="menu-popup"] .popup-wrapper .dialog .footer .close-btn:active{ background: #454545; border-color: #454545; color: #e0e0e0; }', '', function (opts) {
	    var self = this;
	    var anime = __webpack_require__(7);
	    self.date = __webpack_require__(9).date;
	
	    self.isOpen = false;
	
	    self.close = function () {
	        anime({
	            targets: document.getElementById('popup'),
	            delay: 100,
	            duration: 400,
	            easing: 'easeOutCubic',
	            translateY: '40px',
	            opacity: 0,
	            update: function update(step) {
	                var progress = step.progress * 2 < 0 ? 0 : step.progress * 2;
	                document.getElementById('blur').style.WebkitFilter = 'blur(' + (3 - 3 * progress / 100) + 'px)';
	            },
	            complete: function complete() {
	                self.isOpen = false;
	                riot.update();
	            }
	        });
	    };
	
	    obs.on('openPopup', function (data) {
	        self.data = data;
	        self.isOpen = true;
	        riot.update();
	        var $ele = document.getElementById('popup');
	        $ele.style.transform = 'translateY(40px)';
	        anime({
	            targets: $ele,
	            delay: 100,
	            duration: 600,
	            easing: 'easeOutCubic',
	            translateY: 0,
	            opacity: 1,
	            update: function update(step) {
	                document.getElementById('blur').style.WebkitFilter = 'blur(' + 3 * step.progress / 100 + 'px)';
	            }
	        });
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('footer-nav', '<btn icons="{[\'ios-calendar-outline\']}" text="過去の献立" onclick="{toggleArchiveList}"></btn> <div id="archiveList" class="archive-list"> <ol> <li each="{item in archive}" if="{!(item.year == u.now.year &amp;&amp; item.month == u.now.month)}"> <btn href="#/archive/{item.year}/{item.month}" text="{item.year}年{item.month}月"></btn> </li> </ol> </div> <btn icons="{[\'ios-search\']}" text="検索" onclick="{toggleSearchForm}"></btn>', 'footer-nav .archive-list,[riot-tag="footer-nav"] .archive-list,[data-is="footer-nav"] .archive-list{ overflow: hidden; height: 0; opacity: 0; } footer-nav .archive-list ol,[riot-tag="footer-nav"] .archive-list ol,[data-is="footer-nav"] .archive-list ol{ margin: -10px 3% 0; }', '', function (opts) {
	    var anime = __webpack_require__(7);
	    var api = __webpack_require__(10);
	    var self = this;
	
	    self.u = __webpack_require__(9);
	
	    api.archive().then(function (data) {
	        self.archive = data.items;
	        self.archiveCount = data.count;
	        self.update();
	    });
	
	    self.isOpen = {
	        calendar: false
	    };
	
	    self.on('mount', function () {
	        var $list = document.getElementById('archiveList');
	        var isArchiveOpen = false;
	        self.toggleArchiveList = function () {
	            anime({
	                targets: $list,
	                duration: 300,
	                easing: 'easeOutQuad',
	                height: isArchiveOpen ? 0 : (self.archiveCount - 1) * 55,
	                opacity: isArchiveOpen ? 0 : 1
	            });
	            isArchiveOpen = ~isArchiveOpen;
	        };
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('home', '<div id="blur"> <navbar></navbar> <next></next> <footer-nav></footer-nav> <btn icons="{[\'fork\', \'knife\']}" text="今日の献立" scroller="{scrollerOpts}"></btn> <menu-list year="{year}" month="{month}"></menu-list> <credit></credit> </div> <menu-popup></menu-popup>', '', '', function (opts) {
	    var self = this;
	
	    var d = new Date();
	    self.year = d.getFullYear();
	    self.month = d.getMonth() + 1;
	
	    self.scrollerOpts = {
	        target: 'today',
	        duration: 300
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('next', '<div class="next-menu"> <curfew></curfew> <div class="time">{time}<span class="small">の献立</span></div> <div if="{loading}" class="loader"></div> <div if="{!loading}"> <ol if="{menu.status == \'OK\'}" class="menu-list"> <li if="{timeId != 3}" class="main">{menu.main[0]}<span if="{menu.main[1]}"> / {menu.main[1]}</span></li> <li if="{timeId == 3}" class="main dinnerA">{menu.main[0]}</li> <li if="{timeId == 3}" class="main dinnerB">{menu.main[1]}</li> <li each="{item in menu.sides}" class="side">{item}</li> </ol> <div if="{menu.status == \'event\'}" class="event"> <p class="title">{menu.main[0]}</p> <p if="{menu.main[1]}" class="text">{menu.main[1]}</p> </div> <div if="{menu.status == \'notfound\' || !menu.status}" class="notfound"><i class="ion-coffee icon"></i> <p class="text">献立を取得できませんでした</p> </div> </div> </div>', 'next .next-menu,[riot-tag="next"] .next-menu,[data-is="next"] .next-menu{ position: relative; overflow: hidden; margin: 10px 3px 20px; border: 1px solid #aaa; background: #fff; box-shadow: 0 6px 3px -4px #bbb; box-sizing: border-box; text-align: center; } next .next-menu .time,[riot-tag="next"] .next-menu .time,[data-is="next"] .next-menu .time{ padding: 8px 0; border-bottom: 1px solid #ccc; background: #ddd; color: #252521; } next .next-menu .time .small,[riot-tag="next"] .next-menu .time .small,[data-is="next"] .next-menu .time .small{ margin-left: 5px; font-size: 16px; color: #454545; } next .next-menu .menu-list,[riot-tag="next"] .next-menu .menu-list,[data-is="next"] .next-menu .menu-list{ margin: 20px 12px; } next .next-menu .menu-list .main,[riot-tag="next"] .next-menu .menu-list .main,[data-is="next"] .next-menu .menu-list .main{ margin-bottom: 5px; font-size: 22px; } next .next-menu .menu-list .main.dinnerA::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerA::before,[data-is="next"] .next-menu .menu-list .main.dinnerA::before,next .next-menu .menu-list .main.dinnerB::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerB::before,[data-is="next"] .next-menu .menu-list .main.dinnerB::before{ position: relative; top: -2px; display: inline-block; width: 20px; height: 20px; margin-right: 5px; background: #222; line-height: 20px; text-align: center; font-size: 14px; color: #e9e9e9; } next .next-menu .menu-list .main.dinnerA::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerA::before,[data-is="next"] .next-menu .menu-list .main.dinnerA::before{ content: "A"; } next .next-menu .menu-list .main.dinnerB::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerB::before,[data-is="next"] .next-menu .menu-list .main.dinnerB::before{ content: "B"; } next .next-menu .menu-list .side,[riot-tag="next"] .next-menu .menu-list .side,[data-is="next"] .next-menu .menu-list .side{ margin-top: 8px; font-size: 16px; color: #444; } next .next-menu .event .title,[riot-tag="next"] .next-menu .event .title,[data-is="next"] .next-menu .event .title{ margin: 25px 0 30px; font-size: 50px; color: #222; } next .next-menu .event .text,[riot-tag="next"] .next-menu .event .text,[data-is="next"] .next-menu .event .text{ margin-bottom: 20px; font-size: 14px; letter-spacing: 0.18em; color: #555; } next .next-menu .notfound .icon,[riot-tag="next"] .next-menu .notfound .icon,[data-is="next"] .next-menu .notfound .icon{ display: block; margin: 25px 0 30px; font-size: 50px; color: #999; } next .next-menu .notfound .text,[riot-tag="next"] .next-menu .notfound .text,[data-is="next"] .next-menu .notfound .text{ margin-bottom: 20px; font-size: 13px; letter-spacing: 0.18em; color: #555; text-shadow: 1px 1px #bbb; }', '', function (opts) {
	    var self = this;
	    var u = __webpack_require__(9);
	
	    var d = new Date();
	    var hours = d.getHours();
	    var minutes = d.getMinutes();
	    var date = d.getDate();
	
	    var getToday = function getToday(data) {
	        for (var i = 0, len = data.length; i < len; i++) {
	            var item = data[i];
	            if (item.date % 100 === date) {
	                return item;
	            }
	        }
	        return 'notfound';
	    };
	
	    var getItem = function getItem(data, timeId) {
	        var today = getToday(data);
	        if (today === 'notfound') {
	            return today;
	        } else {
	            switch (timeId) {
	                // 朝の献立を返却
	                case 1:
	                    return {
	                        status: 'OK',
	                        main: today.m_main.split(','),
	                        sides: today.m_side.split(',')
	                    };
	                // 昼の献立を返却
	                case 2:
	                    return {
	                        status: 'OK',
	                        main: today.l_main.split(','),
	                        sides: today.l_side.split(',')
	                    };
	                // 夜の献立を返却
	                case 3:
	                    return {
	                        status: 'OK',
	                        main: today.d_main.split(','),
	                        sides: today.d_side.split(',')
	                    };
	                default:
	                    // 次の日の朝食（調整中）
	                    return {
	                        status: 'OK',
	                        main: today.m_main.split(','),
	                        sides: today.m_side.split(',')
	                    };
	            }
	        }
	    };
	
	    var getTime = function getTime(data) {
	        if (hours < 8 || hours == 8 && minutes <= 30) {
	            return { id: 1, label: '朝' };
	        } else if (hours < 12 || hours == 12 && minutes <= 50) {
	            return { id: 2, label: '昼' };
	        } else if (hours < 19 || hours == 19 && minutes <= 40) {
	            return { id: 3, label: '夜' };
	        } else {
	            return { id: 4, label: '明日 朝' };
	        }
	    };
	
	    var time = getTime();
	    self.time = time.label;
	    self.timeId = time.id;
	
	    self.loading = true;
	
	    var api = __webpack_require__(10);
	    api.get().then(function (data) {
	        if (data.status === '') {
	            self.menu = {
	                status: 'notfound'
	            };
	        }
	        self.menu = getItem(data.items, time.id);
	        self.loading = false;
	        self.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('curfew', '<div if="{isShow}" id="curfew" class="curfew">門限を確認しましたか？ <div class="footer"> <div class="center"><span class="ion-ios-circle-outline icon"></span>タップ：再表示<br><span class="ion-ios-circle-filled icon"></span>ダブルタップ：確認</div> </div> </div>', 'curfew .curfew,[riot-tag="curfew"] .curfew,[data-is="curfew"] .curfew{ position: absolute; top: 0; left: 0; display: -webkit-inline-flex; display: -moz-inline-flex; display: -ms-inline-flex; display: -o-inline-flex; display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #ad1514; color: #fff; font-size: 20px; text-align: center; z-index: 1; cursor: default; } curfew .curfew .header,[riot-tag="curfew"] .curfew .header,[data-is="curfew"] .curfew .header,curfew .curfew .footer,[riot-tag="curfew"] .curfew .footer,[data-is="curfew"] .curfew .footer{ position: absolute; left: 0; width: 100%; color: rgba(255, 255, 255, 0.7); font-size: 11px; } curfew .curfew .header .icon,[riot-tag="curfew"] .curfew .header .icon,[data-is="curfew"] .curfew .header .icon,curfew .curfew .footer .icon,[riot-tag="curfew"] .curfew .footer .icon,[data-is="curfew"] .curfew .footer .icon{ margin: 0 4px; } curfew .curfew .header,[riot-tag="curfew"] .curfew .header,[data-is="curfew"] .curfew .header{ top: 5px; } curfew .curfew .header .left,[riot-tag="curfew"] .curfew .header .left,[data-is="curfew"] .curfew .header .left{ position: absolute; left: 10px; } curfew .curfew .header .right,[riot-tag="curfew"] .curfew .header .right,[data-is="curfew"] .curfew .header .right{ position: absolute; right: 10px; } curfew .curfew .footer,[riot-tag="curfew"] .curfew .footer,[data-is="curfew"] .curfew .footer{ bottom: 5px; } curfew .curfew .footer .center,[riot-tag="curfew"] .curfew .footer .center,[data-is="curfew"] .curfew .footer .center{ margin: 0 auto; }', '', function (opts) {
	    var Lockr = __webpack_require__(21);
	    var anime = __webpack_require__(7);
	    var utils = __webpack_require__(9);
	    var d = new Date();
	    var now = {
	        year: d.getFullYear(),
	        month: d.getMonth() + 1,
	        date: d.getDate(),
	        formated: function formated() {
	            return this.year + '-' + utils.zero(this.month) + '-' + utils.zero(this.date);
	        }
	    };
	    var self = this;
	
	    if ('ontouchstart' in window) {
	        var checked = Lockr.get('curfew');
	        if (checked === now.formated()) {
	            self.isShow = false;
	        } else {
	            self.isShow = true;
	        }
	    } else {
	        self.isShow = false;
	    }
	
	    this.on('mount', function () {
	        if (this.isShow) {
	            var $elem = document.getElementById('curfew');
	            // FirstClickの判定フラグ
	            var clicked = false;
	            // $elemのクリックイベント
	            $elem.addEventListener('touchstart', function (e) {
	                e.preventDefault();
	
	                // フラグが立っていたらDblclick
	                if (clicked) {
	                    clicked = false;
	                    Lockr.set('curfew', now.formated());
	                    anime({
	                        targets: $elem,
	                        delay: 300,
	                        duration: 500,
	                        easing: 'easeOutCirc',
	                        scale: 0.6,
	                        opacity: 0,
	                        complete: function complete() {
	                            $elem.style.display = 'none';
	                        }
	                    });
	                    return;
	                }
	
	                // フラグを登録
	                clicked = true;
	                // 時間経過後でフラグが立ったままならSglclick
	                setTimeout(function () {
	                    if (clicked) {
	                        anime({
	                            targets: $elem,
	                            duration: 500,
	                            easing: 'easeOutCirc',
	                            scale: 1.4,
	                            opacity: 0,
	                            complete: function complete() {
	                                $elem.style.display = 'none';
	                            }
	                        });
	                    }
	                    clicked = false;
	                }, 300);
	            });
	        }
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	(function(root, factory) {
	
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = factory(root, exports);
	    }
	  } else if (typeof define === 'function' && define.amd) {
	    define(['exports'], function(exports) {
	      root.Lockr = factory(root, exports);
	    });
	  } else {
	    root.Lockr = factory(root, {});
	  }
	
	}(this, function(root, Lockr) {
	  'use strict';
	
	  if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(elt /*, from*/)
	    {
	      var len = this.length >>> 0;
	
	      var from = Number(arguments[1]) || 0;
	      from = (from < 0)
	      ? Math.ceil(from)
	      : Math.floor(from);
	      if (from < 0)
	        from += len;
	
	      for (; from < len; from++)
	      {
	        if (from in this &&
	            this[from] === elt)
	          return from;
	      }
	      return -1;
	    };
	  }
	
	  Lockr.prefix = "";
	
	  Lockr._getPrefixedKey = function(key, options) {
	    options = options || {};
	
	    if (options.noPrefix) {
	      return key;
	    } else {
	      return this.prefix + key;
	    }
	
	  };
	
	  Lockr.set = function (key, value, options) {
	    var query_key = this._getPrefixedKey(key, options);
	
	    try {
	      localStorage.setItem(query_key, JSON.stringify({"data": value}));
	    } catch (e) {
	      if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
	    }
	  };
	
	  Lockr.get = function (key, missing, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        value;
	
	    try {
	      value = JSON.parse(localStorage.getItem(query_key));
	    } catch (e) {
	        try {
	            if(localStorage[query_key]) {
	                value = JSON.parse('{"data":"' + localStorage.getItem(query_key) + '"}');
	            } else{
	                value = null;
	            }
	        } catch (e) {
	            if (console) console.warn("Lockr could not load the item with key " + key);
	        }
	    }
	    if(value === null) {
	      return missing;
	    } else if (typeof value.data !== 'undefined') {
	      return value.data;
	    } else {
	      return missing;
	    }
	  };
	
	  Lockr.sadd = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        json;
	
	    var values = Lockr.smembers(key);
	
	    if (values.indexOf(value) > -1) {
	      return null;
	    }
	
	    try {
	      values.push(value);
	      json = JSON.stringify({"data": values});
	      localStorage.setItem(query_key, json);
	    } catch (e) {
	      console.log(e);
	      if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
	    }
	  };
	
	  Lockr.smembers = function(key, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        value;
	
	    try {
	      value = JSON.parse(localStorage.getItem(query_key));
	    } catch (e) {
	      value = null;
	    }
	
	    if (value === null)
	      return [];
	    else
	      return (value.data || []);
	  };
	
	  Lockr.sismember = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options);
	
	    return Lockr.smembers(key).indexOf(value) > -1;
	  };
	
	  Lockr.getAll = function () {
	    var keys = Object.keys(localStorage);
	
	    return keys.map(function (key) {
	      return Lockr.get(key);
	    });
	  };
	
	  Lockr.srem = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        json,
	        index;
	
	    var values = Lockr.smembers(key, value);
	
	    index = values.indexOf(value);
	
	    if (index > -1)
	      values.splice(index, 1);
	
	    json = JSON.stringify({"data": values});
	
	    try {
	      localStorage.setItem(query_key, json);
	    } catch (e) {
	      if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
	    }
	  };
	
	  Lockr.rm =  function (key) {
	    localStorage.removeItem(key);
	  };
	
	  Lockr.flush = function () {
	    localStorage.clear();
	  };
	  return Lockr;
	
	}));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('archive', '<div id="blur"> <navbar></navbar> <btn href="#" text="今月の献立"></btn> <menu-list year="{year}" month="{month}"></menu-list> <footer-nav></footer-nav> <credit></credit> </div> <menu-popup></menu-popup>', '', '', function (opts) {
	  this.year = opts.year;
	  this.month = opts.month;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('search', '<div id="blur"> <navbar></navbar> <btn href="#" text="今月の献立"></btn> <menu-list year="{opts.year}" month="{opts.month}" word="{opts.word}"></menu-list> <footer-nav></footer-nav> <credit></credit> </div> <menu-popup></menu-popup>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjhiZmQ2NjQ4ZjdkMzViYTY5NjMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yaW90L3Jpb3QuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL2NvbW1vbi9uYXZiYXIudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY29tbW9uL2NyZWRpdC50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vdXRpbHMudGFnIiwid2VicGFjazovLy8uL34vYW5pbWVqcy9hbmltZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL21lbnUtbGlzdC50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvYXBpLmpzIiwid2VicGFjazovLy8uL34vc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvbWVudS1wb3B1cC50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vZm9vdGVyLW5hdi50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9ob21lLnRhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL25leHQudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY3VyZmV3LnRhZyIsIndlYnBhY2s6Ly8vLi9+L2xvY2tyL2xvY2tyLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvYXJjaGl2ZS50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9zZWFyY2gudGFnIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9icyIsInJpb3QiLCJvYnNlcnZhYmxlIiwicm91dGVyIiwicmVxdWlyZSIsInN0YXJ0Iiwicm91dGUiLCJtb3VudCIsInllYXIiLCJtb250aCIsIndvcmQiLCJtb2R1bGUiLCJleHBvcnRzIiwidGFnMiIsIm9wdHMiLCJhbmltZSIsIm9uQ2xpY2siLCJzY3JvbGxlciIsInRhcmdldCIsImR1cmF0aW9uIiwib2Zmc2V0IiwiY2FsbGJhY2siLCIkdGFyZ2V0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBvcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsInBhZ2VZIiwicGFnZVlPZmZzZXQiLCJwYWdlWCIsInBhZ2VYT2Zmc2V0IiwiZWFzaW5nIiwidXBkYXRlIiwic3RlcCIsImNvbnNvbGUiLCJsb2ciLCJjdXJyZW50VGltZSIsImVuZGVkIiwicHJvZ3Jlc3MiLCJzY3JvbGxUbyIsImhyZWYiLCJsb2NhdGlvbiIsInUiLCJhcGkiLCJzZWxmIiwiZGF0ZSIsIm9wZW5Qb3B1cCIsIml0ZW0iLCJpc1RvZGF5IiwiZSIsInRyaWdnZXIiLCJnZXQiLCJ0aGVuIiwiZGF0YSIsIm1lbnUiLCJpdGVtcyIsImQiLCJEYXRlIiwiemVybyIsIm51bSIsImx2Iiwic2xpY2UiLCJub3ciLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiTWF0aCIsImZsb29yIiwid2Vla19lbiIsIndlZWtfamEiLCJ3ZWVrIiwibGFuZyIsImZvcm1hdCIsImdldERheSIsIm9wdHNfZGF0ZSIsImdldERhdGUiLCJsYXN0RGF0ZSIsInJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInVybCIsImVuZCIsImVyciIsInJlcyIsImJvZHkiLCJhcmNoaXZlIiwiaXNPcGVuIiwiY2xvc2UiLCJ0YXJnZXRzIiwiZGVsYXkiLCJ0cmFuc2xhdGVZIiwib3BhY2l0eSIsInN0eWxlIiwiV2Via2l0RmlsdGVyIiwiY29tcGxldGUiLCJvbiIsIiRlbGUiLCJ0cmFuc2Zvcm0iLCJhcmNoaXZlQ291bnQiLCJjb3VudCIsImNhbGVuZGFyIiwiJGxpc3QiLCJpc0FyY2hpdmVPcGVuIiwidG9nZ2xlQXJjaGl2ZUxpc3QiLCJoZWlnaHQiLCJzY3JvbGxlck9wdHMiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJnZXRUb2RheSIsImkiLCJsZW4iLCJsZW5ndGgiLCJnZXRJdGVtIiwidGltZUlkIiwidG9kYXkiLCJzdGF0dXMiLCJtYWluIiwibV9tYWluIiwic3BsaXQiLCJzaWRlcyIsIm1fc2lkZSIsImxfbWFpbiIsImxfc2lkZSIsImRfbWFpbiIsImRfc2lkZSIsImdldFRpbWUiLCJpZCIsImxhYmVsIiwidGltZSIsImxvYWRpbmciLCJMb2NrciIsInV0aWxzIiwiZm9ybWF0ZWQiLCJjaGVja2VkIiwiaXNTaG93IiwiJGVsZW0iLCJjbGlja2VkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXZlbnREZWZhdWx0Iiwic2V0Iiwic2NhbGUiLCJkaXNwbGF5Iiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7O0FBRUE7O0FBQ0FBLFFBQU9DLEdBQVAsR0FBYUMsS0FBS0MsVUFBTCxFQUFiOztBQUVBLEtBQU1DLFNBQVMs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OztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLGFBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUyxzQkFBc0IsV0FBVyxZQUFZOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNEY7QUFDNUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FB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QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhCQUE2QixlQUFlO0FBQzVDO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsNEJBQTJCLGVBQWU7O0FBRTFDO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7Ozs7QUN2S0QxSSxNQUFLWSxJQUFMLENBQVUsU0FBVixFQUFxQix3TUFBckIsRUFBK04sRUFBL04sRUFBbU8sRUFBbk8sRUFBdU8sVUFBU0MsSUFBVCxFQUFlO0FBQ3RQLFFBQUtOLElBQUwsR0FBWU0sS0FBS04sSUFBakI7QUFDQSxRQUFLQyxLQUFMLEdBQWFLLEtBQUtMLEtBQWxCO0FBQ0MsRUFIRCxFOzs7Ozs7Ozs7QUNBQVIsTUFBS1ksSUFBTCxDQUFVLFFBQVYsRUFBb0IscU9BQXBCLEVBQTJQLEVBQTNQLEVBQStQLEVBQS9QLEVBQW1RLFVBQVNDLElBQVQsRUFBZSxDQUNqUixDQURELEUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2RvY3MvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjhiZmQ2NjQ4ZjdkMzViYTY5NjMiLCIndXNlIHN0cmljdCdcblxuLy8gT2JzZXJ2YWJsZVxud2luZG93Lm9icyA9IHJpb3Qub2JzZXJ2YWJsZSgpO1xuXG5jb25zdCByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xucm91dGVyLnN0YXJ0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvZW50cnkuanMiLCIvKiBSaW90IHYyLjYuNSwgQGxpY2Vuc2UgTUlUICovXG5cbjsoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xudmFyIHJpb3QgPSB7IHZlcnNpb246ICd2Mi42LjUnLCBzZXR0aW5nczoge30gfSxcbiAgLy8gYmUgYXdhcmUsIGludGVybmFsIHVzYWdlXG4gIC8vIEFUVEVOVElPTjogcHJlZml4IHRoZSBnbG9iYWwgZHluYW1pYyB2YXJpYWJsZXMgd2l0aCBgX19gXG5cbiAgLy8gY291bnRlciB0byBnaXZlIGEgdW5pcXVlIGlkIHRvIGFsbCB0aGUgVGFnIGluc3RhbmNlc1xuICBfX3VpZCA9IDAsXG4gIC8vIHRhZ3MgaW5zdGFuY2VzIGNhY2hlXG4gIF9fdmlydHVhbERvbSA9IFtdLFxuICAvLyB0YWdzIGltcGxlbWVudGF0aW9uIGNhY2hlXG4gIF9fdGFnSW1wbCA9IHt9LFxuXG4gIC8qKlxuICAgKiBDb25zdFxuICAgKi9cbiAgR0xPQkFMX01JWElOID0gJ19fZ2xvYmFsX21peGluJyxcblxuICAvLyByaW90IHNwZWNpZmljIHByZWZpeGVzXG4gIFJJT1RfUFJFRklYID0gJ3Jpb3QtJyxcbiAgUklPVF9UQUcgPSBSSU9UX1BSRUZJWCArICd0YWcnLFxuICBSSU9UX1RBR19JUyA9ICdkYXRhLWlzJyxcblxuICAvLyBmb3IgdHlwZW9mID09ICcnIGNvbXBhcmlzb25zXG4gIFRfU1RSSU5HID0gJ3N0cmluZycsXG4gIFRfT0JKRUNUID0gJ29iamVjdCcsXG4gIFRfVU5ERUYgID0gJ3VuZGVmaW5lZCcsXG4gIFRfRlVOQ1RJT04gPSAnZnVuY3Rpb24nLFxuICBYTElOS19OUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyxcbiAgWExJTktfUkVHRVggPSAvXnhsaW5rOihcXHcrKS8sXG4gIC8vIHNwZWNpYWwgbmF0aXZlIHRhZ3MgdGhhdCBjYW5ub3QgYmUgdHJlYXRlZCBsaWtlIHRoZSBvdGhlcnNcbiAgU1BFQ0lBTF9UQUdTX1JFR0VYID0gL14oPzp0KD86Ym9keXxoZWFkfGZvb3R8W3JoZF0pfGNhcHRpb258Y29sKD86Z3JvdXApP3xvcHQoPzppb258Z3JvdXApKSQvLFxuICBSRVNFUlZFRF9XT1JEU19CTEFDS0xJU1QgPSAvXig/Ol8oPzppdGVtfGlkfHBhcmVudCl8dXBkYXRlfHJvb3R8KD86dW4pP21vdW50fG1peGlufGlzKD86TW91bnRlZHxMb29wKXx0YWdzfHBhcmVudHxvcHRzfHRyaWdnZXJ8byg/Om58ZmZ8bmUpKSQvLFxuICAvLyBTVkcgdGFncyBsaXN0IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvYXR0aW5kZXguaHRtbCNQcmVzZW50YXRpb25BdHRyaWJ1dGVzXG4gIFNWR19UQUdTX0xJU1QgPSBbJ2FsdEdseXBoJywgJ2FuaW1hdGUnLCAnYW5pbWF0ZUNvbG9yJywgJ2NpcmNsZScsICdjbGlwUGF0aCcsICdkZWZzJywgJ2VsbGlwc2UnLCAnZmVCbGVuZCcsICdmZUNvbG9yTWF0cml4JywgJ2ZlQ29tcG9uZW50VHJhbnNmZXInLCAnZmVDb21wb3NpdGUnLCAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsICdmZURpc3BsYWNlbWVudE1hcCcsICdmZUZsb29kJywgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1vcnBob2xvZ3knLCAnZmVPZmZzZXQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJywgJ2ZlVGlsZScsICdmZVR1cmJ1bGVuY2UnLCAnZmlsdGVyJywgJ2ZvbnQnLCAnZm9yZWlnbk9iamVjdCcsICdnJywgJ2dseXBoJywgJ2dseXBoUmVmJywgJ2ltYWdlJywgJ2xpbmUnLCAnbGluZWFyR3JhZGllbnQnLCAnbWFya2VyJywgJ21hc2snLCAnbWlzc2luZy1nbHlwaCcsICdwYXRoJywgJ3BhdHRlcm4nLCAncG9seWdvbicsICdwb2x5bGluZScsICdyYWRpYWxHcmFkaWVudCcsICdyZWN0JywgJ3N0b3AnLCAnc3ZnJywgJ3N3aXRjaCcsICdzeW1ib2wnLCAndGV4dCcsICd0ZXh0UGF0aCcsICd0cmVmJywgJ3RzcGFuJywgJ3VzZSddLFxuXG4gIC8vIHZlcnNpb24jIGZvciBJRSA4LTExLCAwIGZvciBvdGhlcnNcbiAgSUVfVkVSU0lPTiA9ICh3aW5kb3cgJiYgd2luZG93LmRvY3VtZW50IHx8IHt9KS5kb2N1bWVudE1vZGUgfCAwLFxuXG4gIC8vIGRldGVjdCBmaXJlZm94IHRvIGZpeCAjMTM3NFxuICBGSVJFRk9YID0gd2luZG93ICYmICEhd2luZG93Lkluc3RhbGxUcmlnZ2VyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xucmlvdC5vYnNlcnZhYmxlID0gZnVuY3Rpb24oZWwpIHtcblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgY3JlYXRlIGEgbmV3IGVtcHR5IG9uZVxuICAgKiBAdHlwZSB7IE9iamVjdCB9XG4gICAqL1xuXG4gIGVsID0gZWwgfHwge31cblxuICAvKipcbiAgICogUHJpdmF0ZSB2YXJpYWJsZXNcbiAgICovXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIE1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiBuZWVkZWQgdG8gZ2V0IGFuZCBsb29wIGFsbCB0aGUgZXZlbnRzIGluIGEgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBlIC0gZXZlbnQgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gICBmbiAtIGNhbGxiYWNrXG4gICAqL1xuICBmdW5jdGlvbiBvbkVhY2hFdmVudChlLCBmbikge1xuICAgIHZhciBlcyA9IGUuc3BsaXQoJyAnKSwgbCA9IGVzLmxlbmd0aCwgaSA9IDBcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBlc1tpXVxuICAgICAgaWYgKG5hbWUpIGZuKG5hbWUsIGkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBcGlcbiAgICovXG5cbiAgLy8gZXh0ZW5kIHRoZSBlbCBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgZWFjaCB0aW1lIGFuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcGFyYW0gIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG4gICAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgbGlzdGVuZXJzXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb2ZmOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAoZXZlbnRzID09ICcqJyAmJiAhZm4pIGNhbGxiYWNrcyA9IHt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG4gICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IGNiID0gYXJyICYmIGFycltpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNiID09IGZuKSBhcnIuc3BsaWNlKGktLSwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGRlbGV0ZSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG9cbiAgICAgKiB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2BcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgdHJpZ2dlcjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cykge1xuXG4gICAgICAgIC8vIGdldHRpbmcgdGhlIGFyZ3VtZW50c1xuICAgICAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmdsZW4pLFxuICAgICAgICAgIGZuc1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJnbGVuOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXSAvLyBza2lwIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuXG4gICAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbbmFtZV0gfHwgW10sIDApXG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgZm47IGZuID0gZm5zW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChmbi5idXN5KSBjb250aW51ZVxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuOyhmdW5jdGlvbihyaW90KSB7XG5cbi8qKlxuICogU2ltcGxlIGNsaWVudC1zaWRlIHJvdXRlclxuICogQG1vZHVsZSByaW90LXJvdXRlXG4gKi9cblxuXG52YXIgUkVfT1JJR0lOID0gL14uKz9cXC9cXC8rW15cXC9dKy8sXG4gIEVWRU5UX0xJU1RFTkVSID0gJ0V2ZW50TGlzdGVuZXInLFxuICBSRU1PVkVfRVZFTlRfTElTVEVORVIgPSAncmVtb3ZlJyArIEVWRU5UX0xJU1RFTkVSLFxuICBBRERfRVZFTlRfTElTVEVORVIgPSAnYWRkJyArIEVWRU5UX0xJU1RFTkVSLFxuICBIQVNfQVRUUklCVVRFID0gJ2hhc0F0dHJpYnV0ZScsXG4gIFJFUExBQ0UgPSAncmVwbGFjZScsXG4gIFBPUFNUQVRFID0gJ3BvcHN0YXRlJyxcbiAgSEFTSENIQU5HRSA9ICdoYXNoY2hhbmdlJyxcbiAgVFJJR0dFUiA9ICd0cmlnZ2VyJyxcbiAgTUFYX0VNSVRfU1RBQ0tfTEVWRUwgPSAzLFxuICB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdyxcbiAgZG9jID0gdHlwZW9mIGRvY3VtZW50ICE9ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LFxuICBoaXN0ID0gd2luICYmIGhpc3RvcnksXG4gIGxvYyA9IHdpbiAmJiAoaGlzdC5sb2NhdGlvbiB8fCB3aW4ubG9jYXRpb24pLCAvLyBzZWUgaHRtbDUtaGlzdG9yeS1hcGlcbiAgcHJvdCA9IFJvdXRlci5wcm90b3R5cGUsIC8vIHRvIG1pbmlmeSBtb3JlXG4gIGNsaWNrRXZlbnQgPSBkb2MgJiYgZG9jLm9udG91Y2hzdGFydCA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsXG4gIHN0YXJ0ZWQgPSBmYWxzZSxcbiAgY2VudHJhbCA9IHJpb3Qub2JzZXJ2YWJsZSgpLFxuICByb3V0ZUZvdW5kID0gZmFsc2UsXG4gIGRlYm91bmNlZEVtaXQsXG4gIGJhc2UsIGN1cnJlbnQsIHBhcnNlciwgc2Vjb25kUGFyc2VyLCBlbWl0U3RhY2sgPSBbXSwgZW1pdFN0YWNrTGV2ZWwgPSAwXG5cbi8qKlxuICogRGVmYXVsdCBwYXJzZXIuIFlvdSBjYW4gcmVwbGFjZSBpdCB2aWEgcm91dGVyLnBhcnNlciBtZXRob2QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGN1cnJlbnQgcGF0aCAobm9ybWFsaXplZClcbiAqIEByZXR1cm5zIHthcnJheX0gYXJyYXlcbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9QQVJTRVIocGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdCgvWy8/I10vKVxufVxuXG4vKipcbiAqIERlZmF1bHQgcGFyc2VyIChzZWNvbmQpLiBZb3UgY2FuIHJlcGxhY2UgaXQgdmlhIHJvdXRlci5wYXJzZXIgbWV0aG9kLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBjdXJyZW50IHBhdGggKG5vcm1hbGl6ZWQpXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsdGVyIC0gZmlsdGVyIHN0cmluZyAobm9ybWFsaXplZClcbiAqIEByZXR1cm5zIHthcnJheX0gYXJyYXlcbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9TRUNPTkRfUEFSU0VSKHBhdGgsIGZpbHRlcikge1xuICB2YXIgcmUgPSBuZXcgUmVnRXhwKCdeJyArIGZpbHRlcltSRVBMQUNFXSgvXFwqL2csICcoW14vPyNdKz8pJylbUkVQTEFDRV0oL1xcLlxcLi8sICcuKicpICsgJyQnKSxcbiAgICBhcmdzID0gcGF0aC5tYXRjaChyZSlcblxuICBpZiAoYXJncykgcmV0dXJuIGFyZ3Muc2xpY2UoMSlcbn1cblxuLyoqXG4gKiBTaW1wbGUvY2hlYXAgZGVib3VuY2UgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHtmdW5jdGlvbn0gZm4gLSBjYWxsYmFja1xuICogQHBhcmFtICAge251bWJlcn0gZGVsYXkgLSBkZWxheSBpbiBzZWNvbmRzXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcbiAgdmFyIHRcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhclRpbWVvdXQodClcbiAgICB0ID0gc2V0VGltZW91dChmbiwgZGVsYXkpXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIHdpbmRvdyBsaXN0ZW5lcnMgdG8gdHJpZ2dlciB0aGUgcm91dGVzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9FeGVjIC0gc2VlIHJvdXRlLnN0YXJ0XG4gKi9cbmZ1bmN0aW9uIHN0YXJ0KGF1dG9FeGVjKSB7XG4gIGRlYm91bmNlZEVtaXQgPSBkZWJvdW5jZShlbWl0LCAxKVxuICB3aW5bQUREX0VWRU5UX0xJU1RFTkVSXShQT1BTVEFURSwgZGVib3VuY2VkRW1pdClcbiAgd2luW0FERF9FVkVOVF9MSVNURU5FUl0oSEFTSENIQU5HRSwgZGVib3VuY2VkRW1pdClcbiAgZG9jW0FERF9FVkVOVF9MSVNURU5FUl0oY2xpY2tFdmVudCwgY2xpY2spXG4gIGlmIChhdXRvRXhlYykgZW1pdCh0cnVlKVxufVxuXG4vKipcbiAqIFJvdXRlciBjbGFzc1xuICovXG5mdW5jdGlvbiBSb3V0ZXIoKSB7XG4gIHRoaXMuJCA9IFtdXG4gIHJpb3Qub2JzZXJ2YWJsZSh0aGlzKSAvLyBtYWtlIGl0IG9ic2VydmFibGVcbiAgY2VudHJhbC5vbignc3RvcCcsIHRoaXMucy5iaW5kKHRoaXMpKVxuICBjZW50cmFsLm9uKCdlbWl0JywgdGhpcy5lLmJpbmQodGhpcykpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShwYXRoKSB7XG4gIHJldHVybiBwYXRoW1JFUExBQ0VdKC9eXFwvfFxcLyQvLCAnJylcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmcoc3RyKSB7XG4gIHJldHVybiB0eXBlb2Ygc3RyID09ICdzdHJpbmcnXG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXJ0IGFmdGVyIGRvbWFpbiBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gaHJlZiAtIGZ1bGxwYXRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwYXRoIGZyb20gcm9vdFxuICovXG5mdW5jdGlvbiBnZXRQYXRoRnJvbVJvb3QoaHJlZikge1xuICByZXR1cm4gKGhyZWYgfHwgbG9jLmhyZWYpW1JFUExBQ0VdKFJFX09SSUdJTiwgJycpXG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXJ0IGFmdGVyIGJhc2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBocmVmIC0gZnVsbHBhdGhcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHBhdGggZnJvbSBiYXNlXG4gKi9cbmZ1bmN0aW9uIGdldFBhdGhGcm9tQmFzZShocmVmKSB7XG4gIHJldHVybiBiYXNlWzBdID09ICcjJ1xuICAgID8gKGhyZWYgfHwgbG9jLmhyZWYgfHwgJycpLnNwbGl0KGJhc2UpWzFdIHx8ICcnXG4gICAgOiAobG9jID8gZ2V0UGF0aEZyb21Sb290KGhyZWYpIDogaHJlZiB8fCAnJylbUkVQTEFDRV0oYmFzZSwgJycpXG59XG5cbmZ1bmN0aW9uIGVtaXQoZm9yY2UpIHtcbiAgLy8gdGhlIHN0YWNrIGlzIG5lZWRlZCBmb3IgcmVkaXJlY3Rpb25zXG4gIHZhciBpc1Jvb3QgPSBlbWl0U3RhY2tMZXZlbCA9PSAwLCBmaXJzdFxuICBpZiAoTUFYX0VNSVRfU1RBQ0tfTEVWRUwgPD0gZW1pdFN0YWNrTGV2ZWwpIHJldHVyblxuXG4gIGVtaXRTdGFja0xldmVsKytcbiAgZW1pdFN0YWNrLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGggPSBnZXRQYXRoRnJvbUJhc2UoKVxuICAgIGlmIChmb3JjZSB8fCBwYXRoICE9IGN1cnJlbnQpIHtcbiAgICAgIGNlbnRyYWxbVFJJR0dFUl0oJ2VtaXQnLCBwYXRoKVxuICAgICAgY3VycmVudCA9IHBhdGhcbiAgICB9XG4gIH0pXG4gIGlmIChpc1Jvb3QpIHtcbiAgICB3aGlsZSAoZmlyc3QgPSBlbWl0U3RhY2suc2hpZnQoKSkgZmlyc3QoKSAvLyBzdGFjayBpbmNyZXNlcyB3aXRoaW4gdGhpcyBjYWxsXG4gICAgZW1pdFN0YWNrTGV2ZWwgPSAwXG4gIH1cbn1cblxuZnVuY3Rpb24gY2xpY2soZSkge1xuICBpZiAoXG4gICAgZS53aGljaCAhPSAxIC8vIG5vdCBsZWZ0IGNsaWNrXG4gICAgfHwgZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5IC8vIG9yIG1ldGEga2V5c1xuICAgIHx8IGUuZGVmYXVsdFByZXZlbnRlZCAvLyBvciBkZWZhdWx0IHByZXZlbnRlZFxuICApIHJldHVyblxuXG4gIHZhciBlbCA9IGUudGFyZ2V0XG4gIHdoaWxlIChlbCAmJiBlbC5ub2RlTmFtZSAhPSAnQScpIGVsID0gZWwucGFyZW50Tm9kZVxuXG4gIGlmIChcbiAgICAhZWwgfHwgZWwubm9kZU5hbWUgIT0gJ0EnIC8vIG5vdCBBIHRhZ1xuICAgIHx8IGVsW0hBU19BVFRSSUJVVEVdKCdkb3dubG9hZCcpIC8vIGhhcyBkb3dubG9hZCBhdHRyXG4gICAgfHwgIWVsW0hBU19BVFRSSUJVVEVdKCdocmVmJykgLy8gaGFzIG5vIGhyZWYgYXR0clxuICAgIHx8IGVsLnRhcmdldCAmJiBlbC50YXJnZXQgIT0gJ19zZWxmJyAvLyBhbm90aGVyIHdpbmRvdyBvciBmcmFtZVxuICAgIHx8IGVsLmhyZWYuaW5kZXhPZihsb2MuaHJlZi5tYXRjaChSRV9PUklHSU4pWzBdKSA9PSAtMSAvLyBjcm9zcyBvcmlnaW5cbiAgKSByZXR1cm5cblxuICBpZiAoZWwuaHJlZiAhPSBsb2MuaHJlZlxuICAgICYmIChcbiAgICAgIGVsLmhyZWYuc3BsaXQoJyMnKVswXSA9PSBsb2MuaHJlZi5zcGxpdCgnIycpWzBdIC8vIGludGVybmFsIGp1bXBcbiAgICAgIHx8IGJhc2VbMF0gIT0gJyMnICYmIGdldFBhdGhGcm9tUm9vdChlbC5ocmVmKS5pbmRleE9mKGJhc2UpICE9PSAwIC8vIG91dHNpZGUgb2YgYmFzZVxuICAgICAgfHwgYmFzZVswXSA9PSAnIycgJiYgZWwuaHJlZi5zcGxpdChiYXNlKVswXSAhPSBsb2MuaHJlZi5zcGxpdChiYXNlKVswXSAvLyBvdXRzaWRlIG9mICNiYXNlXG4gICAgICB8fCAhZ28oZ2V0UGF0aEZyb21CYXNlKGVsLmhyZWYpLCBlbC50aXRsZSB8fCBkb2MudGl0bGUpIC8vIHJvdXRlIG5vdCBmb3VuZFxuICAgICkpIHJldHVyblxuXG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG4vKipcbiAqIEdvIHRvIHRoZSBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGRlc3RpbmF0aW9uIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHBhZ2UgdGl0bGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvdWxkUmVwbGFjZSAtIHVzZSByZXBsYWNlU3RhdGUgb3IgcHVzaFN0YXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSByb3V0ZSBub3QgZm91bmQgZmxhZ1xuICovXG5mdW5jdGlvbiBnbyhwYXRoLCB0aXRsZSwgc2hvdWxkUmVwbGFjZSkge1xuICAvLyBTZXJ2ZXItc2lkZSB1c2FnZTogZGlyZWN0bHkgZXhlY3V0ZSBoYW5kbGVycyBmb3IgdGhlIHBhdGhcbiAgaWYgKCFoaXN0KSByZXR1cm4gY2VudHJhbFtUUklHR0VSXSgnZW1pdCcsIGdldFBhdGhGcm9tQmFzZShwYXRoKSlcblxuICBwYXRoID0gYmFzZSArIG5vcm1hbGl6ZShwYXRoKVxuICB0aXRsZSA9IHRpdGxlIHx8IGRvYy50aXRsZVxuICAvLyBicm93c2VycyBpZ25vcmVzIHRoZSBzZWNvbmQgcGFyYW1ldGVyIGB0aXRsZWBcbiAgc2hvdWxkUmVwbGFjZVxuICAgID8gaGlzdC5yZXBsYWNlU3RhdGUobnVsbCwgdGl0bGUsIHBhdGgpXG4gICAgOiBoaXN0LnB1c2hTdGF0ZShudWxsLCB0aXRsZSwgcGF0aClcbiAgLy8gc28gd2UgbmVlZCB0byBzZXQgaXQgbWFudWFsbHlcbiAgZG9jLnRpdGxlID0gdGl0bGVcbiAgcm91dGVGb3VuZCA9IGZhbHNlXG4gIGVtaXQoKVxuICByZXR1cm4gcm91dGVGb3VuZFxufVxuXG4vKipcbiAqIEdvIHRvIHBhdGggb3Igc2V0IGFjdGlvblxuICogYSBzaW5nbGUgc3RyaW5nOiAgICAgICAgICAgICAgICBnbyB0aGVyZVxuICogdHdvIHN0cmluZ3M6ICAgICAgICAgICAgICAgICAgICBnbyB0aGVyZSB3aXRoIHNldHRpbmcgYSB0aXRsZVxuICogdHdvIHN0cmluZ3MgYW5kIGJvb2xlYW46ICAgICAgICByZXBsYWNlIGhpc3Rvcnkgd2l0aCBzZXR0aW5nIGEgdGl0bGVcbiAqIGEgc2luZ2xlIGZ1bmN0aW9uOiAgICAgICAgICAgICAgc2V0IGFuIGFjdGlvbiBvbiB0aGUgZGVmYXVsdCByb3V0ZVxuICogYSBzdHJpbmcvUmVnRXhwIGFuZCBhIGZ1bmN0aW9uOiBzZXQgYW4gYWN0aW9uIG9uIHRoZSByb3V0ZVxuICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gZmlyc3QgLSBwYXRoIC8gYWN0aW9uIC8gZmlsdGVyXG4gKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKX0gc2Vjb25kIC0gdGl0bGUgLyBhY3Rpb25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdGhpcmQgLSByZXBsYWNlIGZsYWdcbiAqL1xucHJvdC5tID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCwgdGhpcmQpIHtcbiAgaWYgKGlzU3RyaW5nKGZpcnN0KSAmJiAoIXNlY29uZCB8fCBpc1N0cmluZyhzZWNvbmQpKSkgZ28oZmlyc3QsIHNlY29uZCwgdGhpcmQgfHwgZmFsc2UpXG4gIGVsc2UgaWYgKHNlY29uZCkgdGhpcy5yKGZpcnN0LCBzZWNvbmQpXG4gIGVsc2UgdGhpcy5yKCdAJywgZmlyc3QpXG59XG5cbi8qKlxuICogU3RvcCByb3V0aW5nXG4gKi9cbnByb3QucyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignKicpXG4gIHRoaXMuJCA9IFtdXG59XG5cbi8qKlxuICogRW1pdFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBwYXRoXG4gKi9cbnByb3QuZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdGhpcy4kLmNvbmNhdCgnQCcpLnNvbWUoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFyZ3MgPSAoZmlsdGVyID09ICdAJyA/IHBhcnNlciA6IHNlY29uZFBhcnNlcikobm9ybWFsaXplKHBhdGgpLCBub3JtYWxpemUoZmlsdGVyKSlcbiAgICBpZiAodHlwZW9mIGFyZ3MgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNbVFJJR0dFUl0uYXBwbHkobnVsbCwgW2ZpbHRlcl0uY29uY2F0KGFyZ3MpKVxuICAgICAgcmV0dXJuIHJvdXRlRm91bmQgPSB0cnVlIC8vIGV4aXQgZnJvbSBsb29wXG4gICAgfVxuICB9LCB0aGlzKVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIHJvdXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsdGVyIC0gZmlsdGVyIGZvciBtYXRjaGluZyB0byB1cmxcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFjdGlvbiAtIGFjdGlvbiB0byByZWdpc3RlclxuICovXG5wcm90LnIgPSBmdW5jdGlvbihmaWx0ZXIsIGFjdGlvbikge1xuICBpZiAoZmlsdGVyICE9ICdAJykge1xuICAgIGZpbHRlciA9ICcvJyArIG5vcm1hbGl6ZShmaWx0ZXIpXG4gICAgdGhpcy4kLnB1c2goZmlsdGVyKVxuICB9XG4gIHRoaXMub24oZmlsdGVyLCBhY3Rpb24pXG59XG5cbnZhciBtYWluUm91dGVyID0gbmV3IFJvdXRlcigpXG52YXIgcm91dGUgPSBtYWluUm91dGVyLm0uYmluZChtYWluUm91dGVyKVxuXG4vKipcbiAqIENyZWF0ZSBhIHN1YiByb3V0ZXJcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gdGhlIG1ldGhvZCBvZiBhIG5ldyBSb3V0ZXIgb2JqZWN0XG4gKi9cbnJvdXRlLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmV3U3ViUm91dGVyID0gbmV3IFJvdXRlcigpXG4gIC8vIGFzc2lnbiBzdWItcm91dGVyJ3MgbWFpbiBtZXRob2RcbiAgdmFyIHJvdXRlciA9IG5ld1N1YlJvdXRlci5tLmJpbmQobmV3U3ViUm91dGVyKVxuICAvLyBzdG9wIG9ubHkgdGhpcyBzdWItcm91dGVyXG4gIHJvdXRlci5zdG9wID0gbmV3U3ViUm91dGVyLnMuYmluZChuZXdTdWJSb3V0ZXIpXG4gIHJldHVybiByb3V0ZXJcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGJhc2Ugb2YgdXJsXG4gKiBAcGFyYW0geyhzdHJ8UmVnRXhwKX0gYXJnIC0gYSBuZXcgYmFzZSBvciAnIycgb3IgJyMhJ1xuICovXG5yb3V0ZS5iYXNlID0gZnVuY3Rpb24oYXJnKSB7XG4gIGJhc2UgPSBhcmcgfHwgJyMnXG4gIGN1cnJlbnQgPSBnZXRQYXRoRnJvbUJhc2UoKSAvLyByZWNhbGN1bGF0ZSBjdXJyZW50IHBhdGhcbn1cblxuLyoqIEV4ZWMgcm91dGluZyByaWdodCBub3cgKiovXG5yb3V0ZS5leGVjID0gZnVuY3Rpb24oKSB7XG4gIGVtaXQodHJ1ZSlcbn1cblxuLyoqXG4gKiBSZXBsYWNlIHRoZSBkZWZhdWx0IHJvdXRlciB0byB5b3Vyc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSB5b3VyIHBhcnNlciBmdW5jdGlvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4yIC0geW91ciBzZWNvbmRQYXJzZXIgZnVuY3Rpb25cbiAqL1xucm91dGUucGFyc2VyID0gZnVuY3Rpb24oZm4sIGZuMikge1xuICBpZiAoIWZuICYmICFmbjIpIHtcbiAgICAvLyByZXNldCBwYXJzZXIgZm9yIHRlc3RpbmcuLi5cbiAgICBwYXJzZXIgPSBERUZBVUxUX1BBUlNFUlxuICAgIHNlY29uZFBhcnNlciA9IERFRkFVTFRfU0VDT05EX1BBUlNFUlxuICB9XG4gIGlmIChmbikgcGFyc2VyID0gZm5cbiAgaWYgKGZuMikgc2Vjb25kUGFyc2VyID0gZm4yXG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdldCB1cmwgcXVlcnkgYXMgYW4gb2JqZWN0XG4gKiBAcmV0dXJucyB7b2JqZWN0fSBwYXJzZWQgcXVlcnlcbiAqL1xucm91dGUucXVlcnkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHEgPSB7fVxuICB2YXIgaHJlZiA9IGxvYy5ocmVmIHx8IGN1cnJlbnRcbiAgaHJlZltSRVBMQUNFXSgvWz8mXSguKz8pPShbXiZdKikvZywgZnVuY3Rpb24oXywgaywgdikgeyBxW2tdID0gdiB9KVxuICByZXR1cm4gcVxufVxuXG4vKiogU3RvcCByb3V0aW5nICoqL1xucm91dGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHN0YXJ0ZWQpIHtcbiAgICBpZiAod2luKSB7XG4gICAgICB3aW5bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShQT1BTVEFURSwgZGVib3VuY2VkRW1pdClcbiAgICAgIHdpbltSRU1PVkVfRVZFTlRfTElTVEVORVJdKEhBU0hDSEFOR0UsIGRlYm91bmNlZEVtaXQpXG4gICAgICBkb2NbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShjbGlja0V2ZW50LCBjbGljaylcbiAgICB9XG4gICAgY2VudHJhbFtUUklHR0VSXSgnc3RvcCcpXG4gICAgc3RhcnRlZCA9IGZhbHNlXG4gIH1cbn1cblxuLyoqXG4gKiBTdGFydCByb3V0aW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9FeGVjIC0gYXV0b21hdGljYWxseSBleGVjIGFmdGVyIHN0YXJ0aW5nIGlmIHRydWVcbiAqL1xucm91dGUuc3RhcnQgPSBmdW5jdGlvbiAoYXV0b0V4ZWMpIHtcbiAgaWYgKCFzdGFydGVkKSB7XG4gICAgaWYgKHdpbikge1xuICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykgc3RhcnQoYXV0b0V4ZWMpXG4gICAgICAvLyB0aGUgdGltZW91dCBpcyBuZWVkZWQgdG8gc29sdmVcbiAgICAgIC8vIGEgd2VpcmQgc2FmYXJpIGJ1ZyBodHRwczovL2dpdGh1Yi5jb20vcmlvdC9yb3V0ZS9pc3N1ZXMvMzNcbiAgICAgIGVsc2Ugd2luW0FERF9FVkVOVF9MSVNURU5FUl0oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhcnQoYXV0b0V4ZWMpIH0sIDEpXG4gICAgICB9KVxuICAgIH1cbiAgICBzdGFydGVkID0gdHJ1ZVxuICB9XG59XG5cbi8qKiBQcmVwYXJlIHRoZSByb3V0ZXIgKiovXG5yb3V0ZS5iYXNlKClcbnJvdXRlLnBhcnNlcigpXG5cbnJpb3Qucm91dGUgPSByb3V0ZVxufSkocmlvdClcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbi8qKlxuICogVGhlIHJpb3QgdGVtcGxhdGUgZW5naW5lXG4gKiBAdmVyc2lvbiB2Mi40LjJcbiAqL1xuLyoqXG4gKiByaW90LnV0aWwuYnJhY2tldHNcbiAqXG4gKiAtIGBicmFja2V0cyAgICBgIC0gUmV0dXJucyBhIHN0cmluZyBvciByZWdleCBiYXNlZCBvbiBpdHMgcGFyYW1ldGVyXG4gKiAtIGBicmFja2V0cy5zZXRgIC0gQ2hhbmdlIHRoZSBjdXJyZW50IHJpb3QgYnJhY2tldHNcbiAqXG4gKiBAbW9kdWxlXG4gKi9cblxudmFyIGJyYWNrZXRzID0gKGZ1bmN0aW9uIChVTkRFRikge1xuXG4gIHZhclxuICAgIFJFR0xPQiA9ICdnJyxcblxuICAgIFJfTUxDT01NUyA9IC9cXC9cXCpbXipdKlxcKisoPzpbXipcXC9dW14qXSpcXCorKSpcXC8vZyxcblxuICAgIFJfU1RSSU5HUyA9IC9cIlteXCJcXFxcXSooPzpcXFxcW1xcU1xcc11bXlwiXFxcXF0qKSpcInwnW14nXFxcXF0qKD86XFxcXFtcXFNcXHNdW14nXFxcXF0qKSonL2csXG5cbiAgICBTX1FCTE9DS1MgPSBSX1NUUklOR1Muc291cmNlICsgJ3wnICtcbiAgICAgIC8oPzpcXGJyZXR1cm5cXHMrfCg/OlskXFx3XFwpXFxdXXxcXCtcXCt8LS0pXFxzKihcXC8pKD8hWypcXC9dKSkvLnNvdXJjZSArICd8JyArXG4gICAgICAvXFwvKD89W14qXFwvXSlbXltcXC9cXFxcXSooPzooPzpcXFsoPzpcXFxcLnxbXlxcXVxcXFxdKikqXFxdfFxcXFwuKVteW1xcL1xcXFxdKikqPyhcXC8pW2dpbV0qLy5zb3VyY2UsXG5cbiAgICBVTlNVUFBPUlRFRCA9IFJlZ0V4cCgnW1xcXFwnICsgJ3gwMC1cXFxceDFGPD5hLXpBLVowLTlcXCdcIiw7XFxcXFxcXFxdJyksXG5cbiAgICBORUVEX0VTQ0FQRSA9IC8oPz1bW1xcXSgpKis/Ll4kfF0pL2csXG5cbiAgICBGSU5EQlJBQ0VTID0ge1xuICAgICAgJygnOiBSZWdFeHAoJyhbKCldKXwnICAgKyBTX1FCTE9DS1MsIFJFR0xPQiksXG4gICAgICAnWyc6IFJlZ0V4cCgnKFtbXFxcXF1dKXwnICsgU19RQkxPQ0tTLCBSRUdMT0IpLFxuICAgICAgJ3snOiBSZWdFeHAoJyhbe31dKXwnICAgKyBTX1FCTE9DS1MsIFJFR0xPQilcbiAgICB9LFxuXG4gICAgREVGQVVMVCA9ICd7IH0nXG5cbiAgdmFyIF9wYWlycyA9IFtcbiAgICAneycsICd9JyxcbiAgICAneycsICd9JyxcbiAgICAve1tefV0qfS8sXG4gICAgL1xcXFwoW3t9XSkvZyxcbiAgICAvXFxcXCh7KXx7L2csXG4gICAgUmVnRXhwKCdcXFxcXFxcXCh9KXwoW1soe10pfCh9KXwnICsgU19RQkxPQ0tTLCBSRUdMT0IpLFxuICAgIERFRkFVTFQsXG4gICAgL15cXHMqe1xcXj9cXHMqKFskXFx3XSspKD86XFxzKixcXHMqKFxcUyspKT9cXHMraW5cXHMrKFxcUy4qKVxccyp9LyxcbiAgICAvKF58W15cXFxcXSl7PVtcXFNcXHNdKj99L1xuICBdXG5cbiAgdmFyXG4gICAgY2FjaGVkQnJhY2tldHMgPSBVTkRFRixcbiAgICBfcmVnZXgsXG4gICAgX2NhY2hlID0gW10sXG4gICAgX3NldHRpbmdzXG5cbiAgZnVuY3Rpb24gX2xvb3BiYWNrIChyZSkgeyByZXR1cm4gcmUgfVxuXG4gIGZ1bmN0aW9uIF9yZXdyaXRlIChyZSwgYnApIHtcbiAgICBpZiAoIWJwKSBicCA9IF9jYWNoZVxuICAgIHJldHVybiBuZXcgUmVnRXhwKFxuICAgICAgcmUuc291cmNlLnJlcGxhY2UoL3svZywgYnBbMl0pLnJlcGxhY2UoL30vZywgYnBbM10pLCByZS5nbG9iYWwgPyBSRUdMT0IgOiAnJ1xuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGUgKHBhaXIpIHtcbiAgICBpZiAocGFpciA9PT0gREVGQVVMVCkgcmV0dXJuIF9wYWlyc1xuXG4gICAgdmFyIGFyciA9IHBhaXIuc3BsaXQoJyAnKVxuXG4gICAgaWYgKGFyci5sZW5ndGggIT09IDIgfHwgVU5TVVBQT1JURUQudGVzdChwYWlyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBicmFja2V0cyBcIicgKyBwYWlyICsgJ1wiJylcbiAgICB9XG4gICAgYXJyID0gYXJyLmNvbmNhdChwYWlyLnJlcGxhY2UoTkVFRF9FU0NBUEUsICdcXFxcJykuc3BsaXQoJyAnKSlcblxuICAgIGFycls0XSA9IF9yZXdyaXRlKGFyclsxXS5sZW5ndGggPiAxID8gL3tbXFxTXFxzXSo/fS8gOiBfcGFpcnNbNF0sIGFycilcbiAgICBhcnJbNV0gPSBfcmV3cml0ZShwYWlyLmxlbmd0aCA+IDMgPyAvXFxcXCh7fH0pL2cgOiBfcGFpcnNbNV0sIGFycilcbiAgICBhcnJbNl0gPSBfcmV3cml0ZShfcGFpcnNbNl0sIGFycilcbiAgICBhcnJbN10gPSBSZWdFeHAoJ1xcXFxcXFxcKCcgKyBhcnJbM10gKyAnKXwoW1soe10pfCgnICsgYXJyWzNdICsgJyl8JyArIFNfUUJMT0NLUywgUkVHTE9CKVxuICAgIGFycls4XSA9IHBhaXJcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICBmdW5jdGlvbiBfYnJhY2tldHMgKHJlT3JJZHgpIHtcbiAgICByZXR1cm4gcmVPcklkeCBpbnN0YW5jZW9mIFJlZ0V4cCA/IF9yZWdleChyZU9ySWR4KSA6IF9jYWNoZVtyZU9ySWR4XVxuICB9XG5cbiAgX2JyYWNrZXRzLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQgKHN0ciwgdG1wbCwgX2JwKSB7XG4gICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHQ6IF9icCBpcyBmb3IgdGhlIGNvbXBpbGVyXG4gICAgaWYgKCFfYnApIF9icCA9IF9jYWNoZVxuXG4gICAgdmFyXG4gICAgICBwYXJ0cyA9IFtdLFxuICAgICAgbWF0Y2gsXG4gICAgICBpc2V4cHIsXG4gICAgICBzdGFydCxcbiAgICAgIHBvcyxcbiAgICAgIHJlID0gX2JwWzZdXG5cbiAgICBpc2V4cHIgPSBzdGFydCA9IHJlLmxhc3RJbmRleCA9IDBcblxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpKSB7XG5cbiAgICAgIHBvcyA9IG1hdGNoLmluZGV4XG5cbiAgICAgIGlmIChpc2V4cHIpIHtcblxuICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICByZS5sYXN0SW5kZXggPSBza2lwQnJhY2VzKHN0ciwgbWF0Y2hbMl0sIHJlLmxhc3RJbmRleClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2hbM10pIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghbWF0Y2hbMV0pIHtcbiAgICAgICAgdW5lc2NhcGVTdHIoc3RyLnNsaWNlKHN0YXJ0LCBwb3MpKVxuICAgICAgICBzdGFydCA9IHJlLmxhc3RJbmRleFxuICAgICAgICByZSA9IF9icFs2ICsgKGlzZXhwciBePSAxKV1cbiAgICAgICAgcmUubGFzdEluZGV4ID0gc3RhcnRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyICYmIHN0YXJ0IDwgc3RyLmxlbmd0aCkge1xuICAgICAgdW5lc2NhcGVTdHIoc3RyLnNsaWNlKHN0YXJ0KSlcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydHNcblxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlU3RyIChzKSB7XG4gICAgICBpZiAodG1wbCB8fCBpc2V4cHIpIHtcbiAgICAgICAgcGFydHMucHVzaChzICYmIHMucmVwbGFjZShfYnBbNV0sICckMScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHMucHVzaChzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBCcmFjZXMgKHMsIGNoLCBpeCkge1xuICAgICAgdmFyXG4gICAgICAgIG1hdGNoLFxuICAgICAgICByZWNjaCA9IEZJTkRCUkFDRVNbY2hdXG5cbiAgICAgIHJlY2NoLmxhc3RJbmRleCA9IGl4XG4gICAgICBpeCA9IDFcbiAgICAgIHdoaWxlICgobWF0Y2ggPSByZWNjaC5leGVjKHMpKSkge1xuICAgICAgICBpZiAobWF0Y2hbMV0gJiZcbiAgICAgICAgICAhKG1hdGNoWzFdID09PSBjaCA/ICsraXggOiAtLWl4KSkgYnJlYWtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpeCA/IHMubGVuZ3RoIDogcmVjY2gubGFzdEluZGV4XG4gICAgfVxuICB9XG5cbiAgX2JyYWNrZXRzLmhhc0V4cHIgPSBmdW5jdGlvbiBoYXNFeHByIChzdHIpIHtcbiAgICByZXR1cm4gX2NhY2hlWzRdLnRlc3Qoc3RyKVxuICB9XG5cbiAgX2JyYWNrZXRzLmxvb3BLZXlzID0gZnVuY3Rpb24gbG9vcEtleXMgKGV4cHIpIHtcbiAgICB2YXIgbSA9IGV4cHIubWF0Y2goX2NhY2hlWzldKVxuXG4gICAgcmV0dXJuIG1cbiAgICAgID8geyBrZXk6IG1bMV0sIHBvczogbVsyXSwgdmFsOiBfY2FjaGVbMF0gKyBtWzNdLnRyaW0oKSArIF9jYWNoZVsxXSB9XG4gICAgICA6IHsgdmFsOiBleHByLnRyaW0oKSB9XG4gIH1cblxuICBfYnJhY2tldHMuYXJyYXkgPSBmdW5jdGlvbiBhcnJheSAocGFpcikge1xuICAgIHJldHVybiBwYWlyID8gX2NyZWF0ZShwYWlyKSA6IF9jYWNoZVxuICB9XG5cbiAgZnVuY3Rpb24gX3Jlc2V0IChwYWlyKSB7XG4gICAgaWYgKChwYWlyIHx8IChwYWlyID0gREVGQVVMVCkpICE9PSBfY2FjaGVbOF0pIHtcbiAgICAgIF9jYWNoZSA9IF9jcmVhdGUocGFpcilcbiAgICAgIF9yZWdleCA9IHBhaXIgPT09IERFRkFVTFQgPyBfbG9vcGJhY2sgOiBfcmV3cml0ZVxuICAgICAgX2NhY2hlWzldID0gX3JlZ2V4KF9wYWlyc1s5XSlcbiAgICB9XG4gICAgY2FjaGVkQnJhY2tldHMgPSBwYWlyXG4gIH1cblxuICBmdW5jdGlvbiBfc2V0U2V0dGluZ3MgKG8pIHtcbiAgICB2YXIgYlxuXG4gICAgbyA9IG8gfHwge31cbiAgICBiID0gby5icmFja2V0c1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCAnYnJhY2tldHMnLCB7XG4gICAgICBzZXQ6IF9yZXNldCxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY2FjaGVkQnJhY2tldHMgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KVxuICAgIF9zZXR0aW5ncyA9IG9cbiAgICBfcmVzZXQoYilcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYnJhY2tldHMsICdzZXR0aW5ncycsIHtcbiAgICBzZXQ6IF9zZXRTZXR0aW5ncyxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9zZXR0aW5ncyB9XG4gIH0pXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IGluIHRoZSBicm93c2VyIHJpb3QgaXMgYWx3YXlzIGluIHRoZSBzY29wZSAqL1xuICBfYnJhY2tldHMuc2V0dGluZ3MgPSB0eXBlb2YgcmlvdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmlvdC5zZXR0aW5ncyB8fCB7fVxuICBfYnJhY2tldHMuc2V0ID0gX3Jlc2V0XG5cbiAgX2JyYWNrZXRzLlJfU1RSSU5HUyA9IFJfU1RSSU5HU1xuICBfYnJhY2tldHMuUl9NTENPTU1TID0gUl9NTENPTU1TXG4gIF9icmFja2V0cy5TX1FCTE9DS1MgPSBTX1FCTE9DS1NcblxuICByZXR1cm4gX2JyYWNrZXRzXG5cbn0pKClcblxuLyoqXG4gKiBAbW9kdWxlIHRtcGxcbiAqXG4gKiB0bXBsICAgICAgICAgIC0gUm9vdCBmdW5jdGlvbiwgcmV0dXJucyB0aGUgdGVtcGxhdGUgdmFsdWUsIHJlbmRlciB3aXRoIGRhdGFcbiAqIHRtcGwuaGFzRXhwciAgLSBUZXN0IHRoZSBleGlzdGVuY2Ugb2YgYSBleHByZXNzaW9uIGluc2lkZSBhIHN0cmluZ1xuICogdG1wbC5sb29wS2V5cyAtIEdldCB0aGUga2V5cyBmb3IgYW4gJ2VhY2gnIGxvb3AgKHVzZWQgYnkgYF9lYWNoYClcbiAqL1xuXG52YXIgdG1wbCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIF9jYWNoZSA9IHt9XG5cbiAgZnVuY3Rpb24gX3RtcGwgKHN0ciwgZGF0YSkge1xuICAgIGlmICghc3RyKSByZXR1cm4gc3RyXG5cbiAgICByZXR1cm4gKF9jYWNoZVtzdHJdIHx8IChfY2FjaGVbc3RyXSA9IF9jcmVhdGUoc3RyKSkpLmNhbGwoZGF0YSwgX2xvZ0VycilcbiAgfVxuXG4gIF90bXBsLmhhdmVSYXcgPSBicmFja2V0cy5oYXNSYXdcblxuICBfdG1wbC5oYXNFeHByID0gYnJhY2tldHMuaGFzRXhwclxuXG4gIF90bXBsLmxvb3BLZXlzID0gYnJhY2tldHMubG9vcEtleXNcblxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICBfdG1wbC5jbGVhckNhY2hlID0gZnVuY3Rpb24gKCkgeyBfY2FjaGUgPSB7fSB9XG5cbiAgX3RtcGwuZXJyb3JIYW5kbGVyID0gbnVsbFxuXG4gIGZ1bmN0aW9uIF9sb2dFcnIgKGVyciwgY3R4KSB7XG5cbiAgICBpZiAoX3RtcGwuZXJyb3JIYW5kbGVyKSB7XG5cbiAgICAgIGVyci5yaW90RGF0YSA9IHtcbiAgICAgICAgdGFnTmFtZTogY3R4ICYmIGN0eC5yb290ICYmIGN0eC5yb290LnRhZ05hbWUsXG4gICAgICAgIF9yaW90X2lkOiBjdHggJiYgY3R4Ll9yaW90X2lkICAvL2VzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gICAgICB9XG4gICAgICBfdG1wbC5lcnJvckhhbmRsZXIoZXJyKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGUgKHN0cikge1xuICAgIHZhciBleHByID0gX2dldFRtcGwoc3RyKVxuXG4gICAgaWYgKGV4cHIuc2xpY2UoMCwgMTEpICE9PSAndHJ5e3JldHVybiAnKSBleHByID0gJ3JldHVybiAnICsgZXhwclxuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignRScsIGV4cHIgKyAnOycpICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LWZ1bmNcbiAgfVxuXG4gIHZhclxuICAgIENIX0lERVhQUiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHgyMDU3KSxcbiAgICBSRV9DU05BTUUgPSAvXig/OigtP1tfQS1aYS16XFx4QTAtXFx4RkZdWy1cXHdcXHhBMC1cXHhGRl0qKXxcXHUyMDU3KFxcZCspfik6LyxcbiAgICBSRV9RQkxPQ0sgPSBSZWdFeHAoYnJhY2tldHMuU19RQkxPQ0tTLCAnZycpLFxuICAgIFJFX0RRVU9URSA9IC9cXHUyMDU3L2csXG4gICAgUkVfUUJNQVJLID0gL1xcdTIwNTcoXFxkKyl+L2dcblxuICBmdW5jdGlvbiBfZ2V0VG1wbCAoc3RyKSB7XG4gICAgdmFyXG4gICAgICBxc3RyID0gW10sXG4gICAgICBleHByLFxuICAgICAgcGFydHMgPSBicmFja2V0cy5zcGxpdChzdHIucmVwbGFjZShSRV9EUVVPVEUsICdcIicpLCAxKVxuXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIgfHwgcGFydHNbMF0pIHtcbiAgICAgIHZhciBpLCBqLCBsaXN0ID0gW11cblxuICAgICAgZm9yIChpID0gaiA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgIGV4cHIgPSBwYXJ0c1tpXVxuXG4gICAgICAgIGlmIChleHByICYmIChleHByID0gaSAmIDFcblxuICAgICAgICAgICAgPyBfcGFyc2VFeHByKGV4cHIsIDEsIHFzdHIpXG5cbiAgICAgICAgICAgIDogJ1wiJyArIGV4cHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG4/fFxcbi9nLCAnXFxcXG4nKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgK1xuICAgICAgICAgICAgICAnXCInXG5cbiAgICAgICAgICApKSBsaXN0W2orK10gPSBleHByXG5cbiAgICAgIH1cblxuICAgICAgZXhwciA9IGogPCAyID8gbGlzdFswXVxuICAgICAgICAgICA6ICdbJyArIGxpc3Quam9pbignLCcpICsgJ10uam9pbihcIlwiKSdcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGV4cHIgPSBfcGFyc2VFeHByKHBhcnRzWzFdLCAwLCBxc3RyKVxuICAgIH1cblxuICAgIGlmIChxc3RyWzBdKSB7XG4gICAgICBleHByID0gZXhwci5yZXBsYWNlKFJFX1FCTUFSSywgZnVuY3Rpb24gKF8sIHBvcykge1xuICAgICAgICByZXR1cm4gcXN0cltwb3NdXG4gICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBleHByXG4gIH1cblxuICB2YXJcbiAgICBSRV9CUkVORCA9IHtcbiAgICAgICcoJzogL1soKV0vZyxcbiAgICAgICdbJzogL1tbXFxdXS9nLFxuICAgICAgJ3snOiAvW3t9XS9nXG4gICAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZUV4cHIgKGV4cHIsIGFzVGV4dCwgcXN0cikge1xuXG4gICAgZXhwciA9IGV4cHJcbiAgICAgICAgICAucmVwbGFjZShSRV9RQkxPQ0ssIGZ1bmN0aW9uIChzLCBkaXYpIHtcbiAgICAgICAgICAgIHJldHVybiBzLmxlbmd0aCA+IDIgJiYgIWRpdiA/IENIX0lERVhQUiArIChxc3RyLnB1c2gocykgLSAxKSArICd+JyA6IHNcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcID8oW1tcXCh7fSw/XFwuOl0pXFwgPy9nLCAnJDEnKVxuXG4gICAgaWYgKGV4cHIpIHtcbiAgICAgIHZhclxuICAgICAgICBsaXN0ID0gW10sXG4gICAgICAgIGNudCA9IDAsXG4gICAgICAgIG1hdGNoXG5cbiAgICAgIHdoaWxlIChleHByICYmXG4gICAgICAgICAgICAobWF0Y2ggPSBleHByLm1hdGNoKFJFX0NTTkFNRSkpICYmXG4gICAgICAgICAgICAhbWF0Y2guaW5kZXhcbiAgICAgICAgKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgIGtleSxcbiAgICAgICAgICBqc2IsXG4gICAgICAgICAgcmUgPSAvLHwoW1t7KF0pfCQvZ1xuXG4gICAgICAgIGV4cHIgPSBSZWdFeHAucmlnaHRDb250ZXh0XG4gICAgICAgIGtleSAgPSBtYXRjaFsyXSA/IHFzdHJbbWF0Y2hbMl1dLnNsaWNlKDEsIC0xKS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpIDogbWF0Y2hbMV1cblxuICAgICAgICB3aGlsZSAoanNiID0gKG1hdGNoID0gcmUuZXhlYyhleHByKSlbMV0pIHNraXBCcmFjZXMoanNiLCByZSlcblxuICAgICAgICBqc2IgID0gZXhwci5zbGljZSgwLCBtYXRjaC5pbmRleClcbiAgICAgICAgZXhwciA9IFJlZ0V4cC5yaWdodENvbnRleHRcblxuICAgICAgICBsaXN0W2NudCsrXSA9IF93cmFwRXhwcihqc2IsIDEsIGtleSlcbiAgICAgIH1cblxuICAgICAgZXhwciA9ICFjbnQgPyBfd3JhcEV4cHIoZXhwciwgYXNUZXh0KVxuICAgICAgICAgICA6IGNudCA+IDEgPyAnWycgKyBsaXN0LmpvaW4oJywnKSArICddLmpvaW4oXCIgXCIpLnRyaW0oKScgOiBsaXN0WzBdXG4gICAgfVxuICAgIHJldHVybiBleHByXG5cbiAgICBmdW5jdGlvbiBza2lwQnJhY2VzIChjaCwgcmUpIHtcbiAgICAgIHZhclxuICAgICAgICBtbSxcbiAgICAgICAgbHYgPSAxLFxuICAgICAgICBpciA9IFJFX0JSRU5EW2NoXVxuXG4gICAgICBpci5sYXN0SW5kZXggPSByZS5sYXN0SW5kZXhcbiAgICAgIHdoaWxlIChtbSA9IGlyLmV4ZWMoZXhwcikpIHtcbiAgICAgICAgaWYgKG1tWzBdID09PSBjaCkgKytsdlxuICAgICAgICBlbHNlIGlmICghLS1sdikgYnJlYWtcbiAgICAgIH1cbiAgICAgIHJlLmxhc3RJbmRleCA9IGx2ID8gZXhwci5sZW5ndGggOiBpci5sYXN0SW5kZXhcbiAgICB9XG4gIH1cblxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogbm90IGJvdGhcbiAgdmFyIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgSlNfQ09OVEVYVCA9ICdcImluIHRoaXM/dGhpczonICsgKHR5cGVvZiB3aW5kb3cgIT09ICdvYmplY3QnID8gJ2dsb2JhbCcgOiAnd2luZG93JykgKyAnKS4nLFxuICAgIEpTX1ZBUk5BTUUgPSAvWyx7XVtcXCRcXHddKyg/PTopfCheICp8W14kXFx3XFwue10pKD8hKD86dHlwZW9mfHRydWV8ZmFsc2V8bnVsbHx1bmRlZmluZWR8aW58aW5zdGFuY2VvZnxpcyg/OkZpbml0ZXxOYU4pfHZvaWR8TmFOfG5ld3xEYXRlfFJlZ0V4cHxNYXRoKSg/IVskXFx3XSkpKFskX0EtWmEtel1bJFxcd10qKS9nLFxuICAgIEpTX05PUFJPUFMgPSAvXig/PShcXC5bJFxcd10rKSlcXDEoPzpbXi5bKF18JCkvXG5cbiAgZnVuY3Rpb24gX3dyYXBFeHByIChleHByLCBhc1RleHQsIGtleSkge1xuICAgIHZhciB0YlxuXG4gICAgZXhwciA9IGV4cHIucmVwbGFjZShKU19WQVJOQU1FLCBmdW5jdGlvbiAobWF0Y2gsIHAsIG12YXIsIHBvcywgcykge1xuICAgICAgaWYgKG12YXIpIHtcbiAgICAgICAgcG9zID0gdGIgPyAwIDogcG9zICsgbWF0Y2gubGVuZ3RoXG5cbiAgICAgICAgaWYgKG12YXIgIT09ICd0aGlzJyAmJiBtdmFyICE9PSAnZ2xvYmFsJyAmJiBtdmFyICE9PSAnd2luZG93Jykge1xuICAgICAgICAgIG1hdGNoID0gcCArICcoXCInICsgbXZhciArIEpTX0NPTlRFWFQgKyBtdmFyXG4gICAgICAgICAgaWYgKHBvcykgdGIgPSAocyA9IHNbcG9zXSkgPT09ICcuJyB8fCBzID09PSAnKCcgfHwgcyA9PT0gJ1snXG4gICAgICAgIH0gZWxzZSBpZiAocG9zKSB7XG4gICAgICAgICAgdGIgPSAhSlNfTk9QUk9QUy50ZXN0KHMuc2xpY2UocG9zKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoXG4gICAgfSlcblxuICAgIGlmICh0Yikge1xuICAgICAgZXhwciA9ICd0cnl7cmV0dXJuICcgKyBleHByICsgJ31jYXRjaChlKXtFKGUsdGhpcyl9J1xuICAgIH1cblxuICAgIGlmIChrZXkpIHtcblxuICAgICAgZXhwciA9ICh0YlxuICAgICAgICAgID8gJ2Z1bmN0aW9uKCl7JyArIGV4cHIgKyAnfS5jYWxsKHRoaXMpJyA6ICcoJyArIGV4cHIgKyAnKSdcbiAgICAgICAgKSArICc/XCInICsga2V5ICsgJ1wiOlwiXCInXG5cbiAgICB9IGVsc2UgaWYgKGFzVGV4dCkge1xuXG4gICAgICBleHByID0gJ2Z1bmN0aW9uKHYpeycgKyAodGJcbiAgICAgICAgICA/IGV4cHIucmVwbGFjZSgncmV0dXJuICcsICd2PScpIDogJ3Y9KCcgKyBleHByICsgJyknXG4gICAgICAgICkgKyAnO3JldHVybiB2fHx2PT09MD92OlwiXCJ9LmNhbGwodGhpcyknXG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cHJcbiAgfVxuXG4gIF90bXBsLnZlcnNpb24gPSBicmFja2V0cy52ZXJzaW9uID0gJ3YyLjQuMidcblxuICByZXR1cm4gX3RtcGxcblxufSkoKVxuXG4vKlxuICBsaWIvYnJvd3Nlci90YWcvbWtkb20uanNcblxuICBJbmNsdWRlcyBoYWNrcyBuZWVkZWQgZm9yIHRoZSBJbnRlcm5ldCBFeHBsb3JlciB2ZXJzaW9uIDkgYW5kIGJlbG93XG4gIFNlZTogaHR0cDovL2thbmdheC5naXRodWIuaW8vY29tcGF0LXRhYmxlL2VzNS8jaWU4XG4gICAgICAgaHR0cDovL2NvZGVwbGFuZXQuaW8vZHJvcHBpbmctaWU4L1xuKi9cbnZhciBta2RvbSA9IChmdW5jdGlvbiBfbWtkb20oKSB7XG4gIHZhclxuICAgIHJlSGFzWWllbGQgID0gLzx5aWVsZFxcYi9pLFxuICAgIHJlWWllbGRBbGwgID0gLzx5aWVsZFxccyooPzpcXC8+fD4oW1xcU1xcc10qPyk8XFwveWllbGRcXHMqPnw+KS9pZyxcbiAgICByZVlpZWxkU3JjICA9IC88eWllbGRcXHMrdG89WydcIl0oW14nXCI+XSopWydcIl1cXHMqPihbXFxTXFxzXSo/KTxcXC95aWVsZFxccyo+L2lnLFxuICAgIHJlWWllbGREZXN0ID0gLzx5aWVsZFxccytmcm9tPVsnXCJdPyhbLVxcd10rKVsnXCJdP1xccyooPzpcXC8+fD4oW1xcU1xcc10qPyk8XFwveWllbGRcXHMqPikvaWdcbiAgdmFyXG4gICAgcm9vdEVscyA9IHsgdHI6ICd0Ym9keScsIHRoOiAndHInLCB0ZDogJ3RyJywgY29sOiAnY29sZ3JvdXAnIH0sXG4gICAgdGJsVGFncyA9IElFX1ZFUlNJT04gJiYgSUVfVkVSU0lPTiA8IDEwXG4gICAgICA/IFNQRUNJQUxfVEFHU19SRUdFWCA6IC9eKD86dCg/OmJvZHl8aGVhZHxmb290fFtyaGRdKXxjYXB0aW9ufGNvbCg/Omdyb3VwKT8pJC9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IHRvIHdyYXAgdGhlIGdpdmVuIGNvbnRlbnQuIE5vcm1hbGx5IGFuIGBESVZgLCBidXQgY2FuIGJlXG4gICAqIGFsc28gYSBgVEFCTEVgLCBgU0VMRUNUYCwgYFRCT0RZYCwgYFRSYCwgb3IgYENPTEdST1VQYCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSB0ZW1wbCAgLSBUaGUgdGVtcGxhdGUgY29taW5nIGZyb20gdGhlIGN1c3RvbSB0YWcgZGVmaW5pdGlvblxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSBbaHRtbF0gLSBIVE1MIGNvbnRlbnQgdGhhdCBjb21lcyBmcm9tIHRoZSBET00gZWxlbWVudCB3aGVyZSB5b3VcbiAgICogICAgICAgICAgIHdpbGwgbW91bnQgdGhlIHRhZywgbW9zdGx5IHRoZSBvcmlnaW5hbCB0YWcgaW4gdGhlIHBhZ2VcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSBET00gZWxlbWVudCB3aXRoIF90ZW1wbF8gbWVyZ2VkIHRocm91Z2ggYFlJRUxEYCB3aXRoIHRoZSBfaHRtbF8uXG4gICAqL1xuICBmdW5jdGlvbiBfbWtkb20odGVtcGwsIGh0bWwpIHtcbiAgICB2YXJcbiAgICAgIG1hdGNoICAgPSB0ZW1wbCAmJiB0ZW1wbC5tYXRjaCgvXlxccyo8KFstXFx3XSspLyksXG4gICAgICB0YWdOYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSxcbiAgICAgIGVsID0gbWtFbCgnZGl2JywgaXNTVkdUYWcodGFnTmFtZSkpXG5cbiAgICAvLyByZXBsYWNlIGFsbCB0aGUgeWllbGQgdGFncyB3aXRoIHRoZSB0YWcgaW5uZXIgaHRtbFxuICAgIHRlbXBsID0gcmVwbGFjZVlpZWxkKHRlbXBsLCBodG1sKVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGJsVGFncy50ZXN0KHRhZ05hbWUpKVxuICAgICAgZWwgPSBzcGVjaWFsVGFncyhlbCwgdGVtcGwsIHRhZ05hbWUpXG4gICAgZWxzZVxuICAgICAgc2V0SW5uZXJIVE1MKGVsLCB0ZW1wbClcblxuICAgIGVsLnN0dWIgPSB0cnVlXG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8qXG4gICAgQ3JlYXRlcyB0aGUgcm9vdCBlbGVtZW50IGZvciB0YWJsZSBvciBzZWxlY3QgY2hpbGQgZWxlbWVudHM6XG4gICAgdHIvdGgvdGQvdGhlYWQvdGZvb3QvdGJvZHkvY2FwdGlvbi9jb2wvY29sZ3JvdXAvb3B0aW9uL29wdGdyb3VwXG4gICovXG4gIGZ1bmN0aW9uIHNwZWNpYWxUYWdzKGVsLCB0ZW1wbCwgdGFnTmFtZSkge1xuICAgIHZhclxuICAgICAgc2VsZWN0ID0gdGFnTmFtZVswXSA9PT0gJ28nLFxuICAgICAgcGFyZW50ID0gc2VsZWN0ID8gJ3NlbGVjdD4nIDogJ3RhYmxlPidcblxuICAgIC8vIHRyaW0oKSBpcyBpbXBvcnRhbnQgaGVyZSwgdGhpcyBlbnN1cmVzIHdlIGRvbid0IGhhdmUgYXJ0aWZhY3RzLFxuICAgIC8vIHNvIHdlIGNhbiBjaGVjayBpZiB3ZSBoYXZlIG9ubHkgb25lIGVsZW1lbnQgaW5zaWRlIHRoZSBwYXJlbnRcbiAgICBlbC5pbm5lckhUTUwgPSAnPCcgKyBwYXJlbnQgKyB0ZW1wbC50cmltKCkgKyAnPC8nICsgcGFyZW50XG4gICAgcGFyZW50ID0gZWwuZmlyc3RDaGlsZFxuXG4gICAgLy8gcmV0dXJucyB0aGUgaW1tZWRpYXRlIHBhcmVudCBpZiB0ci90aC90ZC9jb2wgaXMgdGhlIG9ubHkgZWxlbWVudCwgaWYgbm90XG4gICAgLy8gcmV0dXJucyB0aGUgd2hvbGUgdHJlZSwgYXMgdGhpcyBjYW4gaW5jbHVkZSBhZGRpdGlvbmFsIGVsZW1lbnRzXG4gICAgaWYgKHNlbGVjdCkge1xuICAgICAgcGFyZW50LnNlbGVjdGVkSW5kZXggPSAtMSAgLy8gZm9yIElFOSwgY29tcGF0aWJsZSB3L2N1cnJlbnQgcmlvdCBiZWhhdmlvclxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdm9pZHMgaW5zZXJ0aW9uIG9mIGNvaW50YWluZXIgaW5zaWRlIGNvbnRhaW5lciAoZXg6IHRib2R5IGluc2lkZSB0Ym9keSlcbiAgICAgIHZhciB0bmFtZSA9IHJvb3RFbHNbdGFnTmFtZV1cbiAgICAgIGlmICh0bmFtZSAmJiBwYXJlbnQuY2hpbGRFbGVtZW50Q291bnQgPT09IDEpIHBhcmVudCA9ICQodG5hbWUsIHBhcmVudClcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudFxuICB9XG5cbiAgLypcbiAgICBSZXBsYWNlIHRoZSB5aWVsZCB0YWcgZnJvbSBhbnkgdGFnIHRlbXBsYXRlIHdpdGggdGhlIGlubmVySFRNTCBvZiB0aGVcbiAgICBvcmlnaW5hbCB0YWcgaW4gdGhlIHBhZ2VcbiAgKi9cbiAgZnVuY3Rpb24gcmVwbGFjZVlpZWxkKHRlbXBsLCBodG1sKSB7XG4gICAgLy8gZG8gbm90aGluZyBpZiBubyB5aWVsZFxuICAgIGlmICghcmVIYXNZaWVsZC50ZXN0KHRlbXBsKSkgcmV0dXJuIHRlbXBsXG5cbiAgICAvLyBiZSBjYXJlZnVsIHdpdGggIzEzNDMgLSBzdHJpbmcgb24gdGhlIHNvdXJjZSBoYXZpbmcgYCQxYFxuICAgIHZhciBzcmMgPSB7fVxuXG4gICAgaHRtbCA9IGh0bWwgJiYgaHRtbC5yZXBsYWNlKHJlWWllbGRTcmMsIGZ1bmN0aW9uIChfLCByZWYsIHRleHQpIHtcbiAgICAgIHNyY1tyZWZdID0gc3JjW3JlZl0gfHwgdGV4dCAgIC8vIHByZXNlcnZlIGZpcnN0IGRlZmluaXRpb25cbiAgICAgIHJldHVybiAnJ1xuICAgIH0pLnRyaW0oKVxuXG4gICAgcmV0dXJuIHRlbXBsXG4gICAgICAucmVwbGFjZShyZVlpZWxkRGVzdCwgZnVuY3Rpb24gKF8sIHJlZiwgZGVmKSB7ICAvLyB5aWVsZCB3aXRoIGZyb20gLSB0byBhdHRyc1xuICAgICAgICByZXR1cm4gc3JjW3JlZl0gfHwgZGVmIHx8ICcnXG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UocmVZaWVsZEFsbCwgZnVuY3Rpb24gKF8sIGRlZikgeyAgICAgICAgLy8geWllbGQgd2l0aG91dCBhbnkgXCJmcm9tXCJcbiAgICAgICAgcmV0dXJuIGh0bWwgfHwgZGVmIHx8ICcnXG4gICAgICB9KVxuICB9XG5cbiAgcmV0dXJuIF9ta2RvbVxuXG59KSgpXG5cbi8qKlxuICogQ29udmVydCB0aGUgaXRlbSBsb29wZWQgaW50byBhbiBvYmplY3QgdXNlZCB0byBleHRlbmQgdGhlIGNoaWxkIHRhZyBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGV4cHIgLSBvYmplY3QgY29udGFpbmluZyB0aGUga2V5cyB1c2VkIHRvIGV4dGVuZCB0aGUgY2hpbGRyZW4gdGFnc1xuICogQHBhcmFtICAgeyAqIH0ga2V5IC0gdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBuZXcgb2JqZWN0IHJldHVybmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWwgLSB2YWx1ZSBjb250YWluaW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgaXRlbSBpbiB0aGUgYXJyYXlcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gLSBuZXcgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhbHVlcyBvZiB0aGUgb3JpZ2luYWwgaXRlbVxuICpcbiAqIFRoZSB2YXJpYWJsZXMgJ2tleScgYW5kICd2YWwnIGFyZSBhcmJpdHJhcnkuXG4gKiBUaGV5IGRlcGVuZCBvbiB0aGUgY29sbGVjdGlvbiB0eXBlIGxvb3BlZCAoQXJyYXksIE9iamVjdClcbiAqIGFuZCBvbiB0aGUgZXhwcmVzc2lvbiB1c2VkIG9uIHRoZSBlYWNoIHRhZ1xuICpcbiAqL1xuZnVuY3Rpb24gbWtpdGVtKGV4cHIsIGtleSwgdmFsKSB7XG4gIHZhciBpdGVtID0ge31cbiAgaXRlbVtleHByLmtleV0gPSBrZXlcbiAgaWYgKGV4cHIucG9zKSBpdGVtW2V4cHIucG9zXSA9IHZhbFxuICByZXR1cm4gaXRlbVxufVxuXG4vKipcbiAqIFVubW91bnQgdGhlIHJlZHVuZGFudCB0YWdzXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gaXRlbXMgLSBhcnJheSBjb250YWluaW5nIHRoZSBjdXJyZW50IGl0ZW1zIHRvIGxvb3BcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSB0YWdzIC0gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGNoaWxkcmVuIHRhZ3NcbiAqL1xuZnVuY3Rpb24gdW5tb3VudFJlZHVuZGFudChpdGVtcywgdGFncykge1xuXG4gIHZhciBpID0gdGFncy5sZW5ndGgsXG4gICAgaiA9IGl0ZW1zLmxlbmd0aCxcbiAgICB0XG5cbiAgd2hpbGUgKGkgPiBqKSB7XG4gICAgdCA9IHRhZ3NbLS1pXVxuICAgIHRhZ3Muc3BsaWNlKGksIDEpXG4gICAgdC51bm1vdW50KClcbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgdGhlIG5lc3RlZCBjdXN0b20gdGFncyBpbiBub24gY3VzdG9tIGxvb3AgdGFnc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBjaGlsZCAtIG5vbiBjdXN0b20gbG9vcCB0YWdcbiAqIEBwYXJhbSAgIHsgTnVtYmVyIH0gaSAtIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIGxvb3AgdGFnXG4gKi9cbmZ1bmN0aW9uIG1vdmVOZXN0ZWRUYWdzKGNoaWxkLCBpKSB7XG4gIE9iamVjdC5rZXlzKGNoaWxkLnRhZ3MpLmZvckVhY2goZnVuY3Rpb24odGFnTmFtZSkge1xuICAgIHZhciB0YWcgPSBjaGlsZC50YWdzW3RhZ05hbWVdXG4gICAgaWYgKGlzQXJyYXkodGFnKSlcbiAgICAgIGVhY2godGFnLCBmdW5jdGlvbiAodCkge1xuICAgICAgICBtb3ZlQ2hpbGRUYWcodCwgdGFnTmFtZSwgaSlcbiAgICAgIH0pXG4gICAgZWxzZVxuICAgICAgbW92ZUNoaWxkVGFnKHRhZywgdGFnTmFtZSwgaSlcbiAgfSlcbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBlbGVtZW50cyBmb3IgYSB2aXJ0dWFsIHRhZ1xuICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gdGhlIHRhZyB3aG9zZSByb290J3MgY2hpbGRyZW4gd2lsbCBiZSBpbnNlcnRlZCBvciBhcHBlbmRlZFxuICogQHBhcmFtIHsgTm9kZSB9IHNyYyAtIHRoZSBub2RlIHRoYXQgd2lsbCBkbyB0aGUgaW5zZXJ0aW5nIG9yIGFwcGVuZGluZ1xuICogQHBhcmFtIHsgVGFnIH0gdGFyZ2V0IC0gb25seSBpZiBpbnNlcnRpbmcsIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxuICovXG5mdW5jdGlvbiBhZGRWaXJ0dWFsKHRhZywgc3JjLCB0YXJnZXQpIHtcbiAgdmFyIGVsID0gdGFnLl9yb290LCBzaWJcbiAgdGFnLl92aXJ0cyA9IFtdXG4gIHdoaWxlIChlbCkge1xuICAgIHNpYiA9IGVsLm5leHRTaWJsaW5nXG4gICAgaWYgKHRhcmdldClcbiAgICAgIHNyYy5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5fcm9vdClcbiAgICBlbHNlXG4gICAgICBzcmMuYXBwZW5kQ2hpbGQoZWwpXG5cbiAgICB0YWcuX3ZpcnRzLnB1c2goZWwpIC8vIGhvbGQgZm9yIHVubW91bnRpbmdcbiAgICBlbCA9IHNpYlxuICB9XG59XG5cbi8qKlxuICogTW92ZSB2aXJ0dWFsIHRhZyBhbmQgYWxsIGNoaWxkIG5vZGVzXG4gKiBAcGFyYW0geyBUYWcgfSB0YWcgLSBmaXJzdCBjaGlsZCByZWZlcmVuY2UgdXNlZCB0byBzdGFydCBtb3ZlXG4gKiBAcGFyYW0geyBOb2RlIH0gc3JjICAtIHRoZSBub2RlIHRoYXQgd2lsbCBkbyB0aGUgaW5zZXJ0aW5nXG4gKiBAcGFyYW0geyBUYWcgfSB0YXJnZXQgLSBpbnNlcnQgYmVmb3JlIHRoaXMgdGFnJ3MgZmlyc3QgY2hpbGRcbiAqIEBwYXJhbSB7IE51bWJlciB9IGxlbiAtIGhvdyBtYW55IGNoaWxkIG5vZGVzIHRvIG1vdmVcbiAqL1xuZnVuY3Rpb24gbW92ZVZpcnR1YWwodGFnLCBzcmMsIHRhcmdldCwgbGVuKSB7XG4gIHZhciBlbCA9IHRhZy5fcm9vdCwgc2liLCBpID0gMFxuICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc2liID0gZWwubmV4dFNpYmxpbmdcbiAgICBzcmMuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuX3Jvb3QpXG4gICAgZWwgPSBzaWJcbiAgfVxufVxuXG5cbi8qKlxuICogTWFuYWdlIHRhZ3MgaGF2aW5nIHRoZSAnZWFjaCdcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2UgbmVlZCB0byBsb29wXG4gKiBAcGFyYW0gICB7IFRhZyB9IHBhcmVudCAtIHBhcmVudCB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIGRvbSBub2RlIGlzIGNvbnRhaW5lZFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBleHByIC0gc3RyaW5nIGNvbnRhaW5lZCBpbiB0aGUgJ2VhY2gnIGF0dHJpYnV0ZVxuICovXG5mdW5jdGlvbiBfZWFjaChkb20sIHBhcmVudCwgZXhwcikge1xuXG4gIC8vIHJlbW92ZSB0aGUgZWFjaCBwcm9wZXJ0eSBmcm9tIHRoZSBvcmlnaW5hbCB0YWdcbiAgcmVtQXR0cihkb20sICdlYWNoJylcblxuICB2YXIgbXVzdFJlb3JkZXIgPSB0eXBlb2YgZ2V0QXR0cihkb20sICduby1yZW9yZGVyJykgIT09IFRfU1RSSU5HIHx8IHJlbUF0dHIoZG9tLCAnbm8tcmVvcmRlcicpLFxuICAgIHRhZ05hbWUgPSBnZXRUYWdOYW1lKGRvbSksXG4gICAgaW1wbCA9IF9fdGFnSW1wbFt0YWdOYW1lXSB8fCB7IHRtcGw6IGdldE91dGVySFRNTChkb20pIH0sXG4gICAgdXNlUm9vdCA9IFNQRUNJQUxfVEFHU19SRUdFWC50ZXN0KHRhZ05hbWUpLFxuICAgIHJvb3QgPSBkb20ucGFyZW50Tm9kZSxcbiAgICByZWYgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyksXG4gICAgY2hpbGQgPSBnZXRUYWcoZG9tKSxcbiAgICBpc09wdGlvbiA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ29wdGlvbicsIC8vIHRoZSBvcHRpb24gdGFncyBtdXN0IGJlIHRyZWF0ZWQgZGlmZmVyZW50bHlcbiAgICB0YWdzID0gW10sXG4gICAgb2xkSXRlbXMgPSBbXSxcbiAgICBoYXNLZXlzLFxuICAgIGlzVmlydHVhbCA9IGRvbS50YWdOYW1lID09ICdWSVJUVUFMJ1xuXG4gIC8vIHBhcnNlIHRoZSBlYWNoIGV4cHJlc3Npb25cbiAgZXhwciA9IHRtcGwubG9vcEtleXMoZXhwcilcblxuICAvLyBpbnNlcnQgYSBtYXJrZWQgd2hlcmUgdGhlIGxvb3AgdGFncyB3aWxsIGJlIGluamVjdGVkXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKHJlZiwgZG9tKVxuXG4gIC8vIGNsZWFuIHRlbXBsYXRlIGNvZGVcbiAgcGFyZW50Lm9uZSgnYmVmb3JlLW1vdW50JywgZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBvcmlnaW5hbCBET00gbm9kZVxuICAgIGRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbSlcbiAgICBpZiAocm9vdC5zdHViKSByb290ID0gcGFyZW50LnJvb3RcblxuICB9KS5vbigndXBkYXRlJywgZnVuY3Rpb24gKCkge1xuICAgIC8vIGdldCB0aGUgbmV3IGl0ZW1zIGNvbGxlY3Rpb25cbiAgICB2YXIgaXRlbXMgPSB0bXBsKGV4cHIudmFsLCBwYXJlbnQpLFxuICAgICAgLy8gY3JlYXRlIGEgZnJhZ21lbnQgdG8gaG9sZCB0aGUgbmV3IERPTSBub2RlcyB0byBpbmplY3QgaW4gdGhlIHBhcmVudCB0YWdcbiAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuICAgIC8vIG9iamVjdCBsb29wLiBhbnkgY2hhbmdlcyBjYXVzZSBmdWxsIHJlZHJhd1xuICAgIGlmICghaXNBcnJheShpdGVtcykpIHtcbiAgICAgIGhhc0tleXMgPSBpdGVtcyB8fCBmYWxzZVxuICAgICAgaXRlbXMgPSBoYXNLZXlzID9cbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIG1raXRlbShleHByLCBrZXksIGl0ZW1zW2tleV0pXG4gICAgICAgIH0pIDogW11cbiAgICB9XG5cbiAgICAvLyBsb29wIGFsbCB0aGUgbmV3IGl0ZW1zXG4gICAgdmFyIGkgPSAwLFxuICAgICAgaXRlbXNMZW5ndGggPSBpdGVtcy5sZW5ndGhcblxuICAgIGZvciAoOyBpIDwgaXRlbXNMZW5ndGg7IGkrKykge1xuICAgICAgLy8gcmVvcmRlciBvbmx5IGlmIHRoZSBpdGVtcyBhcmUgb2JqZWN0c1xuICAgICAgdmFyXG4gICAgICAgIGl0ZW0gPSBpdGVtc1tpXSxcbiAgICAgICAgX211c3RSZW9yZGVyID0gbXVzdFJlb3JkZXIgJiYgdHlwZW9mIGl0ZW0gPT0gVF9PQkpFQ1QgJiYgIWhhc0tleXMsXG4gICAgICAgIG9sZFBvcyA9IG9sZEl0ZW1zLmluZGV4T2YoaXRlbSksXG4gICAgICAgIHBvcyA9IH5vbGRQb3MgJiYgX211c3RSZW9yZGVyID8gb2xkUG9zIDogaSxcbiAgICAgICAgLy8gZG9lcyBhIHRhZyBleGlzdCBpbiB0aGlzIHBvc2l0aW9uP1xuICAgICAgICB0YWcgPSB0YWdzW3Bvc11cblxuICAgICAgaXRlbSA9ICFoYXNLZXlzICYmIGV4cHIua2V5ID8gbWtpdGVtKGV4cHIsIGl0ZW0sIGkpIDogaXRlbVxuXG4gICAgICAvLyBuZXcgdGFnXG4gICAgICBpZiAoXG4gICAgICAgICFfbXVzdFJlb3JkZXIgJiYgIXRhZyAvLyB3aXRoIG5vLXJlb3JkZXIgd2UganVzdCB1cGRhdGUgdGhlIG9sZCB0YWdzXG4gICAgICAgIHx8XG4gICAgICAgIF9tdXN0UmVvcmRlciAmJiAhfm9sZFBvcyB8fCAhdGFnIC8vIGJ5IGRlZmF1bHQgd2UgYWx3YXlzIHRyeSB0byByZW9yZGVyIHRoZSBET00gZWxlbWVudHNcbiAgICAgICkge1xuXG4gICAgICAgIHRhZyA9IG5ldyBUYWcoaW1wbCwge1xuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICAgIGlzTG9vcDogdHJ1ZSxcbiAgICAgICAgICBoYXNJbXBsOiAhIV9fdGFnSW1wbFt0YWdOYW1lXSxcbiAgICAgICAgICByb290OiB1c2VSb290ID8gcm9vdCA6IGRvbS5jbG9uZU5vZGUoKSxcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH0sIGRvbS5pbm5lckhUTUwpXG5cbiAgICAgICAgdGFnLm1vdW50KClcblxuICAgICAgICBpZiAoaXNWaXJ0dWFsKSB0YWcuX3Jvb3QgPSB0YWcucm9vdC5maXJzdENoaWxkIC8vIHNhdmUgcmVmZXJlbmNlIGZvciBmdXJ0aGVyIG1vdmVzIG9yIGluc2VydHNcbiAgICAgICAgLy8gdGhpcyB0YWcgbXVzdCBiZSBhcHBlbmRlZFxuICAgICAgICBpZiAoaSA9PSB0YWdzLmxlbmd0aCB8fCAhdGFnc1tpXSkgeyAvLyBmaXggMTU4MVxuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpXG4gICAgICAgICAgICBhZGRWaXJ0dWFsKHRhZywgZnJhZylcbiAgICAgICAgICBlbHNlIGZyYWcuYXBwZW5kQ2hpbGQodGFnLnJvb3QpXG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcyB0YWcgbXVzdCBiZSBpbnNlcnRcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKGlzVmlydHVhbClcbiAgICAgICAgICAgIGFkZFZpcnR1YWwodGFnLCByb290LCB0YWdzW2ldKVxuICAgICAgICAgIGVsc2Ugcm9vdC5pbnNlcnRCZWZvcmUodGFnLnJvb3QsIHRhZ3NbaV0ucm9vdCkgLy8gIzEzNzQgc29tZSBicm93c2VycyByZXNldCBzZWxlY3RlZCBoZXJlXG4gICAgICAgICAgb2xkSXRlbXMuc3BsaWNlKGksIDAsIGl0ZW0pXG4gICAgICAgIH1cblxuICAgICAgICB0YWdzLnNwbGljZShpLCAwLCB0YWcpXG4gICAgICAgIHBvcyA9IGkgLy8gaGFuZGxlZCBoZXJlIHNvIG5vIG1vdmVcbiAgICAgIH0gZWxzZSB0YWcudXBkYXRlKGl0ZW0sIHRydWUpXG5cbiAgICAgIC8vIHJlb3JkZXIgdGhlIHRhZyBpZiBpdCdzIG5vdCBsb2NhdGVkIGluIGl0cyBwcmV2aW91cyBwb3NpdGlvblxuICAgICAgaWYgKFxuICAgICAgICBwb3MgIT09IGkgJiYgX211c3RSZW9yZGVyICYmXG4gICAgICAgIHRhZ3NbaV0gLy8gZml4IDE1ODEgdW5hYmxlIHRvIHJlcHJvZHVjZSBpdCBpbiBhIHRlc3QhXG4gICAgICApIHtcblxuICAgICAgICAvLyAjY2xvc2VzIDIwNDBcbiAgICAgICAgaWYgKGNvbnRhaW5zKGl0ZW1zLCBvbGRJdGVtc1tpXSkpIHtcbiAgICAgICAgICAvLyB1cGRhdGUgdGhlIERPTVxuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpXG4gICAgICAgICAgICBtb3ZlVmlydHVhbCh0YWcsIHJvb3QsIHRhZ3NbaV0sIGRvbS5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgICAgICBlbHNlIGlmICh0YWdzW2ldLnJvb3QucGFyZW50Tm9kZSkgcm9vdC5pbnNlcnRCZWZvcmUodGFnLnJvb3QsIHRhZ3NbaV0ucm9vdClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaXRpb24gYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xuICAgICAgICBpZiAoZXhwci5wb3MpXG4gICAgICAgICAgdGFnW2V4cHIucG9zXSA9IGlcbiAgICAgICAgLy8gbW92ZSB0aGUgb2xkIHRhZyBpbnN0YW5jZVxuICAgICAgICB0YWdzLnNwbGljZShpLCAwLCB0YWdzLnNwbGljZShwb3MsIDEpWzBdKVxuICAgICAgICAvLyBtb3ZlIHRoZSBvbGQgaXRlbVxuICAgICAgICBvbGRJdGVtcy5zcGxpY2UoaSwgMCwgb2xkSXRlbXMuc3BsaWNlKHBvcywgMSlbMF0pXG4gICAgICAgIC8vIGlmIHRoZSBsb29wIHRhZ3MgYXJlIG5vdCBjdXN0b21cbiAgICAgICAgLy8gd2UgbmVlZCB0byBtb3ZlIGFsbCB0aGVpciBjdXN0b20gdGFncyBpbnRvIHRoZSByaWdodCBwb3NpdGlvblxuICAgICAgICBpZiAoIWNoaWxkICYmIHRhZy50YWdzKSBtb3ZlTmVzdGVkVGFncyh0YWcsIGkpXG4gICAgICB9XG5cbiAgICAgIC8vIGNhY2hlIHRoZSBvcmlnaW5hbCBpdGVtIHRvIHVzZSBpdCBpbiB0aGUgZXZlbnRzIGJvdW5kIHRvIHRoaXMgbm9kZVxuICAgICAgLy8gYW5kIGl0cyBjaGlsZHJlblxuICAgICAgdGFnLl9pdGVtID0gaXRlbVxuICAgICAgLy8gY2FjaGUgdGhlIHJlYWwgcGFyZW50IHRhZyBpbnRlcm5hbGx5XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0YWcsICdfcGFyZW50JywgcGFyZW50KVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGUgcmVkdW5kYW50IHRhZ3NcbiAgICB1bm1vdW50UmVkdW5kYW50KGl0ZW1zLCB0YWdzKVxuXG4gICAgLy8gaW5zZXJ0IHRoZSBuZXcgbm9kZXNcbiAgICByb290Lmluc2VydEJlZm9yZShmcmFnLCByZWYpXG4gICAgaWYgKGlzT3B0aW9uKSB7XG5cbiAgICAgIC8vICMxMzc0IEZpcmVGb3ggYnVnIGluIDxvcHRpb24gc2VsZWN0ZWQ9e2V4cHJlc3Npb259PlxuICAgICAgaWYgKEZJUkVGT1ggJiYgIXJvb3QubXVsdGlwbGUpIHtcbiAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCByb290Lmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgaWYgKHJvb3Rbbl0uX19yaW90MTM3NCkge1xuICAgICAgICAgICAgcm9vdC5zZWxlY3RlZEluZGV4ID0gbiAgLy8gY2xlYXIgb3RoZXIgb3B0aW9uc1xuICAgICAgICAgICAgZGVsZXRlIHJvb3Rbbl0uX19yaW90MTM3NFxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlICd0YWdzJyBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRhZ1xuICAgIC8vIGlmIGNoaWxkIGlzICd1bmRlZmluZWQnIGl0IG1lYW5zIHRoYXQgd2UgZG9uJ3QgbmVlZCB0byBzZXQgdGhpcyBwcm9wZXJ0eVxuICAgIC8vIGZvciBleGFtcGxlOlxuICAgIC8vIHdlIGRvbid0IG5lZWQgc3RvcmUgdGhlIGBteVRhZy50YWdzWydkaXYnXWAgcHJvcGVydHkgaWYgd2UgYXJlIGxvb3BpbmcgYSBkaXYgdGFnXG4gICAgLy8gYnV0IHdlIG5lZWQgdG8gdHJhY2sgdGhlIGBteVRhZy50YWdzWydjaGlsZCddYCBwcm9wZXJ0eSBsb29waW5nIGEgY3VzdG9tIGNoaWxkIG5vZGUgbmFtZWQgYGNoaWxkYFxuICAgIGlmIChjaGlsZCkgcGFyZW50LnRhZ3NbdGFnTmFtZV0gPSB0YWdzXG5cbiAgICAvLyBjbG9uZSB0aGUgaXRlbXMgYXJyYXlcbiAgICBvbGRJdGVtcyA9IGl0ZW1zLnNsaWNlKClcblxuICB9KVxuXG59XG4vKipcbiAqIE9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB0byBpbmplY3QgYW5kIG1hbmFnZSB0aGUgY3NzIG9mIGV2ZXJ5IHRhZyBpbnN0YW5jZVxuICovXG52YXIgc3R5bGVNYW5hZ2VyID0gKGZ1bmN0aW9uKF9yaW90KSB7XG5cbiAgaWYgKCF3aW5kb3cpIHJldHVybiB7IC8vIHNraXAgaW5qZWN0aW9uIG9uIHRoZSBzZXJ2ZXJcbiAgICBhZGQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgIGluamVjdDogZnVuY3Rpb24gKCkge31cbiAgfVxuXG4gIHZhciBzdHlsZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIGNyZWF0ZSBhIG5ldyBzdHlsZSBlbGVtZW50IHdpdGggdGhlIGNvcnJlY3QgdHlwZVxuICAgIHZhciBuZXdOb2RlID0gbWtFbCgnc3R5bGUnKVxuICAgIHNldEF0dHIobmV3Tm9kZSwgJ3R5cGUnLCAndGV4dC9jc3MnKVxuXG4gICAgLy8gcmVwbGFjZSBhbnkgdXNlciBub2RlIG9yIGluc2VydCB0aGUgbmV3IG9uZSBpbnRvIHRoZSBoZWFkXG4gICAgdmFyIHVzZXJOb2RlID0gJCgnc3R5bGVbdHlwZT1yaW90XScpXG4gICAgaWYgKHVzZXJOb2RlKSB7XG4gICAgICBpZiAodXNlck5vZGUuaWQpIG5ld05vZGUuaWQgPSB1c2VyTm9kZS5pZFxuICAgICAgdXNlck5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgdXNlck5vZGUpXG4gICAgfVxuICAgIGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChuZXdOb2RlKVxuXG4gICAgcmV0dXJuIG5ld05vZGVcbiAgfSkoKVxuXG4gIC8vIENyZWF0ZSBjYWNoZSBhbmQgc2hvcnRjdXQgdG8gdGhlIGNvcnJlY3QgcHJvcGVydHlcbiAgdmFyIGNzc1RleHRQcm9wID0gc3R5bGVOb2RlLnN0eWxlU2hlZXQsXG4gICAgc3R5bGVzVG9JbmplY3QgPSAnJ1xuXG4gIC8vIEV4cG9zZSB0aGUgc3R5bGUgbm9kZSBpbiBhIG5vbi1tb2RpZmljYWJsZSBwcm9wZXJ0eVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX3Jpb3QsICdzdHlsZU5vZGUnLCB7XG4gICAgdmFsdWU6IHN0eWxlTm9kZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgYXBpXG4gICAqL1xuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNhdmUgYSB0YWcgc3R5bGUgdG8gYmUgbGF0ZXIgaW5qZWN0ZWQgaW50byBET01cbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGNzcyBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihjc3MpIHtcbiAgICAgIHN0eWxlc1RvSW5qZWN0ICs9IGNzc1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogSW5qZWN0IGFsbCBwcmV2aW91c2x5IHNhdmVkIHRhZyBzdHlsZXMgaW50byBET01cbiAgICAgKiBpbm5lckhUTUwgc2VlbXMgc2xvdzogaHR0cDovL2pzcGVyZi5jb20vcmlvdC1pbnNlcnQtc3R5bGVcbiAgICAgKi9cbiAgICBpbmplY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHN0eWxlc1RvSW5qZWN0KSB7XG4gICAgICAgIGlmIChjc3NUZXh0UHJvcCkgY3NzVGV4dFByb3AuY3NzVGV4dCArPSBzdHlsZXNUb0luamVjdFxuICAgICAgICBlbHNlIHN0eWxlTm9kZS5pbm5lckhUTUwgKz0gc3R5bGVzVG9JbmplY3RcbiAgICAgICAgc3R5bGVzVG9JbmplY3QgPSAnJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KShyaW90KVxuXG5cbmZ1bmN0aW9uIHBhcnNlTmFtZWRFbGVtZW50cyhyb290LCB0YWcsIGNoaWxkVGFncywgZm9yY2VQYXJzaW5nTmFtZWQpIHtcblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIGlmIChkb20ubm9kZVR5cGUgPT0gMSkge1xuICAgICAgZG9tLmlzTG9vcCA9IGRvbS5pc0xvb3AgfHxcbiAgICAgICAgICAgICAgICAgIChkb20ucGFyZW50Tm9kZSAmJiBkb20ucGFyZW50Tm9kZS5pc0xvb3AgfHwgZ2V0QXR0cihkb20sICdlYWNoJykpXG4gICAgICAgICAgICAgICAgICAgID8gMSA6IDBcblxuICAgICAgLy8gY3VzdG9tIGNoaWxkIHRhZ1xuICAgICAgaWYgKGNoaWxkVGFncykge1xuICAgICAgICB2YXIgY2hpbGQgPSBnZXRUYWcoZG9tKVxuXG4gICAgICAgIGlmIChjaGlsZCAmJiAhZG9tLmlzTG9vcClcbiAgICAgICAgICBjaGlsZFRhZ3MucHVzaChpbml0Q2hpbGRUYWcoY2hpbGQsIHtyb290OiBkb20sIHBhcmVudDogdGFnfSwgZG9tLmlubmVySFRNTCwgdGFnKSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFkb20uaXNMb29wIHx8IGZvcmNlUGFyc2luZ05hbWVkKVxuICAgICAgICBzZXROYW1lZChkb20sIHRhZywgW10pXG4gICAgfVxuXG4gIH0pXG5cbn1cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9ucyhyb290LCB0YWcsIGV4cHJlc3Npb25zKSB7XG5cbiAgZnVuY3Rpb24gYWRkRXhwcihkb20sIHZhbCwgZXh0cmEpIHtcbiAgICBpZiAodG1wbC5oYXNFeHByKHZhbCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKHsgZG9tOiBkb20sIGV4cHI6IHZhbCB9LCBleHRyYSkpXG4gICAgfVxuICB9XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICB2YXIgdHlwZSA9IGRvbS5ub2RlVHlwZSxcbiAgICAgIGF0dHJcblxuICAgIC8vIHRleHQgbm9kZVxuICAgIGlmICh0eXBlID09IDMgJiYgZG9tLnBhcmVudE5vZGUudGFnTmFtZSAhPSAnU1RZTEUnKSBhZGRFeHByKGRvbSwgZG9tLm5vZGVWYWx1ZSlcbiAgICBpZiAodHlwZSAhPSAxKSByZXR1cm5cblxuICAgIC8qIGVsZW1lbnQgKi9cblxuICAgIC8vIGxvb3BcbiAgICBhdHRyID0gZ2V0QXR0cihkb20sICdlYWNoJylcblxuICAgIGlmIChhdHRyKSB7IF9lYWNoKGRvbSwgdGFnLCBhdHRyKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIC8vIGF0dHJpYnV0ZSBleHByZXNzaW9uc1xuICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxuICAgICAgICBib29sID0gbmFtZS5zcGxpdCgnX18nKVsxXVxuXG4gICAgICBhZGRFeHByKGRvbSwgYXR0ci52YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgIGlmIChib29sKSB7IHJlbUF0dHIoZG9tLCBuYW1lKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIH0pXG5cbiAgICAvLyBza2lwIGN1c3RvbSB0YWdzXG4gICAgaWYgKGdldFRhZyhkb20pKSByZXR1cm4gZmFsc2VcblxuICB9KVxuXG59XG5mdW5jdGlvbiBUYWcoaW1wbCwgY29uZiwgaW5uZXJIVE1MKSB7XG5cbiAgdmFyIHNlbGYgPSByaW90Lm9ic2VydmFibGUodGhpcyksXG4gICAgb3B0cyA9IGluaGVyaXQoY29uZi5vcHRzKSB8fCB7fSxcbiAgICBwYXJlbnQgPSBjb25mLnBhcmVudCxcbiAgICBpc0xvb3AgPSBjb25mLmlzTG9vcCxcbiAgICBoYXNJbXBsID0gY29uZi5oYXNJbXBsLFxuICAgIGl0ZW0gPSBjbGVhblVwRGF0YShjb25mLml0ZW0pLFxuICAgIGV4cHJlc3Npb25zID0gW10sXG4gICAgY2hpbGRUYWdzID0gW10sXG4gICAgcm9vdCA9IGNvbmYucm9vdCxcbiAgICB0YWdOYW1lID0gcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgYXR0ciA9IHt9LFxuICAgIHByb3BzSW5TeW5jV2l0aFBhcmVudCA9IFtdLFxuICAgIGRvbVxuXG4gIC8vIG9ubHkgY2FsbCB1bm1vdW50IGlmIHdlIGhhdmUgYSB2YWxpZCBfX3RhZ0ltcGwgKGhhcyBuYW1lIHByb3BlcnR5KVxuICBpZiAoaW1wbC5uYW1lICYmIHJvb3QuX3RhZykgcm9vdC5fdGFnLnVubW91bnQodHJ1ZSlcblxuICAvLyBub3QgeWV0IG1vdW50ZWRcbiAgdGhpcy5pc01vdW50ZWQgPSBmYWxzZVxuICByb290LmlzTG9vcCA9IGlzTG9vcFxuXG4gIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAgLy8gc28gd2Ugd2lsbCBiZSBhYmxlIHRvIG1vdW50IHRoaXMgdGFnIG11bHRpcGxlIHRpbWVzXG4gIHJvb3QuX3RhZyA9IHRoaXNcblxuICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcbiAgLy8gaXQgY291bGQgYmUgaGFuZHkgdG8gdXNlIGl0IGFsc28gdG8gaW1wcm92ZSB0aGUgdmlydHVhbCBkb20gcmVuZGVyaW5nIHNwZWVkXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICdfcmlvdF9pZCcsICsrX191aWQpIC8vIGJhc2UgMSBhbGxvd3MgdGVzdCAhdC5fcmlvdF9pZFxuXG4gIGV4dGVuZCh0aGlzLCB7IHBhcmVudDogcGFyZW50LCByb290OiByb290LCBvcHRzOiBvcHRzfSwgaXRlbSlcbiAgLy8gcHJvdGVjdCB0aGUgXCJ0YWdzXCIgcHJvcGVydHkgZnJvbSBiZWluZyBvdmVycmlkZGVuXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICd0YWdzJywge30pXG5cbiAgLy8gZ3JhYiBhdHRyaWJ1dGVzXG4gIGVhY2gocm9vdC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihlbCkge1xuICAgIHZhciB2YWwgPSBlbC52YWx1ZVxuICAgIC8vIHJlbWVtYmVyIGF0dHJpYnV0ZXMgd2l0aCBleHByZXNzaW9ucyBvbmx5XG4gICAgaWYgKHRtcGwuaGFzRXhwcih2YWwpKSBhdHRyW2VsLm5hbWVdID0gdmFsXG4gIH0pXG5cbiAgZG9tID0gbWtkb20oaW1wbC50bXBsLCBpbm5lckhUTUwpXG5cbiAgLy8gb3B0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVPcHRzKCkge1xuICAgIHZhciBjdHggPSBoYXNJbXBsICYmIGlzTG9vcCA/IHNlbGYgOiBwYXJlbnQgfHwgc2VsZlxuXG4gICAgLy8gdXBkYXRlIG9wdHMgZnJvbSBjdXJyZW50IERPTSBhdHRyaWJ1dGVzXG4gICAgZWFjaChyb290LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgdmFsID0gZWwudmFsdWVcbiAgICAgIG9wdHNbdG9DYW1lbChlbC5uYW1lKV0gPSB0bXBsLmhhc0V4cHIodmFsKSA/IHRtcGwodmFsLCBjdHgpIDogdmFsXG4gICAgfSlcbiAgICAvLyByZWNvdmVyIHRob3NlIHdpdGggZXhwcmVzc2lvbnNcbiAgICBlYWNoKE9iamVjdC5rZXlzKGF0dHIpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBvcHRzW3RvQ2FtZWwobmFtZSldID0gdG1wbChhdHRyW25hbWVdLCBjdHgpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEoZGF0YSkge1xuICAgIGZvciAodmFyIGtleSBpbiBpdGVtKSB7XG4gICAgICBpZiAodHlwZW9mIHNlbGZba2V5XSAhPT0gVF9VTkRFRiAmJiBpc1dyaXRhYmxlKHNlbGYsIGtleSkpXG4gICAgICAgIHNlbGZba2V5XSA9IGRhdGFba2V5XVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaGVyaXRGcm9tKHRhcmdldCkge1xuICAgIGVhY2goT2JqZWN0LmtleXModGFyZ2V0KSwgZnVuY3Rpb24oaykge1xuICAgICAgLy8gc29tZSBwcm9wZXJ0aWVzIG11c3QgYmUgYWx3YXlzIGluIHN5bmMgd2l0aCB0aGUgcGFyZW50IHRhZ1xuICAgICAgdmFyIG11c3RTeW5jID0gIVJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVC50ZXN0KGspICYmIGNvbnRhaW5zKHByb3BzSW5TeW5jV2l0aFBhcmVudCwgaylcblxuICAgICAgaWYgKHR5cGVvZiBzZWxmW2tdID09PSBUX1VOREVGIHx8IG11c3RTeW5jKSB7XG4gICAgICAgIC8vIHRyYWNrIHRoZSBwcm9wZXJ0eSB0byBrZWVwIGluIHN5bmNcbiAgICAgICAgLy8gc28gd2UgY2FuIGtlZXAgaXQgdXBkYXRlZFxuICAgICAgICBpZiAoIW11c3RTeW5jKSBwcm9wc0luU3luY1dpdGhQYXJlbnQucHVzaChrKVxuICAgICAgICBzZWxmW2tdID0gdGFyZ2V0W2tdXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHRhZyBleHByZXNzaW9ucyBhbmQgb3B0aW9uc1xuICAgKiBAcGFyYW0gICB7ICogfSAgZGF0YSAtIGRhdGEgd2Ugd2FudCB0byB1c2UgdG8gZXh0ZW5kIHRoZSB0YWcgcHJvcGVydGllc1xuICAgKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBpc0luaGVyaXRlZCAtIGlzIHRoaXMgdXBkYXRlIGNvbWluZyBmcm9tIGEgcGFyZW50IHRhZz9cbiAgICogQHJldHVybnMgeyBzZWxmIH1cbiAgICovXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICd1cGRhdGUnLCBmdW5jdGlvbihkYXRhLCBpc0luaGVyaXRlZCkge1xuXG4gICAgLy8gbWFrZSBzdXJlIHRoZSBkYXRhIHBhc3NlZCB3aWxsIG5vdCBvdmVycmlkZVxuICAgIC8vIHRoZSBjb21wb25lbnQgY29yZSBtZXRob2RzXG4gICAgZGF0YSA9IGNsZWFuVXBEYXRhKGRhdGEpXG4gICAgLy8gaW5oZXJpdCBwcm9wZXJ0aWVzIGZyb20gdGhlIHBhcmVudCBpbiBsb29wXG4gICAgaWYgKGlzTG9vcCkge1xuICAgICAgaW5oZXJpdEZyb20oc2VsZi5wYXJlbnQpXG4gICAgfVxuICAgIC8vIG5vcm1hbGl6ZSB0aGUgdGFnIHByb3BlcnRpZXMgaW4gY2FzZSBhbiBpdGVtIG9iamVjdCB3YXMgaW5pdGlhbGx5IHBhc3NlZFxuICAgIGlmIChkYXRhICYmIGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBub3JtYWxpemVEYXRhKGRhdGEpXG4gICAgICBpdGVtID0gZGF0YVxuICAgIH1cbiAgICBleHRlbmQoc2VsZiwgZGF0YSlcbiAgICB1cGRhdGVPcHRzKClcbiAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZScsIGRhdGEpXG4gICAgdXBkYXRlKGV4cHJlc3Npb25zLCBzZWxmKVxuXG4gICAgLy8gdGhlIHVwZGF0ZWQgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgICAvLyBvbmNlIHRoZSBET00gd2lsbCBiZSByZWFkeSBhbmQgYWxsIHRoZSByZS1mbG93cyBhcmUgY29tcGxldGVkXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gZ2V0IHRoZSBcInJlYWxcIiByb290IHByb3BlcnRpZXNcbiAgICAvLyA0IGV4OiByb290Lm9mZnNldFdpZHRoIC4uLlxuICAgIGlmIChpc0luaGVyaXRlZCAmJiBzZWxmLnBhcmVudClcbiAgICAgIC8vIGNsb3NlcyAjMTU5OVxuICAgICAgc2VsZi5wYXJlbnQub25lKCd1cGRhdGVkJywgZnVuY3Rpb24oKSB7IHNlbGYudHJpZ2dlcigndXBkYXRlZCcpIH0pXG4gICAgZWxzZSByQUYoZnVuY3Rpb24oKSB7IHNlbGYudHJpZ2dlcigndXBkYXRlZCcpIH0pXG5cbiAgICByZXR1cm4gdGhpc1xuICB9KVxuXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICdtaXhpbicsIGZ1bmN0aW9uKCkge1xuICAgIGVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihtaXgpIHtcbiAgICAgIHZhciBpbnN0YW5jZSxcbiAgICAgICAgcHJvcHMgPSBbXSxcbiAgICAgICAgb2JqXG5cbiAgICAgIG1peCA9IHR5cGVvZiBtaXggPT09IFRfU1RSSU5HID8gcmlvdC5taXhpbihtaXgpIDogbWl4XG5cbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBtaXhpbiBpcyBhIGZ1bmN0aW9uXG4gICAgICBpZiAoaXNGdW5jdGlvbihtaXgpKSB7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV3IG1peGluIGluc3RhbmNlXG4gICAgICAgIGluc3RhbmNlID0gbmV3IG1peCgpXG4gICAgICB9IGVsc2UgaW5zdGFuY2UgPSBtaXhcblxuICAgICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGluc3RhbmNlKVxuXG4gICAgICAvLyBidWlsZCBtdWx0aWxldmVsIHByb3RvdHlwZSBpbmhlcml0YW5jZSBjaGFpbiBwcm9wZXJ0eSBsaXN0XG4gICAgICBkbyBwcm9wcyA9IHByb3BzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmogfHwgaW5zdGFuY2UpKVxuICAgICAgd2hpbGUgKG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmogfHwgaW5zdGFuY2UpKVxuXG4gICAgICAvLyBsb29wIHRoZSBrZXlzIGluIHRoZSBmdW5jdGlvbiBwcm90b3R5cGUgb3IgdGhlIGFsbCBvYmplY3Qga2V5c1xuICAgICAgZWFjaChwcm9wcywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIC8vIGJpbmQgbWV0aG9kcyB0byBzZWxmXG4gICAgICAgIC8vIGFsbG93IG1peGlucyB0byBvdmVycmlkZSBvdGhlciBwcm9wZXJ0aWVzL3BhcmVudCBtaXhpbnNcbiAgICAgICAgaWYgKGtleSAhPSAnaW5pdCcpIHtcbiAgICAgICAgICAvLyBjaGVjayBmb3IgZ2V0dGVycy9zZXR0ZXJzXG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGluc3RhbmNlLCBrZXkpIHx8IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSlcbiAgICAgICAgICB2YXIgaGFzR2V0dGVyU2V0dGVyID0gZGVzY3JpcHRvciAmJiAoZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci5zZXQpXG5cbiAgICAgICAgICAvLyBhcHBseSBtZXRob2Qgb25seSBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0IG9uIHRoZSBpbnN0YW5jZVxuICAgICAgICAgIGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGhhc0dldHRlclNldHRlcikge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsIGtleSwgZGVzY3JpcHRvcilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZltrZXldID0gaXNGdW5jdGlvbihpbnN0YW5jZVtrZXldKSA/XG4gICAgICAgICAgICAgIGluc3RhbmNlW2tleV0uYmluZChzZWxmKSA6XG4gICAgICAgICAgICAgIGluc3RhbmNlW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIGluaXQgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGF1dG9tYXRpY2FsbHlcbiAgICAgIGlmIChpbnN0YW5jZS5pbml0KSBpbnN0YW5jZS5pbml0LmJpbmQoc2VsZikoKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSlcblxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW91bnQnLCBmdW5jdGlvbigpIHtcblxuICAgIHVwZGF0ZU9wdHMoKVxuXG4gICAgLy8gYWRkIGdsb2JhbCBtaXhpbnNcbiAgICB2YXIgZ2xvYmFsTWl4aW4gPSByaW90Lm1peGluKEdMT0JBTF9NSVhJTilcblxuICAgIGlmIChnbG9iYWxNaXhpbilcbiAgICAgIGZvciAodmFyIGkgaW4gZ2xvYmFsTWl4aW4pXG4gICAgICAgIGlmIChnbG9iYWxNaXhpbi5oYXNPd25Qcm9wZXJ0eShpKSlcbiAgICAgICAgICBzZWxmLm1peGluKGdsb2JhbE1peGluW2ldKVxuXG4gICAgLy8gY2hpbGRyZW4gaW4gbG9vcCBzaG91bGQgaW5oZXJpdCBmcm9tIHRydWUgcGFyZW50XG4gICAgaWYgKHNlbGYuX3BhcmVudCAmJiBzZWxmLl9wYXJlbnQucm9vdC5pc0xvb3ApIHtcbiAgICAgIGluaGVyaXRGcm9tKHNlbGYuX3BhcmVudClcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaWF0aW9uXG4gICAgaWYgKGltcGwuZm4pIGltcGwuZm4uY2FsbChzZWxmLCBvcHRzKVxuXG4gICAgLy8gcGFyc2UgbGF5b3V0IGFmdGVyIGluaXQuIGZuIG1heSBjYWxjdWxhdGUgYXJncyBmb3IgbmVzdGVkIGN1c3RvbSB0YWdzXG4gICAgcGFyc2VFeHByZXNzaW9ucyhkb20sIHNlbGYsIGV4cHJlc3Npb25zKVxuXG4gICAgLy8gbW91bnQgdGhlIGNoaWxkIHRhZ3NcbiAgICB0b2dnbGUodHJ1ZSlcblxuICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhZGRpbmcgY3VzdG9tIGF0dHJpYnV0ZXMgY29taW5nIGZyb20gdGhlIGNvbXBpbGVyXG4gICAgLy8gaXQgZml4ZXMgYWxzbyAjMTA4N1xuICAgIGlmIChpbXBsLmF0dHJzKVxuICAgICAgd2Fsa0F0dHJpYnV0ZXMoaW1wbC5hdHRycywgZnVuY3Rpb24gKGssIHYpIHsgc2V0QXR0cihyb290LCBrLCB2KSB9KVxuICAgIGlmIChpbXBsLmF0dHJzIHx8IGhhc0ltcGwpXG4gICAgICBwYXJzZUV4cHJlc3Npb25zKHNlbGYucm9vdCwgc2VsZiwgZXhwcmVzc2lvbnMpXG5cbiAgICBpZiAoIXNlbGYucGFyZW50IHx8IGlzTG9vcCkgc2VsZi51cGRhdGUoaXRlbSlcblxuICAgIC8vIGludGVybmFsIHVzZSBvbmx5LCBmaXhlcyAjNDAzXG4gICAgc2VsZi50cmlnZ2VyKCdiZWZvcmUtbW91bnQnKVxuXG4gICAgaWYgKGlzTG9vcCAmJiAhaGFzSW1wbCkge1xuICAgICAgLy8gdXBkYXRlIHRoZSByb290IGF0dHJpYnV0ZSBmb3IgdGhlIGxvb3BlZCBlbGVtZW50c1xuICAgICAgcm9vdCA9IGRvbS5maXJzdENoaWxkXG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgcm9vdC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZClcbiAgICAgIGlmIChyb290LnN0dWIpIHJvb3QgPSBwYXJlbnQucm9vdFxuICAgIH1cblxuICAgIGRlZmluZVByb3BlcnR5KHNlbGYsICdyb290Jywgcm9vdClcblxuICAgIC8vIHBhcnNlIHRoZSBuYW1lZCBkb20gbm9kZXMgaW4gdGhlIGxvb3BlZCBjaGlsZFxuICAgIC8vIGFkZGluZyB0aGVtIHRvIHRoZSBwYXJlbnQgYXMgd2VsbFxuICAgIGlmIChpc0xvb3ApXG4gICAgICBwYXJzZU5hbWVkRWxlbWVudHMoc2VsZi5yb290LCBzZWxmLnBhcmVudCwgbnVsbCwgdHJ1ZSlcblxuICAgIC8vIGlmIGl0J3Mgbm90IGEgY2hpbGQgdGFnIHdlIGNhbiB0cmlnZ2VyIGl0cyBtb3VudCBldmVudFxuICAgIGlmICghc2VsZi5wYXJlbnQgfHwgc2VsZi5wYXJlbnQuaXNNb3VudGVkKSB7XG4gICAgICBzZWxmLmlzTW91bnRlZCA9IHRydWVcbiAgICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxuICAgIH1cbiAgICAvLyBvdGhlcndpc2Ugd2UgbmVlZCB0byB3YWl0IHRoYXQgdGhlIHBhcmVudCBldmVudCBnZXRzIHRyaWdnZXJlZFxuICAgIGVsc2Ugc2VsZi5wYXJlbnQub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXZvaWQgdG8gdHJpZ2dlciB0aGUgYG1vdW50YCBldmVudCBmb3IgdGhlIHRhZ3NcbiAgICAgIC8vIG5vdCB2aXNpYmxlIGluY2x1ZGVkIGluIGFuIGlmIHN0YXRlbWVudFxuICAgICAgaWYgKCFpc0luU3R1YihzZWxmLnJvb3QpKSB7XG4gICAgICAgIHNlbGYucGFyZW50LmlzTW91bnRlZCA9IHNlbGYuaXNNb3VudGVkID0gdHJ1ZVxuICAgICAgICBzZWxmLnRyaWdnZXIoJ21vdW50JylcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ3VubW91bnQnLCBmdW5jdGlvbihrZWVwUm9vdFRhZykge1xuICAgIHZhciBlbCA9IHJvb3QsXG4gICAgICBwID0gZWwucGFyZW50Tm9kZSxcbiAgICAgIHB0YWcsXG4gICAgICB0YWdJbmRleCA9IF9fdmlydHVhbERvbS5pbmRleE9mKHNlbGYpXG5cbiAgICBzZWxmLnRyaWdnZXIoJ2JlZm9yZS11bm1vdW50JylcblxuICAgIC8vIHJlbW92ZSB0aGlzIHRhZyBpbnN0YW5jZSBmcm9tIHRoZSBnbG9iYWwgdmlydHVhbERvbSB2YXJpYWJsZVxuICAgIGlmICh+dGFnSW5kZXgpXG4gICAgICBfX3ZpcnR1YWxEb20uc3BsaWNlKHRhZ0luZGV4LCAxKVxuXG4gICAgaWYgKHApIHtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudClcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGZyb20gdGhlIHBhcmVudCB0YWdzIG9iamVjdFxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbmVzdGVkIHRhZ3Mgd2l0aCBzYW1lIG5hbWUuLlxuICAgICAgICAvLyByZW1vdmUgdGhpcyBlbGVtZW50IGZvcm0gdGhlIGFycmF5XG4gICAgICAgIGlmIChpc0FycmF5KHB0YWcudGFnc1t0YWdOYW1lXSkpXG4gICAgICAgICAgZWFjaChwdGFnLnRhZ3NbdGFnTmFtZV0sIGZ1bmN0aW9uKHRhZywgaSkge1xuICAgICAgICAgICAgaWYgKHRhZy5fcmlvdF9pZCA9PSBzZWxmLl9yaW90X2lkKVxuICAgICAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0uc3BsaWNlKGksIDEpXG4gICAgICAgICAgfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IGRlbGV0ZSB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGVsc2VcbiAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpXG5cbiAgICAgIGlmICgha2VlcFJvb3RUYWcpXG4gICAgICAgIHAucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gdGhlIHJpb3QtdGFnIGFuZCB0aGUgZGF0YS1pcyBhdHRyaWJ1dGVzIGFyZW4ndCBuZWVkZWQgYW55bW9yZSwgcmVtb3ZlIHRoZW1cbiAgICAgICAgcmVtQXR0cihwLCBSSU9UX1RBR19JUylcbiAgICAgICAgcmVtQXR0cihwLCBSSU9UX1RBRykgLy8gdGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gcmlvdCAzLjAuMFxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ZpcnRzKSB7XG4gICAgICBlYWNoKHRoaXMuX3ZpcnRzLCBmdW5jdGlvbih2KSB7XG4gICAgICAgIGlmICh2LnBhcmVudE5vZGUpIHYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLnRyaWdnZXIoJ3VubW91bnQnKVxuICAgIHRvZ2dsZSgpXG4gICAgc2VsZi5vZmYoJyonKVxuICAgIHNlbGYuaXNNb3VudGVkID0gZmFsc2VcbiAgICBkZWxldGUgcm9vdC5fdGFnXG5cbiAgfSlcblxuICAvLyBwcm94eSBmdW5jdGlvbiB0byBiaW5kIHVwZGF0ZXNcbiAgLy8gZGlzcGF0Y2hlZCBmcm9tIGEgcGFyZW50IHRhZ1xuICBmdW5jdGlvbiBvbkNoaWxkVXBkYXRlKGRhdGEpIHsgc2VsZi51cGRhdGUoZGF0YSwgdHJ1ZSkgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZShpc01vdW50KSB7XG5cbiAgICAvLyBtb3VudC91bm1vdW50IGNoaWxkcmVuXG4gICAgZWFjaChjaGlsZFRhZ3MsIGZ1bmN0aW9uKGNoaWxkKSB7IGNoaWxkW2lzTW91bnQgPyAnbW91bnQnIDogJ3VubW91bnQnXSgpIH0pXG5cbiAgICAvLyBsaXN0ZW4vdW5saXN0ZW4gcGFyZW50IChldmVudHMgZmxvdyBvbmUgd2F5IGZyb20gcGFyZW50IHRvIGNoaWxkcmVuKVxuICAgIGlmICghcGFyZW50KSByZXR1cm5cbiAgICB2YXIgZXZ0ID0gaXNNb3VudCA/ICdvbicgOiAnb2ZmJ1xuXG4gICAgLy8gdGhlIGxvb3AgdGFncyB3aWxsIGJlIGFsd2F5cyBpbiBzeW5jIHdpdGggdGhlIHBhcmVudCBhdXRvbWF0aWNhbGx5XG4gICAgaWYgKGlzTG9vcClcbiAgICAgIHBhcmVudFtldnRdKCd1bm1vdW50Jywgc2VsZi51bm1vdW50KVxuICAgIGVsc2Uge1xuICAgICAgcGFyZW50W2V2dF0oJ3VwZGF0ZScsIG9uQ2hpbGRVcGRhdGUpW2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXG4gICAgfVxuICB9XG5cblxuICAvLyBuYW1lZCBlbGVtZW50cyBhdmFpbGFibGUgZm9yIGZuXG4gIHBhcnNlTmFtZWRFbGVtZW50cyhkb20sIHRoaXMsIGNoaWxkVGFncylcblxufVxuLyoqXG4gKiBBdHRhY2ggYW4gZXZlbnQgdG8gYSBET00gbm9kZVxuICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIGV2ZW50IG5hbWVcbiAqIEBwYXJhbSB7IEZ1bmN0aW9uIH0gaGFuZGxlciAtIGV2ZW50IGNhbGxiYWNrXG4gKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBkb20gbm9kZVxuICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gdGFnIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcihuYW1lLCBoYW5kbGVyLCBkb20sIHRhZykge1xuXG4gIGRvbVtuYW1lXSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgIHZhciBwdGFnID0gdGFnLl9wYXJlbnQsXG4gICAgICBpdGVtID0gdGFnLl9pdGVtLFxuICAgICAgZWxcblxuICAgIGlmICghaXRlbSlcbiAgICAgIHdoaWxlIChwdGFnICYmICFpdGVtKSB7XG4gICAgICAgIGl0ZW0gPSBwdGFnLl9pdGVtXG4gICAgICAgIHB0YWcgPSBwdGFnLl9wYXJlbnRcbiAgICAgIH1cblxuICAgIC8vIGNyb3NzIGJyb3dzZXIgZXZlbnQgZml4XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XG5cbiAgICAvLyBvdmVycmlkZSB0aGUgZXZlbnQgcHJvcGVydGllc1xuICAgIGlmIChpc1dyaXRhYmxlKGUsICdjdXJyZW50VGFyZ2V0JykpIGUuY3VycmVudFRhcmdldCA9IGRvbVxuICAgIGlmIChpc1dyaXRhYmxlKGUsICd0YXJnZXQnKSkgZS50YXJnZXQgPSBlLnNyY0VsZW1lbnRcbiAgICBpZiAoaXNXcml0YWJsZShlLCAnd2hpY2gnKSkgZS53aGljaCA9IGUuY2hhckNvZGUgfHwgZS5rZXlDb2RlXG5cbiAgICBlLml0ZW0gPSBpdGVtXG5cbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3VyIChieSBkZWZhdWx0KVxuICAgIGlmIChoYW5kbGVyLmNhbGwodGFnLCBlKSAhPT0gdHJ1ZSAmJiAhL3JhZGlvfGNoZWNrLy50ZXN0KGRvbS50eXBlKSkge1xuICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCFlLnByZXZlbnRVcGRhdGUpIHtcbiAgICAgIGVsID0gaXRlbSA/IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyhwdGFnKSA6IHRhZ1xuICAgICAgZWwudXBkYXRlKClcbiAgICB9XG5cbiAgfVxuXG59XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBET00gbm9kZSByZXBsYWNpbmcgYW5vdGhlciBvbmUgKHVzZWQgYnkgaWYtIGF0dHJpYnV0ZSlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcm9vdCAtIHBhcmVudCBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG5vZGUgLSBub2RlIHJlcGxhY2VkXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGJlZm9yZSAtIG5vZGUgYWRkZWRcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0VG8ocm9vdCwgbm9kZSwgYmVmb3JlKSB7XG4gIGlmICghcm9vdCkgcmV0dXJuXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKGJlZm9yZSwgbm9kZSlcbiAgcm9vdC5yZW1vdmVDaGlsZChub2RlKVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZXhwcmVzc2lvbnMgaW4gYSBUYWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBleHByZXNzaW9ucyAtIGV4cHJlc3Npb24gdGhhdCBtdXN0IGJlIHJlIGV2YWx1YXRlZFxuICogQHBhcmFtICAgeyBUYWcgfSB0YWcgLSB0YWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCB0YWcpIHtcblxuICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByLCBpKSB7XG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICBhdHRyTmFtZSA9IGV4cHIuYXR0cixcbiAgICAgIHZhbHVlID0gdG1wbChleHByLmV4cHIsIHRhZyksXG4gICAgICBwYXJlbnQgPSBleHByLnBhcmVudCB8fCBleHByLmRvbS5wYXJlbnROb2RlXG5cbiAgICBpZiAoZXhwci5ib29sKSB7XG4gICAgICB2YWx1ZSA9ICEhdmFsdWVcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHZhbHVlID0gJydcbiAgICB9XG5cbiAgICAvLyAjMTYzODogcmVncmVzc2lvbiBvZiAjMTYxMiwgdXBkYXRlIHRoZSBkb20gb25seSBpZiB0aGUgdmFsdWUgb2YgdGhlXG4gICAgLy8gZXhwcmVzc2lvbiB3YXMgY2hhbmdlZFxuICAgIGlmIChleHByLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gdGV4dGFyZWEgYW5kIHRleHQgbm9kZXMgaGFzIG5vIGF0dHJpYnV0ZSBuYW1lXG4gICAgaWYgKCFhdHRyTmFtZSkge1xuICAgICAgLy8gYWJvdXQgIzgxNSB3L28gcmVwbGFjZTogdGhlIGJyb3dzZXIgY29udmVydHMgdGhlIHZhbHVlIHRvIGEgc3RyaW5nLFxuICAgICAgLy8gdGhlIGNvbXBhcmlzb24gYnkgXCI9PVwiIGRvZXMgdG9vLCBidXQgbm90IGluIHRoZSBzZXJ2ZXJcbiAgICAgIHZhbHVlICs9ICcnXG4gICAgICAvLyB0ZXN0IGZvciBwYXJlbnQgYXZvaWRzIGVycm9yIHdpdGggaW52YWxpZCBhc3NpZ25tZW50IHRvIG5vZGVWYWx1ZVxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAvLyBjYWNoZSB0aGUgcGFyZW50IG5vZGUgYmVjYXVzZSBzb21laG93IGl0IHdpbGwgYmVjb21lIG51bGwgb24gSUVcbiAgICAgICAgLy8gb24gdGhlIG5leHQgaXRlcmF0aW9uXG4gICAgICAgIGV4cHIucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGlmIChwYXJlbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgICAgIHBhcmVudC52YWx1ZSA9IHZhbHVlICAgICAgICAgICAgICAgICAgICAvLyAjMTExM1xuICAgICAgICAgIGlmICghSUVfVkVSU0lPTikgZG9tLm5vZGVWYWx1ZSA9IHZhbHVlICAvLyAjMTYyNSBJRSB0aHJvd3MgaGVyZSwgbm9kZVZhbHVlXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgYmUgYXZhaWxhYmxlIG9uICd1cGRhdGVkJ1xuICAgICAgICBlbHNlIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gfn4jMTYxMjogbG9vayBmb3IgY2hhbmdlcyBpbiBkb20udmFsdWUgd2hlbiB1cGRhdGluZyB0aGUgdmFsdWV+flxuICAgIGlmIChhdHRyTmFtZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgaWYgKGRvbS52YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgZG9tLnZhbHVlID0gdmFsdWVcbiAgICAgICAgc2V0QXR0cihkb20sIGF0dHJOYW1lLCB2YWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgb3JpZ2luYWwgYXR0cmlidXRlXG4gICAgICByZW1BdHRyKGRvbSwgYXR0ck5hbWUpXG4gICAgfVxuXG4gICAgLy8gZXZlbnQgaGFuZGxlclxuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgc2V0RXZlbnRIYW5kbGVyKGF0dHJOYW1lLCB2YWx1ZSwgZG9tLCB0YWcpXG5cbiAgICAvLyBpZi0gY29uZGl0aW9uYWxcbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09ICdpZicpIHtcbiAgICAgIHZhciBzdHViID0gZXhwci5zdHViLFxuICAgICAgICBhZGQgPSBmdW5jdGlvbigpIHsgaW5zZXJ0VG8oc3R1Yi5wYXJlbnROb2RlLCBzdHViLCBkb20pIH0sXG4gICAgICAgIHJlbW92ZSA9IGZ1bmN0aW9uKCkgeyBpbnNlcnRUbyhkb20ucGFyZW50Tm9kZSwgZG9tLCBzdHViKSB9XG5cbiAgICAgIC8vIGFkZCB0byBET01cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBpZiAoc3R1Yikge1xuICAgICAgICAgIGFkZCgpXG4gICAgICAgICAgZG9tLmluU3R1YiA9IGZhbHNlXG4gICAgICAgICAgLy8gYXZvaWQgdG8gdHJpZ2dlciB0aGUgbW91bnQgZXZlbnQgaWYgdGhlIHRhZ3MgaXMgbm90IHZpc2libGUgeWV0XG4gICAgICAgICAgLy8gbWF5YmUgd2UgY2FuIG9wdGltaXplIHRoaXMgYXZvaWRpbmcgdG8gbW91bnQgdGhlIHRhZyBhdCBhbGxcbiAgICAgICAgICBpZiAoIWlzSW5TdHViKGRvbSkpIHtcbiAgICAgICAgICAgIHdhbGsoZG9tLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICBpZiAoZWwuX3RhZyAmJiAhZWwuX3RhZy5pc01vdW50ZWQpXG4gICAgICAgICAgICAgICAgZWwuX3RhZy5pc01vdW50ZWQgPSAhIWVsLl90YWcudHJpZ2dlcignbW91bnQnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBmcm9tIERPTVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R1YiA9IGV4cHIuc3R1YiA9IHN0dWIgfHwgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpXG4gICAgICAgIC8vIGlmIHRoZSBwYXJlbnROb2RlIGlzIGRlZmluZWQgd2UgY2FuIGVhc2lseSByZXBsYWNlIHRoZSB0YWdcbiAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKVxuICAgICAgICAgIHJlbW92ZSgpXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSBuZWVkIHRvIHdhaXQgdGhlIHVwZGF0ZWQgZXZlbnRcbiAgICAgICAgZWxzZSAodGFnLnBhcmVudCB8fCB0YWcpLm9uZSgndXBkYXRlZCcsIHJlbW92ZSlcblxuICAgICAgICBkb20uaW5TdHViID0gdHJ1ZVxuICAgICAgfVxuICAgIC8vIHNob3cgLyBoaWRlXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gJ3Nob3cnKSB7XG4gICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09ICdoaWRlJykge1xuICAgICAgZG9tLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICdub25lJyA6ICcnXG5cbiAgICB9IGVsc2UgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgZG9tW2F0dHJOYW1lXSA9IHZhbHVlXG4gICAgICBpZiAodmFsdWUpIHNldEF0dHIoZG9tLCBhdHRyTmFtZSwgYXR0ck5hbWUpXG4gICAgICBpZiAoRklSRUZPWCAmJiBhdHRyTmFtZSA9PT0gJ3NlbGVjdGVkJyAmJiBkb20udGFnTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgZG9tLl9fcmlvdDEzNzQgPSB2YWx1ZSAgIC8vICMxMzc0XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAwIHx8IHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPT0gVF9PQkpFQ1QpIHtcbiAgICAgIC8vIDxpbWcgc3JjPVwieyBleHByIH1cIj5cbiAgICAgIGlmIChzdGFydHNXaXRoKGF0dHJOYW1lLCBSSU9UX1BSRUZJWCkgJiYgYXR0ck5hbWUgIT0gUklPVF9UQUcpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyTmFtZS5zbGljZShSSU9UX1BSRUZJWC5sZW5ndGgpXG4gICAgICB9XG4gICAgICBzZXRBdHRyKGRvbSwgYXR0ck5hbWUsIHZhbHVlKVxuICAgIH1cblxuICB9KVxuXG59XG4vKipcbiAqIFNwZWNpYWxpemVkIGZ1bmN0aW9uIGZvciBsb29waW5nIGFuIGFycmF5LWxpa2UgY29sbGVjdGlvbiB3aXRoIGBlYWNoPXt9YFxuICogQHBhcmFtICAgeyBBcnJheSB9IGVscyAtIGNvbGxlY3Rpb24gb2YgaXRlbXNcbiAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMgeyBBcnJheSB9IHRoZSBhcnJheSBsb29wZWRcbiAqL1xuZnVuY3Rpb24gZWFjaChlbHMsIGZuKSB7XG4gIHZhciBsZW4gPSBlbHMgPyBlbHMubGVuZ3RoIDogMFxuXG4gIGZvciAodmFyIGkgPSAwLCBlbDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZWwgPSBlbHNbaV1cbiAgICAvLyByZXR1cm4gZmFsc2UgLT4gY3VycmVudCBpdGVtIHdhcyByZW1vdmVkIGJ5IGZuIGR1cmluZyB0aGUgbG9vcFxuICAgIGlmIChlbCAhPSBudWxsICYmIGZuKGVsLCBpKSA9PT0gZmFsc2UpIGktLVxuICB9XG4gIHJldHVybiBlbHNcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFRfRlVOQ1RJT04gfHwgZmFsc2UgICAvLyBhdm9pZCBJRSBwcm9ibGVtc1xufVxuXG4vKipcbiAqIEdldCB0aGUgb3V0ZXIgaHRtbCBvZiBhbnkgRE9NIG5vZGUgU1ZHcyBpbmNsdWRlZFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBlbCAtIERPTSBub2RlIHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IGVsLm91dGVySFRNTFxuICovXG5mdW5jdGlvbiBnZXRPdXRlckhUTUwoZWwpIHtcbiAgaWYgKGVsLm91dGVySFRNTCkgcmV0dXJuIGVsLm91dGVySFRNTFxuICAvLyBzb21lIGJyb3dzZXJzIGRvIG5vdCBzdXBwb3J0IG91dGVySFRNTCBvbiB0aGUgU1ZHcyB0YWdzXG4gIGVsc2Uge1xuICAgIHZhciBjb250YWluZXIgPSBta0VsKCdkaXYnKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgcmV0dXJuIGNvbnRhaW5lci5pbm5lckhUTUxcbiAgfVxufVxuXG4vKipcbiAqIFNldCB0aGUgaW5uZXIgaHRtbCBvZiBhbnkgRE9NIG5vZGUgU1ZHcyBpbmNsdWRlZFxuICogQHBhcmFtIHsgT2JqZWN0IH0gY29udGFpbmVyIC0gRE9NIG5vZGUgd2hlcmUgd2Ugd2lsbCBpbmplY3QgdGhlIG5ldyBodG1sXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBodG1sIC0gaHRtbCB0byBpbmplY3RcbiAqL1xuZnVuY3Rpb24gc2V0SW5uZXJIVE1MKGNvbnRhaW5lciwgaHRtbCkge1xuICBpZiAodHlwZW9mIGNvbnRhaW5lci5pbm5lckhUTUwgIT0gVF9VTkRFRikgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWxcbiAgLy8gc29tZSBicm93c2VycyBkbyBub3Qgc3VwcG9ydCBpbm5lckhUTUwgb24gdGhlIFNWR3MgdGFnc1xuICBlbHNlIHtcbiAgICB2YXIgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCAnYXBwbGljYXRpb24veG1sJylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoXG4gICAgICBjb250YWluZXIub3duZXJEb2N1bWVudC5pbXBvcnROb2RlKGRvYy5kb2N1bWVudEVsZW1lbnQsIHRydWUpXG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIHdldGhlciBhIERPTSBub2RlIG11c3QgYmUgY29uc2lkZXJlZCBwYXJ0IG9mIGFuIHN2ZyBkb2N1bWVudFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgbmFtZSAtIHRhZyBuYW1lXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzU1ZHVGFnKG5hbWUpIHtcbiAgcmV0dXJuIH5TVkdfVEFHU19MSVNULmluZGV4T2YobmFtZSlcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhbiBvYmplY3QsIGV4Y2x1ZGUgbnVsbC5cbiAqIE5PVEU6IFVzZSBpc09iamVjdCh4KSAmJiAhaXNBcnJheSh4KSB0byBleGNsdWRlcyBhcnJheXMuXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHYpIHtcbiAgcmV0dXJuIHYgJiYgdHlwZW9mIHYgPT09IFRfT0JKRUNUICAgICAgICAgLy8gdHlwZW9mIG51bGwgaXMgJ29iamVjdCdcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW55IERPTSBhdHRyaWJ1dGUgZnJvbSBhIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byB1cGRhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5IHdlIHdhbnQgdG8gcmVtb3ZlXG4gKi9cbmZ1bmN0aW9uIHJlbUF0dHIoZG9tLCBuYW1lKSB7XG4gIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIGNvbnRhaW5pbmcgZGFzaGVzIHRvIGNhbWVsIGNhc2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyaW5nIC0gaW5wdXQgc3RyaW5nXG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IG15LXN0cmluZyAtPiBteVN0cmluZ1xuICovXG5mdW5jdGlvbiB0b0NhbWVsKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLy0oXFx3KS9nLCBmdW5jdGlvbihfLCBjKSB7XG4gICAgcmV0dXJuIGMudG9VcHBlckNhc2UoKVxuICB9KVxufVxuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgb2YgYW55IERPTSBhdHRyaWJ1dGUgb24gYSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB3ZSB3YW50IHRvIGdldFxuICogQHJldHVybnMgeyBTdHJpbmcgfCB1bmRlZmluZWQgfSBuYW1lIG9mIHRoZSBub2RlIGF0dHJpYnV0ZSB3aGV0aGVyIGl0IGV4aXN0c1xuICovXG5mdW5jdGlvbiBnZXRBdHRyKGRvbSwgbmFtZSkge1xuICByZXR1cm4gZG9tLmdldEF0dHJpYnV0ZShuYW1lKVxufVxuXG4vKipcbiAqIFNldCBhbnkgRE9NL1NWRyBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gdXBkYXRlXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byBzZXRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHZhbCAtIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSB3ZSB3YW50IHRvIHNldFxuICovXG5mdW5jdGlvbiBzZXRBdHRyKGRvbSwgbmFtZSwgdmFsKSB7XG4gIHZhciB4bGluayA9IFhMSU5LX1JFR0VYLmV4ZWMobmFtZSlcbiAgaWYgKHhsaW5rICYmIHhsaW5rWzFdKVxuICAgIGRvbS5zZXRBdHRyaWJ1dGVOUyhYTElOS19OUywgeGxpbmtbMV0sIHZhbClcbiAgZWxzZVxuICAgIGRvbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsKVxufVxuXG4vKipcbiAqIERldGVjdCB0aGUgdGFnIGltcGxlbWVudGF0aW9uIGJ5IGEgRE9NIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2UgbmVlZCB0byBwYXJzZSB0byBnZXQgaXRzIHRhZyBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybnMgeyBPYmplY3QgfSBpdCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIGN1c3RvbSB0YWcgKHRlbXBsYXRlIGFuZCBib290IGZ1bmN0aW9uKVxuICovXG5mdW5jdGlvbiBnZXRUYWcoZG9tKSB7XG4gIHJldHVybiBkb20udGFnTmFtZSAmJiBfX3RhZ0ltcGxbZ2V0QXR0cihkb20sIFJJT1RfVEFHX0lTKSB8fFxuICAgIGdldEF0dHIoZG9tLCBSSU9UX1RBRykgfHwgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cbn1cbi8qKlxuICogQWRkIGEgY2hpbGQgdGFnIHRvIGl0cyBwYXJlbnQgaW50byB0aGUgYHRhZ3NgIG9iamVjdFxuICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBjaGlsZCB0YWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIGtleSB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIG5ldyBjaGlsZCB0YWcgd2lsbCBiZSBpbmNsdWRlZFxuICovXG5mdW5jdGlvbiBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHBhcmVudCkge1xuICB2YXIgY2FjaGVkVGFnID0gcGFyZW50LnRhZ3NbdGFnTmFtZV1cblxuICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY2hpbGRyZW4gdGFncyBoYXZpbmcgdGhlIHNhbWUgbmFtZVxuICBpZiAoY2FjaGVkVGFnKSB7XG4gICAgLy8gaWYgdGhlIHBhcmVudCB0YWdzIHByb3BlcnR5IGlzIG5vdCB5ZXQgYW4gYXJyYXlcbiAgICAvLyBjcmVhdGUgaXQgYWRkaW5nIHRoZSBmaXJzdCBjYWNoZWQgdGFnXG4gICAgaWYgKCFpc0FycmF5KGNhY2hlZFRhZykpXG4gICAgICAvLyBkb24ndCBhZGQgdGhlIHNhbWUgdGFnIHR3aWNlXG4gICAgICBpZiAoY2FjaGVkVGFnICE9PSB0YWcpXG4gICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdID0gW2NhY2hlZFRhZ11cbiAgICAvLyBhZGQgdGhlIG5ldyBuZXN0ZWQgdGFnIHRvIHRoZSBhcnJheVxuICAgIGlmICghY29udGFpbnMocGFyZW50LnRhZ3NbdGFnTmFtZV0sIHRhZykpXG4gICAgICBwYXJlbnQudGFnc1t0YWdOYW1lXS5wdXNoKHRhZylcbiAgfSBlbHNlIHtcbiAgICBwYXJlbnQudGFnc1t0YWdOYW1lXSA9IHRhZ1xuICB9XG59XG5cbi8qKlxuICogTW92ZSB0aGUgcG9zaXRpb24gb2YgYSBjdXN0b20gdGFnIGluIGl0cyBwYXJlbnQgdGFnXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHRhZyAtIGNoaWxkIHRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0ga2V5IHdoZXJlIHRoZSB0YWcgd2FzIHN0b3JlZFxuICogQHBhcmFtICAgeyBOdW1iZXIgfSBuZXdQb3MgLSBpbmRleCB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxuICovXG5mdW5jdGlvbiBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBuZXdQb3MpIHtcbiAgdmFyIHBhcmVudCA9IHRhZy5wYXJlbnQsXG4gICAgdGFnc1xuICAvLyBubyBwYXJlbnQgbm8gbW92ZVxuICBpZiAoIXBhcmVudCkgcmV0dXJuXG5cbiAgdGFncyA9IHBhcmVudC50YWdzW3RhZ05hbWVdXG5cbiAgaWYgKGlzQXJyYXkodGFncykpXG4gICAgdGFncy5zcGxpY2UobmV3UG9zLCAwLCB0YWdzLnNwbGljZSh0YWdzLmluZGV4T2YodGFnKSwgMSlbMF0pXG4gIGVsc2UgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGNoaWxkIHRhZyBpbmNsdWRpbmcgaXQgY29ycmVjdGx5IGludG8gaXRzIHBhcmVudFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjaGlsZCAtIGNoaWxkIHRhZyBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gdGFnIG9wdGlvbnMgY29udGFpbmluZyB0aGUgRE9NIG5vZGUgd2hlcmUgdGhlIHRhZyB3aWxsIGJlIG1vdW50ZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gaW5uZXJIVE1MIC0gaW5uZXIgaHRtbCBvZiB0aGUgY2hpbGQgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSBpbnN0YW5jZSBvZiB0aGUgcGFyZW50IHRhZyBpbmNsdWRpbmcgdGhlIGNoaWxkIGN1c3RvbSB0YWdcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gaW5zdGFuY2Ugb2YgdGhlIG5ldyBjaGlsZCB0YWcganVzdCBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGluaXRDaGlsZFRhZyhjaGlsZCwgb3B0cywgaW5uZXJIVE1MLCBwYXJlbnQpIHtcbiAgdmFyIHRhZyA9IG5ldyBUYWcoY2hpbGQsIG9wdHMsIGlubmVySFRNTCksXG4gICAgdGFnTmFtZSA9IGdldFRhZ05hbWUob3B0cy5yb290KSxcbiAgICBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudClcbiAgLy8gZml4IGZvciB0aGUgcGFyZW50IGF0dHJpYnV0ZSBpbiB0aGUgbG9vcGVkIGVsZW1lbnRzXG4gIHRhZy5wYXJlbnQgPSBwdGFnXG4gIC8vIHN0b3JlIHRoZSByZWFsIHBhcmVudCB0YWdcbiAgLy8gaW4gc29tZSBjYXNlcyB0aGlzIGNvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBjdXN0b20gcGFyZW50IHRhZ1xuICAvLyBmb3IgZXhhbXBsZSBpbiBuZXN0ZWQgbG9vcHNcbiAgdGFnLl9wYXJlbnQgPSBwYXJlbnRcblxuICAvLyBhZGQgdGhpcyB0YWcgdG8gdGhlIGN1c3RvbSBwYXJlbnQgdGFnXG4gIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcHRhZylcbiAgLy8gYW5kIGFsc28gdG8gdGhlIHJlYWwgcGFyZW50IHRhZ1xuICBpZiAocHRhZyAhPT0gcGFyZW50KVxuICAgIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcGFyZW50KVxuICAvLyBlbXB0eSB0aGUgY2hpbGQgbm9kZSBvbmNlIHdlIGdvdCBpdHMgdGVtcGxhdGVcbiAgLy8gdG8gYXZvaWQgdGhhdCBpdHMgY2hpbGRyZW4gZ2V0IGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXG4gIG9wdHMucm9vdC5pbm5lckhUTUwgPSAnJ1xuXG4gIHJldHVybiB0YWdcbn1cblxuLyoqXG4gKiBMb29wIGJhY2t3YXJkIGFsbCB0aGUgcGFyZW50cyB0cmVlIHRvIGRldGVjdCB0aGUgZmlyc3QgY3VzdG9tIHBhcmVudCB0YWdcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gdGFnIC0gYSBUYWcgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIGluc3RhbmNlIG9mIHRoZSBmaXJzdCBjdXN0b20gcGFyZW50IHRhZyBmb3VuZFxuICovXG5mdW5jdGlvbiBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcodGFnKSB7XG4gIHZhciBwdGFnID0gdGFnXG4gIHdoaWxlICghZ2V0VGFnKHB0YWcucm9vdCkpIHtcbiAgICBpZiAoIXB0YWcucGFyZW50KSBicmVha1xuICAgIHB0YWcgPSBwdGFnLnBhcmVudFxuICB9XG4gIHJldHVybiBwdGFnXG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBhbiBpbW11dGFibGUgcHJvcGVydHlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZWwgLSBvYmplY3Qgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHNldFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBrZXkgLSBvYmplY3Qga2V5IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIG5ldyBwcm9wZXJ0eVxuKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdGlvbnMgLSBzZXQgdGhlIHByb3Blcnkgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBvcHRpb25zXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gdGhlIGluaXRpYWwgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGVsLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwga2V5LCBleHRlbmQoe1xuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sIG9wdGlvbnMpKVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRhZyBuYW1lIG9mIGFueSBET00gbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IG5hbWUgdG8gaWRlbnRpZnkgdGhpcyBkb20gbm9kZSBpbiByaW90XG4gKi9cbmZ1bmN0aW9uIGdldFRhZ05hbWUoZG9tKSB7XG4gIHZhciBjaGlsZCA9IGdldFRhZyhkb20pLFxuICAgIG5hbWVkVGFnID0gZ2V0QXR0cihkb20sICduYW1lJyksXG4gICAgdGFnTmFtZSA9IG5hbWVkVGFnICYmICF0bXBsLmhhc0V4cHIobmFtZWRUYWcpID9cbiAgICAgICAgICAgICAgICBuYW1lZFRhZyA6XG4gICAgICAgICAgICAgIGNoaWxkID8gY2hpbGQubmFtZSA6IGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICByZXR1cm4gdGFnTmFtZVxufVxuXG4vKipcbiAqIEV4dGVuZCBhbnkgb2JqZWN0IHdpdGggb3RoZXIgcHJvcGVydGllc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBzcmMgLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IHRoZSByZXN1bHRpbmcgZXh0ZW5kZWQgb2JqZWN0XG4gKlxuICogdmFyIG9iaiA9IHsgZm9vOiAnYmF6JyB9XG4gKiBleHRlbmQob2JqLCB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ30pXG4gKiBjb25zb2xlLmxvZyhvYmopID0+IHtiYXI6ICdiYXInLCBmb286ICdiYXInfVxuICpcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKHNyYykge1xuICB2YXIgb2JqLCBhcmdzID0gYXJndW1lbnRzXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgIGlmIChvYmogPSBhcmdzW2ldKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgcHJvcGVydHkgb2YgdGhlIHNvdXJjZSBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICAgICAgICBpZiAoaXNXcml0YWJsZShzcmMsIGtleSkpXG4gICAgICAgICAgc3JjW2tleV0gPSBvYmpba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3JjXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBhcnJheSBjb250YWlucyBhbiBpdGVtXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gYXJyIC0gdGFyZ2V0IGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBpdGVtIC0gaXRlbSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBEb2VzICdhcnInIGNvbnRhaW4gJ2l0ZW0nP1xuICovXG5mdW5jdGlvbiBjb250YWlucyhhcnIsIGl0ZW0pIHtcbiAgcmV0dXJuIH5hcnIuaW5kZXhPZihpdGVtKVxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEga2luZCBvZiBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gYSAtIGFueXRoaW5nXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXMgJ2EnIGFuIGFycmF5P1xuICovXG5mdW5jdGlvbiBpc0FycmF5KGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgfHwgYSBpbnN0YW5jZW9mIEFycmF5IH1cblxuLyoqXG4gKiBEZXRlY3Qgd2hldGhlciBhIHByb3BlcnR5IG9mIGFuIG9iamVjdCBjb3VsZCBiZSBvdmVycmlkZGVuXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBvYmogLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICBrZXkgLSBvYmplY3QgcHJvcGVydHlcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IGlzIHRoaXMgcHJvcGVydHkgd3JpdGFibGU/XG4gKi9cbmZ1bmN0aW9uIGlzV3JpdGFibGUob2JqLCBrZXkpIHtcbiAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSlcbiAgcmV0dXJuIHR5cGVvZiBvYmpba2V5XSA9PT0gVF9VTkRFRiB8fCBwcm9wcyAmJiBwcm9wcy53cml0YWJsZVxufVxuXG5cbi8qKlxuICogV2l0aCB0aGlzIGZ1bmN0aW9uIHdlIGF2b2lkIHRoYXQgdGhlIGludGVybmFsIFRhZyBtZXRob2RzIGdldCBvdmVycmlkZGVuXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRhdGEgLSBvcHRpb25zIHdlIHdhbnQgdG8gdXNlIHRvIGV4dGVuZCB0aGUgdGFnIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGNsZWFuIG9iamVjdCB3aXRob3V0IGNvbnRhaW5pbmcgdGhlIHJpb3QgaW50ZXJuYWwgcmVzZXJ2ZWQgd29yZHNcbiAqL1xuZnVuY3Rpb24gY2xlYW5VcERhdGEoZGF0YSkge1xuICBpZiAoIShkYXRhIGluc3RhbmNlb2YgVGFnKSAmJiAhKGRhdGEgJiYgdHlwZW9mIGRhdGEudHJpZ2dlciA9PSBUX0ZVTkNUSU9OKSlcbiAgICByZXR1cm4gZGF0YVxuXG4gIHZhciBvID0ge31cbiAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICBpZiAoIVJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVC50ZXN0KGtleSkpIG9ba2V5XSA9IGRhdGFba2V5XVxuICB9XG4gIHJldHVybiBvXG59XG5cbi8qKlxuICogV2FsayBkb3duIHJlY3Vyc2l2ZWx5IGFsbCB0aGUgY2hpbGRyZW4gdGFncyBzdGFydGluZyBkb20gbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgIGRvbSAtIHN0YXJ0aW5nIG5vZGUgd2hlcmUgd2Ugd2lsbCBzdGFydCB0aGUgcmVjdXJzaW9uXG4gKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayB0byB0cmFuc2Zvcm0gdGhlIGNoaWxkIG5vZGUganVzdCBmb3VuZFxuICovXG5mdW5jdGlvbiB3YWxrKGRvbSwgZm4pIHtcbiAgaWYgKGRvbSkge1xuICAgIC8vIHN0b3AgdGhlIHJlY3Vyc2lvblxuICAgIGlmIChmbihkb20pID09PSBmYWxzZSkgcmV0dXJuXG4gICAgZWxzZSB7XG4gICAgICBkb20gPSBkb20uZmlyc3RDaGlsZFxuXG4gICAgICB3aGlsZSAoZG9tKSB7XG4gICAgICAgIHdhbGsoZG9tLCBmbilcbiAgICAgICAgZG9tID0gZG9tLm5leHRTaWJsaW5nXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWluaW1pemUgcmlzazogb25seSB6ZXJvIG9yIG9uZSBfc3BhY2VfIGJldHdlZW4gYXR0ciAmIHZhbHVlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgaHRtbCAtIGh0bWwgc3RyaW5nIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFwcGx5IG9uIGFueSBhdHRyaWJ1dGUgZm91bmRcbiAqL1xuZnVuY3Rpb24gd2Fsa0F0dHJpYnV0ZXMoaHRtbCwgZm4pIHtcbiAgdmFyIG0sXG4gICAgcmUgPSAvKFstXFx3XSspID89ID8oPzpcIihbXlwiXSopfCcoW14nXSopfCh7W159XSp9KSkvZ1xuXG4gIHdoaWxlIChtID0gcmUuZXhlYyhodG1sKSkge1xuICAgIGZuKG1bMV0udG9Mb3dlckNhc2UoKSwgbVsyXSB8fCBtWzNdIHx8IG1bNF0pXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGEgRE9NIG5vZGUgaXMgaW4gc3R1YiBtb2RlLCB1c2VmdWwgZm9yIHRoZSByaW90ICdpZicgZGlyZWN0aXZlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzSW5TdHViKGRvbSkge1xuICB3aGlsZSAoZG9tKSB7XG4gICAgaWYgKGRvbS5pblN0dWIpIHJldHVybiB0cnVlXG4gICAgZG9tID0gZG9tLnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBnZW5lcmljIERPTSBub2RlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBET00gbm9kZSB3ZSB3YW50IHRvIGNyZWF0ZVxuICogQHBhcmFtICAgeyBCb29sZWFuIH0gaXNTdmcgLSBzaG91bGQgd2UgdXNlIGEgU1ZHIGFzIHBhcmVudCBub2RlP1xuICogQHJldHVybnMgeyBPYmplY3QgfSBET00gbm9kZSBqdXN0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gbWtFbChuYW1lLCBpc1N2Zykge1xuICByZXR1cm4gaXNTdmcgP1xuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJykgOlxuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbn1cblxuLyoqXG4gKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgbXVsdGlwbGUgbm9kZXMgaW4gdGhlIERPTVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIERPTSBzZWxlY3RvclxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuICogQHJldHVybnMgeyBPYmplY3QgfSBkb20gbm9kZXMgZm91bmRcbiAqL1xuZnVuY3Rpb24gJCQoc2VsZWN0b3IsIGN0eCkge1xuICByZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcilcbn1cblxuLyoqXG4gKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdW5pcXVlIGRvbSBzZWxlY3RvclxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0IG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXG4gKi9cbmZ1bmN0aW9uICQoc2VsZWN0b3IsIGN0eCkge1xuICByZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcbn1cblxuLyoqXG4gKiBTaW1wbGUgb2JqZWN0IHByb3RvdHlwYWwgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcGFyZW50IC0gcGFyZW50IG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSBjaGlsZCBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBpbmhlcml0KHBhcmVudCkge1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShwYXJlbnQgfHwgbnVsbClcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5hbWUgcHJvcGVydHkgbmVlZGVkIHRvIGlkZW50aWZ5IGEgRE9NIG5vZGUgaW4gcmlvdFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7IFN0cmluZyB8IHVuZGVmaW5lZCB9IGdpdmUgdXMgYmFjayBhIHN0cmluZyB0byBpZGVudGlmeSB0aGlzIGRvbSBub2RlXG4gKi9cbmZ1bmN0aW9uIGdldE5hbWVkS2V5KGRvbSkge1xuICByZXR1cm4gZ2V0QXR0cihkb20sICdpZCcpIHx8IGdldEF0dHIoZG9tLCAnbmFtZScpXG59XG5cbi8qKlxuICogU2V0IHRoZSBuYW1lZCBwcm9wZXJ0aWVzIG9mIGEgdGFnIGVsZW1lbnRcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gcGFyc2VcbiAqIEBwYXJhbSB7IE9iamVjdCB9IHBhcmVudCAtIHRhZyBpbnN0YW5jZSB3aGVyZSB0aGUgbmFtZWQgZG9tIGVsZW1lbnQgd2lsbCBiZSBldmVudHVhbGx5IGFkZGVkXG4gKiBAcGFyYW0geyBBcnJheSB9IGtleXMgLSBsaXN0IG9mIGFsbCB0aGUgdGFnIGluc3RhbmNlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gc2V0TmFtZWQoZG9tLCBwYXJlbnQsIGtleXMpIHtcbiAgLy8gZ2V0IHRoZSBrZXkgdmFsdWUgd2Ugd2FudCB0byBhZGQgdG8gdGhlIHRhZyBpbnN0YW5jZVxuICB2YXIga2V5ID0gZ2V0TmFtZWRLZXkoZG9tKSxcbiAgICBpc0FycixcbiAgICAvLyBhZGQgdGhlIG5vZGUgZGV0ZWN0ZWQgdG8gYSB0YWcgaW5zdGFuY2UgdXNpbmcgdGhlIG5hbWVkIHByb3BlcnR5XG4gICAgYWRkID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIGF2b2lkIHRvIG92ZXJyaWRlIHRoZSB0YWcgcHJvcGVydGllcyBhbHJlYWR5IHNldFxuICAgICAgaWYgKGNvbnRhaW5zKGtleXMsIGtleSkpIHJldHVyblxuICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIHZhbHVlIGlzIGFuIGFycmF5XG4gICAgICBpc0FyciA9IGlzQXJyYXkodmFsdWUpXG4gICAgICAvLyBpZiB0aGUga2V5IHdhcyBuZXZlciBzZXRcbiAgICAgIGlmICghdmFsdWUpXG4gICAgICAgIC8vIHNldCBpdCBvbmNlIG9uIHRoZSB0YWcgaW5zdGFuY2VcbiAgICAgICAgcGFyZW50W2tleV0gPSBkb21cbiAgICAgIC8vIGlmIGl0IHdhcyBhbiBhcnJheSBhbmQgbm90IHlldCBzZXRcbiAgICAgIGVsc2UgaWYgKCFpc0FyciB8fCBpc0FyciAmJiAhY29udGFpbnModmFsdWUsIGRvbSkpIHtcbiAgICAgICAgLy8gYWRkIHRoZSBkb20gbm9kZSBpbnRvIHRoZSBhcnJheVxuICAgICAgICBpZiAoaXNBcnIpXG4gICAgICAgICAgdmFsdWUucHVzaChkb20pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJlbnRba2V5XSA9IFt2YWx1ZSwgZG9tXVxuICAgICAgfVxuICAgIH1cblxuICAvLyBza2lwIHRoZSBlbGVtZW50cyB3aXRoIG5vIG5hbWVkIHByb3BlcnRpZXNcbiAgaWYgKCFrZXkpIHJldHVyblxuXG4gIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyBrZXkgaGFzIGJlZW4gYWxyZWFkeSBldmFsdWF0ZWRcbiAgaWYgKHRtcGwuaGFzRXhwcihrZXkpKVxuICAgIC8vIHdhaXQgdGhlIGZpcnN0IHVwZGF0ZWQgZXZlbnQgb25seSBvbmNlXG4gICAgcGFyZW50Lm9uZSgnbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGtleSA9IGdldE5hbWVkS2V5KGRvbSlcbiAgICAgIGFkZChwYXJlbnRba2V5XSlcbiAgICB9KVxuICBlbHNlXG4gICAgYWRkKHBhcmVudFtrZXldKVxuXG59XG5cbi8qKlxuICogRmFzdGVyIFN0cmluZyBzdGFydHNXaXRoIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNyYyAtIHNvdXJjZSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyIC0gdGVzdCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gc3RhcnRzV2l0aChzcmMsIHN0cikge1xuICByZXR1cm4gc3JjLnNsaWNlKDAsIHN0ci5sZW5ndGgpID09PSBzdHJcbn1cblxuLyoqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnVuY3Rpb25cbiAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSwgbGljZW5zZSBNSVRcbiAqL1xudmFyIHJBRiA9IChmdW5jdGlvbiAodykge1xuICB2YXIgcmFmID0gdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICAgICAgICAgIHcubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHcud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5cbiAgaWYgKCFyYWYgfHwgL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHcubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHsgIC8vIGJ1Z2d5IGlPUzZcbiAgICB2YXIgbGFzdFRpbWUgPSAwXG5cbiAgICByYWYgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgIHZhciBub3d0aW1lID0gRGF0ZS5ub3coKSwgdGltZW91dCA9IE1hdGgubWF4KDE2IC0gKG5vd3RpbWUgLSBsYXN0VGltZSksIDApXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY2IobGFzdFRpbWUgPSBub3d0aW1lICsgdGltZW91dCkgfSwgdGltZW91dClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJhZlxuXG59KSh3aW5kb3cgfHwge30pXG5cbi8qKlxuICogTW91bnQgYSB0YWcgY3JlYXRpbmcgbmV3IFRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSByb290IC0gZG9tIG5vZGUgd2hlcmUgdGhlIHRhZyB3aWxsIGJlIG1vdW50ZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIG5hbWUgb2YgdGhlIHJpb3QgdGFnIHdlIHdhbnQgdG8gbW91bnRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0cyAtIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgVGFnIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7IFRhZyB9IGEgbmV3IFRhZyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBtb3VudFRvKHJvb3QsIHRhZ05hbWUsIG9wdHMpIHtcbiAgdmFyIHRhZyA9IF9fdGFnSW1wbFt0YWdOYW1lXSxcbiAgICAvLyBjYWNoZSB0aGUgaW5uZXIgSFRNTCB0byBmaXggIzg1NVxuICAgIGlubmVySFRNTCA9IHJvb3QuX2lubmVySFRNTCA9IHJvb3QuX2lubmVySFRNTCB8fCByb290LmlubmVySFRNTFxuXG4gIC8vIGNsZWFyIHRoZSBpbm5lciBodG1sXG4gIHJvb3QuaW5uZXJIVE1MID0gJydcblxuICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSwgaW5uZXJIVE1MKVxuXG4gIGlmICh0YWcgJiYgdGFnLm1vdW50KSB7XG4gICAgdGFnLm1vdW50KClcbiAgICAvLyBhZGQgdGhpcyB0YWcgdG8gdGhlIHZpcnR1YWxEb20gdmFyaWFibGVcbiAgICBpZiAoIWNvbnRhaW5zKF9fdmlydHVhbERvbSwgdGFnKSkgX192aXJ0dWFsRG9tLnB1c2godGFnKVxuICB9XG5cbiAgcmV0dXJuIHRhZ1xufVxuLyoqXG4gKiBSaW90IHB1YmxpYyBhcGlcbiAqL1xuXG4vLyBzaGFyZSBtZXRob2RzIGZvciBvdGhlciByaW90IHBhcnRzLCBlLmcuIGNvbXBpbGVyXG5yaW90LnV0aWwgPSB7IGJyYWNrZXRzOiBicmFja2V0cywgdG1wbDogdG1wbCB9XG5cbi8qKlxuICogQ3JlYXRlIGEgbWl4aW4gdGhhdCBjb3VsZCBiZSBnbG9iYWxseSBzaGFyZWQgYWNyb3NzIGFsbCB0aGUgdGFnc1xuICovXG5yaW90Lm1peGluID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgbWl4aW5zID0ge30sXG4gICAgZ2xvYmFscyA9IG1peGluc1tHTE9CQUxfTUlYSU5dID0ge30sXG4gICAgX2lkID0gMFxuXG4gIC8qKlxuICAgKiBDcmVhdGUvUmV0dXJuIGEgbWl4aW4gYnkgaXRzIG5hbWVcbiAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgbmFtZSAtIG1peGluIG5hbWUgKGdsb2JhbCBtaXhpbiBpZiBvYmplY3QpXG4gICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG1peGluIC0gbWl4aW4gbG9naWNcbiAgICogQHBhcmFtICAgeyBCb29sZWFuIH0gZyAtIGlzIGdsb2JhbD9cbiAgICogQHJldHVybnMgeyBPYmplY3QgfSAgdGhlIG1peGluIGxvZ2ljXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24obmFtZSwgbWl4aW4sIGcpIHtcbiAgICAvLyBVbm5hbWVkIGdsb2JhbFxuICAgIGlmIChpc09iamVjdChuYW1lKSkge1xuICAgICAgcmlvdC5taXhpbignX191bm5hbWVkXycrX2lkKyssIG5hbWUsIHRydWUpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RvcmUgPSBnID8gZ2xvYmFscyA6IG1peGluc1xuXG4gICAgLy8gR2V0dGVyXG4gICAgaWYgKCFtaXhpbikge1xuICAgICAgaWYgKHR5cGVvZiBzdG9yZVtuYW1lXSA9PT0gVF9VTkRFRikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VucmVnaXN0ZXJlZCBtaXhpbjogJyArIG5hbWUpXG4gICAgICB9XG4gICAgICByZXR1cm4gc3RvcmVbbmFtZV1cbiAgICB9XG4gICAgLy8gU2V0dGVyXG4gICAgaWYgKGlzRnVuY3Rpb24obWl4aW4pKSB7XG4gICAgICBleHRlbmQobWl4aW4ucHJvdG90eXBlLCBzdG9yZVtuYW1lXSB8fCB7fSlcbiAgICAgIHN0b3JlW25hbWVdID0gbWl4aW5cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzdG9yZVtuYW1lXSA9IGV4dGVuZChzdG9yZVtuYW1lXSB8fCB7fSwgbWl4aW4pXG4gICAgfVxuICB9XG5cbn0pKClcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcmlvdCB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBuYW1lIC0gbmFtZS9pZCBvZiB0aGUgbmV3IHJpb3QgdGFnXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgaHRtbCAtIHRhZyB0ZW1wbGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGNzcyAtIGN1c3RvbSB0YWcgY3NzXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgYXR0cnMgLSByb290IHRhZyBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSB1c2VyIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IG5hbWUvaWQgb2YgdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAqL1xucmlvdC50YWcgPSBmdW5jdGlvbihuYW1lLCBodG1sLCBjc3MsIGF0dHJzLCBmbikge1xuICBpZiAoaXNGdW5jdGlvbihhdHRycykpIHtcbiAgICBmbiA9IGF0dHJzXG4gICAgaWYgKC9eW1xcd1xcLV0rXFxzPz0vLnRlc3QoY3NzKSkge1xuICAgICAgYXR0cnMgPSBjc3NcbiAgICAgIGNzcyA9ICcnXG4gICAgfSBlbHNlIGF0dHJzID0gJydcbiAgfVxuICBpZiAoY3NzKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY3NzKSkgZm4gPSBjc3NcbiAgICBlbHNlIHN0eWxlTWFuYWdlci5hZGQoY3NzKVxuICB9XG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKClcbiAgX190YWdJbXBsW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiBodG1sLCBhdHRyczogYXR0cnMsIGZuOiBmbiB9XG4gIHJldHVybiBuYW1lXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uIChmb3IgdXNlIGJ5IHRoZSBjb21waWxlcilcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBuYW1lIC0gbmFtZS9pZCBvZiB0aGUgbmV3IHJpb3QgdGFnXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgaHRtbCAtIHRhZyB0ZW1wbGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGNzcyAtIGN1c3RvbSB0YWcgY3NzXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgYXR0cnMgLSByb290IHRhZyBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSB1c2VyIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IG5hbWUvaWQgb2YgdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAqL1xucmlvdC50YWcyID0gZnVuY3Rpb24obmFtZSwgaHRtbCwgY3NzLCBhdHRycywgZm4pIHtcbiAgaWYgKGNzcykgc3R5bGVNYW5hZ2VyLmFkZChjc3MpXG4gIC8vaWYgKGJwYWlyKSByaW90LnNldHRpbmdzLmJyYWNrZXRzID0gYnBhaXJcbiAgX190YWdJbXBsW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiBodG1sLCBhdHRyczogYXR0cnMsIGZuOiBmbiB9XG4gIHJldHVybiBuYW1lXG59XG5cbi8qKlxuICogTW91bnQgYSB0YWcgdXNpbmcgYSBzcGVjaWZpYyB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB0YWcgRE9NIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSB0YWcgaW1wbGVtZW50YXRpb24gbmFtZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gdGFnIGxvZ2ljXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gbmV3IHRhZ3MgaW5zdGFuY2VzXG4gKi9cbnJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3RvciwgdGFnTmFtZSwgb3B0cykge1xuXG4gIHZhciBlbHMsXG4gICAgYWxsVGFncyxcbiAgICB0YWdzID0gW11cblxuICAvLyBoZWxwZXIgZnVuY3Rpb25zXG5cbiAgZnVuY3Rpb24gYWRkUmlvdFRhZ3MoYXJyKSB7XG4gICAgdmFyIGxpc3QgPSAnJ1xuICAgIGVhY2goYXJyLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKCEvW14tXFx3XS8udGVzdChlKSkge1xuICAgICAgICBlID0gZS50cmltKCkudG9Mb3dlckNhc2UoKVxuICAgICAgICBsaXN0ICs9ICcsWycgKyBSSU9UX1RBR19JUyArICc9XCInICsgZSArICdcIl0sWycgKyBSSU9UX1RBRyArICc9XCInICsgZSArICdcIl0nXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gbGlzdFxuICB9XG5cbiAgZnVuY3Rpb24gc2VsZWN0QWxsVGFncygpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9fdGFnSW1wbClcbiAgICByZXR1cm4ga2V5cyArIGFkZFJpb3RUYWdzKGtleXMpXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoVGFncyhyb290KSB7XG4gICAgaWYgKHJvb3QudGFnTmFtZSkge1xuICAgICAgdmFyIHJpb3RUYWcgPSBnZXRBdHRyKHJvb3QsIFJJT1RfVEFHX0lTKSB8fCBnZXRBdHRyKHJvb3QsIFJJT1RfVEFHKVxuXG4gICAgICAvLyBoYXZlIHRhZ05hbWU/IGZvcmNlIHJpb3QtdGFnIHRvIGJlIHRoZSBzYW1lXG4gICAgICBpZiAodGFnTmFtZSAmJiByaW90VGFnICE9PSB0YWdOYW1lKSB7XG4gICAgICAgIHJpb3RUYWcgPSB0YWdOYW1lXG4gICAgICAgIHNldEF0dHIocm9vdCwgUklPVF9UQUdfSVMsIHRhZ05hbWUpXG4gICAgICAgIHNldEF0dHIocm9vdCwgUklPVF9UQUcsIHRhZ05hbWUpIC8vIHRoaXMgd2lsbCBiZSByZW1vdmVkIGluIHJpb3QgMy4wLjBcbiAgICAgIH1cbiAgICAgIHZhciB0YWcgPSBtb3VudFRvKHJvb3QsIHJpb3RUYWcgfHwgcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIG9wdHMpXG5cbiAgICAgIGlmICh0YWcpIHRhZ3MucHVzaCh0YWcpXG4gICAgfSBlbHNlIGlmIChyb290Lmxlbmd0aCkge1xuICAgICAgZWFjaChyb290LCBwdXNoVGFncykgICAvLyBhc3N1bWUgbm9kZUxpc3RcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLSBtb3VudCBjb2RlIC0tLS0tXG5cbiAgLy8gaW5qZWN0IHN0eWxlcyBpbnRvIERPTVxuICBzdHlsZU1hbmFnZXIuaW5qZWN0KClcblxuICBpZiAoaXNPYmplY3QodGFnTmFtZSkpIHtcbiAgICBvcHRzID0gdGFnTmFtZVxuICAgIHRhZ05hbWUgPSAwXG4gIH1cblxuICAvLyBjcmF3bCB0aGUgRE9NIHRvIGZpbmQgdGhlIHRhZ1xuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSBUX1NUUklORykge1xuICAgIGlmIChzZWxlY3RvciA9PT0gJyonKVxuICAgICAgLy8gc2VsZWN0IGFsbCB0aGUgdGFncyByZWdpc3RlcmVkXG4gICAgICAvLyBhbmQgYWxzbyB0aGUgdGFncyBmb3VuZCB3aXRoIHRoZSByaW90LXRhZyBhdHRyaWJ1dGUgc2V0XG4gICAgICBzZWxlY3RvciA9IGFsbFRhZ3MgPSBzZWxlY3RBbGxUYWdzKClcbiAgICBlbHNlXG4gICAgICAvLyBvciBqdXN0IHRoZSBvbmVzIG5hbWVkIGxpa2UgdGhlIHNlbGVjdG9yXG4gICAgICBzZWxlY3RvciArPSBhZGRSaW90VGFncyhzZWxlY3Rvci5zcGxpdCgvLCAqLykpXG5cbiAgICAvLyBtYWtlIHN1cmUgdG8gcGFzcyBhbHdheXMgYSBzZWxlY3RvclxuICAgIC8vIHRvIHRoZSBxdWVyeVNlbGVjdG9yQWxsIGZ1bmN0aW9uXG4gICAgZWxzID0gc2VsZWN0b3IgPyAkJChzZWxlY3RvcikgOiBbXVxuICB9XG4gIGVsc2VcbiAgICAvLyBwcm9iYWJseSB5b3UgaGF2ZSBwYXNzZWQgYWxyZWFkeSBhIHRhZyBvciBhIE5vZGVMaXN0XG4gICAgZWxzID0gc2VsZWN0b3JcblxuICAvLyBzZWxlY3QgYWxsIHRoZSByZWdpc3RlcmVkIGFuZCBtb3VudCB0aGVtIGluc2lkZSB0aGVpciByb290IGVsZW1lbnRzXG4gIGlmICh0YWdOYW1lID09PSAnKicpIHtcbiAgICAvLyBnZXQgYWxsIGN1c3RvbSB0YWdzXG4gICAgdGFnTmFtZSA9IGFsbFRhZ3MgfHwgc2VsZWN0QWxsVGFncygpXG4gICAgLy8gaWYgdGhlIHJvb3QgZWxzIGl0J3MganVzdCBhIHNpbmdsZSB0YWdcbiAgICBpZiAoZWxzLnRhZ05hbWUpXG4gICAgICBlbHMgPSAkJCh0YWdOYW1lLCBlbHMpXG4gICAgZWxzZSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSBjaGlsZHJlbiBmb3IgYWxsIHRoZSBkaWZmZXJlbnQgcm9vdCBlbGVtZW50c1xuICAgICAgdmFyIG5vZGVMaXN0ID0gW11cbiAgICAgIGVhY2goZWxzLCBmdW5jdGlvbiAoX2VsKSB7XG4gICAgICAgIG5vZGVMaXN0LnB1c2goJCQodGFnTmFtZSwgX2VsKSlcbiAgICAgIH0pXG4gICAgICBlbHMgPSBub2RlTGlzdFxuICAgIH1cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDBcbiAgfVxuXG4gIHB1c2hUYWdzKGVscylcblxuICByZXR1cm4gdGFnc1xufVxuXG4vKipcbiAqIFVwZGF0ZSBhbGwgdGhlIHRhZ3MgaW5zdGFuY2VzIGNyZWF0ZWRcbiAqIEByZXR1cm5zIHsgQXJyYXkgfSBhbGwgdGhlIHRhZ3MgaW5zdGFuY2VzXG4gKi9cbnJpb3QudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBlYWNoKF9fdmlydHVhbERvbSwgZnVuY3Rpb24odGFnKSB7XG4gICAgdGFnLnVwZGF0ZSgpXG4gIH0pXG59XG5cbi8qKlxuICogRXhwb3J0IHRoZSBWaXJ0dWFsIERPTVxuICovXG5yaW90LnZkb20gPSBfX3ZpcnR1YWxEb21cblxuLyoqXG4gKiBFeHBvcnQgdGhlIFRhZyBjb25zdHJ1Y3RvclxuICovXG5yaW90LlRhZyA9IFRhZ1xuICAvLyBzdXBwb3J0IENvbW1vbkpTLCBBTUQgJiBicm93c2VyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gVF9PQkpFQ1QpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByaW90XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFRfRlVOQ1RJT04gJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09IFRfVU5ERUYpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gcmlvdCB9KVxuICBlbHNlXG4gICAgd2luZG93LnJpb3QgPSByaW90XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB2b2lkIDApO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jpb3QvcmlvdC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19hbWRfb3B0aW9uc19fO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vYW1kLW9wdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicmVxdWlyZSgnLi90YWdzL2NvbW1vbi9uYXZiYXInKTtcbnJlcXVpcmUoJy4vdGFncy9jb21tb24vY3JlZGl0Jyk7XG5yZXF1aXJlKCcuL3RhZ3MvY29tbW9uL3V0aWxzJyk7XG5yZXF1aXJlKCcuL3RhZ3MvbWVudS1saXN0Jyk7XG5yZXF1aXJlKCcuL3RhZ3MvbWVudS1wb3B1cCcpO1xucmVxdWlyZSgnLi90YWdzL2NvbW1vbi9mb290ZXItbmF2Jyk7XG5cbnJpb3Qucm91dGUoJy8nLCAoKSA9PiB7XG5cdHJlcXVpcmUoJy4vdGFncy9ob21lJyk7XG5cdHJlcXVpcmUoJy4vdGFncy9uZXh0Jyk7XG5cdHJlcXVpcmUoJy4vdGFncy9jdXJmZXcnKTtcblxuXHRyaW90Lm1vdW50KCdyb3V0ZScsICdob21lJyk7XG59KTtcblxucmlvdC5yb3V0ZSgnL2FyY2hpdmUvKi8qJywgKHllYXIsIG1vbnRoKSA9PiB7XG5cdHJlcXVpcmUoJy4vdGFncy9hcmNoaXZlJyk7XG5cblx0cmlvdC5tb3VudCgncm91dGUnLCAnYXJjaGl2ZScsIHtcblx0XHR5ZWFyLFxuXHRcdG1vbnRoXG5cdH0pO1xufSk7XG5cbnJpb3Qucm91dGUoJy9zZWFyY2gvKi8qLyonLCAod29yZCwgeWVhciwgbW9udGgpID0+IHtcblx0cmVxdWlyZSgnLi90YWdzL3NlYXJjaCcpO1xuXG5cdHJpb3QubW91bnQoJ3JvdXRlJywgJ3NlYXJjaCcsIHtcblx0XHR3b3JkLFxuXHRcdHllYXIsXG5cdFx0bW9udGhcblx0fSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRyaW90LnJvdXRlLnN0YXJ0KHRydWUpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9yb3V0ZXIuanMiLCJcbnJpb3QudGFnMignbmF2YmFyJywgJzxoZWFkZXIgY2xhc3M9XCJuYXZiYXJcIj4gPGRpdiBjbGFzcz1cImxlZnRcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZiYXItYnRuLWljb25cIj48c3BhbiBjbGFzcz1cImlvbi1pb3MtY2FsZW5kYXItb3V0bGluZVwiPjwvc3Bhbj48L2J1dHRvbj4gPC9kaXY+IDxoMT7jg4fjgrjjgr/jg6vniYgg55m96bOl5a+u54yu56uL6KGoPC9oMT4gPC9oZWFkZXI+JywgJ25hdmJhciAubmF2YmFyLFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyLFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXJ7IHBvc2l0aW9uOiByZWxhdGl2ZTsgd2lkdGg6IDEwMCU7IGhlaWdodDogNDBweDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNiM2IzYjM7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmMGYwZjAsICNkZGQpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2YwZjBmMCwgI2RkZCk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZjBmMGYwLCAjZGRkKTsgfSBuYXZiYXIgLm5hdmJhciBoMSxbcmlvdC10YWc9XCJuYXZiYXJcIl0gLm5hdmJhciBoMSxbZGF0YS1pcz1cIm5hdmJhclwiXSAubmF2YmFyIGgxeyBtYXJnaW46IDAgYXV0bzsgZm9udC1zaXplOiAxNnB4OyB0ZXh0LXNoYWRvdzogMXB4IDFweCAwICNmZmY7IHRleHQtYWxpZ246IGNlbnRlcjsgbGluZS1oZWlnaHQ6IDQwcHg7IGNvbG9yOiAjM2UzZTNlOyBjdXJzb3I6IGRlZmF1bHQ7IH0gbmF2YmFyIC5uYXZiYXIgLmxlZnQsW3Jpb3QtdGFnPVwibmF2YmFyXCJdIC5uYXZiYXIgLmxlZnQsW2RhdGEtaXM9XCJuYXZiYXJcIl0gLm5hdmJhciAubGVmdHsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IH0nLCAnJywgZnVuY3Rpb24ob3B0cykge1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vbmF2YmFyLnRhZyIsIlxucmlvdC50YWcyKCdjcmVkaXQnLCAnPGZvb3RlciBjbGFzcz1cImdsb2JhbC1mb290ZXJcIj4gPHA+44GT44Gu44K144Kk44OI44Gv6Z2e5YWs6KqN44Gn5Yud5omL44Gr6YGL5Za244GX44Gm44GE44G+44GZPC9wPiA8L2Zvb3Rlcj4nLCAnY3JlZGl0IC5nbG9iYWwtZm9vdGVyLFtyaW90LXRhZz1cImNyZWRpdFwiXSAuZ2xvYmFsLWZvb3RlcixbZGF0YS1pcz1cImNyZWRpdFwiXSAuZ2xvYmFsLWZvb3Rlcnsgd2lkdGg6IDEwMCU7IGhlaWdodDogNDBweDsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNiM2IzYjM7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNkZGQsICNmMGYwZjApOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2RkZCwgI2YwZjBmMCk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZGRkLCAjZjBmMGYwKTsgfSBjcmVkaXQgLmdsb2JhbC1mb290ZXIgcCxbcmlvdC10YWc9XCJjcmVkaXRcIl0gLmdsb2JhbC1mb290ZXIgcCxbZGF0YS1pcz1cImNyZWRpdFwiXSAuZ2xvYmFsLWZvb3RlciBweyB0ZXh0LWFsaWduOiBjZW50ZXI7IHRleHQtc2hhZG93OiAxcHggMXB4IDAgI2ZmZjsgZm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogNDBweDsgY29sb3I6ICMzZTNlM2U7IGN1cnNvcjogZGVmYXVsdDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy90YWdzL2NvbW1vbi9jcmVkaXQudGFnIiwiXG5yaW90LnRhZzIoJ2J0bicsICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwie29uQ2xpY2t9XCIgY2xhc3M9XCJidG5cIj48c3BhbiBjbGFzcz1cImljb25cIj48c3BhbiBlYWNoPVwie2ljb24gaW4gb3B0cy5pY29uc31cIiBjbGFzcz1cImlvbi17aWNvbn1cIj48L3NwYW4+PC9zcGFuPntvcHRzLnRleHR9PC9idXR0b24+JywgJ2J0biAuYnRuLFtyaW90LXRhZz1cImJ0blwiXSAuYnRuLFtkYXRhLWlzPVwiYnRuXCJdIC5idG57IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogOTglOyBoZWlnaHQ6IDQwcHg7IG1hcmdpbjogMTBweCBhdXRvOyBwb3NpdGlvbjogcmVsYXRpdmU7IGJvcmRlcjogMXB4IHNvbGlkICNjY2M7IGJvcmRlci1yYWRpdXM6IDE1cHg7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmZGZkZmQsICNmMWYxZjEpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2ZkZmRmZCwgI2YxZjFmMSk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZmRmZGZkLCAjZjFmMWYxKTsgYm94LXNoYWRvdzogMCAycHggM3B4ICNjY2M7IGxpbmUtaGVpZ2h0OiA0MHB4OyBjb2xvcjogIzJlMzQzNjsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDEwMCU7IG91dGxpbmU6IG5vbmU7IGN1cnNvcjogcG9pbnRlcjsgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyB9IGJ0biAuYnRuOmhvdmVyLFtyaW90LXRhZz1cImJ0blwiXSAuYnRuOmhvdmVyLFtkYXRhLWlzPVwiYnRuXCJdIC5idG46aG92ZXJ7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmOGY4ZjgsICNlMWUxZTEpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2Y4ZjhmOCwgI2UxZTFlMSk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZjhmOGY4LCAjZTFlMWUxKTsgfSBidG4gLmJ0bjphY3RpdmUsW3Jpb3QtdGFnPVwiYnRuXCJdIC5idG46YWN0aXZlLFtkYXRhLWlzPVwiYnRuXCJdIC5idG46YWN0aXZleyBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZDFkMWQxLCAjZGZkZmRmKTsgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KCNkMWQxZDEsICNkZmRmZGYpOyBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoI2QxZDFkMSwgI2RmZGZkZik7IH0gYnRuIC5idG4gLmljb24sW3Jpb3QtdGFnPVwiYnRuXCJdIC5idG4gLmljb24sW2RhdGEtaXM9XCJidG5cIl0gLmJ0biAuaWNvbnsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDVweDsgd2lkdGg6IDQwcHg7IGhlaWdodDogNDBweDsgbGluZS1oZWlnaHQ6IDQwcHg7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAyNXB4OyBjb2xvcjogIzkzOTM5MzsgfSBidG4gLmJ0biAuaWNvbiA+IHNwYW46bnRoLWNoaWxkKDIpLFtyaW90LXRhZz1cImJ0blwiXSAuYnRuIC5pY29uID4gc3BhbjpudGgtY2hpbGQoMiksW2RhdGEtaXM9XCJidG5cIl0gLmJ0biAuaWNvbiA+IHNwYW46bnRoLWNoaWxkKDIpeyBtYXJnaW4tbGVmdDogNXB4OyB9JywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciBhbmltZSA9IHJlcXVpcmUoJ2FuaW1lanMnKTtcblxudGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIOOCueODoOODvOOCueOCueOCr+ODreODvOODq1xuICAgIGlmIChvcHRzLnNjcm9sbGVyKSB7XG4gICAgICAgIGlmICghb3B0cy5zY3JvbGxlci50YXJnZXQpIHJldHVybjtcbiAgICAgICAgdmFyIHRhcmdldCA9IG9wdHMuc2Nyb2xsZXIudGFyZ2V0O1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBvcHRzLnNjcm9sbGVyLmR1cmF0aW9uIHx8IDIwMDtcbiAgICAgICAgdmFyIG9mZnNldCA9IG9wdHMuc2Nyb2xsZXIub2Zmc2V0IHx8IDA7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IG9wdHMuc2Nyb2xsZXIuY2FsbGJhY2s7XG4gICAgICAgIHZhciAkdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTtcbiAgICAgICAgaWYgKCEkdGFyZ2V0KSByZXR1cm47XG4gICAgICAgIHZhciBwb3MgPSAkdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIG9mZnNldDtcbiAgICAgICAgdmFyIHBhZ2VZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICB2YXIgcGFnZVggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIC8vIOOCouODi+ODoeODvOOCt+ODp+ODs1xuICAgICAgICBhbmltZSh7XG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0ZXAuY3VycmVudFRpbWUsIHN0ZXAuZHVyYXRpb24sIHN0ZXAuZW5kZWQsIHN0ZXAucHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhwYWdlWCwgcGFnZVkgKyBwb3MgKiBzdGVwLnByb2dyZXNzIC8gMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIOODquODs+OCr1xuICAgIGlmIChvcHRzLmhyZWYpIHtcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IG9wdHMuaHJlZjtcbiAgICB9XG59O1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vdXRpbHMudGFnIiwiLypcbiAqIEFuaW1lIHYxLjEuMVxuICogaHR0cDovL2FuaW1lLWpzLmNvbVxuICogSmF2YVNjcmlwdCBhbmltYXRpb24gZW5naW5lXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgSnVsaWFuIEdhcm5pZXJcbiAqIGh0dHA6Ly9qdWxpYW5nYXJuaWVyLmNvbVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QuYW5pbWUgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB2ZXJzaW9uID0gJzEuMS4xJztcblxuICAvLyBEZWZhdWx0c1xuXG4gIHZhciBkZWZhdWx0U2V0dGluZ3MgPSB7XG4gICAgZHVyYXRpb246IDEwMDAsXG4gICAgZGVsYXk6IDAsXG4gICAgbG9vcDogZmFsc2UsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgZGlyZWN0aW9uOiAnbm9ybWFsJyxcbiAgICBlYXNpbmc6ICdlYXNlT3V0RWxhc3RpYycsXG4gICAgZWxhc3RpY2l0eTogNDAwLFxuICAgIHJvdW5kOiBmYWxzZSxcbiAgICBiZWdpbjogdW5kZWZpbmVkLFxuICAgIHVwZGF0ZTogdW5kZWZpbmVkLFxuICAgIGNvbXBsZXRlOiB1bmRlZmluZWRcbiAgfVxuXG4gIC8vIFRyYW5zZm9ybXNcblxuICB2YXIgdmFsaWRUcmFuc2Zvcm1zID0gWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknLCAndHJhbnNsYXRlWicsICdyb3RhdGUnLCAncm90YXRlWCcsICdyb3RhdGVZJywgJ3JvdGF0ZVonLCAnc2NhbGUnLCAnc2NhbGVYJywgJ3NjYWxlWScsICdzY2FsZVonLCAnc2tld1gnLCAnc2tld1knXTtcbiAgdmFyIHRyYW5zZm9ybSwgdHJhbnNmb3JtU3RyID0gJ3RyYW5zZm9ybSc7XG5cbiAgLy8gVXRpbHNcblxuICB2YXIgaXMgPSB7XG4gICAgYXJyOiBmdW5jdGlvbihhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIH0sXG4gICAgb2JqOiBmdW5jdGlvbihhKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkuaW5kZXhPZignT2JqZWN0JykgPiAtMSB9LFxuICAgIHN2ZzogZnVuY3Rpb24oYSkgeyByZXR1cm4gYSBpbnN0YW5jZW9mIFNWR0VsZW1lbnQgfSxcbiAgICBkb206IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGEubm9kZVR5cGUgfHwgaXMuc3ZnKGEpIH0sXG4gICAgbnVtOiBmdW5jdGlvbihhKSB7IHJldHVybiAhaXNOYU4ocGFyc2VJbnQoYSkpIH0sXG4gICAgc3RyOiBmdW5jdGlvbihhKSB7IHJldHVybiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgfSxcbiAgICBmbmM6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nIH0sXG4gICAgdW5kOiBmdW5jdGlvbihhKSB7IHJldHVybiB0eXBlb2YgYSA9PT0gJ3VuZGVmaW5lZCcgfSxcbiAgICBudWw6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAnbnVsbCcgfSxcbiAgICBoZXg6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIC8oXiNbMC05QS1GXXs2fSQpfCheI1swLTlBLUZdezN9JCkvaS50ZXN0KGEpIH0sXG4gICAgcmdiOiBmdW5jdGlvbihhKSB7IHJldHVybiAvXnJnYi8udGVzdChhKSB9LFxuICAgIGhzbDogZnVuY3Rpb24oYSkgeyByZXR1cm4gL15oc2wvLnRlc3QoYSkgfSxcbiAgICBjb2w6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIChpcy5oZXgoYSkgfHwgaXMucmdiKGEpIHx8IGlzLmhzbChhKSkgfVxuICB9XG5cbiAgLy8gRWFzaW5ncyBmdW5jdGlvbnMgYWRhcHRlZCBmcm9tIGh0dHA6Ly9qcXVlcnl1aS5jb20vXG5cbiAgdmFyIGVhc2luZ3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVhc2VzID0ge307XG4gICAgdmFyIG5hbWVzID0gWydRdWFkJywgJ0N1YmljJywgJ1F1YXJ0JywgJ1F1aW50JywgJ0V4cG8nXTtcbiAgICB2YXIgZnVuY3Rpb25zID0ge1xuICAgICAgU2luZTogZnVuY3Rpb24odCkgeyByZXR1cm4gMSAtIE1hdGguY29zKCB0ICogTWF0aC5QSSAvIDIgKTsgfSxcbiAgICAgIENpcmM6IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIDEgLSBNYXRoLnNxcnQoIDEgLSB0ICogdCApOyB9LFxuICAgICAgRWxhc3RpYzogZnVuY3Rpb24odCwgbSkge1xuICAgICAgICBpZiggdCA9PT0gMCB8fCB0ID09PSAxICkgcmV0dXJuIHQ7XG4gICAgICAgIHZhciBwID0gKDEgLSBNYXRoLm1pbihtLCA5OTgpIC8gMTAwMCksIHN0ID0gdCAvIDEsIHN0MSA9IHN0IC0gMSwgcyA9IHAgLyAoIDIgKiBNYXRoLlBJICkgKiBNYXRoLmFzaW4oIDEgKTtcbiAgICAgICAgcmV0dXJuIC0oIE1hdGgucG93KCAyLCAxMCAqIHN0MSApICogTWF0aC5zaW4oICggc3QxIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG4gICAgICB9LFxuICAgICAgQmFjazogZnVuY3Rpb24odCkgeyByZXR1cm4gdCAqIHQgKiAoIDMgKiB0IC0gMiApOyB9LFxuICAgICAgQm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBwb3cyLCBib3VuY2UgPSA0O1xuICAgICAgICB3aGlsZSAoIHQgPCAoICggcG93MiA9IE1hdGgucG93KCAyLCAtLWJvdW5jZSApICkgLSAxICkgLyAxMSApIHt9XG4gICAgICAgIHJldHVybiAxIC8gTWF0aC5wb3coIDQsIDMgLSBib3VuY2UgKSAtIDcuNTYyNSAqIE1hdGgucG93KCAoIHBvdzIgKiAzIC0gMiApIC8gMjIgLSB0LCAyICk7XG4gICAgICB9XG4gICAgfVxuICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgaSkge1xuICAgICAgZnVuY3Rpb25zW25hbWVdID0gZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coIHQsIGkgKyAyICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmtleXMoZnVuY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBlYXNlSW4gPSBmdW5jdGlvbnNbbmFtZV07XG4gICAgICBlYXNlc1snZWFzZUluJyArIG5hbWVdID0gZWFzZUluO1xuICAgICAgZWFzZXNbJ2Vhc2VPdXQnICsgbmFtZV0gPSBmdW5jdGlvbih0LCBtKSB7IHJldHVybiAxIC0gZWFzZUluKDEgLSB0LCBtKTsgfTtcbiAgICAgIGVhc2VzWydlYXNlSW5PdXQnICsgbmFtZV0gPSBmdW5jdGlvbih0LCBtKSB7IHJldHVybiB0IDwgMC41ID8gZWFzZUluKHQgKiAyLCBtKSAvIDIgOiAxIC0gZWFzZUluKHQgKiAtMiArIDIsIG0pIC8gMjsgfTtcbiAgICAgIGVhc2VzWydlYXNlT3V0SW4nICsgbmFtZV0gPSBmdW5jdGlvbih0LCBtKSB7IHJldHVybiB0IDwgMC41ID8gKDEgLSBlYXNlSW4oMSAtIDIgKiB0LCBtKSkgLyAyIDogKGVhc2VJbih0ICogMiAtIDEsIG0pICsgMSkgLyAyOyB9O1xuICAgIH0pO1xuICAgIGVhc2VzLmxpbmVhciA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQ7IH07XG4gICAgcmV0dXJuIGVhc2VzO1xuICB9KSgpO1xuXG4gIC8vIFN0cmluZ3NcblxuICB2YXIgbnVtYmVyVG9TdHJpbmcgPSBmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gKGlzLnN0cih2YWwpKSA/IHZhbCA6IHZhbCArICcnO1xuICB9XG5cbiAgdmFyIHN0cmluZ1RvSHlwaGVucyA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHZhciBzZWxlY3RTdHJpbmcgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoaXMuY29sKHN0cikpIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzdHIpO1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE51bWJlcnNcblxuICB2YXIgcmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgfVxuXG4gIC8vIEFycmF5c1xuXG4gIHZhciBmbGF0dGVuQXJyYXkgPSBmdW5jdGlvbihhcnIpIHtcbiAgICByZXR1cm4gYXJyLnJlZHVjZShmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5jb25jYXQoaXMuYXJyKGIpID8gZmxhdHRlbkFycmF5KGIpIDogYik7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgdmFyIHRvQXJyYXkgPSBmdW5jdGlvbihvKSB7XG4gICAgaWYgKGlzLmFycihvKSkgcmV0dXJuIG87XG4gICAgaWYgKGlzLnN0cihvKSkgbyA9IHNlbGVjdFN0cmluZyhvKSB8fCBvO1xuICAgIGlmIChvIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgbyBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uKSByZXR1cm4gW10uc2xpY2UuY2FsbChvKTtcbiAgICByZXR1cm4gW29dO1xuICB9XG5cbiAgdmFyIGFycmF5Q29udGFpbnMgPSBmdW5jdGlvbihhcnIsIHZhbCkge1xuICAgIHJldHVybiBhcnIuc29tZShmdW5jdGlvbihhKSB7IHJldHVybiBhID09PSB2YWw7IH0pO1xuICB9XG5cbiAgdmFyIGdyb3VwQXJyYXlCeVByb3BzID0gZnVuY3Rpb24oYXJyLCBwcm9wc0Fycikge1xuICAgIHZhciBncm91cHMgPSB7fTtcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZ3JvdXAgPSBKU09OLnN0cmluZ2lmeShwcm9wc0Fyci5tYXAoZnVuY3Rpb24ocCkgeyByZXR1cm4gb1twXTsgfSkpO1xuICAgICAgZ3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF0gfHwgW107XG4gICAgICBncm91cHNbZ3JvdXBdLnB1c2gobyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGdyb3VwcykubWFwKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICByZXR1cm4gZ3JvdXBzW2dyb3VwXTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciByZW1vdmVBcnJheUR1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnIpIHtcbiAgICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbihpdGVtLCBwb3MsIHNlbGYpIHtcbiAgICAgIHJldHVybiBzZWxmLmluZGV4T2YoaXRlbSkgPT09IHBvcztcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE9iamVjdHNcblxuICB2YXIgY2xvbmVPYmplY3QgPSBmdW5jdGlvbihvKSB7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gbykgbmV3T2JqZWN0W3BdID0gb1twXTtcbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG5cbiAgdmFyIG1lcmdlT2JqZWN0cyA9IGZ1bmN0aW9uKG8xLCBvMikge1xuICAgIGZvciAodmFyIHAgaW4gbzIpIG8xW3BdID0gIWlzLnVuZChvMVtwXSkgPyBvMVtwXSA6IG8yW3BdO1xuICAgIHJldHVybiBvMTtcbiAgfVxuXG4gIC8vIENvbG9yc1xuXG4gIHZhciBoZXhUb1JnYiA9IGZ1bmN0aW9uKGhleCkge1xuICAgIHZhciByZ3ggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xuICAgIHZhciBoZXggPSBoZXgucmVwbGFjZShyZ3gsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHsgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjsgfSk7XG4gICAgdmFyIHJnYiA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgIHZhciByID0gcGFyc2VJbnQocmdiWzFdLCAxNik7XG4gICAgdmFyIGcgPSBwYXJzZUludChyZ2JbMl0sIDE2KTtcbiAgICB2YXIgYiA9IHBhcnNlSW50KHJnYlszXSwgMTYpO1xuICAgIHJldHVybiAncmdiKCcgKyByICsgJywnICsgZyArICcsJyArIGIgKyAnKSc7XG4gIH1cblxuICB2YXIgaHNsVG9SZ2IgPSBmdW5jdGlvbihoc2wpIHtcbiAgICB2YXIgaHNsID0gL2hzbFxcKChcXGQrKSxcXHMqKFtcXGQuXSspJSxcXHMqKFtcXGQuXSspJVxcKS9nLmV4ZWMoaHNsKTtcbiAgICB2YXIgaCA9IHBhcnNlSW50KGhzbFsxXSkgLyAzNjA7XG4gICAgdmFyIHMgPSBwYXJzZUludChoc2xbMl0pIC8gMTAwO1xuICAgIHZhciBsID0gcGFyc2VJbnQoaHNsWzNdKSAvIDEwMDtcbiAgICB2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uKHAsIHEsIHQpIHtcbiAgICAgIGlmICh0IDwgMCkgdCArPSAxO1xuICAgICAgaWYgKHQgPiAxKSB0IC09IDE7XG4gICAgICBpZiAodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgICBpZiAodCA8IDEvMikgcmV0dXJuIHE7XG4gICAgICBpZiAodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICB2YXIgciwgZywgYjtcbiAgICBpZiAocyA9PSAwKSB7XG4gICAgICByID0gZyA9IGIgPSBsO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG4gICAgcmV0dXJuICdyZ2IoJyArIHIgKiAyNTUgKyAnLCcgKyBnICogMjU1ICsgJywnICsgYiAqIDI1NSArICcpJztcbiAgfVxuXG4gIHZhciBjb2xvclRvUmdiID0gZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKGlzLnJnYih2YWwpKSByZXR1cm4gdmFsO1xuICAgIGlmIChpcy5oZXgodmFsKSkgcmV0dXJuIGhleFRvUmdiKHZhbCk7XG4gICAgaWYgKGlzLmhzbCh2YWwpKSByZXR1cm4gaHNsVG9SZ2IodmFsKTtcbiAgfVxuXG4gIC8vIFVuaXRzXG5cbiAgdmFyIGdldFVuaXQgPSBmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gLyhbXFwrXFwtXT9bMC05fGF1dG9cXC5dKykoJXxweHxwdHxlbXxyZW18aW58Y218bW18ZXh8cGN8dnd8dmh8ZGVnKT8vLmV4ZWModmFsKVsyXTtcbiAgfVxuXG4gIHZhciBhZGREZWZhdWx0VHJhbnNmb3JtVW5pdCA9IGZ1bmN0aW9uKHByb3AsIHZhbCwgaW50aWFsVmFsKSB7XG4gICAgaWYgKGdldFVuaXQodmFsKSkgcmV0dXJuIHZhbDtcbiAgICBpZiAocHJvcC5pbmRleE9mKCd0cmFuc2xhdGUnKSA+IC0xKSByZXR1cm4gZ2V0VW5pdChpbnRpYWxWYWwpID8gdmFsICsgZ2V0VW5pdChpbnRpYWxWYWwpIDogdmFsICsgJ3B4JztcbiAgICBpZiAocHJvcC5pbmRleE9mKCdyb3RhdGUnKSA+IC0xIHx8IHByb3AuaW5kZXhPZignc2tldycpID4gLTEpIHJldHVybiB2YWwgKyAnZGVnJztcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgLy8gVmFsdWVzXG5cbiAgdmFyIGdldENTU1ZhbHVlID0gZnVuY3Rpb24oZWwsIHByb3ApIHtcbiAgICAvLyBGaXJzdCBjaGVjayBpZiBwcm9wIGlzIGEgdmFsaWQgQ1NTIHByb3BlcnR5XG4gICAgaWYgKHByb3AgaW4gZWwuc3R5bGUpIHtcbiAgICAgIC8vIFRoZW4gcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvciBmYWxsYmFjayB0byAnMCcgd2hlbiBnZXRQcm9wZXJ0eVZhbHVlIGZhaWxzXG4gICAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShzdHJpbmdUb0h5cGhlbnMocHJvcCkpIHx8ICcwJztcbiAgICB9XG4gIH1cblxuICB2YXIgZ2V0VHJhbnNmb3JtVmFsdWUgPSBmdW5jdGlvbihlbCwgcHJvcCkge1xuICAgIHZhciBkZWZhdWx0VmFsID0gcHJvcC5pbmRleE9mKCdzY2FsZScpID4gLTEgPyAxIDogMDtcbiAgICB2YXIgc3RyID0gZWwuc3R5bGUudHJhbnNmb3JtO1xuICAgIGlmICghc3RyKSByZXR1cm4gZGVmYXVsdFZhbDtcbiAgICB2YXIgcmd4ID0gLyhcXHcrKVxcKCguKz8pXFwpL2c7XG4gICAgdmFyIG1hdGNoID0gW107XG4gICAgdmFyIHByb3BzID0gW107XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIHdoaWxlIChtYXRjaCA9IHJneC5leGVjKHN0cikpIHtcbiAgICAgIHByb3BzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgdmFsdWVzLnB1c2gobWF0Y2hbMl0pO1xuICAgIH1cbiAgICB2YXIgdmFsID0gdmFsdWVzLmZpbHRlcihmdW5jdGlvbihmLCBpKSB7IHJldHVybiBwcm9wc1tpXSA9PT0gcHJvcDsgfSk7XG4gICAgcmV0dXJuIHZhbC5sZW5ndGggPyB2YWxbMF0gOiBkZWZhdWx0VmFsO1xuICB9XG5cbiAgdmFyIGdldEFuaW1hdGlvblR5cGUgPSBmdW5jdGlvbihlbCwgcHJvcCkge1xuICAgIGlmICggaXMuZG9tKGVsKSAmJiBhcnJheUNvbnRhaW5zKHZhbGlkVHJhbnNmb3JtcywgcHJvcCkpIHJldHVybiAndHJhbnNmb3JtJztcbiAgICBpZiAoIGlzLmRvbShlbCkgJiYgKGVsLmdldEF0dHJpYnV0ZShwcm9wKSB8fCAoaXMuc3ZnKGVsKSAmJiBlbFtwcm9wXSkpKSByZXR1cm4gJ2F0dHJpYnV0ZSc7XG4gICAgaWYgKCBpcy5kb20oZWwpICYmIChwcm9wICE9PSAndHJhbnNmb3JtJyAmJiBnZXRDU1NWYWx1ZShlbCwgcHJvcCkpKSByZXR1cm4gJ2Nzcyc7XG4gICAgaWYgKCFpcy5udWwoZWxbcHJvcF0pICYmICFpcy51bmQoZWxbcHJvcF0pKSByZXR1cm4gJ29iamVjdCc7XG4gIH1cblxuICB2YXIgZ2V0SW5pdGlhbFRhcmdldFZhbHVlID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wKSB7XG4gICAgc3dpdGNoIChnZXRBbmltYXRpb25UeXBlKHRhcmdldCwgcHJvcCkpIHtcbiAgICAgIGNhc2UgJ3RyYW5zZm9ybSc6IHJldHVybiBnZXRUcmFuc2Zvcm1WYWx1ZSh0YXJnZXQsIHByb3ApO1xuICAgICAgY2FzZSAnY3NzJzogcmV0dXJuIGdldENTU1ZhbHVlKHRhcmdldCwgcHJvcCk7XG4gICAgICBjYXNlICdhdHRyaWJ1dGUnOiByZXR1cm4gdGFyZ2V0LmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFtwcm9wXSB8fCAwO1xuICB9XG5cbiAgdmFyIGdldFZhbGlkVmFsdWUgPSBmdW5jdGlvbih2YWx1ZXMsIHZhbCwgb3JpZ2luYWxDU1MpIHtcbiAgICBpZiAoaXMuY29sKHZhbCkpIHJldHVybiBjb2xvclRvUmdiKHZhbCk7XG4gICAgaWYgKGdldFVuaXQodmFsKSkgcmV0dXJuIHZhbDtcbiAgICB2YXIgdW5pdCA9IGdldFVuaXQodmFsdWVzLnRvKSA/IGdldFVuaXQodmFsdWVzLnRvKSA6IGdldFVuaXQodmFsdWVzLmZyb20pO1xuICAgIGlmICghdW5pdCAmJiBvcmlnaW5hbENTUykgdW5pdCA9IGdldFVuaXQob3JpZ2luYWxDU1MpO1xuICAgIHJldHVybiB1bml0ID8gdmFsICsgdW5pdCA6IHZhbDtcbiAgfVxuXG4gIHZhciBkZWNvbXBvc2VWYWx1ZSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHZhciByZ3ggPSAvLT9cXGQqXFwuP1xcZCsvZztcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luYWw6IHZhbCxcbiAgICAgIG51bWJlcnM6IG51bWJlclRvU3RyaW5nKHZhbCkubWF0Y2gocmd4KSA/IG51bWJlclRvU3RyaW5nKHZhbCkubWF0Y2gocmd4KS5tYXAoTnVtYmVyKSA6IFswXSxcbiAgICAgIHN0cmluZ3M6IG51bWJlclRvU3RyaW5nKHZhbCkuc3BsaXQocmd4KVxuICAgIH1cbiAgfVxuXG4gIHZhciByZWNvbXBvc2VWYWx1ZSA9IGZ1bmN0aW9uKG51bWJlcnMsIHN0cmluZ3MsIGluaXRpYWxTdHJpbmdzKSB7XG4gICAgcmV0dXJuIHN0cmluZ3MucmVkdWNlKGZ1bmN0aW9uKGEsIGIsIGkpIHtcbiAgICAgIHZhciBiID0gKGIgPyBiIDogaW5pdGlhbFN0cmluZ3NbaSAtIDFdKTtcbiAgICAgIHJldHVybiBhICsgbnVtYmVyc1tpIC0gMV0gKyBiO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQW5pbWF0YWJsZXNcblxuICB2YXIgZ2V0QW5pbWF0YWJsZXMgPSBmdW5jdGlvbih0YXJnZXRzKSB7XG4gICAgdmFyIHRhcmdldHMgPSB0YXJnZXRzID8gKGZsYXR0ZW5BcnJheShpcy5hcnIodGFyZ2V0cykgPyB0YXJnZXRzLm1hcCh0b0FycmF5KSA6IHRvQXJyYXkodGFyZ2V0cykpKSA6IFtdO1xuICAgIHJldHVybiB0YXJnZXRzLm1hcChmdW5jdGlvbih0LCBpKSB7XG4gICAgICByZXR1cm4geyB0YXJnZXQ6IHQsIGlkOiBpIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBQcm9wZXJ0aWVzXG5cbiAgdmFyIGdldFByb3BlcnRpZXMgPSBmdW5jdGlvbihwYXJhbXMsIHNldHRpbmdzKSB7XG4gICAgdmFyIHByb3BzID0gW107XG4gICAgZm9yICh2YXIgcCBpbiBwYXJhbXMpIHtcbiAgICAgIGlmICghZGVmYXVsdFNldHRpbmdzLmhhc093blByb3BlcnR5KHApICYmIHAgIT09ICd0YXJnZXRzJykge1xuICAgICAgICB2YXIgcHJvcCA9IGlzLm9iaihwYXJhbXNbcF0pID8gY2xvbmVPYmplY3QocGFyYW1zW3BdKSA6IHt2YWx1ZTogcGFyYW1zW3BdfTtcbiAgICAgICAgcHJvcC5uYW1lID0gcDtcbiAgICAgICAgcHJvcHMucHVzaChtZXJnZU9iamVjdHMocHJvcCwgc2V0dGluZ3MpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgdmFyIGdldFByb3BlcnRpZXNWYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHZhbHVlLCBpKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRvQXJyYXkoIGlzLmZuYyh2YWx1ZSkgPyB2YWx1ZSh0YXJnZXQsIGkpIDogdmFsdWUpO1xuICAgIHJldHVybiB7XG4gICAgICBmcm9tOiAodmFsdWVzLmxlbmd0aCA+IDEpID8gdmFsdWVzWzBdIDogZ2V0SW5pdGlhbFRhcmdldFZhbHVlKHRhcmdldCwgcHJvcCksXG4gICAgICB0bzogKHZhbHVlcy5sZW5ndGggPiAxKSA/IHZhbHVlc1sxXSA6IHZhbHVlc1swXVxuICAgIH1cbiAgfVxuXG4gIC8vIFR3ZWVuc1xuXG4gIHZhciBnZXRUd2VlblZhbHVlcyA9IGZ1bmN0aW9uKHByb3AsIHZhbHVlcywgdHlwZSwgdGFyZ2V0KSB7XG4gICAgdmFyIHZhbGlkID0ge307XG4gICAgaWYgKHR5cGUgPT09ICd0cmFuc2Zvcm0nKSB7XG4gICAgICB2YWxpZC5mcm9tID0gcHJvcCArICcoJyArIGFkZERlZmF1bHRUcmFuc2Zvcm1Vbml0KHByb3AsIHZhbHVlcy5mcm9tLCB2YWx1ZXMudG8pICsgJyknO1xuICAgICAgdmFsaWQudG8gPSBwcm9wICsgJygnICsgYWRkRGVmYXVsdFRyYW5zZm9ybVVuaXQocHJvcCwgdmFsdWVzLnRvKSArICcpJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG9yaWdpbmFsQ1NTID0gKHR5cGUgPT09ICdjc3MnKSA/IGdldENTU1ZhbHVlKHRhcmdldCwgcHJvcCkgOiB1bmRlZmluZWQ7XG4gICAgICB2YWxpZC5mcm9tID0gZ2V0VmFsaWRWYWx1ZSh2YWx1ZXMsIHZhbHVlcy5mcm9tLCBvcmlnaW5hbENTUyk7XG4gICAgICB2YWxpZC50byA9IGdldFZhbGlkVmFsdWUodmFsdWVzLCB2YWx1ZXMudG8sIG9yaWdpbmFsQ1NTKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZnJvbTogZGVjb21wb3NlVmFsdWUodmFsaWQuZnJvbSksIHRvOiBkZWNvbXBvc2VWYWx1ZSh2YWxpZC50bykgfTtcbiAgfVxuXG4gIHZhciBnZXRUd2VlbnNQcm9wcyA9IGZ1bmN0aW9uKGFuaW1hdGFibGVzLCBwcm9wcykge1xuICAgIHZhciB0d2VlbnNQcm9wcyA9IFtdO1xuICAgIGFuaW1hdGFibGVzLmZvckVhY2goZnVuY3Rpb24oYW5pbWF0YWJsZSwgaSkge1xuICAgICAgdmFyIHRhcmdldCA9IGFuaW1hdGFibGUudGFyZ2V0O1xuICAgICAgcmV0dXJuIHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICB2YXIgYW5pbVR5cGUgPSBnZXRBbmltYXRpb25UeXBlKHRhcmdldCwgcHJvcC5uYW1lKTtcbiAgICAgICAgaWYgKGFuaW1UeXBlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlcyA9IGdldFByb3BlcnRpZXNWYWx1ZXModGFyZ2V0LCBwcm9wLm5hbWUsIHByb3AudmFsdWUsIGkpO1xuICAgICAgICAgIHZhciB0d2VlbiA9IGNsb25lT2JqZWN0KHByb3ApO1xuICAgICAgICAgIHR3ZWVuLmFuaW1hdGFibGVzID0gYW5pbWF0YWJsZTtcbiAgICAgICAgICB0d2Vlbi50eXBlID0gYW5pbVR5cGU7XG4gICAgICAgICAgdHdlZW4uZnJvbSA9IGdldFR3ZWVuVmFsdWVzKHByb3AubmFtZSwgdmFsdWVzLCB0d2Vlbi50eXBlLCB0YXJnZXQpLmZyb207XG4gICAgICAgICAgdHdlZW4udG8gPSBnZXRUd2VlblZhbHVlcyhwcm9wLm5hbWUsIHZhbHVlcywgdHdlZW4udHlwZSwgdGFyZ2V0KS50bztcbiAgICAgICAgICB0d2Vlbi5yb3VuZCA9IChpcy5jb2wodmFsdWVzLmZyb20pIHx8IHR3ZWVuLnJvdW5kKSA/IDEgOiAwO1xuICAgICAgICAgIHR3ZWVuLmRlbGF5ID0gKGlzLmZuYyh0d2Vlbi5kZWxheSkgPyB0d2Vlbi5kZWxheSh0YXJnZXQsIGksIGFuaW1hdGFibGVzLmxlbmd0aCkgOiB0d2Vlbi5kZWxheSkgLyBhbmltYXRpb24uc3BlZWQ7XG4gICAgICAgICAgdHdlZW4uZHVyYXRpb24gPSAoaXMuZm5jKHR3ZWVuLmR1cmF0aW9uKSA/IHR3ZWVuLmR1cmF0aW9uKHRhcmdldCwgaSwgYW5pbWF0YWJsZXMubGVuZ3RoKSA6IHR3ZWVuLmR1cmF0aW9uKSAvIGFuaW1hdGlvbi5zcGVlZDtcbiAgICAgICAgICB0d2VlbnNQcm9wcy5wdXNoKHR3ZWVuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHR3ZWVuc1Byb3BzO1xuICB9XG5cbiAgdmFyIGdldFR3ZWVucyA9IGZ1bmN0aW9uKGFuaW1hdGFibGVzLCBwcm9wcykge1xuICAgIHZhciB0d2VlbnNQcm9wcyA9IGdldFR3ZWVuc1Byb3BzKGFuaW1hdGFibGVzLCBwcm9wcyk7XG4gICAgdmFyIHNwbGl0dGVkUHJvcHMgPSBncm91cEFycmF5QnlQcm9wcyh0d2VlbnNQcm9wcywgWyduYW1lJywgJ2Zyb20nLCAndG8nLCAnZGVsYXknLCAnZHVyYXRpb24nXSk7XG4gICAgcmV0dXJuIHNwbGl0dGVkUHJvcHMubWFwKGZ1bmN0aW9uKHR3ZWVuUHJvcHMpIHtcbiAgICAgIHZhciB0d2VlbiA9IGNsb25lT2JqZWN0KHR3ZWVuUHJvcHNbMF0pO1xuICAgICAgdHdlZW4uYW5pbWF0YWJsZXMgPSB0d2VlblByb3BzLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBwLmFuaW1hdGFibGVzIH0pO1xuICAgICAgdHdlZW4udG90YWxEdXJhdGlvbiA9IHR3ZWVuLmRlbGF5ICsgdHdlZW4uZHVyYXRpb247XG4gICAgICByZXR1cm4gdHdlZW47XG4gICAgfSk7XG4gIH1cblxuICB2YXIgcmV2ZXJzZVR3ZWVucyA9IGZ1bmN0aW9uKGFuaW0sIGRlbGF5cykge1xuICAgIGFuaW0udHdlZW5zLmZvckVhY2goZnVuY3Rpb24odHdlZW4pIHtcbiAgICAgIHZhciB0b1ZhbCA9IHR3ZWVuLnRvO1xuICAgICAgdmFyIGZyb21WYWwgPSB0d2Vlbi5mcm9tO1xuICAgICAgdmFyIGRlbGF5VmFsID0gYW5pbS5kdXJhdGlvbiAtICh0d2Vlbi5kZWxheSArIHR3ZWVuLmR1cmF0aW9uKTtcbiAgICAgIHR3ZWVuLmZyb20gPSB0b1ZhbDtcbiAgICAgIHR3ZWVuLnRvID0gZnJvbVZhbDtcbiAgICAgIGlmIChkZWxheXMpIHR3ZWVuLmRlbGF5ID0gZGVsYXlWYWw7XG4gICAgfSk7XG4gICAgYW5pbS5yZXZlcnNlZCA9IGFuaW0ucmV2ZXJzZWQgPyBmYWxzZSA6IHRydWU7XG4gIH1cblxuICB2YXIgZ2V0VHdlZW5zRHVyYXRpb24gPSBmdW5jdGlvbih0d2VlbnMpIHtcbiAgICBpZiAodHdlZW5zLmxlbmd0aCkgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIHR3ZWVucy5tYXAoZnVuY3Rpb24odHdlZW4peyByZXR1cm4gdHdlZW4udG90YWxEdXJhdGlvbjsgfSkpO1xuICB9XG5cbiAgLy8gd2lsbC1jaGFuZ2VcblxuICB2YXIgZ2V0V2lsbENoYW5nZSA9IGZ1bmN0aW9uKGFuaW0pIHtcbiAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICB2YXIgZWxzID0gW107XG4gICAgYW5pbS50d2VlbnMuZm9yRWFjaChmdW5jdGlvbih0d2Vlbikge1xuICAgICAgaWYgKHR3ZWVuLnR5cGUgPT09ICdjc3MnIHx8IHR3ZWVuLnR5cGUgPT09ICd0cmFuc2Zvcm0nICkge1xuICAgICAgICBwcm9wcy5wdXNoKHR3ZWVuLnR5cGUgPT09ICdjc3MnID8gc3RyaW5nVG9IeXBoZW5zKHR3ZWVuLm5hbWUpIDogJ3RyYW5zZm9ybScpO1xuICAgICAgICB0d2Vlbi5hbmltYXRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uKGFuaW1hdGFibGUpIHsgZWxzLnB1c2goYW5pbWF0YWJsZS50YXJnZXQpOyB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvcGVydGllczogcmVtb3ZlQXJyYXlEdXBsaWNhdGVzKHByb3BzKS5qb2luKCcsICcpLFxuICAgICAgZWxlbWVudHM6IHJlbW92ZUFycmF5RHVwbGljYXRlcyhlbHMpXG4gICAgfVxuICB9XG5cbiAgdmFyIHNldFdpbGxDaGFuZ2UgPSBmdW5jdGlvbihhbmltKSB7XG4gICAgdmFyIHdpbGxDaGFuZ2UgPSBnZXRXaWxsQ2hhbmdlKGFuaW0pO1xuICAgIHdpbGxDaGFuZ2UuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LnN0eWxlLndpbGxDaGFuZ2UgPSB3aWxsQ2hhbmdlLnByb3BlcnRpZXM7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgcmVtb3ZlV2lsbENoYW5nZSA9IGZ1bmN0aW9uKGFuaW0pIHtcbiAgICB2YXIgd2lsbENoYW5nZSA9IGdldFdpbGxDaGFuZ2UoYW5pbSk7XG4gICAgd2lsbENoYW5nZS5lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3dpbGwtY2hhbmdlJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiBTdmcgcGF0aCAqL1xuXG4gIHZhciBnZXRQYXRoUHJvcHMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIGVsID0gaXMuc3RyKHBhdGgpID8gc2VsZWN0U3RyaW5nKHBhdGgpWzBdIDogcGF0aDtcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogZWwsXG4gICAgICB2YWx1ZTogZWwuZ2V0VG90YWxMZW5ndGgoKVxuICAgIH1cbiAgfVxuXG4gIHZhciBzbmFwUHJvZ3Jlc3NUb1BhdGggPSBmdW5jdGlvbih0d2VlbiwgcHJvZ3Jlc3MpIHtcbiAgICB2YXIgcGF0aEVsID0gdHdlZW4ucGF0aDtcbiAgICB2YXIgcGF0aFByb2dyZXNzID0gdHdlZW4udmFsdWUgKiBwcm9ncmVzcztcbiAgICB2YXIgcG9pbnQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgIHZhciBvID0gb2Zmc2V0IHx8IDA7XG4gICAgICB2YXIgcCA9IHByb2dyZXNzID4gMSA/IHR3ZWVuLnZhbHVlICsgbyA6IHBhdGhQcm9ncmVzcyArIG87XG4gICAgICByZXR1cm4gcGF0aEVsLmdldFBvaW50QXRMZW5ndGgocCk7XG4gICAgfVxuICAgIHZhciBwID0gcG9pbnQoKTtcbiAgICB2YXIgcDAgPSBwb2ludCgtMSk7XG4gICAgdmFyIHAxID0gcG9pbnQoKzEpO1xuICAgIHN3aXRjaCAodHdlZW4ubmFtZSkge1xuICAgICAgY2FzZSAndHJhbnNsYXRlWCc6IHJldHVybiBwLng7XG4gICAgICBjYXNlICd0cmFuc2xhdGVZJzogcmV0dXJuIHAueTtcbiAgICAgIGNhc2UgJ3JvdGF0ZSc6IHJldHVybiBNYXRoLmF0YW4yKHAxLnkgLSBwMC55LCBwMS54IC0gcDAueCkgKiAxODAgLyBNYXRoLlBJO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByb2dyZXNzXG5cbiAgdmFyIGdldFR3ZWVuUHJvZ3Jlc3MgPSBmdW5jdGlvbih0d2VlbiwgdGltZSkge1xuICAgIHZhciBlbGFwc2VkID0gTWF0aC5taW4oTWF0aC5tYXgodGltZSAtIHR3ZWVuLmRlbGF5LCAwKSwgdHdlZW4uZHVyYXRpb24pO1xuICAgIHZhciBwZXJjZW50ID0gZWxhcHNlZCAvIHR3ZWVuLmR1cmF0aW9uO1xuICAgIHZhciBwcm9ncmVzcyA9IHR3ZWVuLnRvLm51bWJlcnMubWFwKGZ1bmN0aW9uKG51bWJlciwgcCkge1xuICAgICAgdmFyIHN0YXJ0ID0gdHdlZW4uZnJvbS5udW1iZXJzW3BdO1xuICAgICAgdmFyIGVhc2VkID0gZWFzaW5nc1t0d2Vlbi5lYXNpbmddKHBlcmNlbnQsIHR3ZWVuLmVsYXN0aWNpdHkpO1xuICAgICAgdmFyIHZhbCA9IHR3ZWVuLnBhdGggPyBzbmFwUHJvZ3Jlc3NUb1BhdGgodHdlZW4sIGVhc2VkKSA6IHN0YXJ0ICsgZWFzZWQgKiAobnVtYmVyIC0gc3RhcnQpO1xuICAgICAgdmFsID0gdHdlZW4ucm91bmQgPyBNYXRoLnJvdW5kKHZhbCAqIHR3ZWVuLnJvdW5kKSAvIHR3ZWVuLnJvdW5kIDogdmFsO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb21wb3NlVmFsdWUocHJvZ3Jlc3MsIHR3ZWVuLnRvLnN0cmluZ3MsIHR3ZWVuLmZyb20uc3RyaW5ncyk7XG4gIH1cblxuICB2YXIgc2V0QW5pbWF0aW9uUHJvZ3Jlc3MgPSBmdW5jdGlvbihhbmltLCB0aW1lKSB7XG4gICAgdmFyIHRyYW5zZm9ybXM7XG4gICAgYW5pbS5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgYW5pbS5wcm9ncmVzcyA9ICh0aW1lIC8gYW5pbS5kdXJhdGlvbikgKiAxMDA7XG4gICAgZm9yICh2YXIgdCA9IDA7IHQgPCBhbmltLnR3ZWVucy5sZW5ndGg7IHQrKykge1xuICAgICAgdmFyIHR3ZWVuID0gYW5pbS50d2VlbnNbdF07XG4gICAgICB0d2Vlbi5jdXJyZW50VmFsdWUgPSBnZXRUd2VlblByb2dyZXNzKHR3ZWVuLCB0aW1lKTtcbiAgICAgIHZhciBwcm9ncmVzcyA9IHR3ZWVuLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgdHdlZW4uYW5pbWF0YWJsZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgdmFyIGFuaW1hdGFibGUgPSB0d2Vlbi5hbmltYXRhYmxlc1thXTtcbiAgICAgICAgdmFyIGlkID0gYW5pbWF0YWJsZS5pZDtcbiAgICAgICAgdmFyIHRhcmdldCA9IGFuaW1hdGFibGUudGFyZ2V0O1xuICAgICAgICB2YXIgbmFtZSA9IHR3ZWVuLm5hbWU7XG4gICAgICAgIHN3aXRjaCAodHdlZW4udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2Nzcyc6IHRhcmdldC5zdHlsZVtuYW1lXSA9IHByb2dyZXNzOyBicmVhaztcbiAgICAgICAgICBjYXNlICdhdHRyaWJ1dGUnOiB0YXJnZXQuc2V0QXR0cmlidXRlKG5hbWUsIHByb2dyZXNzKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb2JqZWN0JzogdGFyZ2V0W25hbWVdID0gcHJvZ3Jlc3M7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3RyYW5zZm9ybSc6XG4gICAgICAgICAgaWYgKCF0cmFuc2Zvcm1zKSB0cmFuc2Zvcm1zID0ge307XG4gICAgICAgICAgaWYgKCF0cmFuc2Zvcm1zW2lkXSkgdHJhbnNmb3Jtc1tpZF0gPSBbXTtcbiAgICAgICAgICB0cmFuc2Zvcm1zW2lkXS5wdXNoKHByb2dyZXNzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHJhbnNmb3Jtcykge1xuICAgICAgaWYgKCF0cmFuc2Zvcm0pIHRyYW5zZm9ybSA9IChnZXRDU1NWYWx1ZShkb2N1bWVudC5ib2R5LCB0cmFuc2Zvcm1TdHIpID8gJycgOiAnLXdlYmtpdC0nKSArIHRyYW5zZm9ybVN0cjtcbiAgICAgIGZvciAodmFyIHQgaW4gdHJhbnNmb3Jtcykge1xuICAgICAgICBhbmltLmFuaW1hdGFibGVzW3RdLnRhcmdldC5zdHlsZVt0cmFuc2Zvcm1dID0gdHJhbnNmb3Jtc1t0XS5qb2luKCcgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhbmltLnNldHRpbmdzLnVwZGF0ZSkgYW5pbS5zZXR0aW5ncy51cGRhdGUoYW5pbSk7XG4gIH1cblxuICAvLyBBbmltYXRpb25cblxuICB2YXIgY3JlYXRlQW5pbWF0aW9uID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgdmFyIGFuaW0gPSB7fTtcbiAgICBhbmltLmFuaW1hdGFibGVzID0gZ2V0QW5pbWF0YWJsZXMocGFyYW1zLnRhcmdldHMpO1xuICAgIGFuaW0uc2V0dGluZ3MgPSBtZXJnZU9iamVjdHMocGFyYW1zLCBkZWZhdWx0U2V0dGluZ3MpO1xuICAgIGFuaW0ucHJvcGVydGllcyA9IGdldFByb3BlcnRpZXMocGFyYW1zLCBhbmltLnNldHRpbmdzKTtcbiAgICBhbmltLnR3ZWVucyA9IGdldFR3ZWVucyhhbmltLmFuaW1hdGFibGVzLCBhbmltLnByb3BlcnRpZXMpO1xuICAgIGFuaW0uZHVyYXRpb24gPSBnZXRUd2VlbnNEdXJhdGlvbihhbmltLnR3ZWVucykgfHwgcGFyYW1zLmR1cmF0aW9uO1xuICAgIGFuaW0uY3VycmVudFRpbWUgPSAwO1xuICAgIGFuaW0ucHJvZ3Jlc3MgPSAwO1xuICAgIGFuaW0uZW5kZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gYW5pbTtcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHZhciBhbmltYXRpb25zID0gW107XG4gIHZhciByYWYgPSAwO1xuXG4gIHZhciBlbmdpbmUgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXkgPSBmdW5jdGlvbigpIHsgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApOyB9O1xuICAgIHZhciBzdGVwID0gZnVuY3Rpb24odCkge1xuICAgICAgaWYgKGFuaW1hdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykgYW5pbWF0aW9uc1tpXS50aWNrKHQpO1xuICAgICAgICBwbGF5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgICAgICByYWYgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGxheTtcbiAgfSkoKTtcblxuICB2YXIgYW5pbWF0aW9uID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cbiAgICB2YXIgYW5pbSA9IGNyZWF0ZUFuaW1hdGlvbihwYXJhbXMpO1xuICAgIHZhciB0aW1lID0ge307XG5cbiAgICBhbmltLnRpY2sgPSBmdW5jdGlvbihub3cpIHtcbiAgICAgIGFuaW0uZW5kZWQgPSBmYWxzZTtcbiAgICAgIGlmICghdGltZS5zdGFydCkgdGltZS5zdGFydCA9IG5vdztcbiAgICAgIHRpbWUuY3VycmVudCA9IE1hdGgubWluKE1hdGgubWF4KHRpbWUubGFzdCArIG5vdyAtIHRpbWUuc3RhcnQsIDApLCBhbmltLmR1cmF0aW9uKTtcbiAgICAgIHNldEFuaW1hdGlvblByb2dyZXNzKGFuaW0sIHRpbWUuY3VycmVudCk7XG4gICAgICB2YXIgcyA9IGFuaW0uc2V0dGluZ3M7XG4gICAgICBpZiAocy5iZWdpbiAmJiB0aW1lLmN1cnJlbnQgPj0gcy5kZWxheSkgeyBzLmJlZ2luKGFuaW0pOyBzLmJlZ2luID0gdW5kZWZpbmVkOyB9O1xuICAgICAgaWYgKHRpbWUuY3VycmVudCA+PSBhbmltLmR1cmF0aW9uKSB7XG4gICAgICAgIGlmIChzLmxvb3ApIHtcbiAgICAgICAgICB0aW1lLnN0YXJ0ID0gbm93O1xuICAgICAgICAgIGlmIChzLmRpcmVjdGlvbiA9PT0gJ2FsdGVybmF0ZScpIHJldmVyc2VUd2VlbnMoYW5pbSwgdHJ1ZSk7XG4gICAgICAgICAgaWYgKGlzLm51bShzLmxvb3ApKSBzLmxvb3AtLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbmltLmVuZGVkID0gdHJ1ZTtcbiAgICAgICAgICBhbmltLnBhdXNlKCk7XG4gICAgICAgICAgaWYgKHMuY29tcGxldGUpIHMuY29tcGxldGUoYW5pbSk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZS5sYXN0ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbmltLnNlZWsgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgc2V0QW5pbWF0aW9uUHJvZ3Jlc3MoYW5pbSwgKHByb2dyZXNzIC8gMTAwKSAqIGFuaW0uZHVyYXRpb24pO1xuICAgIH1cblxuICAgIGFuaW0ucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlbW92ZVdpbGxDaGFuZ2UoYW5pbSk7XG4gICAgICB2YXIgaSA9IGFuaW1hdGlvbnMuaW5kZXhPZihhbmltKTtcbiAgICAgIGlmIChpID4gLTEpIGFuaW1hdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgIH1cblxuICAgIGFuaW0ucGxheSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgYW5pbS5wYXVzZSgpO1xuICAgICAgaWYgKHBhcmFtcykgYW5pbSA9IG1lcmdlT2JqZWN0cyhjcmVhdGVBbmltYXRpb24obWVyZ2VPYmplY3RzKHBhcmFtcywgYW5pbS5zZXR0aW5ncykpLCBhbmltKTtcbiAgICAgIHRpbWUuc3RhcnQgPSAwO1xuICAgICAgdGltZS5sYXN0ID0gYW5pbS5lbmRlZCA/IDAgOiBhbmltLmN1cnJlbnRUaW1lO1xuICAgICAgdmFyIHMgPSBhbmltLnNldHRpbmdzO1xuICAgICAgaWYgKHMuZGlyZWN0aW9uID09PSAncmV2ZXJzZScpIHJldmVyc2VUd2VlbnMoYW5pbSk7XG4gICAgICBpZiAocy5kaXJlY3Rpb24gPT09ICdhbHRlcm5hdGUnICYmICFzLmxvb3ApIHMubG9vcCA9IDE7XG4gICAgICBzZXRXaWxsQ2hhbmdlKGFuaW0pO1xuICAgICAgYW5pbWF0aW9ucy5wdXNoKGFuaW0pO1xuICAgICAgaWYgKCFyYWYpIGVuZ2luZSgpO1xuICAgIH1cblxuICAgIGFuaW0ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGFuaW0ucmV2ZXJzZWQpIHJldmVyc2VUd2VlbnMoYW5pbSk7XG4gICAgICBhbmltLnBhdXNlKCk7XG4gICAgICBhbmltLnNlZWsoMCk7XG4gICAgICBhbmltLnBsYXkoKTtcbiAgICB9XG5cbiAgICBpZiAoYW5pbS5zZXR0aW5ncy5hdXRvcGxheSkgYW5pbS5wbGF5KCk7XG5cbiAgICByZXR1cm4gYW5pbTtcblxuICB9XG5cbiAgLy8gUmVtb3ZlIG9uZSBvciBtdWx0aXBsZSB0YXJnZXRzIGZyb20gYWxsIGFjdGl2ZSBhbmltYXRpb25zLlxuXG4gIHZhciByZW1vdmUgPSBmdW5jdGlvbihlbGVtZW50cykge1xuICAgIHZhciB0YXJnZXRzID0gZmxhdHRlbkFycmF5KGlzLmFycihlbGVtZW50cykgPyBlbGVtZW50cy5tYXAodG9BcnJheSkgOiB0b0FycmF5KGVsZW1lbnRzKSk7XG4gICAgZm9yICh2YXIgaSA9IGFuaW1hdGlvbnMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgYW5pbWF0aW9uID0gYW5pbWF0aW9uc1tpXTtcbiAgICAgIHZhciB0d2VlbnMgPSBhbmltYXRpb24udHdlZW5zO1xuICAgICAgZm9yICh2YXIgdCA9IHR3ZWVucy5sZW5ndGgtMTsgdCA+PSAwOyB0LS0pIHtcbiAgICAgICAgdmFyIGFuaW1hdGFibGVzID0gdHdlZW5zW3RdLmFuaW1hdGFibGVzO1xuICAgICAgICBmb3IgKHZhciBhID0gYW5pbWF0YWJsZXMubGVuZ3RoLTE7IGEgPj0gMDsgYS0tKSB7XG4gICAgICAgICAgaWYgKGFycmF5Q29udGFpbnModGFyZ2V0cywgYW5pbWF0YWJsZXNbYV0udGFyZ2V0KSkge1xuICAgICAgICAgICAgYW5pbWF0YWJsZXMuc3BsaWNlKGEsIDEpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRhYmxlcy5sZW5ndGgpIHR3ZWVucy5zcGxpY2UodCwgMSk7XG4gICAgICAgICAgICBpZiAoIXR3ZWVucy5sZW5ndGgpIGFuaW1hdGlvbi5wYXVzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFuaW1hdGlvbi52ZXJzaW9uID0gdmVyc2lvbjtcbiAgYW5pbWF0aW9uLnNwZWVkID0gMTtcbiAgYW5pbWF0aW9uLmxpc3QgPSBhbmltYXRpb25zO1xuICBhbmltYXRpb24ucmVtb3ZlID0gcmVtb3ZlO1xuICBhbmltYXRpb24uZWFzaW5ncyA9IGVhc2luZ3M7XG4gIGFuaW1hdGlvbi5nZXRWYWx1ZSA9IGdldEluaXRpYWxUYXJnZXRWYWx1ZTtcbiAgYW5pbWF0aW9uLnBhdGggPSBnZXRQYXRoUHJvcHM7XG4gIGFuaW1hdGlvbi5yYW5kb20gPSByYW5kb207XG5cbiAgcmV0dXJuIGFuaW1hdGlvbjtcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FuaW1lanMvYW5pbWUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG5yaW90LnRhZzIoJ21lbnUtbGlzdCcsICc8b2wgY2xhc3M9XCJtZW51LWxpc3RcIj4gPGxpIGVhY2g9XCJ7aXRlbSwgaSBpbiBtZW51fVwiIG9uY2xpY2s9XCJ7b3BlblBvcHVwKGl0ZW0sIGRhdGUuaXNUb2RheShpdGVtLmRhdGUpKX1cIiBkYXRhLWluZGV4PVwie2l9XCIgaWQ9XCJ7ZGF0ZS5pc1RvZGF5KGl0ZW0uZGF0ZSkgPyBcXCd0b2RheVxcJyA6IFxcJ1xcJ31cIiBjbGFzcz1cIm1lbnUtaXRlbSB7ZGF0ZS5pc1RvZGF5KGl0ZW0uZGF0ZSkgPyBcXCd0b2RheVxcJyA6IFxcJ29wZW4tcG9wdXBcXCd9IHtkYXRlLndlZWsoaXRlbS5kYXRlKX1cIj4gPGRpdiBjbGFzcz1cImRhdGVcIj57ZGF0ZS5kYXRlKGl0ZW0uZGF0ZSl9PHNwYW4gY2xhc3M9XCJ3ZWVrXCI+e2RhdGUud2VlayhpdGVtLmRhdGUpfTwvc3Bhbj48L2Rpdj4gPG9sIGlmPVwieyFkYXRlLmlzVG9kYXkoaXRlbS5kYXRlKX1cIiBjbGFzcz1cIml0ZW0tbGlzdFwiPiA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj4gPGRpdiBjbGFzcz1cImxhYmVsXCI+5pydPC9kaXY+IDxkaXYgb25sb2FkPVwie21fbWFpbiA9IGl0ZW0ubV9tYWluLnNwbGl0KFxcJyxcXCcpfVwiIGNsYXNzPVwibWVudVwiPjxzcGFuPnttX21haW5bMF19PC9zcGFuPjxzcGFuIGlmPVwie21fbWFpblsxXX1cIj4gLyB7bV9tYWluWzFdfTwvc3Bhbj48L2Rpdj4gPC9saT4gPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+IDxkaXYgY2xhc3M9XCJsYWJlbFwiPuaYvDwvZGl2PiA8ZGl2IGNsYXNzPVwibWVudVwiPjxzcGFuPntpdGVtLmxfbWFpbn08L3NwYW4+PC9kaXY+IDwvbGk+IDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPiA8ZGl2IGNsYXNzPVwibGFiZWxcIj7lpJw8L2Rpdj4gPGRpdiBvbmxvYWQ9XCJ7ZF9tYWluID0gaXRlbS5kX21haW4uc3BsaXQoXFwnLFxcJyl9XCIgY2xhc3M9XCJtZW51IGRpbm5lclwiPiA8ZGl2IGlmPVwie2RfbWFpblsxXX1cIj48c3Bhbj57ZF9tYWluWzBdfTwvc3Bhbj48c3Bhbj57ZF9tYWluWzFdfTwvc3Bhbj48L2Rpdj4gPGRpdiBpZj1cInshZF9tYWluWzFdfVwiPjwvZGl2PiA8L2Rpdj4gPC9saT4gPC9vbD4gPG9sIGlmPVwie2RhdGUuaXNUb2RheShpdGVtLmRhdGUpfVwiIGNsYXNzPVwiaXRlbS1saXN0XCI+IDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPiA8ZGl2IGNsYXNzPVwibGFiZWxcIj7mnJ08L2Rpdj4gPGRpdiBvbmxvYWQ9XCJ7bV9tYWluID0gaXRlbS5tX21haW4uc3BsaXQoXFwnLFxcJyl9XCIgY2xhc3M9XCJtZW51XCI+PHNwYW4gY2xhc3M9XCJtYWluXCI+e21fbWFpblswXX08L3NwYW4+PHNwYW4gaWY9XCJ7bV9tYWluWzFdfVwiIGNsYXNzPVwibWFpblwiPnttX21haW5bMV19PC9zcGFuPiA8aHIgY2xhc3M9XCJwYXJ0aXRpb25cIj48c3BhbiBlYWNoPVwie21fc2lkZSBpbiBpdGVtLm1fc2lkZS5zcGxpdChcXCcsXFwnKX1cIiBjbGFzcz1cInNpZGVcIj57bV9zaWRlfTwvc3Bhbj4gPC9kaXY+IDwvbGk+IDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPiA8ZGl2IGNsYXNzPVwibGFiZWxcIj7mmLw8L2Rpdj4gPGRpdiBjbGFzcz1cIm1lbnVcIj48c3BhbiBjbGFzcz1cIm1haW5cIj57aXRlbS5sX21haW59PC9zcGFuPiA8aHIgY2xhc3M9XCJwYXJ0aXRpb25cIj48c3BhbiBlYWNoPVwie2xfc2lkZSBpbiBpdGVtLmxfc2lkZS5zcGxpdChcXCcsXFwnKX1cIiBjbGFzcz1cInNpZGVcIj57bF9zaWRlfTwvc3Bhbj4gPC9kaXY+IDwvbGk+IDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPiA8ZGl2IGNsYXNzPVwibGFiZWxcIj7lpJw8L2Rpdj4gPGRpdiBpZj1cIntkX21haW5bMV19XCIgb25sb2FkPVwie2RfbWFpbiA9IGl0ZW0uZF9tYWluLnNwbGl0KFxcJyxcXCcpfVwiIGNsYXNzPVwibWVudSBkaW5uZXJcIj48c3BhbiBjbGFzcz1cIm1haW5cIj57ZF9tYWluWzBdfTwvc3Bhbj48c3BhbiBjbGFzcz1cIm1haW5cIj57ZF9tYWluWzFdfTwvc3Bhbj4gPGhyIGNsYXNzPVwicGFydGl0aW9uXCI+PHNwYW4gZWFjaD1cIntkX3NpZGUgaW4gaXRlbS5kX3NpZGUuc3BsaXQoXFwnLFxcJyl9XCIgY2xhc3M9XCJzaWRlXCI+e2Rfc2lkZX08L3NwYW4+IDwvZGl2PiA8ZGl2IGlmPVwieyFkX21haW5bMV19XCIgY2xhc3M9XCJldmVudFwiPjwvZGl2PiA8L2xpPiA8L29sPiA8L2xpPiA8L29sPicsICdtZW51LWxpc3QgLm1lbnUtbGlzdCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0eyB3aWR0aDogMTAwJTsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0sW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVteyB3aWR0aDogMTAwJTsgYm94LXNpemluZzogYm9yZGVyLWJveDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSksW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpeyBkaXNwbGF5OiAtd2Via2l0LWZsZXg7IGRpc3BsYXk6IC1tb3otZmxleDsgZGlzcGxheTogLW1zLWZsZXg7IGRpc3BsYXk6IC1vLWZsZXg7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IHBhZGRpbmc6IDhweCA1cHg7IGJhY2tncm91bmQ6ICNmZmY7IGJvcmRlci10b3A6IDFweCBzb2xpZCAjYmJiOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSk6bGFzdC1jaGlsZCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpOmxhc3QtY2hpbGQsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpOmxhc3QtY2hpbGR7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYmJiOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLmRhdGUsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuZGF0ZSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLmRhdGV7IHdpZHRoOiAzMHB4OyBmb250LXNpemU6IDIwcHg7IHRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6ICMxOTE5MTk7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuZGF0ZSAud2VlayxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5kYXRlIC53ZWVrLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuZGF0ZSAud2Vla3sgZGlzcGxheTogYmxvY2s7IGZvbnQtc2l6ZTogMTBweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0LFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0eyBmbGV4OiAxOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW17IGRpc3BsYXk6IC13ZWJraXQtZmxleDsgZGlzcGxheTogLW1vei1mbGV4OyBkaXNwbGF5OiAtbXMtZmxleDsgZGlzcGxheTogLW8tZmxleDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgcGFkZGluZzogOHB4IDVweDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubGFiZWwsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVsLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVseyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDI1cHg7IGhlaWdodDogMjVweDsgYm9yZGVyLXJhZGl1czogMTAwJTsgYmFja2dyb3VuZDogI2NjYzsgbGluZS1oZWlnaHQ6IDI1cHg7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAxMnB4OyBjb2xvcjogIzExMTsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51eyBmbGV4OiAxOyBtYXJnaW4tbGVmdDogNXB4OyBwYWRkaW5nOiA4cHg7IGJvcmRlci1yYWRpdXM6IDVweDsgYmFja2dyb3VuZDogI2ZmZjsgZm9udC1zaXplOiAxNXB4OyBsaW5lLWhlaWdodDogMjBweDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbixbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbixbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciBzcGFueyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IDIycHg7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIHNwYW46OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3Bhbjo6YmVmb3JlLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIHNwYW46OmJlZm9yZXsgZGlzcGxheTogaW5saW5lLWJsb2NrOyB3aWR0aDogMThweDsgaGVpZ2h0OiAxOHB4OyBtYXJnaW46IDFweCAycHggMXB4IC0yMHB4OyBiYWNrZ3JvdW5kOiAjNDQ0OyBmb250LXNpemU6IDEycHg7IGxpbmUtaGVpZ2h0OiAxOHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjZmZmOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciBzcGFuOmZpcnN0LWNoaWxkLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciBzcGFuOmZpcnN0LWNoaWxkLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbTpub3QoLnRvZGF5KSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIHNwYW46Zmlyc3QtY2hpbGR7IG1hcmdpbi1ib3R0b206IDVweDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbjpmaXJzdC1jaGlsZDo6YmVmb3JlLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciBzcGFuOmZpcnN0LWNoaWxkOjpiZWZvcmUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbjpmaXJzdC1jaGlsZDo6YmVmb3JleyBjb250ZW50OiBcXCdBXFwnOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW06bm90KC50b2RheSkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciBzcGFuOmxhc3QtY2hpbGQ6OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbjpsYXN0LWNoaWxkOjpiZWZvcmUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtOm5vdCgudG9kYXkpIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgc3BhbjpsYXN0LWNoaWxkOjpiZWZvcmV7IGNvbnRlbnQ6IFxcJ0JcXCc7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbS5zYXQsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbS5zYXQsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnNhdHsgYmFja2dyb3VuZDogI2Q5ZGJmNjsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtLnNhdCAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVsLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0uc2F0IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubGFiZWwsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnNhdCAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVseyBiYWNrZ3JvdW5kOiAjYTVhYmYwOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW0uc2F0IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnNhdCAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnNhdCAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnV7IGJhY2tncm91bmQ6ICNkOWRiZjY7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbS5zdW4sW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbS5zdW4sW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnN1bnsgYmFja2dyb3VuZDogI2Y2ZDlkYjsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtLnN1biAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVsLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0uc3VuIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubGFiZWwsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnN1biAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVseyBiYWNrZ3JvdW5kOiAjZjBhNWE5OyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW0uc3VuIC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnN1biAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLnN1biAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnV7IGJhY2tncm91bmQ6ICNmNmQ5ZGI7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cCxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cHsgY3Vyc29yOiBwb2ludGVyOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cDpob3ZlcixbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXJ7IGJhY2tncm91bmQ6ICNjY2M7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwOmhvdmVyIC5sYWJlbCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIgLmxhYmVsLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwOmhvdmVyIC5sYWJlbHsgYmFja2dyb3VuZDogI2FhYTsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIuc3VuLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cDpob3Zlci5zdW4sW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIuc3VueyBiYWNrZ3JvdW5kOiAjZjZhNmFiOyB9IG1lbnUtbGlzdCAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cDpob3Zlci5zdW4gLmxhYmVsLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cDpob3Zlci5zdW4gLmxhYmVsLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwOmhvdmVyLnN1biAubGFiZWx7IGJhY2tncm91bmQ6ICNmMDcwNzc7IH0gbWVudS1saXN0IC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwOmhvdmVyLnNhdCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIuc2F0LFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3QgLm1lbnUtaXRlbS5vcGVuLXBvcHVwOmhvdmVyLnNhdHsgYmFja2dyb3VuZDogI2E1YWFmNjsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIuc2F0IC5sYWJlbCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdCAubWVudS1pdGVtLm9wZW4tcG9wdXA6aG92ZXIuc2F0IC5sYWJlbCxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0IC5tZW51LWl0ZW0ub3Blbi1wb3B1cDpob3Zlci5zYXQgLmxhYmVseyBiYWNrZ3JvdW5kOiAjNzI3YmYyOyB9IG1lbnUtbGlzdCAudG9kYXksW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXl7IHBhZGRpbmc6IDVweDsgYm9yZGVyLXRvcDogNXB4IHNvbGlkICNiYmI7IGJvcmRlci1yaWdodDogMnB4IHNvbGlkICNiYmI7IGJvcmRlci1ib3R0b206IDRweCBzb2xpZCAjYmJiOyBib3JkZXItbGVmdDogMnB4IHNvbGlkICNiYmI7IGJhY2tncm91bmQ6ICNmZmY7IH0gbWVudS1saXN0IC50b2RheSAuZGF0ZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5kYXRlLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC50b2RheSAuZGF0ZXsgZm9udC13ZWlnaHQ6IGJvbGQ7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAyNXB4OyBjb2xvcjogIzI1MjUyMTsgfSBtZW51LWxpc3QgLnRvZGF5IC5kYXRlIC53ZWVrLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLmRhdGUgLndlZWssW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5kYXRlIC53ZWVreyBmb250LXdlaWdodDogbm9ybWFsOyBtYXJnaW4tbGVmdDogOHB4OyBmb250LXNpemU6IDE0cHg7IH0gbWVudS1saXN0IC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0sW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0sW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbXsgZGlzcGxheTogLXdlYmtpdC1mbGV4OyBkaXNwbGF5OiAtbW96LWZsZXg7IGRpc3BsYXk6IC1tcy1mbGV4OyBkaXNwbGF5OiAtby1mbGV4OyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBtYXJnaW46IDE1cHggMDsgfSBtZW51LWxpc3QgLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubGFiZWwsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVsLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLmxhYmVseyB3aWR0aDogMjBweDsgbWFyZ2luOiAwIDVweDsgcGFkZGluZzogNDBweCAwOyBib3JkZXItcmFkaXVzOiAyMHB4OyBiYWNrZ3JvdW5kOiAjY2NjOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGxpbmUtaGVpZ2h0OiAzMHB4OyBjb2xvcjogIzIyMjsgfSBtZW51LWxpc3QgLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51eyBkaXNwbGF5OiAtd2Via2l0LWZsZXg7IGRpc3BsYXk6IC1tb3otZmxleDsgZGlzcGxheTogLW1zLWZsZXg7IGRpc3BsYXk6IC1vLWZsZXg7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGZsZXg6IDE7IG1hcmdpbjogMCAxMHB4OyB9IG1lbnUtbGlzdCAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51IC5tYWluLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51IC5tYWluLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUgLm1haW57IG1hcmdpbjogNnB4IDA7IGZvbnQtc2l6ZTogMThweDsgfSBtZW51LWxpc3QgLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSAuc2lkZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudSAuc2lkZSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51IC5zaWRleyBtYXJnaW46IDRweCAwOyBmb250LXNpemU6IDE1cHg7IGNvbG9yOiAjMzMzOyB9IG1lbnUtbGlzdCAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51IC5wYXJ0aXRpb24sW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUgLnBhcnRpdGlvbixbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51IC5wYXJ0aXRpb257IHdpZHRoOiA5NSU7IG1hcmdpbjogNXB4IGF1dG8gOHB4OyBib3JkZXItdG9wOiAwOyBib3JkZXItcmlnaHQ6IDA7IGJvcmRlci1ib3R0b206IDFweCBkYXNoZWQgI2FhYTsgYm9yZGVyLWxlZnQ6IDA7IH0gbWVudS1saXN0IC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbixbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbnsgbWFyZ2luLWxlZnQ6IDI2cHg7IH0gbWVudS1saXN0IC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOjpiZWZvcmUsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOjpiZWZvcmUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46OmJlZm9yZXsgZGlzcGxheTogaW5saW5lLWJsb2NrOyB3aWR0aDogMjBweDsgaGVpZ2h0OiAyMHB4OyBtYXJnaW46IDFweCA0cHggMXB4IC0yNHB4OyBiYWNrZ3JvdW5kOiAjMzMzOyBmb250LXNpemU6IDE1cHg7IGxpbmUtaGVpZ2h0OiAyMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjZmZmOyB9IG1lbnUtbGlzdCAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMSksW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOm50aC1jaGlsZCgxKSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMSl7IG1hcmdpbi1ib3R0b206IDVweDsgfSBtZW51LWxpc3QgLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46bnRoLWNoaWxkKDEpOjpiZWZvcmUsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOm50aC1jaGlsZCgxKTo6YmVmb3JlLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC50b2RheSAuaXRlbS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOm50aC1jaGlsZCgxKTo6YmVmb3JleyBjb250ZW50OiBcXCdBXFwnOyB9IG1lbnUtbGlzdCAudG9kYXkgLml0ZW0tbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMik6OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46bnRoLWNoaWxkKDIpOjpiZWZvcmUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLnRvZGF5IC5pdGVtLWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46bnRoLWNoaWxkKDIpOjpiZWZvcmV7IGNvbnRlbnQ6IFxcJ0JcXCc7IH0nLCAnJywgZnVuY3Rpb24ob3B0cykge1xudmFyIHUgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIGFwaSA9IHJlcXVpcmUoJy4uL2FwaScpO1xudmFyIHNlbGYgPSB0aGlzO1xuXG5zZWxmLnllYXIgPSBvcHRzLnllYXI7XG5zZWxmLm1vbnRoID0gb3B0cy5tb250aDtcbnNlbGYud29yZCA9IG9wdHMud29yZCB8fCBudWxsO1xuXG5zZWxmLmRhdGUgPSB1LmRhdGU7XG5cbnNlbGYub3BlblBvcHVwID0gZnVuY3Rpb24gKGl0ZW0sIGlzVG9kYXkpIHtcbiAgICBpZiAoaXNUb2RheSkgcmV0dXJuO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBvYnMudHJpZ2dlcignb3BlblBvcHVwJywgaXRlbSk7XG4gICAgfTtcbn07XG5cbmFwaS5nZXQoc2VsZi55ZWFyLCBzZWxmLm1vbnRoLCBzZWxmLndvcmQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBzZWxmLm1lbnUgPSBkYXRhLml0ZW1zO1xuICAgIHNlbGYudXBkYXRlKCk7XG59KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3RhZ3MvbWVudS1saXN0LnRhZyIsImNvbnN0IGQgPSBuZXcgRGF0ZTtcblxuY29uc3QgemVybyA9IChudW0sIGx2ID0gMikgPT4ge1xuXHRyZXR1cm4gKGAwMDAwMDAwMDAwJHtudW19YCkuc2xpY2UoLWx2KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5vdzoge1xuXHRcdHllYXI6IGQuZ2V0RnVsbFllYXIoKSxcblx0XHRtb250aDogZC5nZXRNb250aCgpICsgMVxuXHR9LFxuXHRkYXRlOiB7XG5cdFx0eWVhcjogZnVuY3Rpb24oZGF0ZSkge1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoZGF0ZSAvIDEwMDAwKTtcblx0XHR9LFxuXHRcdG1vbnRoOiBmdW5jdGlvbihkYXRlKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihkYXRlIC8gMTAwKSAlIDEwMDtcblx0XHR9LFxuXHRcdGRhdGU6IGZ1bmN0aW9uKGRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlICUgMTAwO1xuXHRcdH0sXG5cdFx0d2Vla19lbjogWydzdW4nLCAnbW9uJywgJ3R1ZScsICd3ZWQnLCAndGh1JywgJ2ZyaScsICdzYXQnXSxcblx0XHR3ZWVrX2phOiBbJ+aXpScsICfmnIgnLCAn54GrJywgJ+awtCcsICfmnKgnLCAn6YeRJywgJ+WcnyddLFxuXHRcdHdlZWs6IGZ1bmN0aW9uKGRhdGUsIGxhbmcpIHtcblx0XHRcdGxhbmcgPSBsYW5nIHx8ICdlbic7XG5cdFx0XHRjb25zdCBkID0gbmV3IERhdGUodGhpcy5mb3JtYXQoZGF0ZSkpO1xuXHRcdFx0Y29uc3Qgd2VlayA9IGQuZ2V0RGF5KCk7XG5cdFx0XHRzd2l0Y2gobGFuZykge1xuXHRcdFx0XHRjYXNlICdqYSc6IHJldHVybiB0aGlzLndlZWtfamFbd2Vla107XG5cdFx0XHRcdGNhc2UgJ2VuJzogcmV0dXJuIHRoaXMud2Vla19lblt3ZWVrXTtcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIHdlZWs7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRmb3JtYXQ6IGZ1bmN0aW9uKG9wdHNfZGF0ZSkge1xuXHRcdFx0Y29uc3QgeWVhciA9IHRoaXMueWVhcihvcHRzX2RhdGUpO1xuXHRcdFx0Y29uc3QgbW9udGggPSB0aGlzLm1vbnRoKG9wdHNfZGF0ZSk7XG5cdFx0XHRjb25zdCBkYXRlID0gdGhpcy5kYXRlKG9wdHNfZGF0ZSk7XG5cdFx0XHRyZXR1cm4gYCR7eWVhcn0tJHt6ZXJvKG1vbnRoKX0tJHt6ZXJvKGRhdGUpfWA7XG5cdFx0fSxcblx0XHRpc1RvZGF5OiBmdW5jdGlvbihvcHRzX2RhdGUpIHtcblx0XHRcdGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0Y29uc3QgeWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdGNvbnN0IG1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcblx0XHRcdGNvbnN0IGRhdGUgPSBkLmdldERhdGUoKTtcblx0XHRcdGNvbnN0IGZvcm1hdCA9IGAke3llYXJ9JHt6ZXJvKG1vbnRoKX0ke3plcm8oZGF0ZSl9YDtcblx0XHRcdGlmKG9wdHNfZGF0ZSA9PSBmb3JtYXQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsYXN0RGF0ZTogZnVuY3Rpb24oeWVhciA9IGQuZ2V0RnVsbFllYXIoKSwgbW9udGggPSBkLmdldE1vbnRoKCkgKyAxKSB7XG5cdFx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcblx0XHR9XG5cdH0sXG5cdHplcm86IHplcm9cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy91dGlscy5qcyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuY29uc3QgdSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubGV0IG1lbnUgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldDogKHllYXIgPSB1Lm5vdy55ZWFyLCBtb250aCA9IHUubm93Lm1vbnRoLCB3b3JkID0gbnVsbCkgPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCBkYXRlID0gYCR7eWVhcn0ke3UuemVybyhtb250aCl9YDtcblx0XHRcdC8vIOWPluW+l+a4iOOBv+OBruWgtOWQiOOBr+WPluW+l+OBl+OBquOBhFxuXHRcdFx0aWYobWVudVtkYXRlXSkge1xuXHRcdFx0XHRyZXNvbHZlKG1lbnVbZGF0ZV0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zdCB1cmwgPSB3b3JkID09PSBudWxsID8gYGh0dHA6Ly91c3dhbi1hcGkuc2ltby53ZWJzaXRlLyR7eWVhcn0vJHt1Lnplcm8obW9udGgpfWBcblx0XHRcdFx0XHRcdFx0XHRcdCAgOiBgaHR0cDovL3Vzd2FuLWFwaS5zaW1vLndlYnNpdGUvJHt5ZWFyfS8ke3UuemVybyhtb250aCl9LyR7d29yZH1gO1xuXHRcdFx0cmVxdWVzdFxuXHRcdFx0XHQuZ2V0KHVybClcblx0XHRcdFx0LmVuZCgoZXJyLCByZXMpID0+IHtcblx0XHRcdFx0XHRpZihlcnIpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51W2RhdGVdID0gcmVzLmJvZHk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXMuYm9keSk7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRhcmNoaXZlOiAoKSA9PiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGlmKG1lbnUuYXJjaGl2ZSkge1xuXHRcdFx0XHRyZXNvbHZlKG1lbnUuYXJjaGl2ZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJlcXVlc3Rcblx0XHRcdFx0LmdldChgaHR0cDovL3Vzd2FuLWFwaS5zaW1vLndlYnNpdGUvYXJjaGl2ZWApXG5cdFx0XHRcdC5lbmQoKGVyciwgcmVzKSA9PiB7XG5cdFx0XHRcdFx0aWYoZXJyKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudS5hcmNoaXZlID0gcmVzLmJvZHk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXMuYm9keSk7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvYXBpLmpzIiwiLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyAvLyBCcm93c2VyIHdpbmRvd1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gV2ViIFdvcmtlclxuICByb290ID0gc2VsZjtcbn0gZWxzZSB7IC8vIE90aGVyIGVudmlyb25tZW50c1xuICBjb25zb2xlLndhcm4oXCJVc2luZyBicm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGluIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuICByb290ID0gdGhpcztcbn1cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVxdWVzdEJhc2UgPSByZXF1aXJlKCcuL3JlcXVlc3QtYmFzZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxudmFyIHJlcXVlc3QgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLmJpbmQobnVsbCwgUmVxdWVzdCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAgICYmICghcm9vdC5sb2NhdGlvbiB8fCAnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2xcbiAgICAgICAgICB8fCAhcm9vdC5BY3RpdmVYT2JqZWN0KSkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC42LjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuMy4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgfVxuICB0aHJvdyBFcnJvcihcIkJyb3dzZXItb25seSB2ZXJpc29uIG9mIHN1cGVyYWdlbnQgY291bGQgbm90IGZpbmQgWEhSXCIpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIG9ialtrZXldKTtcbiAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEhlbHBzICdzZXJpYWxpemUnIHdpdGggc2VyaWFsaXppbmcgYXJyYXlzLlxuICogTXV0YXRlcyB0aGUgcGFpcnMgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGFpcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICovXG5cbmZ1bmN0aW9uIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHZhbCkge1xuICBpZiAodmFsICE9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICB2YWwuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHYpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgICBmb3IodmFyIHN1YmtleSBpbiB2YWwpIHtcbiAgICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSArICdbJyArIHN1YmtleSArICddJywgdmFsW3N1YmtleV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYWlyO1xuICB2YXIgcG9zO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwb3MgPSBwYWlyLmluZGV4T2YoJz0nKTtcbiAgICBpZiAocG9zID09IC0xKSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIpXSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UoMCwgcG9zKSldID1cbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UocG9zICsgMSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgcmV0dXJuIC9bXFwvK11qc29uXFxiLy50ZXN0KG1pbWUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHlwZShzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJhbXMoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKSxcbiAgICAgICAga2V5ID0gcGFydHMuc2hpZnQoKSxcbiAgICAgICAgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLl9zZXRTdGF0dXNQcm9wZXJ0aWVzKHRoaXMueGhyLnN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5fc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG4gIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICA/IHRoaXMuX3BhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5fc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9wYXJzZUJvZHkgPSBmdW5jdGlvbihzdHIpe1xuICB2YXIgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIGlmICghcGFyc2UgJiYgaXNKU09OKHRoaXMudHlwZSkpIHtcbiAgICBwYXJzZSA9IHJlcXVlc3QucGFyc2VbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgfVxuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5fc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIC8vIGhhbmRsZSBJRTkgYnVnOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgIHN0YXR1cyA9IDIwNDtcbiAgfVxuXG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9OyAvLyBwcmVzZXJ2ZXMgaGVhZGVyIG5hbWUgY2FzZVxuICB0aGlzLl9oZWFkZXIgPSB7fTsgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gc2VsZi54aHIgJiYgc2VsZi54aHIucmVzcG9uc2VUZXh0ID8gc2VsZi54aHIucmVzcG9uc2VUZXh0IDogbnVsbDtcbiAgICAgIC8vIGlzc3VlICM4NzY6IHJldHVybiB0aGUgaHR0cCBzdGF0dXMgY29kZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnN0YXR1c0NvZGUgPSBzZWxmLnhociAmJiBzZWxmLnhoci5zdGF0dXMgPyBzZWxmLnhoci5zdGF0dXMgOiBudWxsO1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIHZhciBuZXdfZXJyO1xuICAgIHRyeSB7XG4gICAgICBpZiAocmVzLnN0YXR1cyA8IDIwMCB8fCByZXMuc3RhdHVzID49IDMwMCkge1xuICAgICAgICBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgICAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgICAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgICAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBuZXdfZXJyID0gZTsgLy8gIzk4NSB0b3VjaGluZyByZXMgbWF5IGNhdXNlIElOVkFMSURfU1RBVEVfRVJSIG9uIG9sZCBBbmRyb2lkXG4gICAgfVxuXG4gICAgLy8gIzEwMDAgZG9uJ3QgY2F0Y2ggZXJyb3JzIGZyb20gdGhlIGNhbGxiYWNrIHRvIGF2b2lkIGRvdWJsZSBjYWxsaW5nIGl0XG4gICAgaWYgKG5ld19lcnIpIHtcbiAgICAgIHNlbGYuY2FsbGJhY2sobmV3X2VyciwgcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCByZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgIGFuZCBgcmVxdWVzdEJhc2VgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuZm9yICh2YXIga2V5IGluIHJlcXVlc3RCYXNlKSB7XG4gIFJlcXVlc3QucHJvdG90eXBlW2tleV0gPSByZXF1ZXN0QmFzZVtrZXldO1xufVxuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCByZXNwb25zZVR5cGUgdG8gYHZhbGAuIFByZXNlbnRseSB2YWxpZCByZXNwb25zZVR5cGVzIGFyZSAnYmxvYicgYW5kXG4gKiAnYXJyYXlidWZmZXInLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnJlc3BvbnNlVHlwZSgnYmxvYicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnJlc3BvbnNlVHlwZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyB3aXRoICd0eXBlJyBwcm9wZXJ0eSAnYXV0bycgb3IgJ2Jhc2ljJyAoZGVmYXVsdCAnYmFzaWMnKVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzLCBvcHRpb25zKXtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdiYXNpYydcbiAgICB9XG4gIH1cblxuICBzd2l0Y2ggKG9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgJ2Jhc2ljJzpcbiAgICAgIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgICAgIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0byc6XG4gICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzO1xuICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2goJ2NvbnRlbnQnLCBuZXcgQmxvYihbJzxhIGlkPVwiYVwiPjxiIGlkPVwiYlwiPmhleSE8L2I+PC9hPiddLCB7IHR5cGU6IFwidGV4dC9odG1sXCJ9KSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7QmxvYnxGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbihmaWVsZCwgZmlsZSwgZmlsZW5hbWUpe1xuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChmaWVsZCwgZmlsZSwgZmlsZW5hbWUgfHwgZmlsZS5uYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9mb3JtRGF0YTtcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdSZXF1ZXN0IGhhcyBiZWVuIHRlcm1pbmF0ZWRcXG5Qb3NzaWJsZSBjYXVzZXM6IHRoZSBuZXR3b3JrIGlzIG9mZmxpbmUsIE9yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4sIHRoZSBwYWdlIGlzIGJlaW5nIHVubG9hZGVkLCBldGMuJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG5cbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIGVyci51cmwgPSB0aGlzLnVybDtcblxuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuX3RpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogQ29tcG9zZSBxdWVyeXN0cmluZyB0byBhcHBlbmQgdG8gcmVxLnVybFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLl9hcHBlbmRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSB0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCk7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIC8vIHN0b3JlIGNhbGxiYWNrXG4gIHRoaXMuX2NhbGxiYWNrID0gZm4gfHwgbm9vcDtcblxuICAvLyBzdGF0ZSBjaGFuZ2VcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKDQgIT0geGhyLnJlYWR5U3RhdGUpIHJldHVybjtcblxuICAgIC8vIEluIElFOSwgcmVhZHMgdG8gYW55IHByb3BlcnR5IChlLmcuIHN0YXR1cykgb2ZmIG9mIGFuIGFib3J0ZWQgWEhSIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gdGhlIGVycm9yIFwiQ291bGQgbm90IGNvbXBsZXRlIHRoZSBvcGVyYXRpb24gZHVlIHRvIGVycm9yIGMwMGMwMjNmXCJcbiAgICB2YXIgc3RhdHVzO1xuICAgIHRyeSB7IHN0YXR1cyA9IHhoci5zdGF0dXMgfSBjYXRjaChlKSB7IHN0YXR1cyA9IDA7IH1cblxuICAgIGlmICgwID09IHN0YXR1cykge1xuICAgICAgaWYgKHNlbGYudGltZWRvdXQpIHJldHVybiBzZWxmLl90aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLl9hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdmFyIGhhbmRsZVByb2dyZXNzID0gZnVuY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG4gICAgaWYgKGUudG90YWwgPiAwKSB7XG4gICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgfVxuICAgIGUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgfVxuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB0cnkge1xuICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICdkb3dubG9hZCcpO1xuICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3MuYmluZChudWxsLCAndXBsb2FkJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICAgIH1cbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIHRoaXMuX2FwcGVuZFF1ZXJ5U3RyaW5nKCk7XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XG4gICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlLCB0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkKTtcbiAgfSBlbHNlIHtcbiAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuICB9XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIXRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBjb250ZW50VHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX3NlcmlhbGl6ZXIgfHwgcmVxdWVzdC5zZXJpYWxpemVbY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpWzBdIDogJyddO1xuICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9yZXNwb25zZVR5cGUpIHtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcblxuICAvLyBJRTExIHhoci5zZW5kKHVuZGVmaW5lZCkgc2VuZHMgJ3VuZGVmaW5lZCcgc3RyaW5nIGFzIFBPU1QgcGF5bG9hZCAoaW5zdGVhZCBvZiBub3RoaW5nKVxuICAvLyBXZSBuZWVkIG51bGwgaGVyZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICB4aHIuc2VuZCh0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBkYXRhIDogbnVsbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBPUFRJT05TIHF1ZXJ5IHRvIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5vcHRpb25zID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdPUFRJT05TJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlbCh1cmwsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG5yZXF1ZXN0WydkZWwnXSA9IGRlbDtcbnJlcXVlc3RbJ2RlbGV0ZSddID0gZGVsO1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N1cGVyYWdlbnQvbGliL2NsaWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIE1vZHVsZSBvZiBtaXhlZC1pbiBmdW5jdGlvbnMgc2hhcmVkIGJldHdlZW4gbm9kZSBhbmQgY2xpZW50IGNvZGVcbiAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uIF9jbGVhclRpbWVvdXQoKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlc3BvbnNlIGJvZHkgcGFyc2VyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGluY29taW5nIGRhdGEgaW50byByZXF1ZXN0LmJvZHlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UoZm4pe1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgcmVxdWVzdCBib2R5IHNlcmlhbGl6ZXJcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHRvIGNvbnZlcnQgZGF0YSBzZXQgdmlhIC5zZW5kIG9yIC5hdHRhY2ggaW50byBwYXlsb2FkIHRvIHNlbmRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZShmbil7XG4gIHRoaXMuX3NlcmlhbGl6ZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy50aW1lb3V0ID0gZnVuY3Rpb24gdGltZW91dChtcyl7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFByb21pc2Ugc3VwcG9ydFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdFxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqL1xuXG5leHBvcnRzLnRoZW4gPSBmdW5jdGlvbiB0aGVuKHJlc29sdmUsIHJlamVjdCkge1xuICBpZiAoIXRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24oaW5uZXJSZXNvbHZlLCBpbm5lclJlamVjdCl7XG4gICAgICBzZWxmLmVuZChmdW5jdGlvbihlcnIsIHJlcyl7XG4gICAgICAgIGlmIChlcnIpIGlubmVyUmVqZWN0KGVycik7IGVsc2UgaW5uZXJSZXNvbHZlKHJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZnVsbGZpbGxlZFByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xufVxuXG5leHBvcnRzLmNhdGNoID0gZnVuY3Rpb24oY2IpIHtcbiAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIGNiKTtcbn07XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cbmV4cG9ydHMudXNlID0gZnVuY3Rpb24gdXNlKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuXG4vKipcbiAqIEdldCByZXF1ZXN0IGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICogVGhpcyBpcyBhIGRlcHJlY2F0ZWQgaW50ZXJuYWwgQVBJLiBVc2UgYC5nZXQoZmllbGQpYCBpbnN0ZWFkLlxuICpcbiAqIChnZXRIZWFkZXIgaXMgbm8gbG9uZ2VyIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgc3VwZXJhZ2VudCBjb2RlIGJhc2UpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqIEBkZXByZWNhdGVkXG4gKi9cblxuZXhwb3J0cy5nZXRIZWFkZXIgPSBleHBvcnRzLmdldDtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICovXG5leHBvcnRzLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3RcbiAqIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCh7IGZvbzogJ2JhcicsIGJhejogJ3F1eCcgfSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZXxCdWZmZXJ8ZnMuUmVhZFN0cmVhbX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcblxuICAvLyBuYW1lIHNob3VsZCBiZSBlaXRoZXIgYSBzdHJpbmcgb3IgYW4gb2JqZWN0LlxuICBpZiAobnVsbCA9PT0gbmFtZSB8fCAgdW5kZWZpbmVkID09PSBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSBuYW1lIGNhbiBub3QgYmUgZW1wdHknKTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChuYW1lKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICB0aGlzLmZpZWxkKGtleSwgbmFtZVtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB2YWwgc2hvdWxkIGJlIGRlZmluZWQgbm93XG4gIGlmIChudWxsID09PSB2YWwgfHwgdW5kZWZpbmVkID09PSB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJy5maWVsZChuYW1lLCB2YWwpIHZhbCBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cbiAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2Fib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhociAmJiB0aGlzLnhoci5hYm9ydCgpOyAvLyBicm93c2VyXG4gIHRoaXMucmVxICYmIHRoaXMucmVxLmFib3J0KCk7IC8vIG5vZGVcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpe1xuICAvLyBUaGlzIGlzIGJyb3dzZXItb25seSBmdW5jdGlvbmFsaXR5LiBOb2RlIHNpZGUgaXMgbm8tb3AuXG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIG1heCByZWRpcmVjdHMgdG8gYG5gLiBEb2VzIG5vdGluZyBpbiBicm93c2VyIFhIUiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVkaXJlY3RzID0gZnVuY3Rpb24obil7XG4gIHRoaXMuX21heFJlZGlyZWN0cyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IHRvIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgKG5vdCBKU09OIHN0cmluZykgb2Ygc2NhbGFyIHByb3BlcnRpZXMuXG4gKiBOb3RlIGFzIHRoaXMgbWV0aG9kIGlzIGRlc2lnbmVkIHRvIHJldHVybiBhIHVzZWZ1bCBub24tdGhpcyB2YWx1ZSxcbiAqIGl0IGNhbm5vdCBiZSBjaGFpbmVkLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gZGVzY3JpYmluZyBtZXRob2QsIHVybCwgYW5kIGRhdGEgb2YgdGhpcyByZXF1ZXN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudG9KU09OID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgIHVybDogdGhpcy51cmwsXG4gICAgZGF0YTogdGhpcy5fZGF0YSxcbiAgICBoZWFkZXJzOiB0aGlzLl9oZWFkZXJcbiAgfTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5faXNIb3N0ID0gZnVuY3Rpb24gX2lzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGBkYXRhYCBhcyB0aGUgcmVxdWVzdCBib2R5LCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0nKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKG9iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgLy8gZGVmYXVsdCB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFvYmogfHwgdGhpcy5faXNIb3N0KGRhdGEpKSByZXR1cm4gdGhpcztcblxuICAvLyBkZWZhdWx0IHRvIGpzb25cbiAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2pzb24nKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gbnVsbCAhPT0gb2JqICYmICdvYmplY3QnID09PSB0eXBlb2Ygb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N1cGVyYWdlbnQvbGliL2lzLW9iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gVGhlIG5vZGUgYW5kIGJyb3dzZXIgbW9kdWxlcyBleHBvc2UgdmVyc2lvbnMgb2YgdGhpcyB3aXRoIHRoZVxuLy8gYXBwcm9wcmlhdGUgY29uc3RydWN0b3IgZnVuY3Rpb24gYm91bmQgYXMgZmlyc3QgYXJndW1lbnRcbi8qKlxuICogSXNzdWUgYSByZXF1ZXN0OlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIHJlcXVlc3QoJ0dFVCcsICcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnLCBjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdXJsIG9yIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiByZXF1ZXN0KFJlcXVlc3RDb25zdHJ1Y3RvciwgbWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgyID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcignR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKG1ldGhvZCwgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxucmlvdC50YWcyKCdtZW51LXBvcHVwJywgJzxkaXYgaWQ9XCJwb3B1cFdyYXBwZXJcIiBzaG93PVwie2lzT3Blbn1cIiBjbGFzcz1cInBvcHVwLXdyYXBwZXJcIj4gPGRpdiBpZD1cInBvcHVwXCIgY2xhc3M9XCJkaWFsb2dcIj4gPGRpdiBjbGFzcz1cImhlYWRlciB7ZGF0ZS53ZWVrKGRhdGEuZGF0ZSl9XCI+e2RhdGUuZGF0ZShkYXRhLmRhdGUpfTxzcGFuIGNsYXNzPVwid2Vla1wiPntkYXRlLndlZWsoZGF0YS5kYXRlKX08L3NwYW4+PC9kaXY+IDxkaXYgaWQ9XCJwb3B1cEJvZHlcIiBjbGFzcz1cIm1haW4tYXJlYVwiPiA8b2wgY2xhc3M9XCJtZW51LWxpc3RcIj4gPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+IDxkaXYgY2xhc3M9XCJsYWJlbFwiPuacnTwvZGl2PiA8ZGl2IG9ubG9hZD1cInttX21haW4gPSBkYXRhLm1fbWFpbi5zcGxpdChcXCcsXFwnKX1cIiBjbGFzcz1cIm1lbnVcIj4gPGRpdiBjbGFzcz1cIm1haW5cIj48c3Bhbj57bV9tYWluWzBdfTwvc3Bhbj48c3BhbiBpZj1cInttX21haW5bMV19XCI+IC8ge21fbWFpblsxXX08L3NwYW4+PC9kaXY+PHNwYW4gZWFjaD1cInttX3NpZGUgaW4gZGF0YS5tX3NpZGUuc3BsaXQoXFwnLFxcJyl9XCIgY2xhc3M9XCJzaWRlXCI+e21fc2lkZX08L3NwYW4+IDwvZGl2PiA8L2xpPiA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj4gPGRpdiBjbGFzcz1cImxhYmVsXCI+5pi8PC9kaXY+IDxkaXYgY2xhc3M9XCJtZW51XCI+PHNwYW4gY2xhc3M9XCJtYWluXCI+e2RhdGEubF9tYWlufTwvc3Bhbj48c3BhbiBlYWNoPVwie2xfc2lkZSBpbiBkYXRhLmxfc2lkZS5zcGxpdChcXCcsXFwnKX1cIiBjbGFzcz1cInNpZGVcIj57bF9zaWRlfTwvc3Bhbj48L2Rpdj4gPC9saT4gPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+IDxkaXYgY2xhc3M9XCJsYWJlbFwiPuWknDwvZGl2PiA8ZGl2IG9ubG9hZD1cIntkX21haW4gPSBkYXRhLmRfbWFpbi5zcGxpdChcXCcsXFwnKX1cIiBjbGFzcz1cIm1lbnUgZGlubmVyXCI+PHNwYW4gY2xhc3M9XCJtYWluXCI+e2RfbWFpblswXX08L3NwYW4+PHNwYW4gY2xhc3M9XCJtYWluXCI+e2RfbWFpblsxXX08L3NwYW4+PHNwYW4gZWFjaD1cIntkX3NpZGUgaW4gZGF0YS5kX3NpZGUuc3BsaXQoXFwnLFxcJyl9XCIgY2xhc3M9XCJzaWRlXCI+e2Rfc2lkZX08L3NwYW4+PC9kaXY+IDwvbGk+IDwvb2w+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9vdGVyXCI+IDxidXR0b24gb25jbGljaz1cIntjbG9zZX1cIiBjbGFzcz1cImNsb3NlLWJ0blwiPumWieOBmOOCizwvYnV0dG9uPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICdtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyLFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIsW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyeyBwb3NpdGlvbjogZml4ZWQ7IHRvcDogMDsgbGVmdDogMDsgYm90dG9tOiAwOyByaWdodDogMDsgei1pbmRleDogOTk5OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2csW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2d7IHBvc2l0aW9uOiBmaXhlZDsgdG9wOiAzMHB4OyBsZWZ0OiAxNXB4OyBib3R0b206IDUwcHg7IHJpZ2h0OiAxNXB4OyBkaXNwbGF5OiAtd2Via2l0LWZsZXg7IGRpc3BsYXk6IC1tb3otZmxleDsgZGlzcGxheTogLW1zLWZsZXg7IGRpc3BsYXk6IC1vLWZsZXg7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJvcmRlcjogNXB4IHNvbGlkICM3OTc5Nzk7IGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44NSk7IG9wYWNpdHk6IDA7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5oZWFkZXIsW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5oZWFkZXIsW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmhlYWRlcnsgbWFyZ2luOiAxMHB4IDAgNXB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjMjUyNTEyOyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuaGVhZGVyLnN1bixbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmhlYWRlci5zdW4sW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmhlYWRlci5zdW57IGNvbG9yOiAjZjA3MDc3OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuaGVhZGVyLnNhdCxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmhlYWRlci5zYXQsW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmhlYWRlci5zYXR7IGNvbG9yOiAjNzI3YmYyOyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuaGVhZGVyIC53ZWVrLFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuaGVhZGVyIC53ZWVrLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5oZWFkZXIgLndlZWt7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC13ZWlnaHQ6IG5vcm1hbDsgbWFyZ2luLWxlZnQ6IDhweDsgZm9udC1zaXplOiAxNHB4OyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhLFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWF7IGZsZXg6IDE7IG92ZXJmbG93LXk6IGF1dG87IHBhZGRpbmc6IDEwcHggMjVweDsgfSBtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0sW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVteyBtYXJnaW4tYm90dG9tOiAzMHB4OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbTpsYXN0LWNoaWxkLFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbTpsYXN0LWNoaWxkLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtOmxhc3QtY2hpbGR7IG1hcmdpbi1ib3R0b206IDEwcHg7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5sYWJlbCxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLmxhYmVsLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5sYWJlbHsgbWF4LXdpZHRoOiAyMDBweDsgaGVpZ2h0OiAyMHB4OyBtYXJnaW46IDAgYXV0bzsgYm9yZGVyLXJhZGl1czogOHB4OyBiYWNrZ3JvdW5kOiAjZDVkNWQ1OyBsaW5lLWhlaWdodDogMjBweDsgZm9udC1zaXplOiAxNHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudSxbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudXsgZGlzcGxheTogLXdlYmtpdC1mbGV4OyBkaXNwbGF5OiAtbW96LWZsZXg7IGRpc3BsYXk6IC1tcy1mbGV4OyBkaXNwbGF5OiAtby1mbGV4OyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogY2VudGVyOyBtYXJnaW46IDEwcHggMDsgfSBtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUgLm1haW4sW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51IC5tYWluLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51IC5tYWlueyBtYXJnaW46IDEwcHggMDsgcGFkZGluZzogMDsgZm9udC1zaXplOiAyMnB4OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudSAuc2lkZSxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUgLnNpZGUsW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUgLnNpZGV7IG1hcmdpbjogOHB4IDA7IGZvbnQtc2l6ZTogMTVweDsgY29sb3I6ICMzMzM7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbixbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbnsgbWFyZ2luLWxlZnQ6IDI2cHg7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjo6YmVmb3JlLFtyaW90LXRhZz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46OmJlZm9yZSxbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46OmJlZm9yZSxtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOjphZnRlcixbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOjphZnRlcixbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46OmFmdGVyeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHdpZHRoOiAyMnB4OyBoZWlnaHQ6IDIycHg7IG1hcmdpbjogMXB4IDZweCAxcHggLTI2cHg7IGJhY2tncm91bmQ6ICMzMzM7IGZvbnQtc2l6ZTogMTVweDsgbGluZS1oZWlnaHQ6IDIycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6ICNmZmY7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMSksW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMSksW2RhdGEtaXM9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOm50aC1jaGlsZCgxKXsgbWFyZ2luLWJvdHRvbTogNXB4OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46bnRoLWNoaWxkKDEpOjpiZWZvcmUsW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMSk6OmJlZm9yZSxbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAubWFpbi1hcmVhIC5tZW51LWxpc3QgLmxpc3QtaXRlbSAubWVudS5kaW5uZXIgLm1haW46bnRoLWNoaWxkKDEpOjpiZWZvcmV7IGNvbnRlbnQ6IFxcJ0FcXCc7IH0gbWVudS1wb3B1cCAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMik6OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLm1haW4tYXJlYSAubWVudS1saXN0IC5saXN0LWl0ZW0gLm1lbnUuZGlubmVyIC5tYWluOm50aC1jaGlsZCgyKTo6YmVmb3JlLFtkYXRhLWlzPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5tYWluLWFyZWEgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5tZW51LmRpbm5lciAubWFpbjpudGgtY2hpbGQoMik6OmJlZm9yZXsgY29udGVudDogXFwnQlxcJzsgfSBtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmZvb3RlcixbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmZvb3RlcixbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuZm9vdGVyeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiA2MHB4OyB9IG1lbnUtcG9wdXAgLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuZm9vdGVyIC5jbG9zZS1idG4sW3Jpb3QtdGFnPVwibWVudS1wb3B1cFwiXSAucG9wdXAtd3JhcHBlciAuZGlhbG9nIC5mb290ZXIgLmNsb3NlLWJ0bixbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuZm9vdGVyIC5jbG9zZS1idG57IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogOTAlOyBoZWlnaHQ6IDQwcHg7IG1hcmdpbjogMTBweCBhdXRvOyBvdXRsaW5lOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7IGJvcmRlcjogMXB4IHNvbGlkICNhYWE7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBmb250LXNpemU6IDE1cHg7IGNvbG9yOiAjNDU0NTQ1OyBjdXJzb3I6IHBvaW50ZXI7IHRyYW5zaXRpb246IGFsbCAuMnMgZWFzZTsgfSBtZW51LXBvcHVwIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmZvb3RlciAuY2xvc2UtYnRuOmFjdGl2ZSxbcmlvdC10YWc9XCJtZW51LXBvcHVwXCJdIC5wb3B1cC13cmFwcGVyIC5kaWFsb2cgLmZvb3RlciAuY2xvc2UtYnRuOmFjdGl2ZSxbZGF0YS1pcz1cIm1lbnUtcG9wdXBcIl0gLnBvcHVwLXdyYXBwZXIgLmRpYWxvZyAuZm9vdGVyIC5jbG9zZS1idG46YWN0aXZleyBiYWNrZ3JvdW5kOiAjNDU0NTQ1OyBib3JkZXItY29sb3I6ICM0NTQ1NDU7IGNvbG9yOiAjZTBlMGUwOyB9JywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciBzZWxmID0gdGhpcztcbnZhciBhbmltZSA9IHJlcXVpcmUoJ2FuaW1lanMnKTtcbnNlbGYuZGF0ZSA9IHJlcXVpcmUoJy4uL3V0aWxzJykuZGF0ZTtcblxuc2VsZi5pc09wZW4gPSBmYWxzZTtcblxuc2VsZi5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBhbmltZSh7XG4gICAgICAgIHRhcmdldHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpLFxuICAgICAgICBkZWxheTogMTAwLFxuICAgICAgICBkdXJhdGlvbjogNDAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgICB0cmFuc2xhdGVZOiAnNDBweCcsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHN0ZXAucHJvZ3Jlc3MgKiAyIDwgMCA/IDAgOiBzdGVwLnByb2dyZXNzICogMjtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibHVyJykuc3R5bGUuV2Via2l0RmlsdGVyID0gJ2JsdXIoJyArICgzIC0gMyAqIHByb2dyZXNzIC8gMTAwKSArICdweCknO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHJpb3QudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbm9icy5vbignb3BlblBvcHVwJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBzZWxmLmRhdGEgPSBkYXRhO1xuICAgIHNlbGYuaXNPcGVuID0gdHJ1ZTtcbiAgICByaW90LnVwZGF0ZSgpO1xuICAgIHZhciAkZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwJyk7XG4gICAgJGVsZS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSg0MHB4KSc7XG4gICAgYW5pbWUoe1xuICAgICAgICB0YXJnZXRzOiAkZWxlLFxuICAgICAgICBkZWxheTogMTAwLFxuICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgICB0cmFuc2xhdGVZOiAwLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmx1cicpLnN0eWxlLldlYmtpdEZpbHRlciA9ICdibHVyKCcgKyAzICogc3RlcC5wcm9ncmVzcyAvIDEwMCArICdweCknO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3RhZ3MvbWVudS1wb3B1cC50YWciLCJcbnJpb3QudGFnMignZm9vdGVyLW5hdicsICc8YnRuIGljb25zPVwie1tcXCdpb3MtY2FsZW5kYXItb3V0bGluZVxcJ119XCIgdGV4dD1cIumBjuWOu+OBrueMrueri1wiIG9uY2xpY2s9XCJ7dG9nZ2xlQXJjaGl2ZUxpc3R9XCI+PC9idG4+IDxkaXYgaWQ9XCJhcmNoaXZlTGlzdFwiIGNsYXNzPVwiYXJjaGl2ZS1saXN0XCI+IDxvbD4gPGxpIGVhY2g9XCJ7aXRlbSBpbiBhcmNoaXZlfVwiIGlmPVwieyEoaXRlbS55ZWFyID09IHUubm93LnllYXIgJmFtcDsmYW1wOyBpdGVtLm1vbnRoID09IHUubm93Lm1vbnRoKX1cIj4gPGJ0biBocmVmPVwiIy9hcmNoaXZlL3tpdGVtLnllYXJ9L3tpdGVtLm1vbnRofVwiIHRleHQ9XCJ7aXRlbS55ZWFyfeW5tHtpdGVtLm1vbnRofeaciFwiPjwvYnRuPiA8L2xpPiA8L29sPiA8L2Rpdj4gPGJ0biBpY29ucz1cIntbXFwnaW9zLXNlYXJjaFxcJ119XCIgdGV4dD1cIuaknOe0olwiIG9uY2xpY2s9XCJ7dG9nZ2xlU2VhcmNoRm9ybX1cIj48L2J0bj4nLCAnZm9vdGVyLW5hdiAuYXJjaGl2ZS1saXN0LFtyaW90LXRhZz1cImZvb3Rlci1uYXZcIl0gLmFyY2hpdmUtbGlzdCxbZGF0YS1pcz1cImZvb3Rlci1uYXZcIl0gLmFyY2hpdmUtbGlzdHsgb3ZlcmZsb3c6IGhpZGRlbjsgaGVpZ2h0OiAwOyBvcGFjaXR5OiAwOyB9IGZvb3Rlci1uYXYgLmFyY2hpdmUtbGlzdCBvbCxbcmlvdC10YWc9XCJmb290ZXItbmF2XCJdIC5hcmNoaXZlLWxpc3Qgb2wsW2RhdGEtaXM9XCJmb290ZXItbmF2XCJdIC5hcmNoaXZlLWxpc3Qgb2x7IG1hcmdpbjogLTEwcHggMyUgMDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgYW5pbWUgPSByZXF1aXJlKCdhbmltZWpzJyk7XG52YXIgYXBpID0gcmVxdWlyZSgnLi4vLi4vYXBpJyk7XG52YXIgc2VsZiA9IHRoaXM7XG5cbnNlbGYudSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzJyk7XG5cbmFwaS5hcmNoaXZlKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHNlbGYuYXJjaGl2ZSA9IGRhdGEuaXRlbXM7XG4gICAgc2VsZi5hcmNoaXZlQ291bnQgPSBkYXRhLmNvdW50O1xuICAgIHNlbGYudXBkYXRlKCk7XG59KTtcblxuc2VsZi5pc09wZW4gPSB7XG4gICAgY2FsZW5kYXI6IGZhbHNlXG59O1xuXG5zZWxmLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJjaGl2ZUxpc3QnKTtcbiAgICB2YXIgaXNBcmNoaXZlT3BlbiA9IGZhbHNlO1xuICAgIHNlbGYudG9nZ2xlQXJjaGl2ZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuaW1lKHtcbiAgICAgICAgICAgIHRhcmdldHM6ICRsaXN0LFxuICAgICAgICAgICAgZHVyYXRpb246IDMwMCxcbiAgICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFkJyxcbiAgICAgICAgICAgIGhlaWdodDogaXNBcmNoaXZlT3BlbiA/IDAgOiAoc2VsZi5hcmNoaXZlQ291bnQgLSAxKSAqIDU1LFxuICAgICAgICAgICAgb3BhY2l0eTogaXNBcmNoaXZlT3BlbiA/IDAgOiAxXG4gICAgICAgIH0pO1xuICAgICAgICBpc0FyY2hpdmVPcGVuID0gfmlzQXJjaGl2ZU9wZW47XG4gICAgfTtcbn0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vZm9vdGVyLW5hdi50YWciLCJcbnJpb3QudGFnMignaG9tZScsICc8ZGl2IGlkPVwiYmx1clwiPiA8bmF2YmFyPjwvbmF2YmFyPiA8bmV4dD48L25leHQ+IDxmb290ZXItbmF2PjwvZm9vdGVyLW5hdj4gPGJ0biBpY29ucz1cIntbXFwnZm9ya1xcJywgXFwna25pZmVcXCddfVwiIHRleHQ9XCLku4rml6Xjga7njK7nq4tcIiBzY3JvbGxlcj1cIntzY3JvbGxlck9wdHN9XCI+PC9idG4+IDxtZW51LWxpc3QgeWVhcj1cInt5ZWFyfVwiIG1vbnRoPVwie21vbnRofVwiPjwvbWVudS1saXN0PiA8Y3JlZGl0PjwvY3JlZGl0PiA8L2Rpdj4gPG1lbnUtcG9wdXA+PC9tZW51LXBvcHVwPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xudmFyIHNlbGYgPSB0aGlzO1xuXG52YXIgZCA9IG5ldyBEYXRlKCk7XG5zZWxmLnllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG5zZWxmLm1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcblxuc2VsZi5zY3JvbGxlck9wdHMgPSB7XG4gICAgdGFyZ2V0OiAndG9kYXknLFxuICAgIGR1cmF0aW9uOiAzMDBcbn07XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy90YWdzL2hvbWUudGFnIiwiXG5yaW90LnRhZzIoJ25leHQnLCAnPGRpdiBjbGFzcz1cIm5leHQtbWVudVwiPiA8Y3VyZmV3PjwvY3VyZmV3PiA8ZGl2IGNsYXNzPVwidGltZVwiPnt0aW1lfTxzcGFuIGNsYXNzPVwic21hbGxcIj7jga7njK7nq4s8L3NwYW4+PC9kaXY+IDxkaXYgaWY9XCJ7bG9hZGluZ31cIiBjbGFzcz1cImxvYWRlclwiPjwvZGl2PiA8ZGl2IGlmPVwieyFsb2FkaW5nfVwiPiA8b2wgaWY9XCJ7bWVudS5zdGF0dXMgPT0gXFwnT0tcXCd9XCIgY2xhc3M9XCJtZW51LWxpc3RcIj4gPGxpIGlmPVwie3RpbWVJZCAhPSAzfVwiIGNsYXNzPVwibWFpblwiPnttZW51Lm1haW5bMF19PHNwYW4gaWY9XCJ7bWVudS5tYWluWzFdfVwiPiAvIHttZW51Lm1haW5bMV19PC9zcGFuPjwvbGk+IDxsaSBpZj1cInt0aW1lSWQgPT0gM31cIiBjbGFzcz1cIm1haW4gZGlubmVyQVwiPnttZW51Lm1haW5bMF19PC9saT4gPGxpIGlmPVwie3RpbWVJZCA9PSAzfVwiIGNsYXNzPVwibWFpbiBkaW5uZXJCXCI+e21lbnUubWFpblsxXX08L2xpPiA8bGkgZWFjaD1cIntpdGVtIGluIG1lbnUuc2lkZXN9XCIgY2xhc3M9XCJzaWRlXCI+e2l0ZW19PC9saT4gPC9vbD4gPGRpdiBpZj1cInttZW51LnN0YXR1cyA9PSBcXCdldmVudFxcJ31cIiBjbGFzcz1cImV2ZW50XCI+IDxwIGNsYXNzPVwidGl0bGVcIj57bWVudS5tYWluWzBdfTwvcD4gPHAgaWY9XCJ7bWVudS5tYWluWzFdfVwiIGNsYXNzPVwidGV4dFwiPnttZW51Lm1haW5bMV19PC9wPiA8L2Rpdj4gPGRpdiBpZj1cInttZW51LnN0YXR1cyA9PSBcXCdub3Rmb3VuZFxcJyB8fCAhbWVudS5zdGF0dXN9XCIgY2xhc3M9XCJub3Rmb3VuZFwiPjxpIGNsYXNzPVwiaW9uLWNvZmZlZSBpY29uXCI+PC9pPiA8cCBjbGFzcz1cInRleHRcIj7njK7nq4vjgpLlj5blvpfjgafjgY3jgb7jgZvjgpPjgafjgZfjgZ88L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgJ25leHQgLm5leHQtbWVudSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnV7IHBvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luOiAxMHB4IDNweCAyMHB4OyBib3JkZXI6IDFweCBzb2xpZCAjYWFhOyBiYWNrZ3JvdW5kOiAjZmZmOyBib3gtc2hhZG93OiAwIDZweCAzcHggLTRweCAjYmJiOyBib3gtc2l6aW5nOiBib3JkZXItYm94OyB0ZXh0LWFsaWduOiBjZW50ZXI7IH0gbmV4dCAubmV4dC1tZW51IC50aW1lLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAudGltZSxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAudGltZXsgcGFkZGluZzogOHB4IDA7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjOyBiYWNrZ3JvdW5kOiAjZGRkOyBjb2xvcjogIzI1MjUyMTsgfSBuZXh0IC5uZXh0LW1lbnUgLnRpbWUgLnNtYWxsLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAudGltZSAuc21hbGwsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLnRpbWUgLnNtYWxseyBtYXJnaW4tbGVmdDogNXB4OyBmb250LXNpemU6IDE2cHg7IGNvbG9yOiAjNDU0NTQ1OyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0LFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0LFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3R7IG1hcmdpbjogMjBweCAxMnB4OyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW57IG1hcmdpbi1ib3R0b206IDVweDsgZm9udC1zaXplOiAyMnB4OyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckE6OmJlZm9yZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJBOjpiZWZvcmUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJBOjpiZWZvcmUsbmV4dCAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW4uZGlubmVyQjo6YmVmb3JlLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZSxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZXsgcG9zaXRpb246IHJlbGF0aXZlOyB0b3A6IC0ycHg7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IDIwcHg7IGhlaWdodDogMjBweDsgbWFyZ2luLXJpZ2h0OiA1cHg7IGJhY2tncm91bmQ6ICMyMjI7IGxpbmUtaGVpZ2h0OiAyMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMTRweDsgY29sb3I6ICNlOWU5ZTk7IH0gbmV4dCAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW4uZGlubmVyQTo6YmVmb3JlLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckE6OmJlZm9yZSxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckE6OmJlZm9yZXsgY29udGVudDogXCJBXCI7IH0gbmV4dCAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW4uZGlubmVyQjo6YmVmb3JlLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZSxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZXsgY29udGVudDogXCJCXCI7IH0gbmV4dCAubmV4dC1tZW51IC5tZW51LWxpc3QgLnNpZGUsW3Jpb3QtdGFnPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3QgLnNpZGUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAuc2lkZXsgbWFyZ2luLXRvcDogOHB4OyBmb250LXNpemU6IDE2cHg7IGNvbG9yOiAjNDQ0OyB9IG5leHQgLm5leHQtbWVudSAuZXZlbnQgLnRpdGxlLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAuZXZlbnQgLnRpdGxlLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5ldmVudCAudGl0bGV7IG1hcmdpbjogMjVweCAwIDMwcHg7IGZvbnQtc2l6ZTogNTBweDsgY29sb3I6ICMyMjI7IH0gbmV4dCAubmV4dC1tZW51IC5ldmVudCAudGV4dCxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLmV2ZW50IC50ZXh0LFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5ldmVudCAudGV4dHsgbWFyZ2luLWJvdHRvbTogMjBweDsgZm9udC1zaXplOiAxNHB4OyBsZXR0ZXItc3BhY2luZzogMC4xOGVtOyBjb2xvcjogIzU1NTsgfSBuZXh0IC5uZXh0LW1lbnUgLm5vdGZvdW5kIC5pY29uLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubm90Zm91bmQgLmljb24sW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm5vdGZvdW5kIC5pY29ueyBkaXNwbGF5OiBibG9jazsgbWFyZ2luOiAyNXB4IDAgMzBweDsgZm9udC1zaXplOiA1MHB4OyBjb2xvcjogIzk5OTsgfSBuZXh0IC5uZXh0LW1lbnUgLm5vdGZvdW5kIC50ZXh0LFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubm90Zm91bmQgLnRleHQsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm5vdGZvdW5kIC50ZXh0eyBtYXJnaW4tYm90dG9tOiAyMHB4OyBmb250LXNpemU6IDEzcHg7IGxldHRlci1zcGFjaW5nOiAwLjE4ZW07IGNvbG9yOiAjNTU1OyB0ZXh0LXNoYWRvdzogMXB4IDFweCAjYmJiOyB9JywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciBzZWxmID0gdGhpcztcbnZhciB1ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIGQgPSBuZXcgRGF0ZSgpO1xudmFyIGhvdXJzID0gZC5nZXRIb3VycygpO1xudmFyIG1pbnV0ZXMgPSBkLmdldE1pbnV0ZXMoKTtcbnZhciBkYXRlID0gZC5nZXREYXRlKCk7XG5cbnZhciBnZXRUb2RheSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICBpZiAoaXRlbS5kYXRlICUgMTAwID09PSBkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJ25vdGZvdW5kJztcbn07XG5cbnZhciBnZXRJdGVtID0gZnVuY3Rpb24gKGRhdGEsIHRpbWVJZCkge1xuICAgIHZhciB0b2RheSA9IGdldFRvZGF5KGRhdGEpO1xuICAgIGlmICh0b2RheSA9PT0gJ25vdGZvdW5kJykge1xuICAgICAgICByZXR1cm4gdG9kYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0aW1lSWQpIHtcbiAgICAgICAgICAgIC8vIOacneOBrueMrueri+OCkui/lOWNtFxuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ09LJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogdG9kYXkubV9tYWluLnNwbGl0KCcsJyksXG4gICAgICAgICAgICAgICAgICAgIHNpZGVzOiB0b2RheS5tX3NpZGUuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyDmmLzjga7njK7nq4vjgpLov5TljbRcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdPSycsXG4gICAgICAgICAgICAgICAgICAgIG1haW46IHRvZGF5LmxfbWFpbi5zcGxpdCgnLCcpLFxuICAgICAgICAgICAgICAgICAgICBzaWRlczogdG9kYXkubF9zaWRlLnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8g5aSc44Gu54yu56uL44KS6L+U5Y20XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnT0snLFxuICAgICAgICAgICAgICAgICAgICBtYWluOiB0b2RheS5kX21haW4uc3BsaXQoJywnKSxcbiAgICAgICAgICAgICAgICAgICAgc2lkZXM6IHRvZGF5LmRfc2lkZS5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8g5qyh44Gu5pel44Gu5pyd6aOf77yI6Kq/5pW05Lit77yJXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnT0snLFxuICAgICAgICAgICAgICAgICAgICBtYWluOiB0b2RheS5tX21haW4uc3BsaXQoJywnKSxcbiAgICAgICAgICAgICAgICAgICAgc2lkZXM6IHRvZGF5Lm1fc2lkZS5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbnZhciBnZXRUaW1lID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoaG91cnMgPCA4IHx8IGhvdXJzID09IDggJiYgbWludXRlcyA8PSAzMCkge1xuICAgICAgICByZXR1cm4geyBpZDogMSwgbGFiZWw6ICfmnJ0nIH07XG4gICAgfSBlbHNlIGlmIChob3VycyA8IDEyIHx8IGhvdXJzID09IDEyICYmIG1pbnV0ZXMgPD0gNTApIHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IDIsIGxhYmVsOiAn5pi8JyB9O1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPCAxOSB8fCBob3VycyA9PSAxOSAmJiBtaW51dGVzIDw9IDQwKSB7XG4gICAgICAgIHJldHVybiB7IGlkOiAzLCBsYWJlbDogJ+WknCcgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBpZDogNCwgbGFiZWw6ICfmmI7ml6Ug5pydJyB9O1xuICAgIH1cbn07XG5cbnZhciB0aW1lID0gZ2V0VGltZSgpO1xuc2VsZi50aW1lID0gdGltZS5sYWJlbDtcbnNlbGYudGltZUlkID0gdGltZS5pZDtcblxuc2VsZi5sb2FkaW5nID0gdHJ1ZTtcblxudmFyIGFwaSA9IHJlcXVpcmUoJy4uL2FwaScpO1xuYXBpLmdldCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICcnKSB7XG4gICAgICAgIHNlbGYubWVudSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ25vdGZvdW5kJ1xuICAgICAgICB9O1xuICAgIH1cbiAgICBzZWxmLm1lbnUgPSBnZXRJdGVtKGRhdGEuaXRlbXMsIHRpbWUuaWQpO1xuICAgIHNlbGYubG9hZGluZyA9IGZhbHNlO1xuICAgIHNlbGYudXBkYXRlKCk7XG59KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3RhZ3MvbmV4dC50YWciLCJcbnJpb3QudGFnMignY3VyZmV3JywgJzxkaXYgaWY9XCJ7aXNTaG93fVwiIGlkPVwiY3VyZmV3XCIgY2xhc3M9XCJjdXJmZXdcIj7ploDpmZDjgpLnorroqo3jgZfjgb7jgZfjgZ/jgYvvvJ8gPGRpdiBjbGFzcz1cImZvb3RlclwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJpb24taW9zLWNpcmNsZS1vdXRsaW5lIGljb25cIj48L3NwYW4+44K/44OD44OX77ya5YaN6KGo56S6PGJyPjxzcGFuIGNsYXNzPVwiaW9uLWlvcy1jaXJjbGUtZmlsbGVkIGljb25cIj48L3NwYW4+44OA44OW44Or44K/44OD44OX77ya56K66KqNPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCAnY3VyZmV3IC5jdXJmZXcsW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcsW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZld3sgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGRpc3BsYXk6IC13ZWJraXQtaW5saW5lLWZsZXg7IGRpc3BsYXk6IC1tb3otaW5saW5lLWZsZXg7IGRpc3BsYXk6IC1tcy1pbmxpbmUtZmxleDsgZGlzcGxheTogLW8taW5saW5lLWZsZXg7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZDogI2FkMTUxNDsgY29sb3I6ICNmZmY7IGZvbnQtc2l6ZTogMjBweDsgdGV4dC1hbGlnbjogY2VudGVyOyB6LWluZGV4OiAxOyBjdXJzb3I6IGRlZmF1bHQ7IH0gY3VyZmV3IC5jdXJmZXcgLmhlYWRlcixbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyLFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlcixjdXJmZXcgLmN1cmZldyAuZm9vdGVyLFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXIsW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZldyAuZm9vdGVyeyBwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOyBmb250LXNpemU6IDExcHg7IH0gY3VyZmV3IC5jdXJmZXcgLmhlYWRlciAuaWNvbixbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyIC5pY29uLFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlciAuaWNvbixjdXJmZXcgLmN1cmZldyAuZm9vdGVyIC5pY29uLFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXIgLmljb24sW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZldyAuZm9vdGVyIC5pY29ueyBtYXJnaW46IDAgNHB4OyB9IGN1cmZldyAuY3VyZmV3IC5oZWFkZXIsW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlcixbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXJ7IHRvcDogNXB4OyB9IGN1cmZldyAuY3VyZmV3IC5oZWFkZXIgLmxlZnQsW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlciAubGVmdCxbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXIgLmxlZnR7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMTBweDsgfSBjdXJmZXcgLmN1cmZldyAuaGVhZGVyIC5yaWdodCxbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyIC5yaWdodCxbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXIgLnJpZ2h0eyBwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0OiAxMHB4OyB9IGN1cmZldyAuY3VyZmV3IC5mb290ZXIsW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmZvb3RlcixbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXJ7IGJvdHRvbTogNXB4OyB9IGN1cmZldyAuY3VyZmV3IC5mb290ZXIgLmNlbnRlcixbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuZm9vdGVyIC5jZW50ZXIsW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZldyAuZm9vdGVyIC5jZW50ZXJ7IG1hcmdpbjogMCBhdXRvOyB9JywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciBMb2NrciA9IHJlcXVpcmUoJ2xvY2tyJyk7XG52YXIgYW5pbWUgPSByZXF1aXJlKCdhbmltZWpzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIGQgPSBuZXcgRGF0ZSgpO1xudmFyIG5vdyA9IHtcbiAgICB5ZWFyOiBkLmdldEZ1bGxZZWFyKCksXG4gICAgbW9udGg6IGQuZ2V0TW9udGgoKSArIDEsXG4gICAgZGF0ZTogZC5nZXREYXRlKCksXG4gICAgZm9ybWF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhciArICctJyArIHV0aWxzLnplcm8odGhpcy5tb250aCkgKyAnLScgKyB1dGlscy56ZXJvKHRoaXMuZGF0ZSk7XG4gICAgfVxufTtcbnZhciBzZWxmID0gdGhpcztcblxuaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgIHZhciBjaGVja2VkID0gTG9ja3IuZ2V0KCdjdXJmZXcnKTtcbiAgICBpZiAoY2hlY2tlZCA9PT0gbm93LmZvcm1hdGVkKCkpIHtcbiAgICAgICAgc2VsZi5pc1Nob3cgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmlzU2hvdyA9IHRydWU7XG4gICAgfVxufSBlbHNlIHtcbiAgICBzZWxmLmlzU2hvdyA9IGZhbHNlO1xufVxuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3cpIHtcbiAgICAgICAgdmFyICRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cmZldycpO1xuICAgICAgICAvLyBGaXJzdENsaWNr44Gu5Yik5a6a44OV44Op44KwXG4gICAgICAgIHZhciBjbGlja2VkID0gZmFsc2U7XG4gICAgICAgIC8vICRlbGVt44Gu44Kv44Oq44OD44Kv44Kk44OZ44Oz44OIXG4gICAgICAgICRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyDjg5Xjg6njgrDjgYznq4vjgaPjgabjgYTjgZ/jgolEYmxjbGlja1xuICAgICAgICAgICAgaWYgKGNsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBjbGlja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgTG9ja3Iuc2V0KCdjdXJmZXcnLCBub3cuZm9ybWF0ZWQoKSk7XG4gICAgICAgICAgICAgICAgYW5pbWUoe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAkZWxlbSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDMwMCxcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiAnZWFzZU91dENpcmMnLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMC42LFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g44OV44Op44Kw44KS55m76YyyXG4gICAgICAgICAgICBjbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIOaZgumWk+e1jOmBjuW+jOOBp+ODleODqeOCsOOBjOeri+OBo+OBn+OBvuOBvuOBquOCiVNnbGNsaWNrXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAkZWxlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Q2lyYycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMS40LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdGFncy9jdXJmZXcudGFnIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIGV4cG9ydHMpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiAgICAgIHJvb3QuTG9ja3IgPSBmYWN0b3J5KHJvb3QsIGV4cG9ydHMpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuTG9ja3IgPSBmYWN0b3J5KHJvb3QsIHt9KTtcbiAgfVxuXG59KHRoaXMsIGZ1bmN0aW9uKHJvb3QsIExvY2tyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihlbHQgLyosIGZyb20qLylcbiAgICB7XG4gICAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGggPj4+IDA7XG5cbiAgICAgIHZhciBmcm9tID0gTnVtYmVyKGFyZ3VtZW50c1sxXSkgfHwgMDtcbiAgICAgIGZyb20gPSAoZnJvbSA8IDApXG4gICAgICA/IE1hdGguY2VpbChmcm9tKVxuICAgICAgOiBNYXRoLmZsb29yKGZyb20pO1xuICAgICAgaWYgKGZyb20gPCAwKVxuICAgICAgICBmcm9tICs9IGxlbjtcblxuICAgICAgZm9yICg7IGZyb20gPCBsZW47IGZyb20rKylcbiAgICAgIHtcbiAgICAgICAgaWYgKGZyb20gaW4gdGhpcyAmJlxuICAgICAgICAgICAgdGhpc1tmcm9tXSA9PT0gZWx0KVxuICAgICAgICAgIHJldHVybiBmcm9tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICBMb2Nrci5wcmVmaXggPSBcIlwiO1xuXG4gIExvY2tyLl9nZXRQcmVmaXhlZEtleSA9IGZ1bmN0aW9uKGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKG9wdGlvbnMubm9QcmVmaXgpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGtleTtcbiAgICB9XG5cbiAgfTtcblxuICBMb2Nrci5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHF1ZXJ5X2tleSwgSlNPTi5zdHJpbmdpZnkoe1wiZGF0YVwiOiB2YWx1ZX0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoY29uc29sZSkgY29uc29sZS53YXJuKFwiTG9ja3IgZGlkbid0IHN1Y2Nlc3NmdWxseSBzYXZlIHRoZSAne1wiKyBrZXkgK1wiOiBcIisgdmFsdWUgK1wifScgcGFpciwgYmVjYXVzZSB0aGUgbG9jYWxTdG9yYWdlIGlzIGZ1bGwuXCIpO1xuICAgIH1cbiAgfTtcblxuICBMb2Nrci5nZXQgPSBmdW5jdGlvbiAoa2V5LCBtaXNzaW5nLCBvcHRpb25zKSB7XG4gICAgdmFyIHF1ZXJ5X2tleSA9IHRoaXMuX2dldFByZWZpeGVkS2V5KGtleSwgb3B0aW9ucyksXG4gICAgICAgIHZhbHVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShxdWVyeV9rZXkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZihsb2NhbFN0b3JhZ2VbcXVlcnlfa2V5XSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSgne1wiZGF0YVwiOlwiJyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHF1ZXJ5X2tleSkgKyAnXCJ9Jyk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoY29uc29sZSkgY29uc29sZS53YXJuKFwiTG9ja3IgY291bGQgbm90IGxvYWQgdGhlIGl0ZW0gd2l0aCBrZXkgXCIgKyBrZXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbWlzc2luZztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZS5kYXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHZhbHVlLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgIH1cbiAgfTtcblxuICBMb2Nrci5zYWRkID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpLFxuICAgICAgICBqc29uO1xuXG4gICAgdmFyIHZhbHVlcyA9IExvY2tyLnNtZW1iZXJzKGtleSk7XG5cbiAgICBpZiAodmFsdWVzLmluZGV4T2YodmFsdWUpID4gLTEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1wiZGF0YVwiOiB2YWx1ZXN9KTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHF1ZXJ5X2tleSwganNvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICBpZiAoY29uc29sZSkgY29uc29sZS53YXJuKFwiTG9ja3IgZGlkbid0IHN1Y2Nlc3NmdWxseSBhZGQgdGhlIFwiKyB2YWx1ZSArXCIgdG8gXCIrIGtleSArXCIgc2V0LCBiZWNhdXNlIHRoZSBsb2NhbFN0b3JhZ2UgaXMgZnVsbC5cIik7XG4gICAgfVxuICB9O1xuXG4gIExvY2tyLnNtZW1iZXJzID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG4gICAgdmFyIHF1ZXJ5X2tleSA9IHRoaXMuX2dldFByZWZpeGVkS2V5KGtleSwgb3B0aW9ucyksXG4gICAgICAgIHZhbHVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShxdWVyeV9rZXkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKVxuICAgICAgcmV0dXJuIFtdO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAodmFsdWUuZGF0YSB8fCBbXSk7XG4gIH07XG5cbiAgTG9ja3Iuc2lzbWVtYmVyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIExvY2tyLnNtZW1iZXJzKGtleSkuaW5kZXhPZih2YWx1ZSkgPiAtMTtcbiAgfTtcblxuICBMb2Nrci5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpO1xuXG4gICAgcmV0dXJuIGtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBMb2Nrci5nZXQoa2V5KTtcbiAgICB9KTtcbiAgfTtcblxuICBMb2Nrci5zcmVtID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpLFxuICAgICAgICBqc29uLFxuICAgICAgICBpbmRleDtcblxuICAgIHZhciB2YWx1ZXMgPSBMb2Nrci5zbWVtYmVycyhrZXksIHZhbHVlKTtcblxuICAgIGluZGV4ID0gdmFsdWVzLmluZGV4T2YodmFsdWUpO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICB2YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIGpzb24gPSBKU09OLnN0cmluZ2lmeSh7XCJkYXRhXCI6IHZhbHVlc30pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHF1ZXJ5X2tleSwganNvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUud2FybihcIkxvY2tyIGNvdWxkbid0IHJlbW92ZSB0aGUgXCIrIHZhbHVlICtcIiBmcm9tIHRoZSBzZXQgXCIrIGtleSk7XG4gICAgfVxuICB9O1xuXG4gIExvY2tyLnJtID0gIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICB9O1xuXG4gIExvY2tyLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB9O1xuICByZXR1cm4gTG9ja3I7XG5cbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Nrci9sb2Nrci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG5yaW90LnRhZzIoJ2FyY2hpdmUnLCAnPGRpdiBpZD1cImJsdXJcIj4gPG5hdmJhcj48L25hdmJhcj4gPGJ0biBocmVmPVwiI1wiIHRleHQ9XCLku4rmnIjjga7njK7nq4tcIj48L2J0bj4gPG1lbnUtbGlzdCB5ZWFyPVwie3llYXJ9XCIgbW9udGg9XCJ7bW9udGh9XCI+PC9tZW51LWxpc3Q+IDxmb290ZXItbmF2PjwvZm9vdGVyLW5hdj4gPGNyZWRpdD48L2NyZWRpdD4gPC9kaXY+IDxtZW51LXBvcHVwPjwvbWVudS1wb3B1cD4nLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMueWVhciA9IG9wdHMueWVhcjtcbnRoaXMubW9udGggPSBvcHRzLm1vbnRoO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdGFncy9hcmNoaXZlLnRhZyIsIlxucmlvdC50YWcyKCdzZWFyY2gnLCAnPGRpdiBpZD1cImJsdXJcIj4gPG5hdmJhcj48L25hdmJhcj4gPGJ0biBocmVmPVwiI1wiIHRleHQ9XCLku4rmnIjjga7njK7nq4tcIj48L2J0bj4gPG1lbnUtbGlzdCB5ZWFyPVwie29wdHMueWVhcn1cIiBtb250aD1cIntvcHRzLm1vbnRofVwiIHdvcmQ9XCJ7b3B0cy53b3JkfVwiPjwvbWVudS1saXN0PiA8Zm9vdGVyLW5hdj48L2Zvb3Rlci1uYXY+IDxjcmVkaXQ+PC9jcmVkaXQ+IDwvZGl2PiA8bWVudS1wb3B1cD48L21lbnUtcG9wdXA+JywgJycsICcnLCBmdW5jdGlvbihvcHRzKSB7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy90YWdzL3NlYXJjaC50YWciXSwic291cmNlUm9vdCI6IiJ9