import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

function DoctorApprovalPending({ user, signOut }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center ring-4 ring-amber-50">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Account Under Review
            </CardTitle>
            <CardDescription className="text-base text-slate-600 mt-2">
              Thank you for completing your profile, Dr. {user.firstName}. Your
              account is currently under admin review.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Profile Status</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  Completed
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Approval Status</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Pending
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                💡 What happens next?
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Our admin team will review your credentials and approve your account within 24-48 hours.
              </p>
            </div>
            
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full h-11 font-medium border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DoctorApprovalPending;