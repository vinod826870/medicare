import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
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
import type { Symptom } from '@/types/types';

const SYMPTOM_CATEGORIES = [
  'Respiratory',
  'Digestive',
  'Pain',
  'Skin',
  'Fever',
  'General',
  'Cardiovascular',
  'Metabolic',
  'Mental Health',
  'Sleep'
];

interface SymptomFormData {
  name: string;
  description: string;
  category: string;
  search_keywords: string;
}

export default function AdminSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const { toast } = useToast();

  const form = useForm<SymptomFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: 'General',
      search_keywords: ''
    }
  });

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    setLoading(true);
    const data = await featuresApi.getAllSymptoms();
    setSymptoms(data);
    setLoading(false);
  };

  const handleOpenDialog = (symptom?: Symptom) => {
    if (symptom) {
      setEditingSymptom(symptom);
      form.reset({
        name: symptom.name,
        description: symptom.description || '',
        category: symptom.category || 'General',
        search_keywords: symptom.search_keywords || ''
      });
    } else {
      setEditingSymptom(null);
      form.reset({
        name: '',
        description: '',
        category: 'General',
        search_keywords: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data: SymptomFormData) => {
    try {
      if (editingSymptom) {
        await featuresApi.updateSymptom(editingSymptom.id, data);
        toast({
          title: 'Success',
          description: 'Symptom updated successfully'
        });
      } else {
        await featuresApi.createSymptom(data);
        toast({
          title: 'Success',
          description: 'Symptom created successfully'
        });
      }
      setDialogOpen(false);
      loadSymptoms();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save symptom',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this symptom?')) return;

    try {
      await featuresApi.deleteSymptom(id);
      toast({
        title: 'Success',
        description: 'Symptom deleted successfully'
      });
      loadSymptoms();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete symptom',
        variant: 'destructive'
      });
    }
  };

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSymptoms = filteredSymptoms.reduce((acc, symptom) => {
    const category = symptom.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(symptom);
    return acc;
  }, {} as Record<string, Symptom[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Symptoms Management</h1>
          <p className="text-muted-foreground">Manage symptoms and their medicine search keywords</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Symptom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSymptom ? 'Edit Symptom' : 'Add New Symptom'}</DialogTitle>
              <DialogDescription>
                {editingSymptom ? 'Update symptom details' : 'Create a new symptom with search keywords'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Symptom name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptom Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Headache" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SYMPTOM_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the symptom"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="search_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Keywords</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., pain relief analgesic paracetamol ibuprofen aspirin"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Keywords used to search medicines. Separate with spaces.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSymptom ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Symptoms</CardTitle>
          <CardDescription>Filter symptoms by name or category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
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
            <p className="text-center text-muted-foreground">Loading symptoms...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category}
                  <Badge variant="secondary">{categorySymptoms.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categorySymptoms.map(symptom => (
                    <div
                      key={symptom.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{symptom.name}</h3>
                        {symptom.description && (
                          <p className="text-sm text-muted-foreground mt-1">{symptom.description}</p>
                        )}
                        {symptom.search_keywords && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Search Keywords:</p>
                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {symptom.search_keywords}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(symptom)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(symptom.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSymptoms.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No symptoms found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
