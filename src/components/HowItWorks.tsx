"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, RotateCcw } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick a book",
    description: "Browse the shelves and open any title.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Confirm your borrow",
    description: "Confirm in one step. It is yours for a week.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Return it",
    description: "Return it from My Borrows for the next reader.",
    icon: RotateCcw,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F4F8F8] dark:bg-[#031716] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold tracking-[0.25em] text-[#0C969C] uppercase mb-3">
            How It Works
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#032F30] dark:text-white">
            Three simple steps
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Borrowing your next favorite book is easier than ever.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative bg-white dark:bg-[#032F30] border border-[#A7C5CC]/40 dark:border-[#274D60] rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-xl bg-[#0C969C]/10 flex items-center justify-center text-[#0C969C] group-hover:bg-[#0C969C] group-hover:text-white transition-colors duration-300">
                    <Icon size={27} />
                  </div>

                  <span className="text-5xl font-bold text-[#0C969C]/15">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#032F30] dark:text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}