import { Resend } from "resend";
import { atualizarExcel } from "../lib/googleDrive.js";

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Metodo nao permitido" });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "RESEND_API_KEY nao existe no Vercel"
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = req.body?.data ?? "";
    const itens = req.body?.itens ?? [];
    const excel = req.body?.excel;

    if (!excel?.base64) {
      return res.status(400).json({
        error: "Arquivo Excel nao recebido"
      });
    }

    // 1. Atualiza Google Drive (MESMO arquivo sempre)
    const excelAtualizado = await atualizarExcel({
      data,
      itens,
      excel
    });

    const divergencias = itens.filter(
      (item) => Number(item.diferenca) !== 0
    );

    // 2. Envia email com Excel atualizado
    const result = await resend.emails.send({
      from: "Embalagens <onboarding@resend.dev>",
      to: "henrique.zandonab@gmail.com",
      subject: `Relatorio de Embalagens${data ? " - " + data : ""}`,
      html: `
        <h2>Relatorio de Embalagens</h2>
        <p><strong>Dia:</strong> ${data}</p>
        <p><strong>Total de itens:</strong> ${itens.length}</p>
        <p><strong>Divergencias:</strong> ${divergencias.length}</p>
        <p>O arquivo Excel foi atualizado no Google Drive e enviado anexado.</p>
      `,
     attachments: [
  {
    filename: "embalagens-cassia.xlsx",
    content: excelAtualizado,
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
]
    });

    return res.status(200).json({
  ok: true,
  email: result
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
