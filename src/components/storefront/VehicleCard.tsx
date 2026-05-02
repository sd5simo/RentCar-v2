"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

// For now, we use 'any' for data to clear the errors. 
// Later, we will connect this to your exact Prisma Vehicle type.
interface VehicleCardProps {
  data: any; 
  reservation?: any;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  return (
    <div 
      onClick={() => router.push(`/car/${data?.id}`)} 
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        
        {/* Car Image Area */}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-gray-200">
          {data?.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt="Car" 
              className="object-cover h-full w-full group-hover:scale-110 transition"
            />
          ) : (
             <div className="h-full w-full flex items-center justify-center text-gray-400">
               No Image
             </div>
          )}
        </div>

        {/* Car Details */}
        <div className="font-semibold text-lg">
          {data?.brand || "Brand"} {data?.model || "Model"}
        </div>
        
        <div className="font-light text-neutral-500">
          {data?.category || "Category"}
        </div>
        
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {data?.dailyRate || data?.price || "0"}
          </div>
          {!reservation && (
            <div className="font-light">/ day</div>
          )}
        </div>

        {/* Action Button (Used for canceling reservations later) */}
        {onAction && actionLabel && (
          <button 
            disabled={disabled} 
            onClick={handleCancel}
            className="w-full bg-rose-500 text-white rounded-lg py-2 mt-2 font-semibold hover:bg-rose-600 transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default VehicleCard;