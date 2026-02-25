import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@scriblmotion/core': path.resolve(__dirname, '../scriblmotion-core/src/index.ts'),
            '@scriblmotion/svg': path.resolve(__dirname, '../scriblmotion-svg/src/index.ts'),
        },
    },
    server: {
        port: 5174,
        open: true,
    },
});
