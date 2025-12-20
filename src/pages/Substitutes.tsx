import { useState, useEffect } from 'react';
import { Search, TrendingDown, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { featuresApi } from '@/db/api';
import { medicineApiService, type MedicineApiData } from '@/services/medicineApi';
import type { SubstituteWithDetails } from '@/types/types';

export default function Substitutes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineApiData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineApiData | null>(null);
  const [substitutes, setSubstitutes] = useState<SubstituteWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchMedicines();
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  const searchMedicines = async () => {
    setSearching(true);
    try {
      const results = await medicineApiService.searchMedicines(searchTerm, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching medicines:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectMedicine = async (medicine: MedicineApiData) => {
    setSelectedMedicine(medicine);
    setSearchTerm('');
    setSearchResults([]);
    setLoading(true);
    const subs = await featuresApi.getMedicineSubstitutes(parseInt(medicine.id));
    setSubstitutes(subs);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground mb-2">
            Medicine Substitutes Finder
          </h1>
          <p className="text-muted-foreground">
            Find cheaper generic alternatives and substitutes
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Info className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Note:</strong> Substitutes shown here have similar active ingredients. 
            Always consult your doctor before switching medications.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search for a Medicine</CardTitle>
            <CardDescription>
              Find substitutes and generic alternatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type at least 2 characters to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Loading State */}
            {searching && searchTerm.length >= 2 && (
              <div className="mt-4 p-4 text-center text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Searching medicines...
                </div>
              </div>
            )}

            {/* No Results */}
            {!searching && searchTerm.length >= 2 && searchResults.length === 0 && (
              <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  <strong>No medicines found for "{searchTerm}"</strong>
                  <div className="mt-2 space-y-1">
                    <p>Possible reasons:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>The medicine_data table may not be populated yet</li>
                      <li>Try searching with a different spelling or generic name</li>
                      <li>Check if your Supabase database is connected</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      <strong>For administrators:</strong> Please ensure the medicine_data table 
                      is populated with medicine records and the search_medicines RPC function exists.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Search Results */}
            {!searching && searchResults.length > 0 && (
              <div className="mt-4 border border-border rounded-md max-h-64 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <button
                    key={medicine.id}
                    onClick={() => selectMedicine(medicine)}
                    className="w-full p-3 text-left hover:bg-primary/5 border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-foreground">{medicine.name}</div>
                    <div className="flex items-center gap-4 mt-1">
                      {medicine.manufacturer && (
                        <span className="text-sm text-muted-foreground">
                          {medicine.manufacturer}
                        </span>
                      )}
                      {medicine.price && (
                        <span className="text-sm font-semibold text-primary">
                          ₹{medicine.price}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Hint */}
            {searchTerm.length > 0 && searchTerm.length < 2 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
                Type at least 2 characters to start searching
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Medicine & Substitutes */}
        {selectedMedicine && (
          <div className="space-y-6">
            {/* Original Medicine */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Medicine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {selectedMedicine.name}
                    </h3>
                    {selectedMedicine.manufacturer && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedMedicine.manufacturer}
                      </p>
                    )}
                    {selectedMedicine.composition && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedMedicine.composition}
                      </p>
                    )}
                  </div>
                  {selectedMedicine.price && (
                    <div className="text-2xl font-bold text-primary">
                      ₹{selectedMedicine.price}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Substitutes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Substitutes</CardTitle>
                <CardDescription>
                  {loading
                    ? 'Searching for substitutes...'
                    : substitutes.length === 0
                    ? 'No substitutes found'
                    : `Found ${substitutes.length} substitute(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading substitutes...
                  </div>
                ) : substitutes.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No substitutes available for this medicine yet</p>
                    <Alert className="max-w-md mx-auto text-left">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Note:</strong> Substitute data is managed by administrators. 
                        If you're an admin, you can add substitutes through the Admin Panel → Substitutes section.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {substitutes.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">
                                  {sub.substitute_medicine?.name}
                                </h4>
                                {sub.substitute_medicine?.manufacturer && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {sub.substitute_medicine.manufacturer}
                                  </p>
                                )}
                                <div className="mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {sub.reason}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col xl:items-end gap-2">
                            {sub.substitute_medicine?.price && (
                              <div className="text-xl font-bold text-primary">
                                ₹{sub.substitute_medicine.price}
                              </div>
                            )}
                            {sub.price_difference && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Save ₹{Math.abs(sub.price_difference)}
                              </Badge>
                            )}
                            <Link to={`/medicines/${sub.substitute_medicine?.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
