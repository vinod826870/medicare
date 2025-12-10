import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cartApi, ordersApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CartItemWithMedicine } from '@/types/types';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      const items = await cartApi.getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await cartApi.updateQuantity(itemId, newQuantity);
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeFromCart(itemId);
      setCartItems(items => items.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    setProcessingCheckout(true);
    try {
      const checkoutItems = cartItems.map(item => ({
        name: item.medicine?.name || 'Unknown',
        price: item.medicine?.price || 0,
        quantity: item.quantity,
        image_url: item.medicine?.image_url || undefined
      }));

      const response = await ordersApi.createCheckout({
        items: checkoutItems,
        currency: 'usd',
        payment_method_types: ['card']
      });

      window.open(response.url, '_blank');
      
      await cartApi.clearCart(user.id);
      setCartItems([]);
      
      toast.success('Redirecting to payment...');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session. Please ensure STRIPE_SECRET_KEY is configured.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.medicine?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some medicines to your cart to get started
          </p>
          <Button onClick={() => navigate('/medicines')}>
            Browse Medicines
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.medicine?.image_url ? (
                        <img
                          src={item.medicine.image_url}
                          alt={item.medicine.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">💊</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-foreground mb-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/medicines/${item.medicine_id}`)}
                      >
                        {item.medicine?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        ${item.medicine?.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, Math.max(1, val));
                          }}
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.medicine?.stock_quantity || 0)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="font-bold text-foreground">
                        ${((item.medicine?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={processingCheckout}
                >
                  {processingCheckout ? (
                    'Processing...'
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure payment powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
