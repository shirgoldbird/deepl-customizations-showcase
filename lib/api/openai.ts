import type {
  GenerateInstructionsRequest,
  GenerateInstructionsResponse,
  ApiError,
} from "@/types/api";

export async function generateInstructions(
  proxyUrl: string,
  request: GenerateInstructionsRequest
): Promise<GenerateInstructionsResponse> {
  try {
    // Configure based on spice level
    const spiceConfig = {
      normal: {
        temperature: 0.8,
        creativity: "moderately creative and engaging",
        funExamples: "Use dad jokes where appropriate, Add excitement with emojis, Make it sound like a pirate",
        businessExamples: "Use formal business terminology, Keep sentences concise and clear, Maintain a professional tone",
      },
      spicy: {
        temperature: 1.0,
        creativity: "very creative and unexpected",
        funExamples: "Translate as if you're a time-traveling Shakespeare, Add onomatopoeia and sound effects, Write like a fantasy novel narrator",
        businessExamples: "Use jargon-heavy corporate speak, Write like a management consultant, Add buzzwords and synergy",
      },
      nuclear: {
        temperature: 1.2,
        creativity: "wildly creative and absurd",
        funExamples: "Translate as if aliens are trying to learn human language, Add random medieval references, Write like a dramatic soap opera",
        businessExamples: "Use so much jargon it's barely comprehensible, Write like a robot pretending to be professional, Add ridiculous corporate metaphors",
      },
    };

    const level = request.spiceLevel || "normal";
    const config = spiceConfig[level];

    // Build the prompt for generating categorized custom instructions
    const prompt = `Generate 4 custom translation instructions that are ${config.creativity}. Generate 2 fun/creative instructions and 2 professional/business instructions.

Fun Instructions (2):
- Should be playful, creative, or quirky
- Examples for ${level} level: ${config.funExamples}

Business Instructions (2):
- Should be professional, formal, or practical
- Examples for ${level} level: ${config.businessExamples}

Each instruction should:
- Be unique and different from the others
- Match the ${level} creativity level
- Be practical and applicable to real translations
- Be maximum ${request.max_length} characters

Return ONLY a valid JSON array of objects with "category" and "instruction" fields. Example format:
[
  {"category": "fun", "instruction": "Use playful language and humor"},
  {"category": "fun", "instruction": "Add friendly emojis where appropriate"},
  {"category": "business", "instruction": "Maintain formal professional tone"},
  {"category": "business", "instruction": "Use industry-specific terminology"}
]`;

    // Use ChatGPT-style API format
    const chatRequest = {
      model: "gpt-4.1",
      temperature: config.temperature,
      max_tokens: 1000,
      top_p: 1,
      presence_penalty: 1,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    };

    const response = await fetch(`${proxyUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer not needed",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw {
        message: `OpenAI Proxy error: ${response.statusText}`,
        code: response.status,
        details: errorText,
      } as ApiError;
    }

    const data = await response.json();

    // Extract the instructions from the chat response
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the JSON array from the response
    let instructions: any[];
    try {
      instructions = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        instructions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse instructions from response");
      }
    }

    // Validate we got an array of objects with category and instruction
    if (!Array.isArray(instructions)) {
      throw new Error("Invalid response format: not an array");
    }

    // Ensure all items have category and instruction fields
    const validInstructions = instructions
      .filter((item) => item.category && item.instruction)
      .map((item) => ({
        category: item.category.toLowerCase() === "fun" ? "fun" : "business",
        instruction:
          item.instruction.length > request.max_length
            ? item.instruction.substring(0, request.max_length - 3) + "..."
            : item.instruction,
      }));

    if (validInstructions.length === 0) {
      throw new Error("No valid instructions in response");
    }

    return { instructions: validInstructions };
  } catch (error) {
    if ((error as ApiError).code) {
      throw error;
    }
    throw {
      message: `Network error: ${(error as Error).message}`,
      details: error,
    } as ApiError;
  }
}
