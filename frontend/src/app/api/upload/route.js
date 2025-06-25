import { NextResponse } from "next/server";
import { uploadScreeningImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const cancerType = formData.get("cancerType");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (moved to lib)
    const result = await uploadScreeningImageToCloudinary({
      buffer,
      fileName: file.name,
      cancerType,
      file,
    });

    // Store metadata in Firebase (we'll create this function next)
    const metadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cancerType,
      uploadedAt: new Date().toISOString(),
      cloudinaryId: result.public_id,
      imageUrl: result.secure_url,
      patientId: "patient-123", // This should come from authentication
    };

    // Save to Firebase
    await saveToFirebase(metadata);

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      metadata,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Dummy Firebase save function (we'll implement this properly later)
async function saveToFirebase(metadata) {
  // TODO: Implement Firebase save logic
  console.log("Saving to Firebase:", metadata);
  return true;
}