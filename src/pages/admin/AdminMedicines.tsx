import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { medicineApiService, type MedicineApiData } from '@/services/medicineApi';

const AdminMedicines = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [medicines, setMedicines] = useState<MedicineApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const medicinesData = await medicineApiService.getMedicines();
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Medicine Catalog</h1>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Alert className="mb-6">
          <Info className="w-4 h-4" />
          <AlertDescription>
            Medicine data is fetched from external pharmacy API. This is a read-only view of available medicines.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Available Medicines ({medicines.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell>
                        <img
                          src={medicine.image_url}
                          alt={medicine.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>${medicine.price.toFixed(2)}</TableCell>
                      <TableCell>{medicine.manufacturer}</TableCell>
                      <TableCell>
                        {medicine.prescription_required ? (
                          <Badge variant="destructive">Rx Required</Badge>
                        ) : (
                          <Badge variant="secondary">OTC</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {medicine.stock_available ? (
                          <Badge className="bg-green-600">In Stock</Badge>
                        ) : (
                          <Badge variant="outline">Out of Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {medicine.rating ? (
                          <span>{medicine.rating.toFixed(1)} ⭐</span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMedicines;
