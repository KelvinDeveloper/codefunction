<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function register(Request $request)
    {
        $name = explode('@', $request->email);

        return User::create([
            'name' => $name[0],
            'email' => $request->email,
            'password' => md5( $request->password ),
            'hash' => $_COOKIE['hash']
        ]);
    }


    public function login(Request $request)
    {
        $user = User::where( 'email', $request->email )->where( 'password', md5( $request->password ) )->first(['name', 'email', 'hash']);

        if ( $user == null ) {

            return array('status' => false);
        }

        foreach ( $user['attributes'] as $key => $value ) {
            
            setcookie( $key, $value );
            $_COOKIE[ $key ] = $value;
            $return[ $key ]  = $value;
        }

        return array('status' => true, 'model' => $return);
    }

    public function logout()
    {

        foreach ( ['name', 'email'] as $key ) {
            
            $_COOKIE[ $key ] = '';
            unset($_COOKIE[ $key ]);
            setcookie($key, null, -1, '/');
        }

        return redirect('/');
    }
}
