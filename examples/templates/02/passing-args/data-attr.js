(function() {
    function getProductId() {
        var scripts = document.getElementsByTagName('script'),
            id;

        for (var i = 0; i < scripts.length; i++) {
            id = scripts[i].getAttribute('data-stork-productId');
            if (id)
            return id;
        }
        return null;
    }
    var params = {
        'productId': getProductId()
    };
    document.getElementById('data-attr-out').innerHTML = JSON.stringify(params);
})();