<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Penyewa;
use App\Models\Kamar;
use App\Models\Sewa;
use App\Models\Tagihan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin Utama (Admin/Penjaga)
        $adminUser = User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@ekos.com',
            'password' => Hash::make('password'),
            'role' => 'penjaga',
            'gaji_perbulan' => 3000000,
            'jam_kerja' => '08:00 - 17:00',
            'kontak_darurat' => '0895601322323',
        ]);

        // Akun Pemilik (opsional)
        $pemilikUser = User::create([
            'name' => 'Pemilik Kos',
            'email' => 'pemilik@ekos.com',
            'password' => Hash::make('password'),
            'role' => 'pemilik',
            'nama_bank' => 'BCA',
            'nomor_rekening' => '1234567890',
            'atas_nama' => 'Bapak Pemilik Kos',
            'kontak_darurat' => '0895601322323',
        ]);

        // 2. Buat 5 Kamar
        $kamars = [
            ['nomor' => '101', 'tipe' => 'Standar', 'harga' => 500000, 'fasilitas' => 'Kasur, Lemari, Kipas Angin'],
            ['nomor' => '102', 'tipe' => 'Standar', 'harga' => 500000, 'fasilitas' => 'Kasur, Lemari, Kipas Angin'],
            ['nomor' => '201', 'tipe' => 'VIP', 'harga' => 1000000, 'fasilitas' => 'Kasur Springbed, Lemari, AC, TV, Kamar Mandi Dalam'],
            ['nomor' => '202', 'tipe' => 'VIP', 'harga' => 1000000, 'fasilitas' => 'Kasur Springbed, Lemari, AC, TV, Kamar Mandi Dalam'],
            ['nomor' => '301', 'tipe' => 'VIP', 'harga' => 1200000, 'fasilitas' => 'Kasur Springbed, Lemari, AC, TV, Kamar Mandi Dalam, Kulkas'],
        ];

        foreach ($kamars as $k) {
            Kamar::create([
                'nomor_kamar' => $k['nomor'],
                'tipe_kamar' => $k['tipe'],
                'harga' => $k['harga'],
                'fasilitas' => $k['fasilitas'],
                'status' => 'kosong',
            ]);
        }

        // 3. Buat 5 Penghuni (Penyewa) beserta akun
        $penyewasData = [
            ['nama' => 'Safira Azzahra Saragih', 'email' => 'safira@ekos.com', 'jk' => 'P', 'pekerjaan' => 'Mahasiswi', 'ktp' => '32710001', 'telepon' => '085260439844'],
            ['nama' => 'Dwi Siska Hariani', 'email' => 'dwi@ekos.com', 'jk' => 'P', 'pekerjaan' => 'Mahasiswi', 'ktp' => '32710002', 'telepon' => '081361845504'],
            ['nama' => 'Annisa Liandes', 'email' => 'annisa@ekos.com', 'jk' => 'P', 'pekerjaan' => 'Mahasiswi', 'ktp' => '32710003', 'telepon' => '082273013438'],
            ['nama' => 'Lidya Wulan Cahya', 'email' => 'lidya@ekos.com', 'jk' => 'P', 'pekerjaan' => 'Mahasiswi', 'ktp' => '32710004', 'telepon' => '082365413730'],
            ['nama' => 'Muhammad Dzakwan Hanif', 'email' => 'muhammad@ekos.com', 'jk' => 'L', 'pekerjaan' => 'Mahasiswa', 'ktp' => '32710005', 'telepon' => '082253204649'],
        ];

        $penyewas = [];
        foreach ($penyewasData as $index => $p) {
            $user = User::create([
                'name' => $p['nama'],
                'email' => $p['email'],
                'password' => Hash::make('password'),
                'role' => 'penyewa',
            ]);
            
            $penyewa = Penyewa::create([
                'user_id' => $user->id,
                'nomor_ktp' => $p['ktp'],
                'pekerjaan' => $p['pekerjaan'],
                'telepon' => $p['telepon'],
                'kontak_darurat' => '08900000' . $index,
                'jenis_kelamin' => $p['jk'],
                'nama_kontak_darurat' => 'Keluarga ' . $p['nama'],
            ]);
            $penyewas[] = $penyewa;
        }

        // 4. Buat 3 Data Sewa aktif
        // Sewa 1: Budi di Kamar 101
        $kamar1 = Kamar::where('nomor_kamar', '101')->first();
        $kamar1->update(['status' => 'terisi']);
        $sewa1 = Sewa::create([
            'kamar_id' => $kamar1->id,
            'penyewa_id' => $penyewas[0]->id,
            'tanggal_masuk' => Carbon::now()->subMonths(2)->startOfMonth(),
            'durasi_bulan' => 6,
            'status_sewa' => 'Aktif',
        ]);
        Tagihan::create([
            'sewa_id' => $sewa1->id,
            'bulan_tagihan' => Carbon::now()->format('F'),
            'jumlah_bayar' => $kamar1->harga,
            'tanggal_jatuh_tempo' => Carbon::now()->addDays(5),
            'status_lunas' => false,
            'denda' => 0,
        ]);

        // Sewa 2: Siti di Kamar 201
        $kamar2 = Kamar::where('nomor_kamar', '201')->first();
        $kamar2->update(['status' => 'terisi']);
        $sewa2 = Sewa::create([
            'kamar_id' => $kamar2->id,
            'penyewa_id' => $penyewas[2]->id,
            'tanggal_masuk' => Carbon::now()->subMonth()->startOfMonth(),
            'durasi_bulan' => 12,
            'status_sewa' => 'Aktif',
        ]);
        Tagihan::create([
            'sewa_id' => $sewa2->id,
            'bulan_tagihan' => Carbon::now()->format('F'),
            'jumlah_bayar' => $kamar2->harga,
            'tanggal_jatuh_tempo' => Carbon::now()->addDays(5),
            'status_lunas' => true, // Udah lunas
            'denda' => 0,
        ]);

        // Sewa 3: Doni di Kamar 301
        $kamar3 = Kamar::where('nomor_kamar', '301')->first();
        $kamar3->update(['status' => 'terisi']);
        $sewa3 = Sewa::create([
            'kamar_id' => $kamar3->id,
            'penyewa_id' => $penyewas[4]->id,
            'tanggal_masuk' => Carbon::now()->startOfMonth(),
            'durasi_bulan' => 3,
            'status_sewa' => 'Aktif',
        ]);
        Tagihan::create([
            'sewa_id' => $sewa3->id,
            'bulan_tagihan' => Carbon::now()->format('F'),
            'jumlah_bayar' => $kamar3->harga,
            'tanggal_jatuh_tempo' => Carbon::now()->addDays(5),
            'status_lunas' => false,
            'denda' => 0,
        ]);
    }
}
