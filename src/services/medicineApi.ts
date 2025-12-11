// Medicine API Service - Comprehensive medicine database with images

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

// Comprehensive medicine database with real medicines and images
const MEDICINE_DATABASE: MedicineApiData[] = [
  // Pain Relief & Fever
  {
    id: 'med-001',
    name: 'Paracetamol 500mg',
    description: 'Effective pain relief and fever reducer. Used for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    category: 'otc',
    price: 8.99,
    manufacturer: 'PharmaCare',
    dosage: 'Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 1250
  },
  {
    id: 'med-002',
    name: 'Ibuprofen 400mg',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) for pain, inflammation, and fever. Effective for headaches, dental pain, menstrual cramps, and arthritis.',
    category: 'otc',
    price: 12.50,
    manufacturer: 'MediPharm',
    dosage: 'Adults: 1 tablet every 4-6 hours as needed. Maximum 6 tablets in 24 hours.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 980
  },
  {
    id: 'med-003',
    name: 'Aspirin 75mg',
    description: 'Low-dose aspirin for cardiovascular protection. Helps prevent heart attacks and strokes in at-risk patients.',
    category: 'prescription',
    price: 15.99,
    manufacturer: 'CardioMed',
    dosage: 'Adults: 1 tablet daily, preferably with food.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 750
  },
  {
    id: 'med-004',
    name: 'Acetaminophen Extra Strength',
    description: 'Extra strength pain reliever and fever reducer. Gentle on stomach, effective for moderate to severe pain.',
    category: 'otc',
    price: 10.99,
    manufacturer: 'HealthPlus',
    dosage: 'Adults: 2 tablets every 6 hours. Do not exceed 6 tablets in 24 hours.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 620
  },

  // Antibiotics
  {
    id: 'med-005',
    name: 'Amoxicillin 500mg',
    description: 'Broad-spectrum antibiotic for bacterial infections including respiratory tract, ear, nose, throat, skin, and urinary tract infections.',
    category: 'prescription',
    price: 25.99,
    manufacturer: 'AntiBio Labs',
    dosage: 'Adults: 1 capsule three times daily. Complete the full course as prescribed.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 890
  },
  {
    id: 'med-006',
    name: 'Azithromycin 250mg',
    description: 'Macrolide antibiotic for respiratory infections, skin infections, and sexually transmitted infections.',
    category: 'prescription',
    price: 32.50,
    manufacturer: 'MicroBio Pharma',
    dosage: 'Adults: 2 tablets on day 1, then 1 tablet daily for 4 days.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 540
  },
  {
    id: 'med-007',
    name: 'Ciprofloxacin 500mg',
    description: 'Fluoroquinolone antibiotic for urinary tract infections, respiratory infections, and gastrointestinal infections.',
    category: 'prescription',
    price: 28.99,
    manufacturer: 'BioMed Solutions',
    dosage: 'Adults: 1 tablet twice daily. Take with plenty of water.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 430
  },

  // Allergy & Cold
  {
    id: 'med-008',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergic rhinitis, hay fever, and urticaria. Non-drowsy formula for 24-hour relief.',
    category: 'otc',
    price: 14.99,
    manufacturer: 'AllergyFree',
    dosage: 'Adults and children over 6: 1 tablet once daily.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 1100
  },
  {
    id: 'med-009',
    name: 'Loratadine 10mg',
    description: 'Long-acting antihistamine for seasonal allergies, pet allergies, and skin allergies. Non-drowsy.',
    category: 'otc',
    price: 13.50,
    manufacturer: 'ClearBreath',
    dosage: 'Adults and children over 6: 1 tablet once daily.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 920
  },
  {
    id: 'med-010',
    name: 'Pseudoephedrine 60mg',
    description: 'Decongestant for nasal and sinus congestion due to colds, allergies, or sinusitis.',
    category: 'otc',
    price: 11.99,
    manufacturer: 'SinusClear',
    dosage: 'Adults: 1 tablet every 4-6 hours. Do not exceed 4 tablets in 24 hours.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 680
  },

  // Digestive Health
  {
    id: 'med-011',
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for acid reflux, heartburn, and stomach ulcers. Reduces stomach acid production.',
    category: 'prescription',
    price: 22.99,
    manufacturer: 'GastroHealth',
    dosage: 'Adults: 1 capsule once daily before breakfast.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 850
  },
  {
    id: 'med-012',
    name: 'Loperamide 2mg',
    description: 'Anti-diarrheal medication for acute and chronic diarrhea. Provides fast relief.',
    category: 'otc',
    price: 9.99,
    manufacturer: 'DigestiCare',
    dosage: 'Adults: 2 capsules initially, then 1 after each loose stool. Maximum 8 capsules daily.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 560
  },
  {
    id: 'med-013',
    name: 'Ranitidine 150mg',
    description: 'H2 blocker for heartburn, acid indigestion, and sour stomach. Fast-acting relief.',
    category: 'otc',
    price: 16.50,
    manufacturer: 'AcidRelief',
    dosage: 'Adults: 1 tablet twice daily or as directed.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 720
  },

  // Vitamins & Supplements
  {
    id: 'med-014',
    name: 'Vitamin D3 1000 IU',
    description: 'Essential vitamin for bone health, immune function, and calcium absorption. Supports overall wellness.',
    category: 'supplements',
    price: 12.99,
    manufacturer: 'VitaHealth',
    dosage: 'Adults: 1 tablet daily with food.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 1450
  },
  {
    id: 'med-015',
    name: 'Multivitamin Complete',
    description: 'Comprehensive daily multivitamin with essential vitamins and minerals for overall health and energy.',
    category: 'supplements',
    price: 18.99,
    manufacturer: 'NutriPlus',
    dosage: 'Adults: 1 tablet daily with breakfast.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 1320
  },
  {
    id: 'med-016',
    name: 'Omega-3 Fish Oil 1000mg',
    description: 'High-quality fish oil for heart health, brain function, and joint support. Rich in EPA and DHA.',
    category: 'supplements',
    price: 24.99,
    manufacturer: 'OceanHealth',
    dosage: 'Adults: 2 softgels daily with meals.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 980
  },
  {
    id: 'med-017',
    name: 'Calcium + Vitamin D',
    description: 'Calcium supplement with vitamin D for strong bones and teeth. Prevents osteoporosis.',
    category: 'supplements',
    price: 15.99,
    manufacturer: 'BoneStrong',
    dosage: 'Adults: 2 tablets daily with food.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 760
  },

  // Diabetes & Blood Pressure
  {
    id: 'med-018',
    name: 'Metformin 500mg',
    description: 'First-line medication for type 2 diabetes. Helps control blood sugar levels and improves insulin sensitivity.',
    category: 'prescription',
    price: 19.99,
    manufacturer: 'DiabetesCare',
    dosage: 'Adults: 1 tablet twice daily with meals. Adjust as directed by physician.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 890
  },
  {
    id: 'med-019',
    name: 'Amlodipine 5mg',
    description: 'Calcium channel blocker for high blood pressure and angina. Helps relax blood vessels.',
    category: 'prescription',
    price: 21.50,
    manufacturer: 'CardioHealth',
    dosage: 'Adults: 1 tablet once daily.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 670
  },
  {
    id: 'med-020',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor for high blood pressure and heart failure. Protects kidneys in diabetic patients.',
    category: 'prescription',
    price: 18.99,
    manufacturer: 'HeartCare',
    dosage: 'Adults: 1 tablet once daily.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 780
  },

  // Respiratory
  {
    id: 'med-021',
    name: 'Salbutamol Inhaler',
    description: 'Bronchodilator for asthma and COPD. Provides quick relief from breathing difficulties and wheezing.',
    category: 'prescription',
    price: 35.99,
    manufacturer: 'RespiCare',
    dosage: 'Adults: 1-2 puffs as needed. Maximum 8 puffs in 24 hours.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 920
  },
  {
    id: 'med-022',
    name: 'Montelukast 10mg',
    description: 'Leukotriene receptor antagonist for asthma prevention and allergic rhinitis.',
    category: 'prescription',
    price: 27.99,
    manufacturer: 'BreathEasy',
    dosage: 'Adults: 1 tablet once daily in the evening.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 650
  },

  // Skin Care
  {
    id: 'med-023',
    name: 'Hydrocortisone Cream 1%',
    description: 'Topical corticosteroid for skin inflammation, itching, and rashes. Effective for eczema and dermatitis.',
    category: 'personal_care',
    price: 8.99,
    manufacturer: 'SkinHealth',
    dosage: 'Apply thin layer to affected area 2-3 times daily.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 540
  },
  {
    id: 'med-024',
    name: 'Clotrimazole Cream 1%',
    description: 'Antifungal cream for athlete\'s foot, jock itch, ringworm, and yeast infections.',
    category: 'personal_care',
    price: 11.50,
    manufacturer: 'FungiCure',
    dosage: 'Apply to affected area twice daily for 2-4 weeks.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 620
  },
  {
    id: 'med-025',
    name: 'Benzoyl Peroxide Gel 5%',
    description: 'Acne treatment gel that kills bacteria and reduces inflammation. Effective for mild to moderate acne.',
    category: 'personal_care',
    price: 13.99,
    manufacturer: 'ClearSkin',
    dosage: 'Apply thin layer to affected areas once daily, gradually increase to twice daily.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 780
  },

  // Mental Health
  {
    id: 'med-026',
    name: 'Sertraline 50mg',
    description: 'SSRI antidepressant for depression, anxiety disorders, OCD, and PTSD.',
    category: 'prescription',
    price: 29.99,
    manufacturer: 'MindCare',
    dosage: 'Adults: 1 tablet once daily. May take 4-6 weeks for full effect.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 890
  },
  {
    id: 'med-027',
    name: 'Alprazolam 0.5mg',
    description: 'Benzodiazepine for anxiety disorders and panic attacks. Fast-acting relief.',
    category: 'prescription',
    price: 24.99,
    manufacturer: 'AnxietyRelief',
    dosage: 'Adults: 1 tablet 2-3 times daily as needed.',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 720
  },

  // Sleep & Insomnia
  {
    id: 'med-028',
    name: 'Melatonin 3mg',
    description: 'Natural sleep aid for insomnia and jet lag. Helps regulate sleep-wake cycle.',
    category: 'supplements',
    price: 10.99,
    manufacturer: 'SleepWell',
    dosage: 'Adults: 1 tablet 30 minutes before bedtime.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 1150
  },
  {
    id: 'med-029',
    name: 'Diphenhydramine 25mg',
    description: 'Antihistamine with sedative properties for occasional sleeplessness and allergies.',
    category: 'otc',
    price: 9.50,
    manufacturer: 'NightRest',
    dosage: 'Adults: 1-2 tablets 30 minutes before bedtime.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 680
  },

  // Eye Care
  {
    id: 'med-030',
    name: 'Artificial Tears Eye Drops',
    description: 'Lubricating eye drops for dry eyes, eye strain, and irritation. Preservative-free formula.',
    category: 'personal_care',
    price: 7.99,
    manufacturer: 'EyeCare',
    dosage: 'Instill 1-2 drops in affected eye(s) as needed.',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d8f2c7e?w=500&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 520
  }
];

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

