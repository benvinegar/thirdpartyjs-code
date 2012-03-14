(function(window, undefined) {
    var Stork = {};

    if (window.Stork)
        return;

    Stork.init = function(callback) {
        Stork.script("{{ service_url_for('example', chapter='08', name='web-service-api', file='lib.js') }}", function () {
            Stork._initializeLibrary(callback);
        });
    };

    window.Stork = Stork;
})(this);

// Embed the 'script' microlib into our initial script file for loading dependencies.

{% include 'shared/script.js' %}

Stork.script = $script.noConflict();
