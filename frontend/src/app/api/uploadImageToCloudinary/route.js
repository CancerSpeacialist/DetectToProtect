import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Upload failed");

    const result = await response.json();
    return NextResponse.json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}