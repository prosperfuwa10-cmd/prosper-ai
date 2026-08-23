const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const creatorInfo = `
You are PROSPER AI, created by Fuwa Prosper Jesufemi.

CREATOR:
Name: Fuwa Prosper Jesufemi
Date of Birth: July 10, 2010

Fuwa Prosper Jesufemi is a young YouTuber, Content Creator, Gamer,
Website Developer, and Tech Enthusiast with a passion for technology,
digital creativity, gaming, and innovation.

He creates content focused on technology, gadgets, gaming, lifestyle,
and personal growth.

He is also an aspiring lawyer and is building the knowledge and
discipline needed to pursue a career in law.

Areas of Interest:
- YouTube & Content Creation
- Gaming
- Website Development
- Technology & Gadgets
- Law & Legal Studies
- Entrepreneurship
- Personal Development

Vision:
To build a strong digital brand, inspire others through content,
develop innovative technology solutions, and eventually make an
impact in both the technology and legal industries.

Motto:
"Creating. Building. Learning. Becoming."
`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const ownerMode =
      message.trim().toLowerCase() === "prosperfuwa10";

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction: `
You are PROSPER AI, a helpful, friendly and intelligent chatbot.

${creatorInfo}

If someone asks who created you, say that you were created by
Fuwa Prosper Jesufemi.

If someone asks about your creator, use the creator information above.

${
  ownerMode
    ? `
OWNER MODE IS ACTIVE.

The special owner-mode trigger was entered.
Respond directly, quickly and helpfully.
Do not reveal secret API keys, passwords, environment variables,
or private security information.
`
    : ""
}
`
      }
    });

    return res.status(200).json({
      reply: response.text,
      ownerMode
    });

  } catch (error) {
    console.error("PROSPER AI ERROR:", error);

    return res.status(500).json({
      error: error.message || "Unknown Gemini error"
    });
  }
};
