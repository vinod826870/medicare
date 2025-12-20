import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { featuresApi } from '@/db/api';
import { medicineApiService, type MedicineApiData } from '@/services/medicineApi';
import type { MedicineInteraction } from '@/types/types';

interface InteractionFormData {
  medicine_a_id: string;
  medicine_b_id: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export default function AdminInteractions() {
  // State management for interactions list and UI
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<any | null>(null);
  
  // Separate medicine lists for each search field
  const [medicines1, setMedicines1] = useState<MedicineApiData[]>([]);
  const [medicines2, setMedicines2] = useState<MedicineApiData[]>([]);
  const [medicine1Search, setMedicine1Search] = useState('');
  const [medicine2Search, setMedicine2Search] = useState('');
  const [searchingMed1, setSearchingMed1] = useState(false);
  const [searchingMed2, setSearchingMed2] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<InteractionFormData>({
    defaultValues: {
      medicine_a_id: '',
      medicine_b_id: '',
      severity: 'moderate',
      description: '',
      recommendation: ''
    }
  });

  useEffect(() => {
    loadInteractions();
  }, []);

  useEffect(() => {
    if (medicine1Search.length >= 2) {
      searchMedicines1();
    } else {
      setMedicines1([]);
    }
  }, [medicine1Search]);

  useEffect(() => {
    if (medicine2Search.length >= 2) {
      searchMedicines2();
    } else {
      setMedicines2([]);
    }
  }, [medicine2Search]);

  const loadInteractions = async () => {
    setLoading(true);
    const data = await featuresApi.getAllInteractions();
    setInteractions(data);
    setLoading(false);
  };

  const searchMedicines1 = async () => {
    setSearchingMed1(true);
    const results = await medicineApiService.searchMedicines(medicine1Search, 50);
    setMedicines1(results);
    setSearchingMed1(false);
  };

  const searchMedicines2 = async () => {
    setSearchingMed2(true);
    const results = await medicineApiService.searchMedicines(medicine2Search, 50);
    setMedicines2(results);
    setSearchingMed2(false);
  };

  const handleOpenDialog = (interaction?: any) => {
    if (interaction) {
      setEditingInteraction(interaction);
      form.reset({
        medicine_a_id: interaction.medicine_a_id.toString(),
        medicine_b_id: interaction.medicine_b_id.toString(),
        severity: interaction.severity,
        description: interaction.description || '',
        recommendation: interaction.recommendation || ''
      });
      // Load the selected medicines for display
      setMedicine1Search(interaction.medicine_a?.name || '');
      setMedicine2Search(interaction.medicine_b?.name || '');
    } else {
      setEditingInteraction(null);
      form.reset({
        medicine_a_id: '',
        medicine_b_id: '',
        severity: 'moderate',
        description: '',
        recommendation: ''
      });
      setMedicine1Search('');
      setMedicine2Search('');
      setMedicines1([]);
      setMedicines2([]);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data: InteractionFormData) => {
    if (data.medicine_a_id === data.medicine_b_id) {
      toast({
        title: 'Error',
        description: 'Please select two different medicines',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        medicine_a_id: parseInt(data.medicine_a_id),
        medicine_b_id: parseInt(data.medicine_b_id),
        severity: data.severity,
        description: data.description,
        recommendation: data.recommendation
      };

      if (editingInteraction) {
        await featuresApi.updateInteraction(editingInteraction.id, payload);
        toast({
          title: 'Success',
          description: 'Interaction updated successfully'
        });
      } else {
        await featuresApi.createInteraction(payload);
        toast({
          title: 'Success',
          description: 'Interaction created successfully'
        });
      }
      setDialogOpen(false);
      loadInteractions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save interaction',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) return;

    try {
      await featuresApi.deleteInteraction(id);
      toast({
        title: 'Success',
        description: 'Interaction deleted successfully'
      });
      loadInteractions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete interaction',
        variant: 'destructive'
      });
    }
  };

  const filteredInteractions = interactions.filter(interaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      interaction.medicine_a?.name?.toLowerCase().includes(searchLower) ||
      interaction.medicine_b?.name?.toLowerCase().includes(searchLower) ||
      interaction.severity?.toLowerCase().includes(searchLower)
    );
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'destructive';
      case 'moderate':
        return 'default';
      case 'mild':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Medicine Interactions</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage drug interaction warnings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Interaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInteraction ? 'Edit Interaction' : 'Add New Interaction'}</DialogTitle>
              <DialogDescription>
                {editingInteraction ? 'Update interaction details' : 'Create a new medicine interaction warning'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicine_a_id"
                  rules={{ required: 'First medicine is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Medicine</FormLabel>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type at least 2 characters to search..."
                          value={medicine1Search}
                          onChange={(e) => setMedicine1Search(e.target.value)}
                        />
                        {searchingMed1 && (
                          <p className="text-sm text-muted-foreground">Searching...</p>
                        )}
                        {medicine1Search.length >= 2 && medicines1.length === 0 && !searchingMed1 && (
                          <p className="text-sm text-muted-foreground">No medicines found</p>
                        )}
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select first medicine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medicines1.length === 0 && medicine1Search.length < 2 ? (
                              <SelectItem value="none" disabled>
                                Type to search medicines
                              </SelectItem>
                            ) : (
                              medicines1.map(med => (
                                <SelectItem key={med.id} value={med.id.toString()}>
                                  {med.name} {med.manufacturer && `- ${med.manufacturer}`}
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
                  name="medicine_b_id"
                  rules={{ required: 'Second medicine is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Medicine</FormLabel>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type at least 2 characters to search..."
                          value={medicine2Search}
                          onChange={(e) => setMedicine2Search(e.target.value)}
                        />
                        {searchingMed2 && (
                          <p className="text-sm text-muted-foreground">Searching...</p>
                        )}
                        {medicine2Search.length >= 2 && medicines2.length === 0 && !searchingMed2 && (
                          <p className="text-sm text-muted-foreground">No medicines found</p>
                        )}
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select second medicine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medicines2.length === 0 && medicine2Search.length < 2 ? (
                              <SelectItem value="none" disabled>
                                Type to search medicines
                              </SelectItem>
                            ) : (
                              medicines2.map(med => (
                                <SelectItem key={med.id} value={med.id.toString()}>
                                  {med.name} {med.manufacturer && `- ${med.manufacturer}`}
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
                  name="severity"
                  rules={{ required: 'Severity is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">Mild - Minor interaction</SelectItem>
                          <SelectItem value="moderate">Moderate - Monitor closely</SelectItem>
                          <SelectItem value="severe">Severe - Avoid combination</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: 'Description is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the interaction and its effects..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recommendation"
                  rules={{ required: 'Recommendation is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendation</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What should users do about this interaction..."
                          rows={3}
                          {...field}
                        />
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
                    {editingInteraction ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Interactions</CardTitle>
          <CardDescription>Filter interactions by medicine name or severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search interactions..."
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
            <p className="text-center text-muted-foreground">Loading interactions...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 w-full">
          {filteredInteractions.map(interaction => (
            <Card key={interaction.id} className="w-full overflow-hidden">
              <CardContent className="p-4 md:p-6 w-full">
                <div className="flex flex-col gap-3 w-full min-w-0">
                  <div className="flex items-start justify-between gap-2 w-full min-w-0">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start gap-2 mb-2 min-w-0">
                        <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <span className="font-semibold break-words text-sm sm:text-base">{interaction.medicine_a?.name || 'Unknown'}</span>
                              <span className="text-muted-foreground flex-shrink-0">+</span>
                              <span className="font-semibold break-words text-sm sm:text-base">{interaction.medicine_b?.name || 'Unknown'}</span>
                            </div>
                            <Badge variant={getSeverityColor(interaction.severity)} className="w-fit flex-shrink-0">
                              {interaction.severity?.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground break-words">{interaction.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(interaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(interaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredInteractions.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No interactions found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
