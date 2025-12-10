import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const detailed = searchParams.get("detailed") || "true";
    const page = searchParams.get("page") || "0";
    const pageSize = searchParams.get("page_size") || "25";

    const params = new URLSearchParams({
      detailed,
      page,
      page_size: pageSize,
    });

    const response = await fetch(
      `https://api.deepl.com/v3/style_rules?${params}`,
      {
        method: "GET",
        headers: {
          "Authorization": `DeepL-Auth-Key ${apiKey}`,
        },
      }
    );

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
    console.error("Style rules API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
