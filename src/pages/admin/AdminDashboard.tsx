import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Pill, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { medicinesApi, ordersApi, profilesApi } from '@/db/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const loadStats = async () => {
      try {
        const [medicines, orders, users] = await Promise.all([
          medicinesApi.getAll(),
          ordersApi.getAllOrders(),
          profilesApi.getAllProfiles()
        ]);

        const revenue = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.total_amount, 0);

        const pending = orders.filter(o => o.status === 'pending').length;

        setStats({
          totalMedicines: medicines.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue: revenue / 100,
          pendingOrders: pending
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Medicines
              </CardTitle>
              <Pill className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalMedicines}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
              {stats.pendingOrders > 0 && (
                <p className="text-xs text-accent mt-1">
                  {stats.pendingOrders} pending
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/admin/medicines')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Manage Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add, edit, or remove medicines from the catalog. Update stock levels and pricing.
              </p>
              <Button className="w-full">
                Go to Medicines
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/admin/orders')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Manage Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage customer orders. Update order status and track deliveries.
              </p>
              <Button className="w-full">
                Go to Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/admin/users')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View user accounts and manage user roles and permissions.
              </p>
              <Button className="w-full">
                Go to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
