import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// RxNorm and RxImage API endpoints (NIH - National Library of Medicine)
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
  rxcui: string;
}

// Helper function to get medicine image from RxImage API
async function getMedicineImage(rxcui: string): Promise<string> {
  try {
    const imageUrl = `${RXIMAGE_API_BASE}/rximage/1/rxnav?resolution=600&rxcui=${rxcui}`;
    const response = await fetch(imageUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.nlmRxImages && data.nlmRxImages.length > 0) {
        return data.nlmRxImages[0].imageUrl;
      }
    }
  } catch (error) {
    console.log('Could not fetch image for rxcui:', rxcui, error);
  }
  
  // Return default medicine image if no image found
  return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';
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

// Search medicines using RxNorm API
async function searchMedicines(searchTerm: string): Promise<MedicineData[]> {
  try {
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
    
    const medicines: MedicineData[] = [];
    
    // Process drug concepts
    for (const group of data.drugGroup.conceptGroup) {
      if (group.conceptProperties) {
        // Limit to first 20 results
        const concepts = group.conceptProperties.slice(0, 20);
        
        for (const concept of concepts) {
          const rxcui = concept.rxcui;
          const name = concept.name;
          const tty = concept.tty;
          
          // Get medicine image from RxImage API
          const imageUrl = await getMedicineImage(rxcui);
          
          // Categorize medicine
          const category = categorizeMedicine(name, tty);
          
          // Create medicine object
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
    
    return medicines;
  } catch (error) {
    console.error('Error searching medicines:', error);
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
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
