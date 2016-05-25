<?php

Event::listen('app.init',function($client_data){

    app('db')->update( " UPDATE " . config('database.connections.mysql.database') . ".visitors SET visitor = '" . $client_data->data->user . "', hash = '" . $client_data->data->hash . "' WHERE id = '" . app('db')->getPdo()->lastInsertId() . "' " );
});

Event::listen('app.end',function($client_data){
	dd( $client_data );
    app('db')->delete( " DELETE " . config('database.connections.mysql.database') . ".visitors WHERE hash = '" . $client_data->data->hash . "' LIMIT 1 " );
});
Event::listen('app.success',function($client_data){
    return BrainSocket::success(array('There was a Laravel App Success Event!'));
});

Event::listen('app.error',function($client_data){
    return BrainSocket::error(array('There was a Laravel App Error!'));
});

Event::listen('generic.event',function($client_data){
    return BrainSocket::message('generic.event',array('message'=>'A message from a generic event fired in Laravel!'));
});

Event::listen('chat.send',function($client_data){
    return BrainSocket::message('chat.send',array('message'=>'A message from a generic event fired in Laravel!'));
});