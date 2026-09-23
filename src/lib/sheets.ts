import Papa from 'papaparse';
import { ProductItem } from './types';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4X9nGkNnL_tuu8GlCIlARMJzPhXBcIJGP8lvqEtXEzBs1Q84C0vmtSpf6g2EtQo2NNxNNvr4RbUYZ/pub?gid=0&single=true&output=csv';

export async function fetchProductsFromSheet(): Promise<ProductItem[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product data from Google Sheets');
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products: ProductItem[] = results.data.map((row: any) => {
            const qty = parseInt(row.quantity || '0', 10);
            return {
              id: row.id || row.name?.toLowerCase().replace(/\s+/g, '-'),
              name: row.name || 'Unnamed Product',
              description: row.description || '',
              category: row.category || 'Wellness',
              priceTZS: parseFloat((row.price || '0').replace(/,/g, '')),
              inStock: qty > 0,
              imageUrl: row.image_url?.trim() || undefined, // <--- Map image_url column
              highlights: [
                `In Stock: ${qty} available`,
                '100% Authentic Import',
              ],
            };
          });

          resolve(products.filter((p) => p.name && p.priceTZS > 0));
        },
      });
    });
  } catch (error) {
    console.error('Error fetching Google Sheet catalog:', error);
    return [];
  }
}