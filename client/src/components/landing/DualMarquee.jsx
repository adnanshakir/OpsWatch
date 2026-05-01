import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function DualMarquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform scroll position into X translation
  const x1 = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const items = [
    "INCIDENT RESPONSE", "AI ROOT CAUSE", "REAL-TIME TIMELINES",
    "PUBLIC STATUS PAGES", "AUTOMATED POSTMORTEMS", "SMART ROUTING"
  ];

  return (
    <div ref={ref} className="relative my-10 flex h-[200px] w-full items-center justify-center overflow-hidden">

      {/* Background Banner - Tilted Up, Scrolling Right */}
      <div className="absolute z-0 flex w-[150vw] -rotate-[3deg] border-y border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] py-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              {items.map((item, j) => (
                <div key={`${i}-${j}`} className="flex items-center">
                  <span className="font-mono text-[14px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground)]">{item}</span>
                  <div className="mx-8 h-1.5 w-1.5 rotate-45 bg-[var(--color-muted-strong)]" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Foreground Banner - Tilted Down, Scrolling Left */}
      <div className="absolute z-10 flex w-[150vw] rotate-[2deg] bg-[var(--color-brand-primary)] py-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              {items.map((item, j) => (
                <div key={`${i}-${j}`} className="flex items-center">
                  <span className="font-mono text-[14px] font-bold uppercase tracking-[0.15em] text-[#050505]">{item}</span>
                  <div className="mx-8 h-1.5 w-1.5 rotate-45 bg-[#050505]/40" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
