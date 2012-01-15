if (!window.Stork) {
    Stork = {};
}

(function(Stork, window, undefined) {

    if (typeof Stork.widgetCount === 'undefined') {
        Stork.widgetCount = 0;
    }

    function append(html) {
        $('[data-stork-widget]').each(function(i, elem) {
            if (Stork.widgetCount === i) {
                $(elem).before(html);
                Stork.widgetCount++;
                return;
            }
        });
    }

    append('<div>Widget HTML</div>');
})(Stork, window);
