"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid3x3 } from "lucide-react";

interface CarGalleryProps {
  images: string[];
  carName: string;
}

export default function CarGallery({ images, carName }: CarGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // 🟢 CORRECTION ICI : On filtre toutes les images qui sont juste des espaces vides (" " ou "")
  const imgs = images.filter(img => typeof img === 'string' && img.trim() !== "");
  const hasMultiple = imgs.length > 1;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i - 1 + imgs.length) % imgs.length : null);
  }, [imgs.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i + 1) % imgs.length : null);
  }, [imgs.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  /* ── Fallback s'il n'y a pas d'image valide ── */
  if (imgs.length === 0) {
    return (
      <div className="aspect-[16/7] bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/20 text-5xl font-bold tracking-tighter">{carName.split(" ")[0].toUpperCase()}</p>
          <p className="text-white/10 text-sm mt-2">Aucune photo disponible</p>
        </div>
      </div>
    );
  }

  /* ── 1 seule image ── */
  if (imgs.length === 1) {
    return (
      <div
        className="relative aspect-[16/7] rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setLightboxIndex(0)}
      >
        <Image src={imgs[0]} alt={carName} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={11} />
          Agrandir
        </div>
      </div>
    );
  }

  /* ── Multi-images ── */
  const primary = imgs[0];
  const thumbnails = imgs.slice(1, 5); 
  const remaining = imgs.length - 5;

  return (
    <>
      <div className="grid gap-2 rounded-2xl overflow-hidden" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto" }}>
        <div
          className="relative cursor-zoom-in group overflow-hidden"
          style={{ gridRow: "span 2", aspectRatio: "4/3" }}
          onClick={() => setLightboxIndex(0)}
        >
          <Image src={primary} alt={`${carName} — vue principale`} fill priority className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {thumbnails.map((src, i) => {
          const isLast = i === thumbnails.length - 1 && remaining > 0;
          return (
            <div key={src} className="relative cursor-pointer group overflow-hidden" style={{ aspectRatio: "16/10" }} onClick={() => setLightboxIndex(i + 1)}>
              <Image src={src} alt={`${carName} — photo ${i + 2}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              {isLast && remaining > 0 ? (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center gap-2" onClick={e => { e.stopPropagation(); setShowAll(true); setLightboxIndex(i + 1); }}>
                  <Grid3x3 size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">+{remaining + 1} photos</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              )}
            </div>
          );
        })}
      </div>

      {imgs.length > 5 && !showAll && (
        <button onClick={() => { setShowAll(true); setLightboxIndex(0); }} className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#0A0A0A] hover:text-[#333] transition-colors border border-black/10 rounded-full px-4 py-2 hover:bg-black/5">
          <Grid3x3 size={13} />
          Voir les {imgs.length} photos
        </button>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col" onClick={closeLightbox}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0" onClick={e => e.stopPropagation()}>
            <div>
              <p className="text-white font-semibold text-sm">{carName}</p>
              <p className="text-white/40 text-xs mt-0.5">{lightboxIndex + 1} / {imgs.length}</p>
            </div>
            <button onClick={closeLightbox} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 sm:px-16 min-h-0 relative" onClick={e => e.stopPropagation()}>
            {hasMultiple && (
              <button onClick={prevImage} className="absolute left-2 sm:left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-10">
                <ChevronLeft size={18} className="text-white" />
              </button>
            )}
            <div className="relative w-full max-w-5xl aspect-[16/9]">
              <Image src={imgs[lightboxIndex]} alt={`${carName} — photo ${lightboxIndex + 1}`} fill className="object-contain" sizes="100vw" priority />
            </div>
            {hasMultiple && (
              <button onClick={nextImage} className="absolute right-2 sm:right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-10">
                <ChevronRight size={18} className="text-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}