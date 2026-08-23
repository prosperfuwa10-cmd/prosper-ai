const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const creatorInfo = `
The creator of PROSPER AI is Fuwa Prosper Jesufemi.

Date of Birth: July 10, 2010.

Fuwa Prosper Jesufemi is a young YouTuber, Content Creator, Gamer,
Website Developer, and Tech Enthusiast. He is passionate about
technology, digital creativity, gaming, innovation, content creation,
lifestyle, personal growth, entrepreneurship, and law.

He is also an aspiring lawyer and is developing the knowledge and
discipline needed to pursue a career in law.

His vision is to build a strong digital brand, inspire others through
content, develop innovative technology solutions, and eventually make
an impact in both technology and the legal industry.

His motto is:
"Creating. Building. Learning. Becoming."
`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ownerMode = message.trim().toLowerCase() === "prosperfuwa10";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are PROSPER AI, a helpful, intelligent and friendly AI chatbot.

${creatorInfo}

You know who created you and should answer questions about your creator
using the information above.

If someone asks "Who created you?", explain that you were created by
Fuwa Prosper Jesufemi.

${ownerMode ? `
OWNER MODE IS ACTIVE.
Respond quickly and recognize that the person has activated Owner Mode.
Be especially direct and helpful.
` : ""}

User message:
${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return res.status(200).json({
      reply: response,
      ownerMode
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "PROSPER AI could not respond right now."
    });
  }
};
