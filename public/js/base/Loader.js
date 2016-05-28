var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
	lineNumbers: true,
	location: '/code'
});

// Altera a syntax
function changeSyntax(value) {

	var val = value, m, mode, spec;

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

	$('.select-syntax span').text( mode );
}

function changeTheme(value) {

	editor.setOption("theme", value.toLowerCase() );
}

// Carrega um arquivo
function codeLoad( file ) {

	Load({
		Type: 'POST',
		DataType: 'json',
		navAjax: false,
		Url: '/load',
		Data: {
			file: ( file == undefined ? Init : file )
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

				changeSyntax( newSyntax );
			}

			if ( $('#guard-codes li[data-location="' + file + '"]').length < 1 ) {

				$('#guard-codes').prepend('<li data-location="' + file + '"> <textarea>' + json.Code + '</textarea> </li>');
				return false
			}
		}
	});
}

// Abre um arquivo (navegação)
function clickOpenFile( This, createAba ) {

	$('.tabs li.active').removeClass('active');

	if ( createAba != false ) {

		$('.tabs').append('<li class="active" data-location="' + This.data('location') + '" data-file="' + This.data('file') + '"><i class="material-icons">save</i> ' + This.data('file') + ' <i class="material-icons close">close</i></li>' );
	}

	if ( $('#guard-codes li[data-location="' + This.data('location') + '/' + This.data('file') + '"]').length > 0 ) {
		editor.getDoc().setValue( $('#guard-codes li[data-location="' + This.data('location') + '/' + This.data('file') + '"] textarea').val() );
		return false;
	}

	codeLoad( This.data('location') + '/' + This.data('file') );
}

// Fecha uma aba
function closeTab( This ) {

	if ( This.hasClass('pendent-save') == true ) {

		if (! confirm('Are you sure you want to close the file without saving?') ) {

			return false;
		}
	}

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

// Salva arquivo
$('.save').click(function(e){
	
	if ( $('.tabs li.active').length < 1 ) {

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
						$('.tabs li.active').removeClass('active');
						$('#navigation-folders ul#files > ul').append( insertHTML( '/', value, 'file' ) );

						$('.tabs').append('<li class="active" data-location="/" data-file="' + value + '">' + value + ' <i class="material-icons">close</i></li>' );
						$('.save').click();
					}
				}
			});
		});

		return false;
	}

	Load({
		Type: 'POST',
		navAjax: false,
		Url: '/save',
		Data: {
			content: editor.getValue(),
			file: $('.tabs li.active').data('location') + '/' + $('.tabs li.active').data('file')
		},
		Success: function() {

			$('.tabs li.active').removeClass('pendent-save');
		}
	});
});

// Atualiza arquivos
$('.refresh').click(function(){

	if ( confirm('Unsaved changes will be lost. Do you wish to continue?') == true ) {

		codeLoad();
	}
});

// Eventos de teclado
$(window).bind('keydown', function(event) {

    if (event.ctrlKey || event.metaKey) {

        switch (String.fromCharCode(event.which).toLowerCase()) {

        case 's':
            event.preventDefault();
            event.stopPropagation();
            $('.save').click();
            return false;
            break;

        case 'l':
        	alert('pesquisar');
        	return false;
        	break;
        }
    }
});

$(document).ready(function(){

	changeSyntax( DefaultSyntax );
	changeTheme( DefaultTheme );

	$('select').material_select();

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
	}, '#navigation-folders ul#files ul');

	$(document).on('click', '#navigation-folders ul#files li.folder span', function(){

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
				folder: This.data('location') + '/' + This.data('folder')
			},
			Success: function(html) {

				This.find('ul').append( html ).show();
			}
		});
	});

});

$(document).on('dblclick', '#navigation-folders ul#files li.file', function(){

	if ( $('.tabs li.active').length > 0 ) {

		$('#guard-codes li[data-location="' + $('.tabs li.active').data('location') + '/' + $('.tabs li.active').data('file') + '"] textarea').val( editor.getValue() );
	}

	if ( $('.tabs li[data-location="' + $(this).data('location') + '"][data-file="' + $(this).data('file') + '"]').length > 0 ) {
		
		$('.tabs li[data-location="' + $(this).data('location') + '"][data-file="' + $(this).data('file') + '"]').click();
		return false;
	}

	clickOpenFile( $(this) );
});

$(document).on('click', '.tabs li', function(){

	$('#guard-codes li[data-location="' + $('.tabs li.active').data('location') + '/' + $('.tabs li.active').data('file') + '"] textarea').val( editor.getValue() );
	$('.tabs li.active').removeClass('active');
	$(this).addClass('active');
	editor.getDoc().setValue( $('#guard-codes li[data-location="' + $(this).data('location') + '/' + $(this).data('file') + '"] textarea').val() );
	// clickOpenFile( $(this), false );
	// 
});

