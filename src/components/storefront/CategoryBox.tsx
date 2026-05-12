import React from 'react';
import { Plane, CalendarDays, MapPin, Truck, Building2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All', icon: Car },
  { id: 'airports', label: 'Airports', icon: Plane },
  { id: 'monthly', label: 'Monthly', icon: CalendarDays },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: Truck },
  { id: 'cities', label: 'Cities', icon: Building2 },
];

export const CategoryFilter: React.FC = () => {
  const [active, setActive] = React.useState('all');

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-4 px-4 no-scrollbar">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
              isActive 
                ? "bg-black text-white shadow-lg" 
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
