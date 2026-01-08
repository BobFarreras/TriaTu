// =================== FILE: src/core/application/schemas/inputSchemas.ts ===================
import { z } from 'zod';

// 🛡️ REGLA MESTRA: Text Segur (Anti-XSS i Anti-DoS)
const SafeText = z.string()
  .trim()
  .min(1, "El camp no pot estar buit")
  .max(500, "Màxim 500 caràcters") // Evita que ens omplin la DB
  .regex(/^[^<>]*$/, "No es permeten els caràcters < o > per seguretat"); 

// Validació d'UUIDs (per evitar SQL injection en IDs)
const UuidSchema = z.string().uuid("L'ID no és vàlid");

// --- 1. CREAR SALA ---
export const CreateRoomSchema = z.object({
  hostUserId: UuidSchema,
  name: SafeText.max(100, "El nom de la sala és massa llarg")
});

// --- 2. AFEGIR CANDIDAT (CRÍTIC PER XSS) ---
export const AddCandidateSchema = z.object({
  roomId: UuidSchema,
  userId: UuidSchema,
  content: SafeText // Apliquem la neteja d'HTML
});

// --- 3. UNIR-SE / FER FORA ---
export const ParticipantActionSchema = z.object({
  roomId: UuidSchema,
  userId: UuidSchema // Pot ser el que s'uneix o el que fem fora
});

// --- 4. PRENDRE DECISIÓ ---
export const MakeDecisionSchema = z.object({
  roomId: UuidSchema,
  requesterUserId: UuidSchema,
  mode: z.enum(['magic', 'manual'])
});

// --- 5. NETEJAR HISTORIAL ---
export const ClearHistorySchema = z.object({
  roomId: UuidSchema,
  userId: UuidSchema // El que demana l'acció (ha de ser Host)
});



// --- 1. AUTH (Login/Signup) ---
export const AuthSchema = z.object({
  email: z.string().email("L'email no és vàlid"),
  password: z.string().min(6, "La contrasenya ha de tenir almenys 6 caràcters")
});

// --- 2. PERFIL D'USUARI (Update Profile) ---
export const UpdateProfileSchema = z.object({
  userId: UuidSchema,
  username: z.string().trim().min(1, { message: "ERR_USERNAME_EMPTY" }),
  // Acceptem emojis o text curt. Regex simple per evitar scripts
  avatarEmoji: z.string().trim().max(5, "Només un emoji").regex(/^[^<>]*$/, "Emoji invàlid").optional().or(z.literal('')),
  foodPreferences: z.array(SafeText).max(20, "Màxim 20 preferències"),
  exclusions: z.array(SafeText).max(20, "Màxim 20 exclusions"),
  socialTolerance: z.number().min(0).max(10, "La tolerància ha de ser entre 0 i 10")
});

// --- 3. RECEPTES (Generate Recipe) ---
// Crític per evitar Prompt Injection a la IA
export const GenerateRecipeSchema = z.object({
  userId: UuidSchema,
  dishName: SafeText.max(100, "El nom del plat és massa llarg"), // Bloquegem textos llargs a la IA
  lang: z.enum(['ca', 'es', 'en']).default('ca')
});

// --- 4. DECISIONS INDIVIDUALS ---
export const IndividualDecisionSchema = z.object({
  userId: UuidSchema,
  type: z.string(), // O un z.enum(['FOOD', 'PLAN', etc]) si tens els tipus importats
  energyLevel: z.number().int().min(0).max(10), // Rangen lògics
  timeMinutes: z.number().int().min(1).max(1440) // Mínim 1 minut, màxim 24h
});

// --- 5. INVENTARI ---
// Per afegir o actualitzar items
export const InventoryItemSchema = z.object({
  id: UuidSchema.optional(), // Opcional perquè al crear no en té
  userId: UuidSchema,
  name: SafeText.max(50, "El nom de l'ingredient és massa llarg"),
  quantity: z.number().min(0, "La quantitat no pot ser negativa").max(999999, "Quantitat excessiva"),
  unit: SafeText.max(10, "Unitat massa llarga"), // ex: "kg", "litres"
  location: z.enum(['FRIDGE', 'FREEZER', 'PANTRY']).default('PANTRY'), // Ajusta als teus valors
  expiryDate: z.string().datetime().optional().or(z.literal('')), // Data o buit
  emoji: z.string().max(4).regex(/^[^<>]*$/).optional().or(z.literal(''))
});

// Per consumir o eliminar
export const ConsumeItemSchema = z.object({
  itemId: UuidSchema,
  amount: z.number().positive("La quantitat a consumir ha de ser positiva")
});

// Per l'acció automàtica de la recepta (Toggle Stock)
export const ToggleStockSchema = z.object({
  userId: UuidSchema,
  ingredientName: SafeText.max(100),
  quantityRequired: z.number().positive(),
  action: z.enum(['CONSUME', 'RESTORE'])
});


