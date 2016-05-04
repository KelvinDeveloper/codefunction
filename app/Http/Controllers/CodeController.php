<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CodeController extends Controller
{
    /**
     * Retrieve the user for the given ID.
     *
     * @param  int  $id
     * @return Response
     */

    private $folder;

    public function __construct() {

        $this->folder = $_SERVER['DOCUMENT_ROOT'] . '/scripts/';
    }

    public function saveTheme(Request $request, $hash)
    {
    	$query = app('db')->update( " UPDATE codes SET theme = '" . $request->theme . "' WHERE hash = '" . $hash . "' " );
    }

    public function saveSyntax(Request $request, $hash)
    {
    	$query = app('db')->update( " UPDATE codes SET syntax = '" . $request->syntax . "' WHERE hash = '" . $hash . "' " );
    }

    public function load($hash, $file)
    {
        return file_get_contents( $this->folder . $hash . '/' . $file );
    }

    public function saveFile(Request $request, $hash, $file)
    {
        $location = $this->folder . $hash . '/' . $file;

        $create_file = fopen( $location . '.tmp', 'w' );
        chmod( $location . '.tmp', 0777 );
        fwrite( $create_file, $request->content );

        unlink( $location );
        rename( $location . '.tmp', $location );
    }

    public function getFiles(Request $request)
    {
        $folder = $_COOKIE['hash'] . '/' . ( $request->folder == '/' ? '' : $request->folder );

        $HTML_FOLDER = '';
        $HTML_FILES = '' ;
        $dir = scandir( '../public/scripts/' . $folder );

        foreach ( $dir as $file ) {
            
            if ( $file !== '.' && $file !== '..' ) {

                if ( is_dir( '../public/scripts/' . $folder . '/' . $file ) ) {

                    $HTML_FOLDER .= '<li class="folder" data-location="' . $request->folder . '/' . $file . '"><span> <i class="material-icons left">arrow_drop_down</i> <i class="material-icons left">folder</i> ' . $file . '</span>';
                        $HTML_FOLDER .= '<ul></ul>';
                    $HTML_FOLDER .= '</li>';
                } else {

                    $HTML_FILES .= '<li class="file"><span> <i class="material-icons left">insert_drive_file</i> ' . $file . ' </span></li>';
                }
            }
        }

        return $HTML_FOLDER . $HTML_FILES;
    }
}