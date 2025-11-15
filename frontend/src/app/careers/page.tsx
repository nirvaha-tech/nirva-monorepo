"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, Briefcase, ArrowRight, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const applicationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  linkedinUrl: z.string().url("Valid LinkedIn URL is required").optional().or(z.literal("")),
  note: z.string().optional(),
  resume: z.any().refine((files) => files?.length > 0, "Resume is required"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.linkedinUrl) formData.append("linkedin_url", data.linkedinUrl);
      if (data.note) formData.append("note", data.note);
      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0]);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/applications`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitSuccess(true);
      reset();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitError(
        "Failed to submit application. Please try again or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobs = [
    {
      title: "Senior DevOps Engineer",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description: "Lead our cloud infrastructure and DevOps practices",
    },
    {
      title: "Cloud Solutions Architect",
      team: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Design and implement scalable cloud solutions",
    },
    {
      title: "Site Reliability Engineer",
      team: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Ensure system reliability and performance",
    },
    {
      title: "Kubernetes Specialist",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Full-time",
      description: "Manage and optimize Kubernetes clusters",
    },
    {
      title: "FinOps Analyst",
      team: "Operations",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Optimize cloud costs and financial operations",
    },
    {
      title: "DevOps Intern",
      team: "Engineering",
      location: "Remote / Tel Aviv",
      type: "Internship",
      description: "Learn and contribute to DevOps practices",
    },
  ];

  const jobDetails: Record<number, any> = {
    0: { // Senior DevOps Engineer
      whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm that empowers engineering teams to build resilient, scalable, and cost-effective systems. We specialize in transforming chaotic infrastructure into streamlined, automated operations.",
      techStack: ["Terraform", "Python", "Node.js", "TypeScript", "React", "PostgreSQL", "AWS", "Temporal", "Redis", "Kubernetes", "LLMs", "Advanced data ingestion pipelines"],
      whatYouDo: [
        "Impact the architecture and design of scalable services and products",
        "Collaborate with the CTO to share responsibilities and drive technological innovation",
        "Tackle high-scale challenges, including projects involving LLMs and AI",
        "Work with clients directly, providing direct and real-world impact",
        "Stay abreast of emerging technologies and evaluate their applicability to our products"
      ],
      whatYouBring: [
        "5+ years in software engineering with focus on DevOps/infrastructure",
        "Curious, independent, and persistent - driven to solve hard problems",
        "Experience in owning and delivering projects end to end",
        "Strong proficiency in Kubernetes, Terraform, and cloud platforms (AWS/GCP)",
        "Solid understanding of CI/CD, infrastructure as code, and GitOps",
        "Excellent problem-solving and analytical abilities",
        "Strong communication skills with ability to work effectively in a team"
      ],
      whyJoinUs: [
        "Cutting-Edge Tech: Work with Kubernetes, Terraform, and cloud-native technologies in production",
        "Early-stage role with meaningful equity and impact",
        "Direct Impact: Small, flat engineering team where everyone influences architecture and product direction",
        "Greenfield Work: Build new systems from scratch, not maintain legacy code",
        "Technical Challenge at Scale: Focus on scaling throughput and building resilient enterprise systems",
        "Continuous Learning: Regular tech exploration sessions and quarterly hackathons",
        "Room to Grow: Opportunities for technical leadership with direct mentorship"
      ]
    }
  };

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
            
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Be a part of an inclusive and people-oriented culture to discover the{" "}
              <span className="font-bold text-primary-600">nirvahatech</span> in you!
            </p>

            <motion.a
              href="#apply-now"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Apply Now
              <ArrowRight size={24} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              Who We Are
            </h2>
            
            <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                <strong>nirvahatech</strong> is a leading DevOps and cloud infrastructure consulting firm that empowers engineering teams to build resilient, scalable, and cost-effective systems.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                We specialize in transforming chaotic infrastructure into streamlined, automated operations. From Kubernetes orchestration to FinOps optimization, we help startups and enterprises eliminate firefighting and focus on innovation.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Global technology companies and fast-growing startups rely on us to architect robust cloud solutions, implement CI/CD pipelines, and establish monitoring frameworks that catch issues before they impact customers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">The Role</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Build scalable cloud infrastructure</li>
                  <li>• Implement automation and CI/CD</li>
                  <li>• Optimize costs and performance</li>
                  <li>• Ensure 99.99% uptime</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tech Stack</h3>
                <p className="text-gray-700">
                  Kubernetes, Terraform, AWS, GCP, Docker, Python, Node.js, PostgreSQL, Redis, GitHub Actions, ArgoCD
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why Join Us</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Work on cutting-edge projects</li>
                  <li>• Direct client impact</li>
                  <li>• Continuous learning</li>
                  <li>• Remote-first culture</li>
                </ul>
              </div>
            </div>
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

                  {/* Apply Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setSelectedJob(index)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg group-hover:shadow-md transition-all"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob !== null && jobDetails[selectedJob] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {jobs[selectedJob].title}
                </h2>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {jobs[selectedJob].location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {jobs[selectedJob].type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-6 space-y-8">
              {/* Who We Are */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h3>
                <p className="text-gray-700 leading-relaxed">
                  {jobDetails[selectedJob].whoWeAre}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails[selectedJob].techStack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* What You'll Do */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Do</h3>
                <ul className="space-y-3">
                  {jobDetails[selectedJob].whatYouDo.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You Bring */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What You Bring</h3>
                <ul className="space-y-3">
                  {jobDetails[selectedJob].whatYouBring.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Join Us */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Join Us</h3>
                <ul className="space-y-3">
                  {jobDetails[selectedJob].whyJoinUs.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ★
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply CTA */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Ready to Join Our Team?
                </h4>
                <p className="text-gray-700 mb-4">
                  If you&apos;re excited about this opportunity, we&apos;d love to hear from you!
                </p>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    document.getElementById('apply-now')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Apply Now
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Form */}
      <section id="apply-now" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Apply Now
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
              Join our team and help shape the future of DevOps and cloud infrastructure
            </p>

            {submitSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-lg text-gray-700">
                  Thank you for your interest. We&apos;ll review your application and get back to you soon.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
                        First Name *
                      </label>
                      <input
                        {...register("firstName")}
                        type="text"
                        id="firstName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
                        Last Name *
                      </label>
                      <input
                        {...register("lastName")}
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Personal Email *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-gray-900 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      {...register("linkedinUrl")}
                      type="url"
                      id="linkedinUrl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedinUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="resume" className="block text-sm font-semibold text-gray-900 mb-2">
                      Resume/CV *
                    </label>
                    <div className="relative">
                      <input
                        {...register("resume")}
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx,.txt,.rtf"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        Accepted formats: PDF, DOC, DOCX, TXT, RTF (Max 5MB)
                      </div>
                    </div>
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-600">{String(errors.resume.message || "Resume is required")}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="note" className="block text-sm font-semibold text-gray-900 mb-2">
                      Additional Note
                    </label>
                    <textarea
                      {...register("note")}
                      id="note"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us why you're interested in joining nirvahatech..."
                    />
                    {errors.note && (
                      <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg rounded-lg hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Submit Application
                      </>
                    )}
                  </button>

                  <p className="text-sm text-center text-gray-600">
                    Your information is confidential and will be used only for recruitment purposes.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

