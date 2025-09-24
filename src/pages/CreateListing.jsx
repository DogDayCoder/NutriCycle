
import React, { useState, useEffect } from "react";
import { Listing } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Plus, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const foodCategories = [
  { value: "produce", label: "Fresh Produce" },
  { value: "dairy", label: "Dairy Products" },
  { value: "bakery", label: "Bakery Items" },
  { value: "canned_goods", label: "Canned Goods" },
  { value: "frozen", label: "Frozen Foods" },
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks" },
  { value: "prepared_meals", label: "Prepared Meals" },
  { value: "other", label: "Other" }
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    category: "",
    quantity: "",
    collect_by: "",
    pickup_location: "",
    estimated_value: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUser = React.useCallback(async () => {
    try {
      const currentUser = await User.me();
      if (currentUser.role !== "donor") {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        pickup_location: currentUser.address || ""
      }));
    } catch (error) {
      navigate(createPageUrl("Welcome"));
    }
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const listingData = {
        ...formData,
        donor_id: user.id,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : undefined
      };

      await Listing.create(listingData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setError("Failed to create listing. Please try again.");
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create Food Listing</h1>
            <p className="text-slate-600 mt-1">Share surplus food with your community</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="glass-effect shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Food Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="item_name">Item Name *</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => handleInputChange('item_name', e.target.value)}
                    placeholder="e.g., Fresh Vegetables, Day-old Bread"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food category" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the food items, condition, any special notes..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="e.g., 5 kg, 20 items, 3 boxes"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                  <Input
                    id="estimated_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.estimated_value}
                    onChange={(e) => handleInputChange('estimated_value', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collect_by">Collect By *</Label>
                <Input
                  id="collect_by"
                  type="datetime-local"
                  value={formData.collect_by}
                  onChange={(e) => handleInputChange('collect_by', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_location">Pickup Location</Label>
                <Textarea
                  id="pickup_location"
                  value={formData.pickup_location}
                  onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                  placeholder="Specific pickup instructions, loading dock info, contact person..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.item_name || !formData.category || !formData.quantity || !formData.collect_by}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Listing
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
