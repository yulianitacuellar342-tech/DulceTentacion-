export type BaseGlaze = 'Chocolate' | 'Menta' | 'Fresa' | 'Arequipe' | 'Mora';

export type Topping = 
  | 'Chispas' 
  | 'Maní' 
  | 'Oreo' 
  | 'Coco' 
  | 'Gomitas' 
  | 'Masmelos' 
  | 'Frutas' 
  | 'Nutella' 
  | 'Almendras';

export type Sauce = 'Chocolate' | 'Arequipe' | 'Fresa' | 'Maracuyá' | 'Lechera';

export interface CustomDonutConfig {
  presentation: 'Individual' | 'Caja 6 Unidades' | 'Personalizada';
  baseGlaze: BaseGlaze;
  toppings: Topping[];
  sauce: Sauce | null;
  sprinkleDensity: number;
  message?: string;
  priceCOP: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'individual' | 'caja' | 'personalizada' | 'especial';
  priceCOP: number;
  description: string;
  image: string;
  calories?: string;
  highlight?: string;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  defaultConfig?: Partial<CustomDonutConfig>;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  presentation: string;
  baseGlaze?: BaseGlaze;
  toppings?: Topping[];
  sauce?: Sauce | null;
  unitPriceCOP: number;
  quantity: number;
  subtotalCOP: number;
  image: string;
  notes?: string;
}

export interface CustomerVerification {
  isVerified: boolean;
  fullName: string;
  phone: string;
  email: string;
  addressGualanday: string;
  idNumber: string;
  verifiedAt?: string;
  token?: string;
}

export type PaymentMethod = 'efectivo' | 'nequi' | 'pse';

export type OrderStatus = 
  | 'recibido' 
  | 'verificado' 
  | 'horneando' 
  | 'decorando' 
  | 'empaquetando' 
  | 'en_camino' 
  | 'entregado';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerVerification;
  items: CartItem[];
  subtotalCOP: number;
  deliveryFeeCOP: number;
  discountCOP: number;
  totalCOP: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pendiente' | 'aprobado' | 'contraentrega';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Materia Prima' | 'Topping' | 'Salsa' | 'Empaque' | 'Base';
  currentStock: number;
  minThreshold: number;
  unit: string;
  lastCostCOP: number;
  updatedAt: string;
}

export interface ExtractedDocumentData {
  supplierName: string;
  invoiceNumber: string;
  documentDate: string;
  totalCOP: number;
  items: Array<{
    id?: string;
    name: string;
    category: string;
    unit: string;
    quantity: number;
    unitCostCOP: number;
    suggestedPriceCOP?: number;
    stockDelta: number;
    notes?: string;
  }>;
  summaryNotes?: string;
}

export interface GitDeploymentLog {
  commitSha: string;
  branch: string;
  message: string;
  timestamp: string;
  status: 'PENDING' | 'BUILDING' | 'DEPLOYED';
  url: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  donutPurchased: string;
  date: string;
  verifiedBuyer: boolean;
  avatarUrl?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  discountCOP?: number;
  description: string;
  iconName: string;
  code: string;
}
