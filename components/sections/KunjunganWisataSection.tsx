"use client";

import React, { useEffect, useRef, useState } from "react";

export default function KunjunganWisataSection({ images = [] }: { images?: string[] }) {
  const defaultImages = Array.from({ length: 10 }, (_, i) => `/kunjungan/kunjungan_${i + 1}.jpeg`);
  const finalImages = images.length > 0 ? images : defaultImages;
  
  // Triplicate images to ensure smooth looping
  const duplicatedImages = [...finalImages, ...finalImages, ...finalImages];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;

    const scroll = () => {
      if (!isDragging) {
        container.scrollLeft += 1; // Kecepatan scroll
        // Jika sudah mencapai akhir set ke-2, reset diam-diam ke akhir set ke-1
        if (container.scrollLeft >= container.scrollWidth * (2 / 3)) {
          container.scrollLeft = container.scrollWidth / 3;
        } else if (container.scrollLeft <= 0) {
          // Jika digeser mundur hingga awal, reset ke awal set ke-2
          container.scrollLeft = container.scrollWidth / 3;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // kecepatan geser (drag)
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="kunjungan-wisata" className="py-24 bg-muted/10 border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins">
            DOKUMENTASI DESA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-foreground tracking-tight leading-tight">
            Kunjungan Wisata Salawu
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans">
            Momen-momen indah saat menjelajahi potensi wisata alam, interaksi sosial dengan warga, dan keunikan produk kerajinan lokal Desa Salawu.
          </p>
        </div>
      </div>

      {/* Marquee Container with Drag & Scroll */}
      <div className="w-full relative">
        <div 
          ref={scrollRef}
          className={`flex gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {duplicatedImages.map((src, idx) => (
            <div key={`${idx}`} className="w-[300px] sm:w-[450px] md:w-[600px] aspect-[4/3] flex-shrink-0 bg-background rounded-2xl overflow-hidden border border-border/40 relative shadow-md">
              <img 
                src={src} 
                alt={`Kunjungan Wisata`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
