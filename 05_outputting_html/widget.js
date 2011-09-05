(function() {
	var html = '<div>This was appended dynamically from a third-party script.</div>';
	var div = document.createElement('div');
	div.innerHTML = html;

	var appendTo = document.getElementById('stork-widget');
	appendTo.parentNode.insertBefore(div, appendTo);
})();
