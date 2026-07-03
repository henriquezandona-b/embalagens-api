import { google } from "googleapis";
import XLSX from "xlsx";
import { Readable } from "stream";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

export async function atualizarExcel(diaAtual) {

  console.log("FILE ID:", process.env.GOOGLE_DRIVE_FILE_ID);

  console.log(
    "SERVICE ACCOUNT:",
    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT).client_email
  );

  const fileId = process.env.GOOGLE_DRIVE_FILE_ID;

  // Baixa o arquivo atual
  const arquivo = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
    }
  );

  const workbook = XLSX.read(Buffer.from(arquivo.data), {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const dados = XLSX.utils.sheet_to_json(sheet);

  diaAtual.itens.forEach((item) => {
    dados.push({
      Data: diaAtual.data,
      Item: item.item,
      Contagem: item.contagem,
      Nota: item.nota,
      Diferença: item.diferenca,
    });
  });

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(dados);

  const novoArquivo = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

 await drive.files.create({
  requestBody: {
    name: "TESTE.xlsx",
  },
  media: {
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: Readable.from(novoArquivo),
  },
});

  return novoArquivo;
}
