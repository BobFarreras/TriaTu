// src/core/domain/entities/Player.ts

export interface Player {
  id: string;
  username: string;      // Nom visible de l'usuari (ex: 'CoolChef99')
  avatarUrl?: string;    // URL de la imatge (opcional)
  score: number;         // Puntuació total calculada (punts d'experiència/karma)
  wins: number;          // Nombre de partides guanyades
  rank?: number;         // Posició al rànquing (1, 2, 3...) - Opcional perquè es pot calcular per índex
}