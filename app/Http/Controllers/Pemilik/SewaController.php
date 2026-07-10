<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Sewa;
use Inertia\Inertia;

class SewaController extends Controller
{
    public function index()
    {
        $sewas = Sewa::with(['penyewa.user', 'kamar'])->latest()->get();
        $totalSewaAktif = Sewa::where('status_sewa', 'Aktif')->count();
        $totalKamarTerisi = Kamar::where('status', 'terisi')->count();
        $totalKamarKosong = Kamar::where('status', 'kosong')->count();

        return Inertia::render('Pemilik/Sewa', [
            'sewas' => $sewas,
            'summary' => [
                'aktif' => $totalSewaAktif,
                'terisi' => $totalKamarTerisi,
                'kosong' => $totalKamarKosong,
            ],
        ]);
    }
}
