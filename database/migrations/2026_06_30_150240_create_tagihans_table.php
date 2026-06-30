<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sewa_id')->constrained()->cascadeOnDelete();
            $table->string('bulan_tagihan'); // e.g. "2026-06" or string
            $table->integer('jumlah_bayar');
            $table->boolean('status_lunas')->default(false);
            $table->string('bukti_transfer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
