import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, AlertCircle, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { medicinesApi, cartApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { MedicineWithCategory } from '@/types/types';

const MedicineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<MedicineWithCategory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      medicinesApi.getById(id).then((data) => {
        setMedicine(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    if (!medicine) return;

    try {
      await cartApi.addToCart(user.id, medicine.id, quantity);
      toast.success(`${medicine.name} added to cart`);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Medicine Not Found</h2>
          <p className="text-muted-foreground mb-4">The medicine you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/medicines')}>Browse Medicines</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {medicine.image_url ? (
              <img
                src={medicine.image_url}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Pill className="w-32 h-32 text-muted-foreground" />
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              {medicine.category && (
                <Badge variant="outline" className="mb-2">
                  {medicine.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {medicine.name}
              </h1>
              {medicine.prescription_required && (
                <Badge className="bg-accent">
                  Prescription Required
                </Badge>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">
                  ${medicine.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Package className="w-4 h-4" />
                <span>
                  {medicine.stock_quantity > 0 
                    ? `${medicine.stock_quantity} units in stock` 
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Product Details</h3>
                <div className="space-y-3">
                  {medicine.manufacturer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manufacturer:</span>
                      <span className="font-medium">{medicine.manufacturer}</span>
                    </div>
                  )}
                  {medicine.dosage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="font-medium">{medicine.dosage}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {medicine.prescription_required ? 'Prescription' : 'Over-the-Counter'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {medicine.description && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{medicine.description}</p>
                </CardContent>
              </Card>
            )}

            {medicine.stock_quantity > 0 ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity" className="mb-2 block">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={medicine.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(medicine.stock_quantity, parseInt(e.target.value) || 1)))}
                    className="w-32"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            ) : (
              <Button size="lg" className="w-full" disabled>
                <AlertCircle className="w-5 h-5 mr-2" />
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
