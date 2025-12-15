import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bell, Clock, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
  active: boolean;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'Paracetamol 500mg',
      dosage: '1 tablet',
      frequency: 'daily',
      time: '08:00',
      notes: 'Take after breakfast',
      active: true,
    },
    {
      id: '2',
      medicineName: 'Vitamin D3',
      dosage: '1 capsule',
      frequency: 'daily',
      time: '09:00',
      notes: 'Take with milk',
      active: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'daily',
    time: '',
    notes: '',
  });

  const handleAddReminder = () => {
    if (!formData.medicineName || !formData.dosage || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...formData,
      active: true,
    };

    setReminders([...reminders, newReminder]);
    setFormData({
      medicineName: '',
      dosage: '',
      frequency: 'daily',
      time: '',
      notes: '',
    });
    setIsDialogOpen(false);
    toast.success('Reminder added successfully!');
  };

  const handleEditReminder = () => {
    if (!editingReminder) return;

    setReminders(reminders.map(r =>
      r.id === editingReminder.id ? { ...editingReminder, ...formData } : r
    ));
    setEditingReminder(null);
    setFormData({
      medicineName: '',
      dosage: '',
      frequency: 'daily',
      time: '',
      notes: '',
    });
    setIsDialogOpen(false);
    toast.success('Reminder updated successfully!');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success('Reminder deleted successfully!');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const openEditDialog = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      medicineName: reminder.medicineName,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      time: reminder.time,
      notes: reminder.notes,
    });
    setIsDialogOpen(true);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Every Day',
      weekly: 'Every Week',
      monthly: 'Every Month',
      'as-needed': 'As Needed',
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 xl:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medicine Reminders</h1>
            <p className="text-muted-foreground">Never miss a dose with smart reminders</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingReminder(null);
                setFormData({
                  medicineName: '',
                  dosage: '',
                  frequency: 'daily',
                  time: '',
                  notes: '',
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingReminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicineName">Medicine Name *</Label>
                  <Input
                    id="medicineName"
                    value={formData.medicineName}
                    onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 1 tablet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Every Day</SelectItem>
                      <SelectItem value="weekly">Every Week</SelectItem>
                      <SelectItem value="monthly">Every Month</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Take after meals"
                  />
                </div>
                <Button onClick={editingReminder ? handleEditReminder : handleAddReminder} className="w-full">
                  {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
              <p className="text-muted-foreground mb-4">Add your first medicine reminder to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className={!reminder.active ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{reminder.medicineName}</CardTitle>
                        <Badge variant={reminder.active ? 'default' : 'secondary'}>
                          {reminder.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          {getFrequencyLabel(reminder.frequency)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {reminder.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(reminder)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Dosage:</strong> {reminder.dosage}</p>
                    {reminder.notes && <p><strong>Notes:</strong> {reminder.notes}</p>}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={reminder.active ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleReminder(reminder.id)}
                    >
                      {reminder.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
