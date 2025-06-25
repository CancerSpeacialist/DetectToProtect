'use client'

import { PatientManagement } from '@/components/doctor/dashboard/PatientManagement'

export default function DoctorDashboard() {

  return (
    <div className="space-y-6">
      <PatientManagement />
    </div>
  )
}