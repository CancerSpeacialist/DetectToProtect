import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickTemplates({ setDiagnosis }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start text-left"
          onClick={() =>
            setDiagnosis(
              "Based on the AI analysis and clinical evaluation, the findings suggest..."
            )
          }
        >
          General Assessment
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-left"
          onClick={() =>
            setDiagnosis(
              "Follow-up screening recommended. Continue monitoring..."
            )
          }
        >
          Follow-up Required
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-left"
          onClick={() =>
            setDiagnosis(
              "No significant abnormalities detected. Routine screening schedule recommended..."
            )
          }
        >
          Normal Results
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-left"
          onClick={() =>
            setDiagnosis(
              "Abnormal findings require immediate attention. Refer to specialist..."
            )
          }
        >
          Abnormal Findings
        </Button>
      </CardContent>
    </Card>
  );
}
