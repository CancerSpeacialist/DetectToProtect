import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Upload, Loader2, Brain } from "lucide-react";
import { useRef } from "react";

export default function ImageUploadBox({
  screeningForm,
  setScreeningForm,
  processing,
  uploadProgress,
  handleAnalyze,
  handleCancel,
  handleFileSelect,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Medical Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload
          onFileSelect={handleFileSelect}
          screeningForm={screeningForm}
          setScreeningForm={setScreeningForm}
          selectedFile={screeningForm.selectedFile}
          disabled={processing}
          uploadProgress={uploadProgress}
          isUploading={processing}
          onCancel={handleCancel}
          error={null}
        />
        {/* Show preview and analyze button if file is selected */}
        {screeningForm.selectedFile && (
          <Button
            onClick={handleAnalyze}
            disabled={processing}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
