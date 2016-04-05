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
    public function saveTheme(Request $request, $hash)
    {
    	$query = app('db')->update( " UPDATE codes SET theme = '" . $request->theme . "' WHERE hash = '" . $hash . "' " );
    }

    public function saveSyntax(Request $request, $hash)
    {
    	$query = app('db')->update( " UPDATE codes SET syntax = '" . $request->syntax . "' WHERE hash = '" . $hash . "' " );
    }
}