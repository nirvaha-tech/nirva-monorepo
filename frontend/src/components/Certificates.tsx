"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award } from "lucide-react";

export function Certificates() {
  const certificates = [
    {
      src: "/certificate-1.webp",
      alt: "Professional Certification",
      title: "Professional Certification",
    },
    {
      src: "/aws-badges.png",
      alt: "AWS Certifications and Badges",
      title: "AWS Certifications & Badges",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
            <Award size={32} className="text-primary-600" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Certified Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our team holds industry-leading certifications to ensure you receive world-class DevOps and cloud infrastructure solutions.
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: [0, 0.71, 0.2, 1.01] 
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-white">
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">
                {cert.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-gray-900">Trusted by industry leaders</span>
            {" "}to deliver secure, scalable, and high-performance infrastructure solutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

