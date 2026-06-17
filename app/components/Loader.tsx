"use client";

import Image from "next/image";

type LoaderProps = {
  /** Carregamento de 0 a 100 */
  progress: number;
};

/**
 * Tela de loader inicial. Apresentacional: o estado de carregamento e a
 * decisão de montar/desmontar ficam na página que o renderiza.
 */
export default function Loader({ progress }: LoaderProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));
  const done = clamped >= 100;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-blue text-white transition-opacity duration-500 ease-out ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Carregando ${clamped}%`}
    >
      <div className="loader-pulse flex flex-col items-center">
        <Image
          src="/icon-bike.webp"
          alt=""
          width={56}
          height={56}
          priority
          className="opacity-90"
        />
        <h1 className="mt-6 text-[28px] font-extrabold tracking-[0.2em] uppercase">
          Ride Your Bike
        </h1>
      </div>

      <div className="mt-10 w-[260px] max-w-[70vw]">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-light-red transition-[width] duration-300 ease-out"
            style={{
              width: `${clamped}%`,
              background:
                "linear-gradient(90deg, var(--color-red), var(--color-light-red))",
            }}
          />
        </div>
        <p className="mt-3 text-right text-[13px] font-semibold tabular-nums text-white/60">
          {clamped}%
        </p>
      </div>
    </div>
  );
}
