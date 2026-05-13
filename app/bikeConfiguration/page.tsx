"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBikeStore } from "../store/bikeStore.ts";

gsap.registerPlugin(SplitText, ScrollTrigger);

type WheelState = "idle" | "entering" | "visible" | "exiting";

const DEFAULT_DESCRIPTION =
  "A high-performance bike with a lightweight, durable frame built for speed and precision. Equipped with high-performance tires that ensure excellent grip, smooth control, and efficiency at high speeds.";

const wheels = [
  {
    id: 1,
    image: "/wheel-1.png",
    title: "WHEEL TYPE 1",
    description:
      "Engineered for raw speed on open roads. Ultra-thin profile with a reinforced carbon rim delivers minimal rolling resistance and maximum aerodynamic efficiency at every push.",
  },
  {
    id: 2,
    image: "/wheel-2.png",
    title: "WHEEL TYPE 2",
    description:
      "Built to conquer rough terrain without compromise. Deep-tread rubber and a shock-absorbing alloy core keep you planted and in control across gravel, dirt, and uneven surfaces.",
  },
  {
    id: 3,
    image: "/wheel-3.png",
    title: "WHEEL TYPE 3",
    description:
      "The all-rounder for riders who refuse to choose. Balanced tread pattern and mid-weight construction adapt seamlessly from city streets to weekend trails — performance without limits.",
  },
  {
    id: 4,
    image: "/wheel-4.png",
    title: "WHEEL TYPE 4",
    description:
      "Precision-machined for competitive track use. Laser-trued spokes and a featherlight tubeless rim create a wheel that responds instantly, shaving crucial milliseconds off every lap.",
  },
];

export default function BikeConfigurator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [progress, setProgress] = useState(0);
  const [selectedWheel, setSelectedWheel] = useState<number | null>(null);
  const [displayedWheel, setDisplayedWheel] = useState<number | null>(null);
  const [wheelState, setWheelState] = useState<WheelState>("idle");
  const [animKey, setAnimKey] = useState(0);
  const pendingWheelRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const alreadyVisited = sessionStorage.getItem("home-visited");

    // primeira visita
    if (!alreadyVisited) {
      setLoading(true);
    }
  }, []);

  // Store
  const storedWheelId = useBikeStore((s) => s.selectedWheel);
  const setSelectedWheelStore = useBikeStore((s) => s.setSelectedWheel);

  const assets = [
    "/frame-1.png",
    "/wheel-1.png",
    "/wheel-2.png",
    "/wheel-3.png",
    "/wheel-4.png",
    "/icon-bike.png",
  ];

  const constructionModeRef = useRef<HTMLHeadingElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const configureTitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const wheelsTitleRef = useRef<HTMLHeadingElement>(null);
  const wheelsGridRef = useRef<HTMLDivElement>(null);
  const otherPartsRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLElement>(null);
  const rightSideRef = useRef<HTMLElement>(null);
  const iconLineRef = useRef<HTMLDivElement>(null);
  const descSplitRef = useRef<InstanceType<typeof SplitText> | null>(null);

  const EXIT_DURATION = 500;

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

  // Restaura a seleção da store ao montar
  useEffect(() => {
    if (storedWheelId !== null) {
      setSelectedWheel(storedWheelId);
      setDisplayedWheel(storedWheelId);
      setWheelState("visible");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // já visitou
    if (sessionStorage.getItem("home-visited")) {
      return;
    }

    let loaded = 0;

    const preloadImages = async () => {
      const promises = assets.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();

          img.src = src;

          img.onload = () => {
            loaded++;

            setProgress(Math.round((loaded / assets.length) * 100));

            resolve();
          };

          img.onerror = () => {
            loaded++;

            setProgress(Math.round((loaded / assets.length) * 100));

            resolve();
          };
        });
      });

      await Promise.all(promises);

      sessionStorage.setItem("home-visited", "true");

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    preloadImages();
  }, [mounted]);

  useEffect(() => {
    if (!loading) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  useEffect(() => {
    if (loading) return;

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

      if (wheelsTitleRef.current) {
        const splitWheels = new SplitText(wheelsTitleRef.current, {
          type: "chars",
        });
        master.fromTo(
          splitWheels.chars,
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

      if (wheelsGridRef.current) {
        const cards = wheelsGridRef.current.querySelectorAll(".wheel");
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
        otherPartsRef.current,
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

      if (wheelsGridRef.current) {
        const cards =
          wheelsGridRef.current.querySelectorAll<HTMLElement>(".wheel");
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
  }, [loading]);

  const handleWheelClick = (id: number) => {
    if (id === selectedWheel) return;

    setSelectedWheelStore(id); // persiste na store
    setSelectedWheel(id);

    const wheel = wheels.find((w) => w.id === id);
    if (wheel) animateDescription(wheel.description);

    if (wheelState === "idle" || displayedWheel === null) {
      setDisplayedWheel(id);
      setAnimKey((prev) => prev + 1);
      setWheelState("entering");
    } else {
      pendingWheelRef.current = id;
      setWheelState("exiting");
      setTimeout(() => {
        setDisplayedWheel(pendingWheelRef.current);
        setAnimKey((prev) => prev + 1);
        setWheelState("entering");
      }, EXIT_DURATION);
    }
  };

  const handleAnimationEnd = () => {
    if (wheelState === "entering") setWheelState("visible");
  };

  const activeWheel = wheels.find((w) => w.id === displayedWheel);
  const leftClass =
    wheelState === "exiting"
      ? "wheel-left-out absolute"
      : "wheel-left absolute";
  const rightClass =
    wheelState === "exiting"
      ? "wheel-right-out absolute"
      : "wheel-right absolute";


  const handleNavigateFrames = async () => {
    await gsap.to("main", {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      duration: 0.45,
      ease: "power3.inOut",
    });

    router.push("/framesConfiguration");
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
      {/* LEFT SIDE */}
      <section
        ref={leftSideRef}
        className="z-1 relative w-180 bg-red flex flex-col justify-between px-20 py-15"
      >
        <div className="z-10">
          <h2
            ref={constructionModeRef}
            className="text-black text-[40px] font-bold"
          >
            Construction Mode
          </h2>
          <div ref={iconLineRef} className="mt-16 w-18 bg-light-red flex items-center gap-4">
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
          className="flex absolute top-70 text-[180px] font-extrabold text-[#f4f1ea] leading-none z-0"
          style={{ willChange: "clip-path" }}
        >
          WHE <span className="stroke-text">ELS</span>
        </h1>

        <div className="absolute w-250 h-auto bottom-45 left-25">
          <div className="relative">
            {activeWheel && (
              <div
                key={`left-${animKey}`}
                className={leftClass}
                onAnimationEnd={handleAnimationEnd}
                style={{
                  bottom: "3%",
                  left: "1%",
                  width: "27%",
                  pointerEvents: "none",
                }}
              >
                <Image
                  src={activeWheel.image}
                  alt="Rear wheel"
                  width={220}
                  height={220}
                  className="w-full object-contain"
                />
              </div>
            )}
            {activeWheel && (
              <div
                key={`right-${animKey}`}
                className={rightClass}
                style={{
                  bottom: "-1%",
                  right: "4%",
                  width: "27%",
                  pointerEvents: "none",
                }}
              >
                <Image
                  src={activeWheel.image}
                  alt="Front wheel"
                  width={220}
                  height={220}
                  className="w-full object-contain"
                />
              </div>
            )}
            <Image
              loading="eager"
              src="/frame-1.png"
              width={1536}
              height={1024}
              alt="Frame"
              className="object-contain w-full scale-75"
            />
          </div>
        </div>

        <div ref={checkoutRef} className="flex justify-end z-30">
          <button className="check-out">Check Out</button>
        </div>
      </section>
      {/* RIGHT SIDE */}
      <section
        ref={rightSideRef}
        className="w-1/1 bg-white flex flex-col justify-center px-25 py-15"
      >
        <div className="max-w-162.5 ml-auto">
          <h2
            ref={configureTitleRef}
            className="text-[64px] font-bold leading-tight text-dark-blue overflow-hidden"
          >
            Configure the Bike
          </h2>

          <p
            ref={descriptionRef}
            className="mt-10 text-center text-[24px] leading-[1.4] text-dark-blue opacity-50 max-w-137.5"
          >
            {DEFAULT_DESCRIPTION}
          </p>

          <div className="mt-24">
            <h3
              ref={wheelsTitleRef}
              className="text-[48px] font-bold text-dark-blue"
            >
              Wheels
            </h3>
            <div ref={wheelsGridRef} className="flex items-center gap-16 mt-10">
              {wheels.map((wheel) => (
                <button
                  key={wheel.id}
                  onClick={() => handleWheelClick(wheel.id)}
                  className={`wheel flex flex-col items-center text-center cursor-pointer group transition-all duration-200 ${
                    selectedWheel === wheel.id
                      ? "opacity-100 scale-105"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`relative w-28 h-28 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      selectedWheel === wheel.id
                        ? "border-red bg-[#fff5f7]"
                        : "border-transparent bg-[#f5f5f5] group-hover:bg-[#fff5f7] group-hover:border-red/30"
                    }`}
                  >
                    <Image
                      width={1200}
                      height={800}
                      src={wheel.image}
                      alt={wheel.title}
                      className="w-22 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                        selectedWheel === wheel.id
                          ? "bg-red text-white opacity-100"
                          : "bg-dark-blue text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {wheel.title.replace("WHEEL TYPE ", "TYPE ")}
                    </span>
                  </div>
                  <span className="mt-4 text-[18px] font-medium text-dark-blue leading-tight">
                    {wheel.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={otherPartsRef}
            className="mt-28 flex items-center justify-end"
          >
            <button
              onClick={handleNavigateFrames}
              className="other-parts border-b-2 border-t-2 border-beige text-[24px] text-dark-blue hover:bg-beige hover:text-white py-2 px-2 cursor-pointer"
            >
              Frames →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
