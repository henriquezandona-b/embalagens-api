import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

export default async function handler(req, res) {

  // Libera acesso externo (Hoppscotch/site)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Responde o preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }


  if (req.method !== "POST") {
    return res.status(405).json({
      erro: "Método não permitido"
    });
  }


  try {

    const { itens } = req.body;


    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Relatório");


    sheet.columns = [
      {
        header: "Item",
        key: "item"
      },
      {
        header: "Quantidade",
        key: "quantidade"
      }
    ];


    itens.forEach(item => {

      sheet.addRow({
        item: item.nome,
        quantidade: item.quantidade
      });

    });


    const arquivo =
      await workbook.xlsx.writeBuffer();


    const transporter =
      nodemailer.createTransport({

        service: "outlook",

        auth: {

          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS

        }

      });


    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "Relatório de Embalagens",

      text: "Segue relatório.",

      attachments: [
        {
          filename: "relatorio.xlsx",
          content: arquivo
        }
      ]

    });


    return res.status(200).json({
      sucesso: true
    });


  } catch(error) {

    return res.status(500).json({
      erro: error.message
    });

  }

}
