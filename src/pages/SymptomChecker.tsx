import { useState, useEffect } from 'react';
import { Search, AlertCircle, Pill, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { featuresApi } from '@/db/api';
import { medicineApiService } from '@/services/medicineApi';
import type { Symptom, MedicineData } from '@/types/types';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [suggestedMedicines, setSuggestedMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    setLoading(true);
    const data = await featuresApi.getAllSymptoms();
    setSymptoms(data);
    setLoading(false);
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setSearching(true);
    const results = await featuresApi.getMedicinesBySymptoms(selectedSymptoms);
    setSuggestedMedicines(results);
    setSearching(false);
  };

  const groupedSymptoms = symptoms.reduce((acc, symptom) => {
    const category = symptom.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(symptom);
    return acc;
  }, {} as Record<string, Symptom[]>);

  const filteredSymptoms = searchTerm
    ? symptoms.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : symptoms;

  const filteredGroupedSymptoms = filteredSymptoms.reduce((acc, symptom) => {
    const category = symptom.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(symptom);
    return acc;
  }, {} as Record<string, Symptom[]>);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground mb-2">
            Symptom Checker
          </h1>
          <p className="text-muted-foreground">
            Select your symptoms to get medicine suggestions
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertCircle className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> This tool provides general information only and should not replace professional medical advice. 
            Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </AlertDescription>
        </Alert>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Symptoms Selection */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Symptoms</CardTitle>
                <CardDescription>
                  Choose one or more symptoms you're experiencing
                </CardDescription>
                
                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading symptoms...
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(filteredGroupedSymptoms).map(([category, categorySymptoms]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {categorySymptoms.map((symptom) => (
                            <label
                              key={symptom.id}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={selectedSymptoms.includes(symptom.id)}
                                onCheckedChange={() => handleSymptomToggle(symptom.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-foreground">{symptom.name}</div>
                                {symptom.description && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {symptom.description}
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Symptoms & Results */}
          <div className="space-y-6">
            {/* Selected Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSymptoms.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No symptoms selected
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(id => {
                        const symptom = symptoms.find(s => s.id === id);
                        return symptom ? (
                          <Badge key={id} variant="secondary" className="text-sm">
                            {symptom.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    <Button 
                      onClick={handleCheckSymptoms}
                      disabled={searching}
                      className="w-full"
                    >
                      {searching ? 'Searching...' : 'Find Medicines'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Medicines */}
            {suggestedMedicines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Medicines</CardTitle>
                  <CardDescription>
                    Based on your symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestedMedicines.slice(0, 10).map((item: any) => (
                      <Link
                        key={item.id}
                        to={`/medicines/${item.medicine.id}`}
                        className="block p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {item.medicine.name}
                            </div>
                            {item.medicine.type && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.medicine.type}
                              </div>
                            )}
                            {item.medicine.price && (
                              <div className="text-sm font-semibold text-primary mt-1">
                                ₹{item.medicine.price}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
