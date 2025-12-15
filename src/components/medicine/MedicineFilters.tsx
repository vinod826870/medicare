import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface FilterOptions {
  priceRanges: string[];
  manufacturers: string[];
  productForms: string[];
}

interface MedicineFiltersProps {
  availableManufacturers: string[];
  availableProductForms: string[];
  onFilterChange: (filters: FilterOptions) => void;
  activeFiltersCount: number;
}

const PRICE_RANGES = [
  { label: 'Under ₹50', min: 0, max: 50 },
  { label: '₹50 - ₹100', min: 50, max: 100 },
  { label: '₹100 - ₹200', min: 100, max: 200 },
  { label: '₹200 - ₹500', min: 200, max: 500 },
  { label: 'Above ₹500', min: 500, max: 999999 }
];

const MedicineFilters = ({
  availableManufacturers,
  availableProductForms,
  onFilterChange,
  activeFiltersCount
}: MedicineFiltersProps) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedProductForms, setSelectedProductForms] = useState<string[]>([]);
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const displayedManufacturers = showAllManufacturers 
    ? availableManufacturers 
    : availableManufacturers.slice(0, 10);

  useEffect(() => {
    onFilterChange({
      priceRanges: selectedPriceRanges,
      manufacturers: selectedManufacturers,
      productForms: selectedProductForms
    });
  }, [selectedPriceRanges, selectedManufacturers, selectedProductForms]);

  const handlePriceRangeToggle = (range: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    setSelectedManufacturers(prev =>
      prev.includes(manufacturer)
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    );
  };

  const handleProductFormToggle = (form: string) => {
    setSelectedProductForms(prev =>
      prev.includes(form)
        ? prev.filter(f => f !== form)
        : [...prev, form]
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedManufacturers([]);
    setSelectedProductForms([]);
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Range Filter */}
        <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-sm">Price Range</h3>
            {isPriceOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {PRICE_RANGES.map((range) => (
              <div key={range.label} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.label}`}
                  checked={selectedPriceRanges.includes(range.label)}
                  onCheckedChange={() => handlePriceRangeToggle(range.label)}
                />
                <Label
                  htmlFor={`price-${range.label}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brand/Manufacturer Filter */}
        <Collapsible open={isBrandOpen} onOpenChange={setIsBrandOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-sm">Brand</h3>
            {isBrandOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {displayedManufacturers.map((manufacturer) => (
                  <div key={manufacturer} className="flex items-center space-x-2">
                    <Checkbox
                      id={`manufacturer-${manufacturer}`}
                      checked={selectedManufacturers.includes(manufacturer)}
                      onCheckedChange={() => handleManufacturerToggle(manufacturer)}
                    />
                    <Label
                      htmlFor={`manufacturer-${manufacturer}`}
                      className="text-sm font-normal cursor-pointer line-clamp-1"
                    >
                      {manufacturer}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {availableManufacturers.length > 10 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                className="mt-2 h-auto p-0 text-xs"
              >
                {showAllManufacturers ? 'Show Less' : `Show All (${availableManufacturers.length})`}
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Product Form Filter */}
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-sm">Product Form</h3>
            {isFormOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {availableProductForms.map((form) => (
              <div key={form} className="flex items-center space-x-2">
                <Checkbox
                  id={`form-${form}`}
                  checked={selectedProductForms.includes(form)}
                  onCheckedChange={() => handleProductFormToggle(form)}
                />
                <Label
                  htmlFor={`form-${form}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {form}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default MedicineFilters;
export { PRICE_RANGES };
