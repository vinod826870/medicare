import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { medicinesApi, categoriesApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import type { Medicine, Category } from '@/types/types';

const AdminMedicines = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    prescription_required: false,
    manufacturer: '',
    dosage: '',
    image_url: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    try {
      const [medicinesData, categoriesData] = await Promise.all([
        medicinesApi.getAll(),
        categoriesApi.getAll()
      ]);
      setMedicines(medicinesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('File size must be less than 1MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('app-84tul5br4fsx_medicine_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('app-84tul5br4fsx_medicine_images')
        .getPublicUrl(data.path);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const medicineData = {
        name: formData.name,
        description: formData.description || null,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        prescription_required: formData.prescription_required,
        manufacturer: formData.manufacturer || null,
        dosage: formData.dosage || null,
        image_url: formData.image_url || null
      };

      if (editingMedicine) {
        await medicinesApi.update(editingMedicine.id, medicineData);
        toast.success('Medicine updated successfully');
      } else {
        await medicinesApi.create(medicineData);
        toast.success('Medicine created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving medicine:', error);
      toast.error('Failed to save medicine');
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      category_id: medicine.category_id || '',
      price: medicine.price.toString(),
      stock_quantity: medicine.stock_quantity.toString(),
      prescription_required: medicine.prescription_required,
      manufacturer: medicine.manufacturer || '',
      dosage: medicine.dosage || '',
      image_url: medicine.image_url || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await medicinesApi.delete(id);
      toast.success('Medicine deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      price: '',
      stock_quantity: '',
      prescription_required: false,
      manufacturer: '',
      dosage: '',
      image_url: ''
    });
  };

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Medicines</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage Instructions</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Medicine Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="prescription"
                    checked={formData.prescription_required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prescription_required: checked as boolean }))}
                  />
                  <Label htmlFor="prescription" className="cursor-pointer">Prescription Required</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMedicine ? 'Update' : 'Create'} Medicine
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{categories.find(c => c.id === medicine.category_id)?.name || '-'}</TableCell>
                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                    <TableCell>{medicine.stock_quantity}</TableCell>
                    <TableCell>{medicine.prescription_required ? 'Rx' : 'OTC'}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(medicine)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(medicine.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMedicines;
