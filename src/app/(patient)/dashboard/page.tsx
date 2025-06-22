'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PatientDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to monitor your health with AI-powered cancer detection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🧠 Brain Cancer</CardTitle>
            <CardDescription>Upload MRI/CT scans</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload Scan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🫁 Lung Cancer</CardTitle>
            <CardDescription>Chest X-ray analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload X-ray</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎗️ Breast Cancer</CardTitle>
            <CardDescription>Mammography screening</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload Mammogram</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}