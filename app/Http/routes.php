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

$app->get('/logout', 'UserController@logout');
$app->post('/register', 'UserController@register');
$app->post('/login', 'UserController@login');

$app->post('/get/files', 'CodeController@getFiles');

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

$app->get('/new', function () use ($app) {	

	if ( ! isset( $_COOKIE['name'] ) ) {

	    unset($_COOKIE['hash']);
	    setcookie('hash', null, -1, '/');
	}

	return redirect('/');
});

$app->get('/{hash}', function ( $hash ) use ($app) {
	
	$code = $query = app('db')->select( " SELECT * FROM codes WHERE hash = '" . $hash . "' LIMIT 1 " );

	if ( count( $code ) < 1 ) {

		return redirect('/new');
	}

	setcookie('hash', $hash);
	$_COOKIE['hash'] = $hash;

	$folder = $_SERVER['DOCUMENT_ROOT'] . '/scripts/' . $hash . '/';

	if (! file_exists( $_SERVER['DOCUMENT_ROOT'] . '/scripts/' ) ) {

		mkdir( $_SERVER['DOCUMENT_ROOT'] . '/scripts/' );
		chmod( $_SERVER['DOCUMENT_ROOT'] . '/scripts/', 0777 );		
	}

	if (! file_exists( $folder ) ) {

		mkdir( $folder );
		chmod( $folder, 0777 );
	}

	$length = count( scandir( $folder ) ) - 2;

	if( $length < 1 ) {

		$create_file = fopen( $folder . 'untitled','w' );
		chmod( $folder . 'untitled', 0777 );
	}

	$files = [];

	foreach ( scandir( $folder ) as $file) {

		if ( $file !== '.' && $file !== '..' ) {

			$files[] = $file;
		}
	}

    return view('/home', ['hash' => $hash, 'code' => $code[0], 'files' => $files, 'init' => $files[0] ] );
});

$app->post('/save/theme', 'CodeController@saveTheme');
$app->post('/save/syntax', 'CodeController@saveSyntax');
$app->post('/load', 'CodeController@load');
$app->post('/save', 'CodeController@saveFile');

$app->post('/create/folder', 'CodeController@createFolder');
$app->post('/create/file', 'CodeController@createFile');

$app->post('/rename/folder', 'CodeController@renameFolder');
$app->post('/rename/file', 'CodeController@renameFile');

$app->post('/delete/folder', 'CodeController@deleteFolder');
$app->post('/delete/file', 'CodeController@deleteFile');

$app->post('/git/clone', 'GitController@gitClone');