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
  const fileId = process.env.GOOGLE_DRIVE_FILE_ID;

  // Baixa o arquivo existente
  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "arraybuffer",
    }
  );

  const workbook = XLSX.read(Buffer.from(response.data), {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const dados = XLSX.utils.sheet_to_json(sheet);

  for (const item of diaAtual.itens) {
    dados.push({
      Data: diaAtual.data,
      Item: item.item,
      Contagem: item.contagem,
      Nota: item.nota,
      Diferença: item.diferenca,
    });
  }

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(dados);

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  await drive.files.update({
    fileId,
    supportsAllDrives: true,
    media: {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      body: Readable.from(buffer),
    },
  });

  return buffer;
}
