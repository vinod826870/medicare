// Medicine Data API - Direct Supabase Table Access with Optimized Search
// Connects to medicine_data table with 253,973 records
// Uses PostgreSQL full-text search and trigram indexes for fast searching

import { supabase } from './supabase';
import { MedicineData } from '@/types/types';

const PAGE_SIZE = 20; // Number of items per page
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';

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

// Get medicines with pagination and filters using optimized search
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

    // Use optimized RPC function for search
    const { data: medicines, error: searchError } = await supabase
      .rpc('search_medicines', {
        search_query: search || '',
        medicine_type: type && type !== 'all' ? type : null,
        exclude_discontinued: excludeDiscontinued,
        page_num: page,
        page_size: pageSize
      });

    if (searchError) {
      console.error('Error searching medicines:', searchError);
      return { data: [], count: 0, hasMore: false };
    }

    // Get total count using optimized count function
    const { data: countData, error: countError } = await supabase
      .rpc('count_medicines', {
        search_query: search || '',
        medicine_type: type && type !== 'all' ? type : null,
        exclude_discontinued: excludeDiscontinued
      });

    if (countError) {
      console.error('Error counting medicines:', countError);
    }

    const totalCount = countData || 0;
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
      .or('Is_discontinued.is.null,Is_discontinued.eq.false')
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
      .eq('Is_discontinued', true);

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
    image_url: DEFAULT_IMAGE,
    stock_available: !medicine.Is_discontinued,
    composition: medicine.salt_composition || 'Not specified',
    sideEffects: medicine.side_effects || 'Consult healthcare provider',
    interactions: medicine.drug_interactions || 'Consult healthcare provider'
  };
}
