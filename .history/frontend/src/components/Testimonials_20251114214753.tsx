import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Nirvahatech transformed our infrastructure from a constant source of anxiety to our competitive advantage. Our deployment frequency went from once a month to multiple times per day.",
      name: "[INSERT YOUR TEXT HERE]",
      title: "[INSERT YOUR TEXT HERE]",
      company: "Tech Company A",
    },
    {
      quote:
        "The team didn't just fix our problems—they taught us how to prevent them. Six months later, we're running everything ourselves with confidence.",
      name: "[INSERT YOUR TEXT HERE]",
      title: "[INSERT YOUR TEXT HERE]",
      company: "Tech Company B",
    },
    {
      quote:
        "Our cloud costs dropped 60% while our reliability improved dramatically. The ROI was clear within the first quarter.",
      name: "[INSERT YOUR TEXT HERE]",
      title: "[INSERT YOUR TEXT HERE]",
      company: "Tech Company C",
    },
    {
      quote:
        "Finally, my engineers can focus on building features instead of firefighting infrastructure issues. It's been transformative.",
      name: "[INSERT YOUR TEXT HERE]",
      title: "[INSERT YOUR TEXT HERE]",
      company: "Tech Company D",
    },
  ];

  return (
    <section
      id="testimonials-section"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Join The Tech Leaders
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Who Have Already Transformed Their Infrastructure
        </p>

        {/* Featured Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-6">
                <Quote className="text-primary-600" size={24} />
              </div>
              <div className="mb-6">
                <div className="w-full aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center text-gray-500">
                  Video Testimonial Placeholder
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.title} • {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Carousel Placeholder */}
        <div className="mb-12 p-8 bg-white rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Proven Results
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">Downtime Before/After</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">Deployment Speed</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">Cost Reduction</span>
            </div>
          </div>
        </div>

        {/* Additional Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.slice(2).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-full aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center text-sm text-gray-500">
                Video
              </div>
              <p className="text-sm text-gray-700 mb-4 italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-600">{testimonial.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

