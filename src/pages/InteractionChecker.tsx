import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Plus, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { featuresApi } from '@/db/api';
import { medicineApiService, type MedicineApiData } from '@/services/medicineApi';
import type { MedicineInteraction } from '@/types/types';

export default function InteractionChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineApiData[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineApiData[]>([]);
  const [interactions, setInteractions] = useState<MedicineInteraction[]>([]);
  const [searching, setSearching] = useState(false);
  const [checking, setChecking] = useState(false);

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
      console.log('🔍 Searching for:', searchTerm);
      const results = await medicineApiService.searchMedicines(searchTerm, 20);
      console.log('✅ Search results:', results.length, 'medicines found');
      if (results.length > 0) {
        console.log('First result:', results[0]);
      }
      setSearchResults(results);
    } catch (error) {
      console.error('❌ Error searching medicines:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addMedicine = (medicine: MedicineApiData) => {
    if (!selectedMedicines.find(m => m.id === medicine.id)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const removeMedicine = (medicineId: string) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== medicineId));
    setInteractions([]);
  };

  const checkInteractions = async () => {
    if (selectedMedicines.length < 2) return;

    setChecking(true);
    
    // Filter out medicines with non-numeric IDs (local data)
    const validMedicines = selectedMedicines.filter(m => {
      const numericId = parseInt(m.id);
      return !isNaN(numericId) && numericId > 0;
    });
    
    console.log('🔍 Checking interactions for medicines:', selectedMedicines.map(m => ({ id: m.id, name: m.name })));
    console.log('✅ Valid medicines (numeric IDs):', validMedicines.length, 'out of', selectedMedicines.length);
    
    // If we have local medicines (non-numeric IDs), show a message
    if (validMedicines.length < selectedMedicines.length) {
      const localMedicines = selectedMedicines.filter(m => isNaN(parseInt(m.id)));
      console.warn('⚠️ Some medicines have local IDs and cannot be checked:', localMedicines.map(m => m.name));
    }
    
    if (validMedicines.length < 2) {
      console.warn('⚠️ Need at least 2 medicines with database IDs to check interactions');
      setInteractions([]);
      setChecking(false);
      return;
    }
    
    const medicineIds = validMedicines.map(m => parseInt(m.id));
    console.log('📡 Calling API with medicine IDs:', medicineIds);
    
    try {
      const results = await featuresApi.checkMedicineInteractions(medicineIds);
      console.log('✅ Interaction check results:', results.length, 'interactions found');
      setInteractions(results);
    } catch (error) {
      console.error('❌ Error checking interactions:', error);
      setInteractions([]);
    } finally {
      setChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'mild':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
        return <XCircle className="h-5 w-5" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5" />;
      case 'mild':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground mb-2">
            Medicine Interaction Checker
          </h1>
          <p className="text-muted-foreground">
            Check if your medicines can be safely taken together
          </p>
        </div>

        {/* Warning */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Medical Disclaimer:</strong> This tool provides general information about potential drug interactions. 
            Always consult your doctor or pharmacist before taking multiple medications together.
          </AlertDescription>
        </Alert>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Medicine Selection */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Add Medicines</CardTitle>
                <CardDescription>
                  Search and add medicines to check for interactions
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
                        onClick={() => addMedicine(medicine)}
                        disabled={selectedMedicines.some(m => m.id === medicine.id)}
                        className="w-full p-3 text-left hover:bg-primary/5 border-b border-border last:border-b-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="font-medium text-foreground">
                          {medicine.name}
                          {selectedMedicines.some(m => m.id === medicine.id) && (
                            <Badge variant="secondary" className="ml-2">Added</Badge>
                          )}
                        </div>
                        {medicine.manufacturer && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {medicine.manufacturer}
                          </div>
                        )}
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

            {/* Interaction Results */}
            {selectedMedicines.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interaction Results</CardTitle>
                  <CardDescription>
                    {interactions.length === 0 && !checking
                      ? 'Click "Check Interactions" to see results'
                      : checking
                      ? 'Checking for interactions...'
                      : `Found ${interactions.length} potential interaction(s)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {interactions.length === 0 && !checking ? (
                    <div className="text-center py-8">
                      <Button onClick={checkInteractions} size="lg">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Check Interactions
                      </Button>
                    </div>
                  ) : checking ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Analyzing medicine combinations...
                    </div>
                  ) : interactions.length === 0 ? (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Good news!</strong> No known interactions found between the selected medicines.
                          However, always consult your healthcare provider.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Note for Administrators:</strong> Interaction data is managed through the Admin Panel. 
                          You can add more medicine interactions via Admin Panel → Interactions.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {interactions.map((interaction: any) => (
                        <Alert
                          key={interaction.id}
                          className={getSeverityColor(interaction.severity)}
                        >
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(interaction.severity)}
                            <div className="flex-1">
                              <div className="font-semibold mb-1 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {interaction.severity.toUpperCase()}
                                </Badge>
                                Interaction Detected
                              </div>
                              <div className="text-sm mb-2">
                                <strong>{interaction.medicine_a?.name}</strong> and{' '}
                                <strong>{interaction.medicine_b?.name}</strong>
                              </div>
                              <div className="text-sm mb-2">{interaction.description}</div>
                              <div className="text-sm font-medium">
                                Recommendation: {interaction.recommendation}
                              </div>
                            </div>
                          </div>
                        </Alert>
                      ))}
                      <Button onClick={checkInteractions} variant="outline" className="w-full">
                        Re-check Interactions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Selected Medicines */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Medicines</CardTitle>
                <CardDescription>
                  {selectedMedicines.length} medicine(s) selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMedicines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Add at least 2 medicines to check for interactions
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-start justify-between gap-2 p-3 rounded-lg border border-border bg-card"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            {medicine.name}
                          </div>
                          {medicine.manufacturer && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {medicine.manufacturer}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeMedicine(medicine.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
