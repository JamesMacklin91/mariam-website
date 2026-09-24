export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: 'Perfumes' | 'Supplements' | 'Skincare' | 'Wellness';
  priceTZS: number;
  inStock: boolean;
  stock?: number;
  imageUrl?:string;
  highlights: string[];
}