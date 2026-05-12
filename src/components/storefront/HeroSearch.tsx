import React from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-4 rounded-3xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Car" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight"
        >
          Rental reinvented
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/90 text-lg md:text-xl mb-12 hidden md:block"
        >
          Rent the exact car you want, exactly where you need it.
        </motion.p>

        {/* Search Bar Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2"
        >
          {/* Where */}
          <div className="flex-1 px-4 py-2 text-left border-b md:border-b-0 md:border-r border-gray-100">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Where</label>
            <input 
              type="text" 
              placeholder="Airport, hotel, address..." 
              className="w-full text-sm font-medium outline-none placeholder:text-gray-400"
            />
          </div>

          {/* From */}
          <div className="flex-1 px-4 py-2 text-left border-b md:border-b-0 md:border-r border-gray-100 flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">From</label>
              <div className="flex items-center gap-2 cursor-pointer">
                <input type="text" placeholder="Add dates" className="w-full text-sm font-medium outline-none placeholder:text-gray-400 cursor-pointer" readOnly />
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Until */}
          <div className="flex-1 px-4 py-2 text-left flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Until</label>
              <div className="flex items-center gap-2 cursor-pointer">
                <input type="text" placeholder="Add dates" className="w-full text-sm font-medium outline-none placeholder:text-gray-400 cursor-pointer" readOnly />
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="bg-black hover:bg-gray-800 text-white p-4 md:p-5 rounded-xl md:rounded-full transition-all flex items-center justify-center">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
