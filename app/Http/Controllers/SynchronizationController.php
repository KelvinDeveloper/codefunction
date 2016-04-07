<?php

namespace App\Http\Controllers;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use BrainSocket\BrainSocketResponseInterface;

class SynchronizationController extends Controller implements MessageComponentInterface {

	public function __construct(BrainSocketResponseInterface $response) {
		$this->clients = new \SplObjectStorage;
		$this->response = $response;
	}

	public function onOpen(ConnectionInterface $conn) {
		echo "Connection Established! \n";
	}


	public function onMessage(ConnectionInterface $conn, $msg){
		echo "this messge gets called whenever there is a messge sent from js client";
	}

	public function onClose(ConnectionInterface $conn) {
		echo "Connection {$conn->resourceId} has disconnected\n";
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		$msg = "An error has occurred: {$e->getMessage()}\n";
		echo $msg;
		$conn->close();
	}
}