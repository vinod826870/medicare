import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Plus, Filter } from 'lucide-react';
import { getMedicines } from '@/db/medicineDataApi';
import type { MedicineData } from '@/types/types';
import { toast } from 'sonner';

const MedicineComparison = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allMedicines, setAllMedicines] = useState<MedicineData[]>([]);
  const [searchResults, setSearchResults] = useState<MedicineData[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterManufacturer, setFilterManufacturer] = useState<string>('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableManufacturers, setAvailableManufacturers] = useState<string[]>([]);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await getMedicines({ 
        page: 1, 
        pageSize: 1000,
        excludeDiscontinued: false 
      });
      const medicines = response.data || [];
      setAllMedicines(medicines);
      
      // Extract unique types and manufacturers for filters
      const types = [...new Set(medicines.map((m: MedicineData) => m.type).filter(Boolean))];
      const manufacturers = [...new Set(medicines.map((m: MedicineData) => m.manufacturer_name).filter(Boolean))];
      
      setAvailableTypes(types as string[]);
      setAvailableManufacturers(manufacturers as string[]);
    } catch (error) {
      console.error('Error loading medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() || filterType !== 'all' || filterManufacturer !== 'all') {
      let filtered = allMedicines;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(med =>
          med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.manufacturer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.short_composition1?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply type filter
      if (filterType !== 'all') {
        filtered = filtered.filter(med => med.type === filterType);
      }

      // Apply manufacturer filter
      if (filterManufacturer !== 'all') {
        filtered = filtered.filter(med => med.manufacturer_name === filterManufacturer);
      }

      // Exclude already selected medicines
      filtered = filtered.filter(med => !selectedMedicines.find(s => s.id === med.id));

      setSearchResults(filtered.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, filterType, filterManufacturer, allMedicines, selectedMedicines]);

  const addMedicine = (medicine: MedicineData) => {
    if (selectedMedicines.length >= 3) {
      toast.error('You can compare up to 3 medicines at a time');
      return;
    }
    setSelectedMedicines([...selectedMedicines, medicine]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMedicine = (id: number) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== id));
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterManufacturer('all');
    setSearchQuery('');
  };

  const comparisonAttributes: Array<{
    key: string;
    label: string;
    format?: (val: any) => string;
  }> = [
    { key: 'name', label: 'Medicine Name' },
    { key: 'manufacturer_name', label: 'Manufacturer' },
    { 
      key: 'price', 
      label: 'Price', 
      format: (val: number | null) => val ? `₹${val.toFixed(2)}` : 'N/A' 
    },
    { key: 'type', label: 'Type' },
    { key: 'pack_size_label', label: 'Pack Size' },
    { key: 'short_composition1', label: 'Composition' },
    { key: 'salt_composition', label: 'Salt Composition' },
    { 
      key: 'is_discontinued', 
      label: 'Status', 
      format: (val: boolean | null) => val ? 'Discontinued' : 'Available' 
    },
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Medicine Comparison</h1>
          <p className="text-muted-foreground">Compare up to 3 medicines side by side</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search medicines by name, manufacturer, or composition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <div className="flex flex-col xl:flex-row gap-4 flex-1">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {availableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="All Manufacturers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Manufacturers</SelectItem>
                      {availableManufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(filterType !== 'all' || filterManufacturer !== 'all' || searchQuery) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => addMedicine(medicine)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{medicine.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {medicine.manufacturer_name && (
                          <span className="text-sm text-muted-foreground">
                            {medicine.manufacturer_name}
                          </span>
                        )}
                        {medicine.type && (
                          <Badge variant="outline" className="text-xs">
                            {medicine.type}
                          </Badge>
                        )}
                        {medicine.price && (
                          <span className="text-sm font-semibold text-primary">
                            ₹{medicine.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="mt-4 text-center py-4 text-muted-foreground">
                No medicines found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Medicines */}
        {selectedMedicines.length > 0 && (
          <div className="mb-6 flex gap-3 flex-wrap">
            {selectedMedicines.map((medicine) => (
              <Badge key={medicine.id} variant="secondary" className="px-3 py-2 text-sm">
                {medicine.name}
                <button
                  onClick={() => removeMedicine(medicine.id)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {selectedMedicines.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No medicines selected</h3>
              <p className="text-muted-foreground text-center">
                Search and add medicines to start comparing their details side by side
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold bg-muted/50">Attribute</th>
                      {selectedMedicines.map((medicine) => (
                        <th key={medicine.id} className="text-left p-4 font-semibold min-w-[250px]">
                          <div className="flex flex-col gap-2">
                            <span className="text-base">{medicine.name}</span>
                            {medicine.manufacturer_name && (
                              <span className="text-sm font-normal text-muted-foreground">
                                {medicine.manufacturer_name}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonAttributes.map((attr, index) => (
                      <tr 
                        key={attr.key} 
                        className={`border-b hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
                      >
                        <td className="p-4 font-medium bg-muted/50">{attr.label}</td>
                        {selectedMedicines.map((medicine) => {
                          const value = medicine[attr.key as keyof MedicineData];
                          return (
                            <td key={medicine.id} className="p-4">
                              {attr.format
                                ? attr.format(value as any)
                                : value || 'N/A'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Additional Details Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {selectedMedicines.map((medicine) => (
                <Card key={medicine.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medicine.side_effects && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Side Effects</h4>
                        <p className="text-sm text-muted-foreground">{medicine.side_effects}</p>
                      </div>
                    )}
                    {medicine.drug_interactions && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Drug Interactions</h4>
                        <p className="text-sm text-muted-foreground">{medicine.drug_interactions}</p>
                      </div>
                    )}
                    {!medicine.side_effects && !medicine.drug_interactions && (
                      <p className="text-sm text-muted-foreground">
                        No additional information available
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineComparison;
