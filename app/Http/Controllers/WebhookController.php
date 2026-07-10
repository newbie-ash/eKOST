<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Notification;

class WebhookController extends Controller
{
    public function midtrans(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');

        try {
            $notification = new Notification;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $transaction = $notification->transaction_status;
        $type = $notification->payment_type;
        $order_id = $notification->order_id;
        $fraud = $notification->fraud_status;

        // format order_id: TAGIHAN-{id}-{time}
        $order_id_parts = explode('-', $order_id);

        if (count($order_id_parts) >= 2 && $order_id_parts[0] === 'TAGIHAN') {
            $tagihan_id = $order_id_parts[1];
            $tagihan = Tagihan::find($tagihan_id);

            if ($tagihan) {
                if ($transaction == 'capture' || $transaction == 'settlement') {
                    if ($type == 'credit_card' && $fraud == 'challenge') {
                        // challenge
                    } else {
                        // Success
                        $tagihan->status_lunas = true;
                        $tagihan->save();
                    }
                } elseif ($transaction == 'cancel' || $transaction == 'deny' || $transaction == 'expire') {
                    // failed/expired
                } elseif ($transaction == 'pending') {
                    // pending
                }
            }
        }

        return response()->json(['message' => 'OK']);
    }
}
