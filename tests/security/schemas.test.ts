import { describe, it, expect } from 'vitest';
import {
  AddCandidateSchema,
  GenerateRecipeSchema,
  InventoryItemSchema,
  MaterializeRecipeSchema
} from '@/core/application/schemas/inputSchemas';

describe('🛡️ SECURITY: Input Validation Schemas', () => {

  // 1. TEST ANTI-XSS
  describe('Anti-XSS Rules', () => {
    it('hauria de bloquejar tags <script>', () => {
      const maliciousPayload = {
        roomId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Hola <script>alert("Hacked")</script>'
      };

      const result = AddCandidateSchema.safeParse(maliciousPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('No es permeten els caràcters < o >');
      }
    });

    it('hauria de bloquejar HTML img onerror', () => {
      const maliciousPayload = {
        roomId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Look at this <img src=x onerror=alert(1)>'
      };

      const result = AddCandidateSchema.safeParse(maliciousPayload);
      expect(result.success).toBe(false);
    });

    it('hauria d\'acceptar text segur normal', () => {
      const validPayload = {
        roomId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Pizza sense pinya'
      };
      const result = AddCandidateSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });
  });

  // 2. TEST PROMPT INJECTION (Receptes)
  describe('Anti-Prompt Injection (Recipe)', () => {
    it('hauria de bloquejar textos massa llargs (Buffer Overflow / Token Wasting)', () => {
      const longText = 'a'.repeat(501); // El límit és 500
      const result = GenerateRecipeSchema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        dishName: longText,
        lang: 'ca'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500');
      }
    });
  });

  // 3. TEST INVENTARI (Lògica de Negoci)
  describe('Inventory Logic', () => {
    it('hauria de bloquejar quantitats negatives', () => {
      const result = InventoryItemSchema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Patates',
        quantity: -5, // ERROR
        unit: 'kg',
        location: 'PANTRY'
      });
      expect(result.success).toBe(false);
    });

    it('hauria de bloquejar noms excessivament llargs', () => {
      const result = InventoryItemSchema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        // ✅ CANVI: 'Patates' (7 chars) * 20 = 140 chars. 
        // Si el límit és 200, això passava. Posem * 100 per fer 700 chars i forçar l'error.
        name: 'Patates'.repeat(100),
        quantity: 1,
        unit: 'kg'
      });
      expect(result.success).toBe(false);
    });
  });


  // 4. TEST MATERIALIZE RECIPE (Sanititzacio IA)
  describe('Materialize Recipe Input', () => {
    it("hauria d'acceptar una recepta valida", () => {
      const result = MaterializeRecipeSchema.safeParse({
        name: 'Arros amb verdures',
        prepTimeMinutes: 25,
        tags: ['vegetaria'],
        dietaryTags: ['sense lactosa'],
        steps: ['Bullir l'arros', 'Saltejar verdures'],
        ingredients: [
          { name: 'Arros', quantity: 200, unit: 'g' },
          { name: 'Carbasso', quantity: 1, unit: 'u' }
        ]
      });
      expect(result.success).toBe(true);
    });

    it('hauria de bloquejar HTML dins del nom o passos', () => {
      const result = MaterializeRecipeSchema.safeParse({
        name: 'Sopa <script>alert(1)</script>',
        steps: ['Pas <img src=x onerror=alert(1)>'],
        ingredients: [{ name: 'Aigua', quantity: 1, unit: 'l' }]
      });
      expect(result.success).toBe(false);
    });

    it('hauria de bloquejar quantitats negatives o zero', () => {
      const result = MaterializeRecipeSchema.safeParse({
        name: 'Amanida',
        steps: ['Barrejar'],
        ingredients: [{ name: 'Enciam', quantity: 0, unit: 'g' }]
      });
      expect(result.success).toBe(false);
    });
  });
});