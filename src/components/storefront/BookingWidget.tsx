"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Shield, Clock,
  CreditCard, AlertCircle, Check, X, Loader2, CheckCircle2
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface BookingWidgetProps {
  car: {
    id: string;
    name: string;
    pricePerDay: number;
    isAvailable: boolean;
  };
  bookedDates?: string[]; // ISO date strings: "2026-05-15"
  initialStart?: string;
  initialEnd?: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAY_NAMES = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

/* ─────────────────────────────────────────────
   Calendar Component
───────────────────────────────────────────── */
function Calendar({
  viewYear, viewMonth, onPrev, onNext,
  startDate, endDate, hoverDate,
  onDayClick, onDayHover, bookedSet, today
}: {
  viewYear: number; viewMonth: number;
  onPrev: () => void; onNext: () => void;
  startDate: Date | null; endDate: Date | null;
  hoverDate: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  bookedSet: Set<string>;
  today: Date;
}) {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const rangeEnd = endDate ?? (startDate && hoverDate && hoverDate > startDate ? hoverDate : null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev} className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
          <ChevronLeft size={14} className="text-[#555]" />
        </button>
        <span className="text-[13px] font-semibold text-[#0A0A0A]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={onNext} className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
          <ChevronRight size={14} className="text-[#555]" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-[#bbb] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = new Date(viewYear, viewMonth, i + 1);
          const dateStr = formatDate(day);
          const isPast = day < today && !isSameDay(day, today);
          const isBooked = bookedSet.has(dateStr);
          const isStart = startDate ? isSameDay(day, startDate) : false;
          const isEnd = endDate ? isSameDay(day, endDate) : false;
          const isToday = isSameDay(day, today);
          const inRange = startDate && rangeEnd && !isStart && !isEnd && isInRange(day, startDate, rangeEnd);

          const disabled = isPast || isBooked;

          return (
            <div
              key={dateStr}
              className={`
                relative flex items-center justify-center
                ${inRange ? "bg-black/[0.05]" : ""}
                ${isStart ? "rounded-l-full" : ""}
                ${isEnd ? "rounded-r-full" : ""}
              `}
            >
              <button
                disabled={disabled}
                onClick={() => !disabled && onDayClick(day)}
                onMouseEnter={() => !disabled && onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                className={`
                  w-8 h-8 rounded-full text-[12px] font-medium transition-all duration-150 relative z-10
                  ${disabled
                    ? "text-[#ccc] cursor-not-allowed line-through"
                    : (isStart || isEnd)
                      ? "bg-[#0A0A0A] text-white font-bold"
                      : inRange
                        ? "text-[#0A0A0A] hover:bg-black/10"
                        : isToday
                          ? "text-[#0A0A0A] ring-1 ring-[#0A0A0A] ring-inset font-semibold"
                          : "text-[#333] hover:bg-black/5"
                  }
                `}
              >
                {i + 1}
                {isBooked && !isPast && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Widget
───────────────────────────────────────────── */
export default function BookingWidget({
  car, bookedDates = [], initialStart, initialEnd
}: BookingWidgetProps) {
  const router = useRouter();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates]);

  const [startDate, setStartDate] = useState<Date | null>(initialStart ? parseDate(initialStart) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd ? parseDate(initialEnd) : null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [step, setStep] = useState<"idle" | "picking-start" | "picking-end">(
    initialStart && initialEnd ? "idle" : "picking-start"
  );
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // 🟢 NEW STATE FOR SUCCESS UI
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showForm, setShowForm] = useState(false);

  /* Days calculation */
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
  }, [startDate, endDate]);

  const subtotal = days * car.pricePerDay;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  /* Navigation */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  /* Day click logic */
  const handleDayClick = (day: Date) => {
    if (step === "picking-start" || (step === "idle" && !endDate)) {
      setStartDate(day);
      setEndDate(null);
      setStep("picking-end");
      setShowForm(false);
    } else if (step === "picking-end") {
      if (day <= startDate!) {
        setStartDate(day);
        setEndDate(null);
      } else {
        setEndDate(day);
        setStep("idle");
      }
    } else {
      setStartDate(day);
      setEndDate(null);
      setStep("picking-end");
      setShowForm(false);
    }
  };

  /* 🟢 BOOKING SUBMIT FIX 🟢 */
  const handleBook = async () => {
    if (!startDate || !endDate || !firstName || !lastName || !phone) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: car.id,       // FIX: Changed from carId
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          firstName, 
          lastName, 
          phone,
          totalAmount: total       // FIX: Changed from totalPrice
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la réservation.");
      }
      
      // SUCCESS! Show the beautiful confirmation screen
      setIsSuccess(true);
      
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success UI ── */
  if (isSuccess) {
    return (
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl border border-black/[0.07] shadow-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demande Envoyée !</h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Votre réservation a été transmise à l'agence. Nous vous contacterons rapidement au <b>{phone}</b> pour confirmer.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="mt-6 text-sm font-semibold text-[#0A0A0A] hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  /* ── Widget content (shared between desktop & mobile) ── */
  const widgetContent = (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
          {step === "picking-start" ? "Sélectionnez la date de départ"
            : step === "picking-end" ? "Sélectionnez la date de retour"
            : "Période de location"}
        </p>

        {(startDate || endDate) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div
              className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${step === "picking-start" ? "border-[#0A0A0A] bg-[#0A0A0A]/[0.03]" : "border-black/10 hover:border-black/20"}`}
              onClick={() => { setStep("picking-start"); setEndDate(null); }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#aaa] mb-0.5">Départ</p>
              <p className="text-[13px] font-semibold text-[#0A0A0A]">
                {startDate ? startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${step === "picking-end" ? "border-[#0A0A0A] bg-[#0A0A0A]/[0.03]" : "border-black/10 hover:border-black/20"}`}
              onClick={() => startDate && setStep("picking-end")}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#aaa] mb-0.5">Retour</p>
              <p className="text-[13px] font-semibold text-[#0A0A0A]">
                {endDate ? endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
              </p>
            </div>
          </div>
        )}

        <Calendar
          viewYear={viewYear}
          viewMonth={viewMonth}
          onPrev={prevMonth}
          onNext={nextMonth}
          startDate={startDate}
          endDate={endDate}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          bookedSet={bookedSet}
          today={today}
        />

        <div className="flex gap-4 mt-3 text-[10px] text-[#aaa]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0A0A0A]" />Sélectionné</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-[#0A0A0A]" />Aujourd'hui</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-300" />Réservé</span>
        </div>
      </div>

      {days > 0 && (
        <div className="bg-[#F8F8F6] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[13px] text-[#555]">
            <span>{car.pricePerDay.toLocaleString("fr-MA")} MAD × {days} jour{days > 1 ? "s" : ""}</span>
            <span className="font-medium text-[#0A0A0A]">{subtotal.toLocaleString("fr-MA")} MAD</span>
          </div>
          <div className="flex justify-between text-[13px] text-[#555]">
            <span>Frais de service (5%)</span>
            <span className="font-medium text-[#0A0A0A]">{serviceFee.toLocaleString("fr-MA")} MAD</span>
          </div>
          <div className="border-t border-black/10 pt-2 flex justify-between">
            <span className="text-[14px] font-bold text-[#0A0A0A]">Total</span>
            <span className="text-[14px] font-bold text-[#0A0A0A]">{total.toLocaleString("fr-MA")} MAD</span>
          </div>
        </div>
      )}

      {days > 0 && !showForm && (
        <button onClick={() => setShowForm(true)} className="w-full bg-[#0A0A0A] text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-[#222] transition-colors">
          Continuer la réservation
        </button>
      )}

      {days > 0 && showForm && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#888]">Vos informations</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-[#888] mb-1">Prénom</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Mohammed" className="w-full text-sm border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] text-[#888] mb-1">Nom</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Alami" className="w-full text-sm border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-[#888] mb-1">Téléphone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212 6 00 00 00 00" type="tel" className="w-full text-sm border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors" />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-[12px] text-red-500 bg-red-50 rounded-xl p-3">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading || !firstName || !lastName || !phone}
            className="w-full bg-[#0A0A0A] text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" />Traitement en cours…</>
            ) : (
              <><Check size={15} />Confirmer la réservation</>
            )}
          </button>
        </div>
      )}

      {!car.isAvailable && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800">Véhicule indisponible</p>
            <p className="text-[12px] text-amber-600 mt-0.5">Activez une notification pour être alerté quand ce véhicule se libère.</p>
          </div>
        </div>
      )}

      <div className="border-t border-black/[0.06] pt-4 space-y-2">
        {[
          { icon: Shield, text: "Assurance tous risques incluse" },
          { icon: Clock, text: "Annulation gratuite jusqu'à 24h avant" },
          { icon: CreditCard, text: "Paiement sécurisé à l'agence" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[12px] text-[#777]">
            <Icon size={12} className="text-[#aaa] shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl border border-black/[0.07] shadow-xl p-6">
          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="text-[28px] font-bold text-[#0A0A0A] tracking-tight">
              {car.pricePerDay.toLocaleString("fr-MA")}
            </span>
            <span className="text-[14px] text-[#888] font-medium">MAD / jour</span>
          </div>
          {widgetContent}
        </div>
      </div>

      {/* MOBILE SHEET */}
      <div className="lg:hidden">
        {isSuccess ? (
          <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Réservation réussie !</h2>
            <p className="text-gray-600 font-medium mb-8">L'agence vous contactera au {phone}.</p>
            <button onClick={() => window.location.href = "/"} className="bg-black text-white px-8 py-4 rounded-xl font-bold w-full max-w-sm">Retour à l'accueil</button>
          </div>
        ) : (
          <>
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/[0.06] px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
              <div>
                <p className="text-[18px] font-bold text-[#0A0A0A] leading-none">
                  {car.pricePerDay.toLocaleString("fr-MA")} <span className="text-[12px] font-medium text-[#888]">MAD/jour</span>
                </p>
                {days > 0 && (
                  <p className="text-[12px] text-[#888] mt-0.5">
                    Total: <span className="font-semibold text-[#0A0A0A]">{total.toLocaleString("fr-MA")} MAD</span>
                  </p>
                )}
              </div>
              {car.isAvailable ? (
                <button
                  onClick={() => setMobileOpen(true)}
                  className="bg-[#0A0A0A] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#222] transition-colors whitespace-nowrap"
                >
                  {days > 0 ? "Réserver" : "Choisir les dates"}
                </button>
              ) : (
                <button className="border border-dashed border-black/20 text-[#555] font-medium text-sm px-5 py-3 rounded-xl whitespace-nowrap">
                  M'alerter
                </button>
              )}
            </div>

            {mobileOpen && (
              <div className="fixed inset-0 z-50 flex items-end">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                <div className="relative w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-black/10" /></div>
                  <div className="px-5 pb-8">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="font-bold text-[#0A0A0A] text-base">{car.name}</p>
                        <p className="text-[13px] text-[#888]">{car.pricePerDay.toLocaleString("fr-MA")} MAD / jour</p>
                      </div>
                      <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                        <X size={14} className="text-[#555]" />
                      </button>
                    </div>
                    {widgetContent}
                    <div className="h-4" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}