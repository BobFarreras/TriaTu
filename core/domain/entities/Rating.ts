// src/core/domain/entities/Rating.ts

export interface RatingProps {
  userId: string;
  value: number; // 1-5
  comment?: string;
  createdAt: Date;
  recipeId: string; // ✅ Camp obligatori
}

export class Rating {
  public readonly props: RatingProps;

  constructor(props: RatingProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: RatingProps): void {
    if (props.value < 1 || props.value > 5) {
      throw new Error("El valor de la valoració ha de ser entre 1 i 5.");
    }
    if (!props.userId) {
      throw new Error("La valoració ha de tenir un usuari associat.");
    }
    // Validem invariants de negoci
    if (!props.recipeId) {
       throw new Error("La valoració ha d'estar vinculada a una recepta.");
    }
  }

  // === GETTERS PÚBLICS ===
  get value() { return this.props.value; }
  get userId() { return this.props.userId; }
  get comment() { return this.props.comment; }
  get recipeId() { return this.props.recipeId; } // ✅ AFEGIT
  get createdAt() { return this.props.createdAt; }
}