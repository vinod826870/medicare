// Medicine API Service - Real API Integration
// Uses RxNorm API (NIH) for medicine data and RxImage API for actual drug images

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

// API Configuration
const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';
const RXIMAGE_API_BASE = 'https://rximage.nlm.nih.gov/api';
const DEFAULT_MEDICINE_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80';

// Cache for API responses
let medicineCache: MedicineApiData[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

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

// Helper function to generate price based on medicine name
const generatePrice = (name: string): number => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5 + (hash % 50);
};

// Helper function to categorize medicine
const categorizeMedicine = (name: string, tty?: string): string => {
  const nameLower = name.toLowerCase();
  
  // Check for supplements/vitamins
  if (nameLower.includes('vitamin') || nameLower.includes('supplement') || 
      nameLower.includes('calcium') || nameLower.includes('omega')) {
    return 'supplements';
  }
  
  // Check for topical/personal care
  if (nameLower.includes('cream') || nameLower.includes('ointment') || 
      nameLower.includes('gel') || nameLower.includes('lotion') ||
      nameLower.includes('drops')) {
    return 'personal_care';
  }
  
  // Check term type for prescription
  if (tty === 'SBD' || tty === 'SBDC' || tty === 'SBDF' || tty === 'SBDG') {
    return 'prescription';
  }
  
  return 'otc';
};

// Helper function to determine if prescription is required
const isPrescriptionRequired = (category: string): boolean => {
  return category === 'prescription';
};

// Get medicine image from RxImage API
const getMedicineImage = async (rxcui: string, name: string): Promise<string> => {
  try {
    // Try to get image from RxImage API
    const response = await fetch(`${RXIMAGE_API_BASE}/rximage/1/rxnav?resolution=600&rxcui=${rxcui}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Check if images are available
      if (data.nlmRxImages && data.nlmRxImages.length > 0) {
        const imageUrl = data.nlmRxImages[0].imageUrl;
        if (imageUrl) {
          return imageUrl;
        }
      }
    }
  } catch (error) {
    console.log('Could not fetch image from RxImage API:', error);
  }
  
  // Return default image if no image found
  return DEFAULT_MEDICINE_IMAGE;
};

// Get medicine details from RxNorm API
const getMedicineDetails = async (rxcui: string): Promise<any> => {
  try {
    const response = await fetch(`${RXNORM_API_BASE}/rxcui/${rxcui}/properties.json`);
    
    if (response.ok) {
      const data = await response.json();
      return data.properties;
    }
  } catch (error) {
    console.log('Could not fetch medicine details:', error);
  }
  
  return null;
};

// Search medicines using RxNorm API
const searchMedicinesFromAPI = async (searchTerm: string): Promise<MedicineApiData[]> => {
  try {
    // Search for drugs using RxNorm API
    const searchUrl = `${RXNORM_API_BASE}/drugs.json?name=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error('RxNorm API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.drugGroup || !data.drugGroup.conceptGroup) {
      return [];
    }
    
    // Extract drug concepts
    const medicines: MedicineApiData[] = [];
    
    for (const group of data.drugGroup.conceptGroup) {
      if (group.conceptProperties) {
        // Limit to first 20 results
        const concepts = group.conceptProperties.slice(0, 20);
        
        for (const concept of concepts) {
          const rxcui = concept.rxcui;
          const name = concept.name;
          const tty = concept.tty;
          
          // Get medicine image
          const imageUrl = await getMedicineImage(rxcui, name);
          
          // Categorize medicine
          const category = categorizeMedicine(name, tty);
          
          // Create medicine object
          const medicine: MedicineApiData = {
            id: `rx-${rxcui}`,
            name: name,
            description: `${name} - Pharmaceutical product for medical use. Consult healthcare provider for proper usage.`,
            category: category,
            price: generatePrice(name),
            manufacturer: 'Various Manufacturers',
            dosage: 'Consult healthcare provider for dosage information',
            prescription_required: isPrescriptionRequired(category),
            image_url: imageUrl,
            stock_available: true,
            rating: 4.0 + Math.random(),
            reviews_count: Math.floor(Math.random() * 500) + 50
          };
          
          medicines.push(medicine);
        }
      }
    }
    
    return medicines;
  } catch (error) {
    console.error('Error searching medicines:', error);
    return [];
  }
};

// Get popular medicines (default list)
const getPopularMedicines = async (): Promise<MedicineApiData[]> => {
  // List of popular medicine names to search for
  const popularMedicines = [
    'paracetamol',
    'ibuprofen',
    'aspirin',
    'amoxicillin',
    'metformin',
    'omeprazole',
    'atorvastatin',
    'lisinopril',
    'amlodipine',
    'metoprolol'
  ];
  
  const allMedicines: MedicineApiData[] = [];
  
  // Search for each popular medicine
  for (const medicineName of popularMedicines) {
    const results = await searchMedicinesFromAPI(medicineName);
    if (results.length > 0) {
      // Take first 2 results from each search
      allMedicines.push(...results.slice(0, 2));
    }
  }
  
  return allMedicines;
};

// Medicine API Service
export const medicineApiService = {
  // Get all medicines with optional filters
  getMedicines: async (filters?: {
    category?: string;
    search?: string;
    prescriptionRequired?: boolean;
  }): Promise<MedicineApiData[]> => {
    let results: MedicineApiData[] = [];
    
    // If search term provided, search API
    if (filters?.search) {
      results = await searchMedicinesFromAPI(filters.search);
    } else {
      // Check cache
      const now = Date.now();
      if (medicineCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        results = [...medicineCache];
      } else {
        // Get popular medicines
        results = await getPopularMedicines();
        
        // Update cache
        medicineCache = results;
        cacheTimestamp = now;
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
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineApiData | null> => {
    // Extract rxcui from id
    const rxcui = id.replace('rx-', '');
    
    try {
      // Get medicine details from RxNorm API
      const details = await getMedicineDetails(rxcui);
      
      if (!details) {
        return null;
      }
      
      // Get medicine image
      const imageUrl = await getMedicineImage(rxcui, details.name);
      
      // Categorize medicine
      const category = categorizeMedicine(details.name, details.tty);
      
      // Create medicine object
      const medicine: MedicineApiData = {
        id: id,
        name: details.name,
        description: `${details.name} - Pharmaceutical product for medical use. Consult healthcare provider for proper usage.`,
        category: category,
        price: generatePrice(details.name),
        manufacturer: 'Various Manufacturers',
        dosage: 'Consult healthcare provider for dosage information',
        prescription_required: isPrescriptionRequired(category),
        image_url: imageUrl,
        stock_available: true,
        rating: 4.0 + Math.random(),
        reviews_count: Math.floor(Math.random() * 500) + 50
      };
      
      return medicine;
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
    if (!query) {
      return medicineApiService.getMedicines();
    }
    
    return searchMedicinesFromAPI(query);
  }
};
