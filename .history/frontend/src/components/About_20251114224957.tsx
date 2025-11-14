import { Activity, DollarSign, Shield } from "lucide-react";

export function About() {
  return (
    <section id="about-section" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            From Firefighting to Innovation
          </h2>
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-6 flex items-center justify-center">
            <Activity size={64} className="text-primary-600" />
          </div>
          <p className="text-xl text-gray-900 font-semibold mb-4">
            Your engineers should build the future—not just keep the lights on.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At <strong>nirvahatech</strong>, we&apos;re engineers who lived this pain.
            We exist for one reason: <strong>give you back your team&apos;s time and focus.</strong>
          </p>
        </div>

        {/* Our Playbook */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Our Proven Approach
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-primary-600 font-bold text-lg mb-2">
                1. Assess
              </div>
              <p className="text-gray-700">
                Deep-dive into your infrastructure. Identify critical bottlenecks and risks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-primary-600 font-bold text-lg mb-2">
                2. Transform
              </div>
              <p className="text-gray-700">
                Deploy battle-tested DevOps and Kubernetes frameworks. No guesswork.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-primary-600 font-bold text-lg mb-2">
                3. Empower
              </div>
              <p className="text-gray-700">
                Transfer knowledge. Your team owns the system with confidence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-primary-600 font-bold text-lg mb-2">
                4. Scale
              </div>
              <p className="text-gray-700">
                Systems that grow with you. Resilient, efficient, ready for anything.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Partner */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Strategic Partners, Not Just Vendors
          </h3>
          <p className="text-xl mb-8 font-semibold">
            Our goal? Make ourselves obsolete. Your team should own the system.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Embed & Assess</h4>
              <p className="text-sm opacity-90">
                Understand your tech, goals, and team dynamics.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Activity className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Implement Fast</h4>
              <p className="text-sm opacity-90">
                Battle-tested frameworks. Quick wins. Lasting results.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <DollarSign className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Transfer Knowledge</h4>
              <p className="text-sm opacity-90">
                Pair-program, document, train. Complete self-sufficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

