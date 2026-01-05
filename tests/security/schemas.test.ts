import { describe, it, expect } from 'vitest';
import { 
  AddCandidateSchema, 
  GenerateRecipeSchema, 
  InventoryItemSchema 
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
          name: 'Patates'.repeat(20), // Massa llarg
          quantity: 1,
          unit: 'kg'
        });
        expect(result.success).toBe(false);
      });
  });
});