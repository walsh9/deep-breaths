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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _topiary = __webpack_require__(1);
	
	var _topiary2 = _interopRequireDefault(_topiary);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HEIGHT = 0;
	var THICKNESS = 1;
	var HUE = 2;
	var SATURATION = 3;
	var LIGHTNESS = 4;
	var LEFT_ANGLE = 5;
	var RIGHT_ANGLE = 6;
	var HEIGHT_CHANGE = 7;
	var THICKNESS_CHANGE = 8;
	
	var PHASE_INHALE = 1;
	var PHASE_HOLD_IN = 2;
	var PHASE_EXHALE = 3;
	var PHASE_HOLD_OUT = 4;
	
	var deterministicTree = function deterministicTree(canvas, treeArray, limitArray) {
	  var treeOptions = {
	    canvas: canvas,
	    startPoint: _topiary2.default.Vector2d.new(canvas.width / 2, canvas.height),
	    color: _topiary2.default.Color.new(Math.floor(treeArray[HUE] * 360 + 70), 20, 20),
	    height: treeArray[HEIGHT] * 100 + 20,
	    thickness: treeArray[THICKNESS] * 8 + 2,
	    depth: 7,
	    rainbow: false,
	    colorShiftRate: 0,
	    delay: 0
	  };
	  var mutationOptions = {
	    minLeftAngle: treeArray[LEFT_ANGLE] * limitArray[LEFT_ANGLE],
	    maxLeftAngle: treeArray[LEFT_ANGLE] * limitArray[LEFT_ANGLE],
	    minRightAngle: treeArray[RIGHT_ANGLE] * limitArray[RIGHT_ANGLE],
	    maxRightAngle: treeArray[RIGHT_ANGLE] * limitArray[RIGHT_ANGLE],
	    minHeightChange: treeArray[HEIGHT_CHANGE] * 0.1 + 0.6,
	    maxHeightChange: treeArray[HEIGHT_CHANGE] * 0.1 + 0.6,
	    minThicknessChange: treeArray[THICKNESS_CHANGE] * 0.1 + 0.7,
	    maxThicknessChange: treeArray[THICKNESS_CHANGE] * 0.1 + 0.7
	  };
	  return _topiary2.default.new(treeOptions, mutationOptions);
	};
	
	var clamp = function clamp(n, min, max) {
	  if (min === undefined) {
	    min = 0;
	  }
	  if (max === undefined) {
	    max = 1;
	  }
	  if (n < min) {
	    return min;
	  }
	  if (n > max) {
	    return max;
	  }
	  return n;
	};
	
	var getBreathPoint = function getBreathPoint(time, breathCycle) {
	  var b = breathCycle;
	  var BREATH = b.inhale + b.holdIn + b.exhale + b.holdOut;
	  var t = time % BREATH;
	
	  var breath = {};
	  if (t <= b.inhale) {
	    breath.phase = PHASE_INHALE;
	    breath.value = t / b.inhale;
	  } else if (t <= b.inhale + b.holdIn) {
	    breath.phase = PHASE_HOLD_IN;
	    breath.value = 1;
	  } else if (t <= b.inhale + b.holdIn + b.exhale) {
	    breath.phase = PHASE_EXHALE;
	    breath.value = 1 - (t - (b.inhale + b.holdIn)) / b.exhale;
	  } else {
	    breath.phase = PHASE_HOLD_OUT;
	    breath.value = 0;
	  }
	  return breath;
	};
	
	var arrayOfRandomFloats = function arrayOfRandomFloats(num) {
	  var floats = [];
	  for (var i = 0; i < num; i++) {
	    floats[i] = Math.random();
	  }
	  return floats;
	};
	
	var change = function change(array, runtime, breathCycle) {
	  for (var i = 0; i < array.length; i++) {
	    array[i] = getBreathPoint(runtime, breathCycle).value;
	  }
	  return array;
	};
	
	var updatePrompt = function updatePrompt(prompt, breathPoint) {
	  var message = void 0;
	  switch (breathPoint.phase) {
	    case PHASE_INHALE:
	      message = 'INHALE';
	      break;
	    case PHASE_HOLD_IN:
	      message = 'HOLD';
	      break;
	    case PHASE_EXHALE:
	      message = 'EXHALE';
	      break;
	    case PHASE_HOLD_OUT:
	      message = 'HOLD';
	      break;
	  }
	  prompt.innerText = message;
	};
	
	var seed = arrayOfRandomFloats(9);
	
	var fitCanvasToWindow = function fitCanvasToWindow() {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	};
	
	window.addEventListener('resize', fitCanvasToWindow);
	
	var breathCycle = {};
	breathCycle.inhale = 5000;
	breathCycle.holdIn = 0;
	breathCycle.exhale = 4200;
	breathCycle.holdOut = 0;
	breathCycle.total = breathCycle.inhale + breathCycle.holdIn + breathCycle.exhale + breathCycle.holdOut;
	
	var runtime = 0;
	var interval = 50;
	
	var canvas = document.getElementById("canvas");
	var prompt = document.getElementById('prompt');
	var ctx = canvas.getContext("2d");
	
	var skyGradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
	skyGradient.addColorStop(0, "#00ffff");
	skyGradient.addColorStop(1, "#0066ff");
	
	var drawLeaf = function drawLeaf(_ref) {
	  var startPoint = _ref.startPoint,
	      depth = _ref.depth,
	      thickness = _ref.thickness,
	      id = _ref.id;
	
	  if (depth < 4) {
	    ctx.fillStyle = roots.colors[id % 3];
	    ctx.beginPath();
	    ctx.arc(startPoint.x, startPoint.y, 20 * breathPoint.value, leafAngle, Math.PI + leafAngle);
	    ctx.fill();
	  }
	};
	
	var randomizeTree = function randomizeTree(roots) {
	  roots.colors = roots.colors || [];
	  roots.colors[0] = _topiary2.default.Color.random().toStyle();
	  roots.colors[1] = _topiary2.default.Color.random().toStyle();
	  roots.colors[2] = _topiary2.default.Color.random().toStyle();
	  roots.limits = roots.limits || [];
	  roots.limits[LEFT_ANGLE] = Math.random() * 80;
	  roots.limits[RIGHT_ANGLE] = Math.random() * 80;
	};
	
	var roots = {};
	randomizeTree(roots);
	var breathPoint = 0;
	var leafAngle = 0;
	var draw = function draw() {
	  if (runtime % breathCycle.total - interval < 0) {
	    randomizeTree(roots);
	  }
	  runtime += interval;
	  breathPoint = getBreathPoint(runtime, breathCycle);
	  leafAngle = Math.cos(runtime) * 0.2;
	  var tree = deterministicTree(canvas, change(seed, runtime, breathCycle), roots.limits);
	  tree.on('leafcreated', drawLeaf);
	  tree.on('branchcreated', drawLeaf);
	  updatePrompt(prompt, breathPoint);
	
	  ctx.fillStyle = skyGradient;
	  ctx.fillRect(0, 0, canvas.width, canvas.height);
	  tree.draw();
	};
	
	fitCanvasToWindow();
	setInterval(draw, interval);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	(function webpackUniversalModuleDefinition(root, factory) {
		if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["Topiary"] = factory();else root["Topiary"] = factory();
	})(undefined, function () {
		return (/******/function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};
				/******/
				/******/ // The require function
				/******/function __webpack_require__(moduleId) {
					/******/
					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;
					/******/
					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };
					/******/
					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
					/******/
					/******/ // Flag the module as loaded
					/******/module.loaded = true;
					/******/
					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}
				/******/
				/******/
				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;
				/******/
				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;
				/******/
				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";
				/******/
				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			}(
			/************************************************************************/
			/******/[
			/* 0 */
			/***/function (module, exports, __webpack_require__) {
	
				__webpack_require__(1);
				__webpack_require__(2);
				__webpack_require__(3);
				module.exports = __webpack_require__(4);
	
				/***/
			},
			/* 1 */
			/***/function (module, exports) {
	
				"use strict";
	
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
				var randomBetween = function randomBetween(min, max) {
					return Math.random() * (max - min) + min;
				};
				exports.randomBetween = randomBetween;
	
				/***/
			},
			/* 2 */
			/***/function (module, exports) {
	
				"use strict";
	
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
				var Vector2d = function Vector2d(x, y) {
					this.x = x;
					this.y = y;
				};
	
				Vector2d.prototype.to = function (angle, length) {
					var DEG_TO_RAD = Math.PI / 180;
					var toX = this.x + Math.sin(angle * DEG_TO_RAD) * length;
					var toY = this.y + Math.cos(angle * DEG_TO_RAD) * length;
					return new Vector2d(toX, toY);
				};
	
				exports.default = Vector2d;
	
				/***/
			},
			/* 3 */
			/***/function (module, exports, __webpack_require__) {
	
				"use strict";
	
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
	
				var _math_helpers = __webpack_require__(1);
	
				var Color = function Color(h, s, l) {
					if (typeof h == "string" && s === undefined) {
						this.h = parseInt(style.split("(")[1]);
						this.s = parseInt(style.split(",")[1]);
						this.l = parseInt(style.split(",")[2]);
					} else {
						this.h = h;
						this.s = s;
						this.l = l;
					}
				}; // HSL colors
	
	
				Color.prototype.toStyle = function () {
					return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
				};
	
				Color.prototype.darker = function (n) {
					return new Color(this.h, this.s, Math.max(0, this.l - n));
				};
	
				Color.prototype.shiftHue = function (n) {
					var newH = this.h + n % 359;
					return new Color(newH, this.s, this.l);
				};
	
				Color.random = function () {
					var h = (0, _math_helpers.randomBetween)(0, 359);
					var s = (0, _math_helpers.randomBetween)(0, 100);
					var l = (0, _math_helpers.randomBetween)(0, 100);
					return new Color(h, s, l);
				};
	
				exports.default = Color;
	
				/***/
			},
			/* 4 */
			/***/function (module, exports, __webpack_require__) {
	
				'use strict';
	
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
	
				var _color = __webpack_require__(3);
	
				var _color2 = _interopRequireDefault(_color);
	
				var _vector2d = __webpack_require__(2);
	
				var _vector2d2 = _interopRequireDefault(_vector2d);
	
				var _math_helpers = __webpack_require__(1);
	
				function _interopRequireDefault(obj) {
					return obj && obj.__esModule ? obj : { default: obj };
				}
	
				var TopiaryObject = function TopiaryObject(treeOptions, mutationOptions) {
					var _this = this;
	
					this.id = 0;
					this.subscribers = [];
					this.on = function (event, callback) {
						this.subscribers.push({ event: event, callback: callback });
					};
					this.trigger = function (event, params) {
						for (var i = 0; i < this.subscribers.length; i++) {
							if (this.subscribers[i].event === event) {
								this.subscribers[i].callback.call(undefined, params);
							}
						}
					};
	
					this.alive = true;
					var mutate = function mutate(treeOptions, isRightBranch) {
						var mOpts = _this.mutationOptions;
						var tOpts = treeOptions;
						return {
							canvas: tOpts.canvas,
							depth: tOpts.depth - 1,
							angle: isRightBranch ? tOpts.angle + (0, _math_helpers.randomBetween)(mOpts.minRightAngle, mOpts.maxRightAngle) : tOpts.angle - (0, _math_helpers.randomBetween)(mOpts.minLeftAngle, mOpts.maxLeftAngle),
							height: tOpts.height * (0, _math_helpers.randomBetween)(mOpts.minHeightChange, mOpts.maxHeightChange),
							thickness: tOpts.thickness * (0, _math_helpers.randomBetween)(mOpts.minThicknessChange, mOpts.maxThicknessChange),
							delay: tOpts.delay,
							color: tOpts.color,
							rainbow: tOpts.rainbow,
							colorShiftRate: tOpts.colorShiftRate
						};
					};
	
					var drawTree = function drawTree(treeOptions) {
						var opts = treeOptions;
						if (opts.depth > 0 && _this.alive) {
							(function () {
								if (opts.angle === undefined) {
									opts.angle = 180;
								}
								var branch = drawBranch(opts);
								var leftOptions = mutate(opts, false);
								var rightOptions = mutate(opts, true);
								leftOptions.startPoint = rightOptions.startPoint = branch.endPoint;
								leftOptions.color = rightOptions.color = branch.endColor;
								if (opts.delay) {
									var timeout = window.setTimeout(function () {
										drawTree(leftOptions);
										drawTree(rightOptions);
									}, opts.delay);
								} else {
									drawTree(leftOptions);
									drawTree(rightOptions);
								}
								_this.id++;
								_this.trigger('branchcreated', Object.assign(treeOptions, { id: _this.id }));
							})();
						} else if (_this.alive) {
							_this.id++;
							_this.trigger('leafcreated', Object.assign(treeOptions, { id: _this.id }));
						}
					};
	
					var drawBranch = function drawBranch(treeOptions) {
						var opts = treeOptions;
						var ctx = opts.canvas.getContext("2d");
						var endPoint = opts.startPoint.to(opts.angle, opts.height);
						var color = void 0,
						    nextColor = void 0;
						if (opts.rainbow) {
							nextColor = opts.color.shiftHue(opts.colorShiftRate);
							var gradient = ctx.createLinearGradient(opts.startPoint.x, opts.startPoint.y, endPoint.x, endPoint.y);
							gradient.addColorStop(0, opts.color.toStyle());
							gradient.addColorStop(1, nextColor.toStyle());
							color = gradient;
						} else {
							nextColor = opts.color;
							color = opts.color.toStyle();
						}
						ctx.strokeStyle = color;
						ctx.lineWidth = opts.thickness;
						ctx.beginPath();
						ctx.moveTo(opts.startPoint.x, opts.startPoint.y);
						ctx.lineTo(endPoint.x, endPoint.y);
						ctx.stroke();
						return { endPoint: endPoint, endColor: nextColor };
					};
	
					var mutationDefaults = {
						minLeftAngle: 10,
						maxLeftAngle: 40,
						minRightAngle: 10,
						maxRightAngle: 40,
						minHeightChange: 0.6,
						maxHeightChange: 0.9,
						minThicknessChange: 0.6,
						maxThicknessChange: 0.9
					};
	
					this.treeOptions = treeOptions;
					this.mutationOptions = mutationOptions || mutationDefaults;
					this.draw = function () {
						drawTree(this.treeOptions);
					};
					this.kill = function () {
						this.alive = false;
					};
					return this;
				};
				var Topiary = {};
				Topiary.new = function (treeOptions, mutationOptions) {
					return new TopiaryObject(treeOptions, mutationOptions);
				};
				Topiary.Color = {};
				Topiary.Vector2d = {};
				Topiary.Color.new = function (h, s, l) {
					return new _color2.default(h, s, l);
				};
				Topiary.Color.random = function () {
					return _color2.default.random();
				};
				Topiary.Vector2d.new = function (x, y) {
					return new _vector2d2.default(x, y);
				};
	
				exports.default = Topiary;
	
				/***/
			}
			/******/])
		);
	});
	;
	//# sourceMappingURL=bundle.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map