import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { cancerTypes } from "@/constants";

export default function ReportsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}) {
  const handleFilterChange = (key, value) => {
    const filterValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search Reports</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by doctor, cancer type, or result..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Cancer Type Filter */}
          <div className="min-w-[150px]">
            <Label>Cancer Type</Label>
            <Select
              value={filters.cancerType}
              onValueChange={(value) => handleFilterChange("cancerType", value)}
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

          {/* Classification Filter */}
          <div className="min-w-[150px]">
            <Label>Classification</Label>
            <Select
              value={filters.classification}
              onValueChange={(value) =>
                handleFilterChange("classification", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All results</SelectItem>
                <SelectItem value="Cancer">Cancer</SelectItem>
                <SelectItem value="noCancer">No Cancer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="min-w-[150px]">
            <Label>Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <div className="pt-6">
            <Button variant="outline" onClick={onClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
