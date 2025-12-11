import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ordersApi, cartApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PaymentData {
  items: Array<{
    medicine_id: string;
    medicine_name: string;
    quantity: number;
    price_at_purchase: number;
  }>;
  total_amount: number;
  shipping_address: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentData = location.state as PaymentData;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!paymentData || !paymentData.items || paymentData.items.length === 0) {
      toast.error('No items to checkout');
      navigate('/cart');
    }
  }, [user, paymentData, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !paymentData) return;

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success animation
      setPaymentSuccess(true);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order in database
      await ordersApi.createOrder({
        user_id: user.id,
        total_amount: paymentData.total_amount,
        status: 'pending',
        shipping_address: paymentData.shipping_address,
        items: paymentData.items
      });

      // Clear cart
      await cartApi.clearCart(user.id);

      toast.success('Payment successful! Order placed.');
      navigate('/orders');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentSuccess(false);
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentData) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully.
            </p>
            <div className="animate-pulse text-sm text-muted-foreground">
              Redirecting to orders...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your payment to place the order
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Payment Form */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Payment Information
                </CardTitle>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> This is a simulated payment for demonstration purposes. 
                    No real payment will be processed.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="cursor-pointer flex-1">
                          UPI Payment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="cursor-pointer flex-1">
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details (shown for card payment) */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          defaultValue="4242 4242 4242 4242"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            defaultValue="12/25"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            defaultValue="123"
                            maxLength={3}
                            type="password"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          defaultValue="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {paymentMethod === 'upi' && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        defaultValue="demo@upi"
                        required
                      />
                    </div>
                  )}

                  {/* COD Message */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        You will pay <strong>${paymentData.total_amount.toFixed(2)}</strong> in cash when your order is delivered.
                      </p>
                    </div>
                  )}

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Address</h3>
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        defaultValue="123 Main Street"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          defaultValue="New York"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          defaultValue="10001"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${paymentData.total_amount.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {paymentData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.medicine_name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      ${paymentData.items.reduce((sum, item) => 
                        sum + (item.price_at_purchase * item.quantity), 0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {paymentData.items.reduce((sum, item) => 
                        sum + (item.price_at_purchase * item.quantity), 0
                      ) > 50 ? 'FREE' : '$5.99'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${paymentData.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Lock className="w-4 h-4" />
                    <span>Secure SSL Encrypted Payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
