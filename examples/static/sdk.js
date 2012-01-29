(function(window, undefined) {
    var Stork = {};

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
                listeners.splice(i, 1);
                break;
            }
        }
    };

    Stork.broadcast = function(eventName) {
        if (!listeners[eventName])
            return;

        for (var i = 0; i < listeners[eventName].length; i++) {
            listeners[eventName][i]();
        }
    };

    window.Stork = Stork;
})(this);