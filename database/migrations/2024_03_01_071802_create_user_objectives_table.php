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
        Schema::create('user_objectives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('objective_id')->constrained()->onDelete('cascade');
            $table->boolean('is_completed')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // is_archived
            $table->boolean('is_archived')->default(false);

            // status : 1-> completed, 0 -> not completed
            $table->tinyInteger('status')->default(0);

            // admin_status : 0 - review, 1 - approved, 2 - rejected
            $table->tinyInteger('admin_status')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_objectives');
    }
};
