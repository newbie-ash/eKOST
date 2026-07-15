<?php

namespace App\Console\Commands;

use App\Models\Sewa;
use App\Models\Tagihan;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ekos:generate-bills';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly bills automatically for active tenants';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentMonth = Carbon::now()->format('Y-m');
        $this->info("Starting automatic billing process for month: {$currentMonth}");

        // Get all active rentals
        $activeSewas = Sewa::with('kamar')->where('status_sewa', 'Aktif')->get();
        $generatedCount = 0;

        foreach ($activeSewas as $sewa) {
            // Check if bill already exists for this month
            $existingTagihan = Tagihan::where('sewa_id', $sewa->id)
                ->where('bulan_tagihan', $currentMonth)
                ->first();

            if (!$existingTagihan) {
                Tagihan::create([
                    'sewa_id' => $sewa->id,
                    'bulan_tagihan' => $currentMonth,
                    'jumlah_bayar' => $sewa->kamar->harga,
                    'status_lunas' => false,
                ]);

                $generatedCount++;
                $this->line("Generated bill for Sewa ID {$sewa->id} (Amount: Rp" . number_format($sewa->kamar->harga, 0, ',', '.') . ")");
            }
        }

        $this->info("Process completed. {$generatedCount} bills were generated.");
        Log::info("ekos:generate-bills completed. Generated {$generatedCount} new bills for {$currentMonth}.");
    }
}
