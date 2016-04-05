var Modules = {},
	urlBucket = 'https://s3-sa-east-1.amazonaws.com/tbl-sis',
	http = new XMLHttpRequest();

function FormField( Array, Table ) {

	var Return  = '',
		Length  = ( Array.Config.length ? 'maxlength= "' + Array.Config.length + '"' : '' ),
		Label   = ( Array.Config.label  ?  Array.Config.label : Array.Field + ':' ),
		Class   = '';

		Attributes = 'name="' + Array.Field + '"' + Length;

	Return += '<fieldset data-target="' + Table + '">';
	Return += '<label>' + Label + ' </label>';

	switch( Array.Config.type ){

		case 'image':

			Return += '<div class="image-upload" id="upload-' + Array.Field + '">' +
			'<i></i>' +
			'<div class="progress">' +
				'<div class="determinate"></div>' +
			'</div>' +
			'</div>';

			Class += 'field-image';

		case 'text':

			Class += ' materialize-textarea';
			Return += '<textarea class="' + Class + '" ' + Attributes + '></textarea>';
			break;

		case 'select':

			Return += '<select class="' + Class + '" ' + Attributes + '>';

			$.each(Array.Config.options, function(Key, Value) {

				Return += '<option class="' + Class + '" value="' + Key + '">' + Value + '</option>';
			});

			Return +='</select>';

			break;

		case 'checkbox':

			$.each(Array.Config.options, function(Key, Value) {

				Return += '<input class="' + Class + '" ' + Attributes + ' type="checkbox" id="alt_' + Array.Field + '_' + Key + '" value="' + Key + '"> <label class="alt" for="alt_' + Array.Field + '_' + Key + '">' + Value + '</label>';
			});
			break;

		case 'radio':

			$.each(Array.Config.options, function(Key, Value) {

				Return += '<input class="' + Class + '" ' + Attributes + ' type="radio" id="alt_' + Array.Field + '_' + Key + '" value="' + Key + '"> <label class="alt" for="alt_' + Array.Field + '_' + Key + '">' + Value + '</label>';
			});
			break;

		case 'switch':

				Return += '<div class="switch"> <label> <input class="' + Class + '" ' + Attributes + ' type="checkbox" value="1"> <span class="lever"></span> </label> </div>';
			break;

		case 'number':
			Return += '<input class="' + Class + '" ' + Attributes + ' type="number">';
			break;

		case 'tags':
			Class += ' tags';
			Return += '<input  class="' + Class + '" ' + Attributes + ' />';
			break;

		case 'autocomplete':
			Class += ' autocomplete';
			Return += '<ul class="result-autocomplete" id="result-' + Array.Field + '"></ul>';
			Return += '<input class="' + Class + '" ' + Attributes + '>';
			break;

		case 'password':
			Attributes += ' type="password"';
		default:
		case 'varchar':

			Return += '<input class="' + Class + '" ' + Attributes + '>';
			break;
	}

	Return += '</fieldset>';

	return Return;
}

