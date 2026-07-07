<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />



        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <style>
            #initial-splash {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #f8fafc;
                transition: opacity 0.5s ease-out;
            }
            @media (prefers-color-scheme: dark) {
                #initial-splash {
                    background-color: #0f172a;
                }
            }
            .splash-spinner {
                width: 48px;
                height: 48px;
                border: 4px solid rgba(139, 94, 60, 0.2);
                border-top-color: #8B5E3C;
                border-radius: 50%;
                animation: splash-spin 1s linear infinite;
                margin-top: 16px;
            }
            .splash-icon {
                color: #8B5E3C;
            }
            @keyframes splash-spin {
                to { transform: rotate(360deg); }
            }
        </style>
        <div id="initial-splash">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="splash-icon">
                <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
                <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
                <path d="M12 4v6"/>
                <path d="M2 18h20"/>
            </svg>
            <h2 style="font-family: sans-serif; font-weight: bold; margin-top: 12px; color: #8B5E3C; font-size: 24px; margin-bottom: 0; letter-spacing: 1px;">eKOS</h2>
            <div class="splash-spinner"></div>
        </div>

        @inertia

        <!-- Midtrans Snap JS (Sandbox mode based on config) -->
        <script type="text/javascript"
          src="{{ config('midtrans.is_production') ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js' }}"
          data-client-key="{{ config('midtrans.client_key') }}"></script>
    </body>
</html>
