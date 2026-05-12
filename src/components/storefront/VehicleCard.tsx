import React from 'react';
import { Vehicle } from '@prisma/client';
import { CarCard } from './CarCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarGridProps {
  title: string;
  subtitle?: string;
  vehicles: Vehicle[];
  onSelectCar: (car: Vehicle) => void;
}

export const CarGrid: React.FC<CarGridProps> = ({ title, subtitle, vehicles, onSelectCar }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {vehicles.map((car) => (
          <CarCard key={car.id} car={car} onClick={onSelectCar} />
        ))}
      </div>
    </section>
  );
};
