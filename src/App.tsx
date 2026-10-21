import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Globe,
  Layers,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useAppSettings } from './context/AppSettingsContext';
import {
  CustomCursor,
  MagneticButton,
  Preloader,
  RevealUp,
  ScrollProgressBar,
  SmoothScrollProvider,
  TIMING,
  smoothScrollToSection,
} from './components/InteractiveEffects';
import {
  AtelierBannerVisual,
  BrandMark,
  CaseStudyVisual,
  HeroKineticBackdrop,
  ModuleVisual,
  OrbitOverlay,
} from './components/VisualCanvas';

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
      {children}
    </p>
  );
}

function HeaderNav({ hidden }: { hidden: boolean }) {
  const { t, theme, toggleTheme, locale, toggleLocale } = useAppSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = [
    { id: 'modules', label: t.nav.modules },
    { id: 'cases', label: t.nav.cases },
    { id: 'protocol', label: t.nav.protocol },
    { id: 'tiers', label: t.nav.tiers },
    { id: 'demo', label: t.nav.demo },
  ];

  const handleNavigate = (id: string) => {
    setMobileOpen(false);
    smoothScrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-opacity duration-500 ${
          hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <nav
          aria-label={t.brand.name}
          className={`flex w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-line px-2.5 py-1.5 backdrop-blur-md transition-colors duration-300 ${
            scrolled ? 'bg-bg/85' : 'bg-bg/55'
          }`}
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex min-h-12 items-center gap-2.5 rounded-full py-1.5 pr-3 pl-2 focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={t.nav.homeAria}
          >
            <BrandMark className="size-8 text-fg" />
            <span className="hidden font-display text-[13px] font-semibold uppercase tracking-[0.18em] sm:inline">
              {t.brand.name}
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className="min-h-12 rounded-full px-3.5 py-2 text-[13px] text-fg/80 transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.nav.switchLang}
              className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-fg transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Globe className="size-3.5 text-accent" aria-hidden="true" />
              <span>{locale.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.nav.switchTheme}
              className="grid size-12 place-items-center rounded-full border border-line text-fg transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
            >
              {theme === 'dark' ? (
                <Sun className="size-4 text-accent" aria-hidden="true" />
              ) : (
                <Moon className="size-4 text-accent" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('connect')}
              className="hidden min-h-12 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-transform duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex sm:items-center"
            >
              {t.nav.connect}
            </button>

            <button
              type="button"
              className="grid size-12 place-items-center rounded-full lg:hidden"
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bg px-6 pt-28 lg:hidden">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className="w-full rounded-lg py-4 text-left font-serif text-3xl text-fg"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="pt-4">
              <button
                type="button"
                onClick={() => handleNavigate('connect')}
                className="w-full rounded-full bg-fg py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.18em] text-bg"
              >
                {t.nav.connect}
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

function HeroSection({
  ready,
  onCommission,
  onExploreLab,
}: {
  ready: boolean;
  onCommission: () => void;
  onExploreLab: () => void;
}) {
  const { t } = useAppSettings();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.fromTo(
        section.querySelectorAll('[data-hero-in]'),
        { y: 28, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: TIMING.HERO_ITEM_DURATION,
          stagger: TIMING.HERO_STAGGER,
        },
        0.15
      );
      timeline.fromTo(
        section.querySelector('[data-hero-media]'),
        { scale: 1.12 },
        { scale: 1, duration: TIMING.HERO_MEDIA_DURATION, ease: 'power2.out' },
        0
      );
    }, section);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-bg text-fg"
    >
      <div className="absolute inset-0 overflow-hidden" data-hero-media="true">
        <HeroKineticBackdrop />
        <div className="absolute inset-0 bg-linear-to-r from-bg/85 via-bg/35 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/25" />
      </div>

      <OrbitOverlay />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-24 pt-28 md:justify-center md:px-12 md:pb-16 lg:px-16">
        <div className="max-w-2xl">
          <p
            data-hero-in="true"
            className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-accent"
          >
            {t.hero.kicker}
          </p>
          <h1
            data-hero-in="true"
            className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.95] tracking-[-0.04em] md:text-6xl lg:text-[4.4rem]"
          >
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
            <br />
            {t.hero.titleLine3}
          </h1>
          <p
            data-hero-in="true"
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-fg/80 md:text-base"
          >
            {t.hero.subtitle}
          </p>
          <div data-hero-in="true" className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={onCommission}>{t.hero.primaryCta}</MagneticButton>
            <button
              type="button"
              onClick={onExploreLab}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-bg-elevated/60 px-6 py-3.5 text-[14px] font-medium text-fg backdrop-blur-sm transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>{t.hero.secondaryCta}</span>
              <ArrowUpRight className="size-4 text-accent" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 top-[44%] z-10 hidden -translate-y-1/2 flex-col items-end gap-16 lg:flex">
        {t.hero.telemetry.map((stat, idx) => (
          <div key={stat.label} className={idx === 1 ? 'mr-8' : ''}>
            <div className="flex items-baseline gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="font-display text-3xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </span>
            </div>
            <p className="mt-1 pl-3.5 text-[10px] uppercase tracking-[0.22em] text-fg/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ManifestoSection() {
  const { t } = useAppSettings();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-[2.4rem] leading-[1.05] tracking-[-0.03em] text-fg md:text-6xl lg:text-[5.2rem]">
          {t.manifesto.lines.map((line, idx) => (
            <span
              key={line}
              className={`line-mask ${revealed ? 'is-revealed' : ''}`}
            >
              <span style={{ transitionDelay: `${idx * 0.12}s` }}>{line}</span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-20">
          <RevealUp>
            <SectionKicker>{t.manifesto.col1Kicker}</SectionKicker>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              {t.manifesto.col1Body}
            </p>
          </RevealUp>
          <RevealUp delay={0.1}>
            <SectionKicker>{t.manifesto.col2Kicker}</SectionKicker>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              {t.manifesto.col2Body}
            </p>
          </RevealUp>
        </div>
      </div>
    </section>
  );
}

function MetricsCounterBar() {
  const { t } = useAppSettings();
  const barRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el || hasAnimatedRef.current) return;
    const counters = el.querySelectorAll<HTMLElement>('[data-count]');

    const runAnimation = () => {
      hasAnimatedRef.current = true;
      counters.forEach((node) => {
        const targetVal = Number(node.dataset.count || 0);
        const state = { val: 0 };
        gsap.to(state, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = String(Math.round(state.val));
          },
        });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [t.metrics]);

  return (
    <section
      ref={barRef}
      className="border-y border-line bg-bg px-5 py-10 md:px-12 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {t.metrics.map((metric) => (
          <div key={metric.label}>
            <p className="font-display text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">
              <span data-count={metric.value}>
                {hasAnimatedRef.current ? metric.value : 0}
              </span>
              {metric.suffix}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function KineticMarquee() {
  const { t } = useAppSettings();
  const doubled = [...t.marquee, ...t.marquee];

  return (
    <div className="overflow-hidden border-b border-line bg-bg py-5">
      <div className="marquee-track gap-10 px-6">
        {doubled.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.28em] text-faint"
          >
            {item}
            <span className="size-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

function ModulesSection({ onSelectModule }: { onSelectModule: (idx: number) => void }) {
  const { t } = useAppSettings();

  return (
    <section
      id="modules"
      className="scroll-mt-24 bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <RevealUp>
          <SectionKicker>{t.modules.kicker}</SectionKicker>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.08] tracking-[-0.03em] md:text-5xl">
            {t.modules.heading}
          </h2>
        </RevealUp>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.modules.items.map((mod, idx) => (
            <RevealUp key={mod.id} delay={idx * 0.06}>
              <button
                type="button"
                onClick={() => {
                  onSelectModule(idx);
                  smoothScrollToSection('demo');
                }}
                className="group block w-full overflow-hidden rounded-xl border border-line bg-bg-elevated text-left transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="relative aspect-4/5 overflow-hidden">
                  <ModuleVisual variant={idx} />
                  <div className="absolute inset-0 bg-linear-to-t from-bg/85 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.22em] text-fg/80">
                    {mod.tag}
                  </span>
                  <span className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full border border-line bg-bg/75 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-fg backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <span>{t.modules.inspectCta}</span>
                    <ArrowUpRight className="size-3.5 text-accent" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                    {mod.name}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{mod.line}</p>
                </div>
              </button>
            </RevealUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseRecordsSection() {
  const { t } = useAppSettings();
  const [activeCaseIndex, setActiveCaseIndex] = useState<number | null>(null);
  const activeCase =
    activeCaseIndex !== null ? t.cases.items[activeCaseIndex] ?? null : null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveCaseIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section
      id="cases"
      className="scroll-mt-24 bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <RevealUp>
          <SectionKicker>{t.cases.kicker}</SectionKicker>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            {t.cases.heading}
          </h2>
        </RevealUp>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {t.cases.items.map((record, idx) => (
            <RevealUp key={record.id} delay={idx * 0.05}>
              <button
                type="button"
                onClick={() => setActiveCaseIndex(idx)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line text-left transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="aspect-16/10 overflow-hidden">
                  <CaseStudyVisual index={idx} />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-fg/75">
                      {record.module} · {record.place}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-bg/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-fg backdrop-blur-sm">
                      <span>{t.cases.viewRecord}</span>
                      <ArrowUpRight className="size-3.5 text-accent" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {record.title}
                  </h3>
                </div>
              </button>
            </RevealUp>
          ))}
        </div>

        <RevealUp>
          <p className="mx-auto mt-16 max-w-2xl text-center font-serif text-2xl leading-snug text-fg/90 md:text-3xl">
            {t.cases.quote}
          </p>
        </RevealUp>
      </div>

      {activeCase && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-md"
          onClick={() => setActiveCaseIndex(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-line-strong bg-bg-elevated p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
                  {activeCase.module} · {activeCase.place}
                </p>
                <h3
                  id="case-modal-title"
                  className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl"
                >
                  {activeCase.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCaseIndex(null)}
                className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-fg hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="size-4" aria-hidden="true" />
                <span>{t.cases.closeModal}</span>
              </button>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              {activeCase.summary}
            </p>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-faint">
                {t.cases.impactLabel}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {activeCase.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="rounded-lg border border-line bg-bg p-3 font-display text-xs font-medium text-fg"
                  >
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-faint">
                {t.cases.stackLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeCase.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProtocolSection() {
  const { t } = useAppSettings();

  return (
    <section
      id="protocol"
      className="scroll-mt-24 bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <RevealUp>
            <SectionKicker>{t.protocol.kicker}</SectionKicker>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
              {t.protocol.heading}
            </h2>
          </RevealUp>

          <ol className="mt-12 space-y-8">
            {t.protocol.steps.map((step, idx) => (
              <RevealUp key={step.n} delay={idx * 0.05}>
                <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-line pt-6">
                  <span className="font-mono text-sm tracking-[0.2em] text-accent">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {step.copy}
                    </p>
                  </div>
                </li>
              </RevealUp>
            ))}
          </ol>
        </div>

        <RevealUp>
          <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
                  {t.protocol.blueprintTitle}
                </p>
                <p className="mt-1 text-xs text-muted">{t.protocol.blueprintSub}</p>
              </div>
              <Cpu className="size-5 text-accent" aria-hidden="true" />
            </div>
            <div className="mt-6 aspect-4/5 overflow-hidden rounded-lg border border-line">
              <ModuleVisual variant={1} />
            </div>
          </div>
        </RevealUp>
      </div>
    </section>
  );
}

function AtelierBanner() {
  const { t } = useAppSettings();

  return (
    <div className="relative h-[46vh] min-h-64 overflow-hidden border-y border-line md:h-[58vh]">
      <AtelierBannerVisual />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/40" />
      <p className="absolute bottom-8 left-5 font-serif text-2xl text-fg md:left-12 md:text-4xl lg:left-16">
        {t.banner.caption}
      </p>
    </div>
  );
}

function TiersSection({ onSelectTier }: { onSelectTier: (tierId: string) => void }) {
  const { t } = useAppSettings();

  return (
    <section
      id="tiers"
      className="scroll-mt-24 bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <RevealUp>
          <SectionKicker>{t.tiers.kicker}</SectionKicker>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            {t.tiers.heading}
          </h2>
        </RevealUp>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {t.tiers.items.map((tier, idx) => (
            <RevealUp key={tier.id} delay={idx * 0.06}>
              <article
                className={`flex h-full flex-col justify-between rounded-xl border p-6 md:p-8 ${
                  tier.featured
                    ? 'border-fg/25 bg-fg text-bg'
                    : 'border-line bg-bg-elevated text-fg'
                }`}
              >
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      tier.featured ? 'text-bg/60' : 'text-muted'
                    }`}
                  >
                    {tier.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="mt-1 font-serif text-3xl">{tier.price}</p>
                  <p
                    className={`mt-5 text-[15px] leading-relaxed ${
                      tier.featured ? 'text-bg/75' : 'text-muted'
                    }`}
                  >
                    {tier.copy}
                  </p>
                  <ul className="mt-8 space-y-2.5 text-sm">
                    {tier.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            tier.featured ? 'bg-bg' : 'bg-accent'
                          }`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTier(tier.id);
                      smoothScrollToSection('connect');
                    }}
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent ${
                      tier.featured
                        ? 'border-bg/20 bg-bg text-fg'
                        : 'border-line-strong bg-bg text-fg hover:border-fg/40'
                    }`}
                  >
                    {t.tiers.selectTierCta}
                  </button>
                </div>
              </article>
            </RevealUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function InteractiveDemoSection({
  selectedModuleIndex,
  onSelectModuleIndex,
  onCommissionModule,
}: {
  selectedModuleIndex: number;
  onSelectModuleIndex: (idx: number) => void;
  onCommissionModule: (moduleName: string) => void;
}) {
  const { t } = useAppSettings();
  const [trafficLoad, setTrafficLoad] = useState(2400);
  const [springActive, setSpringActive] = useState(true);

  const currentModule =
    t.modules.items[selectedModuleIndex] ?? t.modules.items[0];
  const loadFactor = trafficLoad / 2400;
  const computedLatency = (
    currentModule.baseLatency *
    (0.85 + loadFactor * 0.15) *
    (springActive ? 0.94 : 1.08)
  ).toFixed(1);
  const computedReliability = Math.min(
    99.99,
    currentModule.baseThroughput - (loadFactor - 1) * 0.02
  ).toFixed(2);

  return (
    <section
      id="demo"
      className="scroll-mt-24 bg-bg px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <RevealUp>
          <SectionKicker>{t.demo.kicker}</SectionKicker>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            {t.demo.heading}
          </h2>
        </RevealUp>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_1.25fr]">
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              {t.modules.items.map((mod, idx) => {
                const isSelected = idx === selectedModuleIndex;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => onSelectModuleIndex(idx)}
                    className={`rounded-xl border px-5 py-4 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? 'border-fg/30 bg-fg text-bg'
                        : 'border-line bg-bg-elevated text-fg hover:border-line-strong'
                    }`}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">
                      {mod.tag}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold tracking-tight">
                      {mod.name}
                    </span>
                    <span
                      className={`mt-1 block text-[13px] ${
                        isSelected ? 'text-bg/75' : 'text-muted'
                      }`}
                    >
                      {mod.line}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-line bg-bg-elevated p-5">
              <label className="block">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                  <span>{t.demo.loadLabel}</span>
                  <span className="font-mono font-semibold text-fg tabular-nums">
                    {trafficLoad.toLocaleString()} req/s
                  </span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={12000}
                  step={200}
                  value={trafficLoad}
                  onChange={(e) => setTrafficLoad(Number(e.target.value))}
                  data-native-cursor="true"
                  className="mt-3 h-2 w-full accent-accent"
                />
              </label>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs uppercase tracking-[0.18em] text-muted">
                  {t.demo.motionLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setSpringActive((prev) => !prev)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-xs font-medium text-fg hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
                  <span>
                    {springActive ? t.demo.motionActive : t.demo.motionReduced}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
            <div className="relative aspect-16/10 overflow-hidden">
              <ModuleVisual
                variant={selectedModuleIndex}
                loadFactor={loadFactor}
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg/80 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="size-2 animate-pulse rounded-full bg-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg">
                  {t.demo.liveStatus} · {computedLatency} ms · {computedReliability}%
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="max-w-xl text-[15px] leading-relaxed text-muted">
                {currentModule.copy}
              </p>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-faint">
                  {t.demo.nodesHeading}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {currentModule.nodes.map((node) => (
                    <div
                      key={node}
                      className="flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-xs text-fg"
                    >
                      <Layers className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="truncate">{node}</span>
                    </div>
                  ))}
                </div>
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
                {currentModule.specs.map((spec, idx) => (
                  <div key={spec.k}>
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-faint">
                      {spec.k}
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold tabular-nums">
                      {idx === 0 ? `${computedLatency} ms` : spec.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 border-t border-line pt-6">
                <MagneticButton
                  onClick={() => {
                    onCommissionModule(currentModule.name);
                    smoothScrollToSection('connect');
                  }}
                >
                  {t.demo.cta}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CommissionSubmission {
  name: string;
  email: string;
  company: string;
  intent: string;
  moduleName: string;
  notes: string;
  submittedAt: string;
}

const STORAGE_COMMISSION_KEY = 'antigravity-argon-commission-record';

function ConnectSection({
  selectedTier,
  onChangeTier,
  selectedModuleName,
  onChangeModuleName,
}: {
  selectedTier: string;
  onChangeTier: (val: string) => void;
  selectedModuleName: string;
  onChangeModuleName: (val: string) => void;
}) {
  const { t } = useAppSettings();
  const [submission, setSubmission] = useState<CommissionSubmission | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const company = String(formData.get('company') ?? '').trim();
    const intent = String(formData.get('intent') ?? selectedTier).trim();
    const moduleName = String(
      formData.get('moduleName') ?? selectedModuleName
    ).trim();
    const notes = String(formData.get('notes') ?? '').trim();

    if (!name || !email || !email.includes('@') || !company) {
      setFormError(t.connect.form.errorRequired);
      return;
    }

    setFormError(null);
    const record: CommissionSubmission = {
      name,
      email,
      company,
      intent,
      moduleName,
      notes,
      submittedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_COMMISSION_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }

    setSubmission(record);
  };

  return (
    <section
      id="connect"
      className="scroll-mt-24 bg-bg-warm px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-end">
        <RevealUp>
          <SectionKicker>{t.connect.kicker}</SectionKicker>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-6xl">
            {t.connect.heading}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            {t.connect.copy}
          </p>
        </RevealUp>

        <RevealUp>
          {submission ? (
            <div className="rounded-xl border border-line bg-bg p-8">
              <div className="flex items-center gap-3 text-accent">
                <CheckCircle2 className="size-6" aria-hidden="true" />
                <p className="font-display text-2xl font-semibold tracking-tight text-fg">
                  {t.connect.success.title}
                </p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {t.connect.success.body}
              </p>
              <dl className="mt-6 grid gap-3 rounded-lg border border-line bg-bg-elevated p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.connect.form.nameLabel}</dt>
                  <dd className="font-medium text-fg">{submission.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.connect.form.companyLabel}</dt>
                  <dd className="font-medium text-fg">{submission.company}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.connect.form.intentLabel}</dt>
                  <dd className="font-mono text-accent">{submission.intent}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.connect.form.moduleLabel}</dt>
                  <dd className="font-medium text-fg">{submission.moduleName}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setSubmission(null)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-fg hover:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t.connect.success.reset}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-error bg-bg p-3 text-sm text-error"
                >
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    {t.connect.form.nameLabel}
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-label={t.connect.form.nameHint}
                    data-native-cursor="true"
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    {t.connect.form.emailLabel}
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-label={t.connect.form.emailHint}
                    data-native-cursor="true"
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {t.connect.form.companyLabel}
                </span>
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  aria-label={t.connect.form.companyHint}
                  data-native-cursor="true"
                  className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    {t.connect.form.intentLabel}
                  </span>
                  <select
                    name="intent"
                    value={selectedTier}
                    onChange={(e) => onChangeTier(e.target.value)}
                    data-native-cursor="true"
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t.tiers.items.map((tier) => (
                      <option key={tier.id} value={tier.name}>
                        {tier.name} — {tier.price}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    {t.connect.form.moduleLabel}
                  </span>
                  <select
                    name="moduleName"
                    value={selectedModuleName}
                    onChange={(e) => onChangeModuleName(e.target.value)}
                    data-native-cursor="true"
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t.modules.items.map((mod) => (
                      <option key={mod.id} value={mod.name}>
                        {mod.tag} · {mod.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {t.connect.form.notesLabel}
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  aria-label={t.connect.form.notesHint}
                  data-native-cursor="true"
                  className="mt-2 w-full rounded-lg border border-line bg-bg p-4 text-[15px] text-fg outline-none focus:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>

              <div className="pt-2">
                <MagneticButton type="submit">{t.connect.form.submit}</MagneticButton>
              </div>
            </form>
          )}
        </RevealUp>
      </div>
    </section>
  );
}

function FooterSection() {
  const { t } = useAppSettings();

  return (
    <footer className="border-t border-line bg-bg px-5 py-10 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="size-8 text-fg" />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
            {t.brand.name}
          </span>
        </div>
        <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-faint">
          <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
          <span>{t.footer.links}</span>
        </p>
        <p className="text-[12px] text-faint">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}

export function App() {
  const { t } = useAppSettings();
  const [loading, setLoading] = useState(true);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState('Commission');
  const [selectedModuleName, setSelectedModuleName] = useState(
    t.modules.items[0]?.name ?? 'Kinetic Web Engine'
  );

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <SmoothScrollProvider disabled={loading}>
        <CustomCursor />
        <div className="grain" aria-hidden="true" />
        <ScrollProgressBar />
        <HeaderNav hidden={loading} />
        <main>
          <HeroSection
            ready={!loading}
            onCommission={() => smoothScrollToSection('connect')}
            onExploreLab={() => smoothScrollToSection('demo')}
          />
          <ManifestoSection />
          <MetricsCounterBar />
          <KineticMarquee />
          <ModulesSection
            onSelectModule={(idx) => {
              setSelectedModuleIndex(idx);
              const mod = t.modules.items[idx];
              if (mod) setSelectedModuleName(mod.name);
            }}
          />
          <CaseRecordsSection />
          <ProtocolSection />
          <AtelierBanner />
          <TiersSection onSelectTier={(tierId) => setSelectedTier(tierId)} />
          <InteractiveDemoSection
            selectedModuleIndex={selectedModuleIndex}
            onSelectModuleIndex={(idx) => {
              setSelectedModuleIndex(idx);
              const mod = t.modules.items[idx];
              if (mod) setSelectedModuleName(mod.name);
            }}
            onCommissionModule={(modName) => setSelectedModuleName(modName)}
          />
          <ConnectSection
            selectedTier={selectedTier}
            onChangeTier={setSelectedTier}
            selectedModuleName={selectedModuleName}
            onChangeModuleName={setSelectedModuleName}
          />
        </main>
        <FooterSection />
      </SmoothScrollProvider>
    </>
  );
}
export default App;
