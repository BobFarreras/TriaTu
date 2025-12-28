import { describe, it, expect } from 'vitest';
// Utilitzem l'alias '@/' i la sintaxi import per complir amb ESLint i TS strict
import config from '@/tsconfig.json'; 

describe('Environment Setup', () => {
  it('should run tests correctly', () => {
    expect(true).toBe(true);
  });

  it('should resolve aliases', () => {
    // Si això compila i passa, l'alias '@/' funciona correctament
    expect(config).toBeDefined();
    expect(config.compilerOptions).toBeDefined();
  });
});