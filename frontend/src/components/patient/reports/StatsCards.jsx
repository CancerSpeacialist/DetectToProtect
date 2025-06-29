import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Activity } from "lucide-react";

export default function StatsCards({ stats }) {
  const statsConfig = [
    {
      title: "Total Reports",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-600"
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-600"
    },
    {
      title: "Cancer Results",
      value: stats.Cancer,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-600"
    },
    {
      title: "No Cancer Results",
      value: stats.noCancer,
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color === 'text-red-600' ? 'text-red-600' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <IconComponent className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}