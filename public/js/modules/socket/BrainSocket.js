function Chat() {

	this.receive = function(data) {

		if ( Token == data.token ) {

			return false;
		}

		if ( Hash == data.hash ) {

			this.html( '', data.message )

			if ( $('#chat:visible').length == 0 ) {
				var quant = parseInt( $('#bar-navigation .notify').text() ) + 1;
				$('#bar-navigation .notify').text( ( quant > 8 ) ? '+9' : quant ).show();
			}
		}
	}

	this.html = function(_class, data) {

		$('#chat > .messages').append('<li class="' + _class + '"> <span>' + data + '</span> </li>');
		$('#navigation-folders ul#chat .messages').scrollTop( $('#navigation-folders ul#chat .messages').prop('scrollHeight') );
	}
}

function Sync() {

	this.receive = function(code) {

		var Inative = '';

		if ( Token == code.token ) {

			return false;
		}

		if ( Hash == code.hash ) {

			if ( $('.tabs li.active[data-location="' + code.location + '"][data-file="' + code.file + '"]').length > 0 ) {

				editor.getDoc().setValue( code.code );
			}

			else if ( $('#guard-codes li[data-location="' + code.location + '/' + code.file + '"]').length > 0 ) {

				$('#guard-codes li[data-location="' + code.location + '/' + code.file + '"] textarea').val( code.code );
			} else {

				$('#guard-codes').prepend('<li data-location="' + code.location + '/' + code.file + '"> <textarea>' + code.code + '</textarea> </li>');
			}

			$('.CodeMirror').addClass('inative');

			clearInterval(Inative);
			Inative = setTimeout(function(){
				$('.CodeMirror').removeClass('inative');				
			}, 3000);
		}
	}
}

var Chat = new Chat(),
	Sync = new Sync();

function BrainSocket(WebSocketConnection,BrainSocketPubSub){
	this.connection = WebSocketConnection;
	this.Event = BrainSocketPubSub;

	this.connection.BrainSocket = this;

	this.connection.digestMessage = function(data){
		try{
			var object = JSON.parse(data);

			if(object.server && object.server.event){
				this.BrainSocket.Event.fire(object.server.event,object);
			}else{
				this.BrainSocket.Event.fire(object.client.event,object);
			}

		}catch(e){
			this.BrainSocket.Event.fire(data);
		}
	}

	this.connection.onerror = function(e){
		console.log(e);
	}

	this.connection.onmessage = function(e) {
		var object = JSON.parse(e.data);
		this.digestMessage(e.data);

		switch( object.client.event ) {

			case 'chat.send':
				Chat.receive(object.client.data);
				break;

			case 'sync.send':
				Sync.receive(object.client.data);
				break;
		}
	}

	this.success = function(data){
		this.message('app.success',data);
	}

	this.error = function(data){
		this.message('app.error',data);
	}

	this.message = function(event,data){
		var json = {client:{}};
		json.client.event = event;

		if(!data){
			data = [];
		}

		json.client.data = data;

		this.connection.send(JSON.stringify(json));
	}
}

window.app = {};

app.BrainSocket = new BrainSocket(
	new WebSocket('ws://' + Server + ':8080'),
	new BrainSocketPubSub()
);

$(document).ready(function(){
	setTimeout(function(){
		app.BrainSocket.message('app.init', {
			hash: Hash,
			visitor: Visitor,
			user: User
		});
	}, 500);
});

// Chat
$('#chat textarea').keyup(function(e){

	if ( e.keyCode == 13 ) {

		Chat.html('me', $(this).val() );
		$('#navigation-folders ul#chat .messages').scrollTop( $('#navigation-folders ul#chat .messages').prop('scrollHeight') );
		app.BrainSocket.message('chat.send', {
		  message: $(this).val(),
		  hash: Hash,
		  token: Token
		});

		$(this).val('');
		return false;
	}
});