// src/lib/food-presets/drinks.ts
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { FoodPreset, DAYS } from "./types";

export const DRINK_PRESETS: FoodPreset[] = [
    // 🥤 BEGUDA
    { id: 'b1', emoji: '💧', name: 'Aigua', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: DAYS.LONG_PANTRY },
    { id: 'b2', emoji: '☕', name: 'Cafè mòlt', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: 180 },
    { id: 'b3', emoji: '🍵', name: 'Te', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: 365 },
    { id: 'b4', emoji: '🥤', name: 'Refresc cola', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },

    // Begudes fredes
    { id: 'b5', emoji: '🥤', name: 'Refresc taronja', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
    { id: 'b6', emoji: '🥤', name: 'Refresc llimona', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
    { id: 'b7', emoji: '🧃', name: 'Suc de taronja', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b8', emoji: '🧃', name: 'Suc de poma', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },

    // Begudes calentes
    { id: 'b9', emoji: '☕', name: 'Cafè en gra', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 250, expirationDays: 180 },
    { id: 'b10', emoji: '☕', name: 'Cafè soluble', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 200, expirationDays: 365 },
    { id: 'b11', emoji: '🍵', name: 'Infusions', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.PANTRY, step: 20, expirationDays: 365 },

    // Altres
    { id: 'b12', emoji: '🥛', name: 'Beguda vegetal de civada', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b13', emoji: '🥛', name: 'Beguda vegetal d’ametlla', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b14', emoji: '🍺', name: 'Cervesa', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
    { id: 'b15', emoji: '🍷', name: 'Vi', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.75, expirationDays: 365 },

    { id: 'b16', emoji: '🥂', name: 'Vi blanc', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 0.75, expirationDays: 365 },
    { id: 'b17', emoji: '🍾', name: 'Cava', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 0.75, expirationDays: 365 },
    { id: 'b18', emoji: '🥃', name: 'Vermut', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 1, expirationDays: 365 },
    { id: 'b19', emoji: '🥤', name: 'Tònica', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },
    // 🧃 Més sucs
    { id: 'b20', emoji: '🧃', name: 'Suc de pinya', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b21', emoji: '🧃', name: 'Suc de préssec', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b22', emoji: '🧃', name: 'Suc multifruites', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },

    // ⚡ Begudes energètiques / esportives
    { id: 'b23', emoji: '⚡', name: 'Beguda energètica', category: '🥤 Beguda', defaultUnit: 'ut', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 365 },
    { id: 'b24', emoji: '🥤', name: 'Beguda isotònica', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 180 },

    // 🌱 Begudes vegetals (més)
    { id: 'b25', emoji: '🥛', name: 'Beguda vegetal de soja', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b26', emoji: '🥛', name: 'Beguda vegetal d’arròs', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },
    { id: 'b27', emoji: '🥛', name: 'Beguda vegetal de coco', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 7 },

    // 🍷 Alcohols habituals
    { id: 'b28', emoji: '🍷', name: 'Vi negre', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.75, expirationDays: 365 },
    { id: 'b29', emoji: '🥃', name: 'Ginebra', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.7, expirationDays: DAYS.LONG_PANTRY },
    { id: 'b30', emoji: '🥃', name: 'Rom', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.7, expirationDays: DAYS.LONG_PANTRY },
    { id: 'b31', emoji: '🥃', name: 'Vodka', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.7, expirationDays: DAYS.LONG_PANTRY },

    // 🍹 Altres
    { id: 'b32', emoji: '🍹', name: 'Sangria', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 5 },
    { id: 'b33', emoji: '🍶', name: 'Sake', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.PANTRY, step: 0.75, expirationDays: 365 },
    { id: 'b34', emoji: '🫖', name: 'Te matcha', category: '🥤 Beguda', defaultUnit: 'g', defaultLoc: StorageLocation.PANTRY, step: 50, expirationDays: 180 },
    { id: 'b35', emoji: '🍵', name: 'Kombutxa', category: '🥤 Beguda', defaultUnit: 'l', defaultLoc: StorageLocation.FRIDGE, step: 1, expirationDays: 14 },

];