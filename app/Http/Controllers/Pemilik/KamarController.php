<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use Inertia\Inertia;

class KamarController extends Controller
{
    public function index()
    {
        $kamars = Kamar::all();

        $summary = [
            'total' => $kamars->count(),
            'terisi' => $kamars->where('status', 'terisi')->count(),
            'kosong' => $kamars->where('status', 'kosong')->count(),
            'perawatan' => $kamars->where('status', 'perawatan')->count(),
            'potensi_pendapatan' => $kamars->where('status', 'terisi')->sum('harga'),
        ];

        return Inertia::render('Pemilik/Kamar', [
            'kamars' => $kamars,
            'summary' => $summary,
        ]);
    }
}