$(document).on('click', '.tabs li i.close', function(e){

	e.stopPropagation();
	closeTab( $(this).parent('li') );
});

$(document).on('mousedown', '.tabs li', function(e){

	if ( e.which == 2 ) {

		$(this).find('i').click();
	}
});

// rClick
$('#navigation-folders ul#files li.folder').rClick({

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
							'location': This.data('location') + '/' + This.data('folder'),
							'file': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								$('li[data-location="' + This.data('location') + '"]').find('ul:first').prepend( insertHTML( This.data('location') + '/' + This.data('folder'), value, 'file' ) ).show();
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
							'location': This.data('location') + '/' + This.data('folder'),
							'folder': value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								This.find('ul:first').prepend( insertHTML( This.data('location') + '/' + This.data('folder'), value, 'folder' ) ).show();
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
			exec: function(This) {

				exec('rename folder: ', function(e, value) {
					Load({
						Url: '/rename/folder',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							location: This.data('location'),
							folder: This.data('folder'),
							newName: value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								This.data('folder', json.newName).find('.nameFile:first').text( json.newName );
							} else {

								alert( 'Error' );
							}
						}
					});
				}, This.find('.nameFile:first').text() )
			}
		},

		DeleteFolder : {

			icon: '<i class="material-icons">close</i>',
			text: 'Delete folder',
			exec: function( This ) {

				Confirm ( 'Are you sure you want to delete the <b>"' + This.find('.nameFile').text() + '"</b> folder and all the files?', 'Yes, Delete Folder!', function() {

					Load({
						Url: '/delete/folder',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							location: This.data('location'),
							folder: This.data('folder'),
						},
						Success: function(json) {

							This.remove();
							$('.modal-close').click();
						}
					})
				});
			}
		}
	}
});

$('#navigation-folders ul#files li.file').rClick({

	id: 'rClick-navigation-folders-li-file',

	Menu: {

		RenameFile : {

			icon: '<i class="material-icons left">mode_edit</i>',
			text: 'Rename file',
			exec: function(This) {

				exec('rename file: ', function(e, value) {
					Load({
						Url: '/rename/file',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							location: This.data('location'),
							file: This.data('file'),
							newName: value
						},
						Success: function(json) {

							if ( json.status == true ) {

								$('#exec-console').remove();
								This.data('file', json.newName).find('.nameFile').text( json.newName );
							} else {

								alert( 'Error' );
							}
						}
					});
				}, This.find('.nameFile').text() )
			}
		},

		DeleteFile : {

			icon: '<i class="material-icons left">close</i>',
			text: 'Delete file',
			exec: function( This ) {

				Confirm ( 'Are you sure you want to delete the file <b>"' + This.find('.nameFile').text() + '"</b>?', 'Yes, Delete File!', function() {

					Load({
						Url: '/delete/file',
						DataType: 'json',
						Type: 'POST',
						navAjax: false,
						Data: {
							location: This.data('location'),
							file: This.data('file'),
						},
						Success: function(json) {

							This.remove();
							$('.modal-close').click();
						}
					})
				});
			}
		}
	}
});

