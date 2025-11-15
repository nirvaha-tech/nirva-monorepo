"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, MapPin, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {

  const jobs = [
    {
      title: "Senior DevOps Engineer",
      slug: "senior-devops-engineer",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description: "Lead our cloud infrastructure and DevOps practices",
    },
    {
      title: "Cloud Solutions Architect",
      slug: "cloud-solutions-architect",
      team: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Design and implement scalable cloud solutions",
    },
    {
      title: "Site Reliability Engineer",
      slug: "site-reliability-engineer",
      team: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Ensure system reliability and performance",
    },
    {
      title: "Kubernetes Specialist",
      slug: "kubernetes-specialist",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description: "Manage and optimize Kubernetes clusters",
    },
    {
      title: "FinOps Analyst",
      slug: "finops-analyst",
      team: "Operations",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Optimize cloud costs and financial operations",
    },
    {
      title: "DevOps Intern",
      slug: "devops-intern",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Internship",
      description: "Learn and contribute to DevOps practices",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
              Join Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Mission
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-4">
              We empower exceptional talents like you by supporting your growth and ambitions.
            </p>
            
            <p className="text-lg md:text-xl text-gray-600">
              Be a part of an inclusive and people-oriented culture to discover the{" "}
              <span className="font-bold text-primary-600">nirvahatech</span> in you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our current opportunities and find your perfect role
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 flex-grow">
                    {job.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={18} className="text-primary-600" />
                      <span className="text-sm font-medium">{job.team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={18} className="text-primary-600" />
                      <span className="text-sm font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase size={18} className="text-primary-600" />
                      <span className="text-sm font-medium">{job.type}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link 
                      href={`/careers/${job.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg group-hover:shadow-md transition-all"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

