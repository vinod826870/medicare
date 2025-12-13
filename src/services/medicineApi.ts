// Medicine API Service - Real API Integration via Supabase Edge Function
// Fetches REAL medicine data from RxNorm API and REAL images from RxImage API (NIH)
// Falls back to local data if Edge Function is not available

import { supabase } from '@/db/supabase';
import { LOCAL_MEDICINES, searchLocalMedicines, getLocalMedicineById } from './localMedicineData';

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

// Flag to track if Edge Function is available
let useLocalData = false;

// Helper function to call Edge Function
async function callEdgeFunction(action: string, params: Record<string, string> = {}): Promise<any> {
  try {
    const queryParams = new URLSearchParams({ action, ...params });
    
    // Call the edge function with query parameters using fetch
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-medicines?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function error:', errorText);
      throw new Error(`Failed to fetch from Edge Function: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  } catch (error) {
    console.error('Error calling Edge Function:', error);
    console.log('🔄 Falling back to local data...');
    useLocalData = true;
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
        console.log('✅ Using cached results for:', cacheKey);
        results = medicineCache.get(cacheKey) || [];
      } else if (useLocalData) {
        // Use local data if Edge Function failed before
        console.log('📦 Using local data (Edge Function unavailable)');
        results = filters?.search ? searchLocalMedicines(filters.search) : LOCAL_MEDICINES;
      } else {
        console.log('🌐 Fetching from Edge Function for:', cacheKey);
        try {
          // Try to fetch from Edge Function
          if (filters?.search) {
            results = await callEdgeFunction('search', { search: filters.search });
          } else {
            results = await callEdgeFunction('popular');
          }
          
          console.log('✅ Edge Function returned', results.length, 'medicines');
          
          // Cache results
          medicineCache.set(cacheKey, results);
          cacheTimestamp = now;
        } catch (error) {
          // Fall back to local data
          console.log('📦 Using local data as fallback');
          results = filters?.search ? searchLocalMedicines(filters.search) : LOCAL_MEDICINES;
        }
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
      // Return local data as final fallback
      return LOCAL_MEDICINES;
    }
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineApiData | null> => {
    try {
      if (useLocalData) {
        return getLocalMedicineById(id);
      }
      
      // Extract RxCUI from ID (format: rx-{rxcui})
      const rxcui = id.replace('rx-', '').replace('local-', '');
      
      try {
        const result = await callEdgeFunction('getById', { rxcui });
        return result;
      } catch (error) {
        // Fall back to local data
        return getLocalMedicineById(id);
      }
    } catch (error) {
      console.error('Error getting medicine by ID:', error);
      return getLocalMedicineById(id);
    }
  },

  // Get all categories
  getCategories: async (): Promise<MedicineCategory[]> => {
    return CATEGORIES;
  },

  // Search medicines
  searchMedicines: async (query: string): Promise<MedicineApiData[]> => {
    try {
      if (useLocalData) {
        return searchLocalMedicines(query);
      }
      
      if (!query) {
        try {
          return await callEdgeFunction('popular');
        } catch (error) {
          return LOCAL_MEDICINES;
        }
      }
      
      try {
        return await callEdgeFunction('search', { search: query });
      } catch (error) {
        return searchLocalMedicines(query);
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      return searchLocalMedicines(query);
    }
  }
};
