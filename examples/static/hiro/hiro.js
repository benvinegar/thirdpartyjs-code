/*!
 * Copyright (c) 2012 Anton Kovalyov, http://hirojs.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function (window, document) {
	"use strict";



var READY   = 0;
var WAITING = 1;
var RUNNING = 2;
var PAUSED  = 3;
var DONE    = 4;

var Hiro = function () {
	this.status = READY;
	this.suites = {};
	this.listeners = {
		"hiro.onStart":     [], // no arguments
		"hiro.onComplete":  [], // no arguments

		"suite.onSetup":    [], // (suite)
		"suite.onStart":    [], // (suite)
		"suite.onComplete": [], // (suite, success, report)

		"test.onStart":     [], // (test)
		"test.onComplete":  []  // (test, success, report)
	};
};

Hiro.prototype = {
	bind: function (name, listener) {
		if (this.listeners[name] === undefined)
			return;

		this.listeners[name].push(listener);
	},

	unbind: function (name, listener) {
		if (this.listeners[name] === undefined)
			return;

		this.listeners[name] = _.filter(this.listeners[name], function (fn) {
			return fn !== listener;
		});
	},

	trigger: function (name, args) {
		if (this.listeners[name] === undefined)
			return;

		_.each(this.listeners[name], function (fn) {
			fn.apply(fn, args);
		});
	},

	attempt: function (fn, obj) {
		obj = obj || {};

		try {
			_.bind(fn, obj)();
		} catch (exc) {
			return exc;
		}

		return null;
	},

	extractStack: function (err, offset) {
		var stack;
		offset = offset || 3;

		// Try to get location using different hacky methods:
		//  * For Opera use 'stacktrace' property
		//  * For Firefox and Chrome use 'stack' property.
		//  * For Safari and PhantomJS use sourceURL but make
		//	  make sure that it's not self-referencing.
		//
		// This code was originally borrowed from QUnit.

		if (err.stacktrace)
			return err.stacktrace.split("\n")[offset + 3];

		if (err.stack) {
			stack = err.stack.split("\n");

			if (/^error$/i.test(stack[0]))
				stack.shift();

			return stack[offset];
		}

		if (err.sourceURL) {
			if (/hiro.js$/.test(err.sourceURL))
				return;

			return err.sourceURL + ":" + err.line;
		}
	},

	getLocation: function (offset) {
		try {
			throw new Error();
		} catch (err) {
			return hiro.extractStack(err, offset);
		}
	},

	module: function (name, methods) {
		var mixin = [];

		if (_.isArray(methods.mixin)) {
			mixin = _.map(methods.mixin, _.bind(function (n) {
				if (this.suites[n] === undefined)
					return {};

				return this.suites[n].methods;
			}, this));

			delete methods.mixin;
		}

		mixin.splice(0, 0, {});
		mixin.push(methods);

		this.suites[name] = new Suite(name, _.extend.apply(_, mixin));
	},

	run: function (name) {
		var self = this;

		self.status = RUNNING;

		self.attempt(function () {
			self.trigger("hiro.onStart");
		});

		var queue = _.filter(self.suites, function (suite) {
			if (name && suite.name !== name)
				return;

			return suite;
		});

		var suite = queue.shift();
		var interval = setInterval(function () {
			if (suite === null || suite === undefined) {
				self.status = DONE;
				self.attempt(function () {
					self.trigger("hiro.onComplete");
				});
				clearInterval(interval);
				return;
			}

			switch(suite.status) {
				case READY:
					suite.prepare(function () {
						suite.run();
					});
					break;
				case DONE:
					if (suite.sandbox)
						suite.sandbox.cleanup();
					suite = queue.shift();
			}
		}, 100);
	}
};



function Asserts(onFailure) {
	this.executed = [];
	this.onFailure = onFailure || function () {};
}

Asserts.prototype = {
	fail: function (name, expected, actual, loc) {
		this.onFailure({
			name: name,
			expected: expected,
			actual: actual,
			location: loc
		});
	},

	done: function (name, expected, actual) {
		this.executed.push({
			name: name,
			expected: expected,
			actual: actual
		});
	},

	assertTrue: function (val) {
		this[val ? "done" : "fail"]("assertTrue", true, val, hiro.getLocation());
	},

	assertFalse: function (val) {
		this[val ? "fail" : "done"]("assertFalse", false, val, hiro.getLocation());
	},

	assertEqual: function (expected, actual) {
		var ok = _.isEqual(actual, expected);
		this[ok ? "done" : "fail"]("assertEqual", expected, actual, hiro.getLocation());
	},

	assertException: function (func, expected) {
		var err = hiro.attempt(func);
		var ok  = err && err instanceof expected;
		this[ok ? "done" : "fail"]("assertException", expected, err || null, hiro.getLocation());
	},

	assertUndefined: function (val) {
		this[val === void 0 ? "done" : "fail"]("assertUndefined", undefined, val, hiro.getLocation());
	},

	assertNull: function (val) {
		this[val === null ? "done" : "fail"]("assertNull", null, val, hiro.getLocation());
	},

	assertOwnProperty: function (obj, prop) {
		var ret = _.has(obj, prop);
		this[ret ? "done" : "fail"]("assertOwnProperty", "(object)", ret, hiro.getLocation());
	},

	assertIndexOf: function (arr, el) {
		var ret = _.indexOf(arr, el);
		this[ret > -1 ? "done" : "fail"]("assertIndexOf", "> -1", ret, hiro.getLocation());
	}
};



function Sandbox(opts) {
	this.window   = null;
	this.document = null;
	this.frame    = null;
	this.name     = opts.name;

	if (opts.url) {
		this.type = "url";
		this.data = opts.url;
		return;
	}

	var el;
	var els = _.union(
		_.toArray(document.getElementsByTagName("script")),
		_.toArray(document.getElementsByTagName("textarea"))
	);

	el = _.find(els, function (el) {
		return el.getAttribute("type") === "hiro/fixture" &&
			el.getAttribute("data-name") === opts.name;
	});

	if (el) {
		this.type = "text";
		this.data = el.tagName.toLowerCase() === "script" ? el.innerHTML : el.value;
	}
}

Sandbox.prototype = {
	append: function (container) {
		container = container || document.body;

		var frame = document.createElement("iframe");
		var win, doc;

		frame.id = "hiro_fixture_" + this.name;
		frame.style.position = "absolute";
		frame.style.top = "-2000px";

		if (this.type == "url") {
			frame.src = this.data;
			container.appendChild(frame);
			win = frame.contentWindow;
			doc = win.document;
		} else {
			container.appendChild(frame);
			win = frame.contentWindow;
			doc = win.document;
			doc.write(this.data);
			doc.close();
		}

		this.window   = win;
		this.document = doc;
		this.frame    = frame;
	},

	cleanup: function () {
		this.frame.parentNode.removeChild(this.frame);
	}
};



function Suite(name, methods) {
	this.name    = name;
	this.methods = methods;
	this.status  = READY;
	this.queue   = [];
	this.report  = {
		success: null,
		tests:   {}
	};
}

Suite.prototype = {
	loadFixture: function (opts) {
		this.sandbox = new Sandbox(opts);
		this.sandbox.append();

		// For backwards compatibility add a reference to
		// sandboxed window and document objects to the
		// suite itself.

		this.window   = this.sandbox.window;
		this.document = this.sandbox.document;
	},

	getFixture: function (name) {
		var sandbox = new Sandbox({ name: name });
		return sandbox.data;
	},

	prepare: function (onReady) {
		onReady = onReady || function () {};
		this.status = WAITING;

		// Execute all listeners for suite.onSetup and pre-emptively
		// finish the suite if any of those listeners throws an
		// exception.

		var err = hiro.attempt(function () {
			hiro.trigger("suite.onSetup", [ this ]);
		}, this);

		if (err !== null)
			return void this.complete();

		err = hiro.attempt(function () {
			if (_.isFunction(this.methods.setUp)) {
				this.methods.setUp.call(this);
			}
		}, this);

		if (err !== null)
			return void this.complete();

		// Select only functions that start with "test". Only these
		// functions will be treated as test cases. Then create a Test
		// object for each test method and place it in the queue.

		_.each(this.methods, _.bind(function (func, name) {
			if (name.slice(0, 4) !== "test" || !_.isFunction(func))
				return;

			var test = new Test({ name: name, func: func });
			this.queue.push(test);
		}, this));

		// If there is a special method 'waitFor' call it repeatedly
		// and wait until it returns true.

		var interval;
		if (this.methods.waitFor && _.isFunction(this.methods.waitFor)) {
			interval = setInterval(_.bind(function () {
				if (this.status !== WAITING)
					return;

				if (this.methods.waitFor.apply(this)) {
					this.status = READY;
					clearInterval(interval);
					onReady();
				}
			}, this), 25);

			return;
		}

		this.status = READY;
		onReady();
	},

	run: function () {
		// Execute all listeners for suite.onStart and pre-emptively
		// finish the suite if any of those listeners throws an
		// exception.

		var err = hiro.attempt(function () {
			hiro.trigger("suite.onStart", [ this ]);
		}, this);

		if (err !== null)
			return void this.complete();

		this.status = RUNNING;

		var test = this.queue.shift();
		var interval = setInterval(_.bind(function () {
			// If there is no more tests to run, declare this suite completed.

			if (test === null || test === undefined) {
				this.complete();
				return void clearInterval(interval);
			}

			// If there is a test, check its status. If it's still running, keep waiting.
			// If it's paused, wait until it goes overtime. And if the test is done,
			// get the next one from the queue.

			switch (test.status) {
				case READY:
					if (_.isFunction(this.methods.onTest)) {

						// Call the onTest method and use its return results as arguments for
						// the actual test. If onTest raises an exception--fail the test.

						err = hiro.attempt(function () {
							test.args = this.methods.onTest.call(this) || test.args;
						}, this);

						if (err !== null)
							return void test.fail({ message: err, source: "onTest" });
					}

					test.run(this);
					break;
				case DONE:
					this.report.tests[test.name] = test.report;
					test = this.queue.shift();
					break;
				default:
					// Wait until its done.
			}
		}, this), 25);
	},

	complete: function () {
		var success = _.all(this.report.tests, function (report) {
			return report.success;
		});

		this.status = DONE;
		hiro.trigger("suite.onComplete", [ this, success, this.report ]);
	}
};



/*jshint devel:true */

