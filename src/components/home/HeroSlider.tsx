
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
      className="relative overflow-hidden bg-[#FAF7F1] dark:bg-[#202132]"
      aria-label="Featured books"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={900}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
          el: ".booknook-pagination",
        }}
        onSwiper={setSwiper}
        className="booknook-hero-swiper"
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={slide.title}>
              {({ isActive }) => (
                <div className="relative min-h-[560px] overflow-hidden md:min-h-[650px]">

                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/images/booknook-hero.png"
                      alt="Books and cozy reading space"
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F1] via-[#FAF7F1]/95 to-[#FAF7F1]/10 dark:from-[#202132] dark:via-[#202132]/95 dark:to-[#202132]/20" />
                  </div>

                  {/* Content */}
                  <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-20 md:min-h-[650px] lg:px-12">
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={
                        isActive
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 25 }
                      }
                      transition={{ duration: 0.7 }}
                      className="relative z-10 max-w-xl"
                    >
                      {/* Badge */}
                      <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#A83238]/20 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[2px] text-[#A83238] shadow-sm dark:bg-[#292A40]/90">
                        <Icon size={16} />
                        {slide.subtitle}
                      </span>

                      {/* Heading */}
                      <h1 className="font-heading text-4xl font-bold leading-[1.15] tracking-tight text-[#292A40] sm:text-5xl md:text-6xl dark:text-white">
                        {slide.title}
                        <span className="mt-2 block text-[#A83238]">
                          {slide.highlight}
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="mt-6 max-w-lg text-base leading-8 text-[#62636D] sm:text-lg dark:text-gray-300">
                        {slide.text}
                      </p>

                      {/* Button */}
                      <div className="mt-8">
                        <Link
                          href={slide.link}
                          className="group inline-flex items-center gap-3 rounded-full bg-[#A83238] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#A83238]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#85272D] hover:shadow-xl"
                        >
                          {slide.button}
                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>

                      {/* Bottom Text */}
                      <div className="mt-10 flex items-center gap-3 text-sm text-[#777781] dark:text-gray-400">
                        <span className="h-px w-10 bg-[#A83238]" />
                        Read more. Share more. Discover more.
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Bottom Controls */}
      <div className="absolute bottom-7 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">

        {/* Pagination */}
        <div className="booknook-pagination flex items-center gap-2" />

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-11 items-center justify-center rounded-full border border-[#A83238]/40 bg-white/80 text-[#A83238] shadow-sm transition-all hover:bg-[#A83238] hover:text-white dark:bg-[#292A40]/90"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            onClick={() => swiper?.slideNext()}
            aria-label="Next slide"
            className="flex size-11 items-center justify-center rounded-full border border-[#A83238]/40 bg-white/80 text-[#A83238] shadow-sm transition-all hover:bg-[#A83238] hover:text-white dark:bg-[#292A40]/90"
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>

      {/* Pagination Styling */}
      <style jsx global>{`
        .booknook-pagination .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          background: #a83238;
          opacity: 0.35;
          transition: all 0.3s ease;
        }

        .booknook-pagination .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 20px;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
