import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { featuresApi } from '@/db/api';
import { medicineApiService, type MedicineApiData } from '@/services/medicineApi';

interface SubstituteFormData {
  original_medicine_id: string;
  substitute_medicine_id: string;
  price_difference: string;
  notes: string;
}

export default function AdminSubstitutes() {
  // State management for substitutes list and UI
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubstitute, setEditingSubstitute] = useState<any | null>(null);
  
  // Separate medicine lists for each search field
  const [originalMedicines, setOriginalMedicines] = useState<MedicineApiData[]>([]);
  const [substituteMedicines, setSubstituteMedicines] = useState<MedicineApiData[]>([]);
  const [originalSearch, setOriginalSearch] = useState('');
  const [substituteSearch, setSubstituteSearch] = useState('');
  const [searchingOriginal, setSearchingOriginal] = useState(false);
  const [searchingSubstitute, setSearchingSubstitute] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<SubstituteFormData>({
    defaultValues: {
      original_medicine_id: '',
      substitute_medicine_id: '',
      price_difference: '0',
      notes: ''
    }
  });

  useEffect(() => {
    loadSubstitutes();
  }, []);

  useEffect(() => {
    if (originalSearch.length >= 2) {
      searchOriginalMedicines();
    } else {
      setOriginalMedicines([]);
    }
  }, [originalSearch]);

  useEffect(() => {
    if (substituteSearch.length >= 2) {
      searchSubstituteMedicines();
    } else {
      setSubstituteMedicines([]);
    }
  }, [substituteSearch]);

  const loadSubstitutes = async () => {
    setLoading(true);
    const data = await featuresApi.getAllSubstitutes();
    setSubstitutes(data);
    setLoading(false);
  };

  const searchOriginalMedicines = async () => {
    setSearchingOriginal(true);
    const results = await medicineApiService.searchMedicines(originalSearch, 50);
    setOriginalMedicines(results);
    setSearchingOriginal(false);
  };

  const searchSubstituteMedicines = async () => {
    setSearchingSubstitute(true);
    const results = await medicineApiService.searchMedicines(substituteSearch, 50);
    setSubstituteMedicines(results);
    setSearchingSubstitute(false);
  };

  const handleOpenDialog = (substitute?: any) => {
    if (substitute) {
      setEditingSubstitute(substitute);
      form.reset({
        original_medicine_id: substitute.original_medicine_id.toString(),
        substitute_medicine_id: substitute.substitute_medicine_id.toString(),
        price_difference: substitute.price_difference?.toString() || '0',
        notes: substitute.notes || ''
      });
      setOriginalSearch(substitute.original_medicine?.name || '');
      setSubstituteSearch(substitute.substitute_medicine?.name || '');
    } else {
      setEditingSubstitute(null);
      form.reset({
        original_medicine_id: '',
        substitute_medicine_id: '',
        price_difference: '0',
        notes: ''
      });
      setOriginalSearch('');
      setSubstituteSearch('');
      setOriginalMedicines([]);
      setSubstituteMedicines([]);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data: SubstituteFormData) => {
    if (data.original_medicine_id === data.substitute_medicine_id) {
      toast({
        title: 'Error',
        description: 'Original and substitute must be different medicines',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        original_medicine_id: parseInt(data.original_medicine_id),
        substitute_medicine_id: parseInt(data.substitute_medicine_id),
        price_difference: parseFloat(data.price_difference),
        notes: data.notes
      };

      if (editingSubstitute) {
        await featuresApi.updateSubstitute(editingSubstitute.id, payload);
        toast({ title: 'Success', description: 'Substitute updated successfully' });
      } else {
        await featuresApi.createSubstitute(payload);
        toast({ title: 'Success', description: 'Substitute created successfully' });
      }
      setDialogOpen(false);
      loadSubstitutes();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save substitute', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this substitute?')) return;

    try {
      await featuresApi.deleteSubstitute(id);
      toast({ title: 'Success', description: 'Substitute deleted successfully' });
      loadSubstitutes();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete substitute', variant: 'destructive' });
    }
  };

  const filteredSubstitutes = substitutes.filter(sub => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.original_medicine?.name?.toLowerCase().includes(searchLower) ||
      sub.substitute_medicine?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicine Substitutes</h1>
          <p className="text-muted-foreground">Manage generic alternatives and substitutes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Substitute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSubstitute ? 'Edit Substitute' : 'Add New Substitute'}</DialogTitle>
              <DialogDescription>
                {editingSubstitute ? 'Update substitute details' : 'Create a new medicine substitute mapping'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="original_medicine_id"
                  rules={{ required: 'Original medicine is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Medicine</FormLabel>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type at least 2 characters to search..."
                          value={originalSearch}
                          onChange={(e) => setOriginalSearch(e.target.value)}
                        />
                        {searchingOriginal && (
                          <p className="text-sm text-muted-foreground">Searching...</p>
                        )}
                        {originalSearch.length >= 2 && originalMedicines.length === 0 && !searchingOriginal && (
                          <p className="text-sm text-muted-foreground">No medicines found</p>
                        )}
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select original medicine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {originalMedicines.length === 0 && originalSearch.length < 2 ? (
                              <SelectItem value="none" disabled>
                                Type to search medicines
                              </SelectItem>
                            ) : (
                              originalMedicines.map(med => (
                                <SelectItem key={med.id} value={med.id.toString()}>
                                  {med.name} {med.price && `- ₹${med.price}`}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="substitute_medicine_id"
                  rules={{ required: 'Substitute medicine is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Substitute Medicine</FormLabel>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type at least 2 characters to search..."
                          value={substituteSearch}
                          onChange={(e) => setSubstituteSearch(e.target.value)}
                        />
                        {searchingSubstitute && (
                          <p className="text-sm text-muted-foreground">Searching...</p>
                        )}
                        {substituteSearch.length >= 2 && substituteMedicines.length === 0 && !searchingSubstitute && (
                          <p className="text-sm text-muted-foreground">No medicines found</p>
                        )}
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select substitute medicine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {substituteMedicines.length === 0 && substituteSearch.length < 2 ? (
                              <SelectItem value="none" disabled>
                                Type to search medicines
                              </SelectItem>
                            ) : (
                              substituteMedicines.map(med => (
                                <SelectItem key={med.id} value={med.id.toString()}>
                                  {med.name} {med.price && `- ₹${med.price}`}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_difference"
                  rules={{ required: 'Price difference is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Difference (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Positive value = substitute is cheaper, Negative = substitute is more expensive
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional information..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSubstitute ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Substitutes</CardTitle>
          <CardDescription>Filter substitutes by medicine name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search substitutes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading substitutes...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubstitutes.map(sub => (
            <Card key={sub.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingDown className="h-5 w-5 text-green-500" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{sub.original_medicine?.name || 'Unknown'}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold">{sub.substitute_medicine?.name || 'Unknown'}</span>
                        {sub.price_difference > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Save ₹{sub.price_difference}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {sub.notes && (
                      <p className="text-sm text-muted-foreground">{sub.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(sub)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(sub.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSubstitutes.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No substitutes found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
