"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  vehicleId: string;
  dailyRate: number;
}

export default function BookingWidget({ vehicleId, dailyRate }: BookingWidgetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const handleReserve = async () => {
    if (!startDate || !endDate) return alert("Please select dates!");
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/public/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          startDate,
          endDate,
          clientName,
          clientPhone,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        alert("Something went wrong with the booking.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">Request Sent!</h3>
        <p className="text-green-600">The agency will review your reservation shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden shadow-md p-6">
      <div className="text-2xl font-semibold mb-4">
        ${dailyRate} <span className="font-light text-neutral-500 text-lg">/ day</span>
      </div>
      <hr className="my-4"/>
      
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Your Full Name" 
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <div className="flex gap-2">
          <div className="w-full">
            <label className="text-xs text-gray-500 font-bold uppercase">Pick-up</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>
          <div className="w-full">
            <label className="text-xs text-gray-500 font-bold uppercase">Drop-off</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>
        </div>
      </div>

      <hr className="my-4"/>

      <button 
        onClick={handleReserve}
        disabled={isLoading}
        className={`w-full text-white rounded-lg py-3 font-semibold transition ${
          isLoading ? "bg-gray-400" : "bg-rose-500 hover:bg-rose-600"
        }`}
      >
        {isLoading ? "Processing..." : "Reserve Now"}
      </button>
    </div>
  );
}