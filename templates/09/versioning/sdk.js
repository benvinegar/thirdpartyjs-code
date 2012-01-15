(function(window, undefined) {
    var Stork = {};

    Stork.instances = {};

    function loadScript(url, callback) {
        var script = document.createElement('script');

        script.type  = 'text/javascript';
        script.async = true;
        script.src   = url;

        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);

        if (script.addEventListener)
            script.addEventListener('load', callback, false);
        else {
            script.attachEvent('onreadystatechange', function onready() {
                if (/complete|loaded/.test(script.readyState)) {
                    callback();

                    script.detachEvent('onreadystatechange', onready);
                }
            });
        }
    }
    Stork.init = function(version, callback) {
        // If no version string is given (function callback is
        // first argument)
        if (typeof version === 'function') {
            callback = version;
            version = '1.1';
        }

        var file;
        switch (version) {
            case '1.0': file = 'lib.1_0.js'; break;
            case '1.1': file = 'lib.1_1.js'; break;
            default:
                throw "Unknown SDK version: " + version;
        }

        loadScript(file, function() {
            callback(Stork.instances[version]);
        });
    };
    window.Stork = Stork;
}(this));