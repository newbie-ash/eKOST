<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsPemilik
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role === 'pemilik') {
            return $next($request);
        }

        return redirect()->route('dashboard')->with('error', 'Maaf, halaman ini khusus untuk Pemilik Kos.');
    }
}
