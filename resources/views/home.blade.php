@extends('master')
@section('content')
@section('title', 'Home - ')

@include('include/menu-top')

<ul class="tabs"></ul>

<form>
	<textarea id="code" name="code" placeholder=""></textarea>
</form>

<div id="navigation-folders">
	<ul>
		<li class="title folder">FOLDER</li>

		<ul></ul>
	</ul>
</div>

<noscript id="guard-codes"></noscript>

<script type="text/javascript">
var Init = '{{ $init }}',
	DefaultSyntax = '{{ $code->syntax }}',
	DefaultTheme  = '{{ $code->theme }}',
	Server        = '{{ $_SERVER['SERVER_NAME'] }}';
</script>

<script type="text/javascript" src="js/base/Loader-min.js"></script>
<script type="text/javascript" src="js/modules/socket/brain-socket.min.js"></script>
@endsection