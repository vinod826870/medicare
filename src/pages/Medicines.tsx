import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MedicineCard from '@/components/medicine/MedicineCard';
import MedicineFilters, { FilterOptions, PRICE_RANGES } from '@/components/medicine/MedicineFilters';
import { cartApi } from '@/db/api';
import { getMedicines, getMedicineTypes, getManufacturers, formatMedicineForDisplay } from '@/db/medicineDataApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Medicines = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Filter states
  const [availableManufacturers, setAvailableManufacturers] = useState<string[]>([]);
  const [availableProductForms, setAvailableProductForms] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRanges: [],
    manufacturers: [],
    productForms: []
  });

  // Load manufacturers and product forms
  useEffect(() => {
    const loadFilterOptions = async () => {
      const [manufacturers, productForms] = await Promise.all([
        getManufacturers(50),
        getMedicineTypes()
      ]);
      setAvailableManufacturers(manufacturers);
      setAvailableProductForms(productForms);
    };
    loadFilterOptions();
  }, []);

  // Calculate active filters count
  const activeFiltersCount = 
    activeFilters.priceRanges.length + 
    activeFilters.manufacturers.length + 
    activeFilters.productForms.length;

  // Load medicines with filters
  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        // Calculate price range from selected filters
        let minPrice: number | undefined;
        let maxPrice: number | undefined;
        
        if (activeFilters.priceRanges.length > 0) {
          const selectedRanges = activeFilters.priceRanges.map(label => 
            PRICE_RANGES.find(r => r.label === label)
          ).filter(Boolean);
          
          if (selectedRanges.length > 0) {
            minPrice = Math.min(...selectedRanges.map(r => r!.min));
            maxPrice = Math.max(...selectedRanges.map(r => r!.max));
          }
        }

        const result = await getMedicines({
          page: 1,
          pageSize: 20,
          search: searchQuery,
          type: activeFilters.productForms.length === 1 ? activeFilters.productForms[0] : undefined,
          minPrice,
          maxPrice,
          manufacturers: activeFilters.manufacturers,
          excludeDiscontinued: true
        });

        const formattedMedicines = result.data.map(formatMedicineForDisplay);
        setMedicines(formattedMedicines);
        setTotalCount(result.count);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Error loading medicines:', error);
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [searchQuery, activeFilters]);

  const loadMoreMedicines = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      
      // Calculate price range
      let minPrice: number | undefined;
      let maxPrice: number | undefined;
      
      if (activeFilters.priceRanges.length > 0) {
        const selectedRanges = activeFilters.priceRanges.map(label => 
          PRICE_RANGES.find(r => r.label === label)
        ).filter(Boolean);
        
        if (selectedRanges.length > 0) {
          minPrice = Math.min(...selectedRanges.map(r => r!.min));
          maxPrice = Math.max(...selectedRanges.map(r => r!.max));
        }
      }

      const result = await getMedicines({
        page: nextPage,
        pageSize: 20,
        search: searchQuery,
        type: activeFilters.productForms.length === 1 ? activeFilters.productForms[0] : undefined,
        minPrice,
        maxPrice,
        manufacturers: activeFilters.manufacturers,
        excludeDiscontinued: true
      });

      const formattedMedicines = result.data.map(formatMedicineForDisplay);
      setMedicines(prev => [...prev, ...formattedMedicines]);
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more medicines:', error);
      toast.error('Failed to load more medicines');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToCart = async (medicineId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartApi.addToCart(user.id, medicineId, 1);
      const medicine = medicines.find(m => m.id === medicineId);
      toast.success(`${medicine?.name || 'Medicine'} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Browse Medicines</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicines by name, manufacturer, or composition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <MedicineFilters
              availableManufacturers={availableManufacturers}
              availableProductForms={availableProductForms}
              onFilterChange={handleFilterChange}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Medicine Grid */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `Showing ${medicines.length} of ${totalCount} medicine${totalCount !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
                  setActiveFilters({
                    priceRanges: [],
                    manufacturers: [],
                    productForms: []
                  });
                  setSearchParams({});
                }}>
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medicines.map((medicine) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={loadMoreMedicines}
                      disabled={loadingMore}
                      size="lg"
                      variant="outline"
                    >
                      {loadingMore ? 'Loading...' : `Load More (${totalCount - medicines.length} remaining)`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
