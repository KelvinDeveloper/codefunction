<ul class="menu-top">

	<span class="logo">
		<\cf>
	</span>

	<li class="tooltipped" data-tooltip="Configurations" data-position="left">
		<i class="material-icons">build</i>

		<ul>
			<li class="select-syntax">Sintax <span>{{ $code->syntax }}</span></li>
			<li class="select-theme">Theme  <span>{{ $code->theme }}</span></li>
		</ul>
	</li>

	<li class="save tooltipped" data-tooltip="Save (CTRL + S)">
		<i class="material-icons">save</i>
	</li>

	<li class="refresh tooltipped" data-tooltip="Refresh">
		<i class="material-icons">refresh</i>
	</li>
	
	<li class="new tooltipped" data-tooltip="New document">
		<a href="/new" class="stopFunction">
			<i class="material-icons">add</i>
		</a>
	</li>

	<li class="tooltipped url" data-tooltip="Url">
		<input value="{{ 'http://' . $_SERVER['HTTP_HOST'] . '/' . $hash }}">
	</li>

<!-- 	<li class="visitors">
		Visitor: <span class="count"></span>
	</li> -->
</ul>

<ul class="block-selection syntax">

	<li class="search"><input placeholder="Search"></li>

	<div class="title">
		<li>Popular</li>
		<li>All Syntax</li>
	</div>

	<div class="column">
		<li data-search="php">PHP</li>
		<li data-search="javascript">Javascript</li>
		<li data-search="python">Python</li>
		<li data-search="css">CSS</li>
		<li data-search="django">django</li>
		<li data-search="perl">perl</li>
		<li data-search="ruby">ruby</li>
		<li data-search="sass">sass</li>
		<li data-search="sql">sql</li>
		<li data-search="xml">xml</li>
		<li data-search="cobol">cobol</li>
		<li data-search="yaml">yaml</li>
	</div>

	<div class="column">
		@foreach ( scandir( app()->basePath() . '/public/code/mode' ) as $file )
			@if ( $file != '..' && $file !== '.' && $file != 'index.html' )
				<li data-search="{{ $file }}">{{ $file }}</li>
			@endif
		@endforeach
	</div>
</ul>

<ul class="block-selection theme">

	<li class="search"><input placeholder="Search"></li>

	<div class="title">
		<li>Themes</li>
	</div>

	<div class="column">
	@foreach ( scandir( app()->basePath() . '/public/code/theme' ) as $file )
		@if ( $file != '..' && $file !== '.' )
			<li data-search="{{ str_replace('.css', '', $file) }}">{{ str_replace('.css', '', $file) }}</li>
			@endif
		@endforeach
	</div>
</ul>

<script type="text/javascript">
	$('li').click(function(e){

		e.stopPropagation();
		$('.block-selection').hide();

		if ( $(this).find('ul').length > 0 ) {

			$(this).find('ul').css({
				left: ( $(this).offset().left - $(this).find('ul').width() ) + ( $(this).width() + 10 )
			}).toggle();
		}
	});

	$('li ul').click(function(e){
		e.stopPropagation();
	});

	$(document).keyup(function(e){

		if ( e.keyCode == 27 ) {

			$(document).click();
		}
	});

	$(document).click(function(){
		$('li ul, .block-selection').hide();
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
			change();

			$('.select-syntax span').text( $(this).text() );
			$(document).click();
			$('li[data-tooltip="Configurations"]').click();

			Load({
				Type: 'POST',
				navAjax: false,
				Url: '/{{ $hash }}/save/syntax',
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
				Url: '/{{ $hash }}/save/theme',
				Data: {
					theme: $(this).text().toLowerCase()
				}
			});
		});

		// Init sintax
		$('#mode').val( '{{ $code->syntax }}' );
		change();

		// Init theme
		editor.setOption("theme", '{{ $code->theme }}' );
	});
</script>