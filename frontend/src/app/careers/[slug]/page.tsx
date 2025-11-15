"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight, Upload, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const jobsData: Record<string, any> = {
  "senior-devops-engineer": {
    title: "Senior DevOps Engineer",
    team: "Engineering",
    location: "Remote / Tel Aviv",
    type: "Full-time",
    description: "Lead our cloud infrastructure and DevOps practices",
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
  },
  "cloud-solutions-architect": {
    title: "Cloud Solutions Architect",
    team: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Design and implement scalable cloud solutions",
    whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm that empowers engineering teams to build resilient, scalable, and cost-effective systems. We design cloud architectures that scale with your business while maintaining security and cost-efficiency.",
    techStack: ["AWS", "Azure", "GCP", "Terraform", "CloudFormation", "Python", "Docker", "Kubernetes", "Lambda", "API Gateway", "CDN", "Load Balancers"],
    whatYouDo: [
      "Design and architect multi-cloud solutions for enterprise clients",
      "Lead technical discussions with C-level executives and engineering teams",
      "Create architecture diagrams, technical specifications, and best practices documentation",
      "Evaluate and recommend cloud services and technologies",
      "Mentor junior engineers and conduct architecture reviews",
      "Ensure solutions meet security, compliance, and performance requirements"
    ],
    whatYouBring: [
      "7+ years in cloud architecture and infrastructure design",
      "Expert knowledge of AWS/Azure/GCP services and architecture patterns",
      "Experience with multi-cloud and hybrid cloud environments",
      "Strong understanding of networking, security, and compliance requirements",
      "Proven track record of designing systems handling millions of requests",
      "Excellent communication and presentation skills",
      "AWS/Azure/GCP certifications (Solutions Architect Professional preferred)"
    ],
    whyJoinUs: [
      "Architectural Freedom: Design solutions from scratch for diverse clients",
      "Multi-Cloud Expertise: Work across AWS, Azure, and GCP",
      "Client Variety: From startups to Fortune 500 companies",
      "Thought Leadership: Speak at conferences and contribute to open source",
      "Competitive Compensation: Top-tier salary with equity options",
      "Learning Budget: Annual budget for certifications and training",
      "Remote Flexibility: Work from anywhere with occasional client visits"
    ]
  },
  "site-reliability-engineer": {
    title: "Site Reliability Engineer",
    team: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Ensure system reliability and performance",
    whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm. Our SRE team ensures that client systems maintain 99.99% uptime while continuously improving automation, monitoring, and incident response capabilities.",
    techStack: ["Kubernetes", "Prometheus", "Grafana", "ELK Stack", "Datadog", "PagerDuty", "Python", "Go", "Terraform", "Ansible", "Jenkins", "GitLab CI"],
    whatYouDo: [
      "Build and maintain highly available production systems",
      "Implement comprehensive monitoring, alerting, and observability solutions",
      "Design and execute disaster recovery and business continuity plans",
      "Automate operational tasks and eliminate toil",
      "Participate in on-call rotation and incident response",
      "Conduct post-incident reviews and implement preventive measures",
      "Define and track SLIs, SLOs, and error budgets"
    ],
    whatYouBring: [
      "4+ years in SRE, DevOps, or infrastructure engineering",
      "Strong programming skills in Python, Go, or similar languages",
      "Deep understanding of Linux systems administration",
      "Experience with container orchestration (Kubernetes preferred)",
      "Expertise in monitoring tools like Prometheus, Grafana, Datadog",
      "Proven ability to troubleshoot complex distributed systems",
      "On-call experience with incident management"
    ],
    whyJoinUs: [
      "High Impact: Keep critical systems running for major clients",
      "Automation First: Eliminate repetitive tasks through smart automation",
      "Learning Culture: Share knowledge through runbooks and documentation",
      "Work-Life Balance: Fair on-call rotation with compensation",
      "Modern Stack: Work with the latest SRE tools and practices",
      "Problem Solving: Complex technical challenges every day",
      "Team Collaboration: Supportive team that values reliability over speed"
    ]
  },
  "kubernetes-specialist": {
    title: "Kubernetes Specialist",
    team: "Engineering",
    location: "Remote / Tel Aviv",
    type: "Full-time",
    description: "Manage and optimize Kubernetes clusters",
    whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm. Our Kubernetes team helps clients migrate to container orchestration, optimize cluster performance, and implement cloud-native best practices.",
    techStack: ["Kubernetes", "Docker", "Helm", "ArgoCD", "Istio", "Prometheus", "Fluentd", "cert-manager", "RBAC", "Network Policies", "EKS", "GKE", "AKS"],
    whatYouDo: [
      "Design, deploy, and manage production Kubernetes clusters",
      "Implement GitOps workflows using ArgoCD or Flux",
      "Configure service meshes (Istio, Linkerd) for microservices communication",
      "Optimize cluster performance, resource utilization, and costs",
      "Implement security best practices including RBAC, Network Policies, and Pod Security",
      "Migrate applications from VMs to containerized environments",
      "Provide training and guidance to development teams on Kubernetes best practices"
    ],
    whatYouBring: [
      "3+ years of hands-on Kubernetes experience in production",
      "Strong understanding of container networking and storage",
      "Experience with Helm charts and Kubernetes operators",
      "Knowledge of service mesh architectures (Istio, Linkerd)",
      "Proficiency in at least one programming language (Go, Python, or Bash)",
      "CKA or CKAD certification preferred",
      "Experience with managed Kubernetes services (EKS, GKE, AKS)"
    ],
    whyJoinUs: [
      "Kubernetes Focus: Specialized role dedicated to K8s excellence",
      "Diverse Projects: Work with clusters of all sizes and complexities",
      "Certification Support: Company-sponsored CKA/CKAD/CKS certifications",
      "Innovation Time: Experiment with new K8s features and tools",
      "Community Contribution: Contribute to CNCF projects",
      "Expert Team: Learn from other Kubernetes specialists",
      "Career Growth: Clear path from Specialist to Platform Architect"
    ]
  },
  "finops-analyst": {
    title: "FinOps Analyst",
    team: "Operations",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Optimize cloud costs and financial operations",
    whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm. Our FinOps team helps clients achieve cloud cost optimization while maintaining performance and reliability, typically saving 30-50% on cloud spend.",
    techStack: ["AWS Cost Explorer", "CloudHealth", "Kubecost", "Spot.io", "Terraform", "Python", "SQL", "Tableau", "Looker", "Excel", "Cost Management APIs"],
    whatYouDo: [
      "Analyze cloud spending patterns and identify optimization opportunities",
      "Build dashboards and reports for cloud cost visibility",
      "Implement cost allocation and chargeback models",
      "Collaborate with engineering teams to optimize resource usage",
      "Recommend Reserved Instances, Savings Plans, and Spot Instance strategies",
      "Track and report on cloud cost KPIs and savings initiatives",
      "Conduct cloud cost audits and provide actionable recommendations"
    ],
    whatYouBring: [
      "2+ years in cloud cost management or financial analysis",
      "Strong analytical skills with Excel/SQL proficiency",
      "Understanding of AWS/Azure/GCP pricing models",
      "Experience with cost management tools (CloudHealth, Kubecost, etc.)",
      "Ability to communicate financial concepts to technical teams",
      "Detail-oriented with strong problem-solving skills",
      "FinOps Certified Practitioner certification is a plus"
    ],
    whyJoinUs: [
      "Tangible Impact: See direct results from your cost-saving initiatives",
      "Cross-Functional: Work with finance, engineering, and executive teams",
      "Data-Driven: Build models and dashboards that drive business decisions",
      "Growing Field: FinOps is one of the fastest-growing cloud disciplines",
      "Certification Support: Company-sponsored FinOps certifications",
      "Client Variety: Work with companies from startups to enterprises",
      "Financial Rewards: Performance bonuses tied to client cost savings"
    ]
  },
  "devops-intern": {
    title: "DevOps Intern",
    team: "Engineering",
    location: "Remote / Tel Aviv",
    type: "Internship",
    description: "Learn and contribute to DevOps practices",
    whoWeAre: "nirvahatech is a leading DevOps and cloud infrastructure consulting firm. Our internship program provides hands-on experience with modern DevOps tools and practices, mentored by senior engineers working on real production systems.",
    techStack: ["Linux", "Git", "Docker", "Kubernetes", "AWS", "Python", "Bash", "Terraform", "CI/CD", "Jenkins", "GitLab", "Monitoring tools"],
    whatYouDo: [
      "Assist in building and maintaining CI/CD pipelines",
      "Learn to deploy and manage containerized applications",
      "Contribute to infrastructure automation using Terraform",
      "Help with monitoring, logging, and alerting setup",
      "Document processes and create technical guides",
      "Participate in team meetings and learn from code reviews",
      "Work on assigned projects under mentorship of senior engineers"
    ],
    whatYouBring: [
      "Currently pursuing or recently completed degree in Computer Science or related field",
      "Basic understanding of Linux/Unix systems",
      "Familiarity with at least one programming language (Python, Go, or Java)",
      "Knowledge of version control (Git)",
      "Enthusiasm to learn cloud technologies and DevOps practices",
      "Strong problem-solving and communication skills",
      "Ability to commit to 3-6 month internship (full-time or part-time)"
    ],
    whyJoinUs: [
      "Real Experience: Work on actual production systems, not toy projects",
      "Mentorship: Paired with experienced DevOps engineers",
      "Learning Path: Structured training program covering core DevOps concepts",
      "Modern Stack: Exposure to industry-standard tools and practices",
      "Conversion Opportunity: High-performing interns may receive full-time offers",
      "Flexible Schedule: Work arrangements that accommodate academic schedules",
      "Stipend: Competitive compensation for internship level"
    ]
  }
};

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const job = jobsData[params.slug];

  if (!job) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link href="/careers" className="text-primary-600 hover:underline">
            Back to Careers
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

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

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Job Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/careers"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Positions
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-lg text-gray-600 mb-6">
              <span className="flex items-center gap-2">
                <MapPin size={20} className="text-primary-600" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={20} className="text-primary-600" />
                {job.type}
              </span>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              {job.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Who We Are */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {job.whoWeAre}
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {job.techStack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* What You'll Do */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What You&apos;ll Do</h2>
                <ul className="space-y-4">
                  {job.whatYouDo.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* What You Bring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Bring</h2>
                <ul className="space-y-4">
                  {job.whatYouBring.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Why Join Us */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Us</h2>
                <ul className="space-y-4">
                  {job.whyJoinUs.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        ★
                      </span>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Sidebar - Application Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200 p-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply for this Position</h3>
                  
                  {submitSuccess ? (
                    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Application Submitted!</h4>
                      <p className="text-sm text-gray-700">We&apos;ll review your application and get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-1">
                          First Name *
                        </label>
                        <input
                          {...register("firstName")}
                          type="text"
                          id="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-1">
                          Last Name *
                        </label>
                        <input
                          {...register("lastName")}
                          type="text"
                          id="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
                          Email *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1">
                          Phone *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-gray-900 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          {...register("linkedinUrl")}
                          type="url"
                          id="linkedinUrl"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                        {errors.linkedinUrl && (
                          <p className="mt-1 text-xs text-red-600">{errors.linkedinUrl.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="resume" className="block text-sm font-semibold text-gray-900 mb-1">
                          Resume/CV *
                        </label>
                        <input
                          {...register("resume")}
                          type="file"
                          id="resume"
                          accept=".pdf,.doc,.docx,.txt,.rtf"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <div className="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, RTF (Max 5MB)
                        </div>
                        {errors.resume && (
                          <p className="mt-1 text-xs text-red-600">{String(errors.resume.message || "Resume is required")}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="note" className="block text-sm font-semibold text-gray-900 mb-1">
                          Note
                        </label>
                        <textarea
                          {...register("note")}
                          id="note"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-sm"
                          placeholder="Tell us why you're interested..."
                        />
                      </div>

                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-800">{submitError}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-lg hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            Submit Application
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center text-gray-600">
                        Your information is confidential
                      </p>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

