import { Resend } from "resend";

export default async function handler(req, res) {

  try {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "RESEND_API_KEY não existe no Vercel"
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const itens = req.body?.itens ?? [];

    const result = await resend.emails.send({
      from: "Embalagens <onboarding@resend.dev>",
      to: "henrique.zandona@hyundai-brasil.com",
      subject: "Relatório de Embalagens",
      html: `<pre>${JSON.stringify(itens, null, 2)}</pre>`
    });

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });

  }
}
