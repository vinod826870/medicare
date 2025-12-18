import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// API endpoints for comprehensive medicine data
const OPENFDA_API_BASE = 'https://api.fda.gov/drug';
const DAILYMED_API_BASE = 'https://dailymed.nlm.nih.gov/dailymed';
const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';
const RXIMAGE_API_BASE = 'https://rximage.nlm.nih.gov/api';

interface MedicineData {
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
  rating: number;
  reviews_count: number;
  rxcui?: string;
  ndc?: string;
}

// Helper function to get medicine image from RxImage API or OpenFDA
async function getMedicineImage(rxcui?: string, ndc?: string, name?: string): Promise<string> {
  // Try RxImage API first if we have RxCUI
  if (rxcui) {
    try {
      const imageUrl = `${RXIMAGE_API_BASE}/rximage/1/rxnav?resolution=600&rxcui=${rxcui}`;
      const response = await fetch(imageUrl, { 
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.nlmRxImages && data.nlmRxImages.length > 0) {
          const imageUrl = data.nlmRxImages[0].imageUrl;
          console.log('✅ Found RxImage for', name || rxcui, ':', imageUrl);
          return imageUrl;
        }
      }
    } catch (error) {
      console.log('⚠️ Could not fetch image from RxImage for', name || rxcui);
    }
  }
  
  // Try OpenFDA image if we have NDC
  if (ndc) {
    try {
      const cleanNdc = ndc.replace(/-/g, '');
      const imageUrl = `${OPENFDA_API_BASE}/label.json?search=openfda.product_ndc:"${cleanNdc}"&limit=1`;
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0]?.openfda?.image) {
          const imageUrl = data.results[0].openfda.image[0];
          console.log('✅ Found OpenFDA image for', name || ndc, ':', imageUrl);
          return imageUrl;
        }
      }
    } catch (error) {
      console.log('⚠️ Could not fetch image from OpenFDA for', name || ndc);
    }
  }
  
  // Return default medicine image if no image found
  console.log('❌ No image found for', name || rxcui || ndc, '- using default');
  return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';
}

// Helper function to get RxCUI from drug name using RxNorm
async function getRxCUIFromName(drugName: string): Promise<string | null> {
  try {
    const searchUrl = `${RXNORM_API_BASE}/rxcui.json?name=${encodeURIComponent(drugName)}`;
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.idGroup?.rxnormId && data.idGroup.rxnormId.length > 0) {
        return data.idGroup.rxnormId[0];
      }
    }
  } catch (error) {
    console.log('Could not get RxCUI for:', drugName);
  }
  return null;
}

// Helper function to categorize medicine
function categorizeMedicine(name: string, tty?: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('vitamin') || nameLower.includes('supplement') || 
      nameLower.includes('calcium') || nameLower.includes('omega')) {
    return 'supplements';
  }
  
  if (nameLower.includes('cream') || nameLower.includes('ointment') || 
      nameLower.includes('gel') || nameLower.includes('lotion') ||
      nameLower.includes('drops')) {
    return 'personal_care';
  }
  
  if (tty === 'SBD' || tty === 'SBDC' || tty === 'SBDF' || tty === 'SBDG') {
    return 'prescription';
  }
  
  return 'otc';
}

// Helper function to generate price
function generatePrice(name: string): number {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5 + (hash % 50);
}

