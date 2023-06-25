<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('property_id')->unique();
            $table->string('user_id');
            $table->string('property_type');
            $table->string('property_detail_id');
            $table->timestamps();

            // Add foreign key constraint
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
        Schema::table('properties', function (Blueprint $table) {
            // Drop foreign key constraint before dropping the table
            $table->dropForeign(['user_id']);
            $table->dropForeign(['property_detail_id']);
        });

        Schema::dropIfExists('properties');
    }
}
