import { google } from "googleapis";
import XLSX from "xlsx";

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

  // Baixa o arquivo atual
  const arquivo = await drive.files.get(
    {
      fileId,
      alt: "media"
    },
    {
      responseType: "arraybuffer"
    }
  );

  const workbook = XLSX.read(Buffer.from(arquivo.data), {
    type: "buffer"
  });

  let sheetName = workbook.SheetNames[0];

  let sheet = workbook.Sheets[sheetName];

  let dados = XLSX.utils.sheet_to_json(sheet);

  // adiciona as novas linhas
  diaAtual.itens.forEach(item => {

    dados.push({
      Data: diaAtual.data,
      Item: item.item,
      Contagem: item.contagem,
      Nota: item.nota,
      Diferença: item.diferenca
    });

  });

  const novaSheet = XLSX.utils.json_to_sheet(dados);

  workbook.Sheets[sheetName] = novaSheet;

  const novoArquivo = XLSX.write(workbook,{
    type:"buffer",
    bookType:"xlsx"
  });

  // envia novamente para o Drive
  await drive.files.update({

    fileId,

    media:{
      mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      body:Buffer.from(novoArquivo)
    }

  });

  return novoArquivo;

}