"use client"; // 1. Required for Framer Motion and onClick handlers in Next.js

import React from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion'; // 2. Corrected from 'motion/react'
import { Vehicle } from '@prisma/client'; // 3. Direct import from Prisma, or use '@/types'

interface CarCardProps {
  car: Vehicle;
  onClick: (car: Vehicle) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onClick(car)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {/* 4. Added fallback for imageUrl to satisfy TypeScript's strict null checks */}
        <img 
          src={car.imageUrl || '/hero-bg.png'} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-bold text-lg text-gray-900">
            {car.brand} {car.model}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>5.0</span>
            <span className="text-gray-400">(24)</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">{car.year} • {car.category}</p>
        
        <div className="flex items-baseline gap-1 pt-1">
          <span className="font-bold text-lg">${car.dailyRate}</span>
          <span className="text-gray-500 text-sm">/day</span>
          <span className="text-gray-300 text-xs ml-2">${car.dailyRate * 3} total</span>
        </div>
      </div>
    </motion.div>
  );
};