import { NextResponse } from "next/server";

const ML_MODEL_URL = process.env.ML_MODEL_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl, cancerType } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Send image to Python ML model
    const mlResponse = await fetch(`${ML_MODEL_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        cancer_type: cancerType,
      }),
    });

    if (!mlResponse.ok) {
      throw new Error("ML model request failed");
    }

    const mlResult = await mlResponse.json();

    // Format the result
    const analysisResult = {
      id: `analysis-${Date.now()}`,
      classification: mlResult.prediction,
      confidence: mlResult.confidence,
      status: "completed",
      additionalFindings: Array.isArray(mlResult.additionalFindings)
        ? mlResult.additionalFindings
        : generateRecommendations(mlResult.prediction, mlResult.confidence),
      resultImageUrl: mlResult.resultImageUrl,
      aiModelVersion: mlResult.modelVersion,
    };
    return NextResponse.json({
      success: true,
      result: analysisResult,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    // // Return error result
    // return NextResponse.json({
    //   success: false,
    //   result: {
    //     id: `error-${Date.now()}`,
    //     classification: "Error",
    //     confidence: 0,
    //     status: "error",
    //   },
    // });
  }
}

function generateRecommendations(prediction, confidence) {
  const recommendations = [];

  if (confidence < 0.7) {
    recommendations.push(
      "Low confidence score - consider additional imaging or expert consultation"
    );
  }

  if (prediction === "cat") {
    recommendations.push(
      "Classification indicates feline characteristics detected"
    );
    recommendations.push(
      "Consider consulting with veterinary specialist if this is unexpected"
    );
  } else {
    recommendations.push(
      "Classification indicates canine characteristics detected"
    );
    recommendations.push("Monitor for any changes and follow up as needed");
  }

  recommendations.push(
    "This is a simulated analysis for testing purposes only"
  );

  return recommendations;
}
