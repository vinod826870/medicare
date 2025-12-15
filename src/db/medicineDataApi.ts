// Medicine Data API - Direct Supabase Table Access with Optimized Search
// Connects to medicine_data table with 253,973 records
// Uses PostgreSQL full-text search and trigram indexes for fast searching

import { supabase } from './supabase';
import { MedicineData } from '@/types/types';

const PAGE_SIZE = 20; // Number of items per page

// Medicine type to image mapping
const MEDICINE_IMAGES: Record<string, string> = {
  'Tablet': 'https://miaoda-site-img.s3cdn.medo.dev/images/38c08afb-e72b-45b1-bb55-8d1f6860d41f.jpg',
  'Capsule': 'https://miaoda-site-img.s3cdn.medo.dev/images/6a72b906-5272-4632-a4a6-d1f5c84cc85d.jpg',
  'Syrup': 'https://miaoda-site-img.s3cdn.medo.dev/images/8b5be1d1-fbc1-4d0d-93ea-6b1d06d10d95.jpg',
  'Injection': 'https://miaoda-site-img.s3cdn.medo.dev/images/4d86a7c7-c529-4cae-9042-5ec4a3442fb2.jpg',
  'Cream': 'https://miaoda-site-img.s3cdn.medo.dev/images/f02c9aaa-2503-4be8-b496-92a8aa592c27.jpg',
  'Ointment': 'https://miaoda-site-img.s3cdn.medo.dev/images/f02c9aaa-2503-4be8-b496-92a8aa592c27.jpg',
  'Drops': 'https://miaoda-site-img.s3cdn.medo.dev/images/11592382-8ce7-4ea4-88b0-7507e75a7ef8.jpg',
  'Gel': 'https://miaoda-site-img.s3cdn.medo.dev/images/34e9ad05-e6f8-4197-a499-7fe7fc875fe2.jpg',
  'Powder': 'https://miaoda-site-img.s3cdn.medo.dev/images/e4f63efa-2797-457c-9ed6-787f5164c251.jpg',
  'Inhaler': 'https://miaoda-site-img.s3cdn.medo.dev/images/1a6f7e11-f30b-49ae-ad07-b673c0cf8234.jpg',
  'Lotion': 'https://miaoda-site-img.s3cdn.medo.dev/images/47401bf4-cc04-4ecc-9186-c6c92f07e84e.jpg',
  'default': 'https://miaoda-site-img.s3cdn.medo.dev/images/38c08afb-e72b-45b1-bb55-8d1f6860d41f.jpg'
};

// Array of all available images for variety
const ALL_MEDICINE_IMAGES = [
  'https://miaoda-site-img.s3cdn.medo.dev/images/38c08afb-e72b-45b1-bb55-8d1f6860d41f.jpg', // Tablet
  'https://miaoda-site-img.s3cdn.medo.dev/images/6a72b906-5272-4632-a4a6-d1f5c84cc85d.jpg', // Capsule
  'https://miaoda-site-img.s3cdn.medo.dev/images/8b5be1d1-fbc1-4d0d-93ea-6b1d06d10d95.jpg', // Syrup
  'https://miaoda-site-img.s3cdn.medo.dev/images/4d86a7c7-c529-4cae-9042-5ec4a3442fb2.jpg', // Injection
  'https://miaoda-site-img.s3cdn.medo.dev/images/f02c9aaa-2503-4be8-b496-92a8aa592c27.jpg', // Cream
  'https://miaoda-site-img.s3cdn.medo.dev/images/11592382-8ce7-4ea4-88b0-7507e75a7ef8.jpg', // Drops
  'https://miaoda-site-img.s3cdn.medo.dev/images/34e9ad05-e6f8-4197-a499-7fe7fc875fe2.jpg', // Gel
  'https://miaoda-site-img.s3cdn.medo.dev/images/e4f63efa-2797-457c-9ed6-787f5164c251.jpg', // Powder
  'https://miaoda-site-img.s3cdn.medo.dev/images/1a6f7e11-f30b-49ae-ad07-b673c0cf8234.jpg', // Inhaler
  'https://miaoda-site-img.s3cdn.medo.dev/images/47401bf4-cc04-4ecc-9186-c6c92f07e84e.jpg', // Lotion
];

// Simple hash function to convert string to number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Get image URL based on medicine type and ID for variety
export function getMedicineImageUrl(type: string | null, medicineId?: number | string): string {
  // First, try to match by type
  if (type) {
    // Check for exact match
    if (MEDICINE_IMAGES[type]) return MEDICINE_IMAGES[type];
    
    // Check for partial match (case-insensitive)
    const typeKey = Object.keys(MEDICINE_IMAGES).find(key => 
      type.toLowerCase().includes(key.toLowerCase())
    );
    
    if (typeKey) return MEDICINE_IMAGES[typeKey];
  }
  
  // If no type match and we have an ID, use hash-based selection for variety
  if (medicineId) {
    const idString = medicineId.toString();
    const hash = hashString(idString);
    const imageIndex = hash % ALL_MEDICINE_IMAGES.length;
    return ALL_MEDICINE_IMAGES[imageIndex];
  }
  
  // Fallback to default
  return MEDICINE_IMAGES.default;
}

// Get unique medicine types for categories
export async function getMedicineTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_medicine_types');

    if (error) {
      console.error('Error fetching medicine types:', error);
      return [];
    }

    // Extract type names from the result
    const types = data?.map((item: any) => item.type).filter(Boolean) || [];
    return types;
  } catch (error) {
    console.error('Error in getMedicineTypes:', error);
    return [];
  }
}

