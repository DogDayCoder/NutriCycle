
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Leaf, Plus, Home, User, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { User } = await import("@/api/entities");
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const navigationItems = user ? [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: Home,
    },
    ...(user.role === "donor" ? [{
      title: "Create Listing",
      url: createPageUrl("CreateListing"),
      icon: Plus,
    }] : []),
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: User,
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <style>
        {`
          :root {
            --color-forest: #064e3b;
            --color-emerald: #10b981;
            --color-sage: #6ee7b7;
            --color-gold: #f59e0b;
            --color-warm: #fef3c7;
          }
          
          .brand-gradient {
            background: linear-gradient(135deg, var(--color-forest) 0%, var(--color-emerald) 100%);
          }
          
          .text-gradient {
            background: linear-gradient(135deg, var(--color-forest), var(--color-emerald));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .glass-effect {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(16, 185, 129, 0.1);
          }
        `}
      </style>

      {user ? (
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <Sidebar className="border-r border-emerald-100 bg-white/80 backdrop-blur-sm">
              <SidebarHeader className="border-b border-emerald-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gradient">NutriCycle</h2>
                    <p className="text-sm text-emerald-600 capitalize">{user.role} Dashboard</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-4">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-2">
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={item.url} 
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-700 ${
                                location.pathname === item.url 
                                  ? 'bg-emerald-100 text-emerald-800 shadow-sm' 
                                  : 'text-slate-600'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                  <div className="px-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">Impact Stats</span>
                      </div>
                      <p className="text-xs text-amber-700">
                        {user.role === 'donor' ? 'Help reduce food waste' : 'Access fresh food'}
                      </p>
                    </div>
                  </div>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-emerald-100 p-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-sm">
                      {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {user.organization_name || user.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col">
              <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 px-6 py-4 md:hidden">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200" />
                  <div className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-lg font-bold text-gradient">NutriCycle</h1>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <div className="flex flex-col min-h-screen">
          <header className="glass-effect border-b border-emerald-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">NutriCycle</h1>
              </div>
              <p className="text-emerald-700 font-medium">Connect • Share • Nourish</p>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
