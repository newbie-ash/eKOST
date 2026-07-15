<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Jalankan otomatis setiap tanggal 1 jam 00:01 pagi
Schedule::command('ekos:generate-bills')->monthlyOn(1, '00:01');
