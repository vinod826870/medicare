import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { cartApi } from '@/db/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (item: any) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartApi.addToCart(user.id, item.id, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">Save your favorite medicines for later</p>
        </div>

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">Start adding medicines you love!</p>
              <Button onClick={() => navigate('/medicines')}>Browse Medicines</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.manufacturer}</p>
                  <p className="text-2xl font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAddToCart(item)} className="flex-1">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => removeFromWishlist(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
