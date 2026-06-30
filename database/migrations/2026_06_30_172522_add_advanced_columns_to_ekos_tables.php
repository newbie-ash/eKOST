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
        Schema::table('kamars', function (Blueprint $table) {
            $table->text('fasilitas')->nullable()->after('harga');
            $table->string('foto_kamar')->nullable()->after('fasilitas');
        });

        Schema::table('penyewas', function (Blueprint $table) {
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('user_id');
            $table->string('nama_kontak_darurat')->nullable()->after('kontak_darurat');
        });

        Schema::table('sewas', function (Blueprint $table) {
            $table->date('tanggal_keluar')->nullable()->after('durasi_bulan');
            $table->enum('status_sewa', ['Aktif', 'Selesai'])->default('Aktif')->after('tanggal_keluar');
        });

        Schema::table('tagihans', function (Blueprint $table) {
            $table->date('tanggal_jatuh_tempo')->nullable()->after('jumlah_bayar');
            $table->integer('denda')->default(0)->after('tanggal_jatuh_tempo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kamars', function (Blueprint $table) {
            $table->dropColumn(['fasilitas', 'foto_kamar']);
        });

        Schema::table('penyewas', function (Blueprint $table) {
            $table->dropColumn(['jenis_kelamin', 'nama_kontak_darurat']);
        });

        Schema::table('sewas', function (Blueprint $table) {
            $table->dropColumn(['tanggal_keluar', 'status_sewa']);
        });

        Schema::table('tagihans', function (Blueprint $table) {
            $table->dropColumn(['tanggal_jatuh_tempo', 'denda']);
        });
    }
};
