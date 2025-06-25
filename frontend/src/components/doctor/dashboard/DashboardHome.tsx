
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText, Clock } from "lucide-react";

export function DashboardHome() {
  const stats = [
    { title: "Total Patients", value: "1,247", icon: Users, color: "text-blue-600" },
    { title: "Today's Appointments", value: "18", icon: Calendar, color: "text-green-600" },
    { title: "Reports Generated", value: "342", icon: FileText, color: "text-purple-600" },
    { title: "Pending Reviews", value: "7", icon: Clock, color: "text-orange-600" },
  ];

  const recentActivity = [
    { action: "New patient registered", patient: "John Doe", time: "2 minutes ago", status: "new" },
    { action: "Image analysis completed", patient: "Sarah Wilson", time: "15 minutes ago", status: "completed" },
    { action: "Report generated", patient: "Mike Johnson", time: "1 hour ago", status: "completed" },
    { action: "Consultation scheduled", patient: "Emma Davis", time: "2 hours ago", status: "scheduled" },
    { action: "Diagnosis updated", patient: "Robert Brown", time: "3 hours ago", status: "updated" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Good Morning, Dr. Smith</h1>
        <p className="text-blue-100">Welcome back to your dashboard. You have 18 appointments scheduled for today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">Patient: {activity.patient}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={activity.status === 'new' ? 'default' : 
                            activity.status === 'completed' ? 'secondary' : 
                            activity.status === 'scheduled' ? 'outline' : 'default'}
                    className={activity.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
