'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

// ✅ 1. Definim la forma del rating per evitar 'any'
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

// ✅ 2. Actualitzem RawRecipeInput sense 'any'
interface RawRecipeInput {
    id?: string;
    authorId?: string;
    name?: string;
    ingredients?: RawIngredient[];
    steps?: unknown; // 'unknown' és més segur que 'object' o 'any' quan no sabem segur si és array o string
    tags?: unknown;
    prepTimeMinutes?: number;
    likesCount?: number;
    isPublic?: boolean;
    createdAt?: string | Date;
    ratingSummary?: RawRatingSummary; // ✅ TIPAT CORRECTAMENT
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

    const setEnergy = (v: number) => setState(prev => ({ ...prev, energy: v }));
    const setTime = (v: number) => setState(prev => ({ ...prev, time: v }));
    const setMode = (mode: 'FATE' | 'CHEF') => setState(prev => ({ ...prev, mode }));

    // ✅ 3. Funció de neteja ajustada amb tipus segurs
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
            
            // ✅ Gestió segura del Rating
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

            // Comprovacions de tipus per steps i tags
            steps: Array.isArray(props.steps) ? props.steps as string[] : [],
            tags: Array.isArray(props.tags) ? props.tags as string[] : [],
        };
    };

    const generateMenu = async (userId: string, dishName: string = '') => {
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
    };

    const reset = () => setState(prev => ({ ...prev, recipes: [], error: null, isPending: false }));

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