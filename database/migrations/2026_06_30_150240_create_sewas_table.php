<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sewas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kamar_id')->constrained()->cascadeOnDelete();
            $table->foreignId('penyewa_id')->constrained('penyewas')->cascadeOnDelete();
            $table->date('tanggal_masuk');
            $table->integer('durasi_bulan')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sewas');
    }
};
