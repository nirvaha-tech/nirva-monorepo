"use client";

import { motion, Variants } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { Activity, Shield, DollarSign } from "lucide-react";

export function StoryStats() {
  const stats = [
    {
      value: 5,
      suffix: "x",
      label: "Faster",
      description: "Deployments",
    },
    {
      value: 99.99,
      suffix: "%",
      decimals: 2,
      label: "Always",
      description: "Available",
    },
    {
      value: 40,
      prefix: "-",
      suffix: "%",
      label: "Lower",
      description: "Cloud Spend",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Always",
      description: "Watching",
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
            <Activity size={32} className="text-primary-600" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            From{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              Firefighting
            </span>
            <br />
            to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Innovation
            </span>
          </h2>

          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-3 max-w-3xl mx-auto">
            Your engineers should build the future—not just keep the lights on.
          </p>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re engineers who lived this pain. We give you back your team&apos;s most valuable resource:{" "}
            <span className="font-semibold text-gray-900">time and focus.</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16"
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
              <div className="text-5xl md:text-6xl lg:text-7xl font-black mb-2 transition-all duration-300">
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
              <div className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm md:text-base text-gray-500 group-hover:text-gray-700 transition-colors">
                {stat.description}
              </div>

              {/* Hover line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="mt-3 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"
                style={{ width: '50%' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Strategic Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative">
            <h3 className="text-2xl md:text-4xl font-bold mb-3 text-center">
              Strategic Partners, Not Just Vendors
            </h3>
            <p className="text-lg md:text-xl font-semibold text-center mb-8 opacity-90">
              Our goal? Make ourselves obsolete. Your team should own the system.
            </p>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Embed & Assess",
                  desc: "Understand your tech, goals, and team dynamics.",
                },
                {
                  icon: Activity,
                  title: "Implement Fast",
                  desc: "Battle-tested frameworks. Quick wins. Lasting results.",
                },
                {
                  icon: DollarSign,
                  title: "Transfer Knowledge",
                  desc: "Pair-program, document, train. Complete self-sufficiency.",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <Icon className="mb-3" size={28} />
                    <h4 className="font-bold text-base mb-2">{item.title}</h4>
                    <p className="text-sm opacity-90">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

