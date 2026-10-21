import { useEffect, useRef } from 'react';

export function BrandMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.16" />
      <circle cx="16" cy="16" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="16" cy="16" r="4.1" fill="none" stroke="var(--color-accent)" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function HeroKineticBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let pointerX = 0.65;
    let pointerY = 0.45;
    let targetX = 0.65;
    let targetY = 0.45;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetX = (event.clientX - rect.left) / rect.width;
        targetY = (event.clientY - rect.top) / rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tick = 0;

    const render = () => {
      tick += reducedMotion ? 0 : 0.008;
      pointerX += (targetX - pointerX) * 0.05;
      pointerY += (targetY - pointerY) * 0.05;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const styles = getComputedStyle(document.documentElement);
      const bg = styles.getPropertyValue('--color-bg').trim();
      const fg = styles.getPropertyValue('--color-fg').trim();
      const accent = styles.getPropertyValue('--color-accent').trim();

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const centerX = width * (0.62 + (pointerX - 0.5) * 0.14);
      const centerY = height * (0.46 + (pointerY - 0.5) * 0.14);
      const outerRadius = Math.max(width, height) * 0.68;

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        outerRadius * 0.04,
        centerX,
        centerY,
        outerRadius
      );
      glow.addColorStop(0, accent);
      glow.addColorStop(0.42, bg);
      glow.addColorStop(1, bg);

      ctx.save();
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Architectural perspective grid & harmonic wave ribbons
      ctx.save();
      ctx.strokeStyle = fg;
      const ribbonCount = 14;
      for (let i = 0; i < ribbonCount; i++) {
        const ratio = i / (ribbonCount - 1);
        ctx.globalAlpha = 0.04 + ratio * 0.09;
        ctx.lineWidth = i % 4 === 0 ? 1.2 : 0.7;
        ctx.beginPath();
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * width;
          const waveA = Math.sin(s * 0.14 + tick + i * 0.35) * (26 + i * 3.5);
          const waveB = Math.cos(s * 0.08 - tick * 0.7 + i * 0.2) * 18;
          const y = height * (0.22 + ratio * 0.62) + waveA + waveB;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      if (!reducedMotion) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-ken absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}

export function OrbitOverlay() {
  return (
    <svg
      className="pointer-events-none absolute -right-[18%] top-1/2 hidden h-[140%] w-[78%] -translate-y-1/2 text-fg/25 lg:block"
      viewBox="0 0 800 800"
      fill="none"
      aria-hidden="true"
    >
      <g className="orbit-spin">
        <circle cx="400" cy="400" r="220" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="1" />
        <circle cx="620" cy="220" r="3.5" fill="var(--color-accent)" />
        <circle cx="760" cy="400" r="3" fill="currentColor" />
        <circle cx="640" cy="620" r="3.5" fill="var(--color-accent)" />
      </g>
      <g className="orbit-reverse">
        <circle
          cx="400"
          cy="400"
          r="260"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="6 10"
        />
        <circle cx="140" cy="400" r="2.5" fill="currentColor" />
      </g>
    </svg>
  );
}

