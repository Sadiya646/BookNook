"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  Library,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Fiction", icon: BookOpen, description: "Stories and imagination" },
  { name: "Science", icon: FlaskConical, description: "Explore and discover" },
  { name: "History", icon: Landmark, description: "Learn from the past" },
  { name: "Kids", icon: Baby, description: "Books for young readers" },
  { name: "Others", icon: Library, description: "More to explore" },
];

export default function TopCategories() {
  return (
    <section className="bg-white dark:bg-[#031716] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#0C969C] mb-3">
            Top Categories
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#032F30] dark:text-white">
            Find your shelf
          </h2>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/all-books?category=${category.name}`}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl border border-[#A7C5CC]/40 dark:border-[#274D60] bg-[#F4F8F8] dark:bg-[#032F30] hover:bg-[#0C969C] hover:border-[#0C969C] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#0C969C]/10 text-[#0C969C] flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-bold text-lg text-[#032F30] dark:text-white group-hover:text-white">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white/80 mt-2">
                    {category.description}
                  </p>

                  <ArrowRight
                    size={18}
                    className="mt-4 text-[#0C969C] group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Add Book CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-3xl bg-[#032F30] dark:bg-[#274D60] px-7 py-12 md:px-14 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#A7C5CC] mb-3">
              Share the joy of reading
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Have a book to share?
            </h2>

            <p className="text-gray-300 max-w-lg leading-relaxed">
              Add it to the library and let another reader enjoy it.
            </p>
          </div>

          <Link
            href="/add-book"
            className="shrink-0 inline-flex items-center gap-2 bg-[#E5CD82] hover:bg-[#FFF2B4] text-[#032F30] font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus size={20} />
            Add a Book
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}