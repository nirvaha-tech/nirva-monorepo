export function Stats() {
  const stats = [
    {
      value: "99.99%",
      label: "Uptime Achieved",
      description: "Industry-leading reliability",
    },
    {
      value: "10x",
      label: "Faster Deployments",
      description: "From days to hours",
    },
    {
      value: "60%",
      label: "Cost Reduction",
      description: "Optimized cloud spending",
    },
    {
      value: "24/7",
      label: "Monitoring & Support",
      description: "Always watching your systems",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          The Tangible Results of True Cloud Reliability
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-5xl md:text-6xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

