
import React, { useState, useEffect, useCallback } from "react";
import { Listing } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, MapPin, Clock, Building2, CheckCircle, Search } from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  produce: "bg-green-100 text-green-800",
  dairy: "bg-blue-100 text-blue-800",
  bakery: "bg-amber-100 text-amber-800",
  canned_goods: "bg-orange-100 text-orange-800",
  frozen: "bg-cyan-100 text-cyan-800",
  beverages: "bg-purple-100 text-purple-800",
  snacks: "bg-pink-100 text-pink-800",
  prepared_meals: "bg-red-100 text-red-800",
  other: "bg-gray-100 text-gray-800"
};

export default function RecipientDashboard({ user }) {
  const [listings, setListings] = useState([]);
  const [myClaimedListings, setMyClaimedListings] = useState([]);
  const [donors, setDonors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      // Load available listings
      const availableListings = await Listing.filter({ status: "available" }, "-created_date");
      setListings(availableListings);
      
      // Load my claimed listings
      const claimedListings = await Listing.filter({ recipient_id: user.id }, "-created_date");
      setMyClaimedListings(claimedListings);
      
      // Load donor information
      const allListings = [...availableListings, ...claimedListings];
      const donorIds = [...new Set(allListings.map(l => l.donor_id))];
      const donorData = {};
      
      for (const donorId of donorIds) {
        try {
          const donorUsers = await User.filter({ id: donorId });
          if (donorUsers.length > 0) {
            donorData[donorId] = donorUsers[0];
          }
        } catch (error) {
          console.log("Could not load donor:", donorId);
        }
      }
      
      setDonors(donorData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]); // Now correctly depends on loadData memoized by useCallback

  const handleClaim = async (listingId) => {
    setClaimingId(listingId);
    try {
      await Listing.update(listingId, { 
        status: "claimed", 
        recipient_id: user.id 
      });
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error claiming listing:", error);
    }
    setClaimingId(null);
  };

  const ListingCard = ({ listing, showClaimButton = false }) => {
    const donor = donors[listing.donor_id];
    
    return (
      <Card className="glass-effect hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{listing.item_name}</h3>
                  <p className="text-slate-600 mb-2">{listing.description}</p>
                </div>
                <Badge className={categoryColors[listing.category] || categoryColors.other}>
                  {listing.category?.replace(/_/g, ' ')}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{donor?.organization_name || 'Loading...'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{donor?.location?.city || donor?.address || 'Location not available'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Package className="w-4 h-4" />
                  <span>Quantity: {listing.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Collect by: {format(new Date(listing.collect_by), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
              
              {showClaimButton && (
                <Button
                  onClick={() => handleClaim(listing.id)}
                  disabled={claimingId === listing.id}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  {claimingId === listing.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Claiming...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Claim This Item
                    </div>
                  )}
                </Button>
              )}
              
              {listing.status === "claimed" && (
                <Badge className="bg-blue-100 text-blue-800">
                  Claimed - Ready for pickup
                </Badge>
              )}
              
              {listing.status === "collected" && (
                <Badge className="bg-green-100 text-green-800">
                  Collected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Recipient Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user.organization_name}! Find fresh food donations nearby.</p>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Available Food ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="claimed" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Claims ({myClaimedListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  Available Food Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-slate-200 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No available donations</h3>
                    <p className="text-slate-500">Check back soon for new food donations from local organizations.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        showClaimButton={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claimed">
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  My Claimed Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-slate-200 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : myClaimedListings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No claimed items</h3>
                    <p className="text-slate-500">Browse available donations and claim items for your organization.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {myClaimedListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        showClaimButton={false}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
