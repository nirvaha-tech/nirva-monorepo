"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { AnimatedSection } from "./AnimatedSection";

export function Stats() {
  const stats = [
    {
      value: 5,
      suffix: "x",
      label: "Faster Deployment Cycles",
      description: "From days to hours",
    },
    {
      value: 99.99,
      suffix: "%",
      decimals: 2,
      label: "Uptime Achieved",
      description: "Industry-leading reliability",
    },
    {
      value: 40,
      prefix: "-",
      suffix: "%",
      label: "Reduction in Cloud Spend",
      description: "Optimized cloud spending",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Monitoring & Support",
      description: "Always watching your systems",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            The Tangible Results of True Cloud Reliability
          </h2>
        </AnimatedSection>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-6 rounded-lg hover:bg-gradient-to-br hover:from-primary-50 hover:to-white hover:shadow-xl cursor-pointer group"
            >
              <div className="text-5xl md:text-6xl font-bold text-primary-600 mb-2 transition-all duration-300 group-hover:scale-110">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

