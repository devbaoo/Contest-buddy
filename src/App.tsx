import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { ChatProvider } from "./contexts/ChatContext";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Competition from "./pages/Competition";
import Community from "./pages/Community";
import Teams from "./pages/Teams";
import CompetitionManagement from "./pages/CompetitionManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import UserDetails from "./pages/UserDetails";
import TeamDetails from "./pages/TeamDetails";
import MyCompetitions from "./pages/MyCompetitions";
import OrganizerBilling from "./pages/OrganizerBilling";
import About from "./pages/About";
import Footer from "./components/Footer";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserRoleProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <div className="min-h-screen bg-background">
                <main>
                  <div className="container py-8">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/competition/:id" element={<Competition />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/user/:id" element={<UserDetails />} />
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/teams/:id" element={<TeamDetails />} />
                      <Route path="/my-competitions" element={<MyCompetitions />} />
                      <Route
                        path="/admin/competitions"
                        element={<CompetitionManagement />}
                      />
                      <Route path="/admin/users" element={<UserManagement />} />
                      <Route path="/admin/reports" element={<Reports />} />
                      <Route path="/admin/analytics" element={<Analytics />} />
                      <Route path="/admin/billing" element={<OrganizerBilling />} />
                      <Route
                        path="/settings"
                        element={
                          <div className="container py-8">
                            <h1 className="text-2xl font-bold">
                              Cài đặt - Đang phát triển
                            </h1>
                            <p className="text-muted-foreground">
                              Tính năng này sẽ sớm được ra mắt!
                            </p>
                          </div>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
                <Chat />
              </div>
              <Footer />
            </BrowserRouter>
          </TooltipProvider>
        </ChatProvider>
      </UserRoleProvider>
    </QueryClientProvider>
  );
};

export default App;