// Medicine API Service
export const medicineApiService = {
  // Get all medicines with optional filters
  getMedicines: async (filters?: {
    category?: string;
    search?: string;
    prescriptionRequired?: boolean;
  }): Promise<MedicineApiData[]> => {
    let results = [...MEDICINE_DATABASE];

    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(med => med.category === filters.category);
    }

    // Apply prescription filter
    if (filters?.prescriptionRequired !== undefined) {
      results = results.filter(med => med.prescription_required === filters.prescriptionRequired);
    }

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(med =>
        med.name.toLowerCase().includes(searchLower) ||
        med.description.toLowerCase().includes(searchLower) ||
        med.manufacturer.toLowerCase().includes(searchLower)
      );
    }

    return results;
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineApiData | null> => {
    const medicine = MEDICINE_DATABASE.find(med => med.id === id);
    return medicine || null;
  },

  // Get all categories
  getCategories: async (): Promise<MedicineCategory[]> => {
    return CATEGORIES;
  },

  // Search medicines
  searchMedicines: async (query: string): Promise<MedicineApiData[]> => {
    if (!query) return MEDICINE_DATABASE;

    const searchLower = query.toLowerCase();
    return MEDICINE_DATABASE.filter(med =>
      med.name.toLowerCase().includes(searchLower) ||
      med.description.toLowerCase().includes(searchLower) ||
      med.manufacturer.toLowerCase().includes(searchLower)
    );
  }
};
