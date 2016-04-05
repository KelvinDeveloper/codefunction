function DashboardLayout() {

	var Width = ( $(window).width() * 1.5 ) / $('li.kanban').length;
		Width = ( Width < 400 ? 400 : Width );

	$('li.kanban').width( Width );
	$('#dashboard').width( ( $('li.kanban').width() * $('li.kanban').length ) + 50 );
}

function HTMLUnit( v, li, allUnit ) {

	var name = removeAcentos( v.name.toLowerCase() );

	return ( li !== false ? 
			'<li data-search="' + name + '" class="unity" data-id="' + v.id + '">' : '' ) +
				'<input type="checkbox" id="check-' + name + v.id + '"> <label for="check-' + name + v.id + '"></label>' +
				'<i class="material-icons left show-subunit">arrow_drop_down</i>' +
				'<div>' +
					'<span class="title"> <b>' + v.name +  '</b>' + ( v.type == 1 ? ' - Head Office' : '' ) + '</span>' +
					'<ul class="actions">' +
						'<a href="/' + v.company_id + '/unity/' + v.id + '" class="open-modal" data-footer-fixed="true"> <li><i class="material-icons">build</i></li> </a>' +
						'<a href="/' + v.company_id + '/unity/new/' + v.id + '" class="open-modal" data-footer-fixed="true"> <li><i class="material-icons tooltipped">add</i></li> </a>' +
					'</ul>' +
				'</div>' +
				'<ul class="subunits">' + ( allUnit ? LoadUnits( allUnit, v.id ) : '' ) + '</ul>' + 
			( li !== false ? '</li>' : '' );
}

function HTMLUser(user, tr) {

	return (tr !== false ? '<tr data-search="' + removeAcentos( user.name.toLowerCase() ) + '" data-id="' + user.id + '">' : '' ) + 
			'<td>' + 
				'<img src="https://tbl-manager-3j39v2313323iump.s3.amazonaws.com/users/thumb-21774_10200415689552293_62507479943561673_n.jpg">' + 
				'<span>' + 
					'<b>' + user.name + ' ' + user.lastname + '</b>' + ( user.position != '' ? ' - ' + user.position : '' ) +
					'<ul>' + 
						'<a class="open-modal" data-footer-fixed="true" href="' + user.company_id + '/user/' + user.id + '"> <li><i class="material-icons">build</i></li> </a>' +
					'</ul>' + 
				'</span>' + 
			'</td>' + 
		(tr !== false ? '</tr>' : '' );
}

function LoadUnits( Values, unity_id ) {

	var HTML = '';

	unity_id = unity_id ? unity_id : 0;

	if (! Values[ unity_id ] ) {
		return '';
	}

	$.each(Values[ unity_id ], function(k, v) {

		HTML += HTMLUnit( v, true, Values );
	});

	return HTML;
}

$(document).ready(function(){

	DashboardLayout();

	var json = Companies;

	json['Key'] = 'company';
	json['Hidden'] = ['id', 'company_id'];
	json['Fields']['name']['label'] = 'Nome';

	json['Fields']['logo']['type'] = 'image';
	json['Fields']['logo']['location'] = '/logos';

	Grid(json, '#grid-company');

	$('li.kanban#list-company tbody tr').off();
	$(document).on('click', 'li.kanban#list-company tbody tr', function(){

		if ( $('#grid-tbl_companies tr.active').data('id') == $(this).data('id') ) {
			return false;
		}

		$('#list-units, #list-users').removeClass('block');
		$('#list-indicators, #list-assignment').addClass('block');

		$('#list-units ul li a:eq(1)').attr('href', $(this).data('id') + '/unity/new');
		$('#list-users ul li a:eq(1)').attr('href', $(this).data('id') + '/user/new');

		$('#grid-tbl_companies tr.active').removeClass('active');
		$(this).addClass('active');

		$('#list-units ul.units').html( LoadUnits( Units.Values[ $(this).data('id') ], false ) );

		Load({
			Type: 'POST',
			DataType: 'json',
			Url: '/' + $(this).data('id') + '/users',
			navAjax: false,
			Success: function(json) {
				
				$('#table-users tbody').html('');

				$.each(json.Values, function(k, v) {

					$('#table-users tbody').prepend( HTMLUser( v ) );
				});
			}
		});
	});

	$('.show-subunit').off();
	$(document).on('click', '.show-subunit', function(){

		$(this).toggleClass('drop');
		$(this).parent('li').find('.subunits:eq(0)').toggle();
	});

	$(document).on('click', '#list-units ul input[type="checkbox"]', function(){

		$(this).parent().toggleClass('active');

		if ( $('#list-units ul input[type="checkbox"]:checked').length > 0 ) {

			$('#list-indicators').removeClass('block');
		} else {

			$('#list-indicators').addClass('block');
		}
	});

	$(document).on('click', '#table-indicadores tr input[type="checkbox"]', function(){

		$(this).parent().toggleClass('active');

		if ( $('#table-indicadores tr input[type="checkbox"]:checked').length > 0 ) {

			$('#list-assignment').removeClass('block');
		} else {

			$('#list-assignment').addClass('block');
		}
	});
});

$(window).resize(function(){
	DashboardLayout();
});
