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

    function throttle(el, name, handler, delay) {
        var last = (new Date()).getTime();

        function wrapper(ev) {
            var now = (new Date()).getTime();
            if (now - last >= delay) {
                last = now;
                handler(ev);
            }
        }

        if (el.addEventListener)
            return el.addEventListener(name, wrapper, false);
        else
            return el.attachEvent('on' + name, wrapper);
    }

    function displayDeferredAvatars() {
        var PADDING = 200;

        var all = document.querySelectorAll('img.dsq-deferred-avatar');
        var avatars = [];

        for (var i = 0; i < all.length; i++) {
            if (all[i].offsetParent) {
                avatars.push(all[i]);
            }
        }

        if (!avatars.length) {
            return;
        }

        var win = getWindowDimensions();

        function clipsViewport(el) {
            var pos = getPosition(el);
            var top = pos.top;
            var bot = pos.top + el.offsetHeight;

            if (bot <= win.scrollTop - PADDING) {
                return -1;
            } else if (top >= win.scrollTop + win.height + PADDING) {
                return 1;
            } else {
                return 0;
            }
        }

        var pivot = (function() {
            var high = avatars.length;
            var low = 0;
            var clip;
            var i;

            while (low < high) {
                i = parseInt((low + high) / 2, 10);
                clip = clipsViewport(avatars[i]);

                if (clip === -1) { // above
                    low = i + 1;
                } else if (clip === 1) { // below
                    high = i;
                } else {
                    return i;
                }
            }

            return -1;
        })();

        if (pivot === -1) {
            return;
        }

        function displayIfVisible(i) {
            var el = avatars[i];

            if (clipsViewport(el) !== 0) {
                return false;
            }

            el.setAttribute('src', el.getAttribute('data-dsq-src'));
            el.className = '';
            el.removeAttribute('data-dsq-src');

            return true;
        }

        for (i = pivot; i >= 0 && displayIfVisible(i); i--) {}
        for (i = pivot + 1;
          i < avatars.length && displayIfVisible(i);
          i++) {}
    }

    throttle(window, 'scroll', displayDeferredAvatars, 250);
})(window);