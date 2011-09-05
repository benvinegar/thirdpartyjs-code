<?php

header("Content-type: application/javascript");

$callback = $_GET['callback'];

$book = json_encode(array(
	'title' => 'Third-party JavaScript',
	'authors' => array('Anton', 'Ben'),
	'publisher' => 'Manning'
));

echo "$callback($book);";
