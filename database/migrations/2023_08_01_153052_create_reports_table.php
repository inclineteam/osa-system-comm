<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('program');
            $table->string('performance');
            $table->string('accomplishment');
            $table->string('remarks');
            $table->string('image');
            $table->string('signature');
            $table->date('date');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('submission_bin_id');
            $table->string('title');
            $table->date('date');
            $table->string('duration');
            $table->string('participants');
            $table->boolean('budget');
            $table->string('conducted_by');
            $table->string('location');
            $table->json('documentation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
