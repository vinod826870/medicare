// Medicine API Service - Real API Integration via Supabase Edge Function
// Fetches REAL medicine data from RxNorm API and REAL images from RxImage API (NIH)

import { supabase } from '@/db/supabase';

export interface MedicineApiData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  manufacturer: string;
  dosage?: string;
  prescription_required: boolean;
  image_url: string;
  stock_available: boolean;
  rating?: number;
  reviews_count?: number;
  rxcui?: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Categories
const CATEGORIES: MedicineCategory[] = [
  {
    id: 'prescription',
    name: 'Prescription Medicines',
    description: 'Medications requiring doctor\'s prescription',
    icon: '💊'
  },
  {
    id: 'otc',
    name: 'Over-the-Counter (OTC)',
    description: 'Medicines available without prescription',
    icon: '🏥'
  },
  {
    id: 'supplements',
    name: 'Health Supplements',
    description: 'Vitamins and dietary supplements',
    icon: '🌿'
  },
  {
    id: 'personal_care',
    name: 'Personal Care',
    description: 'Topical medications and skincare',
    icon: '🧴'
  }
];

// Cache for API responses
let medicineCache: Map<string, MedicineApiData[]> = new Map();
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper function to call Edge Function
async function callEdgeFunction(action: string, params: Record<string, string> = {}): Promise<any> {
  try {
    const queryParams = new URLSearchParams({ action, ...params });
    const { data, error } = await supabase.functions.invoke('fetch-medicines', {
      body: {},
      method: 'GET',
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in fetch-medicines:', errorMsg);
      throw new Error(errorMsg || 'Failed to fetch medicines');
    }

    // Call the edge function with query parameters
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-medicines?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Edge Function');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  } catch (error) {
    console.error('Error calling Edge Function:', error);
    throw error;
  }
}

// Medicine API Service
export const medicineApiService = {
  // Get all medicines with optional filters
  getMedicines: async (filters?: {
    category?: string;
    search?: string;
    prescriptionRequired?: boolean;
  }): Promise<MedicineApiData[]> => {
    try {
      let results: MedicineApiData[] = [];
      
      // Check cache first
      const cacheKey = filters?.search || 'popular';
      const now = Date.now();
      
      if (medicineCache.has(cacheKey) && (now - cacheTimestamp) < CACHE_DURATION) {
        results = medicineCache.get(cacheKey) || [];
      } else {
        // Fetch from Edge Function
        if (filters?.search) {
          results = await callEdgeFunction('search', { search: filters.search });
        } else {
          results = await callEdgeFunction('popular');
        }
        
        // Cache results
        medicineCache.set(cacheKey, results);
        cacheTimestamp = now;
      }
      
      // Apply category filter
      if (filters?.category && filters.category !== 'all') {
        results = results.filter(med => med.category === filters.category);
      }
      
      // Apply prescription filter
      if (filters?.prescriptionRequired !== undefined) {
        results = results.filter(med => med.prescription_required === filters.prescriptionRequired);
      }
      
      return results;
    } catch (error) {
      console.error('Error getting medicines:', error);
      return [];
    }
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineApiData | null> => {
    try {
      // Extract RxCUI from ID (format: rx-{rxcui})
      const rxcui = id.replace('rx-', '');
      
      const result = await callEdgeFunction('getById', { rxcui });
      return result;
    } catch (error) {
      console.error('Error getting medicine by ID:', error);
      return null;
    }
  },

  // Get all categories
  getCategories: async (): Promise<MedicineCategory[]> => {
    return CATEGORIES;
  },

  // Search medicines
  searchMedicines: async (query: string): Promise<MedicineApiData[]> => {
    try {
      if (!query) {
        return await callEdgeFunction('popular');
      }
      
      return await callEdgeFunction('search', { search: query });
    } catch (error) {
      console.error('Error searching medicines:', error);
      return [];
    }
  }
};