export function ModuleVisual({
  variant,
  loadFactor = 1,
  className = 'h-full w-full',
}: {
  variant: number;
  loadFactor?: number;
  className?: string;
}) {
  const scaleMod = 1 + (loadFactor - 1) * 0.08;

  return (
    <div
      className={`relative overflow-hidden bg-bg-elevated select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 720"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        fill="none"
      >
        <defs>
          <radialGradient id={`mod-glow-${variant}`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.38" />
            <stop offset="55%" stopColor="var(--color-fg)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
          </radialGradient>
          <pattern
            id={`mod-grid-${variant}`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-fg)"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="600" height="720" fill="var(--color-bg-elevated)" />
        <rect width="600" height="720" fill={`url(#mod-grid-${variant})`} />
        <circle cx="300" cy="310" r={260 * scaleMod} fill={`url(#mod-glow-${variant})`} />

        {variant === 0 && (
          <g className="orbit-spin" style={{ transformOrigin: '300px 320px' }}>
            <circle cx="300" cy="320" r="175" stroke="var(--color-fg)" strokeOpacity="0.28" strokeWidth="1.2" />
            <circle cx="300" cy="320" r="125" stroke="var(--color-accent)" strokeOpacity="0.65" strokeWidth="1.5" strokeDasharray="12 8" />
            <circle cx="300" cy="320" r="72" stroke="var(--color-fg)" strokeOpacity="0.45" strokeWidth="1.2" />
            <line x1="100" y1="320" x2="500" y2="320" stroke="var(--color-fg)" strokeOpacity="0.16" strokeWidth="1" />
            <line x1="300" y1="120" x2="300" y2="520" stroke="var(--color-fg)" strokeOpacity="0.16" strokeWidth="1" />
            <circle cx="425" cy="320" r="5" fill="var(--color-accent)" />
            <circle cx="300" cy="145" r="4" fill="var(--color-fg)" />
            <circle cx="175" cy="320" r="5" fill="var(--color-accent)" />
          </g>
        )}

        {variant === 1 && (
          <g>
            <polygon
              points="300,130 470,230 470,410 300,510 130,410 130,230"
              stroke="var(--color-fg)"
              strokeOpacity="0.3"
              strokeWidth="1.3"
            />
            <polygon
              points="300,185 420,255 420,385 300,455 180,385 180,255"
              stroke="var(--color-accent)"
              strokeOpacity="0.7"
              strokeWidth="1.5"
            />
            <line x1="300" y1="130" x2="300" y2="510" stroke="var(--color-fg)" strokeOpacity="0.18" />
            <line x1="130" y1="230" x2="470" y2="410" stroke="var(--color-fg)" strokeOpacity="0.18" />
            <line x1="470" y1="230" x2="130" y2="410" stroke="var(--color-fg)" strokeOpacity="0.18" />
            <circle cx="300" cy="320" r="9" fill="var(--color-accent)" />
            <circle cx="300" cy="185" r="4.5" fill="var(--color-fg)" />
            <circle cx="420" cy="255" r="4.5" fill="var(--color-fg)" />
            <circle cx="420" cy="385" r="4.5" fill="var(--color-fg)" />
            <circle cx="300" cy="455" r="4.5" fill="var(--color-fg)" />
            <circle cx="180" cy="385" r="4.5" fill="var(--color-fg)" />
            <circle cx="180" cy="255" r="4.5" fill="var(--color-fg)" />
          </g>
        )}

        {variant === 2 && (
          <g>
            {[0, 1, 2, 3, 4].map((idx) => (
              <rect
                key={idx}
                x={145 + idx * 18}
                y={165 + idx * 18}
                width={310 - idx * 36}
                height={310 - idx * 36}
                rx={16}
                stroke={idx === 2 ? 'var(--color-accent)' : 'var(--color-fg)'}
                strokeOpacity={idx === 2 ? 0.8 : 0.22 + idx * 0.06}
                strokeWidth={idx === 2 ? 1.6 : 1.1}
              />
            ))}
            <circle cx="300" cy="320" r="18" stroke="var(--color-accent)" strokeWidth="1.5" />
            <circle cx="300" cy="320" r="4" fill="var(--color-fg)" />
          </g>
        )}

        {variant === 3 && (
          <g>
            <path
              d="M300 135 L455 205 L455 340 C455 435 388 505 300 535 C212 505 145 435 145 340 L145 205 Z"
              stroke="var(--color-fg)"
              strokeOpacity="0.34"
              strokeWidth="1.4"
            />
            <path
              d="M300 185 L410 235 L410 335 C410 402 362 454 300 478 C238 454 190 402 190 335 L190 235 Z"
              stroke="var(--color-accent)"
              strokeOpacity="0.75"
              strokeWidth="1.5"
              strokeDasharray="10 6"
            />
            <circle cx="300" cy="330" r="44" stroke="var(--color-fg)" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="300" cy="330" r="6" fill="var(--color-accent)" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function CaseStudyVisual({ index }: { index: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-elevated" aria-hidden="true">
      <svg
        viewBox="0 0 800 500"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        fill="none"
      >
        <defs>
          <linearGradient id={`case-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
            <stop offset="50%" stopColor="var(--color-bg-elevated)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill={`url(#case-grad-${index})`} />

        {/* Architectural perspective lines */}
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <line
            key={row}
            x1="0"
            y1={70 * row + 40}
            x2="800"
            y2={70 * row + 40}
            stroke="var(--color-fg)"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        ))}

        {index % 2 === 0 ? (
          <g>
            <circle cx="580" cy="220" r="170" stroke="var(--color-fg)" strokeOpacity="0.22" strokeWidth="1.2" />
            <circle cx="580" cy="220" r="110" stroke="var(--color-accent)" strokeOpacity="0.6" strokeWidth="1.5" />
            <path
              d="M 80 360 Q 260 180 440 270 T 740 140"
              stroke="var(--color-accent)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 80 390 Q 280 240 460 300 T 740 200"
              stroke="var(--color-fg)"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        ) : (
          <g>
            <rect x="420" y="80" width="290" height="240" rx="14" stroke="var(--color-fg)" strokeOpacity="0.24" strokeWidth="1.2" />
            <rect x="450" y="110" width="230" height="180" rx="10" stroke="var(--color-accent)" strokeOpacity="0.65" strokeWidth="1.4" />
            <line x1="120" y1="140" x2="680" y2="360" stroke="var(--color-fg)" strokeOpacity="0.16" strokeWidth="1" />
            <circle cx="565" cy="200" r="36" stroke="var(--color-fg)" strokeOpacity="0.45" strokeWidth="1.2" />
            <circle cx="565" cy="200" r="6" fill="var(--color-accent)" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function AtelierBannerVisual() {
  return (
    <svg
      viewBox="0 0 1440 640"
      className="h-full w-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="atelier-horizon" cx="50%" cy="85%" r="75%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.42" />
          <stop offset="48%" stopColor="var(--color-bg-elevated)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="1440" height="640" fill="url(#atelier-horizon)" />
      <ellipse cx="720" cy="560" rx="680" ry="240" stroke="var(--color-fg)" strokeOpacity="0.18" strokeWidth="1.2" />
      <ellipse cx="720" cy="560" rx="480" ry="165" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="1.4" />
      <ellipse cx="720" cy="560" rx="280" ry="95" stroke="var(--color-fg)" strokeOpacity="0.28" strokeWidth="1.1" />
      <line x1="0" y1="440" x2="1440" y2="440" stroke="var(--color-fg)" strokeOpacity="0.12" strokeWidth="1" />
    </svg>
  );
}
