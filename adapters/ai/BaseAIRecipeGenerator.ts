import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { GenerationContext } from '@/core/domain/types/GenerationContext';
// ✅ Assegura't que la ruta a EmojiMatcherService és correcta
import { EmojiMatcherService } from '@/core/services/EmojiMarcherService';

// Defineix el DTO per evitar errors de tipatge amb la resposta de la IA
interface AIRecipeDTO {
    name: string;
    prep_time_minutes: number;
    total_estimated_cost: number;
    ingredients: { 
        name: string; 
        quantity: number; 
        unit: string; 
        emoji?: string; 
    }[];
    steps: string[];
    tags?: string[];
    dietary_tags?: string[];
}

export abstract class BaseAIRecipeGenerator implements RecipeGenerator {

  // ✅ Implementació Principal del flux de generació
  async generate(ctx: GenerationContext): Promise<Recipe[]> {
    console.log(`🤖 [AI] Generant ${ctx.count} receptes (Mode: ${ctx.mode})...`);

    const prompt = this.buildPrompt(ctx);

    try {
      // 1. Cridar al model (Gemini/OpenAI/etc)
      const rawJsonString = await this.callAIModel(prompt, ctx.focusDish);

      if (!rawJsonString) {
        console.warn(`⚠️ [${this.getModelName()}] Resposta buida.`);
        return [];
      }

      // 2. Parsejar JSON
      const dtos = this.parseResponse(rawJsonString);

      // Verificació de quantitat
      if (dtos.length < ctx.count) {
          console.warn(`⚠️ [AI] Demanades ${ctx.count}, rebudes ${dtos.length}.`);
      }

      // 3. Mapejar a Domini (Aquí és on assignem IDs i Emojis reals)
      return dtos
        .map(dto => this.mapToDomain(dto, ctx))
        .filter((r): r is Recipe => r !== null);

    } catch (error) {
      console.error(`❌ [${this.getModelName()}] Error crític:`, error);
      return [];
    }
  }

  // Mètodes abstractes que les classes filles han d'implementar
  protected abstract callAIModel(prompt: string, focusDish?: string): Promise<string | null>;
  protected abstract getModelName(): string;

  // --- PROMPT BLINDAT ---

  private buildPrompt(ctx: GenerationContext): string {
    const inventoryText = ctx.inventory.length > 0
      ? ctx.inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n')
      : "(Sense inventari, fes servir ingredients comuns)";

    const restrictionsText = ctx.restrictions.length > 0
      ? `⛔ RESTRICCIONS (CRÍTIC): ${ctx.restrictions.join(', ')}`
      : "✅ Sense restriccions.";

    let taskDesc = "";
    if (ctx.mode === 'CHEF') {
      taskDesc = `Ets un xef expert en aprofitament. Objectiu: Usar l'inventari al màxim.`;
    } else {
      taskDesc = `Ets un xef creatiu. Ignora l'inventari si et limita la creativitat.`;
    }

    if (ctx.focusDish) {
      taskDesc += `\n🎯 L'usuari vol: "${ctx.focusDish}". NO afegeixis prefixos com "Sorpresa:" al títol.`;
    }

    if (ctx.dislikes && ctx.dislikes.length > 0) {
      taskDesc += `\n⛔ NO REPETEIXIS ELS NOMS: ${ctx.dislikes.join(', ')}.`;
    }

    return `
      ${taskDesc}
      
      CONTEXT USUARI:
      - Temps disponible: ${ctx.timeAvailableMinutes || 60} min.
      - Energia: ${ctx.energyLevel || 'Mitjana'}.
      
      INVENTARI DISPONIBLE:
      ${inventoryText}
      
      ${restrictionsText}
      
      IDIOMA: ${ctx.language || 'Català'} (Imperatiu).
      
      ⚠️ INSTRUCCIONS CRÍTIQUES D'INGREDIENTS:
      1. Fes servir NOMS GENÈRICS per als ingredients. 
      2. PROHIBIT posar marques comercials (Ex: NO diguis "Llet Bonpreu", digues "Llet").
      3. NO inventis prefixos estranys.
      
      ⚠️ INSTRUCCIONS CRÍTIQUES DE FORMAT:
      1. Genera EXACTAMENT ${ctx.count} receptes diferents dins de l'array "recipes".
      2. EL NOM DE LA RECEPTA HA DE SER NET (Ex: "Arròs amb pollastre", NO "Recepta 1: Arròs...").
      3. "prep_time_minutes" ha de ser un NÚMERO (Ex: 30).
      4. "total_estimated_cost" ha de ser un NÚMERO (Ex: 5.50).
      
      FORMAT JSON OBLIGATORI:
      {
        "recipes": [
          {
            "name": "Nom del plat",
            "prep_time_minutes": 45,
            "total_estimated_cost": 5.50,
            "ingredients": [{ "name": "Ingredient", "quantity": 1, "unit": "ut", "emoji": "🥘" }],
            "steps": ["Pas 1...", "Pas 2..."],
            "tags": ["ràpid"],
            "dietary_tags": ["sense gluten"]
          }
          ... (Repeteix ${ctx.count} vegades) ...
        ]
      }
    `;
  }

