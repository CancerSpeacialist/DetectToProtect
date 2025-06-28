import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Filter,
  X,
  CalendarDays,
  Search,
  RefreshCw,
} from "lucide-react";
import { cancerTypes, statusConfig } from "@/constants";

export default function FilterComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  filterType = "appointments" // "appointments", "screenings", or "reports"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: filters.dateFrom || null,
    to: filters.dateTo || null,
  });

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onFiltersChange({
      ...filters,
      dateFrom: range?.from || null,
      dateTo: range?.to || null,
    });
  };

  const clearAllFilters = () => {
    setDateRange({ from: null, to: null });
    onClearFilters();
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.cancerType) count++;
    if (filters.doctorId) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.classification) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Get available statuses based on filter type
  const getAvailableStatuses = () => {
    if (filterType === "appointments") {
      return Object.entries(statusConfig).map(([key, config]) => ({
        value: key,
        label: config.label,
      }));
    } else if (filterType === "screenings") {
      return [
        { value: "completed", label: "Completed" },
        { value: "under_review", label: "Under Review" },
        { value: "pending", label: "Pending" },
      ];
    }
    return [];
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={`Search ${filterType}...`}
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => 
                  handleFilterChange("status", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {getAvailableStatuses().map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cancer Type Filter */}
            <div className="space-y-2">
              <Label>Cancer Type</Label>
              <Select
                value={filters.cancerType || ""}
                onValueChange={(value) => 
                  handleFilterChange("cancerType", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {cancerTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Classification Filter (for screenings) */}
            {filterType === "screenings" && (
              <div className="space-y-2">
                <Label>Classification</Label>
                <Select
                  value={filters.classification || ""}
                  onValueChange={(value) => 
                    handleFilterChange("classification", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All classifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classifications</SelectItem>
                    <SelectItem value="Benign">Benign</SelectItem>
                    <SelectItem value="Malignant">Malignant</SelectItem>
                    <SelectItem value="Suspicious">Suspicious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Apply/Close Button */}
            <Button 
              onClick={() => setIsOpen(false)} 
              className="w-full"
              size="sm"
            >
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusConfig[filters.status]?.label || filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("status", "")}
              />
            </Badge>
          )}
          {filters.cancerType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {cancerTypes.find(t => t.id === filters.cancerType)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("cancerType", "")}
              />
            </Badge>
          )}
          {filters.classification && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.classification}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("classification", "")}
              />
            </Badge>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date Range
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateRangeChange({ from: null, to: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}