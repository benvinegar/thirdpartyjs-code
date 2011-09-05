<?php
/**
 * slow.php
 */

header('Content-type: application/javascript');

// Take 3 seconds
sleep(3);

echo("var img = document.getElementsByTagName('img')[0];img.parentNode.removeChild(img);");