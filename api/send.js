import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { itens } = req.body;

    await resend.emails.send({
      from: "Embalagens <onboarding@resend.dev>",
      to: "cassia@empresa.com",
      subject: "Relatório de Embalagens",
      html: `
        <h2>Relatório</h2>
        <pre>${JSON.stringify(itens, null, 2)}</pre>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
}
