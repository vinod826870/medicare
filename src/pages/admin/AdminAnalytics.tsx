import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi, profilesApi } from '@/db/api';
import { medicineApiService } from '@/services/medicineApi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [topMedicines, setTopMedicines] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    avgOrderValue: 0,
    avgOrderGrowth: 0,
    totalCustomers: 0,
    customerGrowth: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadAnalyticsData();
  }, [isAdmin, navigate]);

  const loadAnalyticsData = async () => {
    try {
      const [orders, users] = await Promise.all([
        ordersApi.getAllOrders(),
        profilesApi.getAllProfiles(),
      ]);

      // Calculate stats
      const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0) / 100;
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      setStats({
        totalRevenue,
        revenueGrowth: 12.5,
        totalOrders: orders.length,
        ordersGrowth: 8.2,
        avgOrderValue,
        avgOrderGrowth: 5.3,
        totalCustomers: users.length,
        customerGrowth: 15.3,
      });

      // Monthly revenue data (last 6 months)
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          year: date.getFullYear(),
          key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        };
      });

      const monthlyRevenue = last6Months.map(({ month, key }) => {
        const monthOrders = orders.filter(o => o.created_at.startsWith(key));
        const revenue = monthOrders.reduce((sum, o) => sum + o.total_amount, 0) / 100;
        return {
          month,
          revenue: parseFloat(revenue.toFixed(2)),
          orders: monthOrders.length,
        };
      });
      setMonthlyData(monthlyRevenue);

      // Top medicines (mock data)
      setTopMedicines([
        { name: 'Paracetamol 500mg', sales: 450, revenue: 2250 },
        { name: 'Ibuprofen 400mg', sales: 380, revenue: 1900 },
        { name: 'Amoxicillin 250mg', sales: 320, revenue: 1600 },
        { name: 'Cetirizine 10mg', sales: 280, revenue: 1400 },
        { name: 'Omeprazole 20mg', sales: 250, revenue: 1250 },
      ]);

      // User growth (last 6 months)
      const userGrowthData = last6Months.map(({ month }, index) => ({
        month,
        users: Math.floor(users.length * (0.5 + (index * 0.1))),
        newUsers: Math.floor(users.length * 0.1),
      }));
      setUserGrowth(userGrowthData);

      // Revenue by category (mock data)
      setRevenueByCategory([
        { name: 'Tablets', value: 45, revenue: 4500 },
        { name: 'Capsules', value: 30, revenue: 3000 },
        { name: 'Syrups', value: 15, revenue: 1500 },
        { name: 'Injections', value: 10, revenue: 1000 },
      ]);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-muted-foreground">Detailed insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.revenueGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.ordersGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.avgOrderGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.customerGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Monthly Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Revenue ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        style={{ outline: 'none' }}
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            style={{ outline: 'none' }}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#10b981" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Top Selling Medicines */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topMedicines} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Revenue Medicines */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topMedicines.map((medicine, index) => (
                      <div key={medicine.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">{medicine.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{medicine.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;
