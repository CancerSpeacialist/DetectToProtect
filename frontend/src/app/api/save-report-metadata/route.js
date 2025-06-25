import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Save report metadata to Firebase
    await saveReportMetadataToFirebase(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving report metadata:", error);
    return NextResponse.json(
      { error: "Failed to save report metadata" },
      { status: 500 }
    );
  }
}

async function saveReportMetadataToFirebase(data) {
  console.log("Saving report metadata to Firebase:", data);
  return true;
}
