<?php

namespace App\Http\Controllers;

class GitController extends Controller
{
    public function gitClone()
    {
        dd( shell_exec('git clone https://kelvinsouza@bitbucket.org/kelvinsouza/pesquisa.git') );
    }
}
