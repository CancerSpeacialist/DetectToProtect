import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {cancerTypes} from "@/constants";

export default function DoctorFilters({
  selectedCancerType,
  setSelectedCancerType,
  searchTerm,
  setSearchTerm,
  hospitalFilter,
  setHospitalFilter,
  feeRange,
  setFeeRange,
  getUniqueHospitals,
  selectedCancerTypeName,
}) {
  // Add clear filters handler
  const handleClearFilters = () => {
    setSelectedCancerType("");
    setSearchTerm("");
    setHospitalFilter("all");
    setFeeRange({ min: "", max: "" });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Doctors
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center gap-1"
        >
          <XCircle className="h-4 w-4" />
          Clear Filters
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cancer Type Selection */}
          <div className="space-y-2">
            <Label>Cancer Type *</Label>
            <Select
              value={selectedCancerType}
              onValueChange={setSelectedCancerType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cancer type" />
              </SelectTrigger>
              <SelectContent>
                {cancerTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Doctor Name Search */}
          <div className="space-y-2">
            <Label>Doctor Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* Hospital Filter */}
          <div className="space-y-2">
            <Label>Hospital</Label>
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All hospitals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hospitals</SelectItem>
                {getUniqueHospitals().map((hospital) => (
                  <SelectItem key={hospital} value={hospital}>
                    {hospital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Consultation Fee Range */}
          <div className="space-y-2">
            <Label>Consultation Fee ($)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={feeRange.min}
                onChange={(e) =>
                  setFeeRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <Input
                placeholder="Max"
                type="number"
                value={feeRange.max}
                onChange={(e) =>
                  setFeeRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
        {selectedCancerType && (
          <div className="flex items-center gap-2 mt-4">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">
              Showing doctors specialized in {selectedCancerTypeName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