function Test(opts) {
	this.name     = opts.name;
	this.func     = opts.func;
	this.timeout  = opts.timeout || 250;
	this.args     = [];
	this.status   = READY;
	this.expected = null;
	this.report   = {
		success: null
	};

	this.asserts = new Asserts(_.bind(function (details) {
		this.fail(details);
	}, this));

	// Add shortcuts to all available assertions so that you could
	// access them via 'this'.

	_.each(Asserts.prototype, _.bind(function (_, name) {
		if (name.slice(0, 6) !== "assert")
			return;

		this[name] = function () {
			this.asserts[name].apply(this.asserts, arguments);
		};
	}, this));
}

Test.prototype = {
	run: function (context) {
		var self = this;
		var err;

		// Trigger all test.onStart listeners and fail the test if any of them
		// raise an exception.

		err = hiro.attempt(function () {
			hiro.trigger("test.onStart", [ self ]);
		});

		if (err !== null)
			return void self.fail({ source: "onStart", message: err });

		// Call the test case function and fail the test if it raises any
		// exceptions. If optional context has been provided bind the test
		// case to it.

		err = hiro.attempt(function () {
			self.func.apply(context || self, _.flatten([self, self.args], true));
		});

		if (err !== null)
			return void self.fail({ source: "Test case", message: err });

		// If test status is DONE it means that an assertion failed and
		// finished the test prematurely.

		if (self.status === DONE)
			return;

		// Put the test into a paused mode and set a timer to fail the
		// test after certain period of time.

		if (self.status === PAUSED) {
			_.delay(function () {
				if (self.status === PAUSED)
					self.fail({ source: "Test case", message: "Timeout limit exceeded." });
			}, self.timeout);

			return;
		}

		// Check that all expected assertions were executed. If self.expected
		// is null, user didn't set any expectations so we're golden.

		var exp = self.expected;
		var act = self.asserts.executed.length;

		if (exp !== null) {
			if (exp !== act) {
				self.fail({
					source: "Test case",
					message: "Only " + act + " out of " + exp + " assertions were executed."
				});

				return;
			}
		}

		// Finally, if we're here--declare this test a success and move on.
		self.success();
	},

	expect: function (num) {
		this.expected = num;
	},

	pause: function (timeout) {
		if (timeout)
			this.timeout = timeout;
		this.status = PAUSED;
	},

	resume: function () {
		if (this.status === DONE)
			return;

		this.success();
	},

	fail: function (details) {
		this.status = DONE;
		this.report.success = false;
		this.report = _.extend(this.report, details);

		hiro.attempt(function () {
			hiro.trigger('test.onComplete', [ this, false, this.report ]);
		}, this);
	},

	success: function () {
		this.status = DONE;
		this.report.success = true;

		hiro.attempt(function () {
			hiro.trigger('test.onComplete', [ this, true, this.report ]);
		}, this);
	},

	toString: function () {
		return this.name;
	}
};


	window.Hiro = Hiro;
})(this, this.document);
