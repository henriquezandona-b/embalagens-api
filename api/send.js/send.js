import ExcelJS from "exceljs";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { historico } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Relatorio");

    sheet.columns = [
      { header: "DATA", key: "data" },
      { header: "ITEM", key: "item" },
      { header: "CONTAGEM", key: "contagem" },
      { header: "NOTA", key: "nota" },
      { header: "DIFERENÇA", key: "diferenca" }
    ];

    historico.forEach(dia => {
      dia.itens.forEach(i => {
        sheet.addRow({
          data: dia.data,
          item: i.item,
          contagem: i.contagem,
          nota: i.nota,
          diferenca: i.diferenca
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Relatório Embalagens",
      text: "Excel gerado automaticamente",
      attachments: [
        {
          filename: "historico.xlsx",
          content: buffer
        }
      ]
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
