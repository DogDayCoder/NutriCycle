import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";
import { Leaf } from "lucide-react";

export default function Welcome() {
  const handleLogin = async () => {
    try {
      // This will redirect the user to the login page
      await User.login();
    } catch (error) {
      console.error("Login initiation failed:", error);
      alert("Could not initiate login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-center p-6">
      <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
        <Leaf className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
        Welcome to NutriCycle
      </h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl">
        A critical error was fixed by resetting the application. We can now rebuild the features you need on this stable foundation.
      </p>
      <Button
        onClick={handleLogin}
        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Login to Rebuild
      </Button>
    </div>
  );
}