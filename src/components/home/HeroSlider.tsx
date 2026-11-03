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
  Sparkles,
} from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

/**
 * Slide configuration data for the BookNook Hero Banner.
 * Brand: BookNook - Online Library ("Add a book. Borrow a book. Return a book.")
 */
const slides = [
  {
    subtitle: "ADD • BORROW • RETURN",
    title: "A small library",
    highlight: "that lives online.",
    text: "Share what you have read and borrow what you have not. Join our community-driven digital bookshelf today.",
    button: "Browse Books",
    link: "/books",
    icon: BookOpen,
    image: "/hero/hero-1.jpg",
  },
  {
    subtitle: "DISCOVER YOUR NEXT READ",
    title: "Find your",
    highlight: "next read.",
    text: "Browse every title on our shelves and borrow one in a single step with our seamless request system.",
    button: "Browse Books",
    link: "/books",
    icon: Library,
    image: "/hero/hero-2.jpg",
  },
  {
    subtitle: "SHARE YOUR SHELF",
    title: "Have a book",
    highlight: "to share?",
    text: "Add it to the library and let another reader enjoy it. Keep stories moving across our community.",
    button: "Browse Books",
    link: "/books",
    icon: BookMarked,
    image: "/hero/hero-3.jpg",
  },
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Safe client-side mount check to avoid hydration mismatch with Swiper
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <section
      className="relative isolate min-h-[600px] overflow-hidden bg-[#F4F8F8] dark:bg-[#031716] md:min-h-[700px]"
      aria-label="BookNook Featured Hero Banner"
    >
      {mounted && (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={1200}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
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
          {slides.map((slide, index) => {
            const Icon = slide.icon;

            return (
              <SwiperSlide key={slide.title}>
                {({ isActive }) => (
                  <div className="relative min-h-[600px] w-full overflow-hidden md:min-h-[700px]">
                    
                    {/* Background Image with Ken Burns Zoom & Dark Green Overlay */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        quality={95}
                        className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                          isActive ? "scale-110" : "scale-100"
                        }`}
                      />
                      {/* Elegant dark green bookstore overlay for maximum text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#031716]/95 via-[#031716]/80 to-[#031716]/40 dark:from-[#031716]/98 dark:via-[#031716]/85 dark:to-[#031716]/50" />
                    </div>

                    {/* Main Content & Floating Elements Grid */}
                    <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-6 py-20 md:min-h-[700px] lg:px-12">
                      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        
                        {/* Left Column: Typography & Call to Action */}
                        <div className="col-span-12 lg:col-span-7">
                          
                          {/* Eyebrow Label */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          >
                            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0C969C]/30 bg-[#032F30]/80 px-4 py-2 text-xs font-bold tracking-[2px] text-[#6BA3BE] shadow-sm backdrop-blur-md">
                              <Icon size={16} className="text-[#0C969C]" />
                              {slide.subtitle}
                            </span>
                          </motion.div>

                          {/* Heading with staggered rise */}
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="font-heading text-4xl font-black leading-[1.12] tracking-tight text-[#F4F8F8] sm:text-5xl md:text-6xl"
                          >
                            {slide.title}
                            <span className="mt-2 block bg-gradient-to-r from-[#0C969C] via-[#6BA3BE] to-[#F4F8F8] bg-clip-text text-transparent">
                              {slide.highlight}
                            </span>
                          </motion.h1>

                          {/* Paragraph */}
                          <motion.p
                            initial={{ opacity: 0, y: 25 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-6 max-w-xl text-base leading-relaxed text-[#6BA3BE]/90 sm:text-lg"
                          >
                            {slide.text}
                          </motion.p>

                          {/* Action Button with gentle gold / teal pulse */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mt-8 flex flex-wrap items-center gap-4"
                          >
                            <Link
                              href={slide.link}
                              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95"
                            >
                              {/* Gentle pulse ring */}
                              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <span className="relative z-10">{slide.button}</span>
                              <ArrowRight
                                size={18}
                                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
                              />
                            </Link>
                          </motion.div>

                        </div>

                        {/* Right Column: Floating Mockups, Chips & Twinkling Sparkles */}
                        <div className="col-span-12 hidden lg:col-span-5 lg:block">
                          <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center">
                            
                            {/* Twinkling Sparkle Stars */}
                            <motion.div
                              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              className="absolute -top-6 right-8 text-[#6BA3BE]/60"
                            >
                              <Sparkles size={32} />
                            </motion.div>
                            <motion.div
                              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute bottom-12 left-4 text-[#0C969C]/60"
                            >
                              <Sparkles size={24} />
                            </motion.div>

                            {/* Floating Hardcover Book Mockup Card */}
                            <motion.div
                              animate={{ y: [-10, 10, -10] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                              className="relative z-10 w-72 rounded-3xl border border-[#0C969C]/30 bg-[#032F30]/80 p-6 shadow-2xl backdrop-blur-xl"
                            >
                              <div className="flex aspect-4/5 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0C969C]/20 to-[#031716] p-6 border border-[#0C969C]/20">
                                <div className="flex justify-between items-start">
                                  <span className="rounded-full bg-[#0C969C]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6BA3BE]">
                                    Featured Shelf
                                  </span>
                                  <BookOpen className="text-[#0C969C]" size={20} />
                                </div>
                                <div className="space-y-2">
                                  <p className="font-heading text-xl font-bold text-[#F4F8F8]">
                                    The Community Library
                                  </p>
                                  <p className="text-xs text-[#6BA3BE]">
                                    Share what you have read and borrow what you have not.
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-[#0C969C]">
                                  <span>BookNook Edition</span>
                                  <span>Active</span>
                                </div>
                              </div>
                            </motion.div>

                            {/* Floating Chip 1: New Arrival */}
                            <motion.div
                              animate={{ y: [10, -10, 10] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                              className="absolute -top-4 left-2 z-20 rounded-2xl border border-[#0C969C]/30 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-[#031716]/90 dark:border-[#274D60]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="size-2.5 rounded-full bg-[#0C969C] animate-pulse" />
                                <span className="text-xs font-bold text-[#031716] dark:text-[#F4F8F8]">New arrival</span>
                              </div>
                            </motion.div>

                            {/* Floating Chip 2: 3 Copies Available */}
                            <motion.div
                              animate={{ y: [-8, 8, -8] }}
                              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                              className="absolute bottom-6 -right-4 z-20 rounded-2xl border border-[#0C969C]/30 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-[#031716]/90 dark:border-[#274D60]"
                            >
                              <div className="flex items-center gap-2">
                                <BookMarked size={14} className="text-[#0C969C]" />
                                <span className="text-xs font-bold text-[#031716] dark:text-[#F4F8F8]">3 copies available</span>
                              </div>
                            </motion.div>

                            {/* Floating Chip 3: Return in one tap */}
                            <motion.div
                              animate={{ y: [8, -8, 8] }}
                              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                              className="absolute -bottom-6 left-6 z-20 rounded-2xl border border-[#0C969C]/30 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-[#031716]/90 dark:border-[#274D60]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#0A7075] dark:text-[#6BA3BE]">⚡ Return in one tap</span>
                              </div>
                            </motion.div>

                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Slider Controls Bar (Pagination dots with progress bar & Desktop Arrows) */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">
        
        {/* Clickable Pagination Dots */}
        <div className="booknook-hero-pagination pointer-events-auto flex items-center gap-3" />

        {/* Prev / Next Desktop Navigation Arrows */}
        <div className="pointer-events-auto hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-white/90 text-[#0C969C] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-white/90 text-[#0C969C] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Custom Swiper Pagination Styling with Autoplay Progress Bar on Active Dot */}
      <style jsx global>{`
        .booknook-hero-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #0C969C;
          opacity: 0.35;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .booknook-hero-pagination .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 20px;
          opacity: 1;
          background: #032F30;
          border: 1px solid rgba(12, 150, 156, 0.4);
        }

        .booknook-hero-pagination .swiper-pagination-bullet-active::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0%;
          background: linear-gradient(to right, #0C969C, #6BA3BE);
          border-radius: 20px;
          animation: swiperProgress 5.5s linear infinite;
        }

        @keyframes swiperProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .dark .booknook-hero-pagination .swiper-pagination-bullet {
          background: #6BA3BE;
        }

        .dark .booknook-hero-pagination .swiper-pagination-bullet-active {
          background: #032F30;
          border-color: rgba(107, 163, 190, 0.4);
        }
      `}</style>
    </section>
  );
}