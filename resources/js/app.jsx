import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'eKOS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        // Glob only jsx files under the lowercase 'pages' directory
        const pages = import.meta.glob('./pages/**/*.jsx');
        
        // Normalize the searched path case-insensitively
        const searchPathJsx = `./pages/${name}.jsx`.toLowerCase();
        
        const keys = Object.keys(pages);
        const foundKey = keys.find(key => {
            return key.toLowerCase() === searchPathJsx;
        });

        if (!foundKey) {
            throw new Error(`Page not found: ${name}. Tried searching case-insensitively in ./pages/**/*.jsx`);
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