function FormMask( Array ) {

	switch( Array.Config.type ){

		case 'image':

			var formData = $.extend( {
				_token: $('meta[name="csrf-token"]').attr('content'),
				location: Array.Config.location
			}, Array.Config.formData );

				UploadConfig = $.extend( {
				uploadScript: '/upload',
				buttonText: 'camera_alt <span>Selecionar</span>',
				buttonClass: 'material-icons',
				fileObjName: 'Filedata',
				fileSizeLimit: '100MB',
				fileType: false,
				multi: true,
				auto: true,
				queueID: 'upload-' + Array.Field,
				itemTemplate: '<span class="uploadifive-queue-item"></span>'

			}, Array.Config );

			$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').hide();

			$('#form-' + Array.Target + ' #upload-' + Array.Field + ' i').uploadifive({
				auto: UploadConfig.auto,
				uploadScript : UploadConfig.uploadScript,
				buttonText: UploadConfig.buttonText,
				buttonClass: UploadConfig.buttonClass,
				fileObjName: UploadConfig.fileObjName,
				fileSizeLimit: UploadConfig.fileSizeLimit,
				fileType: UploadConfig.fileType,
				multi: UploadConfig.multi,
				formData: formData,
				queueID: UploadConfig.queueID,
				itemTemplate: UploadConfig.itemTemplate,

				onProgress : function(file, e) {

					Loader(true);
					var percent = 0;

					if (e.lengthComputable) {

						percent = Math.round( (e.loaded / e.total) * 100);
					}

					file.queueItem.parents('.image-upload').find('.progress').show().find('.determinate').css('width', percent + '%');

				},

				onUploadComplete : function(file, data) {

					var json = JSON.parse( data );

					$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').val( json.file );
					file.queueItem.parents('.image-upload').css({
						'background-image': 'url(\'' + urlBucket + UploadConfig.location + json.file + '\')'
					});

					setTimeout(function(){

						file.queueItem.parents('.image-upload').find('.progress').hide();
						Loader(false);
					}, 100);
				}
			});
			break;

			case 'select':
				$('#form-' + Array.Target + ' select').material_select();
				break

			case 'tags':
				$('#form-' + Array.Target + ' .tags').tagsInput( Array.Config.tagsInput );
				break;

			case 'autocomplete':
				$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').keyup(function(){

					var This = $(this);

					if( This.val() == '' ) {
						return false;
					}

					Load({
						navAjax: false,
						Type: 'POST',
						DataType: 'json',
						Url: Array.Config.url,
						Data: {
							search: This.val()
						},
						Success: function(json) {

							if(typeof Array.Config.callback == 'function' ) {
								Array.Config.callback( json, Array, This );
							}
						}
					});
				});

				if(typeof Array.Config.onClick == 'function' ) {
					$(document).off('click', '#result-' + Array.Field + 'li');
					$('#result-' + Array.Field).on('click', 'li', function() {
						Array.Config.onClick( $(this), $('#form-' + Array.Target + ' [name="' + Array.Field + '"]') );
					});
				}
				break;

			default:
				if(typeof Array.Config.keyup == 'function' ) {
					$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').keyup(function(){
						Array.Config.keyup( $(this), Array );
					});
				}

				if(typeof Array.Config.blur == 'function' ) {
					$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').blur(function(){
						Array.Config.blur( $(this), Array );
					});
				}

				if(typeof Array.Config.focus == 'function' ) {
					$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').focus(function(){
						Array.Config.focus( $(this), Array );
					});
				}

				if(typeof Array.Config.click == 'function' ) {
					$('#form-' + Array.Target + ' [name="' + Array.Field + '"]').click(function(){
						Array.Config.click( $(this), Array );
					});
				}
				break;
	}
}

function GridField( Array, Field, Value ) {

	switch( Array.type ) {

		case 'image':
			if( fileExists( urlBucket + Value ) && Value !== '' ){

				return '<td data-field="' + Field + '"><img src="' + urlBucket + Array.location + '/' + Value + '"></td>';
			} else {

				return '<td data-field="' + Field + '"><img src="img/bg/no-image.png"></td>';
			}
			break;

		default:
			return '<td data-field="' + Field + '" data-search="' + removeAcentos( Value ).toLowerCase() + '">' + Value + '</td>';
			break;
	}
}

function setValue( Field, Config, Value, Element ) {

	switch( Config.type ) {

		case 'image':
			if ( Value != '' ) {
				$(Element).find('#upload-' + Field).css({
					'background-image': 'url(\'' + urlBucket + Config.location + '/' + Value + '\')'
				});
			}
			break;

		case 'switch':
		
			if ( Value !== '' && Value !== '0' ) {
				$(Element).find('[name="' + Field + '"]').prop('checked', true);
			}
			break;

		case 'password':
			break;

		case 'autocomplete':
			if(typeof Value == 'object' && Value !== null ) {
				
				$(Element).find('[name="' + Field + '"]').val( Value.value ).data('id', Value.key);
			}
			break;

		default:
			$(Element).find('[name="' + Field + '"]').val( Value );
			break;
	}
}