// Get unique manufacturers (brands)
export async function getManufacturers(limit: number = 50): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('medicine_data')
      .select('manufacturer_name')
      .not('manufacturer_name', 'is', null)
      .order('manufacturer_name', { ascending: true })
      .limit(1000);

    if (error) {
      console.error('Error fetching manufacturers:', error);
      return [];
    }

    // Get unique manufacturers
    const uniqueManufacturers = [...new Set(data?.map(item => item.manufacturer_name).filter(Boolean))];
    return uniqueManufacturers.slice(0, limit);
  } catch (error) {
    console.error('Error in getManufacturers:', error);
    return [];
  }
}

// Get medicines with pagination and filters using optimized search
export async function getMedicines(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  excludeDiscontinued?: boolean;
  minPrice?: number;
  maxPrice?: number;
  manufacturers?: string[];
}): Promise<{ data: MedicineData[]; count: number; hasMore: boolean }> {
  try {
    const {
      page = 1,
      pageSize = PAGE_SIZE,
      search = '',
      type = '',
      excludeDiscontinued = true,
      minPrice,
      maxPrice,
      manufacturers = []
    } = options;

    // Build query
    let query = supabase
      .from('medicine_data')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,manufacturer_name.ilike.%${search}%,short_composition1.ilike.%${search}%`);
    }

    // Apply type filter
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    // Apply discontinued filter
    if (excludeDiscontinued) {
      query = query.or('is_discontinued.is.null,is_discontinued.eq.false');
    }

    // Apply price range filter
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    // Apply manufacturer filter
    if (manufacturers.length > 0) {
      query = query.in('manufacturer_name', manufacturers);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('id', { ascending: true });

    const { data: medicines, error: searchError, count } = await query;

    if (searchError) {
      console.error('Error searching medicines:', searchError);
      return { data: [], count: 0, hasMore: false };
    }

    const totalCount = count || 0;
    const hasMore = page * pageSize < totalCount;

    console.log(`✅ Fetched ${medicines?.length || 0} medicines (Page ${page}, Total: ${totalCount})`);

    return {
      data: Array.isArray(medicines) ? medicines : [],
      count: totalCount,
      hasMore
    };
  } catch (error) {
    console.error('Error in getMedicines:', error);
    return { data: [], count: 0, hasMore: false };
  }
}

// Get medicine by ID
export async function getMedicineById(id: number): Promise<MedicineData | null> {
  try {
    const { data, error } = await supabase
      .from('medicine_data')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching medicine by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getMedicineById:', error);
    return null;
  }
}

// Search medicines with autocomplete (fast trigram search)
export async function searchMedicines(query: string, limit: number = 10): Promise<MedicineData[]> {
  try {
    if (!query) return [];

    // Use optimized search function
    const { data, error } = await supabase
      .rpc('search_medicines', {
        search_query: query,
        medicine_type: null,
        exclude_discontinued: true,
        page_num: 1,
        page_size: limit
      });

    if (error) {
      console.error('Error searching medicines:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in searchMedicines:', error);
    return [];
  }
}

// Get featured medicines (random selection)
export async function getFeaturedMedicines(limit: number = 8): Promise<MedicineData[]> {
  try {
    // Get random medicines that are not discontinued and have a price
    // Using TABLESAMPLE for fast random selection on large tables
    const { data, error } = await supabase
      .from('medicine_data')
      .select('*')
      .not('price', 'is', null)
      .or('is_discontinued.is.null,is_discontinued.eq.false')
      .order('id', { ascending: true })
      .limit(limit * 5); // Get more to randomize

    if (error) {
      console.error('Error fetching featured medicines:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Shuffle and take first 'limit' items
    const shuffled = data.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error in getFeaturedMedicines:', error);
    return [];
  }
}

// Get medicine statistics
export async function getMedicineStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  discontinued: number;
}> {
  try {
    // Get total count
    const { count: total } = await supabase
      .from('medicine_data')
      .select('*', { count: 'exact', head: true });

    // Get discontinued count
    const { count: discontinued } = await supabase
      .from('medicine_data')
      .select('*', { count: 'exact', head: true })
      .eq('is_discontinued', true);

    // Get count by type using RPC
    const { data: typeData } = await supabase
      .rpc('get_medicine_types');

    const byType: Record<string, number> = {};
    typeData?.forEach((item: any) => {
      if (item.type) {
        byType[item.type] = item.count;
      }
    });

    return {
      total: total || 0,
      byType,
      discontinued: discontinued || 0
    };
  } catch (error) {
    console.error('Error in getMedicineStats:', error);
    return {
      total: 0,
      byType: {},
      discontinued: 0
    };
  }
}

// Helper function to format medicine for display
export function formatMedicineForDisplay(medicine: MedicineData): {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  manufacturer: string;
  dosage: string;
  prescription_required: boolean;
  image_url: string;
  stock_available: boolean;
  composition: string;
  sideEffects: string;
  interactions: string;
} {
  return {
    id: medicine.id.toString(),
    name: medicine.name || 'Unknown Medicine',
    description: medicine.short_composition1 || medicine.salt_composition || 'No description available',
    category: medicine.type || 'general',
    price: medicine.price || 0,
    manufacturer: medicine.manufacturer_name || 'Unknown Manufacturer',
    dosage: medicine.pack_size_label || 'Consult healthcare provider',
    prescription_required: false, // You can add logic based on medicine type
    image_url: getMedicineImageUrl(medicine.type, medicine.id),
    stock_available: !medicine.is_discontinued,
    composition: medicine.salt_composition || 'Not specified',
    sideEffects: medicine.side_effects || 'Consult healthcare provider',
    interactions: medicine.drug_interactions || 'Consult healthcare provider'
  };
}
