"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import {
  Autoplay,
  EffectFade,
  Pagination,
} from "swiper/modules";

import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Library,
  BookMarked,
} from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    subtitle: "ADD • BORROW • RETURN",
    title: "A small library",
    highlight: "that lives online.",
    text: "Share what you have read and borrow what you have not. Join our community-driven digital bookshelf today.",
    button: "Browse Books",
    link: "/books",
    icon: BookOpen,
  },
  {
    id: 2,
    subtitle: "DISCOVER YOUR NEXT READ",
    title: "Find your",
    highlight: "next read.",
    text: "Browse every title on our shelves and borrow one in a single step with our seamless request system.",
    button: "Browse Books",
    link: "/books",
    icon: Library,
  },
  {
    id: 3,
    subtitle: "SHARE YOUR SHELF",
    title: "Have a book",
    highlight: "to share?",
    text: "Add it to the library and let another reader enjoy it. Keep stories moving across our community.",
    button: "Browse Books",
    link: "/books",
    icon: BookMarked,
  },
];

// Server/prerender-e false, browser-e true
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

export default function HeroSlider() {
  const isClient = useIsClient();

  const [swiperInstance, setSwiperInstance] =
    useState<SwiperType | null>(null);

  return (
    <section
      className="relative isolate min-h-[600px] overflow-hidden bg-[#F4F8F8] dark:bg-[#031716] md:min-h-[700px]"
      aria-label="BookNook Featured Hero Banner"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full"
        >
          <Image
            src="/images/hero1.avif"
            alt="BookNook Library Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#031716]/95 via-[#031716]/75 to-[#031716]/60" />
      </div>

      {/* Swiper Slider (browser-e mount hole render hobe) */}
      {isClient ? (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={700}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
          }}
          pagination={{
            clickable: true,
            el: ".booknook-hero-pagination",
          }}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
          }}
          className="booknook-hero-swiper h-full w-full"
        >
          {slides.map((slide) => {
            const Icon = slide.icon;

            return (
              <SwiperSlide key={slide.id}>
                {({ isActive }) => (
                  <div className="relative min-h-[600px] w-full overflow-hidden md:min-h-[700px]">
                    <div className="relative z-10 mx-auto flex min-h-[600px] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[700px]">

                      {/* Subtitle */}
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={
                          isActive
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: -15 }
                        }
                        transition={{ duration: 0.4 }}
                      >
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0C969C]/40 bg-[#032F30]/90 px-5 py-2.5 text-xs font-bold tracking-[2.5px] text-[#6BA3BE] shadow-xl backdrop-blur-md">
                          <Icon size={16} className="text-[#0C969C]" />
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Heading */}
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isActive
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-heading text-4xl font-black leading-[1.15] tracking-tight text-[#F4F8F8] sm:text-6xl md:text-7xl"
                      >
                        {slide.title}

                        <span className="mt-2 block bg-linear-to-r from-[#0C969C] via-[#6BA3BE] to-[#F4F8F8] bg-clip-text pb-1 text-transparent">
                          {slide.highlight}
                        </span>
                      </motion.h1>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={
                          isActive
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 15 }
                        }
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-[#6BA3BE]/95 sm:text-lg md:text-xl"
                      >
                        {slide.text}
                      </motion.p>

                      {/* Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={
                          isActive
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 15 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex items-center justify-center"
                      >
                        <Link
                          href={slide.link}
                          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-2xl shadow-[#0C969C]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(12,150,156,0.6)] active:scale-95"
                        >
                          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          <span className="relative z-10">
                            {slide.button}
                          </span>

                          <ArrowRight
                            size={18}
                            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
                          />
                        </Link>
                      </motion.div>

                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="min-h-[600px] w-full md:min-h-[700px]" />
      )}

      {/* Slider Controls */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">

        <div className="booknook-hero-pagination pointer-events-auto flex items-center gap-3" />

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-[#032F30]/80 text-[#F4F8F8] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C]"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-[#032F30]/80 text-[#F4F8F8] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C]"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Pagination Styling */}
      <style jsx global>{`
        .booknook-hero-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #0C969C;
          opacity: 0.4;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .booknook-hero-pagination .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 20px;
          opacity: 1;
          background: linear-gradient(to right, #0C969C, #6BA3BE);
        }
      `}</style>
    </section>
  );
}