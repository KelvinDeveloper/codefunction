<ul class="menu-top">

	<span class="logo">
		<\cf>
	</span>

	<li class="user">

		<ul class="block-selection login">
			@if( empty ( $_COOKIE['name'] ) )
			<li><input placeholder="Email" type="email"></li>
			<li><input placeholder="Password" type="password"></li>
			<li>
				<button class="btn-flat signin left">Sign In</button>
				<button class="btn right btn-login"><i class="material-icons left">https</i> Login</button>
			</li>
			<br>
			<!-- <li><button class="btn-facebook right">Login Facebook</button></li><br> -->
			@else 
			<li><input value="{{ $_COOKIE['name'] }}"></li>
			<li><a href="/logout" class="stopFunction btn right">Logout</a> <br></li>
			@endif
		</ul>
	</li>

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
<!-- 
	<li class="tooltipped git" data-tooltip="Clone repository">
		<i class="material-icons">build</i>
		<ul>
			<li>
				<label for="clone-git">HTTPS repository clone</label>
				<input id="clone-git" name="clone-git"/>

				<button class="btn"><i class="material-icons left">compare_arrows</i> Clone!</button>
			</li>
		</ul>
	</li> -->

	<li class="tooltipped url" data-tooltip="Url">
		<input value="{{ 'http://' . $_SERVER['HTTP_HOST'] . '/' . $hash }}">
	</li>

<!-- <li class="visitors">
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
		<li data-search="plain text">Plain Text</li>
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