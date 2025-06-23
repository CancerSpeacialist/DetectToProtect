'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, Activity, Database, Settings } from 'lucide-react'
import { getAllPatients, getAllDoctors } from '@/lib/firebase/db'
import { PatientProfile, DoctorProfile } from '@/lib/types/auth'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          getAllPatients(),
          getAllDoctors()
        ])
        setPatients(patientsData)
        setDoctors(doctorsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === 'admin') {
      loadData()
    }
  }, [user])

  const approvedDoctors = doctors.filter(doc => doc.isApproved)
  const pendingDoctors = doctors.filter(doc => !doc.isApproved)
  const verifiedPatients = patients.filter(patient => patient.isVerified)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back, {user?.firstName}! Current time: {new Date().toLocaleString()}
          </p>
        </div>
        <Badge variant="destructive" className="text-sm px-3 py-1">
          ADMIN ACCESS
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{patients.length}</div>
            <p className="text-xs text-blue-600">
              {verifiedPatients.length} verified
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{approvedDoctors.length}</div>
            <p className="text-xs text-green-600">
              Approved and active
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{pendingDoctors.length}</div>
            <p className="text-xs text-orange-600">
              Doctor applications
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">98.5%</div>
            <p className="text-xs text-purple-600">
              Uptime this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage patients, doctors, and system users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Patients
              </Button>
              <Button className="w-full" variant="outline">
                <UserCheck className="w-4 h-4 mr-2" />
                Approve Doctors
              </Button>
            </div>
            <Button className="w-full">
              Create Doctor Account
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Operations</CardTitle>
            <CardDescription>
              Monitor and maintain system operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Database Status
              </Button>
              <Button className="w-full" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                System Logs
              </Button>
            </div>
            <Button className="w-full" variant="secondary">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system events and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">New patient registration</p>
                <p className="text-sm text-gray-600">John Doe registered 5 minutes ago</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Doctor application submitted</p>
                <p className="text-sm text-gray-600">Dr. Sarah Wilson submitted credentials</p>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">System backup completed</p>
                <p className="text-sm text-gray-600">Daily backup completed successfully</p>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}