<?php

// Event::listen('app.init',function($client_data){
// 	$data = json_decode( $client_data );
//     app('db')->insert( " INSERT IGNORE INTO code.visitors (hash, user_id) VALUES ( '" . $client_data->data->hash . "', '" . $client_data->data->user . "' ) " );
// });

// Event::listen('app.end',function($client_data){
//     app('db')->delete( " DELETE code.visitors WHERE hash = '" . $client_data->data->hash . "' LIMIT 1 " );
// });
// Event::listen('app.success',function($client_data){
//     return BrainSocket::success(array('There was a Laravel App Success Event!'));
// });

// Event::listen('app.error',function($client_data){
//     return BrainSocket::error(array('There was a Laravel App Error!'));
// });