// Search medicines using OpenFDA API (primary source)
async function searchOpenFDA(searchTerm: string): Promise<MedicineData[]> {
  try {
    console.log('Searching OpenFDA for:', searchTerm);
    
    // Search in brand name and generic name
    const searchQuery = `openfda.brand_name:${searchTerm}+openfda.generic_name:${searchTerm}`;
    const searchUrl = `${OPENFDA_API_BASE}/label.json?search=${encodeURIComponent(searchQuery)}&limit=20`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.log('OpenFDA API returned:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No results from OpenFDA');
      return [];
    }
    
    console.log('OpenFDA returned', data.results.length, 'results');
    
    const medicines: MedicineData[] = [];
    
    for (const result of data.results.slice(0, 15)) {
      const brandName = result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || 'Unknown Medicine';
      const genericName = result.openfda?.generic_name?.[0] || '';
      const manufacturer = result.openfda?.manufacturer_name?.[0] || 'Various Manufacturers';
      const ndc = result.openfda?.product_ndc?.[0] || '';
      
      // Get description
      let description = '';
      if (result.purpose && result.purpose[0]) {
        description = result.purpose[0].substring(0, 200);
      } else if (result.indications_and_usage && result.indications_and_usage[0]) {
        description = result.indications_and_usage[0].substring(0, 200);
      } else if (result.description && result.description[0]) {
        description = result.description[0].substring(0, 200);
      } else {
        description = `${brandName} - Pharmaceutical product. ${genericName ? 'Generic: ' + genericName : ''}`;
      }
      
      description = description.replace(/\s+/g, ' ').trim();
      
      // Get RxCUI for this drug
      const rxcui = await getRxCUIFromName(genericName || brandName);
      
      // Get image
      const imageUrl = await getMedicineImage(rxcui || undefined, ndc, brandName);
      
      // Categorize
      const category = categorizeMedicine(brandName);
      
      const medicine: MedicineData = {
        id: `fda-${ndc || Math.random().toString(36).substr(2, 9)}`,
        name: brandName,
        description,
        category,
        price: generatePrice(brandName),
        manufacturer,
        dosage: 'Consult healthcare provider for dosage information',
        prescription_required: category === 'prescription',
        image_url: imageUrl,
        stock_available: true,
        rating: 4.0 + Math.random(),
        reviews_count: Math.floor(Math.random() * 500) + 50,
        rxcui: rxcui || undefined,
        ndc: ndc || undefined
      };
      
      medicines.push(medicine);
    }
    
    return medicines;
  } catch (error) {
    console.error('Error searching OpenFDA:', error);
    return [];
  }
}

// Search medicines using RxNorm API (fallback)
async function searchRxNorm(searchTerm: string): Promise<MedicineData[]> {
  try {
    console.log('Searching RxNorm for:', searchTerm);
    
    const searchUrl = `${RXNORM_API_BASE}/drugs.json?name=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.log('RxNorm API returned:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.drugGroup || !data.drugGroup.conceptGroup) {
      console.log('No results from RxNorm');
      return [];
    }
    
    const medicines: MedicineData[] = [];
    
    for (const group of data.drugGroup.conceptGroup) {
      if (group.conceptProperties) {
        const concepts = group.conceptProperties.slice(0, 15);
        
        for (const concept of concepts) {
          const rxcui = concept.rxcui;
          const name = concept.name;
          const tty = concept.tty;
          
          const imageUrl = await getMedicineImage(rxcui, undefined, name);
          const category = categorizeMedicine(name, tty);
          
          const medicine: MedicineData = {
            id: `rx-${rxcui}`,
            name: name,
            description: `${name} - Pharmaceutical product for medical use. Consult healthcare provider for proper usage and dosage information.`,
            category: category,
            price: generatePrice(name),
            manufacturer: 'Various Manufacturers',
            dosage: 'Consult healthcare provider for dosage information',
            prescription_required: category === 'prescription',
            image_url: imageUrl,
            stock_available: true,
            rating: 4.0 + Math.random(),
            reviews_count: Math.floor(Math.random() * 500) + 50,
            rxcui: rxcui
          };
          
          medicines.push(medicine);
        }
      }
    }
    
    console.log('RxNorm returned', medicines.length, 'results');
    return medicines;
  } catch (error) {
    console.error('Error searching RxNorm:', error);
    return [];
  }
}

// Search medicines using DailyMed API (additional source)
async function searchDailyMed(searchTerm: string): Promise<MedicineData[]> {
  try {
    console.log('Searching DailyMed for:', searchTerm);
    
    const searchUrl = `${DAILYMED_API_BASE}/services/v2/spls.json?drug_name=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.log('DailyMed API returned:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('No results from DailyMed');
      return [];
    }
    
    console.log('DailyMed returned', data.data.length, 'results');
    
    const medicines: MedicineData[] = [];
    
    for (const item of data.data.slice(0, 10)) {
      const name = item.title || 'Unknown Medicine';
      
      // Get RxCUI
      const rxcui = await getRxCUIFromName(name);
      
      // Get image
      const imageUrl = await getMedicineImage(rxcui || undefined, undefined, name);
      
      // Categorize
      const category = categorizeMedicine(name);
      
      const medicine: MedicineData = {
        id: `dm-${item.setid || Math.random().toString(36).substr(2, 9)}`,
        name: name,
        description: `${name} - Pharmaceutical product for medical use. Consult healthcare provider for proper usage and dosage information.`,
        category,
        price: generatePrice(name),
        manufacturer: 'Various Manufacturers',
        dosage: 'Consult healthcare provider for dosage information',
        prescription_required: category === 'prescription',
        image_url: imageUrl,
        stock_available: true,
        rating: 4.0 + Math.random(),
        reviews_count: Math.floor(Math.random() * 500) + 50,
        rxcui: rxcui || undefined
      };
      
      medicines.push(medicine);
    }
    
    return medicines;
  } catch (error) {
    console.error('Error searching DailyMed:', error);
    return [];
  }
}

