// src/core/domain/entities/Product.ts

export interface ProductProps {
  id: string; // El nostre UUID intern
  externalId: string; // L'ID de Bonpreu
  name: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  source: string; // 'BONPREU' | 'MERCADONA'
  tags: string[];
  emoji: string;
  lastUpdated: Date;
  quantityAmount?: number;
  quantityUnit?: string;
}

export class Product {
  public readonly props: ProductProps;

  constructor(props: ProductProps) {
    this.props = props;
    this.validate();
  }

  private validate() {
    if (this.props.price < 0) {
      throw new Error("El preu no pot ser negatiu");
    }
    if (!this.props.name) {
      throw new Error("El producte ha de tenir nom");
    }
  }

  // Getters per comoditat
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get price() { return this.props.price; }
  
  // Mètode de negoci: Actualitzar preu
  public updatePrice(newPrice: number) {
    if (newPrice !== this.props.price) {
        this.props.price = newPrice;
        this.props.lastUpdated = new Date();
    }
  }
}