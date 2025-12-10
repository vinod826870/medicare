import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MedicineWithCategory } from '@/types/types';

interface MedicineCardProps {
  medicine: MedicineWithCategory;
  onAddToCart?: (medicine: MedicineWithCategory) => void;
}

const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
        onClick={() => navigate(`/medicines/${medicine.id}`)}
      >
        {medicine.image_url ? (
          <img
            src={medicine.image_url}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-muted-foreground">💊</span>
          </div>
        )}
        {medicine.prescription_required && (
          <Badge className="absolute top-2 right-2 bg-accent">
            Prescription Required
          </Badge>
        )}
        {medicine.stock_quantity === 0 && (
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
          {medicine.category && (
            <Badge variant="outline" className="mb-2 text-xs">
              {medicine.category.name}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {medicine.description || 'No description available'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${medicine.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {medicine.stock_quantity > 0 ? (
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(medicine)}
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
