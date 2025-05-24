function FeatureCard({ icon: Icon, title, description, color, link }) {
  return (
    <div className="card h-full card-hover group">
      <div className="p-6">
        <div className={`${color} text-white p-3 rounded-lg inline-block`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-900 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-base text-gray-600">
          {description}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard