"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBikeStore } from "../store/bikeStore";

gsap.registerPlugin(SplitText, ScrollTrigger);

type FrameState = "idle" | "entering" | "visible" | "exiting";

const DEFAULT_DESCRIPTION =
  "Select a frame to discover the engineering behind every ride. Each build balances weight, stiffness, and geometry to match your riding style — from daily commutes to podium finishes.";

const frames = [
  {
    id: 1,
    image: "/frame-1.png",
    title: "FRAME TYPE 1",
    label: "AERO",
    description:
      "Wind-tunnel refined and race-ready. The aero frame cuts through air resistance with a truncated-ellipse tube profile, giving you measurable speed gains on every flat and descent.",
  },
  {
    id: 2,
    image: "/frame-2.png",
    title: "FRAME TYPE 2",
    label: "ENDURANCE",
    description:
      "Designed for the long haul. A relaxed geometry and vibration-damping carbon layup absorb road chatter for hours, letting you stay fresh and powerful deep into any ride.",
  },
  {
    id: 3,
    image: "/frame-3.png",
    title: "FRAME TYPE 3",
    label: "CLIMBER",
    description:
      "Every gram counts on the ascent. An ultra-light monocoque shell and stiff bottom bracket deliver pure power transfer, so your watts go straight to the pedals — not the frame.",
  },
  {
    id: 4,
    image: "/frame-4.png",
    title: "FRAME TYPE 4",
    label: "TRACK",
    description:
      "Built for the velodrome, refined for the street. Fixed geometry and a rigid rear triangle create instant responsiveness, turning every pedal stroke into direct, explosive acceleration.",
  },
];

const wheelImages: Record<number, string> = {
  1: "/wheel-1.png",
  2: "/wheel-2.png",
  3: "/wheel-3.png",
  4: "/wheel-4.png",
};

