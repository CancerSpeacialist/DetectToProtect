export default function CancerHeader({ cancerInfo }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{cancerInfo.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {cancerInfo.name} Screening
          </h1>
          <p className="text-gray-600">{cancerInfo.description}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <span>Screening</span> →{" "}
        <span className="text-gray-900">{cancerInfo.name}</span>
      </nav>
    </div>
  );
}
