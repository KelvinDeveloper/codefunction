<ul class="menu-top">

	<span class="logo">
		<\cf>
	</span>

	<li class="tooltipped">
		<select name="syntax" data-tooltip="{{ _('Syntax') }}">
			@foreach ( scandir( app()->basePath() . '/public/code/mode' ) as $file )
				@if ( $file != '..' && $file !== '.' )
					<option value="{{ $file }}">{{ $file }}</option>
				@endif
			@endforeach
		</select>
	</li>

	<li>
		<select name="theme" class="tooltipped" data-tooltip="{{ _('Theme') }}">
			@foreach ( scandir( app()->basePath() . '/public/code/theme' ) as $file )
				@if ( $file != '..' && $file !== '.' )
					<option value="{{ str_replace('.css', '', $file) }}">{{ str_replace('.css', '', $file) }}</option>
				@endif
			@endforeach
		</select>
	</li>

	<li>
		<input value="{{ 'http://' . $_SERVER['HTTP_HOST'] . '/' . $hash }}">
	</li>

	<li class="save">
		<i class="material-icons">save</i>
	</li>

	<li class="refresh">
		<i class="material-icons">refresh</i>
	</li>

	<li class="visitors">
		Visitor: <span class="count"></span>
	</li>
</ul>