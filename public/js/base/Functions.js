var Url,
	date    = new Date(),
	Content = '.content',
	http = new XMLHttpRequest();

function navAjax( Href, Title ) {

    if( Href != Url ){
        window.history.pushState( date, false, Href ); // Grava no Historico do navegador
        Url = Href;
    }

    if( Title != undefined ){

    	var OldTitle = document.title.split('-');

    	document.title = Title + ' ' + OldTitle[ OldTitle.length - 1 ];
    }
}

function fileExists( url ) {

    // http.open('HEAD', url, false);
    // http.send();

    // return http.status != 404;
    return true;
}

window.onpopstate = function(event) {
	/* Back page */
	var urlBack = window.location.pathname;

    navAjax( urlBack );
    Load({Url: urlBack}, Content);
};

function Load( Array, Element ) {

	Loader( true );

	var Default = {
		Type: 		'GET',
		DataType: 	'html',
		Cache: 		false,
		Async: 		false,
		navAjax: 	true,
		navAjaxUrl: false,
		Title : 	false,
		Success: 	false,
	},
		Data = $.extend( { _token: $('meta[name="csrf-token"]').attr('content') }, Array.Data );

	Config = $.extend( Default, Array );

	$.ajax({

		type: 		Config.Type,
		dataType: 	Config.DataType,
		data: 		Data,
		url: 		Config.Url,
		cache: 		Config.Cache,
		async: 		Config.Async,

		success: function(Return) {

			if ( Config.DataType === 'json' && typeof Return !== 'object' ) {
				return true;
			}

			if ( Config.navAjax === true ) {

				navAjax( ( Config.navAjaxUrl !== undefined && Config.navAjaxUrl !== false ? Config.navAjaxUrl : Config.Url ), ( Config.Title !== false ? Config.Title : undefined ) );
			}

			if ( Element ){

				$( Element ).html( Return );
			}

			if (typeof Config.Success === 'function') {
				Config.Success( Return );
			}
		},

		error: function(Return, Param1, Param2) {

			if (typeof Config.Error === 'function') {

				Config.Error( Return, Param1, Param2 );
			}
		},

		complete: function(e, xhr, settings) {

			Loader( false );
		}
	});
}

function Loader( Visibled ) {

	if( Visibled ){

		$('#Loader').fadeIn(100);
	} else {

		$('#Loader').fadeOut(100);
	}
}

function openMenu( This, e ) {

	$('#' + This.data('open-menu') ).toggle().css({
		right: This.offset().top + This.height(),
		left: ( ( This.offset().left + This.width() ) - $('#' + This.data('open-menu') ).width() - $(document).scrollLeft() )
	});
}

function Logout(json){

	Load({Url: json.url}, '#document');
}

function initModal(config) {

	var Default = {
		dismissible: true, 		// Modal can be dismissed by clicking outside of the modal
		opacity: .5, 			// Opacity of modal background
		in_duration: 300, 		// Transition in duration
		out_duration: 200, 		// Transition out duration
	};
	
	if ( config.config !== undefined ) {

		config.config = $.extend( config.config, Default );
	} else {

		config.config = Default;
	}

	$('#document').append(
	'<div id="modal' + config.id + '" class="modal ' + config.footerFixed + ' ' +  config.size + '">' + 
		'<div class="modal-header">' +
			'<a href="#" class="modal-close"><i class="material-icons">close</i></a>' + 
		'</div>' +
		'<div class="modal-content" id="content-modal' + config.id + '"></div>' + 
	( config.footerFixed ?
	    '<div class="modal-footer"></div>'
	: '' ) +
	'</div>');


	if ( config.url !== false ) {

	  	Load({ 	Url: config.url,
	  			navAjax: false,
				data: {
				target: config.id,
	  		},
	  	}, '#content-modal' + config.id );
	} else if ( config.content != undefined ) {

		$('#content-modal' + config.id).html( config.content );
	}
 
 	$('#modal' + config.id).openModal(config.config);

  	$('.lean-overlay').attr('data-for', config.id);

  	if ( config.shadow == false ){
  		$('.lean-overlay[data-for="' + config.id + '"]').remove();
  	}

  $('#modal' + config.id + ' .modal-close').attr('data-for', config.id)

  if ( config.config.dismissible == false ) {
  	$('.lean-overlay[data-for="' + config.id + '"]').addClass('not-remove');
  }

  if ( config.footerFixed ) {
  	$('#content-modal' + config.id ).css({
  		height: $('#modal' + config.id ).height() - 55
  	});
  }
}

function inArray(needle, haystack) {

	if ( haystack === undefined ) {
		return false;
	}

    var length = haystack.length;
    
    for(var i = 0; i < length; i++) {
    	
        if(haystack[i] == needle) return true;
    }
    return false;
}

$('html').click(function(){

  $('[data-open-menu]').each(function(){
    $('#' + $(this).data('open-menu') + ':visible').hide();
  });

});

