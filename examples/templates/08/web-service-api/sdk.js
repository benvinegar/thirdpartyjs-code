(function(window, undefined) {
    var Stork = {};
    var document = window.document;

    var rpc;

    Stork.api = function(endpoint, params, complete) {
        rpc.apiTunnel(endpoint, params, 'GET', function(xhr) {
            var response = {};

            if (xhr.status !== 200)
                response.error = xhr.responseText;
            else
                response.data = JSON.stringify(xhr.responseText);

            complete(response);
        });
    };

    Stork.init = function(callback) {
        Stork.script("{{ service_url_for('static', filename='easyxdm/easyXDM.js') }}", function() {
            rpc = new easyXDM.Rpc({
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
