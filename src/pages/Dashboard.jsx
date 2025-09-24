
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DonorDashboard from "../components/dashboard/DonorDashboard";
import RecipientDashboard from "../components/dashboard/RecipientDashboard";
import ProfileSetup from "../components/dashboard/ProfileSetup";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = React.useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      navigate(createPageUrl("Welcome"));
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  // Check if user needs to complete profile setup
  const needsProfileSetup = !user?.role || !user?.organization_name || !user?.address;

  if (needsProfileSetup) {
    return <ProfileSetup user={user} onComplete={loadUser} />;
  }

  // Render appropriate dashboard based on user role
  if (user.role === "donor") {
    return <DonorDashboard user={user} />;
  } else if (user.role === "recipient") {
    return <RecipientDashboard user={user} />;
  }

  return null;
}
