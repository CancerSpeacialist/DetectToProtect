import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cancerType = formData.get("cancerType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: `ct-scans/${cancerType}`,
            public_id: `${Date.now()}-${file.name.split(".")[0]}`,
            tags: ["ct-scan", cancerType, "medical-imaging"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const result = uploadResponse as any;

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
async function saveToFirebase(metadata: any) {
  // TODO: Implement Firebase save logic
  console.log("Saving to Firebase:", metadata);
  return true;
}
