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
		$numRecv = count($this->clients) - 1;

		$msg = json_decode( $msg );

		switch ( $msg->client->event ) {

			case 'app.init':
				$this->init( $from->resourceId, $msg );
				break;
		}

		$msg->id = $from->resourceId;

		foreach ($this->clients as $client) {
			$client->send($this->response->make(json_encode( $msg )));
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);
		echo "Connection {$conn->resourceId} has disconnected\n";
		app('db')->delete( " DELETE FROM code.visitors WHERE user_id = '" . $conn->resourceId . "' " );
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";
		$conn->close();
	}

	public function init( $id, $array ) {
		echo 'passou';
	}
}