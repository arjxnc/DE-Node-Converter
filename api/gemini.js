export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  try {
    const body = req.body; // what the browser sends
    const gen_model = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${gen_model}:generateContent?key=${apiKey}`;

    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("Gemini error:", upstream.status, text);
      return res
        .status(500)
        .json({ error: "Gemini API error", status: upstream.status, details: text });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: "Server error", message: String(err) });
  }
}
