import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Activity, Droplet, Pill } from 'lucide-react';

const HealthCalculator = () => {
  // BMI Calculator State
  const [bmiData, setBmiData] = useState({ weight: '', height: '', result: '' });
  
  // Water Intake Calculator State
  const [waterData, setWaterData] = useState({ weight: '', activity: 'moderate', result: '' });
  
  // Dosage Calculator State
  const [dosageData, setDosageData] = useState({ weight: '', dosagePerKg: '', result: '' });

  const calculateBMI = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height) / 100; // convert cm to m
    
    if (!weight || !height || weight <= 0 || height <= 0) {
      setBmiData({ ...bmiData, result: 'Please enter valid values' });
      return;
    }

    const bmi = weight / (height * height);
    let category = '';
    
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    setBmiData({ ...bmiData, result: `Your BMI is ${bmi.toFixed(1)} (${category})` });
  };

  const calculateWater = () => {
    const weight = parseFloat(waterData.weight);
    
    if (!weight || weight <= 0) {
      setWaterData({ ...waterData, result: 'Please enter valid weight' });
      return;
    }

    let baseIntake = weight * 0.033; // liters
    
    // Adjust for activity level
    if (waterData.activity === 'high') baseIntake *= 1.2;
    else if (waterData.activity === 'low') baseIntake *= 0.9;

    setWaterData({ ...waterData, result: `You should drink approximately ${baseIntake.toFixed(1)} liters (${(baseIntake * 4.22).toFixed(0)} cups) of water per day` });
  };

  const calculateDosage = () => {
    const weight = parseFloat(dosageData.weight);
    const dosagePerKg = parseFloat(dosageData.dosagePerKg);
    
    if (!weight || !dosagePerKg || weight <= 0 || dosagePerKg <= 0) {
      setDosageData({ ...dosageData, result: 'Please enter valid values' });
      return;
    }

    const totalDosage = weight * dosagePerKg;
    setDosageData({ ...dosageData, result: `Recommended dosage: ${totalDosage.toFixed(1)} mg` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 xl:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Calculators</h1>
          <p className="text-muted-foreground">Quick and easy health calculations for your wellness</p>
        </div>

        <Tabs defaultValue="bmi" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
            <TabsTrigger value="water">Water Intake</TabsTrigger>
            <TabsTrigger value="dosage">Dosage Calculator</TabsTrigger>
          </TabsList>

          {/* BMI Calculator */}
          <TabsContent value="bmi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  BMI Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your Body Mass Index to assess your weight category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={bmiData.height}
                      onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculateBMI} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate BMI
                </Button>
                {bmiData.result && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-lg font-semibold">{bmiData.result}</p>
                  </div>
                )}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">BMI Categories:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Underweight: BMI less than 18.5</li>
                    <li>• Normal weight: BMI 18.5 to 24.9</li>
                    <li>• Overweight: BMI 25 to 29.9</li>
                    <li>• Obese: BMI 30 or greater</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Water Intake Calculator */}
          <TabsContent value="water">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Water Intake Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your daily water intake based on your weight and activity level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waterWeight">Weight (kg)</Label>
                  <Input
                    id="waterWeight"
                    type="number"
                    placeholder="70"
                    value={waterData.weight}
                    onChange={(e) => setWaterData({ ...waterData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'moderate', 'high'].map((level) => (
                      <Button
                        key={level}
                        variant={waterData.activity === level ? 'default' : 'outline'}
                        onClick={() => setWaterData({ ...waterData, activity: level })}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={calculateWater} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Water Intake
                </Button>
                {waterData.result && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-lg font-semibold">{waterData.result}</p>
                  </div>
                )}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Tips:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Drink more water in hot weather</li>
                    <li>• Increase intake during exercise</li>
                    <li>• Spread water consumption throughout the day</li>
                    <li>• Listen to your body's thirst signals</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dosage Calculator */}
          <TabsContent value="dosage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Dosage Calculator
                </CardTitle>
                <CardDescription>
                  Calculate medicine dosage based on body weight (Consult your doctor before use)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosageWeight">Weight (kg)</Label>
                    <Input
                      id="dosageWeight"
                      type="number"
                      placeholder="70"
                      value={dosageData.weight}
                      onChange={(e) => setDosageData({ ...dosageData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosagePerKg">Dosage per kg (mg/kg)</Label>
                    <Input
                      id="dosagePerKg"
                      type="number"
                      placeholder="10"
                      value={dosageData.dosagePerKg}
                      onChange={(e) => setDosageData({ ...dosageData, dosagePerKg: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculateDosage} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Dosage
                </Button>
                {dosageData.result && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-lg font-semibold">{dosageData.result}</p>
                  </div>
                )}
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Important Warning:</h4>
                  <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>• This is a general calculator for reference only</li>
                    <li>• Always consult your healthcare provider</li>
                    <li>• Follow your doctor's prescription exactly</li>
                    <li>• Do not self-medicate based on these calculations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthCalculator;
