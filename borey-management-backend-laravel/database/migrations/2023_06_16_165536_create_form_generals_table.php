<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormGeneralsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_generals', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('username');
            $table->string('fullname');
            $table->string('email');
            $table->string('category');
            $table->string('problem_description');
            $table->string('path');
            $table->string('general_status')->default('pending');;
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('form_generals');
    }
}
