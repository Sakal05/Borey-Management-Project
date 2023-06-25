<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property_details', function (Blueprint $table) {
            $table->id();
            $table->string('property_detail_id')->unique();
            $table->string('property_id');
            $table->string('house_number');
            $table->timestamps();

            // Add foreign key constraint
            $table->foreign('property_id')->references('property_id')->on('properties')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('property_details', function (Blueprint $table) {
            // Drop foreign key constraint before dropping the table
            $table->dropForeign(['property_id']);
        });

        Schema::dropIfExists('property_details');
    }
}
