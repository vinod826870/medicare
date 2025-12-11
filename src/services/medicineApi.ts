// Medicine API Service - Fetches medicine data from OpenFDA API
// Uses free, public FDA drug database for real medicine information

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
}

export interface MedicineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// OpenFDA API Configuration
const FDA_API_BASE = 'https://api.fda.gov/drug';
const DEFAULT_MEDICINE_IMAGE = 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg';

// Cache for API responses
let medicineCache: MedicineApiData[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate price based on medicine name (for demo purposes)
const generatePrice = (name: string): number => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5 + (hash % 50); // Price between $5 and $55
};

// Helper function to determine if prescription is required
const isPrescriptionRequired = (route?: string[], productType?: string[]): boolean => {
  if (!route && !productType) return false;
  const routeStr = route?.join(' ').toLowerCase() || '';
  const typeStr = productType?.join(' ').toLowerCase() || '';
  return routeStr.includes('injection') || typeStr.includes('prescription');
};

// Helper function to categorize medicine
const categorizeMedicine = (route?: string[], productType?: string[]): string => {
  const routeStr = route?.join(' ').toLowerCase() || '';
  const typeStr = productType?.join(' ').toLowerCase() || '';
  
  if (routeStr.includes('injection') || typeStr.includes('prescription')) return 'prescription';
  if (routeStr.includes('topical') || routeStr.includes('cutaneous')) return 'personal_care';
  if (typeStr.includes('supplement') || typeStr.includes('vitamin')) return 'supplements';
  return 'otc';
};

// Helper function to try to get medicine image from DailyMed
const getMedicineImage = async (brandName: string, setId?: string): Promise<string> => {
  try {
    // Try to get image from DailyMed API if setId is available
    if (setId) {
      const dailyMedUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setId}/media.json`;
      const response = await fetch(dailyMedUrl);
      
      if (response.ok) {
        const data = await response.json();
        // Get the first image if available
        if (data.data && data.data.length > 0) {
          const imageUrl = data.data[0].url;
          if (imageUrl) {
            return `https://dailymed.nlm.nih.gov${imageUrl}`;
          }
        }
      }
    }
  } catch (error) {
    console.log('Could not fetch image from DailyMed:', error);
  }
  
  // Return default image if no image found
  return DEFAULT_MEDICINE_IMAGE;
};

// Transform FDA API response to our format
const transformFDAResult = async (result: any, index: number): Promise<MedicineApiData> => {
  const brandName = result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || 'Unknown Medicine';
  const genericName = result.openfda?.generic_name?.[0] || '';
  const manufacturer = result.openfda?.manufacturer_name?.[0] || 'Various Manufacturers';
  const route = result.openfda?.route;
  const productType = result.openfda?.product_type;
  const setId = result.set_id;
  
  // Get description from purpose or indications_and_usage
  let description = '';
  if (result.purpose && result.purpose[0]) {
    description = result.purpose[0].substring(0, 200);
  } else if (result.indications_and_usage && result.indications_and_usage[0]) {
    description = result.indications_and_usage[0].substring(0, 200);
  } else if (genericName) {
    description = `${genericName} - Pharmaceutical product`;
  } else {
    description = 'Pharmaceutical product for medical use';
  }
  
  // Clean up description (remove excessive whitespace and newlines)
  description = description.replace(/\s+/g, ' ').trim();
  
  const dosage = result.dosage_and_administration?.[0]?.substring(0, 100) || 
                 route?.join(', ') || 
                 'Consult healthcare provider';

  // Try to get actual medicine image
  const imageUrl = await getMedicineImage(brandName, setId);

  return {
    id: `fda-${result.id || index}`,
    name: brandName,
    description,
    category: categorizeMedicine(route, productType),
    price: generatePrice(brandName),
    manufacturer,
    dosage,
    prescription_required: isPrescriptionRequired(route, productType),
    image_url: imageUrl,
    stock_available: true,
    rating: 4.0 + Math.random(),
    reviews_count: Math.floor(Math.random() * 500) + 50
  };
};

// Fetch medicines from OpenFDA API
const fetchFromFDA = async (searchTerm?: string, limit: number = 50): Promise<MedicineApiData[]> => {
  try {
    let url = `${FDA_API_BASE}/label.json?limit=${limit}`;
    
    if (searchTerm) {
      // Search in brand name or generic name
      const encodedSearch = encodeURIComponent(searchTerm);
      url += `&search=openfda.brand_name:"${encodedSearch}"+openfda.generic_name:"${encodedSearch}"`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FDA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    // Transform results with image fetching (process in parallel but limit to avoid rate limiting)
    const transformedResults = await Promise.all(
      data.results.slice(0, 20).map((result: any, index: number) => transformFDAResult(result, index))
    );
    
    return transformedResults;
  } catch (error) {
    console.error('Error fetching from FDA API:', error);
    return [];
  }
};

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
    description: 'Health and hygiene products',
    icon: '🧴'
  },
  {
    id: 'medical_devices',
    name: 'Medical Devices',
    description: 'Healthcare equipment and supplies',
    icon: '🩺'
  }
];

export interface MedicineFilters {
  category?: string;
  search?: string;
  prescriptionRequired?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const medicineApiService = {
  /**
   * Get all medicines with optional filters
   */
  async getMedicines(filters?: MedicineFilters): Promise<MedicineApiData[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (medicineCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION && !filters?.search) {
        let results = medicineCache;
        
        // Apply filters
        if (filters) {
          if (filters.category && filters.category !== 'all') {
            results = results.filter(m => m.category === filters.category);
          }
          if (filters.prescriptionRequired !== undefined) {
            results = results.filter(m => m.prescription_required === filters.prescriptionRequired);
          }
          if (filters.minPrice !== undefined) {
            results = results.filter(m => m.price >= filters.minPrice!);
          }
          if (filters.maxPrice !== undefined) {
            results = results.filter(m => m.price <= filters.maxPrice!);
          }
        }
        
        return results;
      }
      
      // Fetch from FDA API
      const medicines = await fetchFromFDA(filters?.search, 100);
      
      // Update cache only if no search term
      if (!filters?.search) {
        medicineCache = medicines;
        cacheTimestamp = now;
      }
      
      let results = medicines;
      
      // Apply filters
      if (filters) {
        if (filters.category && filters.category !== 'all') {
          results = results.filter(m => m.category === filters.category);
        }
        if (filters.prescriptionRequired !== undefined) {
          results = results.filter(m => m.prescription_required === filters.prescriptionRequired);
        }
        if (filters.minPrice !== undefined) {
          results = results.filter(m => m.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(m => m.price <= filters.maxPrice!);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in getMedicines:', error);
      return [];
    }
  },

  /**
   * Get a single medicine by ID
   */
  async getMedicineById(id: string): Promise<MedicineApiData | null> {
    try {
      // Check cache first
      if (medicineCache.length > 0) {
        const cached = medicineCache.find(m => m.id === id);
        if (cached) return cached;
      }
      
      // If not in cache, fetch all medicines
      const medicines = await this.getMedicines();
      return medicines.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error in getMedicineById:', error);
      return null;
    }
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<MedicineCategory[]> {
    return CATEGORIES;
  },

  /**
   * Search medicines by name
   */
  async searchMedicines(query: string): Promise<MedicineApiData[]> {
    if (!query || query.trim().length < 2) {
      return this.getMedicines();
    }
    
    return this.getMedicines({ search: query.trim() });
  },

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    medicineCache = [];
    cacheTimestamp = 0;
  }
};
