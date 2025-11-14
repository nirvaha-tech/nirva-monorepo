"use client";

import { motion, Variants } from "framer-motion";
import { 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  Eye, 
  GitBranch,
  AlertCircle 
} from "lucide-react";
import { useEffect, useState } from "react";

export function Symptoms() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("symptoms-section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate progress (0 to 1)
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const progress = Math.max(0, Math.min(1, -start / (sectionHeight - windowHeight)));
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const symptoms = [
    {
      icon: AlertTriangle,
      title: "Deployments Break Randomly",
      description:
        "Every release feels like rolling the dice. Your team ships slower because they're scared to break production.",
    },
    {
      icon: TrendingUp,
      title: "Manual Scaling Chaos",
      description:
        "Traffic spikes trigger all-hands-on-deck panic. Scaling shouldn't require heroics at 3 AM.",
    },
    {
      icon: DollarSign,
      title: "Cloud Costs Exploding",
      description:
        "Your AWS bill grows faster than revenue. No visibility into what's burning money or why.",
    },
    {
      icon: Flame,
      title: "Engineers Stuck Firefighting",
      description:
        "Your best developers waste days debugging infrastructure instead of building features that matter.",
    },
    {
      icon: Eye,
      title: "Zero Observability",
      description:
        "When things break, you're flying blind. No logs, no metrics, no way to prevent the next incident.",
    },
    {
      icon: GitBranch,
      title: "Kubernetes Became a Maze",
      description:
        "Your setup is so complex nobody understands it anymore. Knowledge silos create critical single points of failure.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.94 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0, 0.71, 0.2, 1.01] as [number, number, number, number],
      },
    },
  };

  const iconPulse = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
    },
  };

  return (
    <section
      id="symptoms-section"
      className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Progress Indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700/30">
        <motion.div
          className="w-full bg-gradient-to-b from-primary-500 via-secondary-500 to-primary-600"
          style={{ height: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148, 163, 184) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30"
          >
            <AlertCircle className="text-red-400" size={32} />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Symptoms Your System Can No Longer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Handle Growth
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            If you recognize even one of these, your infrastructure has already become a bottleneck.
          </p>
        </motion.div>

        {/* Symptoms Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {symptoms.map((symptom, index) => {
            const Icon = symptom.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[19px] opacity-0 group-hover:opacity-20 blur transition duration-300" />
                
                {/* Card */}
                <div className="relative h-full p-8 rounded-[18px] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    animate={iconPulse}
                    className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 group-hover:border-primary-400/50 transition-colors"
                  >
                    <Icon className="text-primary-400 group-hover:text-primary-300 transition-colors" size={28} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                    {symptom.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {symptom.description}
                  </p>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-gray-400 text-lg">
            Sound familiar? You&apos;re not alone.{" "}
            <span className="text-primary-400 font-semibold">
              Let&apos;s fix this together.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