export default function FrameConfigurator() {
  const router = useRouter();
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [displayedFrame, setDisplayedFrame] = useState<number | null>(null);
  const [frameState, setFrameState] = useState<FrameState>("idle");
  const [animKey, setAnimKey] = useState(0);
  const pendingFrameRef = useRef<number | null>(null);

  // Store
  const storedWheelId = useBikeStore((s) => s.selectedWheel);
  const setSelectedFrameStore = useBikeStore((s) => s.setSelectedFrame);
  const activeWheelImage = storedWheelId
    ? (wheelImages[storedWheelId] ?? null)
    : null;

  const constructionModeRef = useRef<HTMLHeadingElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const configureTitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const framesTitleRef = useRef<HTMLHeadingElement>(null);
  const framesGridRef = useRef<HTMLDivElement>(null);
  const backPartsRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLElement>(null);
  const rightSideRef = useRef<HTMLElement>(null);
  const iconLineRef = useRef<HTMLDivElement>(null);
  const bikeContainerRef = useRef<HTMLDivElement>(null);
  const basePlaceholderRef = useRef<HTMLDivElement>(null);
  const descSplitRef = useRef<InstanceType<typeof SplitText> | null>(null);

  const EXIT_DURATION = 400;

  const animateDescription = (newText: string) => {
    const el = descriptionRef.current;
    if (!el) return;

    if (descSplitRef.current) descSplitRef.current.revert();

    const splitOut = new SplitText(el, { type: "lines" });
    descSplitRef.current = splitOut;

    gsap.to(splitOut.lines, {
      opacity: 0,
      y: -12,
      filter: "blur(5px)",
      duration: 0.28,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        el.textContent = newText;
        if (descSplitRef.current) descSplitRef.current.revert();

        const splitIn = new SplitText(el, { type: "lines" });
        descSplitRef.current = splitIn;

        gsap.fromTo(
          splitIn.lines,
          { opacity: 0, y: 16, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.out",
          },
        );
      },
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const master = gsap.timeline({ defaults: { ease: "power3.out" } });

      master.to("main", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "expo.out",
      });

      master
        .fromTo(
          leftSideRef.current,
          { xPercent: -100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
        )
        .fromTo(
          rightSideRef.current,
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
          "<",
        );

      if (constructionModeRef.current) {
        const split = new SplitText(constructionModeRef.current, {
          type: "chars",
        });
        master.fromTo(
          split.chars,
          {
            y: -60,
            opacity: 0,
            rotationX: -90,
            transformOrigin: "50% 50% -20px",
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: "back.out(1.4)",
          },
          "-=0.4",
        );
      }

      master.fromTo(
        iconLineRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        "-=0.3",
      );

      if (bigTextRef.current) {
        master.fromTo(
          bigTextRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "expo.inOut" },
          "-=0.5",
        );
      }

      master.fromTo(
        bikeContainerRef.current,
        { scale: 0.82, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "expo.out" },
        "-=0.8",
      );

      if (configureTitleRef.current) {
        const splitWords = new SplitText(configureTitleRef.current, {
          type: "words",
        });
        master.fromTo(
          splitWords.words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "expo.out",
          },
          "-=0.6",
        );
      }

      if (descriptionRef.current) {
        const splitLines = new SplitText(descriptionRef.current, {
          type: "lines",
        });
        descSplitRef.current = splitLines;
        master.fromTo(
          splitLines.lines,
          { opacity: 0, y: 18, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }

      if (framesTitleRef.current) {
        const splitFrames = new SplitText(framesTitleRef.current, {
          type: "chars",
        });
        master.fromTo(
          splitFrames.chars,
          { scaleY: 0, transformOrigin: "50% 100%" },
          {
            scaleY: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.2",
        );
      }

      if (framesGridRef.current) {
        const cards = framesGridRef.current.querySelectorAll(".frame-card");
        master.fromTo(
          cards,
          {
            opacity: 0,
            rotationY: -65,
            x: -30,
            transformOrigin: "left center",
            transformPerspective: 600,
          },
          {
            opacity: 1,
            rotationY: 0,
            x: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "back.out(1.2)",
          },
          "-=0.3",
        );
      }

      master.fromTo(
        backPartsRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
        "-=0.2",
      );

      master.fromTo(
        checkoutRef.current,
        { scale: 0, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

      if (framesGridRef.current) {
        const cards =
          framesGridRef.current.querySelectorAll<HTMLElement>(".frame-card");
        cards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              rotationY: 8,
              rotationX: -5,
              scale: 1.08,
              duration: 0.35,
              ease: "power2.out",
              transformPerspective: 600,
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              scale: 1,
              duration: 0.4,
              ease: "elastic.out(1, 0.6)",
            });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleFrameClick = (id: number) => {
    if (id === selectedFrame) return;

    if (selectedFrame === null && basePlaceholderRef.current) {
      gsap.to(basePlaceholderRef.current, {
        opacity: 0,
        scale: 0.9,
        filter: "blur(4px)",
        duration: 0.35,
        ease: "power2.in",
      });
    }

    setSelectedFrameStore(id);
    setSelectedFrame(id);

    const frame = frames.find((f) => f.id === id);
    if (frame) animateDescription(frame.description);

    if (frameState === "idle" || displayedFrame === null) {
      setDisplayedFrame(id);
      setAnimKey((prev) => prev + 1);
      setFrameState("entering");
    } else {
      pendingFrameRef.current = id;
      setFrameState("exiting");
      setTimeout(() => {
        setDisplayedFrame(pendingFrameRef.current);
        setAnimKey((prev) => prev + 1);
        setFrameState("entering");
      }, EXIT_DURATION);
    }
  };

  const handleAnimationEnd = () => {
    if (frameState === "entering") setFrameState("visible");
  };

  const activeFrame = frames.find((f) => f.id === displayedFrame);
  const frameInClass =
    frameState === "exiting" ? "frame-overlay-out" : "frame-overlay-in";

  const handleNavigateHome = async () => {
    await gsap.to("main", {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      duration: 0.45,
      ease: "power3.inOut",
    });

    router.push("/");
  };

  return (
    <main
      className="w-full min-h-screen flex overflow-hidden"
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        filter: "blur(10px)",
      }}
    >
      {" "}
      {/* ───── LEFT SIDE ───── */}
      <section
        ref={leftSideRef}
        className="z-1 relative w-180 bg-dark-green flex flex-col justify-between px-20 py-15"
      >
        <div className="z-10">
          <h2
            ref={constructionModeRef}
            className="text-dark-blue text-[40px] font-bold"
          >
            Construction Mode
          </h2>
          <div
            ref={iconLineRef}
            className="mt-16 w-18 bg-light-green flex items-center gap-4"
          >
            <div className="w-1.5 h-10 bg-beige" />
            <Image
              src="/icon-bike.png"
              alt="Bike Icon"
              width={32}
              height={32}
            />
          </div>
        </div>

        <h1
          ref={bigTextRef}
          className="flex absolute top-70 text-[180px] font-extrabold text-white leading-none z-0"
          style={{ willChange: "clip-path" }}
        >
          FRA <span className="stroke-text">MES</span>
        </h1>

        {/* BIKE + FRAME OVERLAY */}
        <div
          ref={bikeContainerRef}
          className="absolute w-250 h-auto bottom-45 left-25"
        >
          <div className="relative">
            {/* Frame selecionado */}
            {activeFrame && (
              <div
                key={`frame-${animKey}`}
                className={`${frameInClass} absolute inset-0 z-20 pointer-events-none`}
                onAnimationEnd={handleAnimationEnd}
              >
                <Image
                  src={activeFrame.image}
                  alt="Selected frame"
                  width={1536}
                  height={1024}
                  className="w-full object-contain scale-75"
                />
              </div>
            )}

            {/* Placeholder base */}
            <div
              ref={basePlaceholderRef}
              className="relative z-10"
              style={{ opacity: selectedFrame !== null ? 0 : 1 }}
            >
              <Image
                loading="eager"
                src="/frame-1.png"
                width={1536}
                height={1024}
                alt="Frame"
                className="w-full object-contain scale-75"
              />
            </div>

            {/* ── Rodas persistidas da seleção anterior ── */}
            {activeWheelImage && (
              <>
                <div
                  className="absolute pointer-events-none z-1"
                  style={{ bottom: "3%", left: "1%", width: "27%" }}
                >
                  <Image
                    src={activeWheelImage}
                    alt="Rear wheel"
                    width={220}
                    height={220}
                    className="w-full object-contain"
                  />
                </div>
                <div
                  className="absolute pointer-events-none z-1"
                  style={{ bottom: "-1%", right: "4%", width: "27%" }}
                >
                  <Image
                    src={activeWheelImage}
                    alt="Front wheel"
                    width={220}
                    height={220}
                    className="w-full object-contain"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div ref={checkoutRef} className="flex justify-end z-30">
          <button className="check-out-frames">Check Out</button>
        </div>
      </section>
      {/* ───── RIGHT SIDE ───── */}
      <section
        ref={rightSideRef}
        className="w-1/1 bg-white flex flex-col justify-center px-25 py-15"
      >
        <div className="max-w-162.5 ml-auto">
          <h2
            ref={configureTitleRef}
            className="text-[64px] font-bold leading-tight text-dark-blue overflow-hidden"
          >
            Configure the Frame
          </h2>

          <p
            ref={descriptionRef}
            className="mt-10 text-center text-[24px] leading-[1.4] text-dark-blue opacity-50 max-w-137.5"
          >
            {DEFAULT_DESCRIPTION}
          </p>

          <div className="mt-24">
            <h3
              ref={framesTitleRef}
              className="text-[48px] font-bold text-dark-blue"
            >
              Frames
            </h3>

            <div ref={framesGridRef} className="flex items-end gap-12 mt-10">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleFrameClick(frame.id)}
                  className={`frame-card flex flex-col items-center text-center cursor-pointer group transition-all duration-200 ${
                    selectedFrame === frame.id
                      ? "opacity-100 scale-105"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`relative w-28 h-28 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      selectedFrame === frame.id
                        ? "border-red bg-[#fff5f7]"
                        : "border-transparent bg-[#f5f5f5] group-hover:bg-[#fff5f7] group-hover:border-[#ff0f4b]/30"
                    }`}
                  >
                    <Image
                      width={400}
                      height={300}
                      src={frame.image}
                      alt={frame.title}
                      className="w-22 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                        selectedFrame === frame.id
                          ? "bg-red text-white opacity-100"
                          : "bg-dark-blue text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {frame.label}
                    </span>
                  </div>
                  <span className="mt-4 text-[18px] font-medium text-dark-blue leading-tight">
                    {frame.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={backPartsRef}
            className="mt-28 flex items-center justify-between"
          >
            <button
              onClick={handleNavigateHome}
              className="other-parts border-b-2 border-t-2 border-beige text-[20px] text-dark-blue hover:bg-beige hover:text-white py-2 px-2 cursor-pointer"
            >
              ← Wheels
            </button>
            <button className="other-parts border-b-2 border-t-2 border-beige text-[20px] text-dark-blue hover:bg-beige hover:text-white py-2 px-2 cursor-pointer">
              Components →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
