(function($){

	var CliquedButton,
		This,

	Methods = {

		init: function( Element, Settings, nMenu ){
			
			$(document).on('mousedown', Element.selector, function(event){

				event.stopPropagation();

				if( event.button == 2 ){

					$('.rCliked').removeClass('rCliked');

					This = $(this);

					$(this).addClass('rCliked');

					var x = event.pageX,
						y = event.pageY;
						
					$('ul#rClickMenu-' + Settings.id).fadeIn(100).css({
						top:  y,
						left:  x
					});

				} else {

					$('#rClickMenu-' + Settings.id).fadeOut(100);
				}
			});

			this.construct( nMenu, Settings.id );
		},

		construct: function( nMenu, id ){

			if( $('#rClickMenu-' + id ).length < 1 ){

				var HTML = '<ul class="rClickMenu" id="rClickMenu-' + id + '">';

				$.each( nMenu, function( k, v ){
					HTML += '<li id="opMenu-' + k + '">' + v.icon + ' ' + v.text + '</li>';
				});

				HTML += '</ul>';

				$('body').append( HTML );
			}
		}
	}
 
	$.fn.rClick = function( Values ){

	    var Settings 	= Values,
	    	nMenu 		= Values.Menu;

	    Methods.init( this, Settings, nMenu );

	    $('#rClickMenu-' + Settings.id + ' li').click(function(){

	    	var Action 	= $(this).attr('id').replace('opMenu-', '');

	    	eval('nMenu.' + Action + '.exec( This )');
	    });

	    this.on("contextmenu",function(){
	       return false;
	    }); 

	    $('#rClickMenu-' + Settings.id).on("contextmenu",function(){
	       return false;
	    });

	    $('body').mousedown(function(){
	    	$('#rClickMenu-' + Settings.id).fadeOut(100);
	    	$('.rCliked').removeClass('rCliked');
	    });

	};

})(jQuery);