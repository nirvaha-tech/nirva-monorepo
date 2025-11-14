"use client";

import { Server, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

export function Services() {
  const services = [
    {
      icon: Server,
      title: "Expert-Led DevOps & Kubernetes",
      description:
        "We design, build, and maintain high-performance, self-healing cloud infrastructure. From re-architecting fragile CI/CD pipelines to implementing GitOps-driven workflows, we turn your infrastructure into a competitive advantage. The result is a platform where your developers can ship code reliably and frequently, without the bottlenecks that once slowed them down.",
    },
    {
      icon: Shield,
      title: "DevSecOps & FinOps Integration",
      description:
        "We help you move from a reactive to a proactive posture. By integrating security and cost management directly into your development lifecycle, we help you eliminate vulnerabilities and put an end to chaotic, unpredictable cloud bills. Gain a single pane of glass for both security posture and cost allocation, allowing you to innovate safely and responsibly.",
    },
    {
      icon: Activity,
      title: "24/7 NOC & QA Automation",
      description:
        "Achieve the peace of mind that comes from knowing your systems are monitored around the clock by experts. Our 24/7 Network Operations Center ensures that potential issues are identified and resolved before they impact your customers. Combined with our robust QA automation services, we help you maintain exceptional uptime and deliver a flawless user experience.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0, 0.71, 0.2, 1.01],
      },
    },
  };

  return (
    <section id="services-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            A Full-Suite of Services
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Designed to Accelerate Product Delivery
          </p>
        </AnimatedSection>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6"
                >
                  <Icon size={32} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

