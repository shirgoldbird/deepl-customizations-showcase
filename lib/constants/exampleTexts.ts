export interface ExampleText {
  id: string;
  category: "business" | "casual" | "technical" | "creative";
  text: string;
}

export const EXAMPLE_TEXTS: ExampleText[] = [
  {
    id: "business-1",
    category: "business",
    text: "We are pleased to announce our Q4 earnings exceeded expectations. Our revenue grew 25% year-over-year, driven by strong performance in our enterprise segment.",
  },
  {
    id: "casual-1",
    category: "casual",
    text: "Hey! Just wanted to let you know the party is this Saturday at 8pm. Bring your favorite snacks and we'll have a great time!",
  },
  {
    id: "technical-1",
    category: "technical",
    text: "The API endpoint accepts POST requests with a JSON payload. Authentication is required via the Authorization header using Bearer token format.",
  },
  {
    id: "creative-1",
    category: "creative",
    text: "As the sun dipped below the horizon, painting the sky in shades of amber and rose, she realized this was just the beginning of her journey.",
  },
  {
    id: "business-2",
    category: "business",
    text: "Please review the attached proposal and provide your feedback by end of day Friday. We need to finalize the contract before the board meeting next week.",
  },
  {
    id: "casual-2",
    category: "casual",
    text: "Can't believe how fast this year went by! Looking forward to catching up with you soon. Let me know when you're free for coffee.",
  },
  {
    id: "technical-2",
    category: "technical",
    text: "The application implements a microservices architecture with containerized deployments. Each service communicates via RESTful APIs with JWT authentication.",
  },
  {
    id: "creative-2",
    category: "creative",
    text: "The old bookstore stood quietly at the corner, its windows filled with stories waiting to be discovered by curious souls passing by.",
  },
];

export const getCategoryLabel = (category: ExampleText["category"]): string => {
  const labels = {
    business: "Business",
    casual: "Casual",
    technical: "Technical",
    creative: "Creative",
  };
  return labels[category];
};
