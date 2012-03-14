{% include 'shared/easyXDM.js' %}

Stork.easyXDM = easyXDM.noConflict('Stork');

(function(Stork) {

    Stork.productWidget = function () {
        // NOTE: This is just a stub for now. The important thing is that it
        // broadcasts the productWidget.rendered event for demonstration
        // purposes.
        broadcast('productWidget.rendered');
    };

    var listeners = {};

    Stork.listen = function(eventName, handler) {
        if (typeof listeners[eventName] === 'undefined')
            listeners[eventName] = [];
        
        listeners[eventName].push(handler);
    };

    Stork.unlisten = function(eventName, handler) {
        if (!listeners[eventName])
            return;
        
        for (var i = 0; i < listeners[eventName].length; i++) {
            if (listeners[eventName][i] === handler) {
                listeners[eventName].splice(i, 1);
                break;
            }
        }
    };

    function broadcast(eventName) {
        if (!listeners[eventName])
            return;

        for (var i = 0; i < listeners[eventName].length; i++) {
            listeners[eventName][i]();
        }
    };

    var rpc;

    Stork.api = function() {
        Stork.rpc.apiTunnel.apply(this, arguments);
    };

    Stork.rpc = null;

    Stork._initializeLibrary = function (callback) {
        Stork.rpc = new Stork.easyXDM.Rpc({
            remote: "{{ service_url_for('example', chapter='08', name='web-service-api', file='tunnel.html') }}",
            onReady: callback
        }, {
            remote: {
                apiTunnel: {} // remote stub
            }
        });
    }

    
})(Stork);
