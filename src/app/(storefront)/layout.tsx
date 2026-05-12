import Navbar from "@/components/storefront/Navbar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#36AF62]/30 selection:text-[#36AF62]">
      
      {/* This loads the real Navbar now! */}
      <Navbar />

      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RentCar-OS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}