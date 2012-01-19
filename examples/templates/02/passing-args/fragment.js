(function() {
	function getScriptUrl(re) {
	    var scripts = document.getElementsByTagName('script'),
	        element,
	        src;

	    for (var i = 0; i < scripts.length; i++) {
	        element = scripts[i];
	    
	        src = element.getAttribute ? 
	            element.getAttribute('src') : el.src;

	        if (src && re.test(src)) {
	            return src;
	        }
	    }	
	    return null;
	}

	function getQueryParameters(query) {

	    var args   = query.split('&'),
	        params = {},
	        pair, 
	        key, 
	        value;

	    function decode(string) {
	        return decodeURIComponent(string || "")
	            .replace('+', ' ');
	    }
	    
	    for (var i = 0; i < args.length; i++) {
	        pair  = args[i].split('=');
	        key   = decode(pair.shift());
	        value = decode(pair ? pair[0] : null);
	        
	        params[key] = value;
	    }
	    return params;
	};

	var url  = getScriptUrl(/\/fragment\.js/);

	var params = getQueryParameters(url.replace(/^.*\#/, ''));

	document.getElementById('fragment-ident-out').innerHTML = JSON.stringify(params);
})();