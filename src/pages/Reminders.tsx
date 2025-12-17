import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bell, Clock, Trash2, Edit, BellRing } from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
  active: boolean;
  lastTriggered?: string;
}

const STORAGE_KEY = 'medicine_reminders';

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [currentTime, setCurrentTime] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'daily',
    time: '',
    notes: '',
  });

  // Load reminders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReminders(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error loading reminders:', error);
        setReminders([]);
      }
    }

    // Request notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }

    // Create audio element for notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFC');
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }
  }, [reminders]);

  // Check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toDateString();

      // Update current time display
      setCurrentTime(currentTime);

      console.log('Checking reminders at:', currentTime, 'on', today);
      console.log('Active reminders:', reminders.filter(r => r.active));

      reminders.forEach(reminder => {
        console.log(`Checking reminder: ${reminder.medicineName}`, {
          active: reminder.active,
          reminderTime: reminder.time,
          currentTime: currentTime,
          match: reminder.time === currentTime,
          lastTriggered: reminder.lastTriggered,
          today: today,
        });

        if (!reminder.active) {
          console.log(`Skipping ${reminder.medicineName}: not active`);
          return;
        }
        
        if (reminder.time !== currentTime) {
          console.log(`Skipping ${reminder.medicineName}: time mismatch (${reminder.time} !== ${currentTime})`);
          return;
        }
        
        if (reminder.lastTriggered === today) {
          console.log(`Skipping ${reminder.medicineName}: already triggered today`);
          return;
        }

        console.log(`🔔 TRIGGERING NOTIFICATION for ${reminder.medicineName}`);
        
        // Trigger notification
        triggerNotification(reminder);

        // Update lastTriggered
        setReminders(prev => prev.map(r =>
          r.id === reminder.id ? { ...r, lastTriggered: today } : r
        ));
      });
    };

    // Check immediately
    checkReminders();

    // Then check every 30 seconds
    checkIntervalRef.current = setInterval(checkReminders, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [reminders]);

  const triggerNotification = (reminder: Reminder) => {
    console.log('🔔 triggerNotification called for:', reminder.medicineName);
    
    // Play sound
    if (audioRef.current) {
      console.log('Playing audio notification...');
      audioRef.current.play().catch(err => {
        console.error('Error playing sound:', err);
        // Try to create a new audio element if the first one fails
        try {
          const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFC');
          beep.play();
        } catch (e) {
          console.error('Failed to play backup sound:', e);
        }
      });
    } else {
      console.warn('Audio element not initialized');
    }

    // Show toast notification
    console.log('Showing toast notification...');
    toast.success(
      <div className="flex items-start gap-3">
        <BellRing className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="font-semibold">Medicine Reminder!</p>
          <p className="text-sm">{reminder.medicineName}</p>
          <p className="text-sm text-muted-foreground">Dosage: {reminder.dosage}</p>
          {reminder.notes && <p className="text-xs text-muted-foreground mt-1">{reminder.notes}</p>}
        </div>
      </div>,
      {
        duration: 10000,
      }
    );

    // Show browser notification
    console.log('Notification permission:', notificationPermission);
    if (notificationPermission === 'granted') {
      console.log('Creating browser notification...');
      try {
        const notification = new Notification('Medicine Reminder', {
          body: `Time to take ${reminder.medicineName} - ${reminder.dosage}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: reminder.id,
          requireInteraction: true,
        });
        console.log('Browser notification created successfully');
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error creating browser notification:', error);
      }
    } else {
      console.warn('Browser notifications not granted. Current permission:', notificationPermission);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Your browser does not support notifications');
      return;
    }

    const currentPermission = Notification.permission;
    
    if (currentPermission === 'granted') {
      toast.success('Notifications are already enabled!');
      return;
    }

    if (currentPermission === 'denied') {
      toast.error('Notifications are blocked. Please enable them in your browser settings.', {
        duration: 5000,
      });
      return;
    }

    // Permission is 'default', request it
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notifications enabled successfully!');
        // Test notification to confirm it works
        setTimeout(() => {
          new Notification('MediCare Reminders', {
            body: 'Notifications are now enabled! You will receive medicine reminders.',
            icon: '/favicon.ico',
          });
        }, 500);
      } else {
        toast.error('Notifications were denied. You won\'t receive alerts.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
    }
  };

  const testNotification = () => {
    const testReminder: Reminder = {
      id: 'test',
      medicineName: 'Test Medicine',
      dosage: '1 tablet',
      frequency: 'daily',
      time: '00:00',
      notes: 'This is a test notification',
      active: true,
    };
    triggerNotification(testReminder);
  };

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
        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="flex items-start xl:items-center gap-3">
                  <BellRing className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 xl:mt-0" />
                  <div>
                    <p className="font-semibold">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Allow notifications to receive medicine reminders even when you're not on this page
                    </p>
                  </div>
                </div>
                <Button onClick={requestNotificationPermission} size="sm" className="w-full xl:w-auto">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl xl:text-3xl font-bold text-foreground">Medicine Reminders</h1>
            <p className="text-sm xl:text-base text-muted-foreground">Never miss a dose with smart reminders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={testNotification} size="sm" className="flex-1 xl:flex-none">
              <BellRing className="mr-2 h-4 w-4" />
              Test Alert
            </Button>
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
                }} className="flex-1 xl:flex-none">
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
        </div>

        {/* System Status Info */}
        {reminders.length > 0 && (
          <Card className="mb-6 bg-muted/30">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Current Time: {currentTime || 'Loading...'}</p>
                    <p className="text-xs text-muted-foreground">
                      System checks every 30 seconds • {reminders.filter(r => r.active).length} active reminder(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={notificationPermission === 'granted' ? 'default' : 'secondary'}>
                    {notificationPermission === 'granted' ? '✓ Notifications Enabled' : '⚠ Notifications Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3 mb-2">
                        <CardTitle className="text-lg xl:text-xl">{reminder.medicineName}</CardTitle>
                        <Badge variant={reminder.active ? 'default' : 'secondary'} className="w-fit">
                          {reminder.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 xl:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 flex-shrink-0" />
                          <span>{getFrequencyLabel(reminder.frequency)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{reminder.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 xl:flex-shrink-0">
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
                  <div className="space-y-2 text-sm xl:text-base">
                    <p><strong>Dosage:</strong> {reminder.dosage}</p>
                    {reminder.notes && <p><strong>Notes:</strong> {reminder.notes}</p>}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={reminder.active ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleReminder(reminder.id)}
                      className="w-full xl:w-auto"
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