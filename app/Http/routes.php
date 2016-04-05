<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () {
	
	$hash = hash('crc32b', time() );

	if (! isset( $_COOKIE['hash'] ) ) {

		setcookie('hash', $hash);
		$_COOKIE['hash'] = $hash;
	}

    return redirect('/' . $hash);
});

$app->get('/{hash}', function ( $hash ) use ($app) {

    return view('/home', ['hash' => $hash]);
});