function removeAcentos(varString) {

	var stringAcentos = new String('áàâãèêéíìîóõòôúûùçÁÀÃÂÉÈÊÍÌÎÔÓÕÒÚÛÙÇ'),
		stringSemAcento = new String('aaaaeeeiiioooouuucAAAAEEEIIIOOOOUUUC'),
		i = new Number(),
		j = new Number(),
		cString = new String(),
		varRes = '';
	  
	for (i = 0; i < varString.length; i++) {  
		cString = varString.substring(i, i + 1);  
		for (j = 0; j < stringAcentos.length; j++) {  
	
			if (stringAcentos.substring(j, j + 1) == cString){  
				cString = stringSemAcento.substring(j, j + 1);  
			}  
		}  
		varRes += cString;  
	}  
	return varRes;
};

function exec(title, exec, value) {

	$('#exec-console').remove();

	$('body').append('<div id="exec-console">' +
	'<label for="enter-value">' + title + '</label>' +
	'<input type="text" id="enter-value" value="' + ( value != undefined ? value : '' ) + '">' +
	'</div>');

	$('#exec-console input').focus().keyup(function( e ){

		if ( e.keyCode == 13 ) {

			exec(e, $('#exec-console input').val() );
		}
	});
}

function insertHTML( location, file, type ) {

	switch( type ) {

		case 'file': 
			return '<li class="file" data-location="' + location + '" data-file="' + file + '"><span> <i class="material-icons left">insert_drive_file</i> <div class="nameFile">' + file + ' </div></span></li>';
			break;

		case 'folder':
			return '<li class="folder" data-location="' + location + '" data-folder="' + file + '"><span> <i class="material-icons left hidden">arrow_drop_down</i> <i class="material-icons left">folder</i> <div class="nameFile">' + file + ' </div></span> <ul> </ul> </li>';
			break;
	}
}

function Confirm( Content, btnSuccess, Success ) {

	initModal({

		id: 			( $('.modal').length + 1 ),
		footerFixed: 	'modal-fixed-footer',
		size: 			'small',
		url: 			false,
		shadow: 		false,
		content: 		Content
	});

	$('#modal' + ( $('.modal').length ) + ' .modal-footer' ).html(
	'<button class="btn rigth ConfirmSuccess"><i class="material-icons left">delete_forever</i> ' + btnSuccess + '</button>' +
	'<button class="btn btn-silver left modal-close"><i class="material-icons left">cancel</i> Cancel</button>'
	);

	$('#modal' + ( $('.modal').length ) + ' .ConfirmSuccess').click(Success);
}

$(document).on('click', 'a:not(.stopFunction), .startFunction', function() {

	var This = $(this);
	
	if( This.attr('href') == '#' || This.hasClass('open-modal') == true ) {
		return false;
	}

	if( This.data('function') != false ){

		Load(
			{ 	Url: $(this).attr('href'),
				Title:   ( $(this).data('title') != undefined ? $(this).data('title') : undefined ),
				navAjax: ( $(this).data('nav-ajax') != undefined ? $(this).data('nav-ajax') : undefined ),
				Success: function(response){
					( This.data('success') != undefined ? eval( This.data('success').replace('()', '(' + response + ')') ) : '' )
				}
			}, ( $(this).data('target') == undefined ? Content : ( $(this).data('target') != 'false' ? $(this).data('target') : '' ) ) );
		return false;
	}
});

$(document).on('click', '.open-modal', function(e) {

	e.stopPropagation();

	var config = {
		id: 			( $('.modal').length + 1 ),
		footerFixed: 	( $(this).data('footer-fixed') != undefined ? 'modal-fixed-footer' : '' ),
		size: 			( $(this).data('size') != undefined ? $(this).data('size') : false ),
		url: 			$(this).attr('href'),
		shadow: 		( $(this).data('shadow') != undefined ? $(this).data('shadow') : true  ),
	}

	initModal( config );
	return false;
});

$(document).on('keyup', 'input.search', function(e) {
	
	var Query = removeAcentos( $(this).val().toLowerCase() );

	if( Query == '' ){

		$( $(this).data('target') ).parent().show();
	} else {

		$( $(this).data('target') ).parent().hide();
		$( $(this).data('target') + '[data-search*="' + Query + '"]' ).parent().show();
	}
});

$(document).on('click', '.lean-overlay, .modal-close', function() {

	if ( $(this).hasClass('not-remove') == true ) {
		return false;
	}

	if ( $(this).attr('data-for') !== undefined ) {

		var For = '#modal' + $(this).attr('data-for');
	} else {
		var For = '.modal, .lean-overlay';
	}

	setTimeout(function(){
		$(For).remove();
	}, 100);
});

$(document).on('click', '.autocomplete', function(e) {

	e.stopPropagation();
	
	if( $('#result-' + $(this).attr('name') ).html() !== '' ) {
		$('#result-' + $(this).attr('name') ).show();
	}
});

$(document).ready(function(){

	$('body').keyup(function(e) {
		
		switch ( e.keyCode ) {

			case 27:
				// $('.modal, .lean-overlay').remove();
				break;
		}
	});

	$('body').click(function() {

		$('.result-autocomplete').hide();
	});
});

$(document).scroll(function(){
	$('.block-title').css({ marginLeft: $(document).scrollLeft() });
});