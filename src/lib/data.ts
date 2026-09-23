import { ProductItem } from './types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'oud-royal-perfume',
    name: 'Oud Royal Eau de Parfum (100ml)',
    description: 'Long-lasting luxury Arabic fragrance with notes of warm amber, vanilla, and premium oud.',
    category: 'Perfumes',
    priceTZS: 120000,
    inStock: true,
    highlights: ['100% Authentic Import', 'Lasts 24+ Hours', 'Unisex Scent']
  },
  {
    id: 'collagen-glow-gummies',
    name: 'Advanced Collagen & Biotin Gummies',
    description: 'Daily beauty supplement formulation supporting healthy hair growth, radiant skin, and strong nails.',
    category: 'Supplements',
    priceTZS: 65000,
    inStock: true,
    highlights: ['60 Gummies per bottle', 'Halal Certified', 'Imported from UK']
  },
  {
    id: 'multivitamin-women',
    name: 'Women’s Daily Wellness Multivitamin',
    description: 'Essential daily vitamins and minerals tailored for immune support and natural daily energy.',
    category: 'Supplements',
    priceTZS: 55000,
    inStock: true,
    highlights: ['Comprehensive 30-day supply', 'Gentle on stomach', 'Immune boosting']
  }
];