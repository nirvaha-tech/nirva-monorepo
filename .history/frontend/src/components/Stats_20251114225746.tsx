"use client";

import { motion, Variants } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

export function Stats() {
  const stats = [
    {
      value: 5,
      suffix: "x",
      label: "Faster Deployments",
      description: "Days to hours",
    },
    {
      value: 99.99,
      suffix: "%",
      decimals: 2,
      label: "Uptime",
      description: "Always on",
    },
    {
      value: 40,
      prefix: "-",
      suffix: "%",
      label: "Cloud Costs",
      description: "Pure savings",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Monitoring",
      description: "Never sleep",
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0, 0.71, 0.2, 1.01] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Real Results.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Real Impact.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            The metrics that matter
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="text-center cursor-pointer group"
            >
              {/* Number */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-3 transition-all duration-300">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-primary-600 to-secondary-600 group-hover:from-primary-500 group-hover:via-secondary-500 group-hover:to-primary-700">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    decimals={stat.decimals}
                  />
                </span>
              </div>

              {/* Label */}
              <div className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm md:text-base text-gray-500 group-hover:text-gray-700 transition-colors">
                {stat.description}
              </div>

              {/* Hover line indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="mt-4 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"
                style={{ width: '60%' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />
      </div>
    </section>
  );
}