function Form( JSON, Element, Function ) {

	Modules[ JSON.Table ] = JSON;
	var HTML = '',

		Default = {

			Method: 'POST',
			Action: '/',

			Buttons: {
				Save: {
					Show: true,
					Name: 'Salvar',
				}
			}
		};

	Config = $.extend( Default, JSON );

	HTML += '<form method="' + Config.Method + '" action="' + Config.Action + '" id="form-' + JSON.Table + '" data-new="' + JSON.New + '">';
	HTML += ( JSON.Title ? '<h1><span>' + JSON.Title + '</span></h1>' : '' );
	HTML += ( JSON.Subtitle ? '<h3>' + JSON.Subtitle + '</h3>' : '' );
	HTML += '<input type="hidden" value="' + $('meta[name="csrf-token"]').attr('content') + '" name="_token">';

	$.each(JSON.Fields, function(Field, Array) {

		if( inArray( Field, JSON.Hidden ) === false ){

			/* Title */
			if( Array.title !== undefined ) {
				HTML += '<h2><span>' + Array.title + '</span></h2>';
			}

			HTML += FormField({
				Field: Field,
				Config: Array,
			}, JSON.Table);
		}
	});

	/* Buttons */
	HTML += '<div class="buttons">';

	if ( Config.Buttons !== false ) {

		if ( Config.Buttons.Save.Show ) {

			HTML += '<button class="btn"><i class="material-icons left">save</i> ' + ( Config.Buttons.Save.Name ? Config.Buttons.Save.Name : 'Salvar' ) + '</button>';
		}
	}

	HTML += '</div>';
	/* ends Buttons */

	HTML += '</form>';

	$(Element).append(HTML);

	/* adiciona valores nos campos */
	if( JSON.Value !== null ) {

		if(typeof JSON.Value === 'object' ){

			$.each(JSON.Value, function(Field, Value){

				setValue( Field, JSON.Fields[ Field ], Value, Element );
			});
		}
	}

	$.each(JSON.Fields, function(Field, Array) {

		if( inArray( Field, JSON.Hidden ) === false ){
			FormMask({
				Field: Field,
				Config: Array,
				Target: JSON.Table
			});
		}
	});

	if(typeof Function === 'function' ) {
		Function( JSON, Element );
	}
}

function Grid( JSON, Element ) {

	var HTML = '',

		Default = {

		};

	Config = $.extend( Default, JSON );

	HTML += '<table class="grid-builder" id="grid-' + JSON.Table + '">';

	/* Cria heaer */
	HTML += '<thead>';
	HTML += '<tr>';

	if( JSON.Multi === true ) {

		HTML += '<th><input type="checkbox" id="multi"> <label for="multi"></label></th>';
	}
	
	$.each(JSON.Fields, function(Field, Array) {

		if( inArray( Field, JSON.Hidden ) === false ){

			HTML += '<th>' + ( Array.label ? Array.label : Field ) + '</th>';
		}
	});

	HTML += '<th></th>';

	HTML += '</tr>';
	HTML += '</thead>';
	/* Ends Cria header */

	/* Lista valores */
	if(typeof JSON.Values === 'object' ){

		$.each(JSON.Values, function( Id, Registers ) {
			
			HTML += '<tr href="/' + JSON.Key + '/' + Id + '" data-id="' + Id + '">';
			
			if( JSON.Multi === true ) {

				HTML += '<td><input type="checkbox" id="select-' + Id + '"> <label for="select-' + Id + '"></label></td>';
			}

			$.each(Registers, function( Field, Value ) {

				if( inArray( Field, JSON.Hidden ) === false ){
					HTML += GridField( JSON.Fields[ Field ], Field, Value );
				}
			});

			HTML += '<td> <ul> <li> <i class="material-icons edit">build</i> </li> </ul> </td>';

			HTML += '</tr>';
		});
	}
	/* Ends Lista valores */

	HTML += '</table>';

	$( Element ).append( HTML );

}

function Post(  This ) {

	var JSON = Modules[ This.attr('id').replace('form-', '') ],
		New  = This.data('new'),
		HTML,
		Post = [],
		Valid,
		Value;

	if(typeof JSON.Before === 'function' ) {

		if(! JSON.Before( JSON, This ) ) {

			return false;
		}
	}

	This.find('fieldset[data-target="' + This.attr('id').replace('form-', '') + '"]').find('input, textarea, select').each(function(){

		Valid = true;
		Value = $(this).val();

		if ( $(this).attr('type') == 'checkbox' && $(this).prop('checked') == false ) {

			Value = '0';
		}

		if ( $(this).attr('type') == 'password' && $(this).val() == '' ) {

			Valid = false;
		}

		if( $(this).attr('name') !== undefined && Valid ) {

			Post[ $(this).attr('name') ] = ( $(this).data('value') !== undefined ? $(this).data('value') : Value );
		}
	});

	Load({

		Url: This.attr('action'),
		Type: 'POST',
		DataType: 'json',
		Data: Post,
		navAjax: false,
		Success: function(Response) {

			if (typeof JSON.After == 'function' ) {

				var ModelResponse = JSON.After( JSON, Response, This );

				if (typeof ModelResponse == 'object' ) {

					JSON['Fields'] = ModelResponse.Fields;
					JSON['Hidden'] = ModelResponse.Hidden;
					JSON['New']    = ModelResponse.New;
					JSON['Key']    = ModelResponse.Key;
					Response = ModelResponse.After;
					This = ModelResponse.This;
				} 

				else if (! ModelResponse ) {

					return false;
				}
			}

			if( Response.status == true ) {

				Materialize.toast('<i class="material-icons left">done</i> Registro salvo com sucesso', 4000);

				if( New ) {

					HTML += '<tr href="/' + JSON.Key + '/' + Response.model.id + '" data-id="' + Response.model.id + '">';

					$.each(Response.model, function(Field, Value){

						if( inArray( Field, JSON.Hidden ) === false ){
							HTML += GridField( JSON.Fields[ Field ], Field, Value );
						}
					});

					HTML += '<td> <ul> <li> <i class="material-icons edit">build</i> </li> </ul> </td>';

					HTML += '</tr>';

					$( This.attr('id').replace('form', '#grid') ).prepend( HTML );
				} else {

					$.each(Response.model, function(Field, Value){

						if( inArray( Field, JSON.Hidden ) === false ){

							switch( JSON.Fields[ Field ]['type'] ) {

								case 'image':
									if( Value !== '' ) {
										$( This.attr('id').replace('form', '#grid') + ' tbody [data-id="' + Response.model.id + '"] [data-field="' + Field + '"] img').attr('src', urlBucket + Value);
									}
									break;

								default:
									$( This.attr('id').replace('form', '#grid') + ' tbody [data-id="' + Response.model.id + '"] [data-field="' + Field + '"]').html( Value );
									$( This.attr('id').replace('form', '#grid') + ' tbody [data-id="' + Response.model.id + '"] [data-field="' + Field + '"]').attr('data-search', removeAcentos( Value ).toLowerCase() );
									break
							}
						}
					});
				}

				setTimeout(function(){
					This.parents('.modal').remove();
				}, 100);
				This.parents('.modal').closeModal();

			} else {

				Materialize.toast('<i class="material-icons left">error</i> Erro ao salvar registro', 4000);
			}
		},

		Error: function(Response) {

			$.each(Response.responseJSON, function(Field, Message){

				Materialize.toast('<i class="material-icons left">error</i> ' + Message, 4000);
			});
		}

	}, false);
}

$(document).on('submit', 'form', function() {

	Post( $(this) );
	return false;
});

$(document).on('click', 'table.grid-builder tbody tr td i.edit', function() {

	var config = {
		id: 			( $('.modal').length + 1 ),
		url: 			$(this).parents('tr').attr('href'),
		footerFixed: 'modal-fixed-footer'
	}

	initModal(config);
});