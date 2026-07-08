"use client";

import { ReactNode, useEffect, useRef } from "react";
import Image from "next/image";

interface CursorRevealProps {
  frontSrc: string;
  revealSrc: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
}

export function CursorReveal({ frontSrc, revealSrc, alt = "", className, children }: CursorRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealImgRef = useRef<HTMLImageElement>(null);
  const frontImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const revealImg = revealImgRef.current;
    const frontImg = frontImgRef.current;

    if (!section || !canvas || !revealImg || !frontImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = 0;
    let y = 0;
    let targetRadius = 0;
    let currentRadius = 0;
    let raf: number | null = null;

    let rectLeft = 0;
    let rectTop = 0;
    let rectWidth = 0;
    let rectHeight = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      rectLeft = rect.left + window.scrollX;
      rectTop = rect.top + window.scrollY;
      rectWidth = rect.width;
      rectHeight = rect.height;
    };

    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentRadius = currentRadius * 0.92 + targetRadius * 0.08;
      if (currentRadius > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x - rectLeft, y - rectTop, currentRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(revealImg, 0, 0);
        ctx.restore();
      }
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(update); };
    const update = () => {
      paint();
      raf = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => { x = e.pageX; y = e.pageY; targetRadius = Math.min(rectWidth, 900) * 0.42; wake(); };
    const onLeave = () => { targetRadius = 0; wake(); };

    /* Keyboard path (2026-07 audit, unanimous item): tabbing into the band
       opens the light from its center — keyboard users get the same waking
       moment pointer users do. Focus leaving closes it again. */
    const onFocusIn = () => {
      x = rectWidth / 2;
      y = rectHeight / 2;
      targetRadius = Math.min(rectWidth, 900) * 0.42;
      wake();
    };

    measure();
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onLeave);
    window.addEventListener("resize", measure);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onLeave);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      <div className="relative">
        <Image ref={frontImgRef} src={frontSrc} alt={alt} width={800} height={600} className="block w-full" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block" />
        <Image ref={revealImgRef} src={revealSrc} alt="" width={800} height={600} className="absolute inset-0 h-full w-full object-cover" style={{ display: "none" }} />
      </div>
      {children}
    </div>
  );
}
