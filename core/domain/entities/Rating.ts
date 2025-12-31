// src/core/domain/entities/Rating.ts
export interface RatingProps {
  userId: string;
  value: number; // 1-5
  comment?: string;
  createdAt: Date;
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
    if (props.comment && props.comment.length > 500) {
      throw new Error("El comentari no pot superar els 500 caràcters.");
    }
  }

  get value() { return this.props.value; }
  get userId() { return this.props.userId; }
  get comment() { return this.props.comment; }
}