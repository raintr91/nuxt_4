import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webSrc = path.resolve(__dirname, 'src');

export default defineConfig({
  resolve: {
    alias: [
      { find: '@portal/models', replacement: path.resolve(__dirname, 'packages/models/src') },
      { find: '~/models', replacement: path.resolve(__dirname, 'packages/models/src') },
      { find: '~/tests', replacement: path.resolve(__dirname, 'tests') },
      { find: '@', replacement: webSrc },
    ],
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: [
      'tests/unit/models/**/*.test.ts',
      'tests/unit/hooks/**/*.test.ts',
      'tests/unit/services/**/*.test.ts',
      'tests/unit/validations/**/*.test.ts',
      'tests/unit/lib/data-table-logic.test.ts',
      'tests/unit/scripts/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
