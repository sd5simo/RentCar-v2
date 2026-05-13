"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open, title, description, confirmLabel = "Supprimer",
  danger = true, loading = false, onConfirm, onCancel,
}: Props) {
  // Ensure the portal only renders on the client side (Next.js requirement)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Bonus: Prevent the user from scrolling the background while the modal is open
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open || !mounted) return null;

  // Render the modal directly into the <body> tag
  return createPortal(
    // Increased z-index to 9999 to guarantee it sits above absolutely everything
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <button onClick={onCancel}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
          <X size={15} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            danger ? "bg-red-500/15 border border-red-500/25" : "bg-brand-orange-500/15 border border-brand-orange-500/25")}>
            <AlertTriangle size={18} className={danger ? "text-red-400" : "text-brand-orange-400"} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 bg-[#1c2130] border border-[#30363d] text-slate-400 font-semibold rounded-lg text-sm hover:text-white transition-colors disabled:opacity-50">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={cn("flex-1 py-2.5 font-semibold rounded-lg text-sm text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
              danger ? "bg-red-600 hover:bg-red-500" : "bg-brand-orange-600 hover:bg-brand-orange-500")}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}