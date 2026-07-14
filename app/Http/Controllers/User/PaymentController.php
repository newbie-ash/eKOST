<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Penyewa;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$clientKey = config('midtrans.client_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function getSnapToken(Tagihan $tagihan)
    {
        // Security Check: IDOR Protection
        $penyewa = Penyewa::where('user_id', auth()->id())->first();
        if (! $penyewa || $tagihan->sewa->penyewa_id !== $penyewa->id) {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        if ($tagihan->status_lunas) {
            return response()->json(['error' => 'Tagihan sudah lunas']);
        }

        // Jika sudah ada snap_token, coba gunakan yang lama dulu
        // Jika expired, frontend akan memanggil ulang dengan force_new=true
        if ($tagihan->snap_token && !request()->boolean('force_new')) {
            return response()->json(['snap_token' => $tagihan->snap_token]);
        }

        // Reset snap_token lama (expired/cancelled), buat yang baru
        return $this->createNewSnapToken($tagihan);
    }

    private function createNewSnapToken(Tagihan $tagihan)
    {
        $params = [
            'transaction_details' => [
                'order_id' => 'INV-'.$tagihan->id.'-'.time(),
                'gross_amount' => $tagihan->jumlah_bayar,
            ],
            'customer_details' => [
                'first_name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'phone' => '',
            ],
        ];

        // Bypass SSL error di localhost (Laragon/XAMPP)
        Config::$curlOptions = [
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTPHEADER => [],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            $tagihan->update(['snap_token' => $snapToken]);

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            \Log::error('Midtrans Error: '.$e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function cancelPayment(Tagihan $tagihan)
    {
        // Security Check: IDOR Protection
        $penyewa = Penyewa::where('user_id', auth()->id())->first();
        if (! $penyewa || $tagihan->sewa->penyewa_id !== $penyewa->id) {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        if ($tagihan->status_lunas) {
            return response()->json(['error' => 'Tagihan sudah lunas, tidak bisa dibatalkan.']);
        }

        // Reset snap_token agar bisa membuat transaksi baru
        $tagihan->update(['snap_token' => null]);

        return redirect()->back()->with('message', 'Pembayaran dibatalkan. Anda bisa memulai pembayaran baru kapan saja.');
    }

    // Hanya untuk simulasi sukses ketika presentasi/demo offline
    public function simulateSuccess(Tagihan $tagihan)
    {
        // Security Check: IDOR Protection
        $penyewa = Penyewa::where('user_id', auth()->id())->first();
        if (! $penyewa || $tagihan->sewa->penyewa_id !== $penyewa->id) {
            abort(403, 'Unauthorized action.');
        }

        $tagihan->update(['status_lunas' => true]);

        return redirect()->back()->with('message', 'Pembayaran Berhasil Disimulasikan');
    }

    public function webhook(Request $request)
    {
        try {
            $notif = new Notification;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $order_id = $notif->order_id;
        $fraud = $notif->fraud_status;

        $tagihan_id = explode('-', $order_id)[1];
        $tagihan = Tagihan::find($tagihan_id);

        if (! $tagihan) {
            return response()->json(['message' => 'Tagihan not found'], 404);
        }

        if ($transaction == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    // challenge
                } else {
                    $tagihan->update(['status_lunas' => true]);
                }
            }
        } elseif ($transaction == 'settlement') {
            $tagihan->update(['status_lunas' => true]);
        } elseif ($transaction == 'pending') {
            // pending
        } elseif ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
            // cancel
        }

        return response()->json(['message' => 'Webhook received']);
    }
}
