/*
 * PAGE CHOREOGRAPHY STORYBOARD (Absolute times from mount)
 * -------------------------------------------------------------------------
 *    0ms : Preloader mount, counter 00 -> 100 begins (GSAP power2.inOut)
 * 1650ms : Counter reaches 100, bottom accent bar fills 100%
 * 1770ms : Preloader curtain lifts (yPercent: -100, power4.inOut, 850ms)
 * 2620ms : Ready signal fires -> Hero media scales 1.12 -> 1.00 (1800ms)
 * 2770ms : Hero copy items stagger in (blur 8px -> 0px, y 28 -> 0, 100ms each)
 * -------------------------------------------------------------------------
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { BrandMark } from './VisualCanvas';
import { useAppSettings } from '../context/AppSettingsContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const TIMING = {
  LOADER_COUNT_DURATION: 1.55,
  LOADER_EXIT_DELAY: 0.12,
  LOADER_EXIT_DURATION: 0.85,
  HERO_STAGGER: 0.1,
  HERO_ITEM_DURATION: 1.1,
  HERO_MEDIA_DURATION: 1.8,
  MAGNETIC_MOVE_DURATION: 0.35,
  MAGNETIC_RESET_DURATION: 0.55,
  CURSOR_LERP: 0.16,
  LENIS_LERP: 0.09,
} as const;

let activeLenisInstance: Lenis | null = null;

export function smoothScrollToSection(sectionId: string) {
  const selector = `#${sectionId}`;
  if (activeLenisInstance) {
    activeLenisInstance.scrollTo(selector, { offset: -16 });
    return;
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

export function SmoothScrollProvider({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) {
  useEffect(() => {
    if (disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const lenis = new Lenis({
      autoRaf: false,
      lerp: TIMING.LENIS_LERP,
      smoothWheel: true,
    });
    activeLenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      activeLenisInstance = null;
    };
  }, [disabled]);

  return <>{children}</>;
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const { t } = useAppSettings();
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onComplete);
  callbackRef.current = onComplete;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      callbackRef.current();
      return;
    }

    document.body.style.overflow = 'hidden';
    const counterState = { value: 0 };

    const tween = gsap.to(counterState, {
      value: 100,
      duration: TIMING.LOADER_COUNT_DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(counterState.value);
        setProgress(rounded);
        if (barRef.current) {
          barRef.current.style.width = `${rounded}%`;
        }
      },
      onComplete: () => {
        gsap.to('[data-loader]', {
          yPercent: -100,
          duration: TIMING.LOADER_EXIT_DURATION,
          ease: 'power4.inOut',
          delay: TIMING.LOADER_EXIT_DELAY,
          onComplete: () => {
            document.body.style.overflow = '';
            callbackRef.current();
          },
        });
      },
    });

    return () => {
      tween.kill();
      document.body.style.overflow = '';
    };
  }, []);

  const handleSkip = () => {
    document.body.style.overflow = '';
    callbackRef.current();
  };

  return (
    <div
      data-loader="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-8 text-fg md:px-12"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark className="size-8" />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.22em]">
            {t.brand.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="min-h-12 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-line-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t.brand.skipLoader}
        </button>
      </div>

      <div className="flex items-end justify-between gap-6">
        <p className="font-serif text-3xl md:text-5xl">{t.brand.preloaderTitle}</p>
        <p className="font-display text-5xl font-semibold tabular-nums tracking-tight md:text-7xl">
          {String(progress).padStart(2, '0')}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div ref={barRef} className="h-px w-0 bg-accent" />
      </div>
    </div>
  );
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');

    const pointer = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let visible = false;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let frameId = 0;
    const updateRing = () => {
      ring.x += (pointer.x - ring.x) * TIMING.CURSOR_LERP;
      ring.y += (pointer.y - ring.y) * TIMING.CURSOR_LERP;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      frameId = window.requestAnimationFrame(updateRing);
    };
    frameId = window.requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(frameId);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg opacity-0 mix-blend-difference lg:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fg/50 opacity-0 mix-blend-difference lg:block"
      />
    </>
  );
}

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 'top top',
          end: 'bottom bottom',
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px origin-left bg-transparent">
      <div ref={barRef} className="h-px origin-left scale-x-0 bg-accent" />
    </div>
  );
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = btn.getBoundingClientRect();
    const deltaX = event.clientX - rect.left - rect.width / 2;
    const deltaY = event.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: deltaX * 0.22,
      y: deltaY * 0.28,
      duration: TIMING.MAGNETIC_MOVE_DURATION,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: TIMING.MAGNETIC_RESET_DURATION,
      ease: 'power3.out',
    });
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-7 py-3.5 text-[15px] font-medium tracking-tight text-bg transition-transform duration-150 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function RevealUp({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.style.transitionDelay = `${delay}s`;
          el.classList.add('is-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={containerRef} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
}
