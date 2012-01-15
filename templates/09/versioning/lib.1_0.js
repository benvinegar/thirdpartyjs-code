(function(window, undefined) {
    var public = {};

    public.productWidget = function(id, domId) {
        
    };

    var listeners = {};

    public.listen = function(eventName, handler) {
        if (typeof listeners[eventName] === 'undefined')
            listeners[eventName] = [];
        
        listeners[eventName].push(handler);
    };

    public.unlisten = function(eventName, handler) {
        if (!listeners[eventName])
            return;
        
        for (var i = 0; i < listeners[eventName].length; i++) {
            if (listeners[eventName][i] === handler) {
                listeners.splice(i, 1);
                break;
            }
        }
    };

    public.broadcast = function(eventName) {
        if (!listeners[eventName])
            return;

        for (var i = 0; i < listeners[eventName].length; i++) {
            listeners[eventName][i]();
        }
    };


    window.Stork.instances['1.0'] = public;
})(this);