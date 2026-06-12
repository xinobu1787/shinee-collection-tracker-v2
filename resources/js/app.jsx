import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // もし name に "Pages/" が含まれていたら、そのまま使う。
        // そうでなければ、これまで通り "./Pages/" を補完する。
        const path = name.startsWith('Pages/') ? `./${name}.jsx` : `./Pages/${name}.jsx`;
        
        return resolvePageComponent(
        `./Pages/${name}.jsx`, 
        import.meta.glob('./Pages/**/*.jsx')
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker 登録成功:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker 登録失敗:', error);
            });
    });
}
