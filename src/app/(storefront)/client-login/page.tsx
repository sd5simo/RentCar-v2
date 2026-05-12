"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulation d'une connexion basique (à relier plus tard à votre API)
    setTimeout(() => {
      setStatus('success');
      // Redirection simulée
      setTimeout(() => window.location.href = "/", 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f8fafc]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.png" alt="Background" className="w-full h-full object-cover blur-sm scale-105 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-[#f8fafc]/90" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black mb-6 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-md">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {status === 'success' ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-10 flex flex-col items-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-[#36AF62]/20 text-[#36AF62] rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Bienvenue !</h2>
            <p className="text-gray-600 font-medium">Connexion réussie. Redirection en cours...</p>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-3xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">RentCar-OS</h1>
              <p className="text-gray-600 mt-2 font-medium">
                {isLogin ? "Connectez-vous pour gérer vos réservations." : "Créez un compte pour louer des véhicules."}
              </p>
            </div>

            {/* Toggle Login/Signup */}
            <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl mb-8 border border-white shadow-sm">
              <button 
                onClick={() => setIsLogin(true)} 
                className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all", isLogin ? "bg-white shadow-md text-gray-900" : "text-gray-500 hover:text-gray-900")}
              >
                Connexion
              </button>
              <button 
                onClick={() => setIsLogin(false)} 
                className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all", !isLogin ? "bg-white shadow-md text-gray-900" : "text-gray-500 hover:text-gray-900")}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-white/70 backdrop-blur-md border border-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#36AF62] shadow-inner font-bold text-gray-900" placeholder="John" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Nom</label>
                    <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3.5 bg-white/70 backdrop-blur-md border border-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#36AF62] shadow-inner font-bold text-gray-900" placeholder="Doe" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    required 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3.5 bg-white/70 backdrop-blur-md border border-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#36AF62] shadow-inner font-bold text-gray-900 tracking-wider" 
                    placeholder="06 XX XX XX XX" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-[#36AF62] text-white py-4 rounded-2xl font-bold hover:bg-[#2e9452] transition-all shadow-lg shadow-[#36AF62]/30 mt-6 text-lg disabled:opacity-70"
              >
                {status === 'loading' ? 'Chargement...' : (isLogin ? "Se connecter" : "Créer mon compte")}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6 font-medium">
              En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}