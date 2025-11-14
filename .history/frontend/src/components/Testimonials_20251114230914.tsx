"use client";

import { Quote, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Working with nirvahatech was a game-changer. Our deployment times went from hours to minutes, and we've achieved 99.99% uptime. They didn't just fix our problems; they empowered our team to manage a truly scalable system. It's the best investment we've made in our tech stack.",
      name: "Sarah Johnson",
      title: "CTO",
      company: "QuantumLeap AI",
    },
    {
      quote:
        "Before nirvahatech, our cloud spend was chaotic. Their FinOps approach brought immediate clarity and helped us cut costs by over 30% without sacrificing performance. Their team feels like an extension of ours—true partners in our success.",
      name: "David Chen",
      title: "VP of Engineering",
      company: "NexaHealth",
    },
    {
      quote:
        "The level of Kubernetes expertise at nirvahatech is unmatched. They untangled a highly complex setup that had plagued us for years. Our developers are finally free to innovate instead of constantly firefighting. I can't recommend them enough.",
      name: "Michael Rodriguez",
      title: "DevOps Manager",
      company: "AID Genomics",
    },
    {
      quote:
        "nirvahatech transformed our entire DevOps culture. Their observability framework gave us insights we never had before, and now we catch issues before they impact customers. Our incident response time dropped by 80%. They're not just consultants—they're force multipliers.",
      name: "Emily Patterson",
      title: "Head of Platform Engineering",
      company: "StreamVista",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  return (
    <section
      id="testimonials-section"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Trusted by the Innovators
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          We don&apos;t just build infrastructure; we build partnerships. Here&apos;s what leaders from fast-growing startups are saying about working with nirvahatech.
        </p>

        {/* Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
            >
              <div className="flex items-start justify-start mb-6">
                <Quote className="text-primary-600 opacity-50" size={48} />
              </div>
              
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                    <User className="text-white" size={32} />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].title}
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-12 h-3 bg-gradient-to-r from-primary-600 to-secondary-600"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {!isPaused && (
            <motion.div
              className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              key={currentIndex}
            />
          )}
        </div>
      </div>
    </section>
  );
}

