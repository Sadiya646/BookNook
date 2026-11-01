"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Reading is always",
    highlight: "a good idea.",
    text: "Discover your next favorite book, share your collection, and borrow stories from readers around you. Your next reading adventure starts here.",
    button: "Browse Books",
    link: "/books",
    icon: BookOpen,
  },
  {
    subtitle: "DISCOVER YOUR NEXT STORY",
    title: "Find books that",
    highlight: "inspire you.",
    text: "Explore a collection of interesting books across different genres. Find something new to read and make every page count.",
    button: "Explore Library",
    link: "/books",
    icon: Library,
  },
  {
    subtitle: "SHARE THE LOVE OF READING",
    title: "Your books can",
    highlight: "travel further.",
    text: "Have books sitting on your shelf? Share them with other readers and help someone discover their next favorite story.",
    button: "Share a Book",
    link: "/add-book",
    icon: BookMarked,
  },
];

export default function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#F4F8F8] dark:bg-[#031716]"
      aria-label="Featured books"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
          el: ".booknook-pagination",
        }}
        onSwiper={(instance) => {
          setSwiper(instance);
          instance.autoplay.start();
        }}
        className="booknook-hero-swiper"
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={slide.title}>
              {({ isActive }) => (
                <div className="relative min-h-[580px] overflow-hidden md:min-h-[680px]">

                  {/* Background Image & Luxury Gradient Overlay */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/booknook-hero.png"
                      alt="Books and cozy reading space"
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      quality={100}
                      className="object-cover object-center transition-transform duration-1000 scale-105"
                    />

                    {/* Non-blue custom gradient tint based on your palette */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8F8]/90 via-[#F4F8F8]/60 to-transparent dark:from-[#031716]/95 dark:via-[#031716]/75 dark:to-[#031716]/30" />
                  </div>

                  {/* Content Container with Fancy Staggered Motion */}
                  <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl items-center px-6 py-20 md:min-h-[680px] lg:px-12">
                    <div className="relative z-10 max-w-xl">

                      {/* Animated Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0C969C]/30 bg-white/90 px-4 py-2 text-xs font-bold tracking-[2px] text-[#0A7075] shadow-sm backdrop-blur-md dark:border-[#0C969C]/40 dark:bg-[#032F30]/90 dark:text-[#6BA3BE]">
                          <Icon size={16} className="text-[#0C969C]" />
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Animated Heading */}
                      <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="font-heading text-4xl font-black leading-[1.12] tracking-tight text-[#031716] sm:text-5xl md:text-6xl dark:text-[#F4F8F8]"
                      >
                        {slide.title}
                        <span className="mt-2 block bg-gradient-to-r from-[#0C969C] to-[#6BA3BE] bg-clip-text text-transparent">
                          {slide.highlight}
                        </span>
                      </motion.h1>

                      {/* Animated Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mt-6 max-w-lg text-base leading-relaxed text-[#274D60] sm:text-lg dark:text-[#6BA3BE]"
                      >
                        {slide.text}
                      </motion.p>

                      {/* Animated Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-8"
                      >
                        <Link
                          href={slide.link}
                          className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95"
                        >
                          {slide.button}
                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1.5"
                          />
                        </Link>
                      </motion.div>

                      {/* Bottom Accent line/text */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-10 flex items-center gap-3 text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]"
                      >
                        <span className="h-[2px] w-12 rounded-full bg-gradient-to-r from-[#0C969C] to-[#6BA3BE]" />
                        Read more. Share more. Discover more.
                      </motion.div>

                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Modern Bottom Controls & Pagination */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">
        
        {/* Custom Pagination container */}
        <div className="booknook-pagination pointer-events-auto flex items-center gap-2" />

        {/* Fancy Navigation Arrows */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-white/90 text-[#0C969C] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-white/90 text-[#0C969C] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Dynamic Pagination Styling */}
      <style jsx global>{`
        .booknook-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #0C969C;
          opacity: 0.35;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .booknook-pagination .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 20px;
          opacity: 1;
          background: linear-gradient(to right, #0C969C, #6BA3BE);
        }

        .dark .booknook-pagination .swiper-pagination-bullet {
          background: #6BA3BE;
        }

        .dark .booknook-pagination .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #0C969C, #6BA3BE);
        }
      `}</style>
    </section>
  );
}