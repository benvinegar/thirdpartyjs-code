(function(window, undefined) {
    var Stork = {};
    var document = window.document;

    var rpc;

    Stork.api = function() {
        Stork.rpc.apiTunnel.apply(this, arguments);
    };

    Stork.init = function(callback) {
        Stork.script("{{ service_url_for('static', filename='easyxdm/easyXDM.js') }}", function() {
            Stork.rpc = new easyXDM.Rpc({
                remote: "{{ service_url_for('example', chapter='08', name='web-service-api', file='tunnel.html') }}",
                onReady: callback
            }, {
                remote: {
                    apiTunnel: {} // remote stub
                }
            });
        });
    };

    window.Stork = Stork;
})(this);

{% include 'shared/script.js' %}

Stork.script = $script.noConflict();