  private parseResponse(jsonString: string): AIRecipeDTO[] {
    try {
      // Neteja típica de Markdown (```json ... ```)
      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return Array.isArray(parsed.recipes) ? parsed.recipes : [];
    } catch (e) {
      console.error("JSON Parse Error", e);
      return [];
    }
  }

  // 🔥 AQUÍ ESTÀ LA CLAU DE L'ÈXIT
  private mapToDomain(dto: AIRecipeDTO, ctx: GenerationContext): Recipe | null {
    try {
        console.log(`🏭 [AI Mapper] Processant recepta: "${dto.name}"`);

        // Neteja del nom (per si la IA es posa creativa amb els prefixos)
        const cleanName = dto.name.replace(/^(Recepta \d+:|Plat:|Sorpresa:)\s*/i, "").trim();

        const recipe = new Recipe({
           id: crypto.randomUUID(), // ID de la recepta (NOU)
           authorId: 'ai-generated',
           name: cleanName,
           prepTimeMinutes: Number(dto.prep_time_minutes) || 30,
           estimatedCost: Number(dto.total_estimated_cost) || 0,
           
           isAiGenerated: true, // ✅ IMPORTANT: Marcat com a IA
           authorName: "✨ Chef IA",
           
           ingredients: dto.ingredients.map(i => {
             // 1️⃣ Consultem el Matcher per trobar el PRESET REAL
             const preset = EmojiMatcherService.match(i.name);
             
             // 2️⃣ Si tenim preset, fem servir el seu ID (ex: 'p3')
             // Si no, generem un UUID aleatori.
             const finalId = preset ? preset.id : crypto.randomUUID();
             
             // 3️⃣ Si tenim preset, fem servir el seu EMOJI
             // Si no, usem el que digui la IA o el default '🥘'
             const finalEmoji = preset ? preset.emoji : (i.emoji || '🥘');

             // Log de depuració per consola
             if (preset) {
                 console.log(`   ✨ Matched: "${i.name}" -> [${preset.id}] ${finalEmoji}`);
             } else {
                 console.log(`   ⚠️ No Match: "${i.name}" -> [UUID] ${finalEmoji}`);
             }

             return {
               name: i.name,
               quantity: Number(i.quantity) || 1,
               unit: i.unit || 'ut',
               id: finalId,      // 👈 AQUEST ÉS EL CANVI CRÍTIC
               emoji: finalEmoji // 👈 I AQUEST
             };
           }),
           
           steps: dto.steps,
           tags: dto.tags || [],
           dietaryTags: (dto.dietary_tags || []).map(t => t.toLowerCase()),
           createdAt: new Date(),
           likesCount: 0,
           isPublic: true, 
           ratingSummary: { average: 0, count: 0, distribution: {} }
        });
        
        // Filtratge de seguretat (al·lèrgies)
        if (!recipe.isSafeFor(ctx.restrictions)) return null;
        
        return recipe;
    } catch (e) {
        console.error("Mapping Error:", e);
        return null;
    }
  }
}