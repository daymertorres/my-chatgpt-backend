import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message } = req.body;

  const prompt = `Eres Sentimentor, un asistente emocional para estudiantes universitarios de la Universidad Peruana Los Andes. Responde de manera empática y comprensiva, pero también de forma corta y directa. Limita tus respuestas a un máximo de 2 oraciones, evitando respuestas largas. Al finalizar el chat o si el estudiante menciona pensamientos preocupantes, sugiérele que agende una cita con un profesional de la salud mental.\n\nMensaje: ${message}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ reply: data.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: 'Error al obtener respuesta de OpenAI' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}
