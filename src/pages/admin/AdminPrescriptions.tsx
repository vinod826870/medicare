import { useState, useEffect } from 'react';
import { Search, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { featuresApi } from '@/db/api';

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    const data = await featuresApi.getAllPrescriptions();
    setPrescriptions(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await featuresApi.updatePrescription(id, { status });
      toast({ title: 'Success', description: 'Prescription status updated' });
      loadPrescriptions();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Prescriptions Management</h1>
        <p className="text-muted-foreground text-sm md:text-base">View and manage user prescriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Prescriptions</CardTitle>
          <CardDescription>Search and filter prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by doctor or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading prescriptions...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPrescriptions.map(prescription => (
            <Card key={prescription.id}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Dr. {prescription.doctor_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Patient: {prescription.user?.email || 'Unknown'}
                        </p>
                      </div>
                      <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                        {prescription.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Issue Date:</span>{' '}
                        {new Date(prescription.issue_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expiry Date:</span>{' '}
                        {new Date(prescription.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                    {prescription.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{prescription.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 sm:ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Prescription Image</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <img
                            src={prescription.prescription_image}
                            alt="Prescription"
                            className="w-full rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={prescription.status}
                      onValueChange={(value) => handleStatusUpdate(prescription.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredPrescriptions.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No prescriptions found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
