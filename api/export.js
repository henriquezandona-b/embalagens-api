import { supabase } from "../lib/supabase.js";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("conferencias")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json(error);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Embalagens");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Data", key: "data", width: 20 },
      { header: "Item", key: "item", width: 40 },
      { header: "Contagem", key: "contagem", width: 15 },
      { header: "Nota", key: "nota", width: 15 },
      { header: "Diferenca", key: "diferenca", width: 15 },
    ];

    data.forEach((row) => {
      sheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=embalagens.xlsx"
    );

    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
