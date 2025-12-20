// Medicine API Service - Supabase Table Integration
// Connects to medicine_data table with 253,973 records
// Falls back to local data if database is not available

import { 
  getMedicines as getSupabaseMedicines,
  getMedicineById as getSupabaseMedicineById,
  searchMedicines as searchSupabaseMedicines,
  getFeaturedMedicines,
  getMedicineTypes,
  formatMedicineForDisplay
} from '@/db/medicineDataApi';
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
  composition?: string;
  sideEffects?: string;
  interactions?: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Flag to track if Supabase is available
let useLocalData = false;

// Cache for categories
let categoriesCache: MedicineCategory[] | null = null;

// Medicine API Service
export const medicineApiService = {
  // Get all medicines with optional filters
  getMedicines: async (filters?: {
    category?: string;
    search?: string;
    prescriptionRequired?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: MedicineApiData[]; count: number; hasMore: boolean }> => {
    try {
      if (useLocalData) {
        console.log('📦 Using local data (Supabase unavailable)');
        const filtered = filters?.search 
          ? searchLocalMedicines(filters.search) 
          : LOCAL_MEDICINES;
        return {
          data: filtered,
          count: filtered.length,
          hasMore: false
        };
      }

      console.log('🌐 Fetching from Supabase medicine_data table...');
      
      try {
        const result = await getSupabaseMedicines({
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 20,
          search: filters?.search || '',
          type: filters?.category && filters.category !== 'all' ? filters.category : '',
          excludeDiscontinued: true
        });

        console.log(`✅ Supabase returned ${result.data.length} medicines (Total: ${result.count})`);

        // Format medicines for display
        const formattedData = result.data.map(medicine => {
          const formatted = formatMedicineForDisplay(medicine);
          return {
            ...formatted,
            rating: 4.0 + Math.random(),
            reviews_count: Math.floor(Math.random() * 500) + 50
          };
        });

        // Apply prescription filter if needed
        const filteredData = filters?.prescriptionRequired !== undefined
          ? formattedData.filter(med => med.prescription_required === filters.prescriptionRequired)
          : formattedData;

        return {
          data: filteredData,
          count: result.count,
          hasMore: result.hasMore
        };
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        console.log('📦 Falling back to local data...');
        useLocalData = true;
        
        const filtered = filters?.search 
          ? searchLocalMedicines(filters.search) 
          : LOCAL_MEDICINES;
        return {
          data: filtered,
          count: filtered.length,
          hasMore: false
        };
      }
    } catch (error) {
      console.error('Error getting medicines:', error);
      return {
        data: LOCAL_MEDICINES,
        count: LOCAL_MEDICINES.length,
        hasMore: false
      };
    }
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineApiData | null> => {
    try {
      if (useLocalData) {
        return getLocalMedicineById(id);
      }

      try {
        const numericId = parseInt(id.replace('local-', ''));
        if (isNaN(numericId)) {
          return getLocalMedicineById(id);
        }

        const medicine = await getSupabaseMedicineById(numericId);
        
        if (!medicine) {
          return getLocalMedicineById(id);
        }

        const formatted = formatMedicineForDisplay(medicine);
        return {
          ...formatted,
          rating: 4.0 + Math.random(),
          reviews_count: Math.floor(Math.random() * 500) + 50
        };
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        return getLocalMedicineById(id);
      }
    } catch (error) {
      console.error('Error getting medicine by ID:', error);
      return getLocalMedicineById(id);
    }
  },

  // Get all categories
  getCategories: async (): Promise<MedicineCategory[]> => {
    try {
      // Return cached categories if available
      if (categoriesCache) {
        return categoriesCache;
      }

      if (useLocalData) {
        const defaultCategories: MedicineCategory[] = [
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
        categoriesCache = defaultCategories;
        return defaultCategories;
      }

      try {
        const types = await getMedicineTypes();
        
        if (types.length === 0) {
          const defaultCategories: MedicineCategory[] = [
            {
              id: 'all',
              name: 'All Medicines',
              description: 'Browse all available medicines',
              icon: '💊'
            }
          ];
          categoriesCache = defaultCategories;
          return defaultCategories;
        }

        // Convert types to categories
        const categories: MedicineCategory[] = [
          {
            id: 'all',
            name: 'All Medicines',
            description: 'Browse all available medicines',
            icon: '💊'
          },
          ...types.slice(0, 10).map(type => ({
            id: type,
            name: type.charAt(0).toUpperCase() + type.slice(1),
            description: `${type} medicines`,
            icon: '🏥'
          }))
        ];

        categoriesCache = categories;
        return categories;
      } catch (error) {
        console.error('Error fetching categories from Supabase:', error);
        useLocalData = true;
        
        const defaultCategories: MedicineCategory[] = [
          {
            id: 'all',
            name: 'All Medicines',
            description: 'Browse all available medicines',
            icon: '💊'
          }
        ];
        categoriesCache = defaultCategories;
        return defaultCategories;
      }
    } catch (error) {
      console.error('Error getting categories:', error);
      return [
        {
          id: 'all',
          name: 'All Medicines',
          description: 'Browse all available medicines',
          icon: '💊'
        }
      ];
    }
  },

  // Search medicines
  searchMedicines: async (query: string, limit?: number): Promise<MedicineApiData[]> => {
    try {
      console.log('🔎 medicineApiService.searchMedicines called with:', { query, limit, useLocalData });
      
      if (useLocalData) {
        console.log('📦 Using local data for search');
        return searchLocalMedicines(query);
      }

      if (!query) {
        console.log('⚠️ Empty query, returning featured medicines');
        try {
          const featured = await getFeaturedMedicines(limit || 20);
          return featured.map(medicine => {
            const formatted = formatMedicineForDisplay(medicine);
            return {
              ...formatted,
              rating: 4.0 + Math.random(),
              reviews_count: Math.floor(Math.random() * 500) + 50
            };
          });
        } catch (error) {
          console.error('Error getting featured medicines:', error);
          // Return empty array on error - do not fall back to local data
          return [];
        }
      }

      try {
        console.log('🌐 Calling Supabase searchSupabaseMedicines...');
        const results = await searchSupabaseMedicines(query, limit || 20);
        console.log(`✅ Supabase returned ${results.length} results`);
        
        // Return empty array if no results - do not fall back to local data
        if (results.length === 0) {
          console.log('ℹ️ No results from Supabase for query:', query);
          return [];
        }
        
        return results.map(medicine => {
          const formatted = formatMedicineForDisplay(medicine);
          return {
            ...formatted,
            rating: 4.0 + Math.random(),
            reviews_count: Math.floor(Math.random() * 500) + 50
          };
        });
      } catch (error) {
        console.error('❌ Error searching Supabase:', error);
        // Return empty array on error - do not fall back to local data
        return [];
      }
    } catch (error) {
      console.error('❌ Error in searchMedicines:', error);
      // Return empty array on error - do not fall back to local data
      return [];
    }
  },

  // Get featured medicines
  getFeaturedMedicines: async (limit: number = 8): Promise<MedicineApiData[]> => {
    try {
      if (useLocalData) {
        return LOCAL_MEDICINES.slice(0, limit);
      }

      try {
        const featured = await getFeaturedMedicines(limit);
        return featured.map(medicine => {
          const formatted = formatMedicineForDisplay(medicine);
          return {
            ...formatted,
            rating: 4.0 + Math.random(),
            reviews_count: Math.floor(Math.random() * 500) + 50
          };
        });
      } catch (error) {
        console.error('Error fetching featured medicines:', error);
        return LOCAL_MEDICINES.slice(0, limit);
      }
    } catch (error) {
      console.error('Error in getFeaturedMedicines:', error);
      return LOCAL_MEDICINES.slice(0, limit);
    }
  }
};
