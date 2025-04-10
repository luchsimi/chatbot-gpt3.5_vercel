export default async function handler(req, res) {
  let message;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    message = body.message;
    if (!message) throw new Error("Mensaje vacío");
  } catch (error) {
    return res.status(400).json({ reply: "Error: El cuerpo de la petición no es válido." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente profesional y amable de soporte técnico." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí la pregunta.";
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Error al conectar con OpenAI." });
  }
}