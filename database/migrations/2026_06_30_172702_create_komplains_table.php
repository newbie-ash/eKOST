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
        Schema::create('komplains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penyewa_id')->constrained('penyewas')->cascadeOnDelete();
            $table->foreignId('kamar_id')->constrained('kamars')->cascadeOnDelete();
            $table->string('judul_komplain');
            $table->text('deskripsi');
            $table->string('foto_kerusakan')->nullable();
            $table->enum('status', ['Menunggu', 'Diproses', 'Selesai'])->default('Menunggu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('komplains');
    }
};
