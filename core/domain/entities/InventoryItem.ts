import { StorageLocation } from "./StorageLocation";

export interface InventoryItemProps {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  location: StorageLocation;
  addedAt: Date;
  
  // ✅ CORRECCIÓ: Afegim '| null' explícitament per evitar l'error TS2322
  expiryDate?: Date | null;
  productId?: string | null; // Abans era només string, ara accepta null
  roomId?: string | null;    // Abans era només string, ara accepta null
  emoji?: string | null;
  image?: string | null;
  price?: number | null;
}

// L'error híbrid per a satisfer els tests i el codi antic
export class InsufficientStockError extends Error {
  constructor(info?: string | number, missing?: number) {
    if (typeof info === 'number' && typeof missing === 'number') {
         super(`Estoc insuficient. Tens ${info}, necessites ${missing}.`);
    } else {
         super("No hi ha prou estoc per consumir aquesta quantitat");
    }
    this.name = "InsufficientStockError";
  }
}

export class InventoryItem {
  public props: InventoryItemProps;

  private constructor(props: InventoryItemProps) {
    this.props = props;
  }

  public static create(props: InventoryItemProps): InventoryItem {
    if (props.quantity <= 0) {
      throw new Error("La quantitat ha de ser positiva");
    }

    // Assegurem que les dates siguin objectes Date si existeixen
    const safeProps = {
        ...props,
        addedAt: new Date(props.addedAt),
        expiryDate: props.expiryDate ? new Date(props.expiryDate) : null
    };

    return new InventoryItem(safeProps);
  }

  // Getters (Tipats correctament per acceptar nulls)
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get quantity() { return this.props.quantity; }
  get location() { return this.props.location; }
  get userId() { return this.props.userId; }
  get roomId() { return this.props.roomId; }
  get emoji() { return this.props.emoji; }
  get unit() { return this.props.unit; }
  get expiryDate() { return this.props.expiryDate; }
  get addedAt() { return this.props.addedAt; }
  get productId() { return this.props.productId; } // Ara el getter ja no es queixarà

  // ✅ Serialització correcta
  public toPrimitives(): InventoryItemProps {
    return { ...this.props };
  }

  // ✅ Mètode consume
  public consume(amount: number): InventoryItem {
    if (amount <= 0) throw new Error("La quantitat a consumir ha de ser positiva");
    
    if (amount > this.props.quantity) {
      throw new InsufficientStockError(this.props.quantity, amount);
    }

    return new InventoryItem({
      ...this.props,
      quantity: Number((this.props.quantity - amount).toFixed(2))
    });
  }

  // ✅ Mètode updateQuantity
  public updateQuantity(newQuantity: number): InventoryItem {
      if (newQuantity < 0) throw new Error("Quantitat negativa no permesa");
      
      return new InventoryItem({
          ...this.props,
          quantity: newQuantity
      });
  }

  public isExpired(): boolean {
    if (!this.props.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(this.props.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry < today;
  }

  public isExpiringSoon(daysThreshold: number = 3): boolean {
    if (!this.props.expiryDate) return false;
    if (this.isExpired()) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thresholdDate = new Date(today);
    thresholdDate.setDate(today.getDate() + daysThreshold);
    const expiry = new Date(this.props.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry <= thresholdDate;
  }
}