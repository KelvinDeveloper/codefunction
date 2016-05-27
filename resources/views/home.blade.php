@extends('master')
@section('content')
@section('title', 'Home - ')

@include('include/menu-top')
<ul class="tabs"></ul>

<form>
	<textarea id="code" name="code" placeholder=""></textarea>
</form>

<div id="navigation-folders">
	<ul id="files">
		<li class="title folder">FOLDER</li>

		<ul></ul>
	</ul>

	<ul id="chat">
		
		<ul class="messages"></ul>
		<textarea name="send" placeholder="send message..."></textarea>
	</ul>

	<ul id="bar-navigation">
		<li for="files" class="tooltipped active" data-tooltip="Folders and Files" data-position="top"><i class="material-icons">folder_open</i></li>
		<li for="chat" class="tooltipped" data-tooltip="Chat" data-position="top"><i class="material-icons">chat</i> <span class="notify">0</span></li>
	</ul>
</div>

<noscript id="guard-codes"></noscript>

<script type="text/javascript">
const 	Init = '{{ $init }}',
		DefaultSyntax = '{{ $code->syntax }}',
		DefaultTheme  = '{{ $code->theme }}',
		Server        = '{{ $_SERVER['SERVER_NAME'] }}',
		Hash		  = '{{ $code->hash }}',
		Visitor		  = '{{ md5( time() ) }}',
		User		  = '{{ isset( $_COOKIE['id'] ) ? $_COOKIE['id'] : '' }}',
		Token         = Math.floor((Math.random()*1000)+1);
</script>

<script type="text/javascript" src="js/base/Loader-min.js"></script>
<script type="text/javascript" src="js/modules/socket/BrainSocketPubSub-min.js"></script>
<script type="text/javascript" src="js/modules/socket/BrainSocket-min.js"></script>
@endsection