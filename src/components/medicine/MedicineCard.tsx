import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, Star, Pill } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MedicineApiData } from '@/services/medicineApi';

interface MedicineCardProps {
  medicine: MedicineApiData;
  onAddToCart?: (medicineId: string) => void;
}

const DEFAULT_MEDICINE_IMAGE = 'https://miaoda-site-img.s3cdn.medo.dev/images/d0b123ac-13ae-44fb-9df3-d9f032fe53de.jpg';

const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.log('❌ Image failed to load for:', medicine.name, 'URL:', medicine.image_url);
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully for:', medicine.name, 'URL:', medicine.image_url);
    setImageLoaded(true);
  };

  const displayImage = imageError ? DEFAULT_MEDICINE_IMAGE : (medicine.image_url || DEFAULT_MEDICINE_IMAGE);
  
  // Log medicine data for debugging
  console.log('Medicine Card:', {
    name: medicine.name,
    image_url: medicine.image_url,
    rxcui: medicine.rxcui,
    hasImage: !!medicine.image_url,
    isDefault: medicine.image_url === DEFAULT_MEDICINE_IMAGE
  });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
        onClick={() => navigate(`/medicines/${medicine.id}`)}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Pill className="w-16 h-16 text-muted-foreground/30 animate-pulse" />
          </div>
        )}
        <img
          src={displayImage}
          alt={medicine.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        {medicine.prescription_required && (
          <Badge className="absolute top-2 right-2 bg-accent">
            Rx Required
          </Badge>
        )}
        {!medicine.stock_available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/medicines/${medicine.id}`)}
        >
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {medicine.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {medicine.description}
          </p>
          {medicine.rating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{medicine.rating.toFixed(1)}</span>
              {medicine.reviews_count && (
                <span className="text-xs">({medicine.reviews_count})</span>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground mb-3">
            By {medicine.manufacturer}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${medicine.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {medicine.stock_available ? (
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(medicine.id)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <Button className="w-full" disabled>
            <AlertCircle className="w-4 h-4 mr-2" />
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
