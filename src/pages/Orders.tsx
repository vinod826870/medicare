import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Order } from '@/types/types';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const data = await ordersApi.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshOrder = async (order: Order) => {
    if (!order.stripe_session_id) return;

    setRefreshing(order.id);
    try {
      const result = await ordersApi.verifyPayment({ sessionId: order.stripe_session_id });
      
      if (result.verified && result.orderUpdated) {
        toast.success('Order status updated');
        await loadOrders();
      } else {
        toast.info('Payment is still pending');
      }
    } catch (error) {
      console.error('Error refreshing order:', error);
      toast.error('Failed to refresh order status');
    } finally {
      setRefreshing(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-accent" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-secondary">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-accent">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
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
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    {order.status === 'pending' && order.stripe_session_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefreshOrder(order)}
                        disabled={refreshing === order.id}
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshing === order.id ? 'animate-spin' : ''}`} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-2">
                      {item.image_url && (
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${(item.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total Amount</span>
                      <span className="text-xl font-bold text-primary">
                        ${(order.total_amount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.status === 'pending' && order.stripe_session_id && (
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Payment is pending. Click the button below to complete your payment.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          window.open(`https://checkout.stripe.com/c/pay/${order.stripe_session_id}`, '_blank');
                        }}
                      >
                        Complete Payment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
