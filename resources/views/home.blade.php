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

<ul class="tabs"></ul>

<form>
	<textarea id="code" name="code" placeholder=""></textarea>
</form>

<div id="navigation-folders">
	<ul>
		<li class="title folder">FOLDER</li>

		<ul></ul>
	</ul>
</div>

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
	}
}

function codeLoad( file ) {
	Load({
		Type: 'POST',
		DataType: 'json',
		navAjax: false,
		Url: '/{{ $hash }}/load',
		Data: {
			file: ( file == undefined ? '{{ $init }}' : file )
		},
		Success: function( json ) {
			editor.getDoc().setValue( json.Code );
			if ( json.info.extension !== undefined ) {

				var newSyntax = '';

				switch( json.info.extension ) {

					case 'js':
						newSyntax = 'javascript';
						break;

					case 'less':
						newSyntax = 'css';
						break;

					default:
						newSyntax = json.info.extension;
						break;
				}

				$('#mode').val( newSyntax );
				change();
			}
		}
	});
}

CodeMirror.on(modeInput, "keypress", function(e) {

	if (e.keyCode == 13) change();
});

$('.save').click(function(){
	
	if ( $('.tabs li.active').data('location').length < 1 ) {

		return false;
	}

	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/{{ $hash }}/save',
		Data: {
			content: editor.getValue(),
			file: $('.tabs li.active').data('location')
		}
	});
});

$('.refresh').click(function(){

	if ( confirm('Unsaved changes will be lost. Do you wish to continue?') == true ) {

		codeLoad();
	}
});

$(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            $('.save').click();
            break;

        case 'l':
        	alert('pesquisar');
        	return false;
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
	});

	setTimeout(function(){
		app.BrainSocket.message('app.init', {
			hash: '{{ $hash }}',
		});
	}, 500);

	$(document).on('keypress', '.CodeMirror.blocked', function(e){
		return false;
	});

	$('.menu-top input').focus(function(){
		$(this).select();
	});

	// sync files
	Load({
		Url: '/get/files',
		Type: 'POST',
		navAjax: false,
		Data: {
			folder: '/'
		}
	}, '#navigation-folders ul ul');

	$(document).on('click', '#navigation-folders ul li.folder span', function(){

		var This = $(this).parent('li');

		if ( This.hasClass('folder') == true ) {

			This.find('i:first').toggleClass('hidden');
		}

		if ( This.find('ul:first').html() != '' ) {

			This.find('ul:first').toggle();
			return false;
		}

		Load({
			Url: '/get/files',
			Type: 'POST',
			navAjax: false,
			Data: {
				folder: This.data('location')
			},
			Success: function(html) {

				This.find('ul').append( html ).show();
			}
		});
	});

});

function clickOpenFile( This, createAba ) {

	$('.tabs li.active').removeClass('active');
	codeLoad( This.data('location') );
	if ( createAba != false ) {

		$('.tabs').append('<li class="active" data-location="' + This.data('location') + '">' + This.data('file') + ' <i class="material-icons">close</i></li>' );
	}
}

function closeTab( This ) {

	if ( This.hasClass('active') == false ) {

		This.remove();
		return false;
	}

	if ( This.next('li').length > 0 ) {

		This.next('li').click().addClass('active');
	}
	else if ( This.prev('li').length > 0 ) {

		This.prev('li').click().addClass('active');
	} else {

		editor.getDoc().setValue( '' );
	}

	This.remove();
}

$(document).on('dblclick', '#navigation-folders ul li.file', function(){

	if ( $('.tabs li[data-location="' + $(this).data('location') + '"]').length > 0 ) {

		$('.tabs li[data-location="' + $(this).data('location') + '"]').click();
		return false;
	}

	clickOpenFile( $(this) );
});

$(document).on('click', '.tabs li', function(){

	clickOpenFile( $(this), false );
	$(this).addClass('active');
});

$(document).on('click', '.tabs li i', function(e){

	e.stopPropagation();
	closeTab( $(this).parent('li') );
});

$(document).on('mousedown', '.tabs li', function(e){

	if ( e.which == 2 ) {

		$(this).find('i').click();
	}
});

// rClick
$('#navigation-folders li.folder').rClick({

	id: 'rClick-navigation-folders-li-folder',

	Menu: {

		CreateFile : {

			icon: '<i class="material-icons">insert_drive_file</i>',
			text: 'Create new file',
			exec: function(This) {
				
				exec('name file: ', function(e, value) {
					Load({
						Url: '/create/file',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							'location': This.data('location'),
							'file': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								$('li[data-location="' + This.data('location') + '"]').find('ul:first').prepend( insertHTML( This.data('location'), value, 'file' ) ).show();
							} else {

								alert( json.msg );
							}
						}
					});
				})
			}
		}, 

		CreateFolder : {

			icon: '<i class="material-icons">create_new_folder</i>',
			text: 'Create new folder',
			exec: function(This) {

				exec('name folder: ', function(e, value) {
					Load({
						Url: '/create/folder',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							'location': This.data('location'),
							'folder': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								$('li[data-location="' + This.data('location') + '"]').find('ul:first').prepend( insertHTML( This.data('location'), value, 'folder' ) ).show();
							} else {

								alert( json.msg );
							}
						}
					});
				})
			}
		},

		RenameFolder : {

			icon: '<i class="material-icons">mode_edit</i>',
			text: 'Rename folder',
			exec: function() {

				alert('renomeia pasta');
			}
		},

		DeleteFolder : {

			icon: '<i class="material-icons">close</i>',
			text: 'Delete folder',
			exec: function() {

				alert('deleta folder');
			}
		}
	}
});

$('#navigation-folders li.file').rClick({

	id: 'rClick-navigation-folders-li-file',

	Menu: {

		RenameFile : {

			icon: '<i class="material-icons left">mode_edit</i>',
			text: 'Rename file',
			exec: function() {

				alert('renomeia arquivo');
			}
		},

		DeleteFile : {

			icon: '<i class="material-icons left">close</i>',
			text: 'Delete file',
			exec: function() {

				alert('deleta arquivo');
			}
		}
	}
});

$('#navigation-folders').rClick({

	id: 'rClick-navigation-folders',

	Menu: {

		CreateFile : {

			icon: '<i class="material-icons">insert_drive_file</i>',
			text: 'Create new file',
			exec: function(This) {
				
				exec('name file: ', function(e, value) {
					Load({
						Url: '/create/file',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							'location': '/',
							'file': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								$('#navigation-folders ul > ul').append( insertHTML( '/', value, 'file' ) );
							} else {

								alert( json.msg );
							}
						}
					});
				})
			}
		}, 

		CreateFolder : {

			icon: '<i class="material-icons">create_new_folder</i>',
			text: 'Create new folder',
			exec: function(This) {

				exec('name folder: ', function(e, value) {
					Load({
						Url: '/create/folder',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							'location': '/',
							'folder': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								$('#navigation-folders ul > ul').append( insertHTML( '/', value, 'folder' ) );
							} else {

								alert( json.msg );
							}
						}
					});
				})
			}
		}
	}
});

</script>
<script type="text/javascript" src="js/modules/socket/brain-socket.min.js" />
@endsection