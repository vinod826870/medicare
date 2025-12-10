// Medicine API Service - Fetches medicine data from external pharmacy APIs
// This is a mock implementation that can be replaced with real API calls

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

// Mock medicine data - Replace with real API calls
const MOCK_MEDICINES: MedicineApiData[] = [
  {
    id: 'med-001',
    name: 'Paracetamol 500mg',
    description: 'Effective pain relief and fever reducer. Suitable for adults and children over 12 years.',
    category: 'otc',
    price: 5.99,
    manufacturer: 'PharmaCorp',
    dosage: '1-2 tablets every 4-6 hours',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg',
    stock_available: true,
    rating: 4.5,
    reviews_count: 1250
  },
  {
    id: 'med-002',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections. Prescription required.',
    category: 'prescription',
    price: 12.99,
    manufacturer: 'MediPharm',
    dosage: '1 capsule 3 times daily',
    prescription_required: true,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg',
    stock_available: true,
    rating: 4.7,
    reviews_count: 890
  },
  {
    id: 'med-003',
    name: 'Vitamin D3 1000 IU',
    description: 'Essential vitamin supplement for bone health and immunity.',
    category: 'supplements',
    price: 8.99,
    manufacturer: 'HealthPlus',
    dosage: '1 tablet daily',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/7d7d9a1f-dd52-477e-8309-293910cb5f38.jpg',
    stock_available: true,
    rating: 4.6,
    reviews_count: 2100
  },
  {
    id: 'med-004',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever for headaches, muscle pain, and arthritis.',
    category: 'otc',
    price: 7.49,
    manufacturer: 'PainRelief Inc',
    dosage: '1 tablet every 6-8 hours',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg',
    stock_available: true,
    rating: 4.4,
    reviews_count: 1580
  },
  {
    id: 'med-005',
    name: 'Omega-3 Fish Oil',
    description: 'Heart health supplement with EPA and DHA omega-3 fatty acids.',
    category: 'supplements',
    price: 15.99,
    manufacturer: 'NutriCare',
    dosage: '2 capsules daily with meals',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/7d7d9a1f-dd52-477e-8309-293910cb5f38.jpg',
    stock_available: true,
    rating: 4.8,
    reviews_count: 3200
  },
  {
    id: 'med-006',
    name: 'Hand Sanitizer 500ml',
    description: '70% alcohol-based hand sanitizer. Kills 99.9% of germs.',
    category: 'personal-care',
    price: 4.99,
    manufacturer: 'CleanHands',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/47ac55ad-af28-4de3-9d6b-00316e1d7f79.jpg',
    stock_available: true,
    rating: 4.3,
    reviews_count: 890
  },
  {
    id: 'med-007',
    name: 'Digital Thermometer',
    description: 'Fast and accurate digital thermometer with fever alarm.',
    category: 'medical-devices',
    price: 12.99,
    manufacturer: 'MediTech',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/96089687-8af6-4c82-bafc-0b5b9aa35b69.jpg',
    stock_available: true,
    rating: 4.6,
    reviews_count: 1120
  },
  {
    id: 'med-008',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergy relief. Non-drowsy formula.',
    category: 'otc',
    price: 6.99,
    manufacturer: 'AllergyFree',
    dosage: '1 tablet daily',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg',
    stock_available: true,
    rating: 4.5,
    reviews_count: 1670
  },
  {
    id: 'med-009',
    name: 'Multivitamin Complex',
    description: 'Complete daily multivitamin with essential minerals.',
    category: 'supplements',
    price: 11.99,
    manufacturer: 'VitaBoost',
    dosage: '1 tablet daily with breakfast',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/7d7d9a1f-dd52-477e-8309-293910cb5f38.jpg',
    stock_available: true,
    rating: 4.7,
    reviews_count: 2890
  },
  {
    id: 'med-010',
    name: 'Blood Pressure Monitor',
    description: 'Automatic digital blood pressure monitor with large display.',
    category: 'medical-devices',
    price: 45.99,
    manufacturer: 'HealthMonitor',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/96089687-8af6-4c82-bafc-0b5b9aa35b69.jpg',
    stock_available: true,
    rating: 4.8,
    reviews_count: 780
  },
  {
    id: 'med-011',
    name: 'Probiotic Capsules',
    description: 'Digestive health support with 10 billion CFU.',
    category: 'supplements',
    price: 18.99,
    manufacturer: 'GutHealth',
    dosage: '1 capsule daily',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/7d7d9a1f-dd52-477e-8309-293910cb5f38.jpg',
    stock_available: true,
    rating: 4.6,
    reviews_count: 1450
  },
  {
    id: 'med-012',
    name: 'Antiseptic Cream',
    description: 'First aid antiseptic cream for cuts and minor wounds.',
    category: 'personal-care',
    price: 5.49,
    manufacturer: 'FirstAid Plus',
    prescription_required: false,
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/47ac55ad-af28-4de3-9d6b-00316e1d7f79.jpg',
    stock_available: true,
    rating: 4.4,
    reviews_count: 920
  }
];

const CATEGORIES: MedicineCategory[] = [
  {
    id: 'prescription',
    name: 'Prescription Medicines',
    description: 'Medicines that require a valid prescription',
    icon: '💊'
  },
  {
    id: 'otc',
    name: 'Over-the-Counter',
    description: 'Medicines available without prescription',
    icon: '🏥'
  },
  {
    id: 'supplements',
    name: 'Health Supplements',
    description: 'Vitamins and dietary supplements',
    icon: '💪'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Personal hygiene and care products',
    icon: '🧴'
  },
  {
    id: 'medical-devices',
    name: 'Medical Devices',
    description: 'Medical equipment and devices',
    icon: '🩺'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const medicineApiService = {
  // Get all medicines with optional filters
  async getMedicines(filters?: {
    search?: string;
    category?: string;
    prescriptionRequired?: boolean;
  }): Promise<MedicineApiData[]> {
    await delay(300); // Simulate API call

    let results = [...MOCK_MEDICINES];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(med =>
        med.name.toLowerCase().includes(searchLower) ||
        med.description.toLowerCase().includes(searchLower) ||
        med.manufacturer.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.category) {
      results = results.filter(med => med.category === filters.category);
    }

    if (filters?.prescriptionRequired !== undefined) {
      results = results.filter(med => med.prescription_required === filters.prescriptionRequired);
    }

    return results;
  },

  // Get medicine by ID
  async getMedicineById(id: string): Promise<MedicineApiData | null> {
    await delay(200);
    return MOCK_MEDICINES.find(med => med.id === id) || null;
  },

  // Get all categories
  async getCategories(): Promise<MedicineCategory[]> {
    await delay(100);
    return [...CATEGORIES];
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<MedicineCategory | null> {
    await delay(100);
    return CATEGORIES.find(cat => cat.id === id) || null;
  },

  // Search medicines (more focused search)
  async searchMedicines(query: string): Promise<MedicineApiData[]> {
    await delay(300);
    const searchLower = query.toLowerCase();
    return MOCK_MEDICINES.filter(med =>
      med.name.toLowerCase().includes(searchLower) ||
      med.description.toLowerCase().includes(searchLower)
    );
  }
};

// For real API integration, replace the above with actual API calls:
// Example:
// export const medicineApiService = {
//   async getMedicines(filters) {
//     const response = await fetch('https://api.pharmeasy.in/medicines', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(filters)
//     });
//     return response.json();
//   },
//   // ... other methods
// };
