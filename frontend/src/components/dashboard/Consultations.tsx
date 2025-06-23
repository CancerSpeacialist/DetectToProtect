
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar as CalendarIcon, Clock, User } from "lucide-react";

export function Consultations() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const todayAppointments = [
    { 
      id: 1, 
      patient: 'John Doe', 
      time: '09:00 AM', 
      type: 'Follow-up', 
      status: 'scheduled',
      duration: '30 min'
    },
    { 
      id: 2, 
      patient: 'Sarah Wilson', 
      time: '10:30 AM', 
      type: 'Consultation', 
      status: 'in-progress',
      duration: '45 min'
    },
    { 
      id: 3, 
      patient: 'Mike Johnson', 
      time: '02:00 PM', 
      type: 'Check-up', 
      status: 'scheduled',
      duration: '30 min'
    },
    { 
      id: 4, 
      patient: 'Emma Davis', 
      time: '03:30 PM', 
      type: 'Consultation', 
      status: 'scheduled',
      duration: '60 min'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Video className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Clock className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-sm font-medium">{appointment.time}</span>
                        <span className="text-xs text-gray-500">{appointment.duration}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{appointment.patient}</span>
                        </div>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ')}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 gap-2"
                        disabled={appointment.status !== 'scheduled' && appointment.status !== 'in-progress'}
                      >
                        <Video className="w-4 h-4" />
                        {appointment.status === 'in-progress' ? 'Join Call' : 'Start Call'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add consultation notes, observations, and follow-up instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">{notes.length}/500 characters</p>
                <div className="flex gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Notes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                <Video className="w-4 h-4" />
                Start Instant Meeting
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <CalendarIcon className="w-4 h-4" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <User className="w-4 h-4" />
                Patient Directory
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Consultations</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Duration</span>
                <span className="font-semibold">35 min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
