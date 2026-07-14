<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsPemilik;
use App\Http\Middleware\IsPenghuni;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->trustProxies(at: '*');

        // Middleware bawaan untuk Inertia/React
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Daftarkan middleware dengan nama panggilan 'admin'
        $middleware->alias([
            'admin' => IsAdmin::class,
            'pemilik' => IsPemilik::class,
            'is_penghuni' => IsPenghuni::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'midtrans/webhook',
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
