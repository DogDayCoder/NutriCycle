import React, { useState } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Leaf } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const organizationTypes = {
  donor: [
    { value: "supermarket", label: "Supermarket" },
    { value: "restaurant", label: "Restaurant" },
    { value: "bakery", label: "Bakery" },
    { value: "farm", label: "Farm" }
  ],
  recipient: [
    { value: "charity", label: "Charity" },
    { value: "food_bank", label: "Food Bank" },
    { value: "shelter", label: "Shelter" },
    { value: "community_center", label: "Community Center" }
  ]
};

export default function ProfileSetup({ user, onComplete }) {
  const [formData, setFormData] = useState({
    role: user?.role || "",
    organization_name: user?.organization_name || "",
    organization_type: user?.organization_type || "",
    address: user?.address || "",
    phone: user?.phone || "",
    description: user?.description || "",
    location: user?.location || { city: "" }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await User.updateMyUserData(formData);
      onComplete();
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to NutriCycle!</h1>
          <p className="text-slate-600">Let's set up your profile to get started</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="glass-effect shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">What type of organization are you?</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Food Donor (I have surplus food to share)</SelectItem>
                    <SelectItem value="recipient">Food Recipient (I help distribute food to those in need)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organization_type">Organization Type</Label>
                    <Select 
                      value={formData.organization_type} 
                      onValueChange={(value) => handleInputChange('organization_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes[formData.role]?.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_name">Organization Name</Label>
                    <Input
                      id="organization_name"
                      value={formData.organization_name}
                      onChange={(e) => handleInputChange('organization_name', e.target.value)}
                      placeholder="Name of your organization"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Full address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.location?.city || ''}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Contact phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell us about your organization..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading || !formData.role || !formData.organization_name || !formData.address}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Setting up...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Complete Setup
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}