$('#navigation-folders ul#files').rClick({

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
								$('#navigation-folders ul#files > ul').append( insertHTML( '/', value, 'file' ) );
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

								if ( $('#navigation-folders ul#files > ul li.folder').length > 0 ) {
									
									$('#navigation-folders ul#files > ul li.folder:last').after( insertHTML( '/', value, 'folder' ) );
								} else {

									$('#navigation-folders ul#files > ul').prepend( insertHTML( '/', value, 'folder' ) );
								}
								
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


// Menu

$('li').click(function(e){

	e.stopPropagation();
	$('.block-selection').hide();

	if ( $(this).find('ul').length > 0 ) {

		$(this).find('ul').css({
			left: ( $(this).offset().left - $(this).find('ul').width() ) + ( $(this).width() + 10 )
		}).toggle();
	}
});

$('li ul, .block-selection.login li').click(function(e){
	e.stopPropagation();
});

$(document).keyup(function(e){

	if ( e.keyCode == 27 ) {

		$(document).click();
		$('#exec-console').remove();
	}
});

$('.CodeMirror').keydown(function(e){

	if ( $(this).hasClass('inative') == true ) {

		if ( $('#isInative').length < 1 ) {

			Materialize.toast('<span id="isInative">A user is typing . Wait...</span>', 4000);
		}

		return false;
	}

	if ( '9,20,16,17,18,2,91,121,120,119,118,123,122,37,39,40,38'.indexOf(e.keyCode) < 0 && e.keyCode !== undefined ) {

		if ( ( e.ctrlKey === true && e.keyCode == 83 ) ) {

			$('.tabs li.active').removeClass('pendent-save');
			return false;
		}

		if ( 
			( e.ctrlKey === true && e.keyCode == 65 ) ||
			( e.ctrlKey === true && e.keyCode == 88 ) ||
			( e.ctrlKey === true && e.keyCode == 67 )  ) {
			return false;
		}

		$('.tabs li.active').addClass('pendent-save');
	}
});

$('.CodeMirror').keyup(function(e){

	app.BrainSocket.message('sync.send', {
	  code: editor.getValue(),
	  file: $('.tabs li.active').data('file'),
	  location: $('.tabs li.active').data('location'),
	  hash: Hash,
	  token: Token
	});
});

$(document).click(function(){
	$('.block-selection li ul#files, .menu-top li ul, .block-selection').hide();
});

$(document).ready(function(){

	$('.search input').keyup(function(){
		
		if ( $(this).val() == '' ) {
			$('.block-selection:visible li:not(.title li, .search)').show();
			return false;
		}

		$('.block-selection:visible li:not(.title li, .search)').hide();
		$('.block-selection:visible li:not(.title li, .search)[data-search*="' + removeAcentos( $(this).val().toLowerCase() ) + '"]').show();
	});

	$('.logar').click(function(){
		$(document).click();
	});

	function Login() {

		Load({
			Url: '/login',
			Type: 'POST',
			DataType: 'json',
			navAjax: false,
			Data: {
				email: $('.block-selection.login input[type="email"]').val(),
				password: $('.block-selection.login input[type="password"]').val()
			},
			Success: function(json) {

				if ( json.status == true ) {

					window.location = '/' + json.model.hash; 
				} else {
					Materialize.toast('Invalid login or password', 4000);
				}
			}
		});
	}

	$('.btn-login').click(function(){
		Login();
	});

	$('.signin').click(function(){

		if ( $('.block-selection.login input[type="email"]').val() == '' ) {
			Materialize.toast('Enter email', 4000);
			$('.block-selection.login input[type="email"]').focus();
			return false;
		}

		if ( $('.block-selection.login input[type="password"]').val() == '' ) {
			Materialize.toast('Enter passowrd', 4000);
			$('.block-selection.login input[type="password"]').focus();
			return false;
		}

		if ( $('.tabs li.active').length > 0 ) {

			$('.save').click();
		}

		Load({
			Url: '/register',
			Type: 'POST',
			DataType: 'json',
			navAjax: false,
			Data: {
				email: $('.block-selection.login input[type="email"]').val(),
				password: $('.block-selection.login input[type="password"]').val()
			},
			Success: function(json) {

				Login();
			}
		});

		$(document).click();
	});

	$('.select-syntax').click(function(){
		$(document).click();
		$('.block-selection.syntax').show();
	});

	$('.select-theme').click(function(){
		$(document).click();
		$('.block-selection.theme').show();
	});

	$('.block-selection, .block-selection input, .block-selection .title li').click(function(e){
		e.stopPropagation();
	});

	$('.block-selection.syntax li:not(.title li, .search)').click(function(){

		$('#mode').val( $(this).text().toLowerCase() );
		changeSyntax();

		$('.select-syntax span').text( $(this).text() );
		$(document).click();
		$('li[data-tooltip="Configurations"]').click();

		Load({
			Type: 'POST',
			navAjax: false,
			Url: '/save/syntax',
			Data: {
				syntax: $(this).text().toLowerCase()
			}
		});
	});

	$('.block-selection.theme li:not(.title li, .search)').click(function(){

		editor.setOption("theme", $(this).text().toLowerCase() );

		$('.select-theme span').text( $(this).text() );
		$(document).click();
		$('li[data-tooltip="Configurations"]').click();

		Load({
			Type: 'POST',
			navAjax: false,
			Url: '/save/theme',
			Data: {
				theme: $(this).text().toLowerCase()
			}
		});
	});

	$('#bar-navigation li').click(function(){

		$('#bar-navigation li.active').removeClass('active');
		$(this).addClass('active');

		$('#navigation-folders > ul:not(#bar-navigation)').hide();
		$('#navigation-folders ul#' + $(this).attr('for')).show();
	});
});

$('#bar-navigation li[for="chat"]').click(function(){
	$(this).find('.notify').hide().text('0');
	setTimeout(function(){
		$('#navigation-folders ul#chat .messages').scrollTop( $('#navigation-folders ul#chat .messages').prop('scrollHeight') );
	}, 50);
});