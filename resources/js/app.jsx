import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'eKOS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');
        const searchPathJsx = `./Pages/${name}.jsx`.toLowerCase();
        const searchPathTsx = `./Pages/${name}.tsx`.toLowerCase();
        
        const keys = Object.keys(pages);
        const foundKey = keys.find(key => {
            const lowerKey = key.toLowerCase();
            return lowerKey === searchPathJsx || lowerKey === searchPathTsx;
        });

        if (!foundKey) {
            throw new Error(`Page not found: ${name}. Tried searching case-insensitively in ./Pages/**/*.{jsx,tsx}`);
        }
        
        const page = pages[foundKey];
        return typeof page === 'function' ? page() : page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#8B5E3C',
    },
});
