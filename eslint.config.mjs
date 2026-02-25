import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/*.js', '**/*.mjs'],
    },
    {
        files: ['packages/scriblmotion-*/src/**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'unused-imports': unusedImports,
        },
        rules: {
            // ── Unused imports: auto-removable with --fix ─────────────────────
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // ── General quality ──────────────────────────────────────────────
            'no-console': 'warn',
            'no-debugger': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
];
