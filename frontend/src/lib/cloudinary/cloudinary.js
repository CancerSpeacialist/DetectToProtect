
export async function uploadScreeningImageToCloudinary({ file, cancerType, abortController }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", `medical_scans/${cancerType}`);

  try {
    const response = await fetch("/api/uploadImageToCloudinary", {
      method: "POST",
      body: formData,
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error("Upload failed");

    const result = await response.json();

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}


export async function uploadScreeningPdfToCloudinary({ pdfBlob, cancerType, abortController }) {
  const formData = new FormData();
  formData.append("file", pdfBlob, `screening-report-${cancerType}.pdf`);
  formData.append("folder", `medical_reports/${cancerType}`);

  try {
    const response = await fetch("/api/uploadPdfToCloudinary", {
      method: "POST",
      body: formData,
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error("PDF upload failed");

    const result = await response.json();

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary PDF upload error:", error);
    throw new Error("Failed to upload PDF");
  }
}