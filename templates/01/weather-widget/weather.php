<?php
/**
 * weather.php
 */

function getWeatherData($zip) {
    // This is just a stub. But for a real application, we'd query
    // the database for the weather information corresponding to
    // the given $zip code.
    return array(
        'temperature' => '80',
        'location' => 'San Francisco, CA',
        'desc'  => 'Partly cloudy',
        'image' => 'partly_cloudy.png'
    );
}