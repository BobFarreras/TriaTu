'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { generateMenuAction } from '@/app/actions/recipe-actions';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toast } from 'sonner';

// --- DEFINITIVE INTERFACES ---

interface DecisionState {
    isPending: boolean;
    recipes: Recipe[];
    mode: 'FATE' | 'CHEF';
    error: string | null;
    energy: number;
    time: number;
}

interface DecisionContextType extends DecisionState {
    setMode: (mode: 'FATE' | 'CHEF') => void;
    setEnergy: (v: number) => void;
    setTime: (v: number) => void;
    generateMenu: (userId: string, dishName?: string) => Promise<void>;
    reset: () => void;
    hasActiveResult: boolean;
}

// Interface matching Server Action output
interface RawIngredient {
    id?: string;
    name?: string;
    quantity?: number;
    unit?: string;
    emoji?: string;
    linkedProductId?: string | null;
    linkedProductImage?: string | null; // ✅ Vital field
    estimatedCost?: number;
}

interface RawRecipeInput {
    id?: string;
    authorId?: string;
    name?: string;
    ingredients?: RawIngredient[];
    steps?: unknown;
    tags?: unknown;
    prepTimeMinutes?: number;
    likesCount?: number;
    isPublic?: boolean;
    createdAt?: string | Date;
    ratingSummary?: {
        average?: number;
        count?: number;
        distribution?: Record<string, number>;
    };
    dietaryTags?: string[];
    estimatedCost?: number;
    isAiGenerated?: boolean;
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export function DecisionProvider({ children }: { children: ReactNode }) {
    const { locale } = useLanguage();

    const [state, setState] = useState<DecisionState>({
        isPending: false,
        recipes: [],
        mode: 'FATE',
        error: null,
        energy: 50,
        time: 30
    });

    const setEnergy = useCallback((v: number) => {
        setState(prev => ({ ...prev, energy: v }));
    }, []);

    const setTime = useCallback((v: number) => {
        setState(prev => ({ ...prev, time: v }));
    }, []);

    const setMode = useCallback((mode: 'FATE' | 'CHEF') => {
        console.log("🎛️ [DecisionContext] Mode change:", mode);
        setState(prev => {
            if (prev.mode === mode) return prev;
            return { ...prev, mode };
        });
    }, []);

    // Function to clean and validate raw data from server
    const sanitizeRecipeProps = (input: unknown): RecipeProps => {
        const props = input as RawRecipeInput;

        return {
            id: props.id || crypto.randomUUID(),
            authorId: props.authorId || 'unknown',
            name: props.name || 'Recipe without name',
            prepTimeMinutes: props.prepTimeMinutes || 0,
            likesCount: props.likesCount || 0,
            isPublic: !!props.isPublic,
            createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
            estimatedCost: props.estimatedCost || 0,
            isAiGenerated: props.isAiGenerated,
            
            ratingSummary: {
                average: props.ratingSummary?.average || 0,
                count: props.ratingSummary?.count || 0,
                distribution: props.ratingSummary?.distribution || {}
            },
            
            dietaryTags: props.dietaryTags || [],
            
            // ✅ CRITICAL FIX: Mapping Ingredients correctly
            ingredients: (Array.isArray(props.ingredients) ? props.ingredients : []).map((ing: RawIngredient) => ({
                id: ing.id || crypto.randomUUID(), 
                name: ing.name || "Ingredient",
                unit: ing.unit || "ut",
                quantity: (!ing.quantity || ing.quantity <= 0) ? 1 : ing.quantity,
                emoji: ing.emoji,
                
                // 🛑 THIS WAS THE BUG: Passing the image through
                linkedProductId: ing.linkedProductId || null,
                linkedProductImage: ing.linkedProductImage || null, // <--- HERE
                
                estimatedCost: ing.estimatedCost || 0
            })),
            
            steps: Array.isArray(props.steps) ? props.steps as string[] : [],
            tags: Array.isArray(props.tags) ? props.tags as string[] : [],
        };
    };

    const generateMenu = useCallback(async (userId: string, dishName: string = '') => {
        const currentMode = state.mode;
        
        console.log(`🚀 [DecisionContext] Starting generation. Mode: ${currentMode}`);
        
        setState(prev => ({ ...prev, isPending: true, error: null, recipes: [] }));

        try {
            const result = await generateMenuAction(
                userId,
                dishName,
                currentMode,
                state.energy,
                state.time,
                locale
            );

            if (result.success && result.recipes) {
                console.log(`✅ [DecisionContext] Received ${result.recipes.length} raw recipes.`);

                const recipeInstances = result.recipes
                    .map((props: unknown) => {
                        try {
                            const cleanProps = sanitizeRecipeProps(props);
                            return new Recipe(cleanProps);
                        } catch (e) {
                            console.warn("⚠️ Skipped recipe due to incorrect data:", e); 
                            return null;
                        }
                    })
                    .filter((r: Recipe | null): r is Recipe => r !== null);

                setState(prev => ({
                    ...prev,
                    isPending: false,
                    recipes: recipeInstances
                }));

                if (recipeInstances.length > 0) {
                    toast.success(`👨‍🍳 Menu ready: ${recipeInstances.length} proposals!`);
                } else {
                    throw new Error("Could not validate recipes.");
                }
            } else {
                throw new Error(result.error || "Unknown error");
            }
        } catch (err: unknown) {
            let errorMessage = "Unknown error";
            if (err instanceof Error) errorMessage = err.message;
            else if (typeof err === 'string') errorMessage = err;

            const isLimitError = errorMessage.toLowerCase().includes('limit') || 
                               errorMessage.toLowerCase().includes('límit');

            if (isLimitError) {
                console.warn("⏳ Rate Limit Hit:", errorMessage);
                toast.warning("⏳ Limit Reached", {
                    description: "You've generated too many menus. Wait a bit!",
                    duration: 5000
                });
            } else {
                console.warn("❌ Error generateMenu:", errorMessage);
                toast.error("Oven Error", { description: errorMessage });
            }

            setState(prev => ({
                ...prev,
                isPending: false,
                error: errorMessage
            }));
        }
    }, [locale, state.mode, state.energy, state.time]); 

    const reset = useCallback(() => {
        setState(prev => ({ ...prev, recipes: [], error: null, isPending: false }));
    }, []);

    return (
        <DecisionContext.Provider value={{
            ...state,
            setMode,
            setEnergy,
            setTime,
            generateMenu,
            reset,
            hasActiveResult: state.recipes.length > 0
        }}>
            {children}
        </DecisionContext.Provider>
    );
}

export function useDecision() {
    const context = useContext(DecisionContext);
    if (!context) throw new Error("useDecision must be used within DecisionProvider");
    return context;
}