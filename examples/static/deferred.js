(function (window, undefined) {

    function getWindowDimensions() {
        var documentElement = document.documentElement;

        return ('pageYOffset' in window) ?
            {
                // W3C
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset,
                height: window.innerHeight,
                width: window.innerWidth
            } : {
                // IE 8 and below
                scrollTop: documentElement.scrollTop,
                scrollLeft: documentElement.scrollLeft,
                height: documentElement.clientHeight,
                width: documentElement.clientWidth
            };
    }

    function getPosition(el) {
        var left = 0;
        var top = 0;
        while (el && el.offsetParent) {
            left += el.offsetLeft;
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return { top: top, left: left };
    }

    function insideViewport(el) {
        var win = getWindowDimensions();
        var pos = getPosition(el);

        var top = pos.top;
        var bot = pos.top + el.offsetHeight;

        return bot >= win.scrollTop &&
            top <= win.scrollTop + win.height;
    }

    function whenVisible(callback) {
        var el = document.getElementById('stork-container');

        function listener() {
            if (insideViewport(el)) {
                callback();
            }
        }

        debounce(window, 'scroll', listener, 250);
        listener();
    }

    function debounce(el, name, handler, delay) {
        var exec;

        function wrapper(ev) {
            if (exec) {
               clearTimeout(exec);
            }

            exec = setTimeout(function () {
                handler(ev);
            }, delay);
        }

        if (el.addEventListener)
            return el.addEventListener(name, wrapper, false);
        else
            return el.attachEvent('on' + name, wrapper);
    }

    whenVisible(function () {
        alert('In viewport');
    });
})(window);