import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {

    const itens = req.body?.itens ?? [];

    const result = await resend.emails.send({
      from: "Embalagens <onboarding@resend.dev>",
      to: "cassia@empresa.com",
      subject: "Relatório de Embalagens",
      html: `<pre>${JSON.stringify(itens, null, 2)}</pre>`
    });

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
}
