<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsPenghuni
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (\Illuminate\Support\Facades\Auth::check()) {
            $user = \Illuminate\Support\Facades\Auth::user();
            if ($user->isAdmin()) {
                return redirect()->route('dashboard')->with('error', 'Anda login sebagai Admin/Pemilik. Akses ke halaman user dibatasi.');
            }
        }
        return $next($request);
    }
}
