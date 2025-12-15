import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Plus } from 'lucide-react';
import { medicineApiService } from '@/services/medicineApi';
import { toast } from 'sonner';

const MedicineComparison = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await medicineApiService.getMedicines();
      const medicines = response.data || [];
      setAllMedicines(medicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allMedicines.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedMedicines.find(s => s.id === med.id)
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allMedicines, selectedMedicines]);

  const addMedicine = (medicine: any) => {
    if (selectedMedicines.length >= 3) {
      toast.error('You can compare up to 3 medicines at a time');
      return;
    }
    setSelectedMedicines([...selectedMedicines, medicine]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMedicine = (id: string) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== id));
  };

  const comparisonAttributes = [
    { key: 'name', label: 'Medicine Name' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'price', label: 'Price', format: (val: any) => `$${val.toFixed(2)}` },
    { key: 'dosage_form', label: 'Dosage Form' },
    { key: 'strength', label: 'Strength' },
    { key: 'stock_quantity', label: 'Stock Available' },
    { key: 'prescription_required', label: 'Prescription Required', format: (val: any) => val ? 'Yes' : 'No' },
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

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search medicines to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => addMedicine(medicine)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={medicine.image_url}
                        alt={medicine.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
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
              <p className="text-muted-foreground">Search and add medicines to start comparing</p>
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
                      <th className="text-left p-4 font-semibold">Attribute</th>
                      {selectedMedicines.map((medicine) => (
                        <th key={medicine.id} className="text-left p-4 font-semibold min-w-[200px]">
                          <div className="flex flex-col gap-2">
                            <img
                              src={medicine.image_url}
                              alt={medicine.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonAttributes.map((attr) => (
                      <tr key={attr.key} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{attr.label}</td>
                        {selectedMedicines.map((medicine) => (
                          <td key={medicine.id} className="p-4">
                            {attr.format
                              ? attr.format(medicine[attr.key])
                              : medicine[attr.key] || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineComparison;
