import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

export default async function handler(req, res) {

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

      subject:
      "Relatório de Embalagens",

      text:
      "Segue relatório automático.",


      attachments:[

        {

          filename:
          "relatorio.xlsx",

          content:
          arquivo

        }

      ]

    });


    res.status(200).json({

      sucesso:true

    });


  } catch(error){

    res.status(500).json({

      erro:error.message

    });

  }

}
