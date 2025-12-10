import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import MedicineCard from '@/components/medicine/MedicineCard';
import { medicinesApi, cartApi, categoriesApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { MedicineWithCategory, Category } from '@/types/types';

const Medicines = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState<MedicineWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<boolean | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        
        if (selectedCategory && selectedCategory !== 'all') {
          filters.categoryId = selectedCategory;
        }
        
        if (searchQuery) {
          filters.search = searchQuery;
        }
        
        if (prescriptionFilter !== undefined) {
          filters.prescriptionRequired = prescriptionFilter;
        }

        const data = await medicinesApi.getAll(filters);
        setMedicines(data);
      } catch (error) {
        console.error('Error loading medicines:', error);
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [selectedCategory, searchQuery, prescriptionFilter]);

  const handleAddToCart = async (medicine: MedicineWithCategory) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartApi.addToCart(user.id, medicine.id, 1);
      toast.success(`${medicine.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (value !== 'all') params.set('category', value);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Browse Medicines</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="xl:hidden"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex gap-4 items-center">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className={`flex gap-4 ${showFilters ? 'flex' : 'hidden xl:flex'}`}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="prescription"
                  checked={prescriptionFilter === true}
                  onCheckedChange={(checked) => 
                    setPrescriptionFilter(checked ? true : undefined)
                  }
                />
                <Label htmlFor="prescription" className="text-sm cursor-pointer">
                  Prescription Only
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="otc"
                  checked={prescriptionFilter === false}
                  onCheckedChange={(checked) => 
                    setPrescriptionFilter(checked ? false : undefined)
                  }
                />
                <Label htmlFor="otc" className="text-sm cursor-pointer">
                  Over-the-Counter
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${medicines.length} medicine${medicines.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No medicines found matching your criteria</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPrescriptionFilter(undefined);
              setSearchParams({});
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
