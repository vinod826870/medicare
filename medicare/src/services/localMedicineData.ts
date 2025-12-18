// Local Medicine Data - No Backend Required
// This provides mock data for local development without needing Supabase

import { MedicineApiData } from './medicineApi';

export const LOCAL_MEDICINES: MedicineApiData[] = [
  {
    id: 'local-1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer. Effective for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    category: 'otc',
    price: 8.99,
    manufacturer: 'Generic Pharma',
    dosage: '500mg tablets - Take 1-2 tablets every 4-6 hours as needed',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 234,
    rxcui: '161'
  },
  {
    id: 'local-2',
    name: 'Ibuprofen 400mg',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.',
    category: 'otc',
    price: 12.99,
    manufacturer: 'HealthCare Plus',
    dosage: '400mg tablets - Take 1 tablet every 6-8 hours with food',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 456,
    rxcui: '5640'
  },
  {
    id: 'local-3',
    name: 'Aspirin 100mg',
    description: 'Used to reduce pain, fever, or inflammation. Also used to prevent heart attacks and strokes.',
    category: 'otc',
    price: 6.99,
    manufacturer: 'CardioHealth',
    dosage: '100mg tablets - Take 1 tablet daily with food',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 789,
    rxcui: '1191'
  },
  {
    id: 'local-4',
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic used to treat bacterial infections including pneumonia, bronchitis, and infections of the ear, nose, throat, skin, or urinary tract.',
    category: 'prescription',
    price: 24.99,
    manufacturer: 'AntiBio Labs',
    dosage: '500mg capsules - Take 1 capsule three times daily',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d7b2c6e?w=800&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 567,
    rxcui: '723'
  },
  {
    id: 'local-5',
    name: 'Vitamin D3 1000 IU',
    description: 'Essential vitamin supplement for bone health, immune function, and overall wellness.',
    category: 'supplements',
    price: 15.99,
    manufacturer: 'VitaHealth',
    dosage: '1000 IU softgels - Take 1 capsule daily with meal',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 321,
    rxcui: '316672'
  },
  {
    id: 'local-6',
    name: 'Omega-3 Fish Oil',
    description: 'High-quality fish oil supplement rich in EPA and DHA for heart and brain health.',
    category: 'supplements',
    price: 22.99,
    manufacturer: 'OceanHealth',
    dosage: '1000mg softgels - Take 2 capsules daily with meals',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 445,
    rxcui: '849574'
  },
  {
    id: 'local-7',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.',
    category: 'otc',
    price: 11.99,
    manufacturer: 'AllergyFree',
    dosage: '10mg tablets - Take 1 tablet once daily',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 678,
    rxcui: '1014678'
  },
  {
    id: 'local-8',
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor used to treat gastroesophageal reflux disease (GERD) and other conditions involving excessive stomach acid.',
    category: 'prescription',
    price: 18.99,
    manufacturer: 'DigestCare',
    dosage: '20mg capsules - Take 1 capsule daily before breakfast',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 892,
    rxcui: '7646'
  },
  {
    id: 'local-9',
    name: 'Hydrocortisone Cream 1%',
    description: 'Topical corticosteroid used to treat skin conditions such as eczema, dermatitis, allergies, and rash.',
    category: 'personal_care',
    price: 9.99,
    manufacturer: 'SkinCare Pro',
    dosage: '1% cream - Apply thin layer to affected area 2-3 times daily',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    stock_available: true,
    rating: 4.3,
    reviews_count: 234,
    rxcui: '5492'
  },
  {
    id: 'local-10',
    name: 'Metformin 500mg',
    description: 'Oral diabetes medicine that helps control blood sugar levels. Used to treat type 2 diabetes.',
    category: 'prescription',
    price: 16.99,
    manufacturer: 'DiabetesCare',
    dosage: '500mg tablets - Take 1 tablet twice daily with meals',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 1023,
    rxcui: '6809'
  },
  {
    id: 'local-11',
    name: 'Atorvastatin 10mg',
    description: 'Statin medication used to lower cholesterol and reduce the risk of heart disease and stroke.',
    category: 'prescription',
    price: 28.99,
    manufacturer: 'CardioHealth',
    dosage: '10mg tablets - Take 1 tablet once daily',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d7b2c6e?w=800&q=80',
    stock_available: true,
    rating: 4.8,
    reviews_count: 756,
    rxcui: '83367'
  },
  {
    id: 'local-12',
    name: 'Lisinopril 10mg',
    description: 'ACE inhibitor used to treat high blood pressure (hypertension) and heart failure.',
    category: 'prescription',
    price: 14.99,
    manufacturer: 'HeartCare',
    dosage: '10mg tablets - Take 1 tablet once daily',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 634,
    rxcui: '29046'
  },
  {
    id: 'local-13',
    name: 'Vitamin C 1000mg',
    description: 'Powerful antioxidant vitamin supplement that supports immune system health and collagen production.',
    category: 'supplements',
    price: 12.99,
    manufacturer: 'VitaHealth',
    dosage: '1000mg tablets - Take 1 tablet daily',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 445,
    rxcui: '1151133'
  },
  {
    id: 'local-14',
    name: 'Probiotic Complex',
    description: 'Multi-strain probiotic supplement for digestive health and immune support.',
    category: 'supplements',
    price: 29.99,
    manufacturer: 'GutHealth',
    dosage: 'Capsules - Take 1 capsule daily on empty stomach',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 567,
    rxcui: '1234567'
  },
  {
    id: 'local-15',
    name: 'Amlodipine 5mg',
    description: 'Calcium channel blocker used to treat high blood pressure and chest pain (angina).',
    category: 'prescription',
    price: 19.99,
    manufacturer: 'CardioHealth',
    dosage: '5mg tablets - Take 1 tablet once daily',
    prescription_required: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    stock_available: true,
    rating: 4.7,
    reviews_count: 789,
    rxcui: '17767'
  },
  {
    id: 'local-16',
    name: 'Loratadine 10mg',
    description: 'Non-drowsy antihistamine for relief of allergy symptoms including sneezing, runny nose, and itchy eyes.',
    category: 'otc',
    price: 13.99,
    manufacturer: 'AllergyFree',
    dosage: '10mg tablets - Take 1 tablet once daily',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    stock_available: true,
    rating: 4.6,
    reviews_count: 523,
    rxcui: '6472'
  },
  {
    id: 'local-17',
    name: 'Aloe Vera Gel',
    description: 'Natural soothing gel for sunburn relief, minor burns, cuts, and skin irritations.',
    category: 'personal_care',
    price: 7.99,
    manufacturer: 'NatureCare',
    dosage: 'Gel - Apply liberally to affected area as needed',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 345,
    rxcui: '1234568'
  },
  {
    id: 'local-18',
    name: 'Multivitamin Complex',
    description: 'Complete daily multivitamin with essential vitamins and minerals for overall health.',
    category: 'supplements',
    price: 19.99,
    manufacturer: 'VitaHealth',
    dosage: 'Tablets - Take 1 tablet daily with food',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    stock_available: true,
    rating: 4.5,
    reviews_count: 678,
    rxcui: '1234569'
  },
  {
    id: 'local-19',
    name: 'Ranitidine 150mg',
    description: 'H2 blocker used to decrease the amount of acid created by the stomach.',
    category: 'otc',
    price: 10.99,
    manufacturer: 'DigestCare',
    dosage: '150mg tablets - Take 1 tablet twice daily',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    stock_available: true,
    rating: 4.3,
    reviews_count: 234,
    rxcui: '8640'
  },
  {
    id: 'local-20',
    name: 'Diphenhydramine 25mg',
    description: 'Antihistamine used to relieve symptoms of allergy, hay fever, and the common cold.',
    category: 'otc',
    price: 8.99,
    manufacturer: 'AllergyFree',
    dosage: '25mg capsules - Take 1-2 capsules every 4-6 hours',
    prescription_required: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-4a6c5d7b2c6e?w=800&q=80',
    stock_available: true,
    rating: 4.4,
    reviews_count: 456,
    rxcui: '3498'
  }
];

// Search function for local data
export function searchLocalMedicines(query: string): MedicineApiData[] {
  if (!query) return LOCAL_MEDICINES;
  
  const lowerQuery = query.toLowerCase();
  return LOCAL_MEDICINES.filter(medicine =>
    medicine.name.toLowerCase().includes(lowerQuery) ||
    medicine.description.toLowerCase().includes(lowerQuery) ||
    medicine.category.toLowerCase().includes(lowerQuery)
  );
}

// Get medicine by ID
export function getLocalMedicineById(id: string): MedicineApiData | null {
  return LOCAL_MEDICINES.find(medicine => medicine.id === id) || null;
}

// Get medicines by category
export function getLocalMedicinesByCategory(category: string): MedicineApiData[] {
  if (category === 'all') return LOCAL_MEDICINES;
  return LOCAL_MEDICINES.filter(medicine => medicine.category === category);
}
