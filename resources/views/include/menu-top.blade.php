<ul class="menu-top">

	<span class="logo">
		<\cf>
	</span>

	<li class="tooltipped" data-tooltip="{{ _('Syntax') }}">
		<select name="syntax">
			@foreach ( scandir( app()->basePath() . '/public/code/mode' ) as $file )
				@if ( $file != '..' && $file !== '.' )
					<option value="{{ $file }}">{{ $file }}</option>
				@endif
			@endforeach
		</select>
	</li>

	<li class="tooltipped" data-tooltip="{{ _('Theme') }}">
		<select name="theme">
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
</ul>