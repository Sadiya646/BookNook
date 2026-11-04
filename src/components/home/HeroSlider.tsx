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

/**
 * Slide configuration data for the BookNook Hero Banner (Single Zooming Image Background).
 */
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
    button: "Explore Shelves",
    link: "/books",
    icon: Library,
  },
  {
    id: 3,
    subtitle: "SHARE YOUR SHELF",
    title: "Have a book",
    highlight: "to share?",
    text: "Add it to the library and let another reader enjoy it. Keep stories moving across our community.",
    button: "Share a Book",
    link: "/add-book",
    icon: BookMarked,
  },
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
      {/* Single Background Image with Smooth Zoom-In (Ken Burns) Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            duration: 12,
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
            quality={95}
            className="object-cover object-center"
          />
        </motion.div>

        {/* Rich Bookstore Dark Overlay for Text Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031716]/95 via-[#031716]/75 to-[#031716]/60 dark:from-[#031716]/98 dark:via-[#031716]/85 dark:to-[#031716]/70" />
      </div>

      {mounted && (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={600} // ফাস্ট ও স্মুথ ট্রানজিশনের জন্য স্পিড কমানো হয়েছে
          autoplay={{
            delay: 3500, // আরও দ্রুত স্লাইড চেঞ্জ হওয়ার জন্য ডিলে কমানো হয়েছে
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
          {slides.map((slide) => {
            const Icon = slide.icon;

            return (
              <SwiperSlide key={slide.id}>
                {({ isActive }) => (
                  <div className="relative min-h-[600px] w-full overflow-hidden md:min-h-[700px]">
                    
                    {/* Centered Content Layout */}
                    <div className="relative z-10 mx-auto flex min-h-[600px] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[700px]">
                      
                      {/* Eyebrow Label */}
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                      >
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0C969C]/40 bg-[#032F30]/90 px-5 py-2.5 text-xs font-bold tracking-[2.5px] text-[#6BA3BE] shadow-xl backdrop-blur-md">
                          <Icon size={16} className="text-[#0C969C]" />
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Main Heading with Fast Staggered Rise */}
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-heading text-4xl font-black leading-[1.15] tracking-tight text-[#F4F8F8] sm:text-6xl md:text-7xl"
                      >
                        {slide.title}
                        <span className="mt-2 block bg-gradient-to-r from-[#0C969C] via-[#6BA3BE] to-[#F4F8F8] bg-clip-text text-transparent pb-1">
                          {slide.highlight}
                        </span>
                      </motion.h1>

                      {/* Paragraph */}
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-[#6BA3BE]/95 sm:text-lg md:text-xl font-medium"
                      >
                        {slide.text}
                      </motion.p>

                      {/* Action Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex items-center justify-center"
                      >
                        <Link
                          href={slide.link}
                          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-2xl shadow-[#0C969C]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(12,150,156,0.6)] active:scale-95"
                        >
                          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="relative z-10">{slide.button}</span>
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
      )}

      {/* Slider Controls Bar */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">
        <div className="booknook-hero-pagination pointer-events-auto flex items-center gap-3" />

        <div className="pointer-events-auto hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-[#032F30]/80 text-[#6BA3BE] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
            className="flex size-12 items-center justify-center rounded-full border border-[#0C969C]/30 bg-[#032F30]/80 text-[#6BA3BE] shadow-md backdrop-blur-md transition-all hover:bg-[#0C969C] hover:text-white dark:border-[#274D60] dark:bg-[#032F30]/90 dark:text-[#F4F8F8] dark:hover:bg-[#0C969C]"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Custom Swiper Pagination Styling with Fast Progress */}
      <style jsx global>{`
        .booknook-hero-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #0C969C;
          opacity: 0.35;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
          animation: swiperProgress 3.5s linear infinite;
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