// Medicine Image Service
// Provides medicine-specific images based on medicine name and manufacturer

interface MedicineImageCache {
  [key: string]: string;
}

// In-memory cache for medicine images
const imageCache: MedicineImageCache = {};

// Real medicine images mapped by common medicine names
const MEDICINE_NAME_IMAGES: Record<string, string> = {
  // Common pain relievers
  'paracetamol': 'https://miaoda-site-img.s3cdn.medo.dev/images/22a290e5-7193-4f87-bc40-88a81804dfec.jpg',
  'acetaminophen': 'https://miaoda-site-img.s3cdn.medo.dev/images/22a290e5-7193-4f87-bc40-88a81804dfec.jpg',
  'ibuprofen': 'https://miaoda-site-img.s3cdn.medo.dev/images/6d99d817-f430-4554-bca6-db4db9ea3d42.jpg',
  'aspirin': 'https://miaoda-site-img.s3cdn.medo.dev/images/26b15f53-606f-426d-9c2e-6fb78c851896.jpg',
  
  // Antibiotics
  'amoxicillin': 'https://miaoda-site-img.s3cdn.medo.dev/images/342cc62b-9adf-48e3-92d2-5de5aefa9bc5.jpg',
  'azithromycin': 'https://miaoda-site-img.s3cdn.medo.dev/images/cda3e9f8-71c4-4a93-ad07-c67fbf6559a8.jpg',
  
  // Allergy medicines
  'cetirizine': 'https://miaoda-site-img.s3cdn.medo.dev/images/d9fa8009-c840-4441-a937-5ece290c4ecf.jpg',
  
  // Gastric medicines
  'omeprazole': 'https://miaoda-site-img.s3cdn.medo.dev/images/887f779b-b41b-4910-a7e9-cf30fd9c9884.jpg',
  'pantoprazole': 'https://miaoda-site-img.s3cdn.medo.dev/images/cdf0d835-96bb-453f-a807-7cefbc64e246.jpg',
  
  // Diabetes medicines
  'metformin': 'https://miaoda-site-img.s3cdn.medo.dev/images/097c2d6e-3050-4a67-82bc-010a8f7a0ca6.jpg',
  
  // Cholesterol medicines
  'atorvastatin': 'https://miaoda-site-img.s3cdn.medo.dev/images/aea40353-7d06-4830-950b-8bacdda36d9b.jpg',
  
  // Blood pressure medicines
  'losartan': 'https://miaoda-site-img.s3cdn.medo.dev/images/3b840366-81aa-4d77-b0cb-4e3c5e766023.jpg',
  'amlodipine': 'https://miaoda-site-img.s3cdn.medo.dev/images/ebb9d9c8-f6ec-41c8-8bd4-2f97c04007bb.jpg',
  'lisinopril': 'https://miaoda-site-img.s3cdn.medo.dev/images/ec1d7591-33d0-4c33-8949-d723db290cb9.jpg',
  'clopidogrel': 'https://miaoda-site-img.s3cdn.medo.dev/images/c91ff6fb-f759-42a0-8165-e111a9b40191.jpg',
  
  // Thyroid medicines
  'levothyroxine': 'https://miaoda-site-img.s3cdn.medo.dev/images/0f1fb324-9933-4e71-8619-28fae0395254.jpg',
  
  // Neurological medicines
  'gabapentin': 'https://miaoda-site-img.s3cdn.medo.dev/images/3673f366-2937-41d6-ac7e-35bd06b2c5a0.jpg',
  
  // Antidepressants
  'sertraline': 'https://miaoda-site-img.s3cdn.medo.dev/images/22f4d54b-17c1-4a0a-9e51-4081a37a4855.jpg',
  
  // Asthma medicines
  'montelukast': 'https://miaoda-site-img.s3cdn.medo.dev/images/97f8c725-b947-4f88-9c58-76baeb9eb2b9.jpg',
  'albuterol': 'https://miaoda-site-img.s3cdn.medo.dev/images/1e2193a2-7751-43c3-bbaa-44d9e9acf3bc.jpg',
  
  // Steroids
  'prednisone': 'https://miaoda-site-img.s3cdn.medo.dev/images/de5a968a-7607-4b5d-afae-4e795679863c.jpg',
};

// Fallback images by medicine type
const TYPE_FALLBACK_IMAGES: Record<string, string> = {
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

/**
 * Extract medicine active ingredient from full name
 * Examples:
 * "Paracetamol 500mg Tablet" -> "paracetamol"
 * "Ibuprofen + Paracetamol" -> "ibuprofen"
 * "Amoxicillin Capsules" -> "amoxicillin"
 */
function extractActiveIngredient(medicineName: string): string | null {
  const name = medicineName.toLowerCase();
  
  // Check each known medicine name
  for (const ingredient of Object.keys(MEDICINE_NAME_IMAGES)) {
    if (name.includes(ingredient)) {
      return ingredient;
    }
  }
  
  return null;
}

/**
 * Get medicine image URL based on medicine name and type
 * Priority:
 * 1. Match by active ingredient name
 * 2. Match by medicine type
 * 3. Use default fallback
 */
export function getMedicineImage(
  medicineName: string,
  medicineType: string | null,
  manufacturer?: string | null
): string {
  // Create cache key
  const cacheKey = `${medicineName}_${manufacturer || ''}`.toLowerCase().replace(/\s+/g, '_');
  
  // Check memory cache first
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }
  
  // Try to find by active ingredient
  const ingredient = extractActiveIngredient(medicineName);
  if (ingredient && MEDICINE_NAME_IMAGES[ingredient]) {
    const imageUrl = MEDICINE_NAME_IMAGES[ingredient];
    imageCache[cacheKey] = imageUrl;
    return imageUrl;
  }
  
  // Fallback to type-based image
  const fallbackImage = getFallbackImage(medicineType);
  imageCache[cacheKey] = fallbackImage;
  
  return fallbackImage;
}

/**
 * Get fallback image based on medicine type
 */
function getFallbackImage(type: string | null): string {
  if (!type) return TYPE_FALLBACK_IMAGES.default;
  
  // Check for exact match
  if (TYPE_FALLBACK_IMAGES[type]) return TYPE_FALLBACK_IMAGES[type];
  
  // Check for partial match (case-insensitive)
  const typeKey = Object.keys(TYPE_FALLBACK_IMAGES).find(key => 
    type.toLowerCase().includes(key.toLowerCase())
  );
  
  return typeKey ? TYPE_FALLBACK_IMAGES[typeKey] : TYPE_FALLBACK_IMAGES.default;
}

/**
 * Preload images for a batch of medicines
 * This can be called when loading a page to cache images in advance
 */
export function preloadMedicineImages(
  medicines: Array<{ name: string; type: string | null; manufacturer?: string | null }>
): void {
  medicines.forEach(med => {
    getMedicineImage(med.name, med.type, med.manufacturer);
  });
}

/**
 * Clear image cache (useful for testing or when images are updated)
 */
export function clearImageCache(): void {
  Object.keys(imageCache).forEach(key => delete imageCache[key]);
}

/**
 * Get all available medicine name mappings
 * Useful for debugging or displaying available medicines
 */
export function getAvailableMedicineNames(): string[] {
  return Object.keys(MEDICINE_NAME_IMAGES);
}

/**
 * Check if a medicine has a specific image mapping
 */
export function hasMedicineImage(medicineName: string): boolean {
  const ingredient = extractActiveIngredient(medicineName);
  return ingredient !== null && MEDICINE_NAME_IMAGES[ingredient] !== undefined;
}

