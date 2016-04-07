@extends('master')
@section('content')
@section('title', 'Home - ')

<link rel="stylesheet" href="/code/lib/codemirror.css">

@foreach ( scandir( app()->basePath() . '/public/code/theme' ) as $file )
	@if ( $file != '..' && $file !== '.' )
		<link rel="stylesheet" href="/code/theme/{{ $file }}">
	@endif
@endforeach

<script src="/code/lib/codemirror.js"></script>
<script src="/code/addon/mode/loadmode.js"></script>
<script src="/code/mode/meta.js"></script>

@include('include/menu-top')

<form>
	<textarea id="code" name="code" placeholder=""></textarea>
</form>

<input id="mode" style="display: none;">

<script type="text/javascript">

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	location: '/code'
}),
	modeInput = document.getElementById("mode");

function change() {

	var val = modeInput.value, m, mode, spec;

	if (m = /.+\.([^.]+)$/.exec(val)) {

		var info = CodeMirror.findModeByExtension(m[1]);

		if (info) {

			mode = info.mode;
			spec = info.mime;
		}
	} else if (/\//.test(val) ) {

		var info = CodeMirror.findModeByMIME(val);
		
		if (info) {

			mode = info.mode;
			spec = val;
		}
	} else {

		mode = spec = val;
	}

	if ( mode ) {

		editor.setOption('mode', spec);
		CodeMirror.autoLoadMode(editor, mode);
	} else {

		alert("Could not find a mode corresponding to " + val);
	}
}

function codeLoad() {
	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/{{ $hash }}/load/{{ $init }}',
		Success: function( Return ) {
			editor.getDoc().setValue( Return );
		}
	});
}

CodeMirror.on(modeInput, "keypress", function(e) {

	if (e.keyCode == 13) change();
});

$('select[name="theme"]').change(function(){
	editor.setOption("theme", $(this).val() );

	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/{{ $hash }}/save/theme',
		Data: {
			theme: $(this).val()
		}
	});
});

$('select[name="syntax"]').change(function(){
	$('#mode').val( $(this).val() );
	change();

	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/{{ $hash }}/save/syntax',
		Data: {
			syntax: $(this).val()
		}
	});
});

$('.save').click(function(){
	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/{{ $hash }}/save/{{ $init }}',
		Data: {
			content: editor.getValue()
		}
	});
});

$('.refresh').click(function(){
	$('.save').click();
	codeLoad();
});

// setInterval(function(){
// 	$('.save').click();
// }, 10000);

$(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            $('.save').click();
            break;
        }
    }
});

$(document).ready(function(){

	$('[name="syntax"] option[value="{{ $code->syntax }}"]').prop('selected', true).change();
	$('[name="theme"] option[value="{{ $code->theme }}"]').prop('selected', true).change();

	$('select').material_select();

	codeLoad();

	window.app = {};

	app.BrainSocket = new BrainSocket(
		new WebSocket('ws://{{ $_SERVER['SERVER_NAME'] }}:8080'),
		new BrainSocketPubSub()
	);

	app.BrainSocket.Event.listen('app.init', function(msg)
	{
		if ( msg.client.data.total > 1 ) {

			$('ul.menu-top li.visitors span.count').text( msg.client.data.total );
			
		}

		// if ( msg.client.data.editing ) {
		// 	$('.CodeMirror').removeClass('blocked');
		// } else {
		// 	$('.CodeMirror').addClass('blocked');
		// }
	});

	setTimeout(function(){
		app.BrainSocket.message('app.init', {
			hash: '{{ $hash }}',
		});
	}, 500);

	$(document).on('keypress', '.CodeMirror.blocked', function(e){
		return false;
	});

});

</script>
<script type="text/javascript" src="js/modules/socket/brain-socket.min.js" />
@endsection