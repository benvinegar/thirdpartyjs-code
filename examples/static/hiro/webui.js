/*jshint browser:true, jquery:true, devel:true */
/*global _:false */

var hiro, main;

(function () {
	"use strict";

	var size = 0;
	var completed = 0;

	hiro = new Hiro();

	main = function () {
		var qs = window.location.search.slice(1).split('.');
		var req = qs.length ? qs[0] : null;

		_.each(hiro.suites, function (suite, name) {
			if (req && req !== name)
				return;

			var view = new SuiteView(name, suite);

			size += _.reduce(_.keys(suite.methods), function (memo, name) {
				return memo + (name.slice(0, 4) === "test" ? 1 : 0);
			}, 0);

			if (size === 0)
				return;

			view.render();
			view.addListeners();
		});

		hiro.bind("hiro.onStart", function () {
			$("div.runall button").attr("disabled", true);
		});

		hiro.bind("hiro.onComplete", function () {
			$("div.runall button").removeAttr("disabled");
		});

		// If we're inside the PhantomJS environment start running tests
		// right away. Otherwise assign a listener to the .runall button.

		if (window.haunted)
			return void hiro.run();

		$("div.runall").click(function () {
			hiro.run(req || undefined);
		});
	};

	function SuiteView(name, model) {
		this.name = name;
		this.tests = [];

		this.templates = {
			suite:  $("#template-suite").html(),
			report: $("#template-report").html(),
			error:  $("#template-report-error").html()
		};

		_.each(model.methods, _.bind(function (func, name) {
			if (name.slice(0, 4) !== "test")
				return;

			this.tests.push(name);
		}, this));
	}

	SuiteView.prototype.render = function () {
		var states = [ "ready", "passed", "failed" ];
		var html = _.template(this.templates.suite, {
			suiteName: this.name,
			tests: this.tests
		});

		$("#suite-views").append(html);
	};

	SuiteView.prototype.addListeners = function () {
		var self = this;

		hiro.bind("test.onStart", function (test) {
			var $el = $("#suite-" + self.name + " .test-" + test.name + " .status .label");
			$el.html("RUNNING");
		});

		hiro.bind("test.onComplete", function (test, success, report) {
			var $el  = $("#suite-" + self.name + " .test-" + test.name + " .status .label");
			var $pr  = $(".progress");
			var $bar = $(".progress .bar");

			if ($el.length === 0)
				return;

			completed += 1;
			$bar.css("width", ((completed / size) * 100) + "%");

			if (success)
				return void $el.addClass("label-success").html("PASS");

			$el.addClass("label-important").html("FAIL");
			$pr.removeClass("progress-success").addClass("progress-danger");

			var html;
			if (report.message) {
				html = _.template(self.templates.error, {
					message:  report.message,
					source:   report.source,
					location: report.location
				});
			} else {
				html = _.template(self.templates.report, {
					assertion: report.name,
					expected:  report.expected,
					actual:    report.actual,
					location:  report.location
				});
			}

			$("#suite-" + self.name + " .report-" + test.name + " td")
				.html(html)
				.parent("tr")
				.show();
		});
	};
})();
