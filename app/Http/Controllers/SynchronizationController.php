<?php

namespace App\Http\Controllers;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use BrainSocket\BrainSocketResponseInterface;

class SynchronizationController extends Controller implements MessageComponentInterface {
	protected $clients;
	protected $response;

	public function __construct(BrainSocketResponseInterface $response) {
		$this->clients = new \SplObjectStorage;
		$this->response = $response;
	}

	public function onOpen(ConnectionInterface $conn) {
		echo "Connection Established! \n";
		app('db')->insert( " INSERT IGNORE INTO code.visitors (user_id) VALUES ( '" . $conn->resourceId . "' ) " );
		$this->clients->attach($conn);
	}

	public function onMessage(ConnectionInterface $from, $msg) {

		$msg = json_decode( $msg );

		switch ( $msg->client->event ) {

			case 'app.init':
				$this->init( $from->resourceId, $msg );
				break;
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);
		echo "Connection {$conn->resourceId} has disconnected\n";

		$hash = app('db')->select( " SELECT hash FROM code.visitors WHERE user_id = '" . $conn->resourceId . "' " );
		app('db')->delete( " DELETE FROM code.visitors WHERE user_id = '" . $conn->resourceId . "' " );

		$count = app('db')->select( " SELECT count( id ) as id FROM code.visitors WHERE hash = '" . $hash[0]->hash . "' " );

		$array['client']['event'] = 'app.init';
		$array['client']['data']['total'] = $count[0]->id;

		$this->send( json_encode( $array ) );
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";
		$conn->close();
	}

	public function send( $msg ) {
		foreach ($this->clients as $client) {
			$client->send($this->response->make( $msg ));
		}
	}

	public function init( $id, $array ) {

		$count = app('db')->select( " SELECT count( id ) as id FROM code.visitors WHERE hash = '" . $array->client->data->hash . "' " );
		app('db')->update( " UPDATE code.visitors SET hash = '" . $array->client->data->hash . "', editing = '" . ( $count[0]->id == 0 ? 1 : 0 ) . "' WHERE user_id = '" . $id . "' " );

		$array->client->data = [ 'total' => ( $count[0]->id + 1 ) ];
		$this->send( json_encode( $array ) );
	}
}