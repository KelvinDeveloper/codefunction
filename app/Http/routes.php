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

$app->get('/', function () use ($app) {	

	if (! isset( $_COOKIE['hash'] ) || $_COOKIE['hash'] == '' ) {

		$hash = hash('crc32b', time() );

		setcookie('hash', $hash);
		$_COOKIE['hash'] = $hash;

		$query = app('db')->insert( " INSERT INTO codes ( hash ) VALUES ( '" . $hash . "' ) " );
	} else {

		$hash = $_COOKIE['hash'];
	}

    return redirect('/' . $hash);
});

$app->get('/{hash}', function ( $hash ) use ($app) {

	$code = $query = app('db')->select( " SELECT * FROM codes WHERE hash = '" . $hash . "' LIMIT 1 " );
    return view('/home', ['hash' => $hash, 'code' => $code[0]]);
});

$app->post('/{hash}/save/theme', 'CodeController@saveTheme');
$app->post('/{hash}/save/syntax', 'CodeController@saveSyntax');