// Medicine Data API - Direct Supabase Table Access
// Connects to medicine_data table with 253,973 records

import { supabase } from './supabase';
import { MedicineData } from '@/types/types';

const PAGE_SIZE = 20; // Number of items per page
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';

// Get unique medicine types for categories
export async function getMedicineTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('medicine_data')
      .select('type')
      .not('type', 'is', null)
      .order('type');

    if (error) {
      console.error('Error fetching medicine types:', error);
      return [];
    }

    // Get unique types
    const uniqueTypes = [...new Set(data?.map(item => item.type).filter(Boolean) || [])];
    return uniqueTypes;
  } catch (error) {
    console.error('Error in getMedicineTypes:', error);
    return [];
  }
}

// Get medicines with pagination and filters
export async function getMedicines(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  excludeDiscontinued?: boolean;
}): Promise<{ data: MedicineData[]; count: number; hasMore: boolean }> {
  try {
    const {
      page = 1,
      pageSize = PAGE_SIZE,
      search = '',
      type = '',
      excludeDiscontinued = true
    } = options;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from('medicine_data')
      .select('*', { count: 'exact' });

    // Filter discontinued medicines
    if (excludeDiscontinued) {
      query = query.or('Is_discontinued.is.null,Is_discontinued.eq.false');
    }

    // Filter by type (category)
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    // Search by name
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('name', { ascending: true })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching medicines:', error);
      return { data: [], count: 0, hasMore: false };
    }

    const totalCount = count || 0;
    const hasMore = to < totalCount - 1;

    console.log(`✅ Fetched ${data?.length || 0} medicines (Page ${page}, Total: ${totalCount})`);

    return {
      data: Array.isArray(data) ? data : [],
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

// Search medicines with autocomplete
export async function searchMedicines(query: string, limit: number = 10): Promise<MedicineData[]> {
  try {
    if (!query) return [];

    const { data, error } = await supabase
      .from('medicine_data')
      .select('*')
      .ilike('name', `%${query}%`)
      .or('Is_discontinued.is.null,Is_discontinued.eq.false')
      .order('name', { ascending: true })
      .limit(limit);

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
    const { data, error } = await supabase
      .from('medicine_data')
      .select('*')
      .not('price', 'is', null)
      .or('Is_discontinued.is.null,Is_discontinued.eq.false')
      .order('id', { ascending: true })
      .limit(limit * 10); // Get more to randomize

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
      .eq('Is_discontinued', true);

    // Get count by type
    const { data: typeData } = await supabase
      .from('medicine_data')
      .select('type')
      .not('type', 'is', null);

    const byType: Record<string, number> = {};
    typeData?.forEach(item => {
      if (item.type) {
        byType[item.type] = (byType[item.type] || 0) + 1;
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
    image_url: DEFAULT_IMAGE,
    stock_available: !medicine.Is_discontinued,
    composition: medicine.salt_composition || 'Not specified',
    sideEffects: medicine.side_effects || 'Consult healthcare provider',
    interactions: medicine.drug_interactions || 'Consult healthcare provider'
  };
}