// Comprehensive search using all APIs
async function searchMedicines(searchTerm: string): Promise<MedicineData[]> {
  try {
    console.log('Starting comprehensive search for:', searchTerm);
    
    // Search all APIs in parallel
    const [openFDAResults, rxNormResults, dailyMedResults] = await Promise.all([
      searchOpenFDA(searchTerm),
      searchRxNorm(searchTerm),
      searchDailyMed(searchTerm)
    ]);
    
    // Combine results (OpenFDA first, then RxNorm, then DailyMed)
    const allResults = [...openFDAResults, ...rxNormResults, ...dailyMedResults];
    
    // Remove duplicates based on name
    const uniqueResults = allResults.filter((medicine, index, self) =>
      index === self.findIndex((m) => m.name.toLowerCase() === medicine.name.toLowerCase())
    );
    
    console.log('Total unique results:', uniqueResults.length);
    
    // Return up to 30 results
    return uniqueResults.slice(0, 30);
  } catch (error) {
    console.error('Error in comprehensive search:', error);
    throw error;
  }
}

// Get medicine details by RxCUI
async function getMedicineById(rxcui: string): Promise<MedicineData | null> {
  try {
    const detailsUrl = `${RXNORM_API_BASE}/rxcui/${rxcui}/properties.json`;
    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const properties = data.properties;
    
    if (!properties) {
      return null;
    }
    
    // Get medicine image
    const imageUrl = await getMedicineImage(rxcui);
    
    // Categorize medicine
    const category = categorizeMedicine(properties.name, properties.tty);
    
    // Create medicine object
    const medicine: MedicineData = {
      id: `rx-${rxcui}`,
      name: properties.name,
      description: `${properties.name} - Pharmaceutical product for medical use. Consult healthcare provider for proper usage and dosage information.`,
      category: category,
      price: generatePrice(properties.name),
      manufacturer: 'Various Manufacturers',
      dosage: 'Consult healthcare provider for dosage information',
      prescription_required: category === 'prescription',
      image_url: imageUrl,
      stock_available: true,
      rating: 4.0 + Math.random(),
      reviews_count: Math.floor(Math.random() * 500) + 50,
      rxcui: rxcui
    };
    
    return medicine;
  } catch (error) {
    console.error('Error getting medicine by ID:', error);
    return null;
  }
}

// Get popular medicines
async function getPopularMedicines(): Promise<MedicineData[]> {
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
    'cetirizine'
  ];
  
  const allMedicines: MedicineData[] = [];
  
  for (const medicineName of popularMedicines) {
    const results = await searchMedicines(medicineName);
    if (results.length > 0) {
      // Take first 2 results from each search
      allMedicines.push(...results.slice(0, 2));
    }
  }
  
  return allMedicines;
}

Deno.serve(async (req: Request) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const searchTerm = url.searchParams.get('search');
    const rxcui = url.searchParams.get('rxcui');

    let result;

    if (action === 'search' && searchTerm) {
      // Search for medicines
      result = await searchMedicines(searchTerm);
    } else if (action === 'getById' && rxcui) {
      // Get medicine by RxCUI
      result = await getMedicineById(rxcui);
    } else if (action === 'popular') {
      // Get popular medicines
      result = await getPopularMedicines();
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or missing parameters' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error in fetch-medicines function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
