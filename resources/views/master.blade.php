<html>
    <head>
        <title>@yield('title') CodeFunction</title>
        <meta charset="UTF-8">

        <script type="text/javascript" src="/js/base/jquery.min.js"></script>
        <script type="text/javascript" src="/js/base/FormBuilder-min.js"></script>
        <script type="text/javascript" src="/js/base/Functions-min.js"></script>
        <script type="text/javascript" src="/js/plugins/rClick-min.js"></script>
        <script src="/code/lib/codemirror-min.js"></script>
        <script src="/code/addon/mode/loadmode-min.js"></script>
        <script src="/code/mode/meta-min.js"></script>

        <link rel="stylesheet" type="text/css" href="/css/plugins/materialize.css" />
        <link rel="stylesheet" type="text/css" href="/css/base/layout.css" />
        
    </head>
    <body>
        <div id="document">
            <div class="content">
                @yield('content')
            </div>

            <div class="preloader-wrapper active" id="Loader">
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="/js/plugins/jquery.uploadifive.min.js"></script>
        <script type="text/javascript" src="/js/plugins/jquery-ui-min.js"></script>
        <script type="text/javascript" src="/js/plugins/jquery.ui.draggable-min.js"></script>
        <script type="text/javascript" src="/js/plugins/jquery.tagsinput-min.js"></script>
        <script type="text/javascript" src="/js/plugins/materialize.min.js"></script>

        <link rel="stylesheet" href="/code/lib/codemirror.css">

        @foreach ( scandir( app()->basePath() . '/public/code/theme' ) as $file )
            @if ( $file != '..' && $file !== '.' )
                <link rel="stylesheet" href="/code/theme/{{ $file }}">
            @endif
        @endforeach

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    </body>
</html>