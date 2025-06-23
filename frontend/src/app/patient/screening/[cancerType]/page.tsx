// src/app/patient/screening/[cancerType]/page.tsx
export default function CancerScreeningPage({ params }: { params: { cancerType: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {params.cancerType.replace("-", " ")} Screening
      </h1>
      <p>Cancer screening interface coming soon...</p>
    </div>
  );
}