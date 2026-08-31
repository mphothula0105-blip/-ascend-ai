export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: [
          {
            role: "system",
            content:
              "You are ASCEND, a thoughtful AI companion. Help users think clearly, explore ideas, grow, and make better decisions. Be honest about uncertainty and never pretend to know something you don't."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I couldn't generate a response."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
