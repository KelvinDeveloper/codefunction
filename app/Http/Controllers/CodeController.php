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

    public function saveTheme(Request $request)
    {
    	$query = app('db')->update( " UPDATE codes SET theme = '" . $request->theme . "' WHERE hash = '" . $_COOKIE['hash'] . "' " );
    }

    public function saveSyntax(Request $request)
    {
    	$query = app('db')->update( " UPDATE codes SET syntax = '" . $request->syntax . "' WHERE hash = '" . $_COOKIE['hash'] . "' " );
    }

    public function load(Request $request)
    {
        return array( 'Code' => file_get_contents( $this->folder . $_COOKIE['hash'] . '/' . $request->file ), 'info' => pathinfo( $this->folder . $_COOKIE['hash'] . '/' . $request->file ) );
    }

    public function saveFile(Request $request)
    {
        $location = $this->folder . $_COOKIE['hash'] . $request->file;

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

                    $HTML_FOLDER .= '<li class="folder" data-location="' . $request->folder . '" data-folder="' . $file . '"><span> <i class="material-icons left hidden">arrow_drop_down</i> <i class="material-icons left">folder</i> <div class="nameFile">' . $file . '</div> </span>';
                        $HTML_FOLDER .= '<ul></ul>';
                    $HTML_FOLDER .= '</li>';
                } else {

                    $HTML_FILES .= '<li class="file" data-location="' . $request->folder . '" data-file="' . $file . '"><span> <i class="material-icons left">insert_drive_file</i> <div class="nameFile">' . $file . '</div> </span></li>';
                }
            }
        }

        return $HTML_FOLDER . $HTML_FILES;
    }

    /* Create */
    public function createFolder(Request $request) {

        $return['status'] = false;

        if ( mkdir( $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->folder ) ) {

            $return['status'] = true;
            chmod(  $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->folder, 0777);
        } else {

            $return['msg'] = 'Error create folder';
        }

        return $return;
    }

    public function createFile(Request $request) {

        $return['status'] = false;

        if ( fopen( $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->file,'w' ) ) {

            $return['status'] = true;
            chmod(  $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->file, 0777);
        } else {

            $return['msg'] = 'Error create file';
        }

        return $return;
    }

    public function renameFile(Request $request) {

        $return['status'] = false;

        if ( rename( $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->file, $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->newName ) ) {

            $return['status'] = true;
            $return['file']   = $request->file;
            $return['location'] = $request->location;
            $return['newName'] = $request->newName;
        }

        return $return;
    }

    public function renameFolder(Request $request) {

        $return['status'] = false;

        if ( rename( $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->folder, $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->newName ) ) {

            $return['status'] = true;
            $return['folder']   = $request->folder;
            $return['location'] = $request->location;
            $return['newName'] = $request->newName;
        }

        return $return;
    }

    public function deleteFile(Request $request) {

        $return['status'] = false;

        if ( unlink( $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->file ) ) {

            $return['status'] = true;
            $return['file']   = $request->file;
            $return['location'] = $request->location;
        } else {

            $return['status'] = false;
        }

        return $return;
    }

    public function deleteAllFiles( $folder ) {

        foreach (scandir( $folder ) as $file ) {
            
            if ( $file != '..' && $file != '.' ) {

                if ( is_dir( $folder . '/' . $file ) ) {

                    $this->deleteAllFiles( $folder . '/' . $file );
                    rmdir( $folder . '/' . $file );
                } else {

                    unlink( $folder . '/' . $file );
                }
            }
        }
    }

    public function deleteFolder(Request $request) {

        $folder = $this->folder . $_COOKIE['hash'] . $request->location . '/' . $request->folder;
        $this->deleteAllFiles( $folder );

        rmdir( $folder );

        $return['status'] = true;
        $return['folder']   = $request->folder;
        $return['location'] = $request->location;

        return $return;
    }
}
