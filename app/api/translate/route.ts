import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, ...translationRequest } = body;

    console.log("API Route - Received translation request:", translationRequest);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(translationRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `DeepL API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
