import { NextResponse } from "next/server";

// This runs on the server
export async function POST(request) {
  try {
    console.log("Starting PDF upload process...");

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      console.log("No file provided in form data");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: buffer.length,
    });

    // Prepare Cloudinary direct API upload
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([buffer], { type: "application/pdf" }), file.name);
    uploadForm.append("upload_preset", uploadPreset);
    uploadForm.append("folder", "medical-reports"); // Optional
    uploadForm.append("public_id", `report_${Date.now()}`);

    const cloudRes = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadForm,
    });

    const result = await cloudRes.json();

    if (!cloudRes.ok) {
      console.error("Cloudinary REST API error:", result);
      return NextResponse.json(
        { error: "Failed to upload PDF", details: result.error?.message || "Unknown error" },
        { status: 500 }
      );
    }

    console.log("Cloudinary upload success:", result.secure_url);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      message: "PDF uploaded successfully",
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF", details: error.message },
      { status: 500 }
    );
  }
}
