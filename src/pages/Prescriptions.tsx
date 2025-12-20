import { useState, useEffect } from 'react';
import { Upload, FileText, Calendar, User, Trash2, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { featuresApi } from '@/db/api';
import type { Prescription } from '@/types/types';
import { format } from 'date-fns';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    doctor_name: '',
    issue_date: '',
    expiry_date: '',
    notes: ''
  });

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    const data = await featuresApi.getUserPrescriptions();
    setPrescriptions(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please provide a prescription image URL');
      return;
    }

    try {
      await featuresApi.createPrescription(formData);
      toast.success('Prescription uploaded successfully');
      setDialogOpen(false);
      setFormData({ image_url: '', doctor_name: '', issue_date: '', expiry_date: '', notes: '' });
      loadPrescriptions();
    } catch (error) {
      toast.error('Failed to upload prescription');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await featuresApi.deletePrescription(id);
      toast.success('Prescription deleted');
      loadPrescriptions();
    } catch (error) {
      toast.error('Failed to delete prescription');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold text-foreground mb-2">
              My Prescriptions
            </h1>
            <p className="text-muted-foreground">
              Manage your medical prescriptions
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Prescription</DialogTitle>
                <DialogDescription>
                  Add a new prescription to your records
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="image_url">Prescription Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/prescription.jpg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="doctor_name">Doctor Name</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    placeholder="Dr. Smith"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Upload Prescription
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prescriptions List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading prescriptions...
          </div>
        ) : prescriptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Prescriptions Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Upload your first prescription to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid xl:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Prescription
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {prescription.doctor_name && (
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {prescription.doctor_name}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Prescription Image */}
                    <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={prescription.image_url}
                        alt="Prescription"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      {prescription.issue_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Issued: {format(new Date(prescription.issue_date), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {prescription.expiry_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {format(new Date(prescription.expiry_date), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {prescription.notes && (
                        <div className="text-muted-foreground">
                          <strong>Notes:</strong> {prescription.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(prescription.image_url, '_blank')}
                      >
                        View Full Size
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prescription.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
