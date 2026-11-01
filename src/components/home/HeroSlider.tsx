
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
      className="relative isolate overflow-hidden bg-[#FAF7F1] dark:bg-[#15151F]"
      aria-label="Featured books"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{
          delay: 3500,
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
                <div className="relative min-h-[560px] overflow-hidden md:min-h-[650px]">

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/booknook-hero.png"
                      alt="Books and cozy reading space"
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      quality={100}
                      className="object-cover object-center"
                    />

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F1]/20 via-[#FAF7F1]/10 to-transparent dark:from-[#15151F]/20 dark:via-[#15151F]/10 dark:to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-20 md:min-h-[650px] lg:px-12">
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
                      <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#A83238]/20 bg-white/90 px-4 py-2 text-xs font-semibold tracking-[2px] text-[#A83238] shadow-sm dark:border-[#C65B65]/40 dark:bg-[#292A40]/95 dark:text-[#F5F0EA]">
                        <Icon size={16} />
                        {slide.subtitle}
                      </span>

                      {/* Heading */}
                      <h1 className="font-heading text-4xl font-bold leading-[1.15] tracking-tight text-[#292A40] sm:text-5xl md:text-6xl dark:text-[#F5F0EA]">
                        {slide.title}

                        <span className="mt-2 block text-[#A83238] dark:text-[#C65B65]">
                          {slide.highlight}
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="mt-6 max-w-lg text-base leading-8 text-[#555563] sm:text-lg dark:text-[#AAA8B6]">
                        {slide.text}
                      </p>

                      {/* Button */}
                      <div className="mt-8">
                        <Link
                          href={slide.link}
                          className="group inline-flex items-center gap-3 rounded-full bg-[#A83238] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#A83238]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#85272D] hover:shadow-xl dark:bg-[#A83238] dark:text-white dark:hover:bg-[#85272D]"
                        >
                          {slide.button}

                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>

                      {/* Bottom Text */}
                      <div className="mt-10 flex items-center gap-3 text-sm text-[#686875] dark:text-[#AAA8B6]">
                        <span className="h-px w-10 bg-[#A83238] dark:bg-[#C65B65]" />
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
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-6 lg:px-12">

        {/* Pagination */}
        <div className="booknook-pagination pointer-events-auto flex items-center gap-2" />

        {/* Navigation */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous slide"
            className="flex size-11 items-center justify-center rounded-full border border-[#A83238]/40 bg-white/90 text-[#A83238] shadow-sm transition-all hover:bg-[#A83238] hover:text-white dark:border-[#C65B65]/50 dark:bg-[#292A40] dark:text-[#F5F0EA] dark:hover:bg-[#A83238] dark:hover:text-white"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next slide"
            className="flex size-11 items-center justify-center rounded-full border border-[#A83238]/40 bg-white/90 text-[#A83238] shadow-sm transition-all hover:bg-[#A83238] hover:text-white dark:border-[#C65B65]/50 dark:bg-[#292A40] dark:text-[#F5F0EA] dark:hover:bg-[#A83238] dark:hover:text-white"
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
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .booknook-pagination .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 20px;
          opacity: 1;
        }

        .dark .booknook-pagination .swiper-pagination-bullet {
          background: #c65b65;
        }

        .dark .booknook-pagination .swiper-pagination-bullet-active {
          background: #c65b65;
        }
      `}</style>
    </section>
  );
}
