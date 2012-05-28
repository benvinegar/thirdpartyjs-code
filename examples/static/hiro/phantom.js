/*jshint browser:true */
/*global hiro:false, console:false, $:false */

(function () {
	"use strict";

	if (!window.haunted)
		return;

	// Wraps a Hiro listener and sends its return value
	// to the console for PhantomJS to receive.

	function bind(name, callback) {
		callback = callback || function () { return {}; };

		hiro.bind(name, function () {
			console.log(JSON.stringify({
				eventName: name,
				data: callback.apply({}, arguments)
			}));
		});
	}

	// Hiro events

	bind("hiro.onStart");
	bind("hiro.onComplete");

	// Suite specific events

	bind("suite.onSetup", function (suite) {
		return { name: suite.name };
	});

	bind("suite.onStart", function (suite) {
		return { name: suite.name };
	});

	bind("suite.onComplete", function (suite, success) {
		return { name: suite.name, success: success };
	});

	// Test specific events

	bind("test.onStart", function (test) {
		return { name: test.toString() };
	});

	bind("test.onComplete", function (test, success, report) {
		if (!success) {
			return {
				name:    test.name,
				success: false,
				report:  report
			};
		}

		return {
			name:    test.toString(),
			success: true
		};
	});
})();
