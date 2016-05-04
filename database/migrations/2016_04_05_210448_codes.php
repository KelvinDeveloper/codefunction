<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Codes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("codes", function (Blueprint $table) {
            $table->increments("id");
            $table->string("syntax", 100)->default('plain text');
            $table->string("theme",  100)->default('railscasts');
            $table->string("hash",  50);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("codes");
    }
}
