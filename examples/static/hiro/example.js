(function () {
	"use strict";

	hiro.module("EmptySuite", {
		setUp:   function () {},
		waitFor: function () { return true; },
		onTest:  function () {}
	});

	hiro.module("BasicTests", {
		testSimpleAssertions: function (test) {
			test.assertTrue(true);
			test.assertFalse(false);
			test.assertEqual("Hiro Protagonist", "Hiro Protagonist");
		},

		testExceptions: function (test) {
			test.assertException(function (test) {
				throw new Error();
			}, Error);
		},

		testFailedTest: function (test) {
			test.assertTrue(false);
		},

		testAsync: function (test) {
			test.expect(1);
			test.pause();

			setTimeout(function () {
				test.assertTrue(true);
				test.resume();
			}, 200);
		},

		testFailedExpect: function (test) {
			test.expect(2);
			test.assertTrue(true);
		}
	});

	hiro.module("NovelTests", {
		setUp: function () {
			this.loadFixture({ name: "example" });
		},

		waitFor: function () {
			return this.sandbox.document.getElementsByTagName("body").length > 0;
		},

		onTest: function () {
			return [ this.sandbox.window, this.sandbox.document ];
		},

		testTitle: function (test, win, doc) {
			test.assertEqual(doc.getElementsByTagName("h1")[0].innerHTML, "Snow Crash");
		},

		testAuthor: function (test, win, doc) {
			test.assertEqual(doc.getElementsByTagName("h2")[0].innerHTML, "by Neal Stephenson");
		}
	});

	hiro.module("FailedSuite", {
		onTest: function () {
			throw new Error("Hello, World.");
		},

		testSimple: function (test) {
			test.assertTrue(true);
		}
	});
})();
