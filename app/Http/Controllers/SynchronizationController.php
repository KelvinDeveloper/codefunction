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
		echo "Conexão estabelecida! \n";
	}


	public function onMessage(ConnectionInterface $conn, $msg){
		echo "envio de mensagem";
	}

	public function onClose(ConnectionInterface $conn) {
		echo "Conexão {$conn->resourceId} finalizada! \n";
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		$msg = "Erro ao conectar: {$e->getMessage()}\n";
		echo $msg;
		$conn->close();
	}
}