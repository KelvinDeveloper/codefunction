var NewQuantColum  = 90,
	NewQuantLinhes = 30,
	HTMLTable;


if ( New ) {

	var config = {
		id: 			( $('.modal').length + 1 ),
		footerFixed: 	'modal-fixed-footer',
		size: 			'medium',
		url: 			'/indicator/editor/create/new',
		config: {
			dismissible: false
		}
	}

	initModal( config );

	$('.modal-close').hide();

	for (var L = 1; L <  NewQuantLinhes; L++) {

		HTMLTable += '<tr data-line="' + L + '">';
		
		for (var C = 65; C <= NewQuantColum; C++) {

			HTMLTable += '<td href="/indicator/{{ $id }}/field/new" class="open-modal" data-col="' + String.fromCharCode(C) + '"> </td>';
		}
		HTMLTable += '</tr>';
	}

	$('#load-indicator table').html( HTMLTable );
}