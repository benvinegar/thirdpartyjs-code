<?php
/**
 * widget.php
 */

header('Content-type: application/javascript');

require 'weather.php'; // Load supporting code

$weather = getWeatherData($_GET['zip']);

$location    = $weather['location'];
$temperature = $weather['temperature'];
$desc        = $weather['desc'];

// Must qualify full path for asset urls; relative
// urls won't work, as they'll point to the publisher's server
$image       = preg_replace('/[^\/]+$/', '', $_SERVER['REQUEST_URI'])  . $weather['image'];

// Output JavaScript to page
echo <<<EOD

document.write('\
    <div>\
      <p>$location</p>\
      <img src="$image"/>\
      <p><strong>$temperature &deg;F</strong> &mdash; $desc</p>\
    </div>');
EOD;
