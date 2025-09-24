
import React, { useState, useEffect, useCallback } from "react";
import { Listing } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const statusColors = {
  available: "bg-emerald-100 text-emerald-800",
  claimed: "bg-blue-100 text-blue-800",
  collected: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800"
};

export default function DonorDashboard({ user }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = useCallback(async () => {
    try {
      const allListings = await Listing.filter({ donor_id: user.id }, "-created_date");
      setListings(allListings);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setIsLoading(false);
  }, [user.id]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const stats = {
    total: listings.length,
    available: listings.filter(l => l.status === "available").length,
    claimed: listings.filter(l => l.status === "claimed").length,
    collected: listings.filter(l => l.status === "collected").length
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Donor Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user.organization_name}!</p>
          </div>
          <Link to={createPageUrl("CreateListing")}>
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
              <Plus className="w-4 h-4 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Listings</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Available</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Claimed</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.claimed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Collected</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.collected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <Card className="glass-effect shadow-lg">
          <CardHeader>
            <CardTitle>Your Food Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-slate-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No listings yet</h3>
                <p className="text-slate-500 mb-6">Create your first food listing to help reduce waste and feed your community.</p>
                <Link to={createPageUrl("CreateListing")}>
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Listing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">{listing.item_name}</h3>
                            <p className="text-sm text-slate-600 mb-2">{listing.description}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>Quantity: {listing.quantity}</span>
                              <span>•</span>
                              <span>Collect by: {format(new Date(listing.collect_by), "MMM d, yyyy 'at' h:mm a")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[listing.status]}>
                          {listing.status}
                        </Badge>
                        {listing.status === "claimed" && (
                          <div className="text-sm text-slate-600">
                            Ready for pickup
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
