<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kamar;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        Kamar::create([
            'nomor_kamar' => '101',
            'tipe_kamar' => 'Standar',
            'harga' => 500000,
            'status' => 'kosong',
        ]);

        Kamar::create([
            'nomor_kamar' => '102',
            'tipe_kamar' => 'Standar',
            'harga' => 500000,
            'status' => 'kosong',
        ]);

        Kamar::create([
            'nomor_kamar' => '201',
            'tipe_kamar' => 'VIP',
            'harga' => 1000000,
            'status' => 'kosong',
        ]);

        Kamar::create([
            'nomor_kamar' => '202',
            'tipe_kamar' => 'VIP',
            'harga' => 1000000,
            'status' => 'kosong',
        ]);
    }
}
