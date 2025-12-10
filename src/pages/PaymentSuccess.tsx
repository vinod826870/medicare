import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ordersApi } from '@/db/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No payment session found');
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const result = await ordersApi.verifyPayment({ sessionId });
        
        if (result.verified) {
          setVerified(true);
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Verifying Payment</h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your payment...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'There was an issue processing your payment. Please try again.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/cart')}>
              Back to Cart
            </Button>
            <Button onClick={() => navigate('/orders')}>
              View Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-12 text-center max-w-md">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. Your medicines will be delivered soon.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
          <Button onClick={() => navigate('/orders')}>
            View Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
