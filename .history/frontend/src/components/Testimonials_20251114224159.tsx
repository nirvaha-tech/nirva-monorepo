import { Quote, User } from "lucide-react";

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
  ];

  return (
    <section
      id="testimonials-section"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Trusted by the Innovators
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          We don&apos;t just build infrastructure; we build partnerships. Here&apos;s what leaders from fast-growing startups are saying about working with nirvahatech.
        </p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start justify-start mb-6">
                <Quote className="text-primary-600 opacity-50" size={32} />
              </div>
              
              <p className="text-gray-700 leading-relaxed flex-grow">
                {testimonial.quote}
              </p>
              
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                    <User className="text-white" size={32} />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.title}
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

