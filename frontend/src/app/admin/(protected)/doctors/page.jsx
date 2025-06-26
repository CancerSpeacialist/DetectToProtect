'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, UserCheck, UserX, Clock } from 'lucide-react'
import { getAllDoctors, getAllIncompleteDoctorProfiles, approveDoctorAccount, rejectDoctorAccount } from '@/lib/firebase/db'
import CreateDoctorForm from '@/components/admin/CreateDoctorForm'

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [incompleteDoctors, setIncompleteDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allDoctors, incompleteProfiles] = await Promise.all([
          getAllDoctors(),
          getAllIncompleteDoctorProfiles()
        ])
        setDoctors(allDoctors)
        setIncompleteDoctors(incompleteProfiles)
      } catch (error) {
        console.error('Error loading doctors data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshTrigger])

  const handleApproveDoctor = async (uid) => {
    try {
      await approveDoctorAccount(uid)
      setRefreshTrigger(prev => prev + 1) // Refresh data
    } catch (error) {
      console.error('Error approving doctor:', error)
    }
  }

  const handleRejectDoctor = async (uid) => {
    try {
      await rejectDoctorAccount(uid)
      setRefreshTrigger(prev => prev + 1) // Refresh data
    } catch (error) {
      console.error('Error rejecting doctor:', error)
    }
  }

  const approvedDoctors = doctors.filter(doc => doc.isApproved && doc.profileCompleted)
  const pendingDoctors = doctors.filter(doc => !doc.isApproved && doc.profileCompleted)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Doctor Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage doctor accounts, approvals, and profile completions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              Approved Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{approvedDoctors.length}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{pendingDoctors.length}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-600" />
              Incomplete Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{incompleteDoctors.length}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Total Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{doctors.length + incompleteDoctors.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Doctor</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingDoctors.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedDoctors.length})</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete ({incompleteDoctors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateDoctorForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctors Pending Approval</CardTitle>
              <CardDescription>
                Doctors who have completed their profiles and are awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDoctors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No doctors pending approval</p>
              ) : (
                <div className="space-y-4">
                  {pendingDoctors.map((doctor) => (
                    <div key={doctor.uid} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</h3>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          <p className="text-sm text-gray-600">License: {doctor.licenseNumber}</p>
                          <p className="text-sm text-gray-600">Hospital: {doctor.hospital}</p>
                          <p className="text-sm text-gray-600">Experience: {doctor.experience} years</p>
                        </div>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handleApproveDoctor(doctor.uid)}
                            className="w-full"
                            size="sm"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectDoctor(doctor.uid)}
                            variant="destructive"
                            className="w-full"
                            size="sm"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <strong className="text-sm">Cancer Specializations:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doctor.cancerSpecializations?.map((canspec) => (
                              <Badge key={canspec} variant="secondary" className="text-xs">
                                {canspec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-sm">Other Specializations:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doctor.specialization?.map((spec) => (
                              <Badge key={spec} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-sm">Qualifications:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doctor.qualifications?.map((qual) => (
                              <Badge key={qual} variant="outline" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Doctors</CardTitle>
              <CardDescription>
                Doctors who have been approved and can access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedDoctors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No approved doctors yet</p>
              ) : (
                <div className="space-y-4">
                  {approvedDoctors.map((doctor) => (
                    <div key={doctor.uid} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</h3>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          <p className="text-sm text-gray-600">{doctor.hospital}</p>
                          <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
                        </div>
                        <Badge className="bg-green-600">Approved</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomplete" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incomplete Profiles</CardTitle>
              <CardDescription>
                Doctors who have been created but haven't completed their profiles yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incompleteDoctors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">All doctor profiles are complete</p>
              ) : (
                <div className="space-y-4">
                  {incompleteDoctors.map((doctor) => (
                    <div key={doctor.uid} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</h3>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          <p className="text-sm text-gray-600">Created: {doctor.createdAt.toLocaleDateString()}</p>
                        </div>
                        <Badge variant="destructive">Profile Incomplete</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}