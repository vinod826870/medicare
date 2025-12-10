import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MedicineApiData } from '@/services/medicineApi';

interface MedicineCardProps {
  medicine: MedicineApiData;
  onAddToCart?: (medicineId: string) => void;
}

const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
        onClick={() => navigate(`/medicines/${medicine.id}`)}
      >
        <img
          src={medicine.image_url}
          alt={medicine.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
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
