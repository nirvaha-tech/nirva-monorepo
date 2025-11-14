import { AlertCircle, Activity, DollarSign, Shield } from "lucide-react";

export function About() {
  const symptoms = [
    "Your CI/CD pipeline feels like a house of cards, where a single wrong move can bring everything tumbling down.",
    "Scaling for traffic spikes is a manual, all-hands-on-deck panic session, a completely unsustainable model for growth.",
    "Your Kubernetes setup has become so complex that nobody on the team understands the whole thing anymore, creating dangerous knowledge silos.",
    "Developers are waiting days, not minutes, for new environments, killing their momentum and your product velocity.",
    "Your cloud bill is chaotic and unpredictable, with no real insight into what's driving costs, making budgeting an impossible guessing game.",
    "You suffered another production outage last night because a seemingly minor configuration change cascaded into a catastrophic failure.",
  ];

  return (
    <section id="about-section" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            From Infrastructure Chaos to Strategic Innovation
          </h2>
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-6 flex items-center justify-center">
            <Activity size={64} className="text-primary-600" />
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            If you&apos;re a CTO, VP of Engineering, or DevOps Manager,
            you know the feeling. Your best people, the engineers you hired to
            build the future, are stuck just keeping the lights on. They&apos;re
            trapped in a constant firefighting mode, patching leaks in a system
            that grows more complex and fragile every day.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            At <strong>nirvahatech</strong>, we were founded by engineers who
            lived this reality and knew there had to be a better way. We exist
            for one reason: to give you back your team&apos;s most valuable
            resource—their time and focus.
          </p>
        </div>

        {/* Symptoms Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="mr-3 text-red-600" size={32} />
            The Symptoms of an Unscalable System
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            Does any of this sound painfully familiar? You are not alone. These
            are the clear signals that your infrastructure is no longer an
            asset, but a bottleneck that is actively crushing your
            company&apos;s potential.
          </p>
          <div className="space-y-4">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-white rounded-lg border border-red-100 hover:border-red-300 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-4 flex-shrink-0"></div>
                <p className="text-gray-700">{symptom}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Playbook */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Proven Playbook for Cloud Reliability
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We don&apos;t just offer advice; we implement a proven system for
            transforming your infrastructure from the ground up. We start with a
            thorough <strong>Cloud Reliability Assessment</strong> to identify
            the core bottlenecks and risks that are holding you back.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From there, we systematically deploy our framework for DevOps
            automation and Kubernetes best practices. This isn&apos;t about
            guesswork. It&apos;s a methodical process of re-architecting your
            systems for resilience, efficiency, and scalability.
          </p>
        </div>

        {/* Strategic Partner */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            More Than a Vendor, We Are Your Strategic Partner
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Our ultimate goal is to make ourselves obsolete. We believe the most
            powerful infrastructure is one that your team can manage with
            confidence and ease. We build resilient systems by building
            resilient teams.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Deep-Dive Assessment</h4>
              <p className="text-sm opacity-90">
                We embed with your team to understand your technology, business
                goals, and people.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Activity className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Systematic Implementation</h4>
              <p className="text-sm opacity-90">
                Battle-tested frameworks for automation, observability, and
                security with quick wins.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <DollarSign className="mb-3" size={32} />
              <h4 className="font-semibold mb-2">Knowledge Transfer</h4>
              <p className="text-sm opacity-90">
                We pair-program, document everything, and run workshops for
                complete self-sufficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

