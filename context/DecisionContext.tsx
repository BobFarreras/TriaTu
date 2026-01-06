'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'; // ✅ Importem useCallback
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { generateRecipeFromDecisionAction } from '@/app/actions/decision-cooking'; 
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toast } from 'sonner';

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

// Interfícies per evitar 'any'
interface RawRatingSummary {
    average?: number;
    count?: number;
    distribution?: Record<string, number>;
}

interface RawIngredient {
    name?: string;
    quantity?: number;
    unit?: string;
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
    ratingSummary?: RawRatingSummary;
    dietaryTags?: string[];
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

    // ✅ CORRECCIÓ 1: useCallback per a funcions que actualitzen l'estat
    const setEnergy = useCallback((v: number) => {
        setState(prev => ({ ...prev, energy: v }));
    }, []);

    const setTime = useCallback((v: number) => {
        setState(prev => ({ ...prev, time: v }));
    }, []);

    // ✅ CORRECCIÓ 2: setMode protegit per evitar re-renders innecessaris
    const setMode = useCallback((mode: 'FATE' | 'CHEF') => {
        setState(prev => {
            if (prev.mode === mode) return prev; // Si ja és el mateix, no fem res
            return { ...prev, mode };
        });
    }, []);

    // Funció auxiliar (no cal exportar-la, així que no cal useCallback si només s'usa dins de generateMenu)
    const sanitizeRecipeProps = (input: unknown): RecipeProps => {
        const props = input as RawRecipeInput;

        return {
            id: props.id || '',
            authorId: props.authorId || '',
            name: props.name || 'Recepta sense nom',
            
            prepTimeMinutes: props.prepTimeMinutes || 0,
            likesCount: props.likesCount || 0,
            isPublic: !!props.isPublic,
            
            createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
            
            ratingSummary: { 
                average: props.ratingSummary?.average || 0, 
                count: props.ratingSummary?.count || 0, 
                distribution: props.ratingSummary?.distribution || {} 
            },

            dietaryTags: props.dietaryTags || [],
            
            ingredients: (Array.isArray(props.ingredients) ? props.ingredients : []).map((ing) => ({
                name: ing.name || "Ingredient",
                unit: ing.unit || "ut",
                quantity: (!ing.quantity || ing.quantity <= 0) ? 1 : ing.quantity
            })),

            steps: Array.isArray(props.steps) ? props.steps as string[] : [],
            tags: Array.isArray(props.tags) ? props.tags as string[] : [],
        };
    };

    // ✅ CORRECCIÓ 3: useCallback per a generateMenu
    const generateMenu = useCallback(async (userId: string, dishName: string = '') => {
        setState(prev => ({ ...prev, isPending: true, error: null, recipes: [] }));

        try {
            const result = await generateRecipeFromDecisionAction(userId, dishName, locale);

            if (result.success && result.recipes) {
                const recipeInstances = result.recipes.map(props => {
                    try {
                        const cleanProps = sanitizeRecipeProps(props);
                        return new Recipe(cleanProps);
                    } catch (e) {
                        console.error("⚠️ Error creant recepta (saltant-la):", e);
                        return null;
                    }
                }).filter((r): r is Recipe => r !== null);

                setState(prev => ({
                    ...prev,
                    isPending: false,
                    recipes: recipeInstances
                }));

                if (recipeInstances.length > 0) {
                    toast.success(`👨‍🍳 Menú llest: ${recipeInstances.length} propostes!`);
                } else {
                    throw new Error("No s'han pogut validar les receptes.");
                }
            } else {
                throw new Error(result.error || "Error desconegut");
            }
        } catch (err) {
            console.error(err);
            setState(prev => ({ ...prev, isPending: false, error: "No s'ha pogut generar el menú." }));
            toast.error("Error al forn.");
        }
    }, [locale]); // Dependència: locale (si l'idioma canvia, la funció canvia)

    // ✅ CORRECCIÓ 4: useCallback per a reset
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