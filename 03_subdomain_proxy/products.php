<?php
/**
 * products.php
 *
 * static endpoint returns the same product information for
 * demonstration purposes
 */

echo json_encode(array(
	'id' => $_GET['product'],
	'name' => 'Fugi SmoothPix 3000',
	'megapixels' => '12',
	'price' => 299,
	'flash' => true
));