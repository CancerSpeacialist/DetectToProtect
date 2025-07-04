import { generatePDFReport } from "@/components/doctor/screening/pdf-generator";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { inputImageUrl, resultImageUrl, aiResults, cancerType, patient, appointment, doctor } = body;

    // Make resultImageUrl optional since it might not always exist
    if (!inputImageUrl || !aiResults || !cancerType || !patient || !appointment) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const pdfBytes = await generatePDFReport({
      inputImageUrl,
      resultImageUrl: resultImageUrl || "",
      aiResults,
      cancerType,
      patient,
      appointment,
      doctor,
    });

    // Return PDF as binary data that can be converted to Blob on client
    return new Response(pdfBytes, {
        status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=screening-report.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF report" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}