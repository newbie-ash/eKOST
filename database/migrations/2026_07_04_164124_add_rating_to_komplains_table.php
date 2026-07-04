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
        Schema::table('komplains', function (Blueprint $table) {
            $table->tinyInteger('rating')->nullable()->after('status');
            $table->text('ulasan_penyewa')->nullable()->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('komplains', function (Blueprint $table) {
            $table->dropColumn(['rating', 'ulasan_penyewa']);
        });
    }
};
