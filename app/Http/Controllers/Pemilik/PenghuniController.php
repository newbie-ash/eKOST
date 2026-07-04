<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Penyewa;
use Inertia\Inertia;

class PenghuniController extends Controller
{
    public function index()
    {
        $penghunis = Penyewa::with('user')->latest()->get();
        
        return Inertia::render('Pemilik/Penghuni', [
            'penghunis' => $penghunis
        ]);
    }
}
