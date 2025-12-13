import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Truck, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MedicineCard from '@/components/medicine/MedicineCard';
import { cartApi } from '@/db/api';
import { medicineApiService, type MedicineApiData, type MedicineCategory } from '@/services/medicineApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredMedicines, setFeaturedMedicines] = useState<MedicineApiData[]>([]);
  const [categories, setCategories] = useState<MedicineCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(4); // Show only 4 cards initially

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await medicineApiService.getCategories();
        setCategories(categoriesData);
        
        // Load featured medicines in background
        medicineApiService.getFeaturedMedicines(8).then(medicinesData => {
          setFeaturedMedicines(medicinesData);
          setLoading(false);
        }).catch(error => {
          console.error('Error loading medicines:', error);
          toast.error('Failed to load medicines');
          setLoading(false);
        });
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = async (medicineId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartApi.addToCart(user.id, medicineId, 1);
      const medicine = featuredMedicines.find(m => m.id === medicineId);
      toast.success(`${medicine?.name || 'Medicine'} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section 
        className="relative bg-cover bg-center py-20 xl:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://miaoda-site-img.s3cdn.medo.dev/images/a7e3e21e-faf5-4792-b602-cda30c9c8ff5.jpg')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl xl:text-6xl font-bold text-white mb-6">
              Your Trusted Online Pharmacy
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Quality medicines delivered to your doorstep. Safe, affordable, and convenient healthcare solutions.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white"
                />
              </div>
              <Button type="submit" size="lg" className="h-12">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Verified Quality</h3>
                <p className="text-sm text-muted-foreground">All medicines are sourced from licensed manufacturers</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Quick and secure delivery to your location</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Round-the-clock customer service available</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">Safe and encrypted payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Browse our wide range of healthcare products</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => navigate(`/medicines?category=${category.id}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-3xl">💊</span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Medicines</h2>
              <p className="text-muted-foreground">Popular and trusted healthcare products</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/medicines')}
              className="hidden xl:flex"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredMedicines.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Loading medicines from API...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments on first load</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredMedicines.slice(0, displayCount).map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              {displayCount < featuredMedicines.length && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={() => setDisplayCount(prev => Math.min(prev + 4, featuredMedicines.length))}
                    variant="outline"
                    size="lg"
                  >
                    Load More ({featuredMedicines.length - displayCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8 xl:hidden">
            <Button onClick={() => navigate('/medicines')}>
              View All Medicines
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-8 xl:p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Need Help Finding the Right Medicine?
            </h2>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Our healthcare professionals are here to assist you. Get expert advice and recommendations for your health needs